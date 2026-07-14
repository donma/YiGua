const fs = require("fs"), crypto = require("crypto"), vm = require("vm"), path = require("path");
const root = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(__dirname, "..");
const dataDir = path.join(root, "src", "data");
const frozen1Path = path.join(root, "scripts", "frozen_linecat_wave_01.json");
const frozen2Path = path.join(root, "scripts", "frozen_linecat_wave_02.json");
const frozen3Path = path.join(root, "scripts", "frozen_linecat_wave_03.json");
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
const ciW = lcArr.filter(x => x.hexagramId >= 5 && x.hexagramId <= 12);

const hexNames = ["需","訟","師","比","小畜","履","泰","否"];
const catNames = ["一般","工作事業","感情關係","財務金錢","人際合作","家庭親人","學習考試","身心狀態","重大決策","創業經營","官非合約","心境修行"];
const imagery = [
    "有孚光亨","利涉大川","雲上於天","飲食宴樂","需于郊","利用恆","需于沙","需于泥","致寇至","需于血","出自穴","需于酒食","入于穴","有不速之客三人來","敬之終吉","需",
    "有孚窒惕","中吉","終凶","利見大人","不利涉大川","天與水違行","作事謀始","不永所事","不克訟","歸而逋","其邑人三百戶","無眚","食舊德","貞厲","或從王事","無成","復即命","渝安貞","訟元吉","或錫之鞶帶","終朝三褫之","訟",
    "丈人吉","地中有水","容民畜眾","師出以律","否臧凶","在師中","王三錫命","師或輿尸","師左次","田有禽","利執言","長子帥師","弟子輿尸","大君有命","開國承家","小人勿用","師",
    "原筮元永貞","不寧方來","後夫凶","地上有水","建萬國親諸侯","有孚比之","有孚盈缶","終來有他吉","比之自內","比之匪人","外比之","顯比","王用三驅","失前禽","邑人不誡","比之無首","比",
    "密雲不雨","自我西郊","風行天上","懿文德","復自道","牽復","輿說輻","夫妻反目","有孚血去惕出","有孚攣如","富以其鄰","既雨既處","尚德載","月幾望","君子征凶","小畜",
    "履虎尾","不咥人","辨上下定民志","素履","履道坦坦","幽人貞吉","眇能視","跛能履","武人為于大君","夬履","貞厲","視履考祥","其旋元吉","愬愬","履",
    "小往大來","天地交","財成天地之道","拔茅茹","以其彙","包荒","用馮河","不遐遺","朋亡","得尚于中行","無平不陂","無往不復","艱貞無咎","翩翩","不富以其鄰","不戒以孚","帝乙歸妹","以祉元吉","城復于隍","勿用師","自邑告命","貞吝","泰",
    "否之匪人","不利君子貞","大往小來","天地不交","儉德辟難","包承","小人吉","大人否亨","包羞","有命無咎","疇離祉","休否","其亡其亡","繫于苞桑","傾否","先否後喜","否"
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

console.log("=== CROSS-WAVE 02-03 LINE CATEGORY HEX 5-12 ===");
console.log("total=" + ciW.length + " unique_ids=" + new Set(ciW.map(x=>x.id)).size);
if (ciW.length !== 576 || new Set(ciW.map(x=>x.id)).size !== 576) allPass = false;

console.log("gold=" + ciW.filter(x=>x.qualityLevel==="gold").length + "/576");
console.log("reviewed=true=" + ciW.filter(x=>x.reviewed===true).length + "/576");
console.log("needsHumanReview=false=" + ciW.filter(x=>x.needsHumanReview===false).length + "/576");
console.log("needsExpansion=false=" + ciW.filter(x=>x.needsExpansion===false).length + "/576");

// Combined normU
const fmu=new Set(ciW.map(x=>norm(x.meaning))).size,fau=new Set(ciW.map(x=>norm(x.advice))).size,fwu=new Set(ciW.map(x=>norm(x.warning))).size;
console.log("\nCombined normU: m="+fmu+" a="+fau+" w="+fwu+" "+(fmu>=552&&fau>=528&&fwu>=504?"PASS":"FAIL"));
if(!(fmu>=552&&fau>=528&&fwu>=504))allPass=false;

// Dup sentences (cross-wave)
const SAFE=["本欄不做醫療診斷","本欄不做獲利保證","本欄不做法律結果判定","本欄不做医療診断","本欄不做獲利保証"];
function splits(t){return(t||"").split(/[。！？；!?;]/).map(s=>s.trim()).filter(s=>s.length>=8&&!SAFE.includes(s));}
const sm={};for(const x of ciW)for(const f of["meaning","advice","warning"])for(const s of splits(x[f]||"")){if(!sm[s])sm[s]={c:0};sm[s].c++;}
const dups=Object.entries(sm).filter(([,v])=>v.c>2);console.log("dup sents>2: "+dups.length+" "+(dups.length===0?"PASS":"FAIL"));if(dups.length>0)allPass=false;
const sk=["此為","結合","起步階段","力量尚未成熟","觀察準備","貿然行動","保持彈性","順勢而為","審慎評估","多加溝通","等待成熟","在此分類中","建議先理解"];
let skh=0;const tTxt=ciW.map(x=>(x.meaning||"")+(x.advice||"")+(x.warning||"")).join(" ");for(const s of sk){const esc=s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");const m=tTxt.match(new RegExp(esc,"g"));if(m)skh+=m.length;}
console.log("skeleton: "+skh+" "+(skh<=6?"PASS":"FAIL"));if(skh>6)allPass=false;
const fw=["必定成功","保證獲利","官司一定贏","停止就醫","必有災禍"];let fh=0;for(const w of fw)if(JSON.stringify(ciW).includes(w))fh++;
console.log("forbidden: "+fh+" "+(fh===0?"PASS":"FAIL"));if(fh>0)allPass=false;
let dp=0;for(const x of ciW)for(const f of["meaning","advice","warning"])if((x[f]||"").match(/。。|，，|；；|！！|？？/))dp++;
console.log("double punctuation: "+dp+" "+(dp===0?"PASS":"FAIL"));if(dp>0)allPass=false;

// Frozen
console.log("\n=== FROZEN HASHES ===");
let fOk=true;
for(const[nm,fp,lo,hi]of[["Wave 01",frozen1Path,1,4],["Wave 02",frozen2Path,5,8],["Wave 03",frozen3Path,9,12]]){if(!fs.existsSync(fp)){console.log(nm+": MISSING");fOk=false;}else{const f=JSON.parse(fs.readFileSync(fp,"utf8"));const cOk=f.hash===hk(lcArr.filter(x=>x.hexagramId>=lo&&x.hexagramId<=hi));console.log(nm+": "+(cOk?"VERIFIED":"CHANGED!"));if(!cOk)fOk=false;}}
if(!fOk)allPass=false;

console.log("\n=== PROTECTED HASHES ===");
const checks=[["hexagrams",hashes.hexagrams,hk(hex.hexagrams)],["lines",hashes.lines,hk(lines.lineData||lines.lines||[])],["cat",hashes.categoryInterpretations,hk(cat.categoryInterpretations)],["refl",hashes.reflectionQuestions,hk(refl.reflectionQuestions)],["pair",hashes.pairInterpretations_file,hf(path.join(dataDir,"pairInterpretations.data.js"))],["action",hashes.actionSuggestions_file,hf(path.join(dataDir,"actionSuggestions.data.js"))],["risk",hashes.riskWarnings_file,hf(path.join(dataDir,"riskWarnings.data.js"))]];
let hOk=true;for(const[n,exp,act]of checks){const p=exp===act;console.log((p?"OK":"CHANGED")+": "+n);if(!p)hOk=false;}
if(!hOk)allPass=false;

// High-similarity check: find top similar pairs within same category across different hexes
console.log("\n--- High-similarity pairs (cross-wave, same category, top 3) ---");
const allCats=["general","career","love","money","people","family","study","health","decision","business","legal","spiritual"];
let simPairs=[];
for(const c of allCats){
    const catEntries=ciW.filter(x=>x.category===c);
    for(let i=0;i<catEntries.length;i++)for(let j=i+1;j<catEntries.length;j++){
        if(catEntries[i].hexagramId===catEntries[j].hexagramId)continue;
        const a=norm(catEntries[i].meaning),b=norm(catEntries[j].meaning);
        if(!a||!b||a.length<10||b.length<10)continue;
        const setA=new Set(a.split("")),setB=new Set(b.split(""));
        const intersection=new Set([...setA].filter(x=>setB.has(x))).size;
        const union=new Set([...setA,...setB]).size;
        const sim=intersection/union;
        if(sim>0.72)simPairs.push({a:catEntries[i].id,b:catEntries[j].id,field:"meaning",similarity:sim.toFixed(3)});
    }
}
simPairs.sort((a,b)=>parseFloat(b.similarity)-parseFloat(a.similarity));
for(const p of simPairs.slice(0,5))console.log("  "+p.a+" <-> "+p.b+": "+p.field+" sim="+p.similarity);
console.log("High-sim pairs (meaning>0.72): "+simPairs.length);

if(!allPass)process.exitCode=1;
console.log("\n=== CROSS-WAVE 02-03 GATE: "+(allPass?"ALL PASS":"FAIL")+" ===");