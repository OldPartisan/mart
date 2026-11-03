const base='http://127.0.0.1:3100';
const r=await fetch(base+'/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'client@irbis-mart.ru',password:'Client123!'})});
const cookie=(r.headers.getSetCookie?.()||[]).map(c=>c.split(';')[0]).join('; ');
const prods=await (await fetch(base+'/api/products?perPage=48')).json();
const p=prods.items.find(x=>x.price>=900);
const date=new Date(Date.now()+86400000).toISOString().slice(0,10);
const res=await fetch(base+'/api/orders',{method:'POST',headers:{'Content-Type':'application/json',Cookie:cookie},body:JSON.stringify({customerName:'Zone',phone:'+7 (917) 111-00-00',email:'client@irbis-mart.ru',deliveryType:'DELIVERY',deliveryZoneId:'turanova',addressText:'Новая Тура, Совхозная 1',paymentMethod:'ON_RECEIPT',items:[{productId:p.id,quantity:1}],consent:true})});
const data=await res.json(); console.log(res.status, data.order?.deliveryZone, data.order?.deliveryFee, data.order?.total);
