'use strict';
const vm = require('vm');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const DATA_PATH = path.join(__dirname, '..', 'src', 'data', 'reflectionQuestions.data.js');
const NODE_EXE = path.join(__dirname, '..', '.nodejs', 'node-v22.14.0-win-x64', 'node.exe');

const CATEGORIES = [
  ['general', '一般'],
  ['career', '工作事業'],
  ['love', '感情關係'],
  ['money', '財務金錢'],
  ['people', '人際合作'],
  ['family', '家庭親人'],
  ['study', '學習考試'],
  ['health', '身心狀態'],
  ['decision', '重大決策'],
  ['business', '創業經營'],
  ['legal', '官非合約'],
  ['spiritual', '心境修行'],
];

// ===== HEX 49 革 questions =====
// Imagery per cat:
// general: 澤中有火, 已日乃革之, 革言三就
// career: 大人虎變, 君子豹變, 已日乃革之
// love: 鞏用黃牛之革, 小人革面, 革言三就
// money: 已日乃革之, 革言三就, 有孚改命
// people: 君子豹變, 大人虎變, 已日乃革之
// family: 鞏用黃牛之革, 革言三就, 大人虎變
// study: 已日乃革之, 有孚改命, 革言三就
// health: 小人革面, 鞏用黃牛之革, 澤中有火
// decision: 革言三就, 已日乃革之, 有孚改命
// business: 澤中有火, 大人虎變, 革言三就
// legal: 已日乃革之, 有孚改命, 革言三就
// spiritual: 澤中有火, 大人虎變, 君子豹變

const HEX49 = {
  hexagramId: 49,
  hexagramName: '革',
  full: '澤火革',
  data: {}
};

HEX49.data.general = {
  imgs: ['澤中有火', '已日乃革之', '革言三就'],
  q1: '澤中有火象徵水火相熄的變革張力在你生活中已經出現，你覺得自己正處於火剛燃起水面還很平靜的潛伏醞釀期，還是火焰已燒穿水面舊秩序正在崩解而你必須立刻做出應變？',
  q2: '面對已日乃革之提示變革要在時機成熟的日子進行，你會選擇按兵不動繼續觀察確認時機訊號已明確到無可質疑才行動，還是與其等到完美的日子寧可承擔時機不完美的風險先試探性地踏出第一步？',
  q3: '革言三就提醒重大改變需經三次討論驗證，哪個具體的訊號會告訴你第三次討論已經從必要的審慎變成了拖延的藉口，再討論下去只會讓變革窗口關閉而錯失轉型的最佳時機？',
};
HEX49.data.career = {
  imgs: ['大人虎變', '君子豹變', '已日乃革之'],
  q1: '大人虎變描述的職場劇烈轉型中，你覺得目前是旁觀虎變正在變革的階段自己還在適應新格局，還是你本人就是那個推動虎變的人而同事與環境還跟不上你的變革腳步？',
  q2: '當職業發展面臨君子豹變的漸進蛻變與大人虎變的劇烈轉型兩種路徑時，你會選擇豹變的路線在現有崗位上穩健地逐步升級自己的能力與角色深耕細作，還是虎變的路線主動爭取一個全新的部門或平台來一次快速的大幅度變化？',
  q3: '在等待已日乃革之的職涯轉折日到來時，哪個具體的市場或組織變化一旦發生，代表你等待的變革窗口已經從還未打開變成已經關閉，繼續在原地等待將不再是策略而是職涯的自我設限？',
};
HEX49.data.love = {
  imgs: ['鞏用黃牛之革', '小人革面', '革言三就'],
  q1: '鞏用黃牛之革象徵用強韌的皮革把關係牢牢綁定，你覺得目前的感情是用堅韌的承諾在支撐真誠且必要，還是這種綁定已經變成僵化的束縛讓雙方都失去了呼吸的空間？',
  q2: '當伴侶表現出小人革面的表面順從而非真心改變時，你會選擇主動創造安全的對話環境邀請對方說出真實感受讓改變從表面走向深層，還是先接受表面的配合繼續觀察等待對方在過程中自然產生內在的真正轉變？',
  q3: '關係需要革言三就的重大調整時，哪個具體的互動模式一旦重複出現，代表這些討論已從真誠的溝通變成兩人在輪流說服對方的循環，繼續討論下去不但不會達成共識反而會讓雙方越想越遠？',
};
HEX49.data.money = {
  imgs: ['已日乃革之', '革言三就', '有孚改命'],
  q1: '已日乃革之暗示你的財務模式需要一次決定性的改變，你覺得目前是在準備改變的階段研究選項但尚未行動，還是已到了再不改變就會出現結構性虧損的緊迫階段？',
  q2: '面對革言三就需要多方反覆評估的重大財務決策時，你會選擇用試算表把所有可能的變革方案數字化比較後再決定走哪一條路，還是相信直覺先鎖定一個感覺最對的方向再逐步用數據驗證與調整細節？',
  q3: '有孚改命強調改變命運要出自真誠的信念而非投機心態，哪個具體的財務行為一旦出現代表你的改革已從真誠的信念轉向孤注一擲的賭博，用改命的說法來包裝對風險的逃避與不願面對的虧損？',
};
HEX49.data.people = {
  imgs: ['君子豹變', '大人虎變', '已日乃革之'],
  q1: '君子豹變描述人際網絡正在經歷一次漸進但有感的蛻變，你覺得目前是主動淘汰一些不再適合的舊關係讓新的圈子開始形成，還是被動地感受到舊關係正在自然疏遠而新關係還沒有出現的空窗期？',
  q2: '當你的人脈圈需要大人虎變式的結構性重組時，你會選擇果斷切斷那些長期消耗你但仍有感情牽絆的舊關係先把空間清出來，還是保留舊關係的同時逐步增加新關係的投入讓過渡更平滑但節奏較慢？',
  q3: '在已日乃革之的人際轉換時機判斷中，哪個具體的人際互動訊號一旦出現代表舊關係的價值已經從實質支撐降為純粹的心理安慰，繼續維持只是在消耗能量而不會再有正回報？',
};
HEX49.data.family = {
  imgs: ['鞏用黃牛之革', '革言三就', '大人虎變'],
  q1: '鞏用黃牛之革象徵家庭以強大的韌性在維繫穩定，你覺得這個家庭的韌性是建立在成員之間真正的理解與包容之上，還是依靠某個成員的長期犧牲與忍耐才勉強維持住表面的和諧？',
  q2: '當家庭需要革言三就的重大調整如角色分工或相處模式時，你會選擇由全家一起坐下來輪流發言把每個人的需求攤開來討論尋求共識，還是先由最有洞察力的成員提出具體方案再由大家逐條討論是否接受？',
  q3: '家庭面臨大人虎變式的結構性轉變如搬遷或成員變動時，哪個具體的家庭互動模式一旦消失代表家庭的核心凝聚力已經鬆動，表面的穩定只是在用慣性支撐隨時可能出現裂痕？',
};
HEX49.data.study = {
  imgs: ['已日乃革之', '有孚改命', '革言三就'],
  q1: '已日乃革之暗示你的學習方法需要一次徹底的革新，你覺得自己是已經看到了新方法但還在猶豫要不要放棄舊習慣，還是連該改成什麼方法都還不清楚只是模糊地感覺到現在的效率有問題？',
  q2: '當學習遇到瓶頸需要進行有孚改命式的根本轉變時，你會選擇回頭檢視自己的學習信念重新定義什麼是學會的標準再調整方法，還是直接模仿高效學習者的整套系統相信實踐中自然會找到適合自己的版本？',
  q3: '在革言三就的反覆修正學習策略過程中，哪個具體的學習成果指標一旦連續幾次沒有改善，代表你不斷微調的策略本身就有根本性的方向錯誤繼續小修小補只是在繞圈子不會有突破？',
};
HEX49.data.health = {
  imgs: ['小人革面', '鞏用黃牛之革', '澤中有火'],
  q1: '小人革面提醒你可能只在表面改變健康習慣卻沒有深入內在根源，你覺得目前是已經意識到問題但改變還停留在表面如換了飲食卻沒改作息，還是連表面的健康調整都還沒有開始只是在心裡計劃？',
  q2: '當身體處於鞏用黃牛之革用強韌的意志力硬撐時，你會選擇承認身體的極限先暫停高強度的生活方式給自己一段真正放鬆的修復期，還是繼續用紀律與意志力對抗疲勞相信只要撐過這陣子身體自然會適應？',
  q3: '澤中有火的水火失衡狀態持續時，哪個具體的身體指標一旦出現異常代表身體的自我調節機制已經失效，你再不從根源調整作息與壓力管理就不是養生而是用養生的名義在累積未來的醫療帳單？',
};
HEX49.data.decision = {
  imgs: ['革言三就', '已日乃革之', '有孚改命'],
  q1: '革言三就表達在重大決策中你需要反覆推敲的審慎態度，你覺得自己目前是在收集不同意見的階段還有足夠的時間仔細權衡，還是已進入必須快速收斂做出決定的時間壓力下猶豫的成本正在急劇上升？',
  q2: '當決定已日乃革之的時機已經到來但你仍感到不安時，你會選擇相信自己已經做了足夠的準備按計劃行動不讓情緒干擾判斷，還是給自己一次最後的冷靜期用不超過一天的時間重新審視是否有遺漏的關鍵資訊？',
  q3: '有孚改命強調改變命運的決心必須真誠而非一時衝動，哪個具體的內在訊號一旦出現代表你的決定不再是出於信念而是出於恐懼，你正在用行動的假象來逃避對另一條未選之路的遺憾？',
};
HEX49.data.business = {
  imgs: ['澤中有火', '大人虎變', '革言三就'],
  q1: '澤中有火象徵企業內部的變革張力正在積聚，你覺得目前的經營狀態是水火矛盾剛剛浮現還有緩衝餘地可以規劃轉型路徑，還是水與火已直接碰撞利潤結構正在被動搖再不轉型就會有生存危機？',
  q2: '當企業面臨大人虎變式的全面轉型時，你會選擇從核心業務開始徹底改造即使這意味著短期內業績會大幅震盪，還是先在非核心部門試點新方向等驗證成功後再逐步向核心推進以控制風險？',
  q3: '在革言三就的企業變革討論中，哪個具體的營運指標一旦跌破某個閾值代表討論階段必須結束行動階段必須立即開始，繼續內部討論的成本已遠超過執行錯誤方案的修正成本？',
};
HEX49.data.legal = {
  imgs: ['已日乃革之', '有孚改命', '革言三就'],
  q1: '已日乃革之提示法律事務需要在對的時機做出改變，你覺得目前是合約或法律策略已經到了應該修改的節點但還可以從容處理，還是時機已經緊迫到不及時變更就會產生不可逆的法律後果？',
  q2: '當法律策略需要有孚改命式的根本轉變時，你會選擇將案件委託給具有豐富類似經驗的專業人士全權處理相信專業判斷，還是自己先徹底研究相關法條與判例建立足夠的認知基礎再與專業人士共同制定策略？',
  q3: '在革言三就的法律反覆協商過程中，哪個具體的談判節點一旦被對方佔據有利位置代表協商的天平已從雙贏談判轉為零和博弈，繼續用合作心態談下去只會讓自己的底線被不斷試探與侵蝕？',
};
HEX49.data.spiritual = {
  imgs: ['澤中有火', '大人虎變', '君子豹變'],
  q1: '澤中有火在你的內心世界裡水火共存的矛盾中，你覺得自己是火正在推動水產生積極的蒸騰與變化正向的創造力正在被激發，還是水在不斷熄滅火熱情與靈感正在被日常的冷漠與慣性逐一澆熄？',
  q2: '當內在需要大人虎變的徹底覺醒或君子豹變的漸進修行兩種路徑時，你會選擇虎變的路徑投入一次密集的閉關或深度修行期待一次性的突破與轉化，還是豹變的路徑每天持續一小步的練習用時間的累積讓內在自然蛻變？',
  q3: '在君子豹變的漸進內在轉化中，哪個具體的心念模式一旦反覆出現代表漸進已從耐心的修行變成了自我安慰的停滯，你正在用慢慢來的說詞合理化的不是過程而是對真正改變的抗拒？',
};

// ===== HEX 50 鼎 questions =====
// Imagery per cat:
// general: 木上有火, 鼎顛趾, 鼎有實
// career: 鼎折足, 鼎黃耳金鉉, 鼎有實
// love: 鼎耳革, 鼎玉鉉, 鼎有實
// money: 鼎折足, 鼎顛趾, 鼎黃耳金鉉
// people: 鼎有實, 鼎玉鉉, 鼎耳革
// family: 鼎顛趾, 鼎耳革, 鼎有實
// study: 木上有火, 鼎有實, 鼎顛趾
// health: 鼎折足, 鼎耳革, 木上有火
// decision: 鼎折足, 鼎黃耳金鉉, 鼎有實
// business: 木上有火, 鼎顛趾, 鼎有實
// legal: 鼎折足, 鼎耳革, 鼎有實
// spiritual: 木上有火, 鼎玉鉉, 鼎有實

const HEX50 = {
  hexagramId: 50,
  hexagramName: '鼎',
  full: '火風鼎',
  data: {}
};

HEX50.data.general = {
  imgs: ['木上有火', '鼎顛趾', '鼎有實'],
  q1: '木上有火象徵鼎下有柴薪燃燒正在烹煮養分，你覺得自己目前的生活是薪火穩定食材正在鍋中慢慢熟成只需耐心等待，還是柴火快要熄滅鍋中的東西還只是半生不熟再不添柴就會前功盡棄？',
  q2: '當生活基礎需要鼎顛趾般的顛覆重整倒空舊有才能裝入新內容時，你會選擇一次性把不適合的部分全部倒掉從空白開始重新建立秩序，還是只倒出一部分保留尚有用的舊框架在新舊交替中逐步調整？',
  q3: '鼎有實提示你內在已積累了豐富的資源與養分，哪個具體的生活訊號一旦出現代表你的積累已從必要的準備變成囤積，繼續只儲存不輸出會讓鼎中的食物腐敗失去原有的營養價值？',
};
HEX50.data.career = {
  imgs: ['鼎折足', '鼎黃耳金鉉', '鼎有實'],
  q1: '鼎折足暗示職涯支撐結構可能出現脆弱的環節，你覺得目前的折足是集中在某個具體的技能短板或關係斷裂可以針對性修復，還是多個支撐點同時出現問題讓整個職涯平台有傾覆的風險？',
  q2: '當職業發展積累了鼎有實的豐富實力需要鼎黃耳金鉉般找到合適的管道呈現時，你會選擇專注打造一個代表性的作品或專案讓實力透過成果自然發聲，還是積極拓展業界人脈與曝光機會讓更多人知道你的能力？',
  q3: '鼎黃耳金鉉的精美提把象徵職位晉升的誘人門路，哪個具體的徵兆出現代表這個看似華麗的晉升機會其實是一根無法承重的空心鉉，接下這個機會你的鼎不但抬不起來還會因為重心不穩而整個傾倒？',
};
HEX50.data.love = {
  imgs: ['鼎耳革', '鼎玉鉉', '鼎有實'],
  q1: '鼎耳革暗示關係的連接方式正在改變舊的互動模式已經不再管用，你覺得目前是雙方都有意識地在摸索新的相處方式雖然生疏但方向是對的，還是只有單方面在努力調整另一方似乎對改變並不感興趣？',
  q2: '當感情擁有鼎有實的深厚基礎但需要鼎玉鉉般更精緻的方式來提升關係品質時，你會選擇從日常細節開始用心如每天一個真誠的讚美或傾聽讓關係在日常中累積溫度，還是規劃一次特別的約會或旅行用一個亮點事件為關係注入新的能量？',
  q3: '鼎玉鉉的華美配件提醒關係的外在形式固然重要但不能取代實質，哪個具體的互動訊號一旦出現代表你們已經花太多時間在包裝關係的表面美感而鍋中的養分正在悄悄流失，關係的外殼比內涵更被重視時離失衡就不遠了？',
};
HEX50.data.money = {
  imgs: ['鼎折足', '鼎顛趾', '鼎黃耳金鉉'],
  q1: '鼎折足暗示你的財務支撐結構中有某根支柱已經出現裂痕，你覺得這根折足是收入來源不穩需要開拓新的收入管道，還是支出結構失衡某類支出已經超過合理比例正在侵蝕你的財務安全？',
  q2: '當財務需要鼎顛趾般的徹底重整倒掉舊有的理財習慣時，你會選擇給自己一段嚴格的財務節食期暫停所有非必要支出讓財務系統回到最乾淨的狀態，還是邊消費邊調整逐月削減預算在不犧牲生活品質的前提下溫和改變？',
  q3: '鼎黃耳金鉉的華麗外觀暗示某個看似穩賺的投資機會外表精美，哪個具體的數據或市場訊號一旦浮現代表這個機會只是空有華麗包裝的陷阱，你投入的資金不但不會如預期般翻倍成長反而可能連本金都被卡住無法取回？',
};
HEX50.data.people = {
  imgs: ['鼎有實', '鼎玉鉉', '鼎耳革'],
  q1: '鼎有實形容你的人際關係中有真正的養分與價值在流動，你覺得目前是你能從人際中吸收到豐富的養分也有能力回饋給他人處於健康的雙向互惠中，還是你長期在輸出養分卻沒有得到對等的回饋鼎已經快要被掏空？',
  q2: '當人際圈需要鼎耳革式的調整互動模式時，你會選擇主動改變自己與人交往的方式先從自己的態度與邊界開始調整，還是先觀察誰值得繼續深交誰應該淡出讓自然的篩選機制幫你決定哪些關係需要改變？',
  q3: '鼎玉鉉代表關係中精緻的連結品質如深度對話與心靈共鳴，哪個具體的社交行為一旦增多代表你正在用精緻社交的名義逃避對孤獨的恐懼，你所追求的深度連結數量已經超出了你能真誠維護的上限？',
};
HEX50.data.family = {
  imgs: ['鼎顛趾', '鼎耳革', '鼎有實'],
  q1: '鼎顛趾描述家庭可能需要一次徹底的秩序重整倒掉舊習慣才能容納新氣象，你覺得目前是家庭成員都已感受到重整的必要只是還沒有誰先開始行動，還是某個成員已經先開始改變但其他人還在用舊模式回應？',
  q2: '當家庭溝通模式需要鼎耳革式的改變從舊有的互動框架中跳出來時，你會選擇由自己先示範新的溝通方式如多用聆聽少用指導來帶動全家的互動模式改變，還是召集一次家庭會議先讓大家對現有問題達成共識再一起討論新的規則？',
  q3: '鼎有實象徵家庭中確實存在愛與養分但可能沒有被有效地傳遞到每個成員，哪個具體的家庭互動模式一旦持續缺失代表核心養分雖然存在卻在傳遞過程中被阻斷，家庭正在用形式上的完整掩蓋情感上的隔離？',
};
HEX50.data.study = {
  imgs: ['木上有火', '鼎有實', '鼎顛趾'],
  q1: '木上有火象徵學習中的持續加熱與轉化過程，你覺得自己的學習狀態是薪火穩定正在把知識從生澀煮到通透處於扎實的累積期，還是火時大時小導致有些知識已經煮焦了而有些還是未熟的夾生狀態？',
  q2: '當鼎有實的知識存量已足夠但需要鼎顛趾式的學習方法顛覆時，你會選擇把自己當成初學者暫時放下所有已知重新用新的框架學習核心概念，還是在現有知識基礎上局部修正學習策略保留大部分已建立的認知結構？',
  q3: '木上有火的持續加熱提醒學習需要耐力，哪個具體的學習行為一旦出現代表火已從穩定的文火變成了焦躁的猛火，你正在用更多的學習時間來逃避對學習深度的要求速度正在取代理解的品質？',
};
HEX50.data.health = {
  imgs: ['鼎折足', '鼎耳革', '木上有火'],
  q1: '鼎折足暗示身體的支撐系統如脊椎膝蓋或核心肌群可能出現弱點，你覺得目前只是偶爾的輕微不適還在身體可以自我修復的範圍內，還是弱點已經明顯到影響日常活動是時候進行系統性的身體調整與復健？',
  q2: '當健康習慣需要鼎耳革式的改變從舊有的養生模式轉換到新的方法時，你會選擇徹底研究新方法的科學依據確認適合自己後再全套轉換不讓新舊方法互相干擾，還是先挑一兩個最容易執行的新習慣開始慢慢取代舊習慣降低轉換的阻力？',
  q3: '木上有火的持續燃燒象徵長期的壓力與代謝運轉，哪個具體的生理或情緒訊號一旦出現代表你的薪火已經燒得太旺即將耗盡自己的燃料，身體在用各種小症狀發出警告而你卻把這些信號當成常態在忽略？',
};
HEX50.data.decision = {
  imgs: ['鼎折足', '鼎黃耳金鉉', '鼎有實'],
  q1: '鼎折足提醒決策的支撐結構是否完整可靠，你覺得目前做決定的資訊基礎是穩固的主要變數已大致掌握可以做出判斷，還是關鍵的資訊支柱存在裂痕你正在用推測填補缺口而不是確證？',
  q2: '當決策面臨鼎黃耳金鉉般看似精緻完美的選項與鼎有實般樸實但扎實的選項時，你會選擇被華麗包裝吸引的那個高回報但也高風險的方向，還是選擇路徑清晰回報穩健但可能沒有驚喜的務實方案？',
  q3: '鼎折足暗示即使鼎有實內在有足夠的養分只要支撐不穩就會傾覆，哪個具體的決策前提一旦被事實推翻代表你的整套判斷邏輯需要從頭來過，繼續堅持原方案不是審慎而是用頑固在對抗已經改變的現實？',
};
HEX50.data.business = {
  imgs: ['木上有火', '鼎顛趾', '鼎有實'],
  q1: '木上有火象徵企業的營運能量正在將資源轉化為價值，你覺得目前的轉化效率是理想狀態投入與產出之間有健康的正向循環，還是柴火燒得很旺但鼎中的食物卻沒有在熟成轉化過程中有嚴重的能量浪費？',
  q2: '當企業需要鼎顛趾式的業務重整倒掉不賺錢的舊產品線時，你會選擇一次性地把虧損業務全數關閉集中資源在最有潛力的方向，還是先保留部分虧損業務觀察其是否有轉虧為盈的可能避免砍錯未來的好苗？',
  q3: '鼎有實表示企業核心資源充足但木上有火提醒若不持續添柴火就會熄滅，哪個具體的市場訊號一旦出現代表現有商業模式的生命週期已進入尾聲，繼續優化現有模式不如開始投資下一個全新的成長曲線？',
};
HEX50.data.legal = {
  imgs: ['鼎折足', '鼎耳革', '鼎有實'],
  q1: '鼎折足暗示法律案件中的某個支撐點存在脆弱環節，你覺得這個弱點是可以透過補充證據或修正策略來強化的暫時性不足，還是法律立場本身就有結構性的缺陷無法透過技術手段來補救？',
  q2: '當法律策略需要鼎耳革式的轉變從原來的主張路徑切換到新的方向時，你會選擇保留原有的部分有利主張在新舊策略之間建立過渡橋樑，還是果斷放棄已顯不利的舊主張全新起草一套法律論述不再回頭？',
  q3: '鼎有實代表手中確實握有有力的法律依據與證據，哪個具體的程序節點一旦進入代表證據的優勢期已過對方的拖延策略正在生效，你再不加速推進就算鼎中有實也會因為時效與程序而失去訴訟的戰略價值？',
};
HEX50.data.spiritual = {
  imgs: ['木上有火', '鼎玉鉉', '鼎有實'],
  q1: '木上有火象徵內在的靈性薪火正在持續燃燒轉化你的生命經驗為智慧，你覺得這把火是穩定溫暖的文火讓你每天都能感受到內在的滋養，還是時明時暗有時靈感充沛有時陷入懷疑不太確定自己的修行方向？',
  q2: '當鼎有實的內在智慧已累積到一定程度需要鼎玉鉉般精緻優雅的方式對外表達時，你會選擇用創作如寫作或藝術的形式把體悟轉化為可分享的作品，還是選擇低調地在日常互動中用行動與態度默默地影響身邊的人？',
  q3: '鼎玉鉉提醒靈性修行中的形式美感確實動人但終究只是工具而非目的，哪個具體的內在訊號一旦出現代表你已經把修行的方法當成修行本身，每天在數呼吸次數卻忘了為什麼要數呼吸正在用精緻的儀式感逃避真正的內心功課？',
};

// ===== HEX 51 震 questions =====
// Imagery per cat:
// general: 洊雷震, 震來虩虩後笑言啞啞, 震不于其躬于其鄰
// career: 震來厲, 億喪貝, 震蘇蘇
// love: 震來虩虩後笑言啞啞, 震遂泥, 震不于其躬于其鄰
// money: 億喪貝, 震來厲, 震往來厲
// people: 震不于其躬于其鄰, 震來虩虩後笑言啞啞, 震蘇蘇
// family: 震遂泥, 億喪貝, 震來虩虩後笑言啞啞
// study: 洊雷震, 震來厲, 震蘇蘇
// health: 震不于其躬于其鄰, 震遂泥, 洊雷震
// decision: 震往來厲, 億喪貝, 震來虩虩後笑言啞啞
// business: 洊雷震, 億喪貝, 震來厲
// legal: 震遂泥, 震來厲, 億喪貝
// spiritual: 洊雷震, 震來虩虩後笑言啞啞, 震不于其躬于其鄰

const HEX51 = {
  hexagramId: 51,
  hexagramName: '震',
  full: '震為雷',
  data: {}
};

HEX51.data.general = {
  imgs: ['洊雷震', '震來虩虩後笑言啞啞', '震不于其躬于其鄰'],
  q1: '洊雷震象徵接連而來的震盪事件正在衝擊你的生活，你覺得自己目前是剛聽到第一聲雷還在震驚與觀察階段還沒有進入實質應對，還是雷聲接連不斷你已經在行動中適應震盪甚至開始習慣這種不確定性？',
  q2: '面對震來虩虩後笑言啞啞從驚恐到恢復平靜的過程，你會選擇先給自己時間消化衝擊的情緒等內心真正平穩後再做出反應，還是即使內心還很震驚也強迫自己立刻恢復笑談如常讓外在的穩定帶動內在的平靜？',
  q3: '震不于其躬于其鄰提醒震盪未必直接發生在你身上而是波及身邊的人，哪個具體的訊號會告訴你這場鄰居的火已經開始燒到你的屋簷，你不能再以旁觀者的心態觀望必須立即採取防護行動？',
};
HEX51.data.career = {
  imgs: ['震來厲', '億喪貝', '震蘇蘇'],
  q1: '震來厲表示職場震盪已經來到你面前且帶來實際的威脅感，你覺得這波震盪是整個產業的結構性調整你只是被波及的其中一個節點，還是這股威脅是有針對性地朝你的職位或團隊而來需要做出個人化的應對？',
  q2: '面對職場中億喪貝的巨大損失如錯過重大專案或被裁撤預算時，你會選擇先盤點剩下的資源與優勢找到損失之後最值得投入的新方向重新出發，還是給自己一段沉澱期先消化失落感再決定下一步不急於填補空白？',
  q3: '震蘇蘇的復甦跡象開始出現時，哪個具體的組織變化或市場訊號會提醒你復甦只是暫時的喘息而非真正的轉折，在看似平靜的表面下更大的震盪其實正在醞釀你必須在下次震盪來之前做好更充分的準備？',
};
HEX51.data.love = {
  imgs: ['震來虩虩後笑言啞啞', '震遂泥', '震不于其躬于其鄰'],
  q1: '震來虩虩後笑言啞啞描述感情經歷衝擊後的震後重建期，你覺得目前是剛經歷驚嚇還在小心翼翼不敢太快恢復正常互動，還是已經度過最驚恐的時期雙方正在嘗試重新找回彼此的節奏與信任？',
  q2: '當關係陷入震遂泥的滯留狀態震盪後的創傷讓雙方都卡在泥沼中無法前進時，你會選擇主動伸出手先帶領對方走出泥沼即使自己還在掙扎，還是先專注於讓自己脫離泥沼站穩後再回頭幫助對方一起走出來？',
  q3: '震不于其躬于其鄰提醒感情風暴也許來自外部如家人反對或第三者的干擾，哪個具體的外部影響一旦到達某個強度會讓你們從共同面對外部挑戰變成內部互相指責，關係的裂縫不是來自震源而是來自你們對震盪的反應方式？',
};
HEX51.data.money = {
  imgs: ['億喪貝', '震來厲', '震往來厲'],
  q1: '億喪貝象徵你可能正面臨或將要面對一筆相當可觀的財務損失，你覺得這筆損失是已經發生且數額明確你正在處理後續的止血與填補，還是你已預感到損失即將到來但還不清楚規模有多大有時間做預防性的保護？',
  q2: '當財務狀況處於震往來厲一波又一波的財務震盪接連而至時，你會選擇建立一個緊急防禦機制如凍結大部分非必要支出讓現金流只出不進只留必要開銷，還是尋找額外的收入來源用開源的方式來吸收震盪的衝擊不作過度的節流？',
  q3: '震來厲的財務威脅再次逼近時，哪個具體的財務安全線一旦被擊穿代表你不能再依靠正常的財務管理方法來應對，必須進入緊縮模式做出那個你一直迴避的痛苦決定如出售資產或進行債務重組？',
};
HEX51.data.people = {
  imgs: ['震不于其躬于其鄰', '震來虩虩後笑言啞啞', '震蘇蘇'],
  q1: '震不于其躬于其鄰暗示你身邊的人正在經歷震盪而你還未直接受影響，你覺得自己目前是保持警覺但不主動介入等待對方發出求助訊號，還是已經感覺到震波正在向你接近開始在心裡預演各種可能的應對方案？',
  q2: '當人際圈經歷震來虩虩後笑言啞啞的集體震盪後開始恢復平靜時，你會選擇主動聯繫那些在震盪中受影響較大的人提供實際的幫助而非只是口頭慰問，還是尊重每個人的復原節奏給他們足夠的空間只在被需要時出現？',
  q3: '震蘇蘇的人際關係逐漸復甦時，哪個具體的互動模式一旦重新出現代表某些關係的復甦只是回歸舊有但不健康的互動模式而非真正的修復，你正在把熟悉的痛苦誤認為是安全感而重複投入有害的關係循環？',
};
HEX51.data.family = {
  imgs: ['震遂泥', '億喪貝', '震來虩虩後笑言啞啞'],
  q1: '震遂泥描述家庭在經歷震盪後陷入了滯留的狀態像卡在泥沼中動彈不得，你覺得目前是全家都有意識到卡住了但還沒有找到共同的脫困方向，還是只有少數成員在努力掙扎其他人已經習慣了泥沼的溫度選擇停留在原地？',
  q2: '當家庭經歷億喪貝的重大失落如失去摯愛或經濟支柱時，你會選擇鼓勵家人把悲傷與失落說出來用共同的哀悼來慢慢消化這個巨大的空缺，還是專注於維持家庭的日常運作讓規律的生活節奏成為每個人的穩定支點慢慢癒合？',
  q3: '在震來虩虩後笑言啞啞的震後恢復期，哪個具體的家庭行為一旦被迴避不提代表震盪的創傷從來沒有被真正處理，全家正在用表面的笑聲覆蓋沒有癒合的傷口這些未處理的情緒會在下次震盪時以更強烈的方式爆發？',
};
HEX51.data.study = {
  imgs: ['洊雷震', '震來厲', '震蘇蘇'],
  q1: '洊雷震象徵學習過程中接連的挑戰與考驗正在密集地出現，你覺得這些考試與作業像是雷聲般密集轟炸你已有疲態但仍能應對，還是雷聲已經密集到讓你無法正常消化知識只是在應付當下的考試而沒有真正的學習？',
  q2: '當學習面對震來厲的特定困難關卡時，你會選擇暫時繞過這個關卡先學習其他相關領域等積累了更多背景知識再回頭挑戰，還是下定決心啃下這塊硬骨頭即使花費數倍時間也要先打通這個關卡再繼續前進？',
  q3: '震蘇蘇代表學習低谷後的復甦期開始出現進步的跡象，哪個具體的學習行為一旦出現代表復甦只是考試前的短期衝刺而非真正的學習品質提升，考試一結束這些臨時記住的內容就會像退潮一樣全部消失？',
};
HEX51.data.health = {
  imgs: ['震不于其躬于其鄰', '震遂泥', '洊雷震'],
  q1: '震不于其躬于其鄰提醒健康問題可能不是直接來自你自己的身體而是來自環境或身邊人的影響，你覺得自己目前是有意識地在防範環境中的健康風險如二手壓力或傳染源，還是已經隱約感受到外部的健康震波正在滲透進你的身心狀態？',
  q2: '當身體陷入震遂泥的長期亞健康狀態感覺卡在不好不壞之間時，你會選擇尋求專業的醫療評估找出確切的問題根源進行有針對性的治療，還是從最基礎的睡眠與飲食開始做系統性的生活調整相信身體有自癒的能力？',
  q3: '洊雷震的連續健康警訊接連出現時，哪個具體的生理指標一旦被檢驗出異常代表這些小警訊不再是孤立的偶發事件而是系統性問題的多處表現，你必須停止頭痛醫頭腳痛醫腳的碎片化處理進行全面的健康評估？',
};
HEX51.data.decision = {
  imgs: ['震往來厲', '億喪貝', '震來虩虩後笑言啞啞'],
  q1: '震往來厲形容決策環境中反覆出現的震盪讓判斷變得極不穩定，你覺得目前的震盪頻率還在你可承受的範圍內你有能力在不確定中做出理性判斷，還是震盪的頻率與強度已經超出了理性決策的閾值你開始被情緒牽著走？',
  q2: '當決策必然伴隨億喪貝的巨大成本無論選哪條路都要付出沉重代價時，你會選擇把決策標準從追求最好結果調整為避免最壞結果優先考慮哪個選項的損失最可控，還是堅持尋找第三條路試圖在兩害之間找到一個可以接受的中間方案？',
  q3: '震來虩虩後笑言啞啞描述決策後的震盪從驚恐到平靜的過程，哪個具體的決策回饋訊號一旦出現代表你的平靜只是否認與逃避而非真正的接受，你正在用輕描淡寫的笑聲來壓抑對這個決定可能出錯的深層焦慮？',
};
HEX51.data.business = {
  imgs: ['洊雷震', '億喪貝', '震來厲'],
  q1: '洊雷震象徵市場連續的震盪波正在密集衝擊你的企業，你覺得目前的衝擊是產業週期性的正常波動你的企業還有足夠的緩衝與韌性可以吸收，還是震盪已暴露出商業模式的根本缺陷繼續用現有模式運行只是在等待下一次更強的震波？',
  q2: '當企業面臨億喪貝的巨大虧損時，你會選擇立即啟動止血計畫砍掉所有不賺錢的業務線即使這意味著大幅縮編也要保住核心生存能力，還是尋求外部資金或合作夥伴補充糧草給現有模式更多時間證明其價值不被短期波動嚇到放棄？',
  q3: '震來厲的經營威脅再次升級時，哪個具體的營運指標一旦滑破某個水位線代表繼續用正常營運策略已不足以因應，必須啟動緊急應變機制做出那個你一直不願面對的決定如大幅裁員或放棄某個經營多年的市場？',
};
HEX51.data.legal = {
  imgs: ['震遂泥', '震來厲', '億喪貝'],
  q1: '震遂泥暗示法律案件可能陷入程序性泥沼進展緩慢看不到突破點，你覺得這只是法律程序正常的時間節奏案情仍在推進只是速度不如預期，還是案件已實質性地卡在無法突破的程序障礙中繼續等待只是消耗時間與金錢？',
  q2: '當法律風險進入震來厲的直接威脅階段如收到不利的裁定或對方採取更激進的行動時，你會選擇立即組織律師團隊重新評估全案策略準備最壞情況的應對方案，還是先觀察對方下一步再決定是否升級回應的強度避免過早亮出底牌？',
  q3: '億喪貝的潛在法律賠償金額如此巨大，哪個具體的和解或判決節點一旦出現代表繼續訴訟的預期成本已超過最差判決的可能損失，理性上應該接受和解即使內心覺得不公但繼續打下去的經濟風險已超出可承受範圍？',
};
HEX51.data.spiritual = {
  imgs: ['洊雷震', '震來虩虩後笑言啞啞', '震不于其躬于其鄰'],
  q1: '洊雷震象徵內在不斷出現的覺醒震盪接連打破舊有的認知框架，你覺得這些覺醒是帶著建設性能量的雷擊雖然疼痛卻在為你清除陳舊的觀念殘骸，還是雷聲太密集已讓你感到認知負荷超載來不及整合新的覺察？',
  q2: '面對震來虩虩後笑言啞啞的內在覺醒循環從被真相震懾到平靜接受，你會選擇深入探索那個讓你驚恐的覺察即使過程痛苦但相信穿越後會有真正的解脫，還是給自己時間讓覺察慢慢沉澱不急於分析讓領悟在潛意識中自然發酵？',
  q3: '震不于其躬于其鄰提醒你從別人的生命震盪中學習而不必親自經歷同樣的創傷，哪個具體的觀察心態一旦出現代表你已從同理學習變成冷漠旁觀，你正在用別人的苦難來慶幸自己沒有遭遇同樣的事而不是從中汲取真正的智慧？',
};

// ===== HEX 52 艮 questions =====
// Imagery per cat:
// general: 兼山艮, 敦艮, 艮其身
// career: 艮其趾, 艮其限, 艮其身
// love: 艮其腓, 艮其輔, 敦艮
// money: 艮其趾, 艮其限, 敦艮
// people: 艮其輔, 艮其身, 艮其限
// family: 艮其趾, 艮其腓, 敦艮
// study: 艮其限, 艮其身, 兼山艮
// health: 艮其輔, 艮其身, 艮其趾
// decision: 艮其限, 敦艮, 艮其趾
// business: 兼山艮, 艮其身, 艮其限
// legal: 艮其趾, 艮其輔, 艮其限
// spiritual: 兼山艮, 敦艮, 艮其身

const HEX52 = {
  hexagramId: 52,
  hexagramName: '艮',
  full: '艮為山',
  data: {}
};

HEX52.data.general = {
  imgs: ['兼山艮', '敦艮', '艮其身'],
  q1: '兼山艮象徵兩座山層疊阻擋暗示你生活中正需要停下腳步不該再往前推進，你覺得目前是自願且清醒地選擇靜止知道停下來的價值與原因，還是被迫停了下來內心充滿不安與焦躁急著想要找到重新啟動的方法？',
  q2: '當面對生活中的重大抉擇需要敦艮般用最誠實穩重的心來面對停止時，你會選擇給自己一段完整獨處徹底從外界噪音中抽離只聽自己內在的聲音，還是尋求一位你信任且閱歷豐富的導師用他人的智慧協助你做出更明智的停與行的判斷？',
  q3: '艮其身提醒止於該止之處而非無限地停止下去，哪個具體的生活訊號一旦浮現代表有益的靜止已經變成有害的停滯，你正在用停下來反思作為掩護實則是在逃避重新出發時必然伴隨的不確定與風險？',
};
HEX52.data.career = {
  imgs: ['艮其趾', '艮其限', '艮其身'],
  q1: '艮其趾象徵職涯的起步或某個新行動在踏出第一步之前就該停下審視，你覺得自己目前是已經抬起了腳但還在猶豫該不該踏出這一步處於評估中的懸空狀態，還是已經踏出了好幾步才意識到第一步可能就走錯了方向正在思考該如何修正？',
  q2: '當職涯發展需要艮其限般的節制不過度擴張時，你會選擇在現有職位上做到極致深耕讓自己成為不可替代的專家再考慮下一步，還是積極拓展跨領域的視野與能力用多元的視角來增強自己對未來變化的適應力？',
  q3: '艮其身提醒職涯中的止不是全盤停止而是只停止該停止的部分其他部分仍要繼續運轉，哪個具體的職涯行為一旦被你停下來會引發連鎖崩壞代表你停錯了地方，這個關鍵行為不能停止而應該調整而不是放棄？',
};
HEX52.data.love = {
  imgs: ['艮其腓', '艮其輔', '敦艮'],
  q1: '艮其腓象徵關係中小腿般的支撐結構需要暫停進一步的發展先穩固現有基礎，你覺得目前感情是發展太快需要停下來讓彼此有時間確認這是不是真的想要的方向，還是已經穩定太久需要檢視停下來的習慣是否已變成了關係中的停滯不前？',
  q2: '當關係溝通如艮其輔需要控制言辭不要太快說出傷人的話時，你會選擇在說出攻擊性話語前給自己十秒的暫停用深呼吸緩衝後再選擇溫和表達，還是等情緒平復後用書寫把想說的話寫下讓文字比言語更有被慎重對待的空間？',
  q3: '敦艮的誠懇靜止提醒感情中最難的不是不停前進而是知道何時該停下來守護已有的溫度，哪個具體的關係互動模式一旦變成慣性代表已把應該暫時的靜止變成關係的常態，你們在名為穩定但實為退溫的靜止中讓感情的動能逐漸消失？',
};
HEX52.data.money = {
  imgs: ['艮其趾', '艮其限', '敦艮'],
  q1: '艮其趾暗示在踏出財務行動的第一步之前該先停下來檢視，你覺得自己目前是面對一個誘人的投資或消費機會正在猶豫是否該先踩煞車，還是已經踏出了好幾步才發現財務計畫缺乏明確的邊界正在尋找應該在哪裡設立停損點？',
  q2: '當財務管理需要艮其限般的明確節制與邊界時，你會選擇為每一類支出設立嚴格的月度上限達到上限就堅決不再花費即使錯過一些機會，還是只針對最關鍵的核心支出設立硬性限制其他保持彈性讓自己在享受與節制之間找到平衡？',
  q3: '敦艮用最誠懇的態度面對財務的停止決定，哪個具體的財務行為一旦無法停止代表你已從理性的風險管理滑向了成癮性的財務行為，明知該停止卻停不下來的不再是策略上的猶豫而是心理層面的失控？',
};
HEX52.data.people = {
  imgs: ['艮其輔', '艮其身', '艮其限'],
  q1: '艮其輔提醒在人際互動中要管住口舌不要太快表達也不要太早給出承諾，你覺得目前是在某段關係中需要刻意放慢節奏讓言語更有分寸而非急著拉近距離，還是已經因為過去話說得太快而正在承受承諾過重的人際負擔？',
  q2: '當人際關係需要艮其限般的設立清晰界線時，你會選擇直接且溫和地與對方溝通你的界線讓對方明確知道你的底線在哪裡，還是用行動自然地疏遠那些越界的人不透過言語設立界線而是讓距離自然產生保護效果？',
  q3: '艮其身提醒在人際中的停止不是孤立自己而是只停止不健康的互動保持健康的連結，哪個具體的社交行為一旦被你過度停止會讓你從保護自己滑向自我孤立，原本健康的獨處正在演變為逃避所有社交的全面退縮？',
};
HEX52.data.family = {
  imgs: ['艮其趾', '艮其腓', '敦艮'],
  q1: '艮其趾象徵家庭在開始某個重大改變之前如搬家或重要決定該先暫停腳步審視，你覺得目前家庭處於正要起步但需要冷靜確認方向的階段，還是已經在改變的過程中才發現有些基本問題沒有想清楚需要中途停下重新評估？',
  q2: '當家庭支撐如艮其腓需要加強基礎站穩時，你會選擇把家庭時間提高到和工作一樣用固定的家庭日或儀式鞏固成員情感連結，還是從日常中更細心地關注每個成員的情緒變化用小而頻繁的關懷來累積家庭的韌性？',
  q3: '敦艮以誠懇篤實的態度守護家的穩定，哪個具體的家庭習慣一旦被你停止運轉會讓整個家的節奏失衡，這個習慣看似微小卻像齒輪中的核心零件一旦停止整個家庭運轉的流暢度就會明顯下降？',
};
HEX52.data.study = {
  imgs: ['艮其限', '艮其身', '兼山艮'],
  q1: '艮其限提醒學習需要明確的節制與邊界不能什麼都想學卻什麼都不精，你覺得目前自己是有方向性地在深入某個領域只是在邊界上偶爾分心，還是學習方向已經分散到連你自己都說不清楚目前的主軸是什麼正在到處淺嚐？',
  q2: '當學習遇到兼山艮的瓶頸如兩座山擋在前面時，你會選擇暫停對這個領域的鑽研切換到完全不同學科讓大腦用不同模式運作後再突破，還是堅持留在原地加深基礎從最根本原理重新理解試圖從底層找到翻越山脈的路徑？',
  q3: '艮其身提醒停止該停止的學習方向而非停止學習本身，哪個具體的學習領域一旦你發現自己已連續投入超過一個月卻沒有任何實質進步或產出，代表這個方向的邊際效益已經趨近於零繼續堅持只是在消耗學習熱情而非提升能力？',
};
HEX52.data.health = {
  imgs: ['艮其輔', '艮其身', '艮其趾'],
  q1: '艮其輔暗示健康管理中需要管住口不管是飲食言語還是呼吸模式都該有所覺察與節制，你覺得自己目前在飲食或作息上的節制是有意識且執行得還算穩定，還是節制已經變成剝奪感讓你在控制與暴走之間來回擺盪？',
  q2: '當身體需要艮其趾般的行動節制停止某個已造成傷害的運動或生活習慣時，你會選擇徹底暫停該活動直到身體完全康復再從更低強度開始重新訓練，還是調整而非停止把強度降到身體可以承受的範圍內讓活動繼續進行不讓停止變成退步？',
  q3: '艮其身提醒健康管理是全面的身體覺察而非只關注單一部位，哪個具體的身體部位一旦長期被你忽略會成為整個健康系統的弱環，等到這個部位發出明顯警訊時已經不是單純的調養可以解決而是需要醫療介入？',
};
HEX52.data.decision = {
  imgs: ['艮其限', '敦艮', '艮其趾'],
  q1: '艮其限提醒重大決策需要有明確的邊界與限制不能無止境地擴張選項與資訊，你覺得目前是已經把選項收斂到少數幾個可行方案只是在細節上還需要比較，還是選項仍在持續增殖中你不但沒有縮小範圍反而越研究越多可能性？',
  q2: '當決定需要敦艮般誠實面對停止某個長期投入的方向時，你會選擇用一張紙寫下所有繼續與停止的理由讓數據與事實而非情感主導決定，還是給自己一段情感緩衝期先允許為可能要放棄的東西感到失落再做出理性的選擇？',
  q3: '艮其趾提醒在決定踏出第一步之前必須先確保方向正確，哪個具體的判斷前提一旦無法被驗證代表所有基於這個前提的決策推論都需要重新檢視，繼續往前走的每一步都是在錯誤的方向上越走越遠而非越來越接近目標？',
};
HEX52.data.business = {
  imgs: ['兼山艮', '艮其身', '艮其限'],
  q1: '兼山艮象徵企業前方有兩座大山般的障礙需要暫停擴張先穩固現有的根基，你覺得目前的障礙是外部市場環境暫時性的不利因素只需耐心等待週期回轉，還是企業內部的核心能力已不足以跨過下一座山需要從根本提升競爭力？',
  q2: '當企業需要艮其限的明確戰略邊界停止進入不熟悉的市場時，你會選擇嚴格聚焦在最核心的業務把所有資源集中在已驗證成功的領域做到極致，還是保留一小部分資源作為探索預算在不影響主營業務的前提下測試新方向？',
  q3: '艮其身提醒企業停止不當的擴張但核心業務仍要繼續運轉成長，哪個具體的業務數據一旦出現停滯或衰退代表你的停止已經從戰略性的暫停變成了被動的萎縮，市場不但沒有等你反而在你停下來的期間被競爭者大量侵蝕？',
};
HEX52.data.legal = {
  imgs: ['艮其趾', '艮其輔', '艮其限'],
  q1: '艮其趾提醒在啟動法律行動之前必須先停下來審慎評估第一步的方向是否正確，你覺得目前是剛有啟動法律程序的念頭還在收集資訊評估是否值得採取行動，還是已經踏出了第一步才發現案件比預期複雜正在考慮是否該暫停重新規劃策略？',
  q2: '當法律攻防需要艮其輔的言語節制在法庭或談判中控制言論的範圍時，你會選擇讓律師主導所有法律發言自己只在必要時提供事實資訊不參與策略發言，還是與律師密切合作確保自己對每個發言的策略意圖都有充分的理解與共識？',
  q3: '艮其限要求法律策略設定明確的邊界知道何時該停止訴訟何時該繼續推進，哪個具體的法律階段一旦進入代表繼續推進的邊際效益已大幅下降，再投入更多時間與費用已不是追求正義而是陷入了訴訟本身已變成目的的消耗戰？',
};
HEX52.data.spiritual = {
  imgs: ['兼山艮', '敦艮', '艮其身'],
  q1: '兼山艮的雙重靜止意象描述你的內在世界正處在層層疊疊的寧靜中，你覺得這份寧靜是來自於真正的內心安定如山一般沉穩不被外界風吹草動影響，還是因為對外在世界感到疲憊而逃進內心但靜止的底下其實壓著許多未處理的情緒與雜念？',
  q2: '當內在修行需要敦艮般篤實靜止用最真誠面對內心空白而非用忙碌填滿時，你會選擇每天固定留出一段完全不做任何事的時間安靜坐著觀察呼吸與念頭來來去去，還是把靜止融入日常在洗碗與走路時都保持全然覺知讓每一件事都成為修行？',
  q3: '艮其身提醒內在的止是停止妄念與執著而非停止生命的流動，哪個具體的心念模式一旦出現代表你已從智慧的放下偏向了消極的放棄，你正在用艮的靜止來合理化自己對生命熱情的熄滅而非真正的內心平靜？',
};

// ===== BUILD, VALIDATE, WRITE =====
function buildQuestions(hexDef) {
  const out = [];
  for (const [catKey, catName] of CATEGORIES) {
    const d = hexDef.data[catKey];
    if (!d) throw new Error('Missing data for hex ' + hexDef.hexagramId + ' cat ' + catKey);
    const entries = [d.q1, d.q2, d.q3];
    entries.forEach((question, idx) => {
      out.push({
        id: 'rf-' + String(hexDef.hexagramId).padStart(3, '0') + '-' + catKey + '-' + (idx + 1),
        hexagramId: hexDef.hexagramId,
        hexagramName: hexDef.hexagramName,
        category: catKey,
        categoryName: catName,
        question: question,
        basis: [hexDef.hexagramName, d.imgs[idx] || d.imgs[0], catName],
        qualityLevel: 'refined',
        reviewed: false,
        needsHumanReview: true,
        version: '1.10.0-wD-refl-hex49-52',
      });
    });
  }
  return out;
}

function normalize(s) {
  return s.replace(/[？，。！、\s]/g, '');
}

function validateLengths(questions, label) {
  const bad = [];
  for (const q of questions) {
    const len = q.question.length;
    if (len < 38 || len > 105) {
      bad.push({ id: q.id, len: len, question: q.question });
    }
  }
  if (bad.length) {
    console.error('[' + label + '] Length validation FAILED for ' + bad.length + ' questions:');
    bad.forEach(function(b) { console.error('  ' + b.id + ' len=' + b.len + ': ' + b.question); });
    throw new Error(label + ': length validation failed');
  }
  console.log('[' + label + '] Length validation OK for ' + questions.length + ' questions (38-105 chars).');
  const lens = questions.map(function(q) { return q.question.length; });
  console.log('  min=' + Math.min.apply(null, lens) + ' max=' + Math.max.apply(null, lens) + ' avg=' + (lens.reduce(function(a,b){return a+b;},0)/lens.length).toFixed(1));
}

function validateEndsWithQuestionMark(questions, label) {
  const bad = questions.filter(function(q) { return !q.question.endsWith('？'); });
  if (bad.length) {
    console.error('[' + label + '] Missing terminal ？ for:', bad.map(function(b) { return b.id; }));
    throw new Error(label + ': terminal punctuation validation failed');
  }
  console.log('[' + label + '] Terminal ？ validation OK.');
}

function validateUniqueness(questions, label) {
  const seen = new Map();
  let dupCount = 0;
  for (const q of questions) {
    const norm = normalize(q.question);
    if (seen.has(norm)) {
      dupCount++;
      console.error('[' + label + '] Duplicate (normalized) between ' + seen.get(norm) + ' and ' + q.id);
    } else {
      seen.set(norm, q.id);
    }
  }
  const uniqueCount = questions.length - dupCount;
  console.log('[' + label + '] Uniqueness: ' + uniqueCount + '/' + questions.length + ' unique after normalization.');
  if (dupCount > 0) {
    throw new Error(label + ': uniqueness validation failed (' + dupCount + ' duplicates)');
  }
}

function validateNormU(questions, label) {
  const seen = new Map();
  for (const q of questions) {
    const norm = normalize(q.question);
    seen.set(norm, (seen.get(norm) || 0) + 1);
  }
  const uniqueCount = seen.size;
  const total = questions.length;
  const ratio = (uniqueCount / total * 100).toFixed(1);
  console.log('[' + label + '] normU: ' + uniqueCount + '/' + total + ' (' + ratio + '%)');
  if (uniqueCount < 32) {
    console.error('[' + label + '] normU FAILED: ' + uniqueCount + ' < 32 required.');
    throw new Error(label + ': normU validation failed (' + uniqueCount + ' < 32)');
  }
  console.log('[' + label + '] normU >= 32/36 PASSED.');
}

function validateImageryUsage(questions, label, hexName) {
  const groupQuestions = {};
  for (const q of questions) {
    const key = q.hexagramId + '-' + q.category;
    if (!groupQuestions[key]) groupQuestions[key] = { questions: [], imgs: new Set() };
    groupQuestions[key].questions.push(q);
    groupQuestions[key].imgs.add(q.basis[1]);
  }
  const bad = [];
  for (const key of Object.keys(groupQuestions)) {
    const g = groupQuestions[key];
    const allImgs = Array.from(g.imgs);
    let imageryCount = 0;
    for (const q of g.questions) {
      const hasImagery = allImgs.some(function(term) { return q.question.includes(term); });
      if (hasImagery) imageryCount++;
    }
    if (imageryCount < 2) {
      bad.push(key + ': only ' + imageryCount + '/' + g.questions.length + ' questions use hex imagery (need >=2)');
    }
  }
  if (bad.length) {
    console.error('[' + label + '] Imagery usage FAILED:');
    bad.forEach(function(b) { console.error('  ' + b); });
    throw new Error(label + ': imagery usage validation failed');
  }
  console.log('[' + label + '] Imagery usage OK: all ' + Object.keys(groupQuestions).length + ' groups have >=2 hex-imagery questions.');
}

function validateQStructure(questions, label) {
  const bad = [];
  for (const q of questions) {
    const qType = parseInt(q.id.split('-')[3]);
    if (qType === 1) {
      if (!q.question.includes('還是')) {
        bad.push(q.id + ': Q1 should contain 還是 (state comparison)');
      }
    } else if (qType === 2) {
      if (!q.question.includes('還是')) {
        bad.push(q.id + ': Q2 should contain 還是 (choice comparison)');
      }
    } else if (qType === 3) {
      if (q.question.includes('還是')) {
        bad.push(q.id + ': Q3 should NOT contain 還是 (risk/boundary/timing question)');
      }
    }
  }
  if (bad.length) {
    console.error('[' + label + '] Q-structure validation FAILED:');
    bad.forEach(function(b) { console.error('  ' + b); });
    throw new Error(label + ': Q-structure validation failed');
  }
  console.log('[' + label + '] Q-structure validation OK: Q1/Q2 have 還是, Q3 do not.');
}

function main() {
  const newH49 = buildQuestions(HEX49);
  const newH50 = buildQuestions(HEX50);
  const newH51 = buildQuestions(HEX51);
  const newH52 = buildQuestions(HEX52);

  const allNew = newH49.concat(newH50).concat(newH51).concat(newH52);
  console.log('Built ' + allNew.length + ' new questions (36 hex49 + 36 hex50 + 36 hex51 + 36 hex52).\n');

  console.log('--- LENGTH VALIDATION ---');
  validateLengths(newH49, 'HEX49');
  validateLengths(newH50, 'HEX50');
  validateLengths(newH51, 'HEX51');
  validateLengths(newH52, 'HEX52');

  console.log('\n--- TERMINAL ？ VALIDATION ---');
  validateEndsWithQuestionMark(newH49, 'HEX49');
  validateEndsWithQuestionMark(newH50, 'HEX50');
  validateEndsWithQuestionMark(newH51, 'HEX51');
  validateEndsWithQuestionMark(newH52, 'HEX52');

  console.log('\n--- UNIQUENESS VALIDATION ---');
  validateUniqueness(newH49, 'HEX49');
  validateUniqueness(newH50, 'HEX50');
  validateUniqueness(newH51, 'HEX51');
  validateUniqueness(newH52, 'HEX52');
  validateUniqueness(allNew, 'HEX49-52 combined');

  console.log('\n--- normU VALIDATION (>= 32/36) ---');
  validateNormU(newH49, 'HEX49');
  validateNormU(newH50, 'HEX50');
  validateNormU(newH51, 'HEX51');
  validateNormU(newH52, 'HEX52');

  console.log('\n--- IMAGERY USAGE VALIDATION ---');
  validateImageryUsage(newH49, 'HEX49', '革');
  validateImageryUsage(newH50, 'HEX50', '鼎');
  validateImageryUsage(newH51, 'HEX51', '震');
  validateImageryUsage(newH52, 'HEX52', '艮');

  console.log('\n--- Q-STRUCTURE VALIDATION (Q1/Q2 還是, Q3 not) ---');
  validateQStructure(newH49, 'HEX49');
  validateQStructure(newH50, 'HEX50');
  validateQStructure(newH51, 'HEX51');
  validateQStructure(newH52, 'HEX52');

  console.log('\n=== ALL 144 QUESTIONS PASSED VALIDATION. Writing data file. ===\n');

  const code = fs.readFileSync(DATA_PATH, 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: DATA_PATH });
  const data = sandbox.window.Zero1MatrixData.reflectionQuestions;
  if (!Array.isArray(data)) throw new Error('Failed to load existing reflectionQuestions array');

  console.log('Loaded existing data: ' + data.length + ' questions total.');

  const before49 = data.filter(function(d) { return d.hexagramId === 49; }).length;
  const before50 = data.filter(function(d) { return d.hexagramId === 50; }).length;
  const before51 = data.filter(function(d) { return d.hexagramId === 51; }).length;
  const before52 = data.filter(function(d) { return d.hexagramId === 52; }).length;
  console.log('Existing hex49=' + before49 + ', hex50=' + before50 + ', hex51=' + before51 + ', hex52=' + before52);

  const filtered = data.filter(function(d) { return d.hexagramId !== 49 && d.hexagramId !== 50 && d.hexagramId !== 51 && d.hexagramId !== 52; });
  const merged = filtered.concat(newH49).concat(newH50).concat(newH51).concat(newH52);

  merged.sort(function(a, b) { return a.hexagramId - b.hexagramId; });

  console.log('New total: ' + merged.length + ' (expected ' + (data.length - before49 - before50 - before51 - before52 + 144) + ')');

  const output =
    "window.Zero1MatrixData = window.Zero1MatrixData || {};\n" +
    "window.Zero1MatrixData.reflectionQuestions = " +
    JSON.stringify(merged) +
    ";\n";

  fs.writeFileSync(DATA_PATH, output, 'utf8');
  console.log('Written to ' + DATA_PATH);

  try {
    execFileSync(NODE_EXE, ['--check', DATA_PATH], { stdio: 'inherit' });
    console.log('node --check PASSED.');
  } catch (e) {
    console.error('node --check FAILED.');
    throw e;
  }

  const verifyCode = fs.readFileSync(DATA_PATH, 'utf8');
  const verifySandbox = { window: {} };
  vm.createContext(verifySandbox);
  vm.runInContext(verifyCode, verifySandbox, { filename: DATA_PATH });
  const verifyData = verifySandbox.window.Zero1MatrixData.reflectionQuestions;
  console.log('Verification reload: ' + verifyData.length + ' total questions.');
  const v49 = verifyData.filter(function(d) { return d.hexagramId === 49; });
  const v50 = verifyData.filter(function(d) { return d.hexagramId === 50; });
  const v51 = verifyData.filter(function(d) { return d.hexagramId === 51; });
  const v52 = verifyData.filter(function(d) { return d.hexagramId === 52; });
  console.log('Verification hex49=' + v49.length + ', hex50=' + v50.length + ', hex51=' + v51.length + ', hex52=' + v52.length);

  if (v49.length !== 36 || v50.length !== 36 || v51.length !== 36 || v52.length !== 36) {
    throw new Error('Verification failed: expected 36 questions each for hex49-52');
  }

  const allVerified = v49.concat(v50).concat(v51).concat(v52);
  for (const q of allVerified) {
    if (q.qualityLevel !== 'refined') throw new Error(q.id + ': qualityLevel=' + q.qualityLevel);
    if (q.reviewed !== false) throw new Error(q.id + ': reviewed=' + q.reviewed);
    if (q.needsHumanReview !== true) throw new Error(q.id + ': needsHumanReview=' + q.needsHumanReview);
  }
  console.log('Quality field verification PASSED.');

  console.log('\nwD_refl_49_52.js generation COMPLETE - 144 questions written successfully.');
}

main();
