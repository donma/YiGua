const fs = require("fs"), crypto = require("crypto"), vm = require("vm"), path = require("path");
const root = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(__dirname, "..");
const dataDir = path.join(root, "src", "data");
const frozen1Path = path.join(root, "scripts", "frozen_linecat_wave_01.json");
const frozen2Path = path.join(root, "scripts", "frozen_linecat_wave_02.json");
const frozen3Path = path.join(root, "scripts", "frozen_linecat_wave_03.json");
const frozen4Path = path.join(root, "scripts", "frozen_linecat_wave_04.json");
const frozen5Path = path.join(root, "scripts", "frozen_linecat_wave_05.json");
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
const ciW = lcArr.filter(x => x.hexagramId >= 13 && x.hexagramId <= 20);

const hexNames = ["同人","大有","謙","豫","隨","蠱","臨","觀"];
const catNames = ["一般","工作事業","感情關係","財務金錢","人際合作","家庭親人","學習考試","身心狀態","重大決策","創業經營","官非合約","心境修行"];
const imagery = [
    "同人于門","同人于宗","伏戎于莽","升其高陵","三歲不興","乘其墉","弗克攻","先號咷而後笑","大師克相遇","同人于郊","天與火","類族辨物",
    "無交害","匪咎","艱則無咎","大車以載","公用亨于天子","小人弗克","匪其彭","厥孚交如","威如","自天祐之","火在天上","遏惡揚善","順天休命",
    "謙謙君子","用涉大川","鳴謙","勞謙","有終吉","無不利","撝謙","不富以其鄰","利用侵伐","利用行師","征邑國","地中有山","裒多益寡","稱物平施",
    "鳴豫","介于石","不終日","盱豫","遲有悔","由豫","大有得","勿疑","朋盍簪","貞疾","恆不死","冥豫","成有渝","利建侯行師","雷出地奮","作樂崇德",
    "官有渝","出門交有功","係小子","失丈夫","係丈夫","失小子","隨有求得","利居貞","隨有獲","貞凶","有孚在道","以明","何咎","孚于嘉","拘係之","乃從維之","王用亨于西山","澤中有雷","嚮晦入宴息",
    "幹父之蠱","有子","考無咎","厲終吉","幹母之蠱","不可貞","小有悔","無大咎","裕父之蠱","往見吝","用譽","不事王侯","高尚其事","山下有風","振民育德","先甲三日","後甲三日",
    "咸臨","甘臨","無攸利","既憂之","至臨","知臨","大君之宜","敦臨","至于八月有凶","澤上有地","教思無窮","容保民無疆",
    "童觀","君子吝","闚觀","利女貞","觀我生","進退","觀國之光","利用賓于王","觀其生","風行地上","省方觀民設教","盥而不薦","有孚顒若"
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

console.log("=== CROSS-WAVE 04-05 LINE CATEGORY HEX 13-20 ===");
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
for(const[nm,fp,lo,hi]of[["Wave 01",frozen1Path,1,4],["Wave 02",frozen2Path,5,8],["Wave 03",frozen3Path,9,12],["Wave 04",frozen4Path,13,16],["Wave 05",frozen5Path,17,20]]){if(!fs.existsSync(fp)){console.log(nm+": MISSING");fOk=false;}else{const f=JSON.parse(fs.readFileSync(fp,"utf8"));const cOk=f.hash===hk(lcArr.filter(x=>x.hexagramId>=lo&&x.hexagramId<=hi));console.log(nm+": "+(cOk?"VERIFIED":"CHANGED!"));if(!cOk)fOk=false;}}
if(!fOk)allPass=false;

console.log("\n=== PROTECTED HASHES ===");
const checks=[["hexagrams",hashes.hexagrams,hk(hex.hexagrams)],["lines",hashes.lines,hk(lines.lineData||lines.lines||[])],["cat",hashes.categoryInterpretations,hk(cat.categoryInterpretations)],["refl",hashes.reflectionQuestions,hk(refl.reflectionQuestions)],["pair",hashes.pairInterpretations_file,hf(path.join(dataDir,"pairInterpretations.data.js"))],["action",hashes.actionSuggestions_file,hf(path.join(dataDir,"actionSuggestions.data.js"))],["risk",hashes.riskWarnings_file,hf(path.join(dataDir,"riskWarnings.data.js"))]];
let hOk=true;for(const[n,exp,act]of checks){const p=exp===act;console.log((p?"OK":"CHANGED")+": "+n);if(!p)hOk=false;}
if(!hOk)allPass=false;

// High-similarity check: find top similar pairs within same category across different hexes
console.log("\n--- High-similarity pairs (cross-wave, same category, top 5) ---");
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
for(const p of simPairs.slice(0,8))console.log("  "+p.a+" <-> "+p.b+": "+p.field+" sim="+p.similarity);
console.log("High-sim pairs (meaning>0.72): "+simPairs.length);

if(!allPass)process.exitCode=1;
console.log("\n=== CROSS-WAVE 04-05 GATE: "+(allPass?"ALL PASS":"FAIL")+" ===");