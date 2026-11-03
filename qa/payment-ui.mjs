import { chromium } from '@playwright/test';
const base='http://127.0.0.1:3100';
const b=await chromium.launch({headless:true,executablePath:'/Users/user/Library/Caches/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
const p=await b.newPage({viewport:{width:1440,height:1000}});
await p.goto(base+'/login',{waitUntil:'networkidle'});
await p.getByLabel('Email',{exact:true}).fill('client@irbis-mart.ru'); await p.getByLabel('Пароль',{exact:true}).fill('Client123!');
await Promise.all([p.waitForURL(u=>!u.pathname.endsWith('/login')),p.getByRole('button',{name:'Войти'}).click()]);
await p.goto(base+'/product/kofe-zernovoy-irbis',{waitUntil:'networkidle'});
await p.getByRole('button',{name:'В корзину'}).first().click(); await p.waitForTimeout(300);
await p.goto(base+'/checkout',{waitUntil:'networkidle'}); await p.waitForTimeout(600);
await p.getByRole('button',{name:/Онлайн/}).first().click();
const checks=p.locator('input[type=checkbox]'); await checks.nth((await checks.count())-1).check();
await p.getByRole('button',{name:/Подтвердить заказ/}).click(); await p.waitForTimeout(1500);
console.log('after order',p.url());
const body=await p.locator('body').innerText();
console.log('payment link',body.includes('Перейти к оплате'));
if(await p.getByRole('link',{name:'Перейти к оплате'}).count()){
  await p.getByRole('link',{name:'Перейти к оплате'}).click(); await p.waitForLoadState('networkidle');
  console.log('payment page',p.url());
  await p.getByRole('button',{name:/Оплатить/}).click(); await p.waitForTimeout(1800);
  console.log('after pay',p.url());
  console.log((await p.locator('body').innerText()).match(/Оплачен|Ожидает оплаты/)?.[0]);
}
await b.close();
