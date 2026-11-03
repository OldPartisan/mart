const base='http://127.0.0.1:3100';
const stamp=Date.now();
const results=[]; const ok=(n,c,d='')=>{results.push({n,c,d});console.log(c?'PASS':'FAIL',n,d)};
async function req(path,{method='GET',body,cookie}={}){
  const r=await fetch(base+path,{method,headers:{...(body?{'Content-Type':'application/json'}:{}),...(cookie?{Cookie:cookie}:{})},body:body?JSON.stringify(body):undefined,redirect:'manual'});
  let data=null; const ct=r.headers.get('content-type')||''; if(ct.includes('json')) data=await r.json().catch(()=>null); else data=await r.text().catch(()=>null);
  const set=r.headers.getSetCookie?.()||[]; const cookieOut=set.map(c=>c.split(';')[0]).join('; ');
  return {status:r.status,data,headers:r.headers,cookie:cookieOut};
}
const email=`qa-${stamp}@example.com`;
const reg=await req('/api/auth/register',{method:'POST',body:{name:'QA Тест',email,password:'QaPass123!',phone:'+7 (917) 555-00-01',consent:true,marketingOptIn:false}});
ok('register 201',reg.status===201,`${reg.status} ${reg.data?.error||''}`);
ok('welcome 300',reg.data?.user?.bonusBalance===300,String(reg.data?.user?.bonusBalance));
let cookie=reg.cookie;
const dup=await req('/api/auth/register',{method:'POST',body:{name:'QA Тест',email,password:'QaPass123!',consent:true}});
ok('duplicate register 409',dup.status===409,String(dup.status));
const weak=await req('/api/auth/register',{method:'POST',body:{name:'QA',email:`weak-${stamp}@example.com`,password:'123',consent:true}});
ok('weak password 422',weak.status===422,String(weak.status));
const prof=await req('/api/user/profile',{cookie});
ok('profile GET',prof.status===200&&prof.data?.email===email);
const put=await req('/api/user/profile',{method:'PUT',cookie,body:{name:'QA Обновлён',phone:'+7 (917) 555-00-02',marketingOptIn:true}});
ok('profile PUT',put.status===200&&put.data?.user?.name==='QA Обновлён');
const addr=await req('/api/user/addresses',{method:'POST',cookie,body:{label:'Дом',city:'Новая Тура',street:'Совхозная',house:'1',apartment:'2',isDefault:true}});
ok('address create',addr.status===201,String(addr.status));
const addrList=await req('/api/user/addresses',{cookie});
ok('address list',addrList.status===200&&addrList.data?.items?.length>=1);
const bonuses=await req('/api/user/bonuses',{cookie});
ok('bonus history',bonuses.status===200&&bonuses.data?.balance===300,String(bonuses.data?.balance));

// Products
const prods=await req('/api/products?perPage=48');
const tort=prods.data.items.find(p=>p.slug==='tort-medovik');
const water=prods.data.items.find(p=>p.price<=100);
const tomorrow=new Date(Date.now()+86400000).toISOString().slice(0,10);
const orderBody={customerName:'QA Тест',phone:'+7 (917) 555-00-01',email,deliveryType:'PICKUP',pickupDate:tomorrow,pickupSlot:'12:00–14:00',paymentMethod:'ONLINE',promoCode:'IRBIS10',bonusToUse:100,items:[{productId:tort.id,quantity:2,price:1}],consent:true};
const order=await req('/api/orders',{method:'POST',cookie,body:orderBody});
ok('order created',order.status===201,`${order.status} ${order.data?.error||''}`);
if(order.data?.order){const o=order.data.order;
  ok('price tampering ignored',o.subtotal===tort.price*2,`subtotal ${o.subtotal}`);
  ok('promo 10%',o.discount===Math.floor(tort.price*2*0.1),`discount ${o.discount}`);
  ok('bonus 100 used',o.bonusUsed===100,`bonus ${o.bonusUsed}`);
  const expected=o.subtotal-o.discount-o.bonusUsed;
  ok('total math',o.total===expected,`${o.total} vs ${expected}`);
  const paid=await req('/api/payments/mock-success',{method:'POST',body:{orderId:o.id}});
  ok('mock payment',paid.status===200,String(paid.status));
  const after=await req('/api/user/bonuses',{cookie});
  ok('bonus accrued',after.data?.balance===200+Math.floor(expected/100),`balance ${after.data?.balance}`);
  const ord=await req('/api/orders/'+o.id,{cookie});
  ok('order detail paid',ord.status===200&&ord.data?.order?.paymentStatus==='PAID',ord.data?.order?.paymentStatus);
  // IDOR
  const email2=`qa2-${stamp}@example.com`;
  const reg2=await req('/api/auth/register',{method:'POST',body:{name:'QA 2',email:email2,password:'QaPass123!',consent:true}});
  const idor=await req('/api/orders/'+o.id,{cookie:reg2.cookie});
  ok('IDOR blocked',idor.status===403,String(idor.status));
  const adminCsv=await req('/api/admin/export/products',{cookie:reg2.cookie});
  ok('admin CSV blocked for customer',adminCsv.status===403,String(adminCsv.status));
}
// Delivery min
const del=await req('/api/orders',{method:'POST',cookie,body:{...orderBody,deliveryType:'DELIVERY',deliveryZoneId:'turanova',addressText:'Новая Тура, Совхозная 1',pickupDate:'',pickupSlot:'',promoCode:'',bonusToUse:0,items:[{productId:water.id,quantity:1}],consent:true}});
ok('delivery min-order 400',del.status===400,`${del.status} ${del.data?.error||''}`);
// Oversell
const over=await req('/api/orders',{method:'POST',cookie,body:{...orderBody,promoCode:'',bonusToUse:0,items:[{productId:tort.id,quantity:99}],consent:true}});
ok('oversell 409',over.status===409,`${over.status} ${over.data?.error||''}`);
// Rate limit login
let last;
for(let i=0;i<10;i++){last=await req('/api/auth/login',{method:'POST',body:{email:`nobody-${stamp}@example.com`,password:'wrong'}});}
ok('login rate limited 429',last.status===429,String(last.status));
// Headers/cookies
const home=await req('/');
ok('security headers nosniff',home.headers.get('x-content-type-options')==='nosniff');
ok('frame options',!!home.headers.get('x-frame-options'));
const login=await req('/api/auth/login',{method:'POST',body:{email,password:'QaPass123!'}});
const set=login.headers.getSetCookie().join('; ');
ok('cookie httpOnly',/HttpOnly/i.test(set));
ok('cookie SameSite',/SameSite=Lax/i.test(set));
console.log('FAILS',JSON.stringify(results.filter(r=>!r.c)));
