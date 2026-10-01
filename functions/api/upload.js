import {requireAuth,json} from './_auth.js';
export async function onRequestPost({request,env}){
  if(!await requireAuth(request,env))return json({ok:false,error:'Yetkisiz.'},401);
  if(!env.GALLERY_BUCKET)return json({ok:false,error:'Galeri depolaması henüz bağlanmadı.'},500);
  const form=await request.formData();const file=form.get('photo');
  if(!(file instanceof File)||!file.type.startsWith('image/'))return json({ok:false,error:'Lütfen bir görsel seçin.'},400);
  if(file.size>10*1024*1024)return json({ok:false,error:'Dosya 10 MB\'dan küçük olmalı.'},400);
  const ext=(file.name.split('.').pop()||'jpg').toLowerCase().replace(/[^a-z0-9]/g,'');
  const key=`gallery/${crypto.randomUUID()}.${ext||'jpg'}`;
  await env.GALLERY_BUCKET.put(key,file.stream(),{httpMetadata:{contentType:file.type,cacheControl:'public, max-age=31536000, immutable'},customMetadata:{originalName:file.name}});
  return json({ok:true,key});
}
