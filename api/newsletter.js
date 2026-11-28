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
 if(action!=='subscribe'||body.consent!==true||typeof body.email!=='string')throw Error('Enter your email and agree to receive AIBin Weekly.');
 const email=body.email.trim().toLowerCase();
 if(email.length>254||email.length<3||!/^[-a-z0-9.!#$%&'*+/=?^_`{|}~]+@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,63}$/.test(email)||email.split('@')[0].length>64||email.includes('..'))throw Error('Enter a valid email address.');
 return {action,email};
}
function configured(env){return Boolean(env.AIBIN_RESEND_API_KEY&&/^[-\w.+]+@news\.aibin\.me$/.test(env.AIBIN_NEWSLETTER_FROM||''));}
const base='https://www.aibin.me/newsletter';
async function sendConfirmation(email,confirm,unsubscribe,env,fetcher){
 const confirmUrl=base+'#confirm='+confirm,unsubUrl=base+'#unsubscribe='+unsubscribe;
 const r=await fetcher('https://api.resend.com/emails',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+env.AIBIN_RESEND_API_KEY},body:JSON.stringify({from:'AIBin Weekly <'+env.AIBIN_NEWSLETTER_FROM+'>',to:[email],subject:'Confirm your AIBin Weekly subscription',text:'Thanks for requesting AIBin Weekly. Confirm your email: '+confirmUrl+'\n\nIf you did not request this, ignore it or cancel: '+unsubUrl+'\n\nNo newsletter is sent unless you confirm.'}),signal:AbortSignal.timeout(8000)});
 return r.ok;
}
export function createNewsletterHandler({getDatabase=database,limit=rate,env=process.env,fetcher=fetch}={}){
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
    const rows=await sql`UPDATE newsletter_subscribers SET status='unsubscribed',unsubscribed_at=now(),confirmed_at=NULL,confirm_hash=NULL,confirm_expires=NULL,withdraw_hash=NULL,unsubscribe_hash=NULL WHERE status IN ('pending','confirmed') AND (withdraw_hash=${h} OR unsubscribe_hash=${h}) RETURNING status`;
    return respond(res,200,'Subscription request canceled if the link was valid.');
   }
   const withdraw=token(),confirm=token(),unsubscribe=token(),canSend=configured(env);
   const rows=await sql`INSERT INTO newsletter_subscribers(email,status,consent_at,withdraw_hash,confirm_hash,confirm_expires,unsubscribe_hash,last_email_attempt) VALUES (${data.email},'pending',now(),${hash(withdraw)},${canSend?hash(confirm):null},${canSend?new Date(Date.now()+48*3600000).toISOString():null},${hash(unsubscribe)},${canSend?new Date().toISOString():null})
    ON CONFLICT(email) DO UPDATE SET status='pending',consent_at=now(),confirmed_at=NULL,unsubscribed_at=NULL,withdraw_hash=EXCLUDED.withdraw_hash,confirm_hash=EXCLUDED.confirm_hash,confirm_expires=EXCLUDED.confirm_expires,unsubscribe_hash=EXCLUDED.unsubscribe_hash,last_email_attempt=EXCLUDED.last_email_attempt WHERE newsletter_subscribers.status='unsubscribed' RETURNING status`;
   // For a previously pending request, retry only after a 24-hour cooldown.
   // Never disclose whether the address is already registered or replace an existing withdrawal token.
   let send=canSend&&rows.length>0;
   if(canSend&&!rows.length){
    const retry=await sql`UPDATE newsletter_subscribers SET confirm_hash=${hash(confirm)},confirm_expires=now()+interval '48 hours',unsubscribe_hash=${hash(unsubscribe)},last_email_attempt=now() WHERE email=${data.email} AND status='pending' AND (last_email_attempt IS NULL OR last_email_attempt<now()-interval '24 hours') RETURNING status`;
    send=retry.length>0;
   }
   if(send)try{await sendConfirmation(data.email,confirm,unsubscribe,env,fetcher);}catch{}
   // Uniform response shape, including an unguessable token for duplicate requests.
   return respond(res,200,canSend?'Request received. If confirmation is available, check your inbox. You will not receive weekly emails until you confirm.':'Signup request received. Email delivery is not yet available; no weekly emails will be sent until you confirm.',{withdrawToken:withdraw});
  }catch{return respond(res,503,'Newsletter temporarily unavailable. Please try again later.');}
 };
}
export default createNewsletterHandler();
