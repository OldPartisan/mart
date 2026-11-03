import { chromium } from '@playwright/test';
const base='http://127.0.0.1:3100';
const stamp=Date.now(); const slug=`qa-product-${stamp}`;
const b=await chromium.launch({headless:true,executablePath:'/Users/user/Library/Caches/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
const c=await b.newContext({viewport:{width:1440,height:1000}}); const p=await c.newPage();
const results=[]; const ok=(n,v,d='')=>{results.push({n,v,d});console.log(v?'PASS':'FAIL',n,d)};
p.on('pageerror',e=>console.log('PAGEERROR',String(e).slice(0,200)));

async function login(email,pass){
  await p.goto(base+'/login',{waitUntil:'networkidle'});
  await p.getByLabel('Email',{exact:true}).fill(email);
  await p.getByLabel('Пароль',{exact:true}).fill(pass);
  await p.getByRole('button',{name:'Войти'}).click();
  await p.waitForLoadState('networkidle');
}
// customer cannot admin
await login('client@irbis-mart.ru','Client123!');
ok('customer login redirect account',p.url().includes('/account'),p.url());
await p.goto(base+'/admin',{waitUntil:'networkidle'});
ok('customer blocked from admin',p.url().includes('/account'),p.url());

// admin login
await p.context().clearCookies();
await login('admin@irbis-mart.ru','Admin123!');
ok('admin login',p.url().includes('/account'),p.url());
await p.goto(base+'/admin',{waitUntil:'networkidle'});
ok('admin dashboard', (await p.locator('h1').innerText()).includes('Сводка'), await p.locator('h1').innerText());

// create product
await p.goto(base+'/admin/products/new',{waitUntil:'networkidle'});
await p.fill('#name','QA Товар');
await p.fill('#slug',slug);
await p.selectOption('#categoryId',{label:'Бакалея'});
await p.fill('#description','Товар для QA-проверки');
await p.fill('#price','123');
await p.fill('#stock','7');
await p.fill('#images','/images/figma/p-bread.webp');
await p.getByRole('button',{name:'Сохранить'}).click();
await p.waitForLoadState('networkidle');
ok('product created redirect',p.url().includes('/admin/products'),p.url());
ok('product visible in list',(await p.locator('body').innerText()).includes('QA Товар'));

// edit product
await p.goto(base+'/admin/products',{waitUntil:'networkidle'});
const row=p.locator('tr',{hasText:'QA Товар'}).first();
await row.getByLabel('Редактировать').click().catch(async()=>{await row.locator('a[href*="/admin/products/"]').click();});
await p.waitForLoadState('networkidle');
ok('edit form opens',(await p.locator('h1').innerText()).includes('QA Товар'),await p.locator('h1').innerText());
await p.fill('#price','321');
await p.getByRole('button',{name:'Сохранить'}).click(); await p.waitForLoadState('networkidle');
ok('product updated',(await p.locator('body').innerText()).includes('Товар обновлён'));

// toggle visibility
await p.goto(base+'/admin/products',{waitUntil:'networkidle'});
const row2=p.locator('tr',{hasText:'QA Товар'}).first();
await row2.getByRole('button',{name:'активен'}).click(); await p.waitForLoadState('networkidle');
ok('product hidden toggle',(await p.locator('body').innerText()).includes('скрыт'));

// delete
await p.goto(base+'/admin/products',{waitUntil:'networkidle'});
const row3=p.locator('tr',{hasText:'QA Товар'}).first();
await row3.locator('a[href*="/admin/products/"]').click(); await p.waitForLoadState('networkidle');
await p.getByRole('button',{name:'Удалить'}).click(); await p.waitForLoadState('networkidle');
ok('product deleted',!(await p.locator('body').innerText()).includes('QA Товар'));

// promo create
await p.goto(base+'/admin/promos',{waitUntil:'networkidle'});
const code=`QA${String(stamp).slice(-5)}`;
await p.fill('#code',code); await p.fill('#discountValue','7'); await p.fill('#minOrderAmount','500');
await p.getByRole('button',{name:'Создать'}).click(); await p.waitForLoadState('networkidle');
ok('promo created',(await p.locator('body').innerText()).includes(code),code);

// order status
await p.goto(base+'/admin/orders',{waitUntil:'networkidle'});
const orderLink=p.locator('a[href*="/admin/orders/"]').first();
const href=await orderLink.getAttribute('href');
await orderLink.click(); await p.waitForLoadState('networkidle');
const current=await p.locator('#status').inputValue();
await p.selectOption('#status','COMPLETED');
await p.getByRole('button',{name:'Обновить статус'}).click(); await p.waitForLoadState('networkidle');
ok('order status updated',(await p.locator('body').innerText()).includes('Выполнен'),`${href} ${current}`);

// users page
await p.goto(base+'/admin/users',{waitUntil:'networkidle'});
ok('users page loads',(await p.locator('h1').innerText()).includes('Пользователи'));
ok('role select present for admin',await p.locator('select[name="role"]').count()>0);

// manager role restrictions
await p.context().clearCookies();
await login('manager@irbis-mart.ru','Manager123!');
await p.goto(base+'/admin/users',{waitUntil:'networkidle'});
ok('manager users read-only',await p.locator('select[name="role"]').count()===0);
const blockBtn=p.getByRole('button',{name:'активен'}).first();
ok('manager block disabled',await blockBtn.isDisabled().catch(()=>true));

console.log('FAILS',JSON.stringify(results.filter(r=>!r.v)));
await b.close();
