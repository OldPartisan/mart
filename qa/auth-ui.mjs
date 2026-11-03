import { chromium } from '@playwright/test';
const base='http://127.0.0.1:3100'; const stamp=Date.now(); const email=`ui-${stamp}@example.com`;
const b=await chromium.launch({headless:true,executablePath:'/Users/user/Library/Caches/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
const p=await b.newPage({viewport:{width:1440,height:1000}});
const res=[]; const ok=(n,v,d='')=>{res.push({n,v,d});console.log(v?'PASS':'FAIL',n,d)};
await p.goto(base+'/register',{waitUntil:'networkidle'});
await p.fill('#name','UI QA'); await p.fill('#email',email); await p.fill('#phone','+7 (917) 777-00-01'); await p.fill('#password','UiPass123!');
const checks=p.locator('input[type=checkbox]'); await checks.nth(0).check(); // consent
await p.getByRole('button',{name:'Создать аккаунт'}).click();
await p.waitForTimeout(1800);
ok('register redirects account',p.url().includes('/account'),p.url());
ok('register bonus shown',(await p.locator('body').innerText()).includes('300'),'');
// logout via user menu
const userBtn=p.getByRole('button',{name:/UI/}).first();
if(await userBtn.count()){await userBtn.click(); await p.getByRole('button',{name:'Выйти'}).click(); await p.waitForTimeout(1000);}
ok('logout',p.url()==='http://127.0.0.1:3100/');
// login
await p.goto(base+'/login',{waitUntil:'networkidle'});
await p.getByLabel('Email',{exact:true}).fill(email); await p.getByLabel('Пароль',{exact:true}).fill('UiPass123!');
await p.getByRole('button',{name:'Войти'}).click(); await p.waitForTimeout(1500);
ok('login new user',p.url().includes('/account'),p.url());
// profile update
await p.goto(base+'/account/profile',{waitUntil:'networkidle'});
await p.fill('#profile-name','UI QA Updated');
await p.getByRole('button',{name:'Сохранить',exact:true}).click(); await p.waitForTimeout(1200);
ok('profile update',(await p.locator('body').innerText()).includes('UI QA Updated'));
// address
await p.getByRole('button',{name:/Добавить/}).first().click();
await p.fill('#addr-street','Тестовая'); await p.fill('#addr-house','5');
await p.getByRole('button',{name:'Сохранить адрес'}).click(); await p.waitForTimeout(1200);
ok('address added',(await p.locator('body').innerText()).includes('Тестовая'));
// forgot password
await p.goto(base+'/forgot-password',{waitUntil:'networkidle'});
await p.fill('#email',email); await p.getByRole('button',{name:'Отправить ссылку'}).click(); await p.waitForTimeout(1200);
const body=await p.locator('body').innerText();
ok('forgot shows demo link',body.includes('Ссылка для сброса')||body.includes('demoResetUrl')||body.includes('/reset-password?token='));
const link=p.locator('a[href*="/reset-password?token="]').first();
if(await link.count()){await link.click(); await p.waitForLoadState('networkidle'); await p.fill('#password','NewPass123!'); await p.fill('#confirm','NewPass123!'); await p.getByRole('button',{name:'Сохранить пароль'}).click(); await p.waitForTimeout(1200); ok('reset password', (await p.locator('body').innerText()).includes('Пароль обновлён'));}
console.log('FAILS',JSON.stringify(res.filter(r=>!r.v)));
await b.close();
