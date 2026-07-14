const fs = require("fs"), crypto = require("crypto"), vm = require("vm"), path = require("path");
const root = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(__dirname, "..");
const dataDir = path.join(root, "src", "data");
const frozenA = JSON.parse(fs.readFileSync(path.join(root, "scripts", "frozen_wave_a.json"), "utf8"));
const frozenB = JSON.parse(fs.readFileSync(path.join(root, "scripts", "frozen_wave_b.json"), "utf8"));
const frozenC = JSON.parse(fs.readFileSync(path.join(root, "scripts", "frozen_wave_c.json"), "utf8"));
const hashes = JSON.parse(fs.readFileSync(path.join(root, "scripts", "prot_hashes_25to64.json"), "utf8"));

function loadModule(fp) { let c = fs.readFileSync(fp,"utf8"); const s = { window: { Zero1MatrixData: {} }, console }; vm.createContext(s); vm.runInContext(c,s); return s.window.Zero1MatrixData; }
function hk(d) { return crypto.createHash("sha256").update(JSON.stringify(d)).digest("hex"); }
function hf(fp) { return crypto.createHash("sha256").update(fs.readFileSync(fp,"utf8")).digest("hex"); }

const cat = loadModule(path.join(dataDir, "categoryInterpretations.data.js"));
const refl = loadModule(path.join(dataDir, "reflectionQuestions.data.js"));
const hex = loadModule(path.join(dataDir, "hexagrams.data.js"));
const catArr = cat.categoryInterpretations, reflArr = refl.reflectionQuestions;
const ciW = catArr.filter(x => x.hexagramId >= 49 && x.hexagramId <= 56);
const rfW = reflArr.filter(x => x.hexagramId >= 49 && x.hexagramId <= 56);

const hexNames = ["革","鼎","震","艮","漸","歸妹","豐","旅"];
const catNames = ["一般","工作事業","感情關係","財務金錢","人際合作","家庭親人","學習考試","身心狀態","重大決策","創業經營","官非合約","心境修行"];
const imagery = [
    "鞏用黃牛之革","已日乃革之","革言三就","有孚改命","大人虎變","君子豹變","小人革面","澤中有火",
    "鼎顛趾","鼎有實","鼎耳革","鼎折足","鼎黃耳金鉉","鼎玉鉉","木上有火",
    "震來虩虩後笑言啞啞","震來厲","億喪貝","震蘇蘇","震遂泥","震往來厲","震不于其躬于其鄰","洊雷震",
    "艮其趾","艮其腓","艮其限","艮其身","艮其輔","敦艮","兼山艮",
    "鴻漸于干","鴻漸于磐","鴻漸于陸","鴻漸于木","鴻漸于陵","鴻漸于逵","山上有木",
    "歸妹以娣","眇能視","歸妹以須","歸妹愆期","帝乙歸妹","女承筐無實","澤上有雷",
    "遇其配主","豐其蔀","日中見斗","豐其沛","日中見沬","來章有慶譽","豐其屋蔀其家","雷電皆至",
    "旅瑣瑣","旅即次","旅焚其次","旅于處","射雉一矢亡","鳥焚其巢","山上有火"
];
const common = ["建議","可以","可先","應該","必須","風險","隱患","需要注意","危險","目前","現在","眼前","當前","階段","時期","過程","調整","改變","修正","最重要","當下","最近"];

function norm(t) {
    let s = String(t||"");
    for (const h of hexNames) s = s.replace(new RegExp(h,"g"), "");
    for (const i of imagery) {
        const escaped = i.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        s = s.replace(new RegExp(escaped,"g"), "");
    }
    for (const c of catNames) s = s.replace(new RegExp(c,"g"), "");
    for (const ct of common) s = s.replace(new RegExp(ct,"g"), "");
    s = s.replace(/[a-zA-Z\d]+|[，。、；：！？""''「」『』／（）\s]/g,"");
    return s;
}

let allPass = true;

// FROZEN A+B+C
console.log("=== WAVES A+B+C FROZEN CHECK ===");
const waCat = catArr.filter(x=>x.hexagramId>=25&&x.hexagramId<=32), waRefl = reflArr.filter(x=>x.hexagramId>=25&&x.hexagramId<=32);
const wbCat = catArr.filter(x=>x.hexagramId>=33&&x.hexagramId<=40), wbRefl = reflArr.filter(x=>x.hexagramId>=33&&x.hexagramId<=40);
const wcCat = catArr.filter(x=>x.hexagramId>=41&&x.hexagramId<=48), wcRefl = reflArr.filter(x=>x.hexagramId>=41&&x.hexagramId<=48);
const aOk = frozenA.cat===hk(waCat) && frozenA.refl===hk(waRefl);
const bOk = frozenB.cat===hk(wbCat) && frozenB.refl===hk(wbRefl);
const cOk = frozenC.cat===hk(wcCat) && frozenC.refl===hk(wcRefl);
console.log("Wave A: "+(aOk?"UNCHANGED":"CHANGED!"));
console.log("Wave B: "+(bOk?"UNCHANGED":"CHANGED!"));
console.log("Wave C: "+(cOk?"UNCHANGED":"CHANGED!"));
if (!aOk||!bOk||!cOk) allPass=false;

// CATEGORY
console.log("\n=== WAVE D CATEGORY 49-56 ===");
console.log("total="+ciW.length+" unique_ids="+new Set(ciW.map(x=>x.id)).size);
if (ciW.length!==96||new Set(ciW.map(x=>x.id)).size!==96) allPass=false;
console.log("gold="+ciW.filter(x=>x.qualityLevel==="gold").length+" reviewed="+ciW.filter(x=>x.reviewed===true).length+" needsHumanReview_false="+ciW.filter(x=>x.needsHumanReview===false).length);
const th={m:ciW.filter(x=>(x.meaning||"").length>=110).length,a:ciW.filter(x=>(x.advice||"").length>=90).length,w:ciW.filter(x=>(x.warning||"").length>=70).length,t:ciW.filter(x=>(x.timing||"").length>=55).length,b:ciW.filter(x=>x.basis&&x.basis.length>=4).length};
for(const[k,v]of Object.entries(th)){const p=v===96;console.log(k+">="+({m:"110",a:"90",w:"70",t:"55",b:"4"}[k])+": "+v+"/96 "+(p?"PASS":"FAIL"));if(!p)allPass=false;}
console.log("\n--- Per-hex normU ---");
for(let h=49;h<=56;h++){const a=ciW.filter(x=>x.hexagramId===h);const mu=new Set(a.map(x=>norm(x.meaning))).size,au=new Set(a.map(x=>norm(x.advice))).size,wu=new Set(a.map(x=>norm(x.warning))).size,tu=new Set(a.map(x=>norm(x.timing))).size;const p=mu===12&&au>=11&&wu>=10&&tu>=10;console.log("hex "+h+": m="+mu+" a="+au+" w="+wu+" t="+tu+" "+(p?"PASS":"FAIL"));if(!p)allPass=false;}
const fmu=new Set(ciW.map(x=>norm(x.meaning))).size,fau=new Set(ciW.map(x=>norm(x.advice))).size,fwu=new Set(ciW.map(x=>norm(x.warning))).size,ftu=new Set(ciW.map(x=>norm(x.timing))).size;
console.log("batch: mU="+fmu+" aU="+fau+" wU="+fwu+" tU="+ftu+" "+(fmu>=92&&fau>=88&&fwu>=84&&ftu>=84?"PASS":"FAIL"));
if(!(fmu>=92&&fau>=88&&fwu>=84&&ftu>=84))allPass=false;
const SAFE=["本欄不做醫療診斷","本欄不做獲利保證","本欄不做法律結果判定","本分析不構成投資建議","本解讀僅供文化參考，不構成醫療建議","如有健康問題請諮詢合格醫療專業人員","如有持續或嚴重症狀，請務必尋求專業醫療協助","本分析不構成商業或投資建議","本分析僅供文化參考，不構成法律建議","如有法律問題請諮詢合格律師"];
function splits(t){return(t||"").split(/[。！？；!?;]/).map(s=>s.trim()).filter(s=>s.length>=8&&!SAFE.includes(s));}
const sm={};for(const x of ciW)for(const f of["meaning","advice","warning","timing"])for(const s of splits(x[f]||"")){if(!sm[s])sm[s]={c:0};sm[s].c++;}
const dups=Object.entries(sm).filter(([,v])=>v.c>2);console.log("dup sents>2: "+dups.length+" "+(dups.length===0?"PASS":"FAIL"));if(dups.length>0)allPass=false;
const sk=["上卦帶來推力","兩股力量需要取得平衡","保持彈性並等待時機","不要太快也不要太慢","先觀察再決定","目前仍有調整空間","這是一個需要耐心的階段","每個階段都有不同挑戰","最基礎的準備最重要","此分類最常見的誤判"];
let skh=0;for(const s of sk){const escaped = s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");const m=ciW.map(x=>(x.meaning||"")+(x.advice||"")+(x.warning||"")).join(" ").match(new RegExp(escaped,"g"));if(m)skh+=m.length;}
console.log("skeleton: "+skh+" "+(skh<=4?"PASS":"FAIL"));if(skh>4)allPass=false;
const fw=["必定成功","保證獲利","官司一定贏","停止就醫","必有災禍"];let fh=0;for(const w of fw)if(JSON.stringify(ciW).includes(w))fh++;
console.log("forbidden: "+fh+" "+(fh===0?"PASS":"FAIL"));if(fh>0)allPass=false;

// REFLECTION
console.log("\n=== WAVE D REFLECTION 49-56 ===");
console.log("total="+rfW.length+" unique_ids="+new Set(rfW.map(x=>x.id)).size);
if(rfW.length!==288||new Set(rfW.map(x=>x.id)).size!==288)allPass=false;
console.log("reviewed="+rfW.filter(x=>x.reviewed===true).length+" qualityLevel_reviewed="+rfW.filter(x=>x.qualityLevel==="reviewed").length+" needsHumanReview_false="+rfW.filter(x=>x.needsHumanReview===false).length);
const qLen=rfW.filter(x=>(x.question||"").length>=38&&(x.question||"").length<=105).length;
const qm=rfW.filter(x=>(x.question||"").endsWith("？")).length;
console.log("length 38-105: "+qLen+"/288 "+(qLen===288?"PASS":"FAIL"));if(qLen!==288)allPass=false;
console.log("q-marks: "+qm+"/288 "+(qm===288?"PASS":"FAIL"));if(qm!==288)allPass=false;
const grps={};for(const x of rfW){const k=x.hexagramId+"-"+x.category;if(!grps[k])grps[k]=[];grps[k].push(x);}
let grpFail=0;for(const a of Object.values(grps)){if(new Set(a.map(x=>norm(x.question))).size<3)grpFail++;}
const grpOk=Object.values(grps).filter(x=>x.length===3).length;
const qu=new Set(rfW.map(x=>norm(x.question))).size;
console.log("groups: "+grpOk+"/96 fail:"+grpFail+" normU:"+qu+" "+(qu>=260?"PASS":"FAIL"));
if(qu<260||grpFail>0||grpOk!==96)allPass=false;
for(let h=49;h<=56;h++){const u=new Set(rfW.filter(x=>x.hexagramId===h).map(x=>norm(x.question))).size;console.log("hex "+h+": "+u+"/36 "+(u>=32?"PASS":"FAIL"));if(u<32)allPass=false;}
const qDups=rfW.map(x=>x.question).filter((q,i,arr)=>arr.indexOf(q)!==i).length;console.log("dup questions: "+qDups+" "+(qDups===0?"PASS":"FAIL"));if(qDups>0)allPass=false;
const rfSk=["你比較接近","你最需要做出的調整","哪條界線尚未準備好跨越","現在哪一股力量更明顯","下一步要前進還是停下","最容易忽略的風險","你是否已經準備好","你可以如何調整","目前最需要注意什麼","什麼選擇最適合你"];
let rfSkh=0;const rTxt=rfW.map(x=>x.question||"").join("\n");for(const s of rfSk){const escaped = s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");const m=rTxt.match(new RegExp(escaped,"g"));if(m)rfSkh+=m.length;}
console.log("rf skeleton: "+rfSkh+" "+(rfSkh<=4?"PASS":"FAIL"));if(rfSkh>4)allPass=false;

// PROTECTED
console.log("\n=== PROTECTED HASHES ===");
const checks=[
    ["Category hex 1-24",hashes.cat_h1to24,hk(catArr.filter(x=>x.hexagramId>=1&&x.hexagramId<=24))],
    ["Reflection hex 1-24",hashes.refl_h1to24,hk(reflArr.filter(x=>x.hexagramId>=1&&x.hexagramId<=24))],
    ["hexagrams",hashes.hexagrams,hk(hex.hexagrams)],
    ["lines",hashes.lines_file,hf(path.join(dataDir,"lines.data.js"))],
    ["pair",hashes.pairInterpretations_file,hf(path.join(dataDir,"pairInterpretations.data.js"))],
    ["lineCat",hashes.lineCategoryInterpretations_file,hf(path.join(dataDir,"lineCategoryInterpretations.data.js"))],
    ["action",hashes.actionSuggestions_file,hf(path.join(dataDir,"actionSuggestions.data.js"))],
    ["risk",hashes.riskWarnings_file,hf(path.join(dataDir,"riskWarnings.data.js"))],
];
let hOk=true;for(const[n,exp,act]of checks){const p=exp===act;console.log((p?"OK":"CHANGED")+": "+n);if(!p)hOk=false;}
if(!hOk)allPass=false;

console.log("\n=== WAVE D GATE: "+(allPass?"ALL PASS":"FAIL")+" ===");
if(!allPass)process.exitCode=1;
