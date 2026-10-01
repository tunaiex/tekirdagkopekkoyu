import {json} from './_auth.js';
export async function onRequestGet({env}){
  if(!env.GALLERY_BUCKET)return json({photos:[]});
  const listed=await env.GALLERY_BUCKET.list({prefix:'gallery/',limit:1000});
  const photos=listed.objects.map(o=>({key:o.key,name:o.key.split('/').pop(),uploaded:o.uploaded?.toISOString?.()||null}));
  return json({photos});
}
