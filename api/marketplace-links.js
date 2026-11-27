import {respond} from '../lib/api.mjs';
// Retired legacy submission route. Use the unified submission form instead.
export default function handler(req,res){return respond(res,410,'Use the unified agent submission page at /community.');}
