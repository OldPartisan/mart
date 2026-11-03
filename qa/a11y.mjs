import { chromium } from '@playwright/test';
import fs from 'node:fs';
const axe=fs.readFileSync('/tmp/axe.min.js','utf8');
const base='https://oldpartisan.github.io/mart';
const b=await chromium.launch({headless:true,executablePath:'/Users/user/Library/Caches/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
const p=await b.newPage({viewport:{width:1440,height:1000}});
const pages=['/','/catalog/','/product/tort-medovik/','/cart/','/checkout/','/loyalty/','/contacts/'];
for(const path of pages){
  await p.goto(base+path,{waitUntil:'domcontentloaded'});
  await p.waitForTimeout(700);
  await p.addScriptTag({content:axe});
  const r=await p.evaluate(async()=>await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));
  console.log('\n===',path,'violations',r.violations.length);
  for(const v of r.violations) console.log(v.impact, v.id, '-', v.help, '| nodes:', v.nodes.length, '|', v.nodes[0]?.target?.join(' '));
}
await b.close();
