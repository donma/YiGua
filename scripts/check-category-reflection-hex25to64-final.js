const fs = require("fs"), crypto = require("crypto"), vm = require("vm"), path = require("path");
const root = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(__dirname, "..");
const dataDir = path.join(root, "src", "data");
const hashes = JSON.parse(fs.readFileSync(path.join(root, "scripts", "prot_hashes_25to64.json"), "utf8"));

function loadModule(fp) { let c = fs.readFileSync(fp,"utf8"); const s = { window: { Zero1MatrixData: {} }, console }; vm.createContext(s); vm.runInContext(c,s); return s.window.Zero1MatrixData; }
function hk(d) { return crypto.createHash("sha256").update(JSON.stringify(d)).digest("hex"); }
function hf(fp) { return crypto.createHash("sha256").update(fs.readFileSync(fp,"utf8")).digest("hex"); }

const cat = loadModule(path.join(dataDir, "categoryInterpretations.data.js"));
const refl = loadModule(path.join(dataDir, "reflectionQuestions.data.js"));
const hexMod = loadModule(path.join(dataDir, "hexagrams.data.js"));
const catArr = cat.categoryInterpretations, reflArr = refl.reflectionQuestions;

const ciAll = catArr.filter(x => x.hexagramId >= 25 && x.hexagramId <= 64);
const rfAll = reflArr.filter(x => x.hexagramId >= 25 && x.hexagramId <= 64);

// Full hex name + imagery pool for normalization
const hexNamesAll = [
    "無妄","大畜","頤","大過","坎","離","咸","恆",
    "遯","大壯","晉","明夷","家人","睽","蹇","解",
    "損","益","夬","姤","萃","升","困","井",
    "革","鼎","震","艮","漸","歸妹","豐","旅",
    "巽","兌","渙","節","中孚","小過","既濟","未濟"
];
const catNames = ["一般","工作事業","感情關係","財務金錢","人際合作","家庭親人","學習考試","身心狀態","重大決策","創業經營","官非合約","心境修行"];
const allImagery = [
    "無妄往吉","不耕穫不菑畬","無妄之災","或繫之牛","無妄之疾勿藥有喜","無妄行有眚","天下雷行",
    "有厲利已","輿說輹","良馬逐","童牛之牿","豶豕之牙","何天之衢","天在山中","多識前言往行",
    "觀頤自求口實","舍爾靈龜","顛頤","拂頤","虎視眈眈","由頤","慎言語節飲食",
    "棟橈凶","棟橈","棟隆吉","藉用白茅","枯楊生稊","枯楊生華","過涉滅頂","澤滅木",
    "習坎","有孚維心亨","行有尚","坎窞","求小得","來之坎坎","樽酒簋貳","坎不盈","係用徽纆","水洊至",
    "履錯然","黃離元吉","日昃之離","突如其來如","出涕沱若","王用出征","明兩作","大人以繼明照于四方",
    "咸其拇","咸其腓","咸其股","執其隨","憧憧往來","咸其脢","咸其輔頰舌","山上有澤",
    "浚恆","悔亡","不恆其德","田無禽","恆其德","振恆","雷風恆","君子以立不易方",
    "遯尾厲","執之用黃牛之革","係遯","好遯","嘉遯","肥遯","天下有山",
    "壯于趾","貞吉","小人用壯","羝羊觸藩","喪羊于易","羝羊觸藩不能退不能遂","雷在天上",
    "摧如","愁如","眾允","晉如鼫鼠","悔亡失得勿恤","晉其角","明出地上",
    "明夷于飛","夷于左股","用拯馬壯","明夷于南狩","入于左腹","箕子之明夷","初登于天後入于地","明入地中",
    "閑有家","無攸遂在中饋","家人嗃嗃","婦子嘻嘻","富家大吉","王假有家","有孚威如","風自火出",
    "喪馬勿逐","見惡人","見輿曳","其人天且劓","睽孤","厥宗噬膚","見豕負塗","先張之弧後說之弧","上火下澤",
    "往蹇來譽","王臣蹇蹇","往蹇來反","往蹇來連","大蹇朋來","往蹇來碩","利西南不利東北","山上有水",
    "無咎","田獲三狐","負且乘","致寇至","解而拇","君子維有解","公用射隼于高墉","雷雨作",
    "已事遄往","酌損之","弗損益之","三人行則損一人","損其疾","十朋之龜","山下有澤",
    "利用為大作","益之用凶事","中行告公從","有孚惠心","莫益之或擊之","風雷益",
    "揚于王庭","孚號有厲","告自邑","不利即戎","壯于前趾","惕號莫夜有戎","君子夬夬","莧陸夬夬","臀無膚","牽羊悔亡","無號終有凶",
    "係于金柅","羸豕孚蹢躅","包有魚","包無魚","以杞包瓜","姤其角","天下有風",
    "有孚不終乃亂乃萃","引吉","萃如嗟如","大吉無咎","萃有位","齎咨涕洟","澤上於地",
    "允升大吉","孚乃利用禴","升虛邑","王用亨于岐山","貞吉升階","冥升","地中生木",
    "臀困于株木","困于酒食","困于石","來徐徐","劓刖","困于赤紱","困于葛藟","澤無水",
    "井泥不食","井谷射鮒","井渫不食","井甃無咎","井冽寒泉食","井收勿幕","木上有水",
    "鞏用黃牛之革","已日乃革之","革言三就","有孚改命","大人虎變","君子豹變","小人革面","澤中有火",
    "鼎顛趾","鼎有實","鼎耳革","鼎折足","鼎黃耳金鉉","鼎玉鉉","木上有火",
    "震來虩虩後笑言啞啞","震來厲","億喪貝","震蘇蘇","震遂泥","震往來厲","震不于其躬于其鄰","洊雷震",
    "艮其趾","艮其腓","艮其限","艮其身","艮其輔","敦艮","兼山艮",
    "鴻漸于干","鴻漸于磐","鴻漸于陸","鴻漸于木","鴻漸于陵","鴻漸于逵","山上有木",
    "歸妹以娣","眇能視","歸妹以須","歸妹愆期","帝乙歸妹","女承筐無實","澤上有雷",
    "遇其配主","豐其蔀","日中見斗","豐其沛","日中見沬","來章有慶譽","豐其屋蔀其家","雷電皆至",
    "旅瑣瑣","旅即次","旅焚其次","旅于處","射雉一矢亡","鳥焚其巢","山上有火",
    "進退利武人之貞","巽在床下","用史巫紛若","頻巽","田獲三品","喪其資斧","隨風巽",
    "和兌","孚兌","來兌","商兌未寧","孚于剝","引兌","麗澤兌",
    "用拯馬壯","渙奔其机","渙其躬","渙其群","渙有丘","渙汗其大號","渙其血","風行水上",
    "不出戶庭","不出門庭","不節若","安節","甘節","苦節","澤上有水",
    "虞吉","鶴鳴在陰其子和之","得敵","月幾望馬匹亡","有孚攣如","翰音登于天","澤上有風",
    "飛鳥以凶","過其祖遇其妣","不及其君遇其臣","弗過防之","從或戕之","密雲不雨","弗遇過之","山上有雷",
    "曳其輪","婦喪其茀","高宗伐鬼方","繻有衣袽","東鄰殺牛","濡其首","水在火上",
    "濡其尾","未濟征凶","君子之光","有孚于飲酒","火在水上"
];
const common = ["建議","可以","可先","應該","必須","風險","隱患","需要注意","危險","目前","現在","眼前","當前","階段","時期","過程","調整","改變","修正","最重要","當下","最近"];

function norm(t) {
    let s = String(t||"");
    for (const h of hexNamesAll) s = s.replace(new RegExp(h,"g"), "");
    for (const i of allImagery) { const esc = i.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"); s = s.replace(new RegExp(esc,"g"), ""); }
    for (const c of catNames) s = s.replace(new RegExp(c,"g"), "");
    for (const ct of common) s = s.replace(new RegExp(ct,"g"), "");
    s = s.replace(/[a-zA-Z\d]+|[，。、；：！？""''「」『』／（）\s]/g,"");
    return s;
}

let allPass = true;
const waveRanges = [[25,32],[33,40],[41,48],[49,56],[57,64]];

// ════ FROZEN WAVE VERIFICATION (read-only) ════
console.log("=== WAVE FROZEN HASH VERIFICATION ===");
for (const [lo,hi] of waveRanges) {
    const wName = lo === 25 ? "A" : lo === 33 ? "B" : lo === 41 ? "C" : lo === 49 ? "D" : "E";
    const fp = path.join(root, "scripts", "frozen_wave_" + wName.toLowerCase() + ".json");
    if (!fs.existsSync(fp)) { console.log("Wave " + wName + ": MISSING frozen file"); allPass = false; continue; }
    const frozen = JSON.parse(fs.readFileSync(fp, "utf8"));
    const cOk = frozen.cat === hk(catArr.filter(x => x.hexagramId >= lo && x.hexagramId <= hi));
    const rOk = frozen.refl === hk(reflArr.filter(x => x.hexagramId >= lo && x.hexagramId <= hi));
    console.log("Wave " + wName + " (" + lo + "-" + hi + "): cat=" + (cOk?"OK":"CHANGED!") + " refl=" + (rOk?"OK":"CHANGED!"));
    if (!cOk || !rOk) allPass = false;
}

// ════ CATEGORY FINAL ════
console.log("\n=== CATEGORY HEX 25-64 FINAL ===");
console.log("total=" + ciAll.length + " unique_ids=" + new Set(ciAll.map(x => x.id)).size);
if (ciAll.length !== 480 || new Set(ciAll.map(x => x.id)).size !== 480) allPass = false;
console.log("gold=" + ciAll.filter(x => x.qualityLevel === "gold").length + "/480 reviewed=" + ciAll.filter(x => x.reviewed === true).length + "/480 needsHumanReview_false=" + ciAll.filter(x => x.needsHumanReview === false).length + "/480");

const ct = { m: ciAll.filter(x => (x.meaning || "").length >= 110).length, a: ciAll.filter(x => (x.advice || "").length >= 90).length, w: ciAll.filter(x => (x.warning || "").length >= 70).length, t: ciAll.filter(x => (x.timing || "").length >= 55).length, b: ciAll.filter(x => x.basis && x.basis.length >= 4).length };
for (const [k, v] of Object.entries(ct)) { const p = v === 480; console.log(k + ">=" + ({m:"110",a:"90",w:"70",t:"55",b:"4"}[k]) + ": " + v + "/480 " + (p ? "PASS" : "FAIL")); if (!p) allPass = false; }

console.log("\n--- Per-hex normU ---");
for (let h = 25; h <= 64; h++) {
    const a = ciAll.filter(x => x.hexagramId === h);
    const mu = new Set(a.map(x => norm(x.meaning))).size, au = new Set(a.map(x => norm(x.advice))).size;
    const wu = new Set(a.map(x => norm(x.warning))).size, tu = new Set(a.map(x => norm(x.timing))).size;
    const p = mu === 12 && au >= 11 && wu >= 10 && tu >= 10;
    if (!p) console.log("hex " + h + ": FAIL m=" + mu + " a=" + au + " w=" + wu + " t=" + tu);
    else if (h % 8 === 0) console.log("hex " + (h-7) + "-" + h + ": PASS");
    if (!p) allPass = false;
}

// Per-wave normU
console.log("\n--- Per-wave normU ---");
for (const [lo,hi] of waveRanges) {
    const wName = lo === 25 ? "A" : lo === 33 ? "B" : lo === 41 ? "C" : lo === 49 ? "D" : "E";
    const a = ciAll.filter(x => x.hexagramId >= lo && x.hexagramId <= hi);
    const mu = new Set(a.map(x => norm(x.meaning))).size, au = new Set(a.map(x => norm(x.advice))).size;
    const wu = new Set(a.map(x => norm(x.warning))).size, tu = new Set(a.map(x => norm(x.timing))).size;
    const p = mu >= 92 && au >= 88 && wu >= 84 && tu >= 84;
    console.log("Wave " + wName + ": mU=" + mu + " aU=" + au + " wU=" + wu + " tU=" + tu + " " + (p ? "PASS" : "FAIL"));
    if (!p) allPass = false;
}

const fmu = new Set(ciAll.map(x => norm(x.meaning))).size, fau = new Set(ciAll.map(x => norm(x.advice))).size;
const fwu = new Set(ciAll.map(x => norm(x.warning))).size, ftu = new Set(ciAll.map(x => norm(x.timing))).size;
console.log("Full batch: mU=" + fmu + " aU=" + fau + " wU=" + fwu + " tU=" + ftu + " " + (fmu >= 455 && fau >= 440 && fwu >= 420 && ftu >= 420 ? "PASS" : "FAIL"));
if (!(fmu >= 455 && fau >= 440 && fwu >= 420 && ftu >= 420)) allPass = false;

// Cross-wave dup sentences
const SAFE = ["本欄不做醫療診斷","本欄不做獲利保證","本欄不做法律結果判定","本分析不構成投資建議","本解讀僅供文化參考，不構成醫療建議","如有健康問題請諮詢合格醫療專業人員","如有持續或嚴重症狀，請務必尋求專業醫療協助","本分析不構成商業或投資建議","本分析僅供文化參考，不構成法律建議","如有法律問題請諮詢合格律師"];
function splits(t) { return (t || "").split(/[。！？；!?;]/).map(s => s.trim()).filter(s => s.length >= 8 && !SAFE.includes(s)); }
const sm = {}; for (const x of ciAll) for (const f of ["meaning","advice","warning","timing"]) for (const s of splits(x[f] || "")) { if (!sm[s]) sm[s] = {c:0}; sm[s].c++; }
const dups = Object.entries(sm).filter(([,v]) => v.c > 2);
console.log("\ndup sents>2: " + dups.length + " " + (dups.length === 0 ? "PASS" : "FAIL"));
if (dups.length > 0) { allPass = false; for (const [s,v] of dups.slice(0,10)) console.log("  ["+v.c+"x] "+s.substring(0,80)); }

// Cross-wave skeleton
const sk = ["上卦帶來推力","兩股力量需要取得平衡","保持彈性並等待時機","不要太快也不要太慢","先觀察再決定","目前仍有調整空間","這是一個需要耐心的階段","每個階段都有不同挑戰","最基礎的準備最重要","此分類最常見的誤判"];
let skh = 0; const catTxt = ciAll.map(x => (x.meaning||"")+(x.advice||"")+(x.warning||"")).join(" ");
for (const s of sk) { const esc = s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"); const m = catTxt.match(new RegExp(esc,"g")); if (m) skh += m.length; }
console.log("skeleton: " + skh + " " + (skh <= 4 ? "PASS" : "FAIL")); if (skh > 4) allPass = false;

const fw = ["必定成功","保證獲利","官司一定贏","停止就醫","必有災禍"]; let fh = 0;
for (const w of fw) if (JSON.stringify(ciAll).includes(w)) fh++;
console.log("forbidden: " + fh + " " + (fh === 0 ? "PASS" : "FAIL")); if (fh > 0) allPass = false;

// ════ REFLECTION FINAL ════
console.log("\n=== REFLECTION HEX 25-64 FINAL ===");
console.log("total=" + rfAll.length + " unique_ids=" + new Set(rfAll.map(x => x.id)).size);
if (rfAll.length !== 1440 || new Set(rfAll.map(x => x.id)).size !== 1440) allPass = false;
console.log("reviewed=" + rfAll.filter(x => x.reviewed === true).length + "/1440 qualityLevel_reviewed=" + rfAll.filter(x => x.qualityLevel === "reviewed").length + "/1440 needsHumanReview_false=" + rfAll.filter(x => x.needsHumanReview === false).length + "/1440");

const qLen = rfAll.filter(x => (x.question || "").length >= 38 && (x.question || "").length <= 105).length;
const qm = rfAll.filter(x => (x.question || "").endsWith("？")).length;
console.log("length 38-105: " + qLen + "/1440 " + (qLen === 1440 ? "PASS" : "FAIL")); if (qLen !== 1440) allPass = false;
console.log("q-marks: " + qm + "/1440 " + (qm === 1440 ? "PASS" : "FAIL")); if (qm !== 1440) allPass = false;

const grps = {}; for (const x of rfAll) { const k = x.hexagramId + "-" + x.category; if (!grps[k]) grps[k] = []; grps[k].push(x); }
let grpFail = 0; for (const a of Object.values(grps)) { if (new Set(a.map(x => norm(x.question))).size < 3) grpFail++; }
const grpOk = Object.values(grps).filter(x => x.length === 3).length;
console.log("groups complete: " + grpOk + "/480 per-group fail: " + grpFail);

// Per-hex reflection normU
console.log("\n--- Per-hex refl normU ---");
for (let h = 25; h <= 64; h++) {
    const u = new Set(rfAll.filter(x => x.hexagramId === h).map(x => norm(x.question))).size;
    if (u < 32) { console.log("hex " + h + ": FAIL normU=" + u + "/36"); allPass = false; }
}
console.log("All per-hex checked.");

// Per-wave refl normU
console.log("\n--- Per-wave refl normU ---");
for (const [lo,hi] of waveRanges) {
    const wName = lo === 25 ? "A" : lo === 33 ? "B" : lo === 41 ? "C" : lo === 49 ? "D" : "E";
    const u = new Set(rfAll.filter(x => x.hexagramId >= lo && x.hexagramId <= hi).map(x => norm(x.question))).size;
    console.log("Wave " + wName + ": normU=" + u + "/288 " + (u >= 260 ? "PASS" : "FAIL"));
    if (u < 260) allPass = false;
}

const rqu = new Set(rfAll.map(x => norm(x.question))).size;
console.log("Full batch refl: normU=" + rqu + "/1440 " + (rqu >= 1300 ? "PASS" : "FAIL"));
if (rqu < 1300) allPass = false;

const qDups = rfAll.map(x => x.question).filter((q,i,arr) => arr.indexOf(q) !== i).length;
console.log("dup full questions: " + qDups + " " + (qDups === 0 ? "PASS" : "FAIL")); if (qDups > 0) allPass = false;

const rfSk = ["你比較接近","你最需要做出的調整","哪條界線尚未準備好跨越","現在哪一股力量更明顯","下一步要前進還是停下","最容易忽略的風險","你是否已經準備好","你可以如何調整","目前最需要注意什麼","什麼選擇最適合你"];
let rfSkh = 0; const rTxt = rfAll.map(x => x.question || "").join("\n");
for (const s of rfSk) { const esc = s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"); const m = rTxt.match(new RegExp(esc,"g")); if (m) rfSkh += m.length; }
console.log("rf skeleton: " + rfSkh + " " + (rfSkh <= 4 ? "PASS" : "FAIL")); if (rfSkh > 4) allPass = false;

let rfFh = 0; for (const w of fw) if (rTxt.includes(w)) rfFh++;
console.log("rf forbidden: " + rfFh + " " + (rfFh === 0 ? "PASS" : "FAIL")); if (rfFh > 0) allPass = false;

// ════ PROTECTED HASHES ════
console.log("\n=== PROTECTED HASHES ===");
const checks = [
    ["Category hex 1-24", hashes.cat_h1to24, hk(catArr.filter(x => x.hexagramId >= 1 && x.hexagramId <= 24))],
    ["Reflection hex 1-24", hashes.refl_h1to24, hk(reflArr.filter(x => x.hexagramId >= 1 && x.hexagramId <= 24))],
    ["hexagrams", hashes.hexagrams, hk(hexMod.hexagrams)],
    ["lines", hashes.lines_file, hf(path.join(dataDir,"lines.data.js"))],
    ["pairInterpretations", hashes.pairInterpretations_file, hf(path.join(dataDir,"pairInterpretations.data.js"))],
    ["lineCategoryInterpretations", hashes.lineCategoryInterpretations_file, hf(path.join(dataDir,"lineCategoryInterpretations.data.js"))],
    ["actionSuggestions", hashes.actionSuggestions_file, hf(path.join(dataDir,"actionSuggestions.data.js"))],
    ["riskWarnings", hashes.riskWarnings_file, hf(path.join(dataDir,"riskWarnings.data.js"))],
];
let hOk = true; for (const [n, exp, act] of checks) { const p = exp === act; console.log((p?"OK":"CHANGED") + ": " + n); if (!p) hOk = false; }
if (!hOk) allPass = false;

console.log("\n=== FINAL GATE HEX 25-64: " + (allPass ? "ALL PASS" : "FAIL") + " ===");
if (!allPass) process.exitCode = 1;
