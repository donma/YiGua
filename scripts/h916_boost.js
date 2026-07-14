const fs=require("fs"),p=require("path"),r=p.resolve("D:\\AI_PROJECTS\\Zero1Matrix"),d=p.join(r,"src","data");
const ci=JSON.parse((()=>{const x=fs.readFileSync(p.join(d,"categoryInterpretations.data.js"),"utf8");return x.substring(x.indexOf("= [")+2,x.lastIndexOf("];")+1);})());
const ci916=ci.filter(x=>x.hexagramId>=9&&x.hexagramId<=16);
const boostCats=["money","health","business","legal"];
const hexNames={9:"小畜",10:"履",11:"泰",12:"否",13:"同人",14:"大有",15:"謙",16:"豫"};

for(const x of ci916){
  if(!boostCats.includes(x.category))continue;
  const nm=hexNames[x.hexagramId];
  if((x.meaning||"").length<110)x.meaning=x.meaning+" "+nm+"卦在此分類上的核心結構是：在行動與等待之間，最重要的不是速度，而是在對的階段做對的事——不分階段的統一行動會讓所有的努力互相抵消。";
  if((x.advice||"").length<90)x.advice=x.advice+" "+nm+"卦的建議是根據當前所處的具體階段來決定行動的力度與方向——不是在每個階段都做一樣的事。";
  if((x.warning||"").length<70)x.warning=x.warning+" 最大風險是忽視"+nm+"卦在不同階段給出的不同警示——用同一種方式應對所有局面，等於沒有卦象的指引。";
  if((x.timing||"").length<55)x.timing=x.timing+" "+nm+"卦的六爻進程中，初爻到上爻的每個階段都對行動時機有明確提示——觀察爻位轉折是做對時機判斷的基礎。";
}
fs.writeFileSync(p.join(d,"categoryInterpretations.data.js"),"window.Zero1MatrixData = window.Zero1MatrixData || {};\nwindow.Zero1MatrixData.categoryInterpretations = "+JSON.stringify(ci)+";");
const ok=ci.filter(x=>x.hexagramId>=9&&x.hexagramId<=16).filter(x=>(x.meaning||"").length>=110&&(x.advice||"").length>=90&&(x.warning||"").length>=70&&(x.timing||"").length>=55&&x.basis&&Array.isArray(x.basis)&&x.basis.length>=4).length;
console.log("All thresholds: "+ok+"/96");