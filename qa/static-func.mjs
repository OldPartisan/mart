import { chromium } from '@playwright/test';
const base='https://oldpartisan.github.io/mart';
const b=await chromium.launch({headless:true,executablePath:'/Users/user/Library/Caches/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
const p=await b.newPage({viewport:{width:1440,height:1000}});
const out=[]; const log=(name,ok,detail='')=>{out.push({name,ok,detail});console.log((ok?'PASS':'FAIL'),name,detail)};
const errs=[]; p.on('pageerror',e=>errs.push(String(e).slice(0,200)));

await p.goto(base+'/',{waitUntil:'networkidle'});
log('home hero', (await p.locator('h1').first().innerText()).includes('ЗАЕЗЖАЙТЕ'));
log('loyalty card asset', await p.locator('img[alt*="Карта постоянного"]').count()>0);
log('category tiles', await p.locator('a[href*="/catalog/"]').count()>5);

// Search
const search=p.getByRole('combobox',{name:'Поиск по каталогу'}).first();
await search.fill('медовик'); await p.waitForTimeout(900);
log('search dropdown', await p.getByText('Торт «Медовик»').count()>0, String(await p.getByText('Торт «Медовик»').count()));

// Catalog sort (static)
await p.goto(base+'/catalog/',{waitUntil:'networkidle'});
const firstBefore=await p.locator('article a').nth(1).innerText().catch(()=> '');
await p.locator('select').selectOption('price-asc'); await p.waitForTimeout(900);
const firstAfter=await p.locator('article a').nth(1).innerText().catch(()=> '');
log('catalog sort changes order', firstBefore!==firstAfter, `${firstBefore} -> ${firstAfter} | url=${p.url()}`);

// Pagination
await p.goto(base+'/catalog/',{waitUntil:'networkidle'});
const namePage1=await p.locator('article').first().innerText();
const page2=p.getByRole('link',{name:'2',exact:true}).first();
let pagOk=false, pagUrl='';
if(await page2.count()){ await page2.click(); await p.waitForTimeout(900); pagUrl=p.url(); const namePage2=await p.locator('article').first().innerText(); pagOk=namePage1!==namePage2; }
log('pagination page 2 changes products', pagOk, pagUrl);

// Product/cart
await p.goto(base+'/product/tort-medovik/',{waitUntil:'networkidle'});
await p.getByRole('button',{name:'В корзину'}).first().click(); await p.waitForTimeout(500);
await p.goto(base+'/cart/',{waitUntil:'networkidle'}); await p.waitForTimeout(600);
log('cart has product', (await p.locator('body').innerText()).includes('Торт «Медовик»'));
const inc=p.getByRole('button',{name:'Увеличить количество'}).first();
if(await inc.count()){await inc.click(); await p.waitForTimeout(300);} 
log('cart qty total', (await p.locator('body').innerText()).includes('1 780'), (await p.locator('body').innerText()).match(/К оплате[\s\S]{0,40}/)?.[0]||'');

// Checkout validation and flow
await p.goto(base+'/checkout/',{waitUntil:'networkidle'}); await p.waitForTimeout(800);
log('checkout shows cart', (await p.locator('h1').first().innerText()).includes('Оформление'));
await p.getByRole('button',{name:/Подтвердить заказ/}).click(); await p.waitForTimeout(500);
const errText=await p.locator('body').innerText();
log('checkout validation errors', /Укажите имя|Проверьте телефон|Подтвердите согласие/.test(errText));

// Fill
await p.fill('#customerName','QA Тест'); await p.fill('#phone','+7 (917) 123-45-67'); await p.fill('#email','qa@example.com');
await p.locator('button:has-text("12:00–14:00")').first().click();
// promo
await p.fill('#promo','IRBIS10'); await p.getByRole('button',{name:'Применить'}).click(); await p.waitForTimeout(500);
log('promo applied', (await p.locator('body').innerText()).includes('IRBIS10'));
await p.locator('input[type=checkbox]').last().check();
await p.getByRole('button',{name:/Подтвердить заказ/}).click(); await p.waitForTimeout(1200);
log('demo order success', p.url().includes('/checkout/success/demo'), p.url());

// Account/admin placeholders
await p.goto(base+'/account/',{waitUntil:'networkidle'});
log('account placeholder', (await p.locator('body').innerText()).includes('работает в полной версии'));
await p.goto(base+'/admin/',{waitUntil:'networkidle'});
log('admin placeholder', (await p.locator('body').innerText()).includes('в полной версии'));

// Mobile menu
const m=await b.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
await m.goto(base+'/',{waitUntil:'networkidle'});
await m.getByRole('button',{name:'Открыть меню'}).click(); await m.waitForTimeout(400);
log('mobile menu opens', await m.getByText('Каталог товаров').count()>0);
log('mobile no overflow', (await m.evaluate(()=>document.documentElement.scrollWidth))===390);
if(errs.length) console.log('PAGE ERRORS', errs);
console.log('RESULT', JSON.stringify(out.filter(o=>!o.ok)));
await b.close();
