const fs=require("fs");
const d=JSON.parse(fs.readFileSync("D:/AI_PROJECTS/Zero1Matrix/scripts/_w05_data_h17.json","utf8"));
// Verify
console.log("H17 total:",d.length);
const allCats=["general","career","love","money","people","family","study","health","decision","business","legal","spiritual"];
for(let l=1;l<=6;l++){
  const cs=d.filter(x=>x[1]===l).map(x=>x[2]).sort();
  const miss=allCats.filter(c=>!cs.includes(c));
  if(miss.length) console.log("L"+l+" MISSING:",miss.join(","));
  else console.log("L"+l+" OK: 12 cats");
}
// Verify min lengths
let issues=0;
for(const e of d){
  if(e[3].length<90){console.log("SHORT meaning:",e[0]+"-"+e[1]+"-"+e[2],e[3].length);issues++}
  if(e[4].length<75){console.log("SHORT advice:",e[0]+"-"+e[1]+"-"+e[2],e[4].length);issues++}
  if(e[5].length<55){console.log("SHORT warning:",e[0]+"-"+e[1]+"-"+e[2],e[5].length);issues++}
  if(e[6].length<4){console.log("SHORT basis:",e[0]+"-"+e[1]+"-"+e[2]);issues++}
}
console.log("Issues:",issues);
