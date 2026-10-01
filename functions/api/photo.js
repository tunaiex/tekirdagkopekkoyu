export async function onRequestGet({request,env}){
  const key=new URL(request.url).searchParams.get('key');
  if(!key||!env.GALLERY_BUCKET)return new Response('Not found',{status:404});
  const obj=await env.GALLERY_BUCKET.get(key);
  if(!obj)return new Response('Not found',{status:404});
  const h=new Headers();obj.writeHttpMetadata(h);h.set('Cache-Control','public, max-age=31536000, immutable');return new Response(obj.body,{headers:h});
}
