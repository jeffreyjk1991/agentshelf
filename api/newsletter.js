import {createHash,randomBytes} from 'node:crypto';
import {database,respond,validateRequest} from '../lib/api.mjs';
import {rate} from '../lib/marketplace.mjs';
const token=()=>randomBytes(32).toString('base64url');
const hash=v=>createHash('sha256').update(v).digest('hex');
const validToken=v=>typeof v==='string'&&/^[A-Za-z0-9_-]{43}$/.test(v);
export function normalizeNewsletter(body){
 if(!body||typeof body!=='object'||Array.isArray(body))throw Error('Invalid request.');
 const action=body.action||'subscribe';
 if(['confirm','withdraw','unsubscribe'].includes(action)){
  if(!validToken(body.token))throw Error('Invalid or expired link.');
  return {action,token:body.token};
 }
 if(action!=='subscribe'||body.consent!==true||typeof body.email!=='string')throw Error('Enter your email and choose Subscribe.');
 const email=body.email.trim().toLowerCase();
 if(email.length>254||email.length<3||!/^[-a-z0-9.!#$%&'*+/=?^_`{|}~]+@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,63}$/.test(email)||email.split('@')[0].length>64||email.includes('..'))throw Error('Enter a valid email address.');
 return {action,email};
}
export function createNewsletterHandler({getDatabase=database,limit=rate,env=process.env}={}){
 return async(req,res)=>{
  const bad=validateRequest(req);if(bad)return respond(res,...bad);
  if(env.VERCEL_ENV!=='production'||!['aibin.me','www.aibin.me'].includes(req.headers.host))return respond(res,503,'Newsletter requests are only available on the live site.');
  let data;try{data=normalizeNewsletter(typeof req.body==='string'?JSON.parse(req.body):req.body);}catch(e){return respond(res,400,e.message);}
  try{
   const sql=await getDatabase();
   if(!await limit(sql,'newsletter-'+data.action,data.action==='subscribe'?20:60))return respond(res,429,'Please try again shortly.');
   if(data.action!=='subscribe'){
    const h=hash(data.token);
    if(data.action==='confirm'){
     const rows=await sql`UPDATE newsletter_subscribers SET status='confirmed',confirmed_at=now(),confirm_hash=NULL,confirm_expires=NULL WHERE status='pending' AND confirm_hash=${h} AND confirm_expires>now() RETURNING status`;
     return respond(res,rows.length?200:400,rows.length?'Email confirmed. You are subscribed to AIBin Weekly.':'This confirmation link is invalid or expired.');
    }
    const rows=await sql`UPDATE newsletter_subscribers SET status='unsubscribed',unsubscribed_at=now(),confirmed_at=NULL,confirm_hash=NULL,confirm_expires=NULL,withdraw_hash=NULL,unsubscribe_hash=NULL WHERE status IN ('pending','confirmed','subscribed') AND (withdraw_hash=${h} OR unsubscribe_hash=${h}) RETURNING status`;
    return respond(res,200,'Subscription request canceled if the link was valid.');
   }
   const withdraw=token();
   // Single opt-in: the visitor explicitly requests the newsletter by clicking Subscribe.
   // Do not silently activate old pending records; only a fresh request can subscribe them.
   const rows=await sql`INSERT INTO newsletter_subscribers(email,status,consent_at,withdraw_hash) VALUES (${data.email},'subscribed',now(),${hash(withdraw)})
    ON CONFLICT(email) DO UPDATE SET status='subscribed',consent_at=now(),confirmed_at=NULL,unsubscribed_at=NULL,withdraw_hash=EXCLUDED.withdraw_hash,confirm_hash=NULL,confirm_expires=NULL,unsubscribe_hash=NULL WHERE newsletter_subscribers.status IN ('pending','unsubscribed') RETURNING status`;
   // Already subscribed addresses are unchanged. Do not issue a new cancellation credential for them.
   return respond(res,200,'Thanks! You’re on the list.',rows.length?{withdrawToken:withdraw}:{});

  }catch{return respond(res,503,'Newsletter temporarily unavailable. Please try again later.');}
 };
}
export default createNewsletterHandler();
