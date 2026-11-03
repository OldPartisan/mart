import { chromium } from '@playwright/test';
import fs from 'node:fs';
const axe=fs.readFileSync('/tmp/axe.min.js','utf8');
const base='https://oldpartisan.github.io/mart';
const b=await chromium.launch({headless:true,executablePath:'/Users/user/Library/Caches/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
const p=await b.newPage({viewport:{width:1440,height:1000}});
for(const path of ['/','/product/tort-medovik/']){
  await p.goto(base+path,{waitUntil:'domcontentloaded'}); await p.waitForTimeout(700);
  await p.addScriptTag({content:axe});
  const r=await p.evaluate(async()=>await axe.run(document,{runOnly:{type:'rule',values:['color-contrast','aria-prohibited-attr','aria-required-parent']}}));
  console.log('\n===',path);
  for(const v of r.violations){ console.log('##',v.id,v.impact); for(const n of v.nodes.slice(0,20)){ console.log('-',n.target.join(' '),'::',n.failureSummary?.replace(/\n/g,' ').slice(0,220)); } }
}
await b.close();
