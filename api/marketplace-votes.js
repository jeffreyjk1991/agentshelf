import {respond} from '../lib/api.mjs';
// Voting has been retired. No vote reads or writes are performed.
export default function handler(req,res){return respond(res,410,'Voting is no longer available.');}
