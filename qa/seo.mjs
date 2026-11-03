import { chromium } from '@playwright/test';
const base='https://oldpartisan.github.io/mart';
const b=await chromium.launch({headless:true,executablePath:'/Users/user/Library/Caches/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
const p=await b.newPage({viewport:{width:1440,height:1000}});
const paths=['/','/catalog/','/product/tort-medovik/','/promotions/','/delivery/','/contacts/','/legal/privacy/'];
for(const path of paths){
  await p.goto(base+path,{waitUntil:'domcontentloaded'}); await p.waitForTimeout(300);
  const info=await p.evaluate(()=>{
    const q=s=>document.querySelector(s);
    const ld=[...document.querySelectorAll('script[type="application/ld+json"]')].map(s=>{try{return JSON.parse(s.textContent)}catch{return 'PARSE_ERROR'}});
    return {
      title:document.title,
      desc:q('meta[name=description]')?.content,
      canonical:q('link[rel=canonical]')?.href,
      robots:q('meta[name=robots]')?.content,
      og:q('meta[property="og:image"]')?.content,
      h1:[...document.querySelectorAll('h1')].map(h=>h.innerText.trim()),
      ldTypes:ld.map(x=>Array.isArray(x)?x.map(y=>y['@type']):x['@type']),
      ldValid:ld.every(x=>x!=='PARSE_ERROR'),
    };
  });
  console.log('\n',path); console.log(JSON.stringify(info,null,1));
  if(info.og){const r=await p.request.get(info.og); console.log('og image',r.status(),info.og);}
}
await b.close();
