const base='http://127.0.0.1:3100'; const stamp=Date.now();
async function req(path,{method='GET',body,cookie}={}){const r=await fetch(base+path,{method,headers:{...(body?{'Content-Type':'application/json'}:{}),...(cookie?{Cookie:cookie}:{})},body:body?JSON.stringify(body):undefined});const ct=r.headers.get('content-type')||'';return {status:r.status,data:ct.includes('json')?await r.json().catch(()=>null):await r.text(),cookie:(r.headers.getSetCookie?.()||[]).map(c=>c.split(';')[0]).join('; ')};}
const email=`edge-${stamp}@example.com`;
const reg=await req('/api/auth/register',{method:'POST',body:{name:'Edge',email,password:'Edge123!',consent:true}}); const cookie=reg.cookie;
const prods=await req('/api/products?perPage=48'); const p=prods.data.items.find(x=>x.price>500);
const date=new Date(Date.now()+86400000).toISOString().slice(0,10);
const order=await req('/api/orders',{method:'POST',cookie,body:{customerName:'Edge',phone:'+7 (917) 999-00-01',email,deliveryType:'PICKUP',pickupDate:date,pickupSlot:'12:00–14:00',paymentMethod:'ON_RECEIPT',bonusToUse:9999,items:[{productId:p.id,quantity:2}],consent:true}});
console.log('bonus overuse',order.status,'bonusUsed',order.data?.order?.bonusUsed,'total',order.data?.order?.total,'subtotal',order.data?.order?.subtotal);
const resetReq=await req('/api/auth/forgot-password',{method:'POST',body:{email}});
console.log('forgot',resetReq.status,'has demo url',!!resetReq.data?.demoResetUrl);
const url=resetReq.data?.demoResetUrl||''; const token=new URL(url).searchParams.get('token');
if(token){const r1=await req('/api/auth/reset-password',{method:'POST',body:{token,password:'NewEdge123!'}}); const r2=await req('/api/auth/reset-password',{method:'POST',body:{token,password:'NewEdge123!'}}); console.log('reset first',r1.status,'reuse',r2.status);}
const loginOld=await req('/api/auth/login',{method:'POST',body:{email,password:'Edge123!'}});
const loginNew=await req('/api/auth/login',{method:'POST',body:{email,password:'NewEdge123!'}});
console.log('login old/new',loginOld.status,loginNew.status);
// SQL injection search
const inj=await req('/api/search?q=%27%20OR%201%3D1--');
console.log('sqli search',inj.status,Array.isArray(inj.data?.items)?inj.data.items.length:inj.data);
// CSRF: form-encoded order
const csrf=await fetch(base+'/api/orders',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'items=1',credentials:'omit'});
console.log('form-encoded order',csrf.status);
