import {requireAuth,json} from './_auth.js';
export async function onRequestPost({request,env}){
  if(!await requireAuth(request,env))return json({ok:false,error:'Yetkisiz.'},401);
  const {key}=await request.json();if(!key||!key.startsWith('gallery/'))return json({ok:false,error:'Geçersiz fotoğraf.'},400);
  await env.GALLERY_BUCKET.delete(key);return json({ok:true});
}
