const base='http://127.0.0.1:3100'; const stamp=Date.now();
async function req(path,{method='GET',body,cookie}={}){const r=await fetch(base+path,{method,headers:{...(body?{'Content-Type':'application/json'}:{}),...(cookie?{Cookie:cookie}:{})},body:body?JSON.stringify(body):undefined});const ct=r.headers.get('content-type')||'';return {status:r.status,data:ct.includes('json')?await r.json().catch(()=>null):await r.text(),cookie:(r.headers.getSetCookie?.()||[]).map(c=>c.split(';')[0]).join('; ')};}
const email=`race-${stamp}@example.com`;
const reg=await req('/api/auth/register',{method:'POST',body:{name:'Race',email,password:'Race123!',consent:true}});
const cookie=reg.cookie;
const prods=await req('/api/products?perPage=48');
const target=prods.data.items.find(p=>p.stock>=20 && p.slug!=='tort-medovik');
console.log('target',target?.name,target?.stock,target?.id);
const date=new Date(Date.now()+86400000).toISOString().slice(0,10);
const mk=()=>({customerName:'Race',phone:'+7 (917) 888-00-01',email,deliveryType:'PICKUP',pickupDate:date,pickupSlot:'12:00–14:00',paymentMethod:'ON_RECEIPT',promoCode:'',bonusToUse:0,items:[{productId:target.id,quantity:20}],consent:true});
const [a,b]=await Promise.all([req('/api/orders',{method:'POST',cookie,body:mk()}),req('/api/orders',{method:'POST',cookie,body:mk()})]);
console.log('statuses',a.status,b.status,a.data?.error||a.data?.order?.number,b.data?.error||b.data?.order?.number);
const after=await req('/api/products?perPage=48');
console.log('stock after',after.data.items.find(p=>p.id===target.id)?.stock);
