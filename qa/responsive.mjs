import { chromium } from '@playwright/test';
const base='https://oldpartisan.github.io/mart';
const b=await chromium.launch({headless:true,executablePath:'/Users/user/Library/Caches/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
const widths=[360,390,768,1024,1440];
const pages=['/','/catalog/','/product/tort-medovik/','/cart/','/checkout/','/loyalty/','/cafe/'];
for(const w of widths){
  const p=await b.newPage({viewport:{width:w,height:900},isMobile:w<500,hasTouch:w<500});
  for(const path of pages){
    await p.goto(base+path,{waitUntil:'domcontentloaded'}); await p.waitForTimeout(300);
    const ov=await p.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
    const small=await p.locator('a,button').evaluateAll(els=>els.filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&(r.width<32||r.height<32)}).length);
    if(ov>0||small>4) console.log(`w=${w} ${path} overflow=${ov} smallTargets=${small}`);
  }
  await p.close();
}
await b.close();
