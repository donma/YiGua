// w03_lc_hex11_redo.js — REGENERATE Hex 11 ONLY (72 entries)
// Reads 6 line-specific JSON data files, generates 72 entries, writes to target
// Node: D:\AI_PROJECTS\Zero1Matrix\.nodejs\node-v22.14.0-win-x64\node.exe

const fs = require("fs"), path = require("path");
const ROOT = "D:\\AI_PROJECTS\\Zero1Matrix";
const TARGET = path.join(ROOT, "src", "data", "lineCategoryInterpretations.data.js");

const raw = fs.readFileSync(TARGET, "utf8");
const m = raw.match(/window\.Zero1MatrixData\.lineCategoryInterpretations = (\[.*\]);?$/s);
if (!m) { console.error("PARSE FAIL"); process.exit(1); }
const all = JSON.parse(m[1]);
console.log("Loaded:", all.length);

const CATS = ["general","career","love","money","people","family","study","health","decision","business","legal","spiritual"];
const CN = {general:"一般",career:"工作事業",love:"感情關係",money:"財務金錢",people:"人際合作",family:"家庭親人",study:"學習考試",health:"身心狀態",decision:"重大決策",business:"創業經營",legal:"官非合約",spiritual:"心境修行"};
const V = "2.0.0-w03";
const DISCL = {health:"本欄不做醫療診斷。",business:"本欄不做獲利保證。",legal:"本欄不做法律結果判定。"};

const SA = [null,
  {clarity:3,action:2,risk:1,change:2,support:3,timing:2},
  {clarity:4,action:3,risk:2,change:2,support:3,timing:2},
  {clarity:3,action:1,risk:3,change:3,support:1,timing:1},
  {clarity:2,action:1,risk:2,change:2,support:2,timing:1},
  {clarity:4,action:2,risk:1,change:3,support:4,timing:3},
  {clarity:3,action:1,risk:4,change:3,support:1,timing:-1}
];

function mk(hid,line,cat,m,a,w,b){
  const d = DISCL[cat] ? "。"+DISCL[cat] : "";
  return {
    id:"hex-"+String(hid).padStart(3,"0")+"-line-"+line+"-"+cat,
    hexagramId:hid,line,category:cat,categoryName:CN[cat],
    meaning:m+d, advice:a, warning:w+(DISCL[cat]||""),
    basis:b, scoreAdjust:{...SA[line]},
    qualityLevel:"refined",needsHumanReview:true,version:V,
    reviewed:false,reviewedBy:"",reviewedAt:"",needsExpansion:true
  };
}

// Load all 6 line data files
const generated = [];

for (let line = 1; line <= 6; line++) {
  const dataPath = path.join(__dirname, `w03_hex11_line${line}.json`);
  const lineData = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  
  for (const cat of CATS) {
    const entry = lineData[cat];
    if (!entry) {
      console.error(`MISSING DATA: hex 11 line ${line} category ${cat}`);
      process.exit(1);
    }
    generated.push(mk(11, line, cat, entry.m, entry.a, entry.w, entry.b));
  }
  
  console.log(`Line ${line}: 12 entries loaded`);
}

console.log(`\nTotal generated: ${generated.length} entries`);

// VERIFICATION
console.log("\n=== VERIFICATION ===");
let allPass = true, failCount = 0;
for (const e of generated) {
  const ml = (e.meaning||"").length;
  const al = (e.advice||"").length;
  const wl = (e.warning||"").length;
  const bl = (e.basis||[]).length;
  const ok = ml >= 100 && al >= 85 && wl >= 65 && bl >= 4;
  if (!ok) {
    console.log(`FAIL: ${e.id} m=${ml} a=${al} w=${wl} b=${bl}`);
    allPass = false;
    failCount++;
  }
}

// Uniqueness check across all 72
function short(s) { return String(s||"").substring(0,60); }
const mU = new Set(generated.map(e=>short(e.meaning))).size;
const aU = new Set(generated.map(e=>short(e.advice))).size;
const wU = new Set(generated.map(e=>short(e.warning))).size;
console.log(`meaning unique: ${mU}/72 | advice unique: ${aU}/72 | warning unique: ${wU}/72`);

// Per-line uniqueness
for (let ln = 1; ln <= 6; ln++) {
  const le = generated.filter(e=>e.line===ln);
  const mu = new Set(le.map(e=>short(e.meaning))).size;
  const au = new Set(le.map(e=>short(e.advice))).size;
  const wu = new Set(le.map(e=>short(e.warning))).size;
  const uOk = mu>=10 && au>=10 && wu>=10;
  console.log(`L${ln}: mU=${mu}/12 aU=${au}/12 wU=${wu}/12 ${uOk?"PASS":"*FAIL*"}`);
  if (!uOk) allPass = false;
}

// Check for template poison
const templatePhrases = [
  "天地交的流通格局確保資訊與能量在系統中暢通傳導",
  "小往大來的規律讓微小投入在此時期獲得不成比例的巨大回報",
  "具體到X層面，將上述通用行動框架轉化",
  "行動後記錄X的變化作為效果驗證",
  "在X的具體場景中，這表現為忽略環境反饋信號"
];
console.log("\n=== TEMPLATE POISON CHECK ===");
let poisonFound = false;
for (const tp of templatePhrases) {
  let count = 0;
  for (const e of generated) {
    if (e.meaning.includes(tp) || (e.advice||"").includes(tp) || (e.warning||"").includes(tp)) count++;
  }
  if (count > 0) {
    console.log(`POISON FOUND: "${tp.substring(0,50)}..." appears ${count} times`);
    poisonFound = true;
    allPass = false;
  }
}
if (!poisonFound) console.log("CLEAN: No template poison detected");

if (failCount > 0) console.log(`\nFAILURES: ${failCount} entries fail length thresholds`);
else console.log(`\nALL ${generated.length} entries PASS length thresholds`);

if (!allPass) {
  console.log("\n=== VERIFICATION FAILED — NOT WRITING ===");
  process.exit(1);
}

// WRITE TO TARGET
const filtered = all.filter(e => e.hexagramId !== 11);
const merged = [...filtered, ...generated];
console.log(`\nMerged total: ${merged.length} (was ${all.length}, removed ${all.length - filtered.length}, added ${generated.length})`);

const output = "window.Zero1MatrixData = window.Zero1MatrixData || {};\nwindow.Zero1MatrixData.lineCategoryInterpretations = " + JSON.stringify(merged) + ";";
fs.writeFileSync(TARGET, output, "utf8");
console.log("Written:", TARGET);

// Format check
const vr = fs.readFileSync(TARGET, "utf8");
console.log("Header OK:", vr.startsWith("window.Zero1MatrixData = window.Zero1MatrixData || {};\nwindow.Zero1MatrixData.lineCategoryInterpretations = ["));
console.log("Ends with ]:", vr.endsWith("];"));

// Syntax check
try { new Function(vr); console.log("Syntax check: PASS"); } catch(e) { console.log("Syntax check: FAIL - " + e.message); process.exit(1); }

console.log("\n=== DONE: Hex 11 regeneration complete ===");
