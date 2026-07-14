const fs=require("fs"),p=require("path"),c=require("crypto"),r=p.resolve("D:\\AI_PROJECTS\\Zero1Matrix"),d=p.join(r,"src","data");
const tdy=new Date().toISOString().split("T")[0];

// Freeze all immutable hashes
const ci=JSON.parse((()=>{const x=fs.readFileSync(p.join(d,"categoryInterpretations.data.js"),"utf8");return x.substring(x.indexOf("= [")+2,x.lastIndexOf("];")+1);})());
const rf=JSON.parse((()=>{const x=fs.readFileSync(p.join(d,"reflectionQuestions.data.js"),"utf8");return x.substring(x.indexOf("= [")+2,x.lastIndexOf("];")+1);})());
const hashes={};
hashes.ci1to8=c.createHash("sha256").update(JSON.stringify(ci.filter(x=>x.hexagramId>=1&&x.hexagramId<=8))).digest("hex");
hashes.ci17to64=c.createHash("sha256").update(JSON.stringify(ci.filter(x=>x.hexagramId>=17&&x.hexagramId<=64))).digest("hex");
hashes.rf1to8=c.createHash("sha256").update(JSON.stringify(rf.filter(x=>x.hexagramId>=1&&x.hexagramId<=8))).digest("hex");
hashes.rf17to64=c.createHash("sha256").update(JSON.stringify(rf.filter(x=>x.hexagramId>=17&&x.hexagramId<=64))).digest("hex");
for(const f of ["hexagrams","lines","pairInterpretations","lineCategoryInterpretations","actionSuggestions","riskWarnings"]){const raw=fs.readFileSync(p.join(d,f+".data.js"),"utf8");hashes[f]=c.createHash("sha256").update(raw).digest("hex");}
fs.writeFileSync(p.join(r,"scripts","h916_hashes.json"),JSON.stringify(hashes));

// Downgrade hex 9-16
for(const x of ci){if(x.hexagramId>=9&&x.hexagramId<=16){x.qualityLevel="refined";x.reviewed=false;x.needsHumanReview=true;x.reviewedBy="";x.reviewedAt="";}}
for(const x of rf){if(x.hexagramId>=9&&x.hexagramId<=16){x.qualityLevel="refined";x.reviewed=false;x.needsHumanReview=true;x.reviewedBy="";x.reviewedAt="";}}
fs.writeFileSync(p.join(d,"categoryInterpretations.data.js"),"window.Zero1MatrixData = window.Zero1MatrixData || {};\nwindow.Zero1MatrixData.categoryInterpretations = "+JSON.stringify(ci)+";");
fs.writeFileSync(p.join(d,"reflectionQuestions.data.js"),"window.Zero1MatrixData = window.Zero1MatrixData || {};\nwindow.Zero1MatrixData.reflectionQuestions = "+JSON.stringify(rf)+";");
console.log("Hashes frozen: "+Object.keys(hashes).length+". CI/RF hex 9-16 downgraded. CI="+ci.length+" RF="+rf.length);