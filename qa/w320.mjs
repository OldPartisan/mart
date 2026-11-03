import { chromium } from '@playwright/test';
const b=await chromium.launch({headless:true,executablePath:'/Users/user/Library/Caches/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
const p=await b.newPage({viewport:{width:320,height:568},isMobile:true,hasTouch:true});
for(const path of ['/','/catalog/','/product/tort-medovik/','/checkout/','/cafe/']){
 await p.goto('https://oldpartisan.github.io/mart'+path,{waitUntil:'domcontentloaded'}); await p.waitForTimeout(300);
 const ov=await p.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
 console.log(path,'overflow',ov);
}
await b.close();
