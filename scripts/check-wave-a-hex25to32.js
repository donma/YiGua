const fs = require("fs");
const crypto = require("crypto");
const vm = require("vm");
const path = require("path");

const root = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(__dirname, "..");
const dataDir = path.join(root, "src", "data");
const hashes = JSON.parse(fs.readFileSync(path.join(root, "scripts", "prot_hashes_25to64.json"), "utf8"));

const hexNames = ["無妄","大畜","頤","大過","坎","離","咸","恆"];
const catNames = ["一般","工作事業","感情關係","財務金錢","人際合作","家庭親人","學習考試","身心狀態","重大決策","創業經營","官非合約","心境修行"];
const hexImagery = [
    "無妄往吉","不耕穫不菑畬","無妄之災","或繫之牛","無妄之疾勿藥有喜","無妄行有眚","天下雷行","無妄",
    "有厲利已","輿說輹","良馬逐","童牛之牿","豶豕之牙","何天之衢","天在山中","多識前言往行","大畜",
    "觀頤自求口實","舍爾靈龜","顛頤","拂頤","虎視眈眈","由頤","慎言語節飲食","頤",
    "棟橈凶","棟橈","棟隆吉","藉用白茅","枯楊生稊","枯楊生華","過涉滅頂","澤滅木","大過",
    "習坎","有孚維心亨","行有尚","坎窞","求小得","來之坎坎","樽酒簋貳","坎不盈","係用徽纆","水洊至","坎",
    "履錯然","黃離元吉","日昃之離","突如其來如","出涕沱若","王用出征","明兩作","大人以繼明照于四方","離",
    "咸其拇","咸其腓","咸其股","執其隨","憧憧往來","咸其脢","咸其輔頰舌","山上有澤","咸",
    "浚恆","悔亡","不恆其德","田無禽","恆其德","振恆","雷風恆","君子以立不易方","恆",
];
const commonTerms = ["建議","可以","可先","應該","必須","風險","隱患","需要注意","危險","目前","現在","眼前","當前","階段","時期","過程","調整","改變","修正","最重要","當下","最近"];

function norm(text) {
    let t = String(text||"");
    for (const h of hexNames) t = t.replace(new RegExp(h,"g"), "");
    for (const i of hexImagery) t = t.replace(new RegExp(i.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"g"), "");
    for (const c of catNames) t = t.replace(new RegExp(c,"g"), "");
    for (const ct of commonTerms) t = t.replace(new RegExp(ct,"g"), "");
    t = t.replace(/[a-zA-Z\d]+|[，。、；：！？""''「」『』／（）\s]/g,"");
    return t;
}

function loadModule(filePath) {
    let code = fs.readFileSync(filePath, "utf8");
    const sandbox = { window: { Zero1MatrixData: {} }, console };
    require("vm").createContext(sandbox);
    require("vm").runInContext(code, sandbox);
    return sandbox.window.Zero1MatrixData;
}

const cat = loadModule(path.join(dataDir, "categoryInterpretations.data.js"));
const refl = loadModule(path.join(dataDir, "reflectionQuestions.data.js"));
const hex = loadModule(path.join(dataDir, "hexagrams.data.js"));
const catArr = cat.categoryInterpretations;
const reflArr = refl.reflectionQuestions;
const ciW = catArr.filter(x => x.hexagramId >= 25 && x.hexagramId <= 32);
const rfW = reflArr.filter(x => x.hexagramId >= 25 && x.hexagramId <= 32);

let allPass = true;

console.log("=== WAVE A CATEGORY 25-32 ===");
console.log("total=" + ciW.length + " unique_ids=" + new Set(ciW.map(x => x.id)).size);
const th = { m: ciW.filter(x=>(x.meaning||"").length>=110).length, a: ciW.filter(x=>(x.advice||"").length>=90).length, w: ciW.filter(x=>(x.warning||"").length>=70).length, t: ciW.filter(x=>(x.timing||"").length>=55).length, b: ciW.filter(x=>x.basis&&x.basis.length>=4).length };
for (const [k,v] of Object.entries(th)) {
    const p = v === 96;
    console.log(k + ">=" + ({m:"110",a:"90",w:"70",t:"55",b:"4"}[k]) + ": " + v + "/96 " + (p?"PASS":"FAIL"));
    if (!p) allPass = false;
}

console.log("\n--- Per-hex normU ---");
for (let hid = 25; hid <= 32; hid++) {
    const arr = ciW.filter(x => x.hexagramId === hid);
    const mu = new Set(arr.map(x => norm(x.meaning))).size;
    const au = new Set(arr.map(x => norm(x.advice))).size;
    const wu = new Set(arr.map(x => norm(x.warning))).size;
    const tu = new Set(arr.map(x => norm(x.timing))).size;
    const p = mu === 12 && au >= 11 && wu >= 10 && tu >= 10;
    console.log("hex " + hid + ": m=" + mu + " a=" + au + " w=" + wu + " t=" + tu + " " + (p?"PASS":"FAIL"));
    if (!p) allPass = false;
}

const fmu = new Set(ciW.map(x => norm(x.meaning))).size;
const fau = new Set(ciW.map(x => norm(x.advice))).size;
const fwu = new Set(ciW.map(x => norm(x.warning))).size;
const ftu = new Set(ciW.map(x => norm(x.timing))).size;
console.log("\nfull-batch: mU=" + fmu + " aU=" + fau + " wU=" + fwu + " tU=" + ftu + " " + (fmu>=92&&fau>=88&&fwu>=84&&ftu>=84?"PASS":"FAIL"));
if (!(fmu>=92&&fau>=88&&fwu>=84&&ftu>=84)) allPass = false;

const SAFE = ["本欄不做醫療診斷","本欄不做獲利保證","本欄不做法律結果判定"];
function splitSentences(text) { return (text||"").split(/[。！？；!?;]/).map(s=>s.trim()).filter(s=>s.length>=8 && !SAFE.includes(s)); }
const sentMap = {};
for (const x of ciW) for (const f of ["meaning","advice","warning","timing"]) for (const s of splitSentences(x[f]||"")) { if (!sentMap[s]) sentMap[s]={c:0}; sentMap[s].c++; }
const dups = Object.entries(sentMap).filter(([,v]) => v.c > 2);
console.log("\ndup sents>2 (exc safe): " + dups.length + " " + (dups.length===0?"PASS":"FAIL"));
if (dups.length > 0) allPass = false;

const sk = ["上卦帶來推力","兩股力量需要取得平衡","保持彈性並等待時機","不要太快也不要太慢","先觀察再決定","目前仍有調整空間","這是一個需要耐心的階段","每個階段都有不同挑戰","最基礎的準備最重要","此分類最常見的誤判"];
let skh = 0;
for (const s of sk) { const m = ciW.map(x=>(x.meaning||"")+(x.advice||"")+(x.warning||"")).join(" ").match(new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"g")); if (m) skh += m.length; }
console.log("skeleton: " + skh + " " + (skh<=4?"PASS":"FAIL"));
if (skh > 4) allPass = false;

const fw = ["必定成功","保證獲利","官司一定贏","停止就醫","必有災禍"];
let fh = 0;
for (const w of fw) if (JSON.stringify(ciW).includes(w)) fh++;
console.log("forbidden: " + fh + " " + (fh===0?"PASS":"FAIL"));
if (fh > 0) allPass = false;

console.log("\n=== WAVE A REFLECTION 25-32 ===");
console.log("total=" + rfW.length + " unique_ids=" + new Set(rfW.map(x => x.id)).size);
const qLen = rfW.filter(x=>(x.question||"").length>=38&&(x.question||"").length<=105).length;
const qm = rfW.filter(x=>(x.question||"").endsWith("？")).length;
console.log("length 38-105: " + qLen + "/288 q-marks: " + qm + "/288");

const grps = {};
for (const x of rfW) { const k = x.hexagramId+"-"+x.category; if(!grps[k]) grps[k]=[]; grps[k].push(x); }
let grpFail = 0;
for (const a of Object.values(grps)) { if (new Set(a.map(x=>norm(x.question))).size < 3) grpFail++; }
const qu = new Set(rfW.map(x=>norm(x.question))).size;
console.log("groups: " + Object.values(grps).filter(x=>x.length===3).length + "/96 fail:" + grpFail + " normU:" + qu + " " + (qu>=260?"PASS":"FAIL"));
if (qu < 260) allPass = false;

for (let hid = 25; hid <= 32; hid++) { const u = new Set(rfW.filter(x=>x.hexagramId===hid).map(x=>norm(x.question))).size; console.log("hex " + hid + ": " + u + "/36 " + (u>=32?"PASS":"FAIL")); if (u<32) allPass = false; }

const qDups = rfW.map(x=>x.question).filter((q,i,arr)=>arr.indexOf(q)!==i).length;
console.log("\ndup questions: " + qDups + " " + (qDups===0?"PASS":"FAIL"));
if (qDups > 0) allPass = false;

const rfSk = ["你比較接近","你最需要做出的調整","哪條界線尚未準備好跨越","現在哪一股力量更明顯","下一步要前進還是停下","最容易忽略的風險","你是否已經準備好","你可以如何調整","目前最需要注意什麼","什麼選擇最適合你"];
let rfSkh = 0;
const rTxt = rfW.map(x=>x.question||"").join("\n");
for (const s of rfSk) { const m = rTxt.match(new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"g")); if (m) rfSkh += m.length; }
console.log("rf skeleton: " + rfSkh + " " + (rfSkh<=4?"PASS":"FAIL"));
if (rfSkh > 4) allPass = false;

function hashSection(d) { return crypto.createHash("sha256").update(JSON.stringify(d)).digest("hex"); }
function hashFile(fp) { return crypto.createHash("sha256").update(fs.readFileSync(fp,"utf8")).digest("hex"); }
console.log("\n=== PROTECTED HASHES ===");
const checks = [
    ["Category hex 1-24", hashes.cat_h1to24, hashSection(catArr.filter(x=>x.hexagramId>=1&&x.hexagramId<=24))],
    ["Reflection hex 1-24", hashes.refl_h1to24, hashSection(reflArr.filter(x=>x.hexagramId>=1&&x.hexagramId<=24))],
    ["hexagrams", hashes.hexagrams, hashSection(hex.hexagrams)],
    ["lines", hashes.lines_file, hashFile(path.join(dataDir,"lines.data.js"))],
    ["pairInterpretations", hashes.pairInterpretations_file, hashFile(path.join(dataDir,"pairInterpretations.data.js"))],
    ["lineCategory", hashes.lineCategoryInterpretations_file, hashFile(path.join(dataDir,"lineCategoryInterpretations.data.js"))],
    ["action", hashes.actionSuggestions_file, hashFile(path.join(dataDir,"actionSuggestions.data.js"))],
    ["risk", hashes.riskWarnings_file, hashFile(path.join(dataDir,"riskWarnings.data.js"))],
];
let hOk = true;
for (const [name, expected, actual] of checks) {
    const p = expected === actual;
    console.log((p?"OK":"CHANGED") + ": " + name);
    if (!p) hOk = false;
}
if (!hOk) allPass = false;

// Frozen hash auto-write removed. Use scripts/create-wave-frozen-hash.js to create/update frozen hashes.
const frozen = { wave: "A", scope: "hex 25-32", cat: hashSection(catArr.filter(x=>x.hexagramId>=25&&x.hexagramId<=32)), refl: hashSection(reflArr.filter(x=>x.hexagramId>=25&&x.hexagramId<=32)) };
const frozenAExternal = JSON.parse(fs.readFileSync(path.join(root,"scripts","frozen_wave_a.json"),"utf8"));
if (frozen.cat !== frozenAExternal.cat || frozen.refl !== frozenAExternal.refl) { console.log("WARNING: Wave A data differs from frozen hash. Run create-wave-frozen-hash.js if intentional."); }

if (!allPass) process.exitCode = 1;
console.log("\n=== WAVE A GATE: " + (allPass?"ALL PASS":"FAIL") + " ===");