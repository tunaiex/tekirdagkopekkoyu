import {createSession,cookie,json} from './_auth.js';
export async function onRequestPost({request,env}){
  try{const {username,password}=await request.json();
    if(username!==env.ADMIN_USERNAME||password!==env.ADMIN_PASSWORD)return json({ok:false,error:'Kullanıcı adı veya şifre hatalı.'},401);
    const token=await createSession(env);return new Response(JSON.stringify({ok:true}),{status:200,headers:{'Content-Type':'application/json','Set-Cookie':cookie(token)}});
  }catch{return json({ok:false,error:'Geçersiz istek.'},400)}
}
