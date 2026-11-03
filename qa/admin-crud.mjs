import { chromium } from '@playwright/test';
const base='http://127.0.0.1:3100'; const stamp=Date.now(); const slug=`qa-crud-${stamp}`;
const b=await chromium.launch({headless:true,executablePath:'/Users/user/Library/Caches/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
const p=await b.newPage({viewport:{width:1440,height:1000}});
const res=[]; const ok=(n,v,d='')=>{res.push({n,v,d});console.log(v?'PASS':'FAIL',n,d)};
async function login(email,pass){await p.goto(base+'/login',{waitUntil:'networkidle'});await p.getByLabel('Email',{exact:true}).fill(email);await p.getByLabel('Пароль',{exact:true}).fill(pass);await Promise.all([p.waitForURL(u=>!u.pathname.endsWith('/login')),p.getByRole('button',{name:'Войти'}).click()]);}

await login('admin@irbis-mart.ru','Admin123!');
ok('admin login',p.url().includes('/account'),p.url());
await p.goto(base+'/admin/products/new',{waitUntil:'networkidle'});
await p.fill('#name','QA Товар'); await p.fill('#slug',slug); await p.selectOption('#categoryId',{label:'Бакалея'});
await p.fill('#description','Товар для QA-проверки'); await p.fill('#price','123'); await p.fill('#stock','7');
await p.fill('#images','/images/figma/p-bread.webp');
await p.getByRole('button',{name:'Сохранить'}).click();
await p.waitForURL(/\/admin\/products\?/,{timeout:15000}).catch(()=>{});
ok('product created',p.url().includes('ok='),p.url());
await p.waitForLoadState('networkidle');
ok('product in list',(await p.locator('body').innerText()).includes('QA Товар'));

const row=p.locator('tr',{hasText:'QA Товар'}).first();
await row.locator('a[href*="/admin/products/"]').click(); await p.waitForLoadState('networkidle');
ok('edit form', (await p.locator('h1').innerText()).includes('QA Товар'));
await p.fill('#price','321'); await p.getByRole('button',{name:'Сохранить'}).click();
await p.waitForURL(/\/admin\/products\?/,{timeout:15000}).catch(()=>{});
ok('product updated',p.url().includes('ok='),p.url());

await p.goto(base+'/admin/products',{waitUntil:'networkidle'});
const row2=p.locator('tr',{hasText:'QA Товар'}).first();
const toggle=row2.getByRole('button',{name:'активен'});
ok('toggle present',await toggle.count()>0);
if(await toggle.count()){await toggle.click();await p.waitForURL(/ok=/,{timeout:15000}).catch(()=>{});}
ok('toggle hidden',(await p.locator('body').innerText()).includes('скрыт'));

await p.goto(base+'/admin/products',{waitUntil:'networkidle'});
const row3=p.locator('tr',{hasText:'QA Товар'}).first();
await row3.locator('a[href*="/admin/products/"]').click(); await p.waitForLoadState('networkidle');
await p.getByRole('button',{name:'Удалить'}).click(); await p.waitForURL(/\/admin\/products\?/,{timeout:15000}).catch(()=>{});
ok('product deleted',!(await p.locator('body').innerText()).includes('QA Товар'),p.url());

// Category create + delete empty
await p.goto(base+'/admin/categories',{waitUntil:'networkidle'});
await p.fill('#cat-name','QA Категория'); await p.fill('#cat-slug',`qa-cat-${stamp}`); await p.fill('#cat-sort','999');
await p.getByRole('button',{name:'Добавить'}).click(); await p.waitForURL(/ok=/,{timeout:15000}).catch(()=>{});
ok('category created',(await p.locator('body').innerText()).includes('QA Категория'),p.url());

// Promo create
await p.goto(base+'/admin/promos',{waitUntil:'networkidle'});
const code=`QA${String(stamp).slice(-5)}`;
await p.fill('#code',code); await p.fill('#discountValue','7'); await p.fill('#minOrderAmount','500');
await p.getByRole('button',{name:'Создать'}).click(); await p.waitForURL(/ok=/,{timeout:15000}).catch(()=>{});
ok('promo created',(await p.locator('body').innerText()).includes(code),p.url());

// CSV export
const csv=await p.request.get(base+'/api/admin/export/products');
ok('CSV export 200',csv.status()===200,String(csv.status()));
const text=await csv.text();
ok('CSV has header',text.includes('name;slug;category;price'),text.slice(0,40));

// Users block
await p.goto(base+'/admin/users',{waitUntil:'networkidle'});
const userRow=p.locator('tr',{hasText:'QA Обновлён'}).first();
if(await userRow.count()){ const btn=userRow.getByRole('button',{name:'активен'}); await btn.click(); await p.waitForURL(/ok=/,{timeout:15000}).catch(()=>{}); }
ok('user block toggled',(await p.locator('body').innerText()).includes('заблокирован'));

console.log('FAILS',JSON.stringify(res.filter(r=>!r.v)));
await b.close();
