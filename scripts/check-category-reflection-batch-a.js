const fs=require("fs"),p=require("path"),c=require("crypto"),r=p.resolve("D:\\AI_PROJECTS\\Zero1Matrix"),d=p.join(r,"src","data");

// Freeze hashes
const freeze=JSON.parse(fs.readFileSync(p.join(r,"scripts","batchA_hashes.json"),"utf8"));

// Verify category hex 1-16
const ci=JSON.parse((()=>{const x=fs.readFileSync(p.join(d,"categoryInterpretations.data.js"),"utf8");return x.substring(x.indexOf("= [")+2,x.lastIndexOf("];")+1);})());
const ci1to16=ci.filter(x=>x.hexagramId>=1&&x.hexagramId<=16);
console.log("=== CATEGORY HEX 1-16 ===");
console.log("total="+ci1to16.length+" uniqueIDs="+new Set(ci1to16.map(x=>x.id)).size);
const ciGold=ci1to16.filter(x=>x.qualityLevel==="gold").length;
const ciRev=ci1to16.filter(x=>x.reviewed===true).length;
console.log("gold="+ciGold+" reviewed="+ciRev);

const ciM100=ci1to16.filter(x=>(x.meaning||"").length>=100).length;
const ciA80=ci1to16.filter(x=>(x.advice||"").length>=80).length;
const ciW60=ci1to16.filter(x=>(x.warning||"").length>=60).length;
const ciT50=ci1to16.filter(x=>(x.timing||"").length>=50).length;
const ciB4=ci1to16.filter(x=>x.basis&&Array.isArray(x.basis)&&x.basis.length>=4).length;
const ciSA=ci1to16.filter(x=>!x.scoreAdjust).length;
console.log("meaning>=100:"+ciM100+" advice>=80:"+ciA80+" warning>=60:"+ciW60+" timing>=50:"+ciT50+" basis>=4:"+ciB4+" missingSA:"+ciSA);

// Per-hex 12-cat uniqueness
let badHex=0;let minU=12;
for(let hid=1;hid<=16;hid++){
  const arr=ci1to16.filter(x=>x.hexagramId===hid);
  const norms=arr.map(x=>(x.meaning||"").substring(0,50));
  const u=new Set(norms).size;
  if(u<11)badHex++;
  if(u<minU)minU=u;
}
console.log("hex <11 unique: "+badHex+"/16 (min="+minU+")");

// Duplicate complete paragraphs
const allPara=ci1to16.map(x=>(x.meaning||"").substring(0,80));
const dupCount={};for(const t of allPara){dupCount[t]=(dupCount[t]||0)+1;}
const badDup=Object.entries(dupCount).filter(([,v])=>v>2).length;
console.log("paragraphs >2 dup: "+badDup);

// Forbidden
const fbt=["必定成功","一定成功","保證獲利","官司一定贏","停止就醫","不用看醫生","必有災禍","注定失敗"];
const fh=fbt.filter(t=>JSON.stringify(ci1to16).includes(t)).length;
console.log("forbidden: "+fh);

// Verify reflection hex 1-16
const rf=JSON.parse((()=>{const x=fs.readFileSync(p.join(d,"reflectionQuestions.data.js"),"utf8");return x.substring(x.indexOf("= [")+2,x.lastIndexOf("];")+1);})());
const rf1to16=rf.filter(x=>x.hexagramId>=1&&x.hexagramId<=16);
console.log("\n=== REFLECTION HEX 1-16 ===");
console.log("total="+rf1to16.length+" uniqueIDs="+new Set(rf1to16.map(x=>x.id)).size);
const rfRev=rf1to16.filter(x=>x.reviewed===true).length;
console.log("reviewed="+rfRev+" qualityLevel=reviewed="+rf1to16.filter(x=>x.qualityLevel==="reviewed").length);

// Groups
const grps={};for(const x of rf1to16){const k=x.hexagramId+"-"+x.category;if(!grps[k])grps[k]=[];grps[k].push(x);}
const grpOk=Object.values(grps).filter(x=>x.length===3).length;
console.log("3q groups: "+grpOk+"/"+Object.keys(grps).length);

// Per-group 3q unique
let badGrp=0;
for(const arr of Object.values(grps)){
  const qs=arr.map(x=>(x.question||"").substring(0,30));
  if(new Set(qs).size<3)badGrp++;
}
console.log("groups with non-unique 3q: "+badGrp);

// Normalized unique
const allQ=rf1to16.map(x=>(x.question||""));
const normU=new Set(allQ).size;
console.log("unique questions: "+normU+"/576");

// Question marks
const qm=rf1to16.filter(x=>(x.question||"").endsWith("？")).length;
console.log("question marks: "+qm+"/576");

// Forbidden
const fh2=fbt.filter(t=>JSON.stringify(rf1to16).includes(t)).length;
console.log("forbidden: "+fh2);

// Hash verification
const hexRaw=fs.readFileSync(p.join(d,"hexagrams.data.js"),"utf8");
const hexH=c.createHash("sha256").update(hexRaw).digest("hex").substring(0,12);
console.log("\nhexagrams hash: "+hexH+" (frozen: "+freeze.hexagrams+") "+(hexH===freeze.hexagrams?"UNCHANGED":"CHANGED!"));

// Category 17-64 hash
const ci17to64=ci.filter(x=>x.hexagramId>=17&&x.hexagramId<=64);
const ci17H=c.createHash("sha256").update(JSON.stringify(ci17to64)).digest("hex").substring(0,12);
console.log("cat 17-64 hash: "+ci17H+" (frozen: "+freeze.category17to64+") "+(ci17H===freeze.category17to64?"UNCHANGED":"CHANGED!"));

// Reflection 17-64 hash
const rf17to64=rf.filter(x=>x.hexagramId>=17&&x.hexagramId<=64);
const rf17H=c.createHash("sha256").update(JSON.stringify(rf17to64)).digest("hex").substring(0,12);
console.log("ref 17-64 hash: "+rf17H+" (frozen: "+freeze.reflection17to64+") "+(rf17H===freeze.reflection17to64?"UNCHANGED":"CHANGED!"));