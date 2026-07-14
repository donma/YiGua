const fs = require("fs"), crypto = require("crypto"), vm = require("vm"), path = require("path");
const root = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(__dirname, "..");
const dataDir = path.join(root, "src", "data");
const frozenA = JSON.parse(fs.readFileSync(path.join(root, "scripts", "frozen_wave_a.json"), "utf8"));
const hashes = JSON.parse(fs.readFileSync(path.join(root, "scripts", "prot_hashes_25to64.json"), "utf8"));

function loadModule(fp) { let c = fs.readFileSync(fp,"utf8"); const s = { window: { Zero1MatrixData: {} }, console }; vm.createContext(s); vm.runInContext(c,s); return s.window.Zero1MatrixData; }
function hashSection(d) { return crypto.createHash("sha256").update(JSON.stringify(d)).digest("hex"); }
function hashFile(fp) { return crypto.createHash("sha256").update(fs.readFileSync(fp,"utf8")).digest("hex"); }

const cat = loadModule(path.join(dataDir, "categoryInterpretations.data.js"));
const refl = loadModule(path.join(dataDir, "reflectionQuestions.data.js"));
const hex = loadModule(path.join(dataDir, "hexagrams.data.js"));
const catArr = cat.categoryInterpretations, reflArr = refl.reflectionQuestions;
const ciW = catArr.filter(x => x.hexagramId >= 33 && x.hexagramId <= 40);
const rfW = reflArr.filter(x => x.hexagramId >= 33 && x.hexagramId <= 40);

const hexNames = ["遯","大壯","晉","明夷","家人","睽","蹇","解"];
const catNames = ["一般","工作事業","感情關係","財務金錢","人際合作","家庭親人","學習考試","身心狀態","重大決策","創業經營","官非合約","心境修行"];
const imagery = [
    "遯尾厲","執之用黃牛之革","係遯","好遯","嘉遯","肥遯","天下有山",
    "壯于趾","貞吉","小人用壯","羝羊觸藩","喪羊于易","羝羊觸藩不能退不能遂","雷在天上",
    "摧如","愁如","眾允","晉如鼫鼠","悔亡失得勿恤","晉其角","明出地上",
    "明夷于飛","夷于左股","用拯馬壯","明夷于南狩","入于左腹","箕子之明夷","初登于天後入于地","明入地中",
    "閑有家","無攸遂在中饋","家人嗃嗃","婦子嘻嘻","富家大吉","王假有家","有孚威如","風自火出",
    "喪馬勿逐","見惡人","見輿曳","其人天且劓","睽孤","厥宗噬膚","見豕負塗","先張之弧後說之弧","上火下澤",
    "往蹇來譽","王臣蹇蹇","往蹇來反","往蹇來連","大蹇朋來","往蹇來碩","利西南不利東北","山上有水",
    "無咎","田獲三狐","負且乘","致寇至","解而拇","君子維有解","公用射隼于高墉","雷雨作"
];
const common = ["建議","可以","可先","應該","必須","風險","隱患","需要注意","危險","目前","現在","眼前","當前","階段","時期","過程","調整","改變","修正","最重要","當下","最近"];

function norm(t) {
    let s = String(t||"");
    for (const h of hexNames) s = s.replace(new RegExp(h,"g"), "");
    for (const i of imagery) s = s.replace(new RegExp(i.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"g"), "");
    for (const c of catNames) s = s.replace(new RegExp(c,"g"), "");
    for (const ct of common) s = s.replace(new RegExp(ct,"g"), "");
    s = s.replace(/[a-zA-Z\d]+|[，。、；：！？""''「」『』／（）\s]/g,"");
    return s;
}

let allPass = true;

// ══════ WAVE A FROZEN ══════
console.log("=== WAVE A FROZEN CHECK ===");
const waCat = catArr.filter(x => x.hexagramId >= 25 && x.hexagramId <= 32);
const waRefl = reflArr.filter(x => x.hexagramId >= 25 && x.hexagramId <= 32);
const waC = frozenA.cat === hashSection(waCat);
const waR = frozenA.refl === hashSection(waRefl);
console.log("Wave A cat: " + (waC ? "UNCHANGED" : "CHANGED!"));
console.log("Wave A refl: " + (waR ? "UNCHANGED" : "CHANGED!"));
if (!waC || !waR) { allPass = false; console.log("WAVE A CORRUPTED"); }

// ══════ CATEGORY ══════
console.log("\n=== WAVE B CATEGORY 33-40 ===");
console.log("total=" + ciW.length + " unique_ids=" + new Set(ciW.map(x => x.id)).size);
if (ciW.length !== 96 || new Set(ciW.map(x => x.id)).size !== 96) allPass = false;
console.log("gold=" + ciW.filter(x => x.qualityLevel === "gold").length + " reviewed=" + ciW.filter(x => x.reviewed === true).length + " needsHumanReview_false=" + ciW.filter(x => x.needsHumanReview === false).length);

const th = { m: ciW.filter(x=>(x.meaning||"").length>=110).length, a: ciW.filter(x=>(x.advice||"").length>=90).length, w: ciW.filter(x=>(x.warning||"").length>=70).length, t: ciW.filter(x=>(x.timing||"").length>=55).length, b: ciW.filter(x=>x.basis&&x.basis.length>=4).length };
for (const [k,v] of Object.entries(th)) { const p = v===96; console.log(k+">="+({m:"110",a:"90",w:"70",t:"55",b:"4"}[k])+": "+v+"/96 "+(p?"PASS":"FAIL")); if (!p) allPass=false; }

console.log("\n--- Per-hex normU ---");
for (let h=33;h<=40;h++) { const a=ciW.filter(x=>x.hexagramId===h); const mu=new Set(a.map(x=>norm(x.meaning))).size, au=new Set(a.map(x=>norm(x.advice))).size, wu=new Set(a.map(x=>norm(x.warning))).size, tu=new Set(a.map(x=>norm(x.timing))).size; const p=mu===12&&au>=11&&wu>=10&&tu>=10; console.log("hex "+h+": m="+mu+" a="+au+" w="+wu+" t="+tu+" "+(p?"PASS":"FAIL")); if(!p)allPass=false; }

const fmu=new Set(ciW.map(x=>norm(x.meaning))).size, fau=new Set(ciW.map(x=>norm(x.advice))).size, fwu=new Set(ciW.map(x=>norm(x.warning))).size, ftu=new Set(ciW.map(x=>norm(x.timing))).size;
console.log("batch: mU="+fmu+" aU="+fau+" wU="+fwu+" tU="+ftu+" "+(fmu>=92&&fau>=88&&fwu>=84&&ftu>=84?"PASS":"FAIL"));
if(!(fmu>=92&&fau>=88&&fwu>=84&&ftu>=84))allPass=false;

const SAFE=["本欄不做醫療診斷","本欄不做獲利保證","本欄不做法律結果判定"];
function splits(t){return(t||"").split(/[。！？；!?;]/).map(s=>s.trim()).filter(s=>s.length>=8&&!SAFE.includes(s));}
const sm={};for(const x of ciW)for(const f of["meaning","advice","warning","timing"])for(const s of splits(x[f]||"")){if(!sm[s])sm[s]={c:0};sm[s].c++;}
const dups=Object.entries(sm).filter(([,v])=>v.c>2);console.log("dup sents>2: "+dups.length+" "+(dups.length===0?"PASS":"FAIL"));if(dups.length>0)allPass=false;

const sk=["上卦帶來推力","兩股力量需要取得平衡","保持彈性並等待時機","不要太快也不要太慢","先觀察再決定","目前仍有調整空間","這是一個需要耐心的階段","每個階段都有不同挑戰","最基礎的準備最重要","此分類最常見的誤判"];
let skh=0;for(const s of sk){const m=ciW.map(x=>(x.meaning||"")+(x.advice||"")+(x.warning||"")).join(" ").match(new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"g"));if(m)skh+=m.length;}
console.log("skeleton: "+skh+" "+(skh<=4?"PASS":"FAIL"));if(skh>4)allPass=false;

const fw=["必定成功","保證獲利","官司一定贏","停止就醫","必有災禍"];let fh=0;for(const w of fw)if(JSON.stringify(ciW).includes(w))fh++;
console.log("forbidden: "+fh+" "+(fh===0?"PASS":"FAIL"));if(fh>0)allPass=false;

// ══════ REFLECTION ══════
console.log("\n=== WAVE B REFLECTION 33-40 ===");
console.log("total="+rfW.length+" unique_ids="+new Set(rfW.map(x=>x.id)).size);
if (rfW.length !== 288 || new Set(rfW.map(x=>x.id)).size !== 288) allPass = false;
console.log("reviewed="+rfW.filter(x=>x.reviewed===true).length+" qualityLevel_reviewed="+rfW.filter(x=>x.qualityLevel==="reviewed").length+" needsHumanReview_false="+rfW.filter(x=>x.needsHumanReview===false).length);

const qLen=rfW.filter(x=>(x.question||"").length>=38&&(x.question||"").length<=105).length;
const qm=rfW.filter(x=>(x.question||"").endsWith("？")).length;
console.log("length 38-105: "+qLen+"/288 "+(qLen===288?"PASS":"FAIL")); if(qLen!==288)allPass=false;
console.log("q-marks: "+qm+"/288 "+(qm===288?"PASS":"FAIL")); if(qm!==288)allPass=false;

const grps={};for(const x of rfW){const k=x.hexagramId+"-"+x.category;if(!grps[k])grps[k]=[];grps[k].push(x);}
let grpFail=0;for(const a of Object.values(grps)){if(new Set(a.map(x=>norm(x.question))).size<3)grpFail++;}
const grpOk=Object.values(grps).filter(x=>x.length===3).length;
const qu=new Set(rfW.map(x=>norm(x.question))).size;
console.log("groups: "+grpOk+"/96 fail:"+grpFail+" normU:"+qu+" "+(qu>=260?"PASS":"FAIL"));
if(qu<260||grpFail>0||grpOk!==96)allPass=false;

for(let h=33;h<=40;h++){const u=new Set(rfW.filter(x=>x.hexagramId===h).map(x=>norm(x.question))).size;console.log("hex "+h+": "+u+"/36 "+(u>=32?"PASS":"FAIL"));if(u<32)allPass=false;}

const qDups=rfW.map(x=>x.question).filter((q,i,arr)=>arr.indexOf(q)!==i).length;console.log("dup questions: "+qDups+" "+(qDups===0?"PASS":"FAIL"));if(qDups>0)allPass=false;

const rfSk=["你比較接近","你最需要做出的調整","哪條界線尚未準備好跨越","現在哪一股力量更明顯","下一步要前進還是停下","最容易忽略的風險","你是否已經準備好","你可以如何調整","目前最需要注意什麼","什麼選擇最適合你"];
let rfSkh=0;const rTxt=rfW.map(x=>x.question||"").join("\n");for(const s of rfSk){const m=rTxt.match(new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"g"));if(m)rfSkh+=m.length;}
console.log("rf skeleton: "+rfSkh+" "+(rfSkh<=4?"PASS":"FAIL"));if(rfSkh>4)allPass=false;

// ══════ PROTECTED HASHES ══════
console.log("\n=== PROTECTED HASHES ===");
const checks=[
    ["Category hex 1-24",hashes.cat_h1to24,hashSection(catArr.filter(x=>x.hexagramId>=1&&x.hexagramId<=24))],
    ["Reflection hex 1-24",hashes.refl_h1to24,hashSection(reflArr.filter(x=>x.hexagramId>=1&&x.hexagramId<=24))],
    ["hexagrams",hashes.hexagrams,hashSection(hex.hexagrams)],
    ["lines",hashes.lines_file,hashFile(path.join(dataDir,"lines.data.js"))],
    ["pairInterpretations",hashes.pairInterpretations_file,hashFile(path.join(dataDir,"pairInterpretations.data.js"))],
    ["lineCategoryInterpretations",hashes.lineCategoryInterpretations_file,hashFile(path.join(dataDir,"lineCategoryInterpretations.data.js"))],
    ["actionSuggestions",hashes.actionSuggestions_file,hashFile(path.join(dataDir,"actionSuggestions.data.js"))],
    ["riskWarnings",hashes.riskWarnings_file,hashFile(path.join(dataDir,"riskWarnings.data.js"))],
];
let hOk=true;for(const[n,exp,act]of checks){const p=exp===act;console.log((p?"OK":"CHANGED")+": "+n);if(!p)hOk=false;}
if(!hOk)allPass=false;

console.log("\n=== WAVE B GATE: " + (allPass ? "ALL PASS" : "FAIL") + " ===");
if (!allPass) process.exitCode = 1;
