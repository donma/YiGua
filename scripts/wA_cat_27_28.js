'use strict';
/**
 * wA_cat_27_28.js
 * Generates per-hex-per-category UNIQUE content for hex 27 (頤) and hex 28 (大過)
 * ALL 12 categories each = 24 entries total.
 * Replaces existing entries in categoryInterpretations.data.js.
 *
 * LENGTH CONSTRAINTS (characters, strict):
 *   meaning: 120-190   advice: 100-160   warning: 80-125   timing: 60-105
 */
const vm = require('vm');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'src', 'data', 'categoryInterpretations.data.js');
const NODE_EXE = path.join(__dirname, '..', '.nodejs', 'node-v22.14.0-win-x64', 'node.exe');
const TODAY = '2026-07-13';
const VER = '1.8.0-wA-cat-27-28';

const CATEGORIES = [
  ['general','一般'],['career','工作事業'],['love','感情關係'],
  ['money','財務金錢'],['people','人際合作'],['family','家庭親人'],
  ['study','學習考試'],['health','身心狀態'],['decision','重大決策'],
  ['business','創業經營'],['legal','官非合約'],['spiritual','心境修行'],
];

const META = {qualityLevel:"refined",reviewed:false,reviewedBy:"wA-cat-27-28",reviewedAt:TODAY,needsHumanReview:true,version:VER};

// ════════════════════════════════════════════════════════════════════
// HEX 27 頤 — 養育、供養責任、欲望節制、資訊攝取
// 觀頤自求口實 | 舍爾靈龜 | 顛頤 | 拂頤 | 虎視眈眈 | 由頤 | 慎言語節飲食
// ════════════════════════════════════════════════════════════════════

const H27 = [
  // ── general ──
  {id:"hex-027-general",hexagramId:27,category:"general",categoryName:"一般",
   meaning:"山雷頤卦叩問一個根本命題：你拿什麼養自己、又拿什麼養別人。觀頤自求口實——向外尋求資源不如回頭觀看自己如何咀嚼每日吃進的資訊、習慣與價值。舍爾靈龜刺痛你天生有靈龜般自足的本能，卻為羨慕他人碗中物而將它丟棄。慎言語節飲食把養育濃縮為兩個門檻：少說一句比多說一句安全，欲望少滿足一層比放縱一層更滋養。",
   advice:"記錄一週內每天「吃進」的三樣東西：食物、資訊、他人評價。週末圈出讓你虛弱而非滋養的項目，挑最易切斷的一項從明天停掉。同時確認一個真正養你的事是否被排擠——把它像約會般鎖進下週行事曆，不可取消。養育從刪除不必要開始，而非增加更多養分。",
   warning:"把養自己外包給他人——讓伴侶決定你的情緒、讓社媒決定你的價值、讓成就決定你能否休息。舍爾靈龜一旦成習慣，你將花一輩子追逐別人嚼過的殘渣。觀頤若只觀他人碗裡不看自己口實，養育便淪為比較。",
   timing:"連續三天只消費不創造——接收資訊不產出、接受照顧不付出——立即切斷最大輸入源二十四小時。慎言語需七天見效：每天少說三句非必要發言。節飲食調整以兩週為單位，太快觸發補償性放縱。",
   basis:["觀頤自求口實","舍爾靈龜","慎言語節飲食","顛頤","一般"],
   scoreAdjust:{clarity:2,action:-1,risk:1,change:-2,support:0,timing:3}},

  // ── career ──
  {id:"hex-027-career",hexagramId:27,category:"career",categoryName:"工作事業",
   meaning:"職場頤卦以顛頤為核心困境——本該由制度與上級滋養你的專業成長，供養鏈卻顛倒了，變成你用個人精力填補組織結構的空洞。拂頤是另一失衡：拒絕本該接受的養分，只因那不是你要的方式，可能因此錯失前輩指導或關鍵資源。由頤則是終極提問：當無人能養你時，你拿什麼養自己未來的職涯。",
   advice:"列出半年來你在工作中提供養分的對象——誰依賴你的指導、哪個專案靠你超時運轉。圈出本該由上級提供卻由你代勞的項目，約主管談一次資源重分配，只談事實不帶情緒。同時挑一項你一直拒絕學的新技能，每天投入二十分鐘連續三十天，不求快只求不放棄。",
   warning:"顛頤最危險的形態是能者多勞的糖衣——被需要不等於被珍惜，長期供養不健全的結構只會讓你枯竭。拂頤把拒絕幫助包裝成獨立：不參加培訓、不請教前輩、不申請資源，然後困惑自己為何停滯。",
   timing:"連續兩季做超出職等的工作卻無對應晉升或加薪，這是顛頤的量化信號，該啟動內轉或外評。學新技能第一個月只接觸不精通，第二個月才設產出目標。每半年檢視誰在養你的職涯、你在養誰的。",
   basis:["顛頤","拂頤","由頤","觀頤自求口實","工作事業"],
   scoreAdjust:{clarity:1,action:0,risk:2,change:3,support:-1,timing:2}},

  // ── love ──
  {id:"hex-027-love",hexagramId:27,category:"love",categoryName:"感情關係",
   meaning:"感情中的頤卦以觀頤為第一視角——不看對方如何對你，而是觀看你在關係中拿什麼養自己、養對方。虎視眈眈揭露不舒服的真相：一方如老虎緊盯另一方的資源與付出，那不是愛是掠食性依賴。顛頤點出當養育反轉——你一直在養不養你的人——關係已從互相滋養淪為單向消耗。",
   advice:"兩人各寫「從對方得到什麼滋養」與「給對方什麼滋養」。交換紙條後不討論不辯解，各自沉澱至少一天。隔天只談一件事：兩張紙有無明顯失衡。若有失衡，不要求對方立刻改變，而是各自承諾一個自己能做的調整，一週後再核對一次結果。",
   warning:"虎視眈眈常偽裝成在乎——頻繁檢查行蹤、要求即時回覆、對伴侶社交圈充滿敵意，是控制慾不是愛。顛頤的毀滅型態是聖母情結：用無限付出感動對方改變，結果被掏空的是自己。舍爾靈龜失守後，你連一個人的快樂都不會創造。",
   timing:"得到與給予對照在關係平穩期進行，不可在爭執後三天內操作。調整後兩個月仍失衡，應尋求伴侶諮商。對朋友重複抱怨同樣問題超過三次，虎視眈眈或顛頤已固化。",
   basis:["觀頤自求口實","虎視眈眈","顛頤","舍爾靈龜","感情關係"],
   scoreAdjust:{clarity:2,action:-1,risk:1,change:0,support:2,timing:2}},

  // ── money ──
  {id:"hex-027-money",hexagramId:27,category:"money",categoryName:"財務金錢",
   meaning:"財務中的頤卦以節飲食為直接訓誡——理財關鍵不是賺多少，是你對欲望的節制力決定了資產壽命。觀頤自求口實化為行動：回頭看錢吃進了什麼——是增值資產還是消失的消費。舍爾靈龜刺痛的是有穩定收入的本事卻把它丟掉，追逐別人炫耀的投資方式。顛頤警告當錢在養面子而非未來，崩塌只是時間問題。",
   advice:"把三個月支出歸類為養未來（投資進修保險）、養現在（必要生活）、養面子（為他人眼光花的錢）。面子類佔比超一成五，挑金額最大三項下月直接刪除，省下的錢不拿去消費，轉入一個只看不碰的獨立帳戶。這也是舍爾靈龜的財務實踐：用你的紀律養你，而非用他人的眼光。",
   warning:"舍爾靈龜在財務上致命的是見他人賺快錢就放棄自己穩健步調。你不需要變成別人才能致富，只需不再丟掉原有的理財紀律。顛頤的財務版是被動收入養成懶惰——錢在養你的停滯而非自由。",
   timing:"面子支出削減以三個月為週期：第一月只刪不增，第二月觀察實際影響，第三月決定永久取消。節飲食式調整不適合收入驟變的當月——先穩定現金流再動支出結構。",
   basis:["節飲食","觀頤自求口實","舍爾靈龜","顛頤","財務金錢"],
   scoreAdjust:{clarity:1,action:-1,risk:1,change:-1,support:0,timing:2}},

  // ── people ──
  {id:"hex-027-people",hexagramId:27,category:"people",categoryName:"人際合作",
   meaning:"人際中的頤卦以由頤為終極考題——當無人能為你提供養分時，能否靠自己站穩並反過來滋養他人。顛頤在此化為具體病理：你持續單向輸出支持與資源，需要時那些你養過的人卻一個都不在。拂頤則是另一種人際失調：有人真心要幫你，你卻因自尊或偏見拒絕，然後抱怨這世界對你冷漠。",
   advice:"畫同心圓：內圈三人——彼此無條件支持的對象；中圈是有來往未確認雙向性的人；外圈是你單向付出的人。一個月內八成社交時間給內圈，中圈每人安排一次不帶目的的對話測試雙向意願，外圈逐步減少回應頻率但不做宣告式絕交。",
   warning:"由頤最易被曲解為我不需要任何人——這是孤立不是自足。顛頤最悲傷的不是被利用，是明知被利用卻無法離開，因價值感已綁在「被需要」上。拂頤讓你錯過真心想幫你的人，他們被拒幾次就離開。",
   timing:"外圈退出以月為單位，每次減三成回應頻率觀察對方是否主動。連續三次你的邀請被同一人拒絕，從中圈移至外圈——不是懲罰，是讓精力回流。每季檢視同心圓，關係養分會流動。",
   basis:["由頤","顛頤","拂頤","虎視眈眈","人際合作"],
   scoreAdjust:{clarity:2,action:0,risk:0,change:1,support:2,timing:1}},

  // ── family ──
  {id:"hex-027-family",hexagramId:27,category:"family",categoryName:"家庭親人",
   meaning:"家庭中的頤卦以慎言語節飲食為日常修行——家人間最大的養分是好好說話，最大毒藥也是不好好說話。一句無心批評可抵銷十次用心照顧，因家人對彼此言語的敏感度遠高於外人。顛頤在家庭的典型是子女被迫成為父母的情感養育者，承擔不屬於自己年齡的責任。舍爾靈龜則是全家依賴到枯竭的那個成員。",
   advice:"本週設定慎言實驗：每天全家相聚時，每人輪流說一件當天發生在自己身上的好事，其他人只聽不評論、不比較、不轉移話題。結束時只說一句「謝謝你告訴我們」。目的不是解決問題，是重建「被聽見」這最基本的家庭養分。",
   warning:"顛頤造成跨代創傷——被迫養父母情緒的孩子長大後，要麼過度負責繼續養每個人，要麼拒絕親密以免再被掏空。慎言語的反面是冷戰：家庭沉默比爭吵更侵蝕，因每個人都活在猜測中。",
   timing:"慎言實驗至少持續七天，期間遇重大衝突則暫停三天後重啟。家人承擔顛頤角色超過一年，應在家庭會議明確責任重分配，不以能者多勞合理化。每季安排一次無議程的家庭聚會。",
   basis:["慎言語節飲食","顛頤","舍爾靈龜","觀頤自求口實","家庭親人"],
   scoreAdjust:{clarity:1,action:-1,risk:1,change:-1,support:3,timing:1}},

  // ── study ──
  {id:"hex-027-study",hexagramId:27,category:"study",categoryName:"學習考試",
   meaning:"學習中的頤卦以觀頤自求口實為根本方法——最有效的學習不是你被餵了多少知識，而是你如何咀嚼。多數人花大量時間聽課筆記卻不停下反芻，無法用自己的話重講就是沒嚼透。拂頤是常見障礙：明知某基礎科薄弱，卻繞開去學更花俏的內容，遇進階問題就卡住。舍爾靈龜提醒你本有自學力，卻丟掉去依賴補習班速成口訣。",
   advice:"學完新概念強制三步驟：闔上書本用自己的話寫一段解釋；想出一個這概念能解釋的日常生活例子；找出一個它無法解釋的反例或邊界條件。三步才是觀頤式的真正咀嚼。第三步做不出表示沒真懂，回頭重讀而非繼續前進新內容。",
   warning:"拂頤最致命是跳過基礎直接學應用——短期有進步快的錯覺，場景稍微偏離範例就完全無法推導。舍爾靈龜悲劇是明明能自學卻報名昂貴課程，用繳費證明取代學習——錢花了不等於學到了。",
   timing:"三步驟咀嚼法在新領域前三週最關鍵——此時建立的消化習慣決定後續效率。每完成一單元給半天沉澱。同一概念三次咀嚼仍做不出反例，標記為需外部協助並一週內請教。",
   basis:["觀頤自求口實","拂頤","舍爾靈龜","慎言語節飲食","學習考試"],
   scoreAdjust:{clarity:3,action:0,risk:0,change:1,support:0,timing:1}},

  // ── health ──
  {id:"hex-027-health",hexagramId:27,category:"health",categoryName:"身心狀態",
   meaning:"頤卦在身心層面以節飲食為最古老的養生智慧——節不是禁絕，是知道何時該停。現代人健康問題往往不是吃不夠睡不夠，是對身體訊號失去敏感：飽了還吃、累了還滑手機、情緒滿了還壓抑。慎言語連結身體：每句沒說出口的情緒堆積在器官裡。觀頤自求口實指向最根本的健康觀——你是身體的第一觀察者。本欄不做醫療診斷。",
   advice:"記錄兩週三條基線：醒來精力自評一到十分、每餐吃到幾分飽時停止、睡前情緒用三個詞描述。兩週後回顧波動模式，找出讓精力下降最明顯的前三個因素，針對影響最大的一個先做調整，只改一個，改到穩定後再動下一個。不急不貪是節飲食的核心精神。",
   warning:"節飲食被誤解成極端節食時，身體啟動飢荒模式——代謝降、肌肉流失、復胖體脂更高。慎言語的壓抑版是情緒性進食——不說的憤怒變甜食，不表達的悲傷變酒精。觀頤若變強迫監控，養已變成慢性自傷。",
   timing:"三條基線至少記錄十四天才看出有意義的模式，少於七天只是隨機波動。每次只調一個變因觀察兩週。基線連續三天劇烈偏離時暫停實驗，先回穩再重啟。",
   basis:["節飲食","慎言語","觀頤自求口實","顛頤","身心狀態"],
   scoreAdjust:{clarity:1,action:-1,risk:1,change:0,support:1,timing:2}},

  // ── decision ──
  {id:"hex-027-decision",hexagramId:27,category:"decision",categoryName:"重大決策",
   meaning:"決策中的頤卦以觀頤自求口實為核心——與其向外搜集資訊，不如向內觀看動機來自哪裡：是由頤出於自我滋養，還是顛頤為了填補他人期待。拂頤是明明直覺指向對的選項，卻因不符自我想像而拒絕。舍爾靈龜點出最深智慧：你其實已知道答案，只是不敢承認。虎視眈眈警告死盯某選項時判斷力已被欲望綁架。",
   advice:"把決定拆三層觀：第一層——這決定會養誰，誠實寫下受益者名單；第二層——不做會失去什麼，三年後回頭看這失去還重要嗎；第三層——有無被你排除的第三選項其實同時滿足了養己與養人的需求。寫完放三天不看，第四天重讀並用紅筆劃掉你覺得在自欺的句子。",
   warning:"由頤被當自私藉口時，每個決定只看對我有何好處，短期精明長期失去所有合作者。顛頤式悲劇是為不讓父母失望而選他們要的科系職業，二十年後醒來發現從未為自己做過真正的決定。",
   timing:"三層觀頤法在不可逆決定時至少七天：第一天寫、第四天重讀、第七天決定。紅筆劃掉超三處表示自欺成分過高，退回誠實重答。不在晚上十點後做重大決定，疲勞時判斷力與酒醉無異。",
   basis:["觀頤自求口實","由頤","顛頤","拂頤","舍爾靈龜","虎視眈眈","重大決策"],
   scoreAdjust:{clarity:3,action:-2,risk:1,change:0,support:0,timing:3}},

  // ── business ──
  {id:"hex-027-business",hexagramId:27,category:"business",categoryName:"創業經營",
   meaning:"創業中的頤卦以由頤為核心——商業模式養誰？養自己、團隊、客戶，三者養分流動須形成循環而非單向抽取。顛頤在商業的經典死法是燒投資人的錢養無造血力的產品，錢燒完公司就死。拂頤是拒養該養的環節：不養客服口碑崩、不養研發產品舊、不養文化人才失。虎視眈眈警告死盯對手忘了看自己碗裡還有沒有飯。本欄不做獲利保證。",
   advice:"畫養分流向圖：營收從哪來、成本去哪、利潤留哪。圈出只進不出或只出不進的節點。針對最脆弱節點設計九十天可驗證實驗——若客戶流失高，挑十個流失客戶打電話問一句：我們當初沒做到什麼讓你決定離開。只聽不推銷不解釋，這是最純粹的觀頤式盡職調查。",
   warning:"顛頤最難察覺是成長掩蓋虧損——營收在長看不見單位經濟漏洞，直到成長停滯才發現每筆交易都在賠。拂頤讓你省不該省的：砍團隊建設、取消培訓、壓榨人力——短期財報好看，長期只剩等跳槽的人。",
   timing:"流向圖每季更新對比趨勢。九十天實驗關鍵在三十天和六十天——若三十天回饋指向商業模式根本問題非執行問題，暫停實驗重評方向。連續兩季營收成長但現金流淨流出，這是顛頤的信號。",
   basis:["由頤","顛頤","拂頤","虎視眈眈","觀頤自求口實","創業經營"],
   scoreAdjust:{clarity:2,action:1,risk:2,change:2,support:-1,timing:1}},

  // ── legal ──
  {id:"hex-027-legal",hexagramId:27,category:"legal",categoryName:"官非合約",
   meaning:"法律事務中的頤卦以慎言語為最高原則——合約與訴訟中每句話都可能被記錄引用曲解，多說一字比少說一字風險高數倍。節飲食轉化為節制對贏的欲望——精準爭取真正屬於你的部分，貪多反讓法官對你誠信生疑。觀頤自求口實指向合約前盡職調查：不要只聽對方說了什麼，自己去查他沒說什麼。本欄不做法律結果判定。",
   advice:"簽約前強制三件事：用口語把每條款講給一個不懂法律的人聽，他聽不懂就是你沒真正理解的地方；找出合約沒寫但該寫的三件事，要求補上再簽；設定一個退場條件的量化標準。這三步做完前不在任何文件上簽名，這是慎言語在法律場域的具體轉化。",
   warning:"慎言語最大陷阱是信賴口頭承諾——沒關係之後再補合約本身就是風險信號。節飲食誤用是在和解時獅子大開口，本可合理補償全身而退卻因貪婪逼對方跟你耗到底。顛頤是為省律師費自辦複雜案件，因程序錯誤輸掉穩贏的案子。",
   timing:"口語翻譯測試在簽約前至少七十二小時完成。對方連續三次迴避同一問題不是疏忽是故意模糊，考慮終止談判。任何法律行動前先問律師：最壞結果是什麼、機率多大、我能不能承受。",
   basis:["慎言語","節飲食","顛頤","觀頤自求口實","官非合約"],
   scoreAdjust:{clarity:2,action:-2,risk:3,change:0,support:0,timing:2}},

  // ── spiritual ──
  {id:"hex-027-spiritual",hexagramId:27,category:"spiritual",categoryName:"心境修行",
   meaning:"修行中的頤卦以舍爾靈龜為最鋒利一刀——你本自俱足，靈龜不需向外覓食，你卻把它丟一旁追逐法門老師境界。觀頤自求口實是修行最樸素的方法：不看別人怎麼修，觀察自己每天吃進什麼念頭、情緒、執著在餵養心。由頤是修行成熟的標誌：不再需外在肯定或他人認證才能確信方向。慎言語節飲食化為最日常戒律：嘴管好欲望管好，修行已成功一半。",
   advice:"三十天靈龜實驗：停止讀新靈性書、停止參加新課程工作坊、停止在社媒討論修行。每天只做一件事——安靜坐十五分鐘，觀察念頭如雲來去，不抓不推不標籤。三十天後問自己：少了外在修行燃料，內在平靜有無減少？若減少，你養的不是靈龜是修行成癮。",
   warning:"舍爾靈龜最普遍也最難辨——用追求更多法門逃避面對真正功課。你已知道該放下什麼，卻選擇再參加禪修營再讀大師書，用忙碌行程迴避最該直面的傷口。顛頤修行版是變成別人心靈養分——不斷傾聽給建議扮智者，從不讓人靠近自己的脆弱。",
   timing:"靈龜實驗前七天有戒斷反應，最危險是偷偷破戒騙自己這不算。第十四天出現轉折：要麼開始真正面對自己，要麼找到新替代成癮。第三十天不評分，只問這三十天有幾天真正在跟自己在一起。",
   basis:["舍爾靈龜","觀頤自求口實","由頤","慎言語節飲食","心境修行"],
   scoreAdjust:{clarity:2,action:-3,risk:0,change:1,support:1,timing:2}},
];

// ════════════════════════════════════════════════════════════════════
// HEX 28 大過 — 結構超載、非常措施、承重點、不可逆風險
// 棟橈 | 藉用白茅 | 枯楊生稊 | 棟橈凶 | 棟隆吉 | 枯楊生華 | 過涉滅頂 | 澤滅木
// ════════════════════════════════════════════════════════════════════

const H28 = [
  // ── general ──
  {id:"hex-028-general",hexagramId:28,category:"general",categoryName:"一般",
   meaning:"澤風大過揭示結構超載的臨界狀態——棟橈，屋脊主樑已彎曲，整個結構處於崩潰邊緣。大過不是一般過錯，是系統性過度：承重點承受超出設計極限的壓力。藉用白茅給出唯一緩衝：在承重點下墊一層最柔軟的白茅草——不是硬撐，是用柔性智慧吸收衝擊。枯楊生稊是一線生機：枯死的楊樹從根部發新芽，超載中新的可能仍在底層萌發。",
   advice:"立即找出處境中那根彎曲的棟樑——可能是健康、核心關係、主要收入或基本信念。誠實計算承重量與極限的落差；像藉用白茅在下方放緩衝——減工作量、找人分擔、設不可逾越底線；像枯楊生稊在不起眼角落培育備援方案。",
   warning:"最致命是把棟橈當成還能再撐——樑的彎曲非線性，會在臨界點瞬間折斷無漸進警告。另一陷阱是拒絕非常措施：用正常時期方法處理超載，每次「正常」決定都在加速崩潰。澤滅木的教訓：滋養你的東西一旦過量就成淹沒你的洪水。",
   timing:"棟橈辨識窗口通常一到三個月——連續兩週用「再撐一下」說服自己，你已在彎曲中後段。枯楊生稊培育需六到八週才見新芽，勿因無立即成果放棄。藉用白茅緩衝須在棟樑斷裂前設置——斷了再放只是蓋在廢墟上。",
   basis:["棟橈","藉用白茅","枯楊生稊","澤滅木","一般"],
   scoreAdjust:{clarity:2,action:1,risk:3,change:3,support:-1,timing:2}},

  // ── career ──
  {id:"hex-028-career",hexagramId:28,category:"career",categoryName:"工作事業",
   meaning:"職場大過以棟橈凶為最直接警訊——部門結構已超載，主樑彎曲當下不調整就是斷裂。可能表現為超時工作產出反降、關鍵人才連續離職、承接超出職等的責任卻無對應資源。棟隆吉指出另條路：若能在彎曲中重校承重點——重新定義角色而非繼續擴張——棟樑反能隆起到更穩固位置。枯楊生華是危險信號：該低調重整時急著開花展示成果。",
   advice:"列出目前職位所有任務，每項標註三個數據：是否只有你能做、每週佔時多少、對公司核心目標貢獻度一到十分。找出貢獻度最低但佔時最高的三項，下週主動向主管提案交出或暫停，釋放時間投入貢獻度高的任務。用資源最適化配置的語言溝通，不帶情緒不抱怨。",
   warning:"棟橈凶最常見前兆是能者過勞——表現好被不斷疊加責任，直到犯下一個正常狀態不會犯的錯，那個錯掩蓋過去所有好。枯楊生華是在裁員前夕急做大專案證明價值——結果不是被看見，是加速耗竭。",
   timing:"連續四週每週超五十小時但產出持平或下降，這是棟橈量化信號，須兩週內啟動減載談判。關鍵人才離職後九十天結構最脆弱，不承接新大型項目。棟隆吉結構重整需三到六個月，拖過半年從可調彎曲變不可逆斷裂。",
   basis:["棟橈凶","棟隆吉","枯楊生華","藉用白茅","工作事業"],
   scoreAdjust:{clarity:2,action:2,risk:3,change:2,support:-1,timing:2}},

  // ── love ──
  {id:"hex-028-love",hexagramId:28,category:"love",categoryName:"感情關係",
   meaning:"感情大過以過涉滅頂為深層恐懼——涉入一段關係太深已滅頂，看不清自己的邊界。這不是愛情太深是結構超載：一方或雙方承擔了關係不該承載的重量，把童年創傷帶進來求治癒、用關係填補人生空缺、把對方當唯一意義來源。枯楊生稊給出微弱希望：根部若還連著，新芽可能從意想不到處長出。藉用白茅是修復姿勢：在最脆弱處用最柔軟誠意鋪墊。",
   advice:"各自寫下關係目前承載了哪些超出戀愛本該承載的東西——需要對方填補孤獨、證明自我價值、替代父母角色等。交換紙條後不辯解不反駁，各自挑出自己最想放下的一項負載，約定一個月內各自用自己的方式處理這項——你去諮商、他去發展自己朋友圈，不要求對方解決你寫下的問題。",
   warning:"過涉滅頂最心碎的不是分手，是分手後發現已不記得一個人如何快樂——所有自我都抵押給關係，贖回只是空殼。枯楊生華是虛假復合：因寂寞重聚開滿樹花但根部已腐，花期一過連最後養分也耗盡。",
   timing:"關係超載清單在平穩期進行，不在爭執後四十八小時內操作。各自處理超載項目觀察至少一個月，每週一次非檢討式進度分享。一個月後清單項目無實質進展，應尋求伴侶諮商。",
   basis:["過涉滅頂","枯楊生稊","枯楊生華","藉用白茅","感情關係"],
   scoreAdjust:{clarity:2,action:-1,risk:2,change:1,support:2,timing:2}},

  // ── money ──
  {id:"hex-028-money",hexagramId:28,category:"money",categoryName:"財務金錢",
   meaning:"財務大過以棟橈為核心——財務結構主樑彎曲，可能是房貸佔比過高、單一收入撐全部支出、槓桿開到極限。藉用白茅給出務實緩衝：在脆弱那根樑下墊一層流動性最高的現金，不求收益，只求斷裂時有逃生時間。澤滅木是流動性氾濫警告：錢全投資、貸款借到上限、卡刷到見底，水本養木，過量信用淹死財務健康。",
   advice:"畫財務棟樑圖：固定支出佔總收入比例、債務月付與剩餘期數、投資風險與流動性。用紅筆圈出佔比超四成的支出或三十天內無法變現的投資。針對紅圈項目設計九十天減載計畫——每三十天降低該項佔比五到十個百分點，不求一次到位只求持續前進。",
   warning:"棟橈最危險幻覺是收入還會成長所以撐得住——把未來可能當現在緩衝，但收入增速往往追不上支出膨脹。澤滅木另一型態是保單投資買太多，流動性極差，需現金時一棵樹砍不下。",
   timing:"財務棟樑圖每半年更新，收入變動超一成五立即重繪。九十天減載關鍵在三十和六十天——進度落後超五成表示目標過激，需調步調非放棄。緊急備用金建立需三到六個月，期間不同時高風險投資。",
   basis:["棟橈","藉用白茅","澤滅木","枯楊生稊","財務金錢"],
   scoreAdjust:{clarity:2,action:1,risk:2,change:1,support:0,timing:2}},

  // ── people ──
  {id:"hex-028-people",hexagramId:28,category:"people",categoryName:"人際合作",
   meaning:"人際大過以棟橈為核心診斷——某段合作承重結構已彎曲，因一方承擔過多責任而另一方持續低參與。過涉滅頂意味你已過度涉入某段關係到失去自我判斷，開始為對方錯誤找藉口、為團體決定背書即使內心反對。藉用白茅給出人際緩衝：在最緊繃的承重點放一層柔性距離，不是翻臉，是給彼此呼吸空間。",
   advice:"針對最吃力的合作關係做單向責任審計——只列你做了什麼、對方做了什麼，不評價不歸因。拿給不涉入的友人看只問一句：清單平衡嗎。若對方說不平衡，一週內把一項你代做的事交還對方，不帶情緒不提供替代方案。",
   warning:"過涉滅頂最難回頭是你已開始為對方行為向第三方解釋——他不是那意思、他壓力大——你不是維護關係，是替對方越界提供合法性。棟橈彎曲若持續忽視，斷裂時通常不是好聚好散，是累積不滿一次引爆。",
   timing:"責任審計在情緒平穩時進行，不在衝突後三天內。交還責任觀察兩週——若對方接受處理，關係還有棟隆吉調整空間；若拒絕拖延，該關係已進入棟橈凶階段需降級。每半年對重要合作做一次平衡檢查。",
   basis:["棟橈","過涉滅頂","藉用白茅","枯楊生稊","人際合作"],
   scoreAdjust:{clarity:2,action:1,risk:1,change:1,support:1,timing:1}},

  // ── family ──
  {id:"hex-028-family",hexagramId:28,category:"family",categoryName:"家庭親人",
   meaning:"家庭大過以棟橈為沉重隱喻——家庭結構主樑彎曲，可能是經濟支柱健康出問題、父母婚姻裂痕影響全家穩定、某成員成癮或債務拖垮全家。藉用白茅是家庭版緩衝：在最脆弱點周圍鋪最柔軟支持——不是解決問題，是先不讓惡化。枯楊生稊意味年輕一代或新模式從底部萌芽。過涉滅頂警告為救家庭犧牲自己時，你不是在救家是增加另一需要被救的人。",
   advice:"召開家庭會議但這次不討論問題——每人說出自己能承擔的一件事和無法承擔的一件事。把所有人說的寫出，找無法承擔的重疊處，那是棟樑彎曲所在。針對重疊點討論引入外部資源——居家照護、其他家人分擔、社會補助。",
   warning:"過涉滅頂在家庭中會連鎖溺水——跳下去救一個家人，兩人一起沉，第三人再跳下來。愛無邊界時不是拯救是連鎖災難。棟橈凶最後階段是互相指責誰該為彎曲負責——在棟樑斷裂前先把彼此連結打斷。",
   timing:"能承擔與無法承擔練習每季一次，第一次尷尬但堅持完成。外部資源從討論到運作需一到三個月。連續兩季棟樑彎曲指標無改善，考慮更根本的結構調整而非繼續修補。",
   basis:["棟橈","過涉滅頂","藉用白茅","枯楊生稊","家庭親人"],
   scoreAdjust:{clarity:1,action:0,risk:2,change:1,support:3,timing:1}},

  // ── study ──
  {id:"hex-028-study",hexagramId:28,category:"study",categoryName:"學習考試",
   meaning:"學習大過以棟橈為核心警訊——學習結構超載，常因同時準備太多科目或設定不合理時間表。大過在此不是你不努力，是努力的結構注定彎曲。藉用白茅給出緩衝：在最可能崩塌那科下墊一層基礎複習，不是往前衝而是回頭鞏固底層概念。枯楊生稊是學力重生契機：讀不通時換完全不同的媒介——閱讀改看影片、聽課改動手做。枯楊生華是考前大過：基礎不穩時急著做花俏模擬考。",
   advice:"列出所有備考科目，標註掌握度、重要性、每週時間。找重要性高但掌握度低的——暫停新進度用一週只做基礎題回顧。找重要性低但時間佔比高的——那是該砍的枯楊生華，勿因已投入時間捨不得放手。",
   warning:"棟橈最典型災難是考前一個月才發現某科基礎完全沒打穩——不是沒讀是讀法錯了，一直用速成口訣跳過推導。枯楊生華在考前特別危險——花時間做精美筆記錄影片在社群分享進度，用看起來很努力迴避其實沒讀進去的焦慮。",
   timing:"學力結構檢視應在大型考前三個月第一次、考前一個月第二次。白茅式基礎回顧每科至少需一週完整時間，不可用零碎時間——基礎鞏固需連續專注。砍枯楊生華的決定需二十四小時內執行，拖延越久沉沒成本錯覺越強。",
   basis:["棟橈","藉用白茅","枯楊生稊","枯楊生華","學習考試"],
   scoreAdjust:{clarity:3,action:1,risk:1,change:1,support:0,timing:2}},

  // ── health ──
  {id:"hex-028-health",hexagramId:28,category:"health",categoryName:"身心狀態",
   meaning:"身心大過以棟橈為身體直接隱喻——脊椎、心血管、神經系統這些身體主樑正承受超負荷壓力。棟橈凶不是一夜發生，是長期姿勢不良、睡眠不足、情緒壓抑累積的結構彎曲。藉用白茅給出最溫和介入：在最脆弱環節——腰椎、胃、睡眠——每天給十五分鐘專注呵護。過涉滅頂是身心過載最終階段：已感覺不到疲憊，因身體關閉警報。本欄不做醫療診斷。",
   advice:"做全身承重掃描：躺平閉眼從頭頂慢慢往下——頭皮眉心、下顎、肩膀胸口、上下背、腹部髖部、大腿膝蓋腳底。每處停留三十秒問有無未注意的緊繃。記下所有有感處，挑最嚴重三個，每天各給五分鐘伸展或熱敷。不要求痊癒，只求今天比昨天多注意它一點。",
   warning:"過涉滅頂最危險是已習慣疼痛——肩緊變正常、靠咖啡因撐下午變正常、情緒低落變基準線。當不正常變正常，你已失去判斷何時該停的能力。棟橈凶是身體發出明確警訊後仍自行處理不就醫——省的時間在累積未來更大的病灶。",
   timing:"全身掃描每週至少一次，週末無時間壓力早晨效果最好。針對最緊繃處五分鐘照護需連續二十一天才能見初步改善。某部位四週自我照護完全無改善，須尋求專業醫療評估非繼續自行處理。",
   basis:["棟橈","棟橈凶","藉用白茅","過涉滅頂","身心狀態"],
   scoreAdjust:{clarity:1,action:-1,risk:3,change:0,support:1,timing:2}},

  // ── decision ──
  {id:"hex-028-decision",hexagramId:28,category:"decision",categoryName:"重大決策",
   meaning:"決策大過以棟隆吉為核心框架——在結構超載下，不是所有彎曲都導向崩潰，有些彎曲反能讓棟樑隆起到更穩固位置。關鍵在分辨：眼前壓力是讓你更強的建設性挑戰，還是正把你壓垮的破壞性超載。藉用白茅給出緩衝方法：不在棟樑彎曲最嚴重時做不可逆決定，先放白茅——給冷靜期、收集三個獨立意見、做可逆小規模測試。過涉滅頂是終極陷阱：投入太多，撤退比繼續更痛苦。",
   advice:"把決定放棟隆吉與棟橈凶光譜評估：列出壓力若成功克服會獲得什麼能力位置；再列壓力繼續加重三個月最先斷裂的會是什麼。兩張清單拿給不在處境中的人看，問一句：你覺得我正在彎曲還是隆起。若說彎曲須正視外部視角。",
   warning:"過涉滅頂用一句話偽裝——我都已經走到這裡了。這是所有錯誤決策萬用遮羞布：不喜歡的科系讀三年繼續讀完、虧損投資繼續加碼、不快樂的關係五年繼續拖。棟隆吉被誤判為棟橈凶時，因怕壓力放棄真正能讓你成長的挑戰。",
   timing:"棟隆吉與棟橈凶判斷至少需一週冷靜期——壓力高峰做的判斷準確率極低。外部意見需至少兩人看法一致才納入權重。連續兩次在同一問題反覆猶豫超一個月，那不是謹慎是逃避，給自己硬性截止日。",
   basis:["棟隆吉","棟橈凶","藉用白茅","過涉滅頂","重大決策"],
   scoreAdjust:{clarity:3,action:0,risk:3,change:2,support:0,timing:2}},

  // ── business ──
  {id:"hex-028-business",hexagramId:28,category:"business",categoryName:"創業經營",
   meaning:"創業大過以棟橈為精準診斷——商業模式主樑彎曲，可能是客戶集中度過高、現金流週轉惡化、核心團隊過度依賴創辦人。棟隆吉指出：在危機中重構商業模式的企業往往比未經歷大過的更強韌——彎曲過沒斷的鋼樑比全新的更能吸收震盪。藉用白茅給出危機管理智慧：在最脆弱環節用最小成本柔性方案爭取時間。枯楊生稊提醒被淘汰的舊產品線下可能正有新芽。本欄不做獲利保證。",
   advice:"做商業模式壓力測試：假設最大客戶消失、核心員工離職、銀行額度砍半——各自發生時現金流能撐多久。針對存活最短的情境本週啟動緩衝：開始接觸三個潛在客戶、培訓第二核心接手人、與另一銀行建立往來。",
   warning:"棟橈凶最經典是創辦人拒絕承認商業模式結構缺陷，把營收下滑歸咎景氣、客戶流失歸咎業務、現金流緊張歸咎會計——所有外部歸因逃避主樑本來就是歪的。枯楊生華是產品未找到市場適配就急著辦記者會拿獎擴張團隊，花開漂亮根部無養分。",
   timing:"壓力測試每季進行，營收結構變動超兩成立即重測。緩衝方案在測試後一週內啟動——超一週不行動測試只是紙上作業。枯楊生稊新方向培育需三到六個月低調實驗期，不對外宣傳不納入主要KPI。",
   basis:["棟橈","棟隆吉","藉用白茅","枯楊生稊","枯楊生華","創業經營"],
   scoreAdjust:{clarity:2,action:2,risk:3,change:3,support:-1,timing:2}},

  // ── legal ──
  {id:"hex-028-legal",hexagramId:28,category:"legal",categoryName:"官非合約",
   meaning:"法律大過以過涉滅頂為最嚴厲警告——一旦涉入爭議太深可能滅頂：訴訟費超標的本身、程序拖延讓生活停擺數年、為贏做出無法挽回的讓步。棟橈在此化為合約結構超載：簽下承諾超出履行能力的合約，或對方設了不對等責任條款。藉用白茅給出緩衝：簽約前用最仔細方式鋪墊——逐條確認、尋求第二意見、設退出機制。本欄不做法律結果判定。",
   advice:"面對法律文件做三層白茅鋪墊：請非主律師的法律專業看文件給第二意見；把最不利三條挑出書面要求對方解釋實際執行情境並留紀錄；在合約加入對你有利的退出條款如三十天前通知無理由終止。三層完成再決定簽署。",
   warning:"過涉滅頂最悲慘不是輸官司，是贏了才發現代價比輸還大——花三年打贏小額賠償，期間失去的工作機會精神健康法律費遠超判給金額。棟橈合約陷阱是對方催促下跳過審閱——這是標準合約大家都這樣簽——沒有標準合約是為保護你設計的。",
   timing:"合約審閱三層白茅至少需五個工作天——要求四十八小時內簽署的合約應視為紅旗。爭議協商窗口在正式訴訟前最寬廣，一旦開庭立場迅速硬化。法律爭議持續超一年無實質進展，應重評繼續投入的合理性。",
   basis:["過涉滅頂","棟橈","藉用白茅","枯楊生稊","官非合約"],
   scoreAdjust:{clarity:2,action:-2,risk:4,change:0,support:0,timing:2}},

  // ── spiritual ──
  {id:"hex-028-spiritual",hexagramId:28,category:"spiritual",categoryName:"心境修行",
   meaning:"修行大過以棟橈為最深刻的內在隱喻——信念系統正在彎曲。不是信仰不堅定，是精神結構承載超設計極限的重量：用修行逃避現實、用靈性概念合理化不作為、把責任推給宇宙業力。藉用白茅給出修行緩衝：在最動搖的信念下鋪最柔軟的自我接納——允許懷疑、允許不知道、允許此刻不夠好。過涉滅頂是修行者溺水：追求開悟到忘記自己還是人，需要吃飯睡覺被愛。",
   advice:"做信念棟橈檢測：寫下最核心五個信念——關於自己、他人、世界、意義、死亡。每個旁誠實答：這信念是我活出來的還是別人告訴我而接受的。圈出別人告訴我的，針對每個問：若暫放這信念三十天，害怕發生什麼。那個害怕才是真正該面對的功課。",
   warning:"過涉滅頂最常見是靈性繞道——用冥想逃避處理創傷、用一切都是最好的安排跳過該做的道歉、用無我合理化不設界線。棟橈凶修行版是信仰崩塌時不是重建更真實的信念，是找更極端教條填補真空——從一極端跳另一極端，棟樑沒修只是換了更脆的材質。",
   timing:"信念檢測應在人生重大轉折時進行——失業離婚重病至親過世——舊信念最易露裂痕。三十天信念放下實驗期間不告訴任何人，避免修行變表演。若放下後沒發生害怕的後果，舊棟樑已完成任務，讓枯楊生稊新芽開始生長。",
   basis:["棟橈","過涉滅頂","藉用白茅","枯楊生稊","枯楊生華","心境修行"],
   scoreAdjust:{clarity:2,action:-2,risk:0,change:2,support:1,timing:2}},
];

// ════════════════════════════════════════════════════════════════════
// VALIDATION & MERGE
// ════════════════════════════════════════════════════════════════════

const ALL = [...H27, ...H28].map(e => Object.assign({}, e, META));

function fail(msg) { console.error('\n' + msg); process.exit(1); }

// 1. Length assertions
for (const e of ALL) {
  const m=e.meaning.length, a=e.advice.length, w=e.warning.length, t=e.timing.length;
  if (m<120||m>190) fail(`${e.id} meaning=${m} (need 120-190)`);
  if (a<100||a>160) fail(`${e.id} advice=${a} (need 100-160)`);
  if (w<80||w>125) fail(`${e.id} warning=${w} (need 80-125)`);
  if (t<60||t>105) fail(`${e.id} timing=${t} (need 60-105)`);
}
console.log('[PASS] All length assertions');

// 2. Basis >= 4 hex imagery
for (const e of ALL) {
  const catNames = CATEGORIES.map(c => c[1]);
  const imgs = e.basis.filter(b => !catNames.includes(b));
  if (imgs.length < 4) fail(`${e.id} basis hex-imagery count=${imgs.length} (need >=4): ${imgs}`);
}
console.log('[PASS] All basis imagery count >= 4');

// 3. ScoreAdjust has all 6 dims
for (const e of ALL) {
  for (const d of ['clarity','action','risk','change','support','timing']) {
    if (!(d in e.scoreAdjust)) fail(`${e.id} scoreAdjust missing ${d}`);
  }
}
console.log('[PASS] All scoreAdjust dimensions present');

// 4. Meta
for (const e of ALL) {
  if (e.qualityLevel !== 'refined') fail(`${e.id} qualityLevel=${e.qualityLevel}`);
  if (e.reviewed !== false) fail(`${e.id} reviewed=${e.reviewed}`);
  if (e.needsHumanReview !== true) fail(`${e.id} needsHumanReview=${e.needsHumanReview}`);
}
console.log('[PASS] All meta assertions');

// 5. 12 categories each
for (const hid of [27, 28]) {
  const hexE = ALL.filter(e => e.hexagramId === hid);
  const cats = hexE.map(e => e.category).sort();
  const exp = CATEGORIES.map(c => c[0]).sort();
  if (cats.join(',') !== exp.join(',')) fail(`Hex ${hid} categories mismatch: ${cats} vs ${exp}`);
  if (hexE.length !== 12) fail(`Hex ${hid} count=${hexE.length}`);
}
console.log('[PASS] All 12 categories per hex');

// 6. Disclaimers
for (const e of ALL) {
  if (e.category==='health' && !e.meaning.includes('本欄不做醫療診斷')) fail(`${e.id} missing health disclaimer`);
  if (e.category==='business' && !e.meaning.includes('本欄不做獲利保證')) fail(`${e.id} missing business disclaimer`);
  if (e.category==='legal' && !e.meaning.includes('本欄不做法律結果判定')) fail(`${e.id} missing legal disclaimer`);
}
console.log('[PASS] All disclaimers present');

// 7. Prohibited patterns
const PROHIB = ['最基礎的準備最重要','不要跳過基本功','兩股力量需要平衡','保持彈性並等待時機','不要太快也不要太慢','先觀察再決定','目前仍有調整空間','這是一個需要耐心的階段','需要在行動與等待之間找到平衡','此分類最常見的誤判','養正慎言'];
for (const e of ALL) {
  const txt = e.meaning + e.advice + e.warning + e.timing;
  for (const p of PROHIB) if (txt.includes(p)) fail(`${e.id} contains prohibited: "${p}"`);
}
console.log('[PASS] No prohibited patterns');

// Print lengths
console.log('\n--- Length details ---');
for (const e of ALL) {
  console.log(`  ${e.id}: m=${e.meaning.length} a=${e.advice.length} w=${e.warning.length} t=${e.timing.length} basis=${e.basis.length}`);
}

// ════════════════════════════════════════════════════════════════════
// LOAD, MERGE, WRITE
// ════════════════════════════════════════════════════════════════════

console.log('\n=== All assertions PASSED. Writing data file... ===\n');

const rawCode = fs.readFileSync(DATA_FILE, 'utf8');
global.window = {};
vm.runInThisContext(rawCode);
const existing = global.window.Zero1MatrixData.categoryInterpretations;
console.log(`Loaded existing: ${existing.length} entries.`);

const newMap = new Map(ALL.map(e => [e.id, e]));
const merged = existing.map(entry => newMap.get(entry.id) || entry);
const replaced = merged.filter((e, i) => e !== existing[i]).length;
console.log(`Replaced ${replaced} entries.`);

const output = 'window.Zero1MatrixData = window.Zero1MatrixData || {};\nwindow.Zero1MatrixData.categoryInterpretations = ' + JSON.stringify(merged) + ';';
fs.writeFileSync(DATA_FILE, output, 'utf8');
console.log(`Written: ${DATA_FILE}`);

// ════════════════════════════════════════════════════════════════════
// VERIFY
// ════════════════════════════════════════════════════════════════════

const { execSync } = require('child_process');
try {
  execSync(`"${NODE_EXE}" --check "${DATA_FILE}"`, { encoding: 'utf8', stdio: 'pipe' });
  console.log('node --check: PASSED');
} catch (err) {
  console.error('node --check: FAILED\n' + (err.stderr || err.message));
  process.exit(1);
}

delete global.window;
global.window = {};
vm.runInThisContext(fs.readFileSync(DATA_FILE, 'utf8'));
const vrf = global.window.Zero1MatrixData.categoryInterpretations;
const v27 = vrf.filter(e => e.hexagramId === 27);
const v28 = vrf.filter(e => e.hexagramId === 28);
console.log(`Verify reload: hex27=${v27.length} hex28=${v28.length} total=${vrf.length}`);

// Final re-check
for (const e of [...v27, ...v28]) {
  if (e.meaning.length < 120 || e.meaning.length > 190) fail(`Post-write: ${e.id} meaning=${e.meaning.length}`);
  if (e.advice.length < 100 || e.advice.length > 160) fail(`Post-write: ${e.id} advice=${e.advice.length}`);
  if (e.warning.length < 80  || e.warning.length > 125) fail(`Post-write: ${e.id} warning=${e.warning.length}`);
  if (e.timing.length < 60  || e.timing.length > 105) fail(`Post-write: ${e.id} timing=${e.timing.length}`);
}

console.log('\n=== wA_cat_27_28.js completed successfully ===');