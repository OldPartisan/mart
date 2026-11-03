import { chromium } from '@playwright/test';
const base='https://oldpartisan.github.io/mart';
const b=await chromium.launch({headless:true,executablePath:'/Users/user/Library/Caches/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
const p=await b.newPage({viewport:{width:1440,height:1000}});
const pages=['/','/catalog/','/product/tort-medovik/','/promotions/','/delivery/','/pickup/','/loyalty/','/about/','/cafe/','/contacts/','/legal/privacy/'];
const hrefs=new Set();
for(const path of pages){await p.goto(base+path,{waitUntil:'domcontentloaded'});await p.waitForTimeout(200);
  const list=await p.locator('a[href]').evaluateAll(as=>as.map(a=>a.href));
  list.forEach(h=>{if(h.startsWith(base)&&!h.includes('#')) hrefs.add(h.replace(/\/$/,'/'));});
}
const bad=[]; const ext=[];
for(const h of [...hrefs]){
  try{const r=await p.request.get(h,{timeout:15000}); if(r.status()>=400) bad.push(`${r.status()} ${h}`);}
  catch(e){ext.push(`${h} ERR`);}
}
console.log('internal',hrefs.size,'bad',bad.length);
console.log(bad.join('\n'));
console.log('errors',ext.slice(0,10));
await b.close();
