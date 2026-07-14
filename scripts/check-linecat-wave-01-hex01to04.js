const fs = require("fs"), crypto = require("crypto"), vm = require("vm"), path = require("path");
const root = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(__dirname, "..");
const dataDir = path.join(root, "src", "data");
const hashes = JSON.parse(fs.readFileSync(path.join(root, "scripts", "linecat_prot_hashes.json"), "utf8"));
const frozenPath = path.join(root, "scripts", "frozen_linecat_wave_01.json");

function loadModule(fp) { let c = fs.readFileSync(fp,"utf8"); const s = { window: { Zero1MatrixData: {} }, console }; vm.createContext(s); vm.runInContext(c,s); return s.window.Zero1MatrixData; }
function hk(d) { return crypto.createHash("sha256").update(JSON.stringify(d)).digest("hex"); }
function hf(fp) { return crypto.createHash("sha256").update(fs.readFileSync(fp,"utf8")).digest("hex"); }

const lc = loadModule(path.join(dataDir, "lineCategoryInterpretations.data.js"));
const cat = loadModule(path.join(dataDir, "categoryInterpretations.data.js"));
const refl = loadModule(path.join(dataDir, "reflectionQuestions.data.js"));
const hex = loadModule(path.join(dataDir, "hexagrams.data.js"));
const lines = loadModule(path.join(dataDir, "lines.data.js"));
const lcArr = lc.lineCategoryInterpretations;
const ciW = lcArr.filter(x => x.hexagramId >= 1 && x.hexagramId <= 4);

const hexNamesAll = ["乾","坤","屯","蒙"];
const catNames = ["一般","工作事業","感情關係","財務金錢","人際合作","家庭親人","學習考試","身心狀態","重大決策","創業經營","官非合約","心境修行"];
const imagery = [
    "潛龍勿用","見龍在田","利見大人","終日乾乾","夕惕若","或躍在淵","飛龍在天","亢龍有悔","群龍無首","元亨利貞","天行健","自強不息","乾為天",
    "履霜堅冰至","履霜","堅冰至","直方大","不習無不利","含章可貞","或從王事","無成有終","括囊","無咎無譽","黃裳","元吉","龍戰于野","其血玄黃","利牝馬之貞","地勢坤","厚德載物","坤為地",
    "磐桓","利居貞","利建侯","屯如邅如","乘馬班如","匪寇婚媾","女子貞不字","十年乃字","即鹿無虞","惟入于林中","君子幾不如舍","往吝","求婚媾","往吉","屯其膏","小貞吉","大貞凶","泣血漣如","勿用有攸往","雲雷屯","君子以經綸",
    "發蒙","利用刑人","用說桎梏","以往吝","包蒙吉","納婦吉","子克家","勿用取女","見金夫","不有躬","無攸利","困蒙吝","童蒙吉","擊蒙","不利為寇","利禦寇","匪我求童蒙","童蒙求我","山下出泉","果行育德"
];
const common = ["建議","可以","可先","應該","必須","風險","隱患","需要注意","危險","目前","現在","眼前","當前","階段","時期","過程","調整","改變","修正","最重要","當下","最近"];

function norm(t) {
    let s = String(t||"");
    for (const h of hexNamesAll) s = s.replace(new RegExp(h,"g"), "");
    for (const i of imagery) { const esc = i.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"); s = s.replace(new RegExp(esc,"g"), ""); }
    for (const c of catNames) s = s.replace(new RegExp(c,"g"), "");
    for (const ct of common) s = s.replace(new RegExp(ct,"g"), "");
    s = s.replace(/[a-zA-Z\d]+|[，。、；：！？""''「」『』／（）\s]/g,"");
    return s;
}

let allPass = true;

console.log("=== WAVE 01 LINE CATEGORY HEX 1-4 ===");
console.log("total=" + ciW.length + " unique_ids=" + new Set(ciW.map(x=>x.id)).size);
if (ciW.length !== 288 || new Set(ciW.map(x=>x.id)).size !== 288) allPass = false;

// Metadata gate
console.log("gold=" + ciW.filter(x=>x.qualityLevel==="gold").length + "/288");
if (ciW.filter(x=>x.qualityLevel==="gold").length !== 288) allPass = false;
console.log("reviewed=true=" + ciW.filter(x=>x.reviewed===true).length + "/288");
if (ciW.filter(x=>x.reviewed===true).length !== 288) allPass = false;
console.log("needsHumanReview=false=" + ciW.filter(x=>x.needsHumanReview===false).length + "/288");
if (ciW.filter(x=>x.needsHumanReview===false).length !== 288) allPass = false;
console.log("needsExpansion=false=" + ciW.filter(x=>x.needsExpansion===false).length + "/288");
if (ciW.filter(x=>x.needsExpansion===false).length !== 288) allPass = false;
const rbOk = ciW.filter(x=>x.reviewedBy==="line-category-gold-wave-01").length;
console.log("reviewedBy correct=" + rbOk + "/288");
if (rbOk !== 288) allPass = false;
const raOk = ciW.filter(x=>x.reviewedAt && String(x.reviewedAt).match(/^\d{4}-\d{2}-\d{2}$/)).length;
console.log("reviewedAt valid=" + raOk + "/288");
if (raOk !== 288) allPass = false;

// Per-hex counts
for (let h = 1; h <= 4; h++) {
    const hexE = ciW.filter(x => x.hexagramId === h);
    if (hexE.length !== 72) { console.log("Hex " + h + " entries: " + hexE.length + " (expected 72)"); allPass = false; }
}
console.log("hex coverage: 4/4");

// Thresholds
const th = { m: ciW.filter(x=>(x.meaning||"").length>=90).length, a: ciW.filter(x=>(x.advice||"").length>=75).length, w: ciW.filter(x=>(x.warning||"").length>=55).length, b: ciW.filter(x=>x.basis&&x.basis.length>=4).length };
for (const [k,v] of Object.entries(th)) { const p = v===288; console.log(k+">="+({m:"90",a:"75",w:"55",b:"4"}[k])+": "+v+"/288 "+(p?"PASS":"FAIL")); if(!p)allPass=false; }

// scoreAdjust check
const saOk = ciW.filter(x => x.scoreAdjust && typeof x.scoreAdjust === "object" && "clarity" in x.scoreAdjust && "action" in x.scoreAdjust && "risk" in x.scoreAdjust && "change" in x.scoreAdjust && "support" in x.scoreAdjust && "timing" in x.scoreAdjust).length;
console.log("scoreAdjust complete: " + saOk + "/288 " + (saOk===288?"PASS":"FAIL"));
if (saOk!==288) allPass=false;

// Same-line 12-category uniqueness
console.log("\n--- Same-line 12-category normU ---");
let lineGroupFail = 0;
for (let h = 1; h <= 4; h++) for (let line = 1; line <= 6; line++) {
    const g = ciW.filter(x => x.hexagramId === h && x.line === line);
    const mu = new Set(g.map(x => norm(x.meaning))).size, au = new Set(g.map(x => norm(x.advice))).size, wu = new Set(g.map(x => norm(x.warning))).size;
    if (mu !== 12 || au < 11 || wu < 10) { lineGroupFail++; allPass = false; }
}
console.log("same-line groups: " + (24-lineGroupFail) + "/24 PASS, fail: " + lineGroupFail);

// Same-category 6-line uniqueness
console.log("--- Same-category 6-line normU ---");
let catGroupFail = 0;
const allCats = ["general","career","love","money","people","family","study","health","decision","business","legal","spiritual"];
for (let h = 1; h <= 4; h++) for (const c of allCats) {
    const g = ciW.filter(x => x.hexagramId === h && x.category === c).sort((a,b) => a.line - b.line);
    const mu = new Set(g.map(x => norm(x.meaning))).size, au = new Set(g.map(x => norm(x.advice))).size, wu = new Set(g.map(x => norm(x.warning))).size;
    if (mu !== 6 || au < 5 || wu < 5) { catGroupFail++; allPass = false; }
}
console.log("same-category groups: " + (48-catGroupFail) + "/48 PASS, fail: " + catGroupFail);

// Wave normU
const fmu = new Set(ciW.map(x => norm(x.meaning))).size, fau = new Set(ciW.map(x => norm(x.advice))).size, fwu = new Set(ciW.map(x => norm(x.warning))).size;
console.log("\nWave normU: m=" + fmu + " a=" + fau + " w=" + fwu + " " + (fmu>=276&&fau>=264&&fwu>=252?"PASS":"FAIL"));
if (!(fmu>=276&&fau>=264&&fwu>=252)) allPass = false;

// Dup sentences
const SAFE = ["本欄不做醫療診斷","本欄不做獲利保證","本欄不做法律結果判定","本欄不做醫療診断","本欄不做獲利保証","本欄不做医療診断"];
function splits(t) { return (t||"").split(/[。！？；!?;]/).map(s=>s.trim()).filter(s=>s.length>=8 && !SAFE.includes(s)); }
const sm = {}; for (const x of ciW) for (const f of ["meaning","advice","warning"]) for (const s of splits(x[f]||"")) { if(!sm[s])sm[s]={c:0};sm[s].c++; }
const dups = Object.entries(sm).filter(([,v]) => v.c > 2);
console.log("dup sents>2: " + dups.length + " " + (dups.length===0?"PASS":"FAIL"));
if (dups.length > 0) allPass = false;

// Skeleton
const sk = ["此為","結合","起步階段","力量尚未成熟","觀察準備","貿然行動","保持彈性","順勢而為","審慎評估","多加溝通","等待成熟"];
let skh = 0; const tTxt = ciW.map(x=>(x.meaning||"")+(x.advice||"")+(x.warning||"")).join(" ");
for (const s of sk) { const esc = s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"); const m = tTxt.match(new RegExp(esc,"g")); if(m)skh+=m.length; }
console.log("skeleton: " + skh + " " + (skh<=4?"PASS":"FAIL")); if(skh>4)allPass=false;

// Forbidden
const fw = ["必定成功","保證獲利","官司一定贏","停止就醫","必有災禍"]; let fh = 0;
for (const w of fw) if(JSON.stringify(ciW).includes(w))fh++;
console.log("forbidden: " + fh + " " + (fh===0?"PASS":"FAIL")); if(fh>0)allPass=false;

// Protected hashes
console.log("\n=== PROTECTED HASHES ===");
const checks = [
    ["hexagrams",hashes.hexagrams,hk(hex.hexagrams)],
    ["lines",hashes.lines,hk(lines.lineData||lines.lines||[])],
    ["categoryInterpretations",hashes.categoryInterpretations,hk(cat.categoryInterpretations)],
    ["reflectionQuestions",hashes.reflectionQuestions,hk(refl.reflectionQuestions)],
    ["pairInterpretations",hashes.pairInterpretations_file,hf(path.join(dataDir,"pairInterpretations.data.js"))],
    ["actionSuggestions",hashes.actionSuggestions_file,hf(path.join(dataDir,"actionSuggestions.data.js"))],
    ["riskWarnings",hashes.riskWarnings_file,hf(path.join(dataDir,"riskWarnings.data.js"))],
];
let hOk=true; for(const[n,exp,act] of checks){const p=exp===act;console.log((p?"OK":"CHANGED")+": "+n);if(!p)hOk=false;}
if(!hOk)allPass=false;

// Frozen hash VERIFICATION (read-only)
console.log("\n=== WAVE 01 FROZEN HASH ===");
if (!fs.existsSync(frozenPath)) {
    console.log("MISSING: frozen_linecat_wave_01.json not found");
    allPass = false;
} else {
    const frozen = JSON.parse(fs.readFileSync(frozenPath, "utf8"));
    const currentHash = hk(ciW);
    const fOk = frozen.hash === currentHash;
    console.log(fOk ? "VERIFIED" : "CHANGED!");
    if (!fOk) allPass = false;
}

if (!allPass) process.exitCode = 1;
console.log("\n=== WAVE 01 GATE: " + (allPass ? "ALL PASS" : "FAIL") + " ===");
