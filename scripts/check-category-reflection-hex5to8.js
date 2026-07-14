const fs=require("fs"),p=require("path"),c=require("crypto");
const root=process.argv[2]?p.resolve(process.argv[2]):p.resolve(__dirname,"..");
const d=p.join(root,"src","data");
const hashes=JSON.parse(fs.readFileSync(p.join(root,"scripts","h58_hashes.json"),"utf8"));

function norm(text){return String(text||"").replace(/需|訟|師|比/g,"").replace(/水天需|天水訟|地水師|水地比/g,"").replace(/需于郊|需于沙|需于泥|需于血|需于酒食|入于穴|不速之客|致寇至|出自穴|有孚光亨|雲上於天|飲食宴樂/g,"").replace(/有孚窒惕|中吉終凶|不永所事|歸而逋|食舊德|不克訟|復即命|終朝三褫|天與水違行|作事謀始/g,"").replace(/師出以律|否臧凶|在師中吉|長子帥師|弟子輿尸|師左次|田有禽|大君有命|開國承家|小人勿用|地中有水|容民畜眾/g,"").replace(/有孚比之|比之自內|比之匪人|後夫凶|外比之|顯比|王用三驅|比之無首|地上有水/g,"").replace(/一般|工作事業|感情關係|財務金錢|人際合作|家庭親人|學習考試|身心狀態|重大決策|創業經營|官非合約|心境修行/g,"").replace(/[\d]+|[，。、；：！？／\s]/g,"").replace(/建議|可以|可先|應該|必須|風險|隱患|需要注意|危險|目前|現在|眼前|當前|階段|時期|過程|調整|改變|修正|最重要/g,"");}

const ci=JSON.parse((()=>{const x=fs.readFileSync(p.join(d,"categoryInterpretations.data.js"),"utf8");return x.substring(x.indexOf("= [")+2,x.lastIndexOf("];")+1);})());
const ci58=ci.filter(x=>x.hexagramId>=5&&x.hexagramId<=8);
console.log("=== CATEGORY HEX 5-8 ===");
console.log("total="+ci58.length+" gold="+ci58.filter(x=>x.qualityLevel==="gold").length+" reviewed="+ci58.filter(x=>x.reviewed===true).length);
const th={m:ci58.filter(x=>(x.meaning||"").length>=110).length,a:ci58.filter(x=>(x.advice||"").length>=90).length,w:ci58.filter(x=>(x.warning||"").length>=70).length,t:ci58.filter(x=>(x.timing||"").length>=55).length,b:ci58.filter(x=>x.basis&&Array.isArray(x.basis)&&x.basis.length>=4).length};
console.log("m>=110:"+th.m+" a>=90:"+th.a+" w>=70:"+th.w+" t>=55:"+th.t+" b>=4:"+th.b);

// Per-hex normU
let allHexPass=true;
for(let hid=5;hid<=8;hid++){const arr=ci58.filter(x=>x.hexagramId===hid);const mu=new Set(arr.map(x=>norm(x.meaning))).size;const au=new Set(arr.map(x=>norm(x.advice))).size;const wu=new Set(arr.map(x=>norm(x.warning))).size;const tu=new Set(arr.map(x=>norm(x.timing))).size;const ok=mu>=12&&au>=11&&wu>=10&&tu>=10;if(!ok)allHexPass=false;console.log("hex "+hid+": mU="+mu+" aU="+au+" wU="+wu+" tU="+tu+" "+(ok?"PASS":"FAIL"));}
console.log("per-hex normU: "+(allHexPass?"PASS":"FAIL"));

// Full batch normU
const fmu=new Set(ci58.map(x=>norm(x.meaning))).size;
const fau=new Set(ci58.map(x=>norm(x.advice))).size;
const fwu=new Set(ci58.map(x=>norm(x.warning))).size;
const ftu=new Set(ci58.map(x=>norm(x.timing))).size;
console.log("batch normU: m="+fmu+" a="+fau+" w="+fwu+" t="+ftu+" "+(fmu>=48&&fau>=45&&fwu>=43&&ftu>=44?"PASS":"FAIL"));

// Duplicate sentences (excl safety)
function splitSentences(text){return (text||"").split(/[。！？；!?;]/).map(s=>s.trim()).filter(s=>s.length>=8);}
const sentMap={};const safetyP=["本欄不做醫療","本欄不做法律","本欄不做獲利","本欄不提供投資"];
for(const x of ci58){for(const f of ["meaning","advice","warning","timing"]){for(const s of splitSentences(x[f]||"")){if(safetyP.some(p=>s.includes(p)))continue;if(!sentMap[s])sentMap[s]={c:0};sentMap[s].c++;}}}
const dups=Object.entries(sentMap).filter(([,v])=>v.c>2).length;
console.log("dup sentences >2: "+dups+" "+(dups===0?"PASS":"FAIL"));

// Forbidden
const fb=["必定成功","保證獲利","官司一定贏","停止就醫","必有災禍"];
console.log("forbidden: "+fb.filter(t=>JSON.stringify(ci58).includes(t)).length);

// Reflection
const rf=JSON.parse((()=>{const x=fs.readFileSync(p.join(d,"reflectionQuestions.data.js"),"utf8");return x.substring(x.indexOf("= [")+2,x.lastIndexOf("];")+1);})());
const rf58=rf.filter(x=>x.hexagramId>=5&&x.hexagramId<=8);
console.log("\n=== REFLECTION HEX 5-8 ===");
console.log("total="+rf58.length+" reviewed="+rf58.filter(x=>x.reviewed===true).length);
const grps={};for(const x of rf58){const k=x.hexagramId+"-"+x.category;if(!grps[k])grps[k]=[];grps[k].push(x);}
const grpOk=Object.values(grps).filter(x=>x.length===3).length;
let grpFail=0;for(const a of Object.values(grps)){if(new Set(a.map(x=>norm(x.question))).size<3)grpFail++;}
const qm=rf58.filter(x=>(x.question||"").endsWith("？")).length;
const allQ=rf58.map(x=>norm(x.question));const normQU=new Set(allQ).size;
console.log("3q groups:"+grpOk+"/48 grpFail:"+grpFail+" qMarks:"+qm+" normQU:"+normQU);
console.log("normQU>=125: "+(normQU>=125?"PASS":"FAIL"));

// Hash verification
let hashOk=true;
const ciRaw=fs.readFileSync(p.join(d,"categoryInterpretations.data.js"),"utf8");const ciAll=JSON.parse(ciRaw.substring(ciRaw.indexOf("= [")+2,ciRaw.lastIndexOf("];")+1));
if(c.createHash("sha256").update(JSON.stringify(ciAll.filter(x=>x.hexagramId>=1&&x.hexagramId<=4))).digest("hex")!==hashes.cat1to4)hashOk=false;
if(c.createHash("sha256").update(JSON.stringify(ciAll.filter(x=>x.hexagramId>=9&&x.hexagramId<=64))).digest("hex")!==hashes.cat9to64)hashOk=false;
const rfAll=JSON.parse((()=>{const x=fs.readFileSync(p.join(d,"reflectionQuestions.data.js"),"utf8");return x.substring(x.indexOf("= [")+2,x.lastIndexOf("];")+1);})());
if(c.createHash("sha256").update(JSON.stringify(rfAll.filter(x=>x.hexagramId>=1&&x.hexagramId<=4))).digest("hex")!==hashes.rf1to4)hashOk=false;
if(c.createHash("sha256").update(JSON.stringify(rfAll.filter(x=>x.hexagramId>=9&&x.hexagramId<=64))).digest("hex")!==hashes.rf9to64)hashOk=false;
for(const f of ["hexagrams","lines","pairInterpretations","lineCategoryInterpretations","actionSuggestions","riskWarnings"]){const raw=fs.readFileSync(p.join(d,f+".data.js"),"utf8");if(c.createHash("sha256").update(raw).digest("hex")!==hashes[f])hashOk=false;}
console.log("\nprotected hashes: "+(hashOk?"ALL UNCHANGED":"CHANGED!"));