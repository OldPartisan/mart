import { chromium } from '@playwright/test';
const base='http://127.0.0.1:3100';
const b=await chromium.launch({headless:true,executablePath:'/Users/user/Library/Caches/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
const p=await b.newPage({viewport:{width:1440,height:1000}});
const res=[]; const ok=(n,v,d='')=>{res.push({n,v,d});console.log(v?'PASS':'FAIL',n,d)};
p.on('pageerror',e=>console.log('PAGEERROR',String(e).slice(0,200)));
// login
await p.goto(base+'/login',{waitUntil:'networkidle'});
await p.getByLabel('Email',{exact:true}).fill('client@irbis-mart.ru');
await p.getByLabel('Пароль',{exact:true}).fill('Client123!');
await Promise.all([p.waitForURL(u=>!u.pathname.endsWith('/login')),p.getByRole('button',{name:'Войти'}).click()]);
ok('login',p.url().includes('/account'),p.url());
// add product
await p.goto(base+'/product/tort-medovik',{waitUntil:'networkidle'});
await p.getByRole('button',{name:'В корзину'}).first().click(); await p.waitForTimeout(400);
await p.goto(base+'/checkout',{waitUntil:'networkidle'}); await p.waitForTimeout(700);
ok('checkout loaded',(await p.locator('h1').innerText()).includes('Оформление'));
// delivery
await p.getByRole('button',{name:/Доставка/}).first().click(); await p.waitForTimeout(300);
const body1=await p.locator('body').innerText();
ok('delivery fee shown',/149/.test(body1));
ok('zone select',await p.locator('#deliveryZoneId').count()===1);
await p.fill('#addressText','с. Новая Тура, ул. Совхозная, 1');
// promo
await p.fill('#promo','IRBIS10'); await p.getByRole('button',{name:'Применить'}).click(); await p.waitForTimeout(500);
ok('promo applied',(await p.locator('body').innerText()).includes('IRBIS10'));
// bonus
const cb=p.locator('input[type=checkbox][class*="accent"]').first();
const bonusToggle=p.getByText('Списать бонусы').locator('..').locator('input[type=checkbox]').first();
if(await bonusToggle.count()){await bonusToggle.check(); await p.waitForTimeout(300); ok('bonus toggle',true);} else ok('bonus toggle',false);
const body2=await p.locator('body').innerText();
ok('bonus available shown',/Доступно 2\d\d/.test(body2),body2.match(/Доступно[^\n]*/)?.[0]||'');
// consent + submit
const checks=p.locator('input[type=checkbox]');
const n=await checks.count();
await checks.nth(n-1).check();
await p.getByRole('button',{name:/Подтвердить заказ/}).click(); await p.waitForTimeout(2500);
ok('order success',p.url().includes('/checkout/success/'),p.url());
const succ=await p.locator('body').innerText();
ok('success has number',/IM-\d{4}-\d{6}/.test(succ));
ok('success paid pending',/Ожидает оплаты/.test(succ));
// account orders
await p.goto(base+'/account/orders',{waitUntil:'networkidle'});
ok('order in account',/IM-\d{4}-\d{6}/.test(await p.locator('body').innerText()));
// profile update UI
await p.goto(base+'/account/profile',{waitUntil:'networkidle'});
await p.fill('#profile-name','Алия QA');
await p.getByRole('button',{name:'Сохранить'}).click(); await p.waitForTimeout(800);
ok('profile saved toast',(await p.locator('body').innerText()).includes('Алия QA'));
// address add
const addBtn=p.getByRole('button',{name:/Добавить/});
if(await addBtn.count()){await addBtn.first().click(); await p.fill('#addr-street','Тестовая'); await p.fill('#addr-house','5'); await p.getByRole('button',{name:'Сохранить адрес'}).click(); await p.waitForTimeout(800); ok('address added',(await p.locator('body').innerText()).includes('Тестовая'));}
// logout
await p.goto(base+'/',{waitUntil:'networkidle'});
const userBtn=p.getByRole('button',{name:/Алия/}).first();
if(await userBtn.count()){await userBtn.click(); await p.getByRole('button',{name:'Выйти'}).click(); await p.waitForTimeout(800);}
await p.goto(base+'/account',{waitUntil:'networkidle'});
ok('logout redirects',p.url().includes('/login'),p.url());
console.log('FAILS',JSON.stringify(res.filter(r=>!r.v)));
await b.close();
