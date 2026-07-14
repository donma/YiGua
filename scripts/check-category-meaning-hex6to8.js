const fs=require("fs"),p=require("path"),c=require("crypto");
const root=process.argv[2]?p.resolve(process.argv[2]):p.resolve(__dirname,"..");
const d=p.join(root,"src","data");
const hashes=JSON.parse(fs.readFileSync(p.join(root,"scripts","mrepair_hashes.json"),"utf8"));

const ci=JSON.parse((()=>{const x=fs.readFileSync(p.join(d,"categoryInterpretations.data.js"),"utf8");return x.substring(x.indexOf("= [")+2,x.lastIndexOf("];")+1);})());
const target24=["money","people","family","study","health","decision","business","spiritual"];
const repaired=ci.filter(x=>x.hexagramId>=6&&x.hexagramId<=8&&target24.includes(x.category));
console.log("=== CATEGORY MEANING REPAIR HEX 6-8 ===");
console.log("total="+repaired.length);
const mOk=repaired.filter(x=>(x.meaning||"").length>=110).length;
console.log("meaning>=110: "+mOk+"/24");
const gOk=repaired.filter(x=>x.qualityLevel==="gold"&&x.reviewed===true&&x.needsHumanReview===false).length;
console.log("gold+reviewed+nhr=false: "+gOk+"/24");

// Normalized uniqueness
function norm(text){return String(text||"").replace(/需|訟|師|比|水天需|天水訟|地水師|水地比/g,"").replace(/有孚窒惕|中吉終凶|不永所事|歸而逋|食舊德|不克訟|復即命|終朝三褫|或錫之鞶帶|天與水違行|作事謀始|利見大人|不利涉大川/g,"").replace(/師出以律|否臧凶|在師中吉|長子帥師|弟子輿尸|師左次|田有禽|大君有命|開國承家|小人勿用|丈人|王三錫命|地中有水|容民畜眾/g,"").replace(/有孚比之|比之自內|比之匪人|後夫凶|外比之|顯比|王用三驅|比之無首|不寧方來|地上有水/g,"").replace(/一般|工作事業|感情關係|財務金錢|人際合作|家庭親人|學習考試|身心狀態|重大決策|創業經營|官非合約|心境修行/g,"").replace(/[\d]+|[，。、；：！？／\s]/g,"").replace(/建議|可以|可先|應該|必須|風險|隱患|需要注意|危險|目前|現在|眼前|當前|階段|時期|過程|調整|改變|修正|最重要|本欄不做/g,"");}
const nu=new Set(repaired.map(x=>norm(x.meaning))).size;
console.log("full batch normU: "+nu+"/24 "+(nu===24?"PASS":"FAIL"));

// Per-hex normU
for(let hid=6;hid<=8;hid++){const arr=repaired.filter(x=>x.hexagramId===hid);console.log("hex "+hid+": normU="+new Set(arr.map(x=>norm(x.meaning))).size+"/8 "+(new Set(arr.map(x=>norm(x.meaning))).size===8?"PASS":"FAIL"));}

// Duplicate sentences
function splitSentences(text){return (text||"").split(/[。！？；!?;]/).map(s=>s.trim()).filter(s=>s.length>=8);}
const sentMap={};const safetyP=["本欄不做醫療","本欄不做法律","本欄不做獲利","本欄不提供投資"];
for(const x of repaired){for(const s of splitSentences(x.meaning||"")){if(safetyP.some(p=>s.includes(p)))continue;if(!sentMap[s])sentMap[s]={c:0};sentMap[s].c++;}}
const dups=Object.entries(sentMap).filter(([,v])=>v.c>2).length;
console.log("dup sentences >2: "+dups+" "+(dups===0?"PASS":"FAIL"));

const fb=["必定成功","保證獲利","官司一定贏","停止就醫","必有災禍"];
console.log("forbidden: "+fb.filter(t=>JSON.stringify(repaired).includes(t)).length);

// Hash checks
const ciAll=ci;
const rf=JSON.parse((()=>{const x=fs.readFileSync(p.join(d,"reflectionQuestions.data.js"),"utf8");return x.substring(x.indexOf("= [")+2,x.lastIndexOf("];")+1);})());
const coreCats=["general","career","love","legal"];
let hashOk=true;
if(c.createHash("sha256").update(JSON.stringify(rf)).digest("hex")!==hashes.rf){hashOk=false;console.log("RF: CHANGED");}
if(c.createHash("sha256").update(JSON.stringify(ciAll.filter(x=>x.hexagramId===5))).digest("hex")!==hashes.ci5){hashOk=false;console.log("CI5: CHANGED");}
if(c.createHash("sha256").update(JSON.stringify(ciAll.filter(x=>x.hexagramId>=1&&x.hexagramId<=4))).digest("hex")!==hashes.ci1to4){hashOk=false;console.log("CI1-4: CHANGED");}
if(c.createHash("sha256").update(JSON.stringify(ciAll.filter(x=>x.hexagramId>=9))).digest("hex")!==hashes.ci9to64){hashOk=false;console.log("CI9-64: CHANGED");}
if(c.createHash("sha256").update(JSON.stringify(ciAll.filter(x=>x.hexagramId===6&&coreCats.includes(x.category)))).digest("hex")!==hashes.ci6core){hashOk=false;console.log("CI6core: CHANGED");}
if(c.createHash("sha256").update(JSON.stringify(ciAll.filter(x=>x.hexagramId===7&&coreCats.includes(x.category)))).digest("hex")!==hashes.ci7core){hashOk=false;console.log("CI7core: CHANGED");}
if(c.createHash("sha256").update(JSON.stringify(ciAll.filter(x=>x.hexagramId===8&&coreCats.includes(x.category)))).digest("hex")!==hashes.ci8core){hashOk=false;console.log("CI8core: CHANGED");}
const advFields=ciAll.filter(x=>x.hexagramId>=6&&x.hexagramId<=8&&target24.includes(x.category)).map(x=>({advice:x.advice,warning:x.warning,timing:x.timing,basis:x.basis,scoreAdjust:x.scoreAdjust}));
if(c.createHash("sha256").update(JSON.stringify(advFields)).digest("hex")!==hashes.adviceWTB){hashOk=false;console.log("adviceWTB: CHANGED");}
for(const f of ["hexagrams","lines","pairInterpretations","lineCategoryInterpretations","actionSuggestions","riskWarnings"]){const raw=fs.readFileSync(p.join(d,f+".data.js"),"utf8");if(c.createHash("sha256").update(raw).digest("hex")!==hashes[f]){hashOk=false;console.log(f+": CHANGED");}}
console.log("\nprotected hashes: "+(hashOk?"ALL UNCHANGED":"SOME CHANGED!"));
const pass=mOk===24&&gOk===24&&nu===24&&dups===0&&hashOk;
console.log("OVERALL: "+(pass?"PASS":"FAIL"));
process.exit(pass?0:1);