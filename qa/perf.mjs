import { chromium } from '@playwright/test';
const base='https://oldpartisan.github.io/mart';
const b=await chromium.launch({headless:true,executablePath:'/Users/user/Library/Caches/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
for(const path of ['/','/catalog/','/product/tort-medovik/']){
  const p=await b.newPage({viewport:{width:1440,height:1000}});
  const t0=Date.now(); await p.goto(base+path,{waitUntil:'load'}); const load=Date.now()-t0;
  await p.waitForTimeout(1500);
  const m=await p.evaluate(()=>{
    const nav=performance.getEntriesByType('navigation')[0];
    const res=performance.getEntriesByType('resource');
    const total=res.reduce((s,r)=>s+(r.transferSize||0),0);
    const imgs=res.filter(r=>r.initiatorType==='img'||/\.(webp|jpg|png)/.test(r.name)).map(r=>({n:r.name.split('/').pop(),s:r.transferSize}));
    const lcp=performance.getEntriesByType('largest-contentful-paint').slice(-1)[0]?.startTime||0;
    return {ttfb:nav?.responseStart,dcl:nav?.domContentLoadedEventEnd,load:nav?.loadEventEnd,total,count:res.length,lcp,imgs:imgs.sort((a,b)=>b.s-a.s).slice(0,5)};
  });
  console.log(path,'measuredLoad',load,'ttfb',Math.round(m.ttfb),'dcl',Math.round(m.dcl),'loadEvt',Math.round(m.load),'transferKB',Math.round(m.total/1024),'req',m.count,'lcp',Math.round(m.lcp));
  console.log(' largest',m.imgs.map(i=>`${i.n}:${Math.round(i.s/1024)}KB`).join(', '));
  await p.close();
}
await b.close();
