// COMPLETE: w03_lc_hex9_10.js — Generates 144 entries for Hex 9 + Hex 10
// Run: node w03_lc_hex9_10.js
// Template-based engine generates unique content for each line×category (12 lines × 12 cats = 144 entries)

const fs=require("fs"),path=require("path");
const ROOT="D:\\AI_PROJECTS\\Zero1Matrix";
const TARGET=path.join(ROOT,"src","data","lineCategoryInterpretations.data.js");

const raw=fs.readFileSync(TARGET,"utf8");
const m=raw.match(/window\.Zero1MatrixData\.lineCategoryInterpretations\s*=\s*(\[.*\]);?$/s);
if(!m){console.error("Parse fail");process.exit(1);}
const all=JSON.parse(m[1]);
console.log("Loaded entries:",all.length);

const CW={health:"本欄不做醫療診斷。",business:"本欄不做獲利保證。",legal:"本欄不做法律結果判定。"};
const V="2.0.0-w03";
const CN={general:"一般",career:"工作事業",love:"感情關係",money:"財務金錢",people:"人際合作",family:"家庭親人",study:"學習考試",health:"身心狀態",decision:"重大決策",business:"創業經營",legal:"官非合約",spiritual:"心境修行"};

const SA_H9=[null,
  {clarity:3,action:1,risk:1,change:3,support:2,timing:1},
  {clarity:3,action:2,risk:1,change:2,support:3,timing:2},
  {clarity:2,action:-1,risk:3,change:-1,support:0,timing:-1},
  {clarity:3,action:2,risk:2,change:3,support:2,timing:1},
  {clarity:4,action:3,risk:1,change:3,support:3,timing:3},
  {clarity:3,action:-2,risk:4,change:-2,support:0,timing:-2}
];
const SA_H10=[null,
  {clarity:3,action:1,risk:1,change:3,support:1,timing:1},
  {clarity:4,action:2,risk:1,change:2,support:3,timing:2},
  {clarity:2,action:-1,risk:4,change:-1,support:0,timing:-1},
  {clarity:3,action:2,risk:2,change:3,support:2,timing:1},
  {clarity:3,action:2,risk:3,change:3,support:1,timing:1},
  {clarity:4,action:3,risk:1,change:4,support:3,timing:3}
];

function mk(id,hid,l,cat,cn,m,a,w,b,sa){
  return {id,hexagramId:hid,line:l,category:cat,categoryName:cn,meaning:m,advice:a,
    warning:w+(CW[cat]||""),basis:b,scoreAdjust:{...sa},
    qualityLevel:"refined",needsHumanReview:true,version:V,reviewed:false,reviewedBy:"",reviewedAt:"",needsExpansion:true};
}

// Read template data from JSON files
const T9=JSON.parse(fs.readFileSync(path.join(__dirname,"w03_templates_h9.json"),"utf8"));
const T10=JSON.parse(fs.readFileSync(path.join(__dirname,"w03_templates_h10.json"),"utf8"));

const generated=[];

function processTemplates(templates,hid,SA){
  const hexName=hid===9?"小畜":"履";
  for(const t of templates){
    const l=t.line;
    const sa=SA[l];
    for(const cat of Object.keys(t.meanings)){
      const m=t.meanings[cat].replace(/\{hn\}/g,hexName);
      const a=t.advices[cat];
      const w=t.warnings[cat];
      const b=[...t.lineRef,CN[cat]];
      const id="hex-"+String(hid).padStart(3,"0")+"-line-"+l+"-"+cat;
      generated.push(mk(id,hid,l,cat,CN[cat],m,a,w,b,sa));
    }
  }
}

processTemplates(T9,9,SA_H9);
processTemplates(T10,10,SA_H10);

console.log("\n=== VERIFICATION ===");
console.log("Total generated:",generated.length);
let allPass=true,failCount=0,passCount=0;
for(const e of generated){
  const ml=(e.meaning||"").length,al=(e.advice||"").length,wl=(e.warning||"").length,bl=(e.basis||[]).length;
  const ok=ml>=100&&al>=85&&wl>=65&&bl>=4;
  if(!ok){console.log("FAIL:",e.id,"m="+ml,"a="+al,"w="+wl,"b="+bl);allPass=false;failCount++;}
  else passCount++;
}
console.log("Pass:",passCount,"Fail:",failCount);
function short(s){return String(s||"").replace(/[，。、；：！？\s\d]/g,"").substring(0,50);}
const mU=new Set(generated.map(e=>short(e.meaning))).size;
const aU=new Set(generated.map(e=>short(e.advice))).size;
const wU=new Set(generated.map(e=>short(e.warning))).size;
console.log("meaning unique:",mU,"/",generated.length,"| advice unique:",aU,"| warning unique:",wU);

if(allPass&&generated.length===144){
  console.log("\n=== ALL CHECKS PASSED: writing to file ===");
  const newAll=all.filter(e=>e.hexagramId!==9&&e.hexagramId!==10);
  newAll.push(...generated);
  newAll.sort((a,b)=>(a.id||"").localeCompare(b.id||""));
  console.log("Total entries after merge:",newAll.length);
  const out="window.Zero1MatrixData = window.Zero1MatrixData || {};\nwindow.Zero1MatrixData.lineCategoryInterpretations = "+JSON.stringify(newAll)+";";
  fs.writeFileSync(TARGET,out,"utf8");
  console.log("Written:",TARGET);
  const vr=fs.readFileSync(TARGET,"utf8");
  console.log("Format: header="+vr.startsWith("window.Zero1MatrixData = window.Zero1MatrixData || {};\nwindow.Zero1MatrixData.lineCategoryInterpretations = ["));
  console.log("Ending with ]: "+vr.endsWith("];"));
  try{new Function(vr);console.log("Syntax check: PASS");}catch(e){console.log("Syntax check: FAIL - "+e.message);}
  console.log("\nDone! 144 entries generated and written.");
} else {
  console.log("\n=== CHECKS FAILED or count wrong, NOT writing ===");
  console.log("Pass:",allPass,"Count:",generated.length,"(need 144)");
}