const fs = require("fs"), crypto = require("crypto"), vm = require("vm"), path = require("path");
const root = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(__dirname, "..");
const dataDir = path.join(root, "src", "data");
const frozen1Path = path.join(root, "scripts", "frozen_linecat_wave_01.json");
const frozen2Path = path.join(root, "scripts", "frozen_linecat_wave_02.json");
const protPath = path.join(root, "scripts", "linecat_prot_hashes.json");
const hashes = JSON.parse(fs.readFileSync(protPath, "utf8"));
function loadModule(fp) { let c = fs.readFileSync(fp,"utf8"); const s = { window: { Zero1MatrixData: {} }, console }; vm.createContext(s); vm.runInContext(c,s); return s.window.Zero1MatrixData; }
function hk(d) { return crypto.createHash("sha256").update(JSON.stringify(d)).digest("hex"); }
function hf(fp) { return crypto.createHash("sha256").update(fs.readFileSync(fp,"utf8")).digest("hex"); }

const lc = loadModule(path.join(dataDir, "lineCategoryInterpretations.data.js"));
const cat = loadModule(path.join(dataDir, "categoryInterpretations.data.js"));
const refl = loadModule(path.join(dataDir, "reflectionQuestions.data.js"));
const hex = loadModule(path.join(dataDir, "hexagrams.data.js"));
const lines = loadModule(path.join(dataDir, "lines.data.js"));
const lcArr = lc.lineCategoryInterpretations;
const ciW = lcArr.filter(x => x.hexagramId >= 5 && x.hexagramId <= 8);

const hexNames = ["需","訟","師","比"];
const catNames = ["一般","工作事業","感情關係","財務金錢","人際合作","家庭親人","學習考試","身心狀態","重大決策","創業經營","官非合約","心境修行"];
const imagery = [
    "有孚光亨","利涉大川","雲上於天","飲食宴樂","需于郊","利用恆","無咎","需于沙","小有言","終吉","需于泥","致寇至","需于血","出自穴","需于酒食","貞吉","入于穴","有不速之客三人來","敬之終吉","需",
    "有孚窒惕","中吉","終凶","利見大人","不利涉大川","天與水違行","作事謀始","不永所事","不克訟","歸而逋","其邑人三百戶","無眚","食舊德","貞厲","或從王事","無成","復即命","渝安貞","訟元吉","或錫之鞶帶","終朝三褫之","訟",
    "丈人吉","地中有水","容民畜眾","師出以律","否臧凶","在師中","王三錫命","師或輿尸","師左次","田有禽","利執言","長子帥師","弟子輿尸","大君有命","開國承家","小人勿用","師",
    "原筮元永貞","不寧方來","後夫凶","地上有水","建萬國親諸侯","有孚比之","有孚盈缶","終來有他吉","比之自內","比之匪人","外比之","顯比","王用三驅","失前禽","邑人不誡","比之無首","比"
];
const common = ["建議","可以","可先","應該","必須","風險","隱患","需要注意","危險","目前","現在","眼前","當前","階段","時期","過程","調整","改變","修正","最重要","當下","最近"];

function norm(t) {
    let s = String(t||"");
    for (const h of hexNames) s = s.replace(new RegExp(h,"g"), "");
    for (const i of imagery) { const esc = i.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"); s = s.replace(new RegExp(esc,"g"), ""); }
    for (const c of catNames) s = s.replace(new RegExp(c,"g"), "");
    for (const ct of common) s = s.replace(new RegExp(ct,"g"), "");
    s = s.replace(/[a-zA-Z\d]+|[，。、；：！？""''「」『』／（）\s]/g,"");
    return s;
}

let allPass = true;

console.log("=== WAVE 02 LINE CATEGORY HEX 5-8 ===");
console.log("total=" + ciW.length + " unique_ids=" + new Set(ciW.map(x=>x.id)).size);
if (ciW.length !== 288 || new Set(ciW.map(x=>x.id)).size !== 288) allPass = false;

// Metadata
console.log("gold=" + ciW.filter(x=>x.qualityLevel==="gold").length + "/288");
console.log("reviewed=true=" + ciW.filter(x=>x.reviewed===true).length + "/288");
console.log("needsHumanReview=false=" + ciW.filter(x=>x.needsHumanReview===false).length + "/288");
console.log("needsExpansion=false=" + ciW.filter(x=>x.needsExpansion===false).length + "/288");
const rbOk = ciW.filter(x=>x.reviewedBy==="line-category-gold-wave-02").length;
console.log("reviewedBy correct=" + rbOk + "/288"); if (rbOk!==288) allPass=false;
const raOk = ciW.filter(x=>x.reviewedAt && String(x.reviewedAt).match(/^\d{4}-\d{2}-\d{2}$/)).length;
console.log("reviewedAt valid=" + raOk + "/288"); if (raOk!==288) allPass=false;

for (let h = 5; h <= 8; h++) { if (ciW.filter(x=>x.hexagramId===h).length !== 72) { console.log("Hex "+h+" count FAIL"); allPass=false; } }
console.log("hex coverage: 4/4");

// Thresholds
const th = { m: ciW.filter(x=>(x.meaning||"").length>=90).length, a: ciW.filter(x=>(x.advice||"").length>=75).length, w: ciW.filter(x=>(x.warning||"").length>=55).length, b: ciW.filter(x=>(x.basis||[]).length>=4).length };
for (const [k,v] of Object.entries(th)) { const p=v===288; console.log(k+">="+({m:"90",a:"75",w:"55",b:"4"}[k])+": "+v+"/288 "+(p?"PASS":"FAIL")); if(!p)allPass=false; }
const saOk = ciW.filter(x=>x.scoreAdjust&&"clarity"in x.scoreAdjust&&"action"in x.scoreAdjust&&"risk"in x.scoreAdjust&&"change"in x.scoreAdjust&&"support"in x.scoreAdjust&&"timing"in x.scoreAdjust).length;
console.log("scoreAdjust complete: " + saOk + "/288 " + (saOk===288?"PASS":"FAIL")); if(saOk!==288)allPass=false;

// Double punctuation
let dp = 0;
for (const x of ciW) for (const f of ["meaning","advice","warning","basis"]) { if (typeof x[f]==="string" && x[f].match(/。。|，，|；；|！！|？？/)) dp++; if (Array.isArray(x[f]) && x[f].some(b=>typeof b==="string" && b.match(/。。|，，|；；|！！|？？/))) dp++; }
console.log("double punctuation: " + dp + " " + (dp===0?"PASS":"FAIL")); if(dp>0)allPass=false;

// Empty basis
let eb = ciW.filter(x => x.basis && Array.isArray(x.basis) && x.basis.some(b => !b || String(b).trim()==="")).length;
console.log("empty basis item: " + eb + " " + (eb===0?"PASS":"FAIL")); if(eb>0)allPass=false;

console.log("\n--- Same-line 12-category normU ---");
let lineFail=0;for(let h=5;h<=8;h++)for(let l=1;l<=6;l++){const g=ciW.filter(x=>x.hexagramId===h&&x.line===l);const mu=new Set(g.map(x=>norm(x.meaning))).size,au=new Set(g.map(x=>norm(x.advice))).size,wu=new Set(g.map(x=>norm(x.warning))).size;if(mu!==12||au<11||wu<10){lineFail++;allPass=false;}}
console.log("same-line: "+(24-lineFail)+"/24 PASS, fail:"+lineFail);

console.log("--- Same-category 6-line normU ---");
let catFail=0;const allCats=["general","career","love","money","people","family","study","health","decision","business","legal","spiritual"];
for(let h=5;h<=8;h++)for(const c of allCats){const g=ciW.filter(x=>x.hexagramId===h&&x.category===c).sort((a,b)=>a.line-b.line);const mu=new Set(g.map(x=>norm(x.meaning))).size,au=new Set(g.map(x=>norm(x.advice))).size,wu=new Set(g.map(x=>norm(x.warning))).size;if(mu!==6||au<5||wu<5){catFail++;allPass=false;}}
console.log("same-category: "+(48-catFail)+"/48 PASS, fail:"+catFail);

const fmu=new Set(ciW.map(x=>norm(x.meaning))).size,fau=new Set(ciW.map(x=>norm(x.advice))).size,fwu=new Set(ciW.map(x=>norm(x.warning))).size;
console.log("\nWave normU: m="+fmu+" a="+fau+" w="+fwu+" "+(fmu>=276&&fau>=264&&fwu>=252?"PASS":"FAIL"));
if(!(fmu>=276&&fau>=264&&fwu>=252))allPass=false;

const SAFE=["本欄不做醫療診斷","本欄不做獲利保證","本欄不做法律結果判定","本欄不做医療診断","本欄不做獲利保証"];
function splits(t){return(t||"").split(/[。！？；!?;]/).map(s=>s.trim()).filter(s=>s.length>=8&&!SAFE.includes(s));}
const sm={};for(const x of ciW)for(const f of["meaning","advice","warning"])for(const s of splits(x[f]||"")){if(!sm[s])sm[s]={c:0};sm[s].c++;}
const dups=Object.entries(sm).filter(([,v])=>v.c>2);console.log("dup sents>2: "+dups.length+" "+(dups.length===0?"PASS":"FAIL"));if(dups.length>0)allPass=false;
const sk=["此為","結合","起步階段","力量尚未成熟","觀察準備","貿然行動","保持彈性","順勢而為","審慎評估","多加溝通","等待成熟","在此分類中","建議先理解"];
let skh=0;const tTxt=ciW.map(x=>(x.meaning||"")+(x.advice||"")+(x.warning||"")).join(" ");for(const s of sk){const esc=s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");const m=tTxt.match(new RegExp(esc,"g"));if(m)skh+=m.length;}
console.log("skeleton: "+skh+" "+(skh<=4?"PASS":"FAIL"));if(skh>4)allPass=false;
const fw=["必定成功","保證獲利","官司一定贏","停止就醫","必有災禍"];let fh=0;for(const w of fw)if(JSON.stringify(ciW).includes(w))fh++;
console.log("forbidden: "+fh+" "+(fh===0?"PASS":"FAIL"));if(fh>0)allPass=false;

// Frozen W01 + W02
console.log("\n=== FROZEN HASHES ===");
let fOk=true;
for (const [nm,fp,lo,hi] of [["Wave 01",frozen1Path,1,4],["Wave 02",frozen2Path,5,8]]) {
    if(!fs.existsSync(fp)){console.log(nm+": MISSING");fOk=false;}
    else{const f=JSON.parse(fs.readFileSync(fp,"utf8"));const cOk=f.hash===hk(lcArr.filter(x=>x.hexagramId>=lo&&x.hexagramId<=hi));console.log(nm+": "+(cOk?"VERIFIED":"CHANGED!"));if(!cOk)fOk=false;}
}
if(!fOk)allPass=false;

console.log("\n=== PROTECTED HASHES ===");
const checks=[["hexagrams",hashes.hexagrams,hk(hex.hexagrams)],["lines",hashes.lines,hk(lines.lineData||lines.lines||[])],["cat",hashes.categoryInterpretations,hk(cat.categoryInterpretations)],["refl",hashes.reflectionQuestions,hk(refl.reflectionQuestions)],["pair",hashes.pairInterpretations_file,hf(path.join(dataDir,"pairInterpretations.data.js"))],["action",hashes.actionSuggestions_file,hf(path.join(dataDir,"actionSuggestions.data.js"))],["risk",hashes.riskWarnings_file,hf(path.join(dataDir,"riskWarnings.data.js"))]];
let hOk=true;for(const[n,exp,act]of checks){const p=exp===act;console.log((p?"OK":"CHANGED")+": "+n);if(!p)hOk=false;}
if(!hOk)allPass=false;

if(!allPass)process.exitCode=1;
console.log("\n=== WAVE 02 GATE: "+(allPass?"ALL PASS":"FAIL")+" ===");
