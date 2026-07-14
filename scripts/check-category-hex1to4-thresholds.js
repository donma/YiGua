const fs=require("fs"),p=require("path"),c=require("crypto");
const root=process.argv[2]?p.resolve(process.argv[2]):p.resolve(__dirname,"..");
const d=p.join(root,"src","data");

const ci=JSON.parse((()=>{const x=fs.readFileSync(p.join(d,"categoryInterpretations.data.js"),"utf8");return x.substring(x.indexOf("= [")+2,x.lastIndexOf("];")+1);})());
const ci14=ci.filter(x=>x.hexagramId>=1&&x.hexagramId<=4);

const m=ci14.filter(x=>(x.meaning||"").length>=110).length;
const a=ci14.filter(x=>(x.advice||"").length>=90).length;
const w=ci14.filter(x=>(x.warning||"").length>=70).length;
const t=ci14.filter(x=>(x.timing||"").length>=55).length;
const b=ci14.filter(x=>x.basis&&Array.isArray(x.basis)&&x.basis.length>=4).length;
console.log("meaning>=110: "+m+"/48\nadvice>=90: "+a+"/48\nwarning>=70: "+w+"/48\ntiming>=55: "+t+"/48\nbasis>=4: "+b+"/48");

function norm(text){return String(text||"").replace(/乾為天|坤為地|水雷屯|山水蒙|乾|坤|屯|蒙/g,"").replace(/潛龍勿用|見龍在田|終日乾乾|或躍在淵|飛龍在天|亢龍有悔|群龍無首|自強不息/g,"").replace(/履霜堅冰至|直方大|含章可貞|括囊|黃裳元吉|龍戰于野|厚德載物/g,"").replace(/磐桓|屯如邅如|即鹿無虞|乘馬班如|屯其膏|泣血漣如|雲雷屯/g,"").replace(/發蒙|包蒙|困蒙|童蒙吉|擊蒙|匪我求童蒙|山下出泉/g,"").replace(/一般|工作事業|感情關係|財務金錢|人際合作|家庭親人|學習考試|身心狀態|重大決策|創業經營|官非合約|心境修行/g,"").replace(/[\d]+|[，。、；：！？／\s]/g,"").replace(/建議|可以|可先|應該|必須|風險|隱患|需要注意|危險|目前|現在|眼前|當前|階段|時期|過程|調整|改變|修正|最重要/g,"");}
console.log("meaningNormU="+new Set(ci14.map(x=>norm(x.meaning))).size+" adviceNormU="+new Set(ci14.map(x=>norm(x.advice))).size+" warningNormU="+new Set(ci14.map(x=>norm(x.warning))).size+" timingNormU="+new Set(ci14.map(x=>norm(x.timing))).size);

// Duplicate sentence check (excluding safety disclaimers)
function splitSentences(text){return (text||"").split(/[。！？；!?;]/).map(s=>s.trim().replace(/^[""'']/g,"").replace(/[""'']$/g,"")).filter(s=>s.length>=8);}
const sentMap={};const safetyPrefixes=["本欄不做醫療","本欄不做法律","本欄不做獲利","本欄不做投資","本欄不提供"];
for(const x of ci14){for(const field of ["meaning","advice","warning","timing"]){const sents=splitSentences(x[field]||"");for(const s of sents){if(safetyPrefixes.some(p=>s.includes(p)))continue;if(!sentMap[s])sentMap[s]={count:0,entries:[]};sentMap[s].count++;sentMap[s].entries.push({id:x.id,field});}}}
const dups=Object.entries(sentMap).filter(([,v])=>v.count>2).sort((a,b)=>b[1].count-a[1].count);
console.log("content duplicate sentences (>2, excl safety): "+dups.length);
if(dups.length>0){for(const [s,v] of dups.slice(0,5)){console.log("  COUNT="+v.count+": \""+s.substring(0,60)+"...\"");v.entries.slice(0,3).forEach(e=>console.log("    "+e.id+"."+e.field));}}

const fb=["必定成功","保證獲利","官司一定贏","停止就醫","必有災禍"];
console.log("forbidden: "+fb.filter(t=>JSON.stringify(ci14).includes(t)).length);

const hashes=JSON.parse(fs.readFileSync(p.join(root,"scripts","cleanup_hashes.json"),"utf8"));
let hashOk=true;
const rfRaw=fs.readFileSync(p.join(d,"reflectionQuestions.data.js"),"utf8");
if(c.createHash("sha256").update(rfRaw).digest("hex")!==hashes.reflectionQuestions)hashOk=false;
const ci564=JSON.stringify(ci.filter(x=>x.hexagramId>=5&&x.hexagramId<=64));
if(c.createHash("sha256").update(ci564).digest("hex")!==hashes.cat5to64)hashOk=false;
for(const f of ["hexagrams","lines","pairInterpretations","lineCategoryInterpretations","actionSuggestions","riskWarnings"]){const raw=fs.readFileSync(p.join(d,f+".data.js"),"utf8");if(c.createHash("sha256").update(raw).digest("hex")!==hashes[f])hashOk=false;}
console.log("protected hashes: "+(hashOk?"ALL UNCHANGED":"CHANGED!"));

const pass=m===48&&a===48&&w===48&&t===48&&b===48&&dups.length===0&&hashOk;
console.log("\nOVERALL: "+(pass?"PASS":"FAIL"));
process.exit(pass?0:1);