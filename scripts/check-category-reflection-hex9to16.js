const fs=require("fs"),p=require("path"),c=require("crypto");
const root=process.argv[2]?p.resolve(process.argv[2]):p.resolve(__dirname,"..");
const d=p.join(root,"src","data");
const hashes=JSON.parse(fs.readFileSync(p.join(root,"scripts","h916_hashes.json"),"utf8"));

function norm(text){return String(text||"").replace(/小畜|履|泰|否|同人|大有|謙|豫/g,"").replace(/密雲不雨|復自道|牽復|輿說輻|夫妻反目|有孚血去惕出|有孚攣如|既雨既處|月幾望|懿文德/g,"").replace(/履虎尾|素履|履道坦坦|眇能視|跛能履|夬履|視履考祥|上天下澤|辨上下定民志/g,"").replace(/小往大來|拔茅茹|包荒|用馮河|翩翩|帝乙歸妹|城復于隍|天地交|財成天地/g,"").replace(/否之匪人|不利君子貞|大往小來|包承|包羞|有命無咎|休否|傾否|天地不交|儉德辟難/g,"").replace(/同人于野|同人于門|同人于宗|伏戎于莽|乘其墉|先號咷而後笑|同人于郊|天與火|類族辨物/g,"").replace(/無交害|大車以載|公用亨于天子|匪其彭|厥孚交如|威如吉|自天祐之|火在天上|遏惡揚善/g,"").replace(/謙謙君子|鳴謙|勞謙|撝謙|不富以其鄰|利用侵伐|地中有山|裒多益寡稱物平施/g,"").replace(/介于石|鳴豫凶|盱豫悔|由豫|貞疾恆不死|冥豫|雷出地奮|作樂崇德/g,"").replace(/一般|工作事業|感情關係|財務金錢|人際合作|家庭親人|學習考試|身心狀態|重大決策|創業經營|官非合約|心境修行/g,"").replace(/[\d]+|[，。、；：！？／\s]/g,"").replace(/建議|可以|可先|應該|必須|風險|隱患|需要注意|危險|目前|現在|眼前|當前|階段|時期|過程|調整|改變|修正|最重要/g,"");}

const ci=JSON.parse((()=>{const x=fs.readFileSync(p.join(d,"categoryInterpretations.data.js"),"utf8");return x.substring(x.indexOf("= [")+2,x.lastIndexOf("];")+1);})());
const ci916=ci.filter(x=>x.hexagramId>=9&&x.hexagramId<=16);
console.log("=== CATEGORY HEX 9-16 ===");
console.log("total="+ci916.length+" gold="+ci916.filter(x=>x.qualityLevel==="gold").length);
const th={m:ci916.filter(x=>(x.meaning||"").length>=110).length,a:ci916.filter(x=>(x.advice||"").length>=90).length,w:ci916.filter(x=>(x.warning||"").length>=70).length,t:ci916.filter(x=>(x.timing||"").length>=55).length,b:ci916.filter(x=>x.basis&&x.basis.length>=4).length};
console.log("m>=110:"+th.m+" a>=90:"+th.a+" w>=70:"+th.w+" t>=55:"+th.t+" b>=4:"+th.b);

// Per-hex
for(let hid=9;hid<=16;hid++){const arr=ci916.filter(x=>x.hexagramId===hid);const mu=new Set(arr.map(x=>norm(x.meaning))).size;const au=new Set(arr.map(x=>norm(x.advice))).size;const wu=new Set(arr.map(x=>norm(x.warning))).size;const tu=new Set(arr.map(x=>norm(x.timing))).size;console.log("hex "+hid+": mU="+mu+" aU="+au+" wU="+wu+" tU="+tu+" "+(mu>=12&&au>=11&&wu>=10&&tu>=10?"PASS":"FAIL"));}

// Full batch
const fmu=new Set(ci916.map(x=>norm(x.meaning))).size;const fau=new Set(ci916.map(x=>norm(x.advice))).size;
const fwu=new Set(ci916.map(x=>norm(x.warning))).size;const ftu=new Set(ci916.map(x=>norm(x.timing))).size;
console.log("batch: mU="+fmu+" aU="+fau+" wU="+fwu+" tU="+ftu+" "+(fmu>=92&&fau>=88&&fwu>=84&&ftu>=84?"PASS":"FAIL"));

// Dup sentences
function splitSentences(text){return (text||"").split(/[。！？；!?;]/).map(s=>s.trim()).filter(s=>s.length>=8);}
const sentMap={};const sp=["本欄不做醫療","本欄不做法律","本欄不做獲利","本欄不提供投資"];
for(const x of ci916){for(const f of ["meaning","advice","warning","timing"]){for(const s of splitSentences(x[f]||"")){if(sp.some(p=>s.includes(p)))continue;if(!sentMap[s])sentMap[s]={c:0};sentMap[s].c++;}}}
const dups=Object.entries(sentMap).filter(([,v])=>v.c>2).length;
console.log("dup sents >2: "+dups+" "+(dups===0?"PASS":"FAIL"));
console.log("forbidden: "+(["必定成功","保證獲利","官司一定贏","停止就醫","必有災禍"].filter(t=>JSON.stringify(ci916).includes(t)).length));

// Reflection
const rf=JSON.parse((()=>{const x=fs.readFileSync(p.join(d,"reflectionQuestions.data.js"),"utf8");return x.substring(x.indexOf("= [")+2,x.lastIndexOf("];")+1);})());
const rf916=rf.filter(x=>x.hexagramId>=9&&x.hexagramId<=16);
console.log("\n=== REFLECTION HEX 9-16 ===");
console.log("total="+rf916.length+" reviewed="+rf916.filter(x=>x.reviewed===true).length);
const grps={};for(const x of rf916){const k=x.hexagramId+"-"+x.category;if(!grps[k])grps[k]=[];grps[k].push(x);}
const grpOk=Object.values(grps).filter(x=>x.length===3).length;
let grpFail=0;for(const a of Object.values(grps)){if(new Set(a.map(x=>norm(x.question))).size<3)grpFail++;}
const qm=rf916.filter(x=>(x.question||"").endsWith("？")).length;
const qu=new Set(rf916.map(x=>norm(x.question))).size;
console.log("3q:"+grpOk+"/96 fail:"+grpFail+" qM:"+qm+" normU:"+qu+" "+(qu>=255?"PASS":"FAIL"));

// Hashes
let hOk=true;
if(c.createHash("sha256").update(JSON.stringify(ci.filter(x=>x.hexagramId>=1&&x.hexagramId<=8))).digest("hex")!==hashes.ci1to8)hOk=false;
if(c.createHash("sha256").update(JSON.stringify(ci.filter(x=>x.hexagramId>=17))).digest("hex")!==hashes.ci17to64)hOk=false;
if(c.createHash("sha256").update(JSON.stringify(rf.filter(x=>x.hexagramId>=1&&x.hexagramId<=8))).digest("hex")!==hashes.rf1to8)hOk=false;
if(c.createHash("sha256").update(JSON.stringify(rf.filter(x=>x.hexagramId>=17))).digest("hex")!==hashes.rf17to64)hOk=false;
for(const f of ["hexagrams","lines","pairInterpretations","lineCategoryInterpretations","actionSuggestions","riskWarnings"]){const raw=fs.readFileSync(p.join(d,f+".data.js"),"utf8");if(c.createHash("sha256").update(raw).digest("hex")!==hashes[f])hOk=false;}
console.log("\nprotected hashes: "+(hOk?"ALL UNCHANGED":"CHANGED!"));