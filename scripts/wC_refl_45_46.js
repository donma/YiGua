'use strict';
/**
 * wC_refl_45_46.js — Generate 72 TRULY DISTINCT reflection questions
 * for Hex 45 (萃) and Hex 46 (升), 36 per hexagram × 3 per category.
 * Writes to src/data/reflectionQuestions.data.js with all mandatory checks.
 *
 * MANDATORY before writeFileSync:
 *   1) ALL 72 questions 38-105 chars, end with ？
 *   2) normU per hex >= 32/36. Fix if fail, do NOT write until BOTH pass.
 *
 * Q1=state, Q2=choice(compare 2 options with 還是), Q3=risk/boundary/timing.
 */
const vm = require('vm');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'src', 'data', 'reflectionQuestions.data.js');
const NODE_EXE = path.join(__dirname, '..', '.nodejs', 'node-v22.14.0-win-x64', 'node.exe');

// ============================================================================
// CATEGORIES
// ============================================================================
const CATEGORY_NAMES = {
  general: '一般',
  career: '工作事業',
  love: '感情關係',
  money: '財務金錢',
  people: '人際合作',
  family: '家庭親人',
  study: '學習考試',
  health: '身心狀態',
  decision: '重大決策',
  business: '創業經營',
  legal: '官非合約',
  spiritual: '心境修行',
};
const CATEGORIES = Object.keys(CATEGORY_NAMES);

// ============================================================================
// HEX 45 萃 (澤地萃) — Gathering, congregation, convergence, collective strength
// Imagery per category:
//   general: 澤上於地, 引吉, 萃有位
//   career: 萃有位, 有孚不終乃亂乃萃, 引吉
//   love: 萃如嗟如, 齎咨涕洟, 引吉
//   money: 有孚不終乃亂乃萃, 萃有位, 引吉
//   people: 引吉, 萃如嗟如, 大吉無咎
//   family: 齎咨涕洟, 萃有位, 有孚不終乃亂乃萃
//   study: 澤上於地, 引吉, 萃如嗟如
//   health: 萃如嗟如, 齎咨涕洟, 澤上於地
//   decision: 有孚不終乃亂乃萃, 大吉無咎, 萃有位
//   business: 澤上於地, 引吉, 萃有位
//   legal: 有孚不終乃亂乃萃, 引吉, 齎咨涕洟
//   spiritual: 澤上於地, 萃如嗟如, 引吉
// ============================================================================
const HEX45 = {
  hexagramId: 45,
  hexagramName: '萃',
  gua: '澤地萃',
  questions: {
    general: [
      '澤上於地的萃卦象徵水澤匯聚於大地之上萬物叢生——你目前的生活狀態是各方資源正自然流向你身邊的豐沛匯聚期，還是仍在努力開渠引水資源尚未到達身邊？',
      '引吉的引導之力與萃有位的堅守本位看似矛盾：你是選擇主動出擊把資源引導到自己手中搶佔有利位置，還是先守好已有領域等待資源自然流向你所在的區位？',
      '澤上於地雖然象徵匯聚但水過多則成澇，哪個具體領域的資源若持續湧入超過你處理能力的上限，就會從滋養變成淹沒讓你失去整合的節奏與方向？'
    ],
    career: [
      '萃有位提醒在職場中位置本身就代表著匯聚資源的能力——你目前在組織中的位置是能自然吸引人脈與機會的核心節點，還是仍在邊緣努力尋找進入核心匯聚圈的通道？',
      '有孚不終乃亂乃萃警告誠信若無法持續則聚集起來的團隊將走向混亂：你是選擇先把現有團隊的信任基礎加固讓每個人感受到誠意，還是繼續擴大團隊規模追求數量上的聚集效應？',
      '引吉說明需要貴人或關鍵機會的牽引才能突破，你在職場中已經等待了多久仍未有明確的引導力量出現，到了什麼時間點就該主動更換賽道而非繼續等待被看見？'
    ],
    love: [
      '萃如嗟如描繪在匯聚的過程中卻充滿嘆息與不安——你目前的感情狀態是關係在深入匯聚的過程裡產生了真實的磨合焦慮，還是聚在一起卻始終找不到心靈匯合點的疏離？',
      '齎咨涕洟表達情感匯聚到極致時的涕淚悲泣與真情流露：你是選擇放下防備讓對方看見你情感中最脆弱的那一面以換取深度連結，還是繼續維持表面的從容避免顯露真實情緒？',
      '引吉在感情中暗示需要某種契機來引導關係升級，哪個關鍵話題如果一直被你們迴避不談超過某個時間長度，就會讓關係的匯聚停滯在表面階段永遠無法走向真正的深度？'
    ],
    money: [
      '有孚不終乃亂乃萃在財務中意味著若誠信缺失資金匯聚將反噬——你目前的財務組合中各個資金來源之間是否存在相互矛盾的配置邏輯導致看似匯聚實則混亂？',
      '萃有位要求資金應該匯聚在最有優勢的配置位置：你是選擇把資金集中配置在最熟悉且回報穩定的單一方向以加深優勢，還是分散到多個不同領域避免單點風險？',
      '引吉提醒資金的匯聚需要正確的市場方向來牽引，你在某個持續虧損的部位上堅持了多久，累積虧損達到本金多少比例就代表引導方向已錯必須斷然退出？'
    ],
    people: [
      '引吉在人際關係中強調需要正確的引導才能把人群匯聚成有效網絡——你目前的人脈圈是已有明確的核心人物或平台在牽引著各方資源向你匯聚，還是各自為政缺乏有效的匯聚節點？',
      '萃如嗟如反映聚會中可能出現的失落與疏離感：你是選擇在群體中坦誠表達自己感到格格不入的真實狀態以尋求真正理解，還是繼續強顏歡笑維持表面的和諧氛圍？',
      '大吉無咎警示即便大吉的局面若缺乏敬畏也可能轉為有咎，哪種過度依賴核心人脈而忽略自身能力建設的行為模式，一旦核心人物離場就會讓你辛苦建立的匯聚網絡瞬間崩塌？'
    ],
    family: [
      '齎咨涕洟描繪家庭聚會中可能出現的情感洪流與深層悲喜交織——你目前的家庭氛圍是正處於久別重逢或重要節日帶來的濃烈情感匯聚期，還是長期缺乏真實情感交流的客氣表象？',
      '萃有位在家庭中強調每個人需要找到自己在家庭中的位置與角色：你是選擇先釐清自己在家中的核心責任並承擔起來成為穩定的支柱，還是等家庭出現具體問題時再被動地承擔角色？',
      '有孚不終乃亂乃萃警告家庭成員之間的誠信若無法持續整個家庭結構將走向混亂，哪種反覆出現的失信行為若再發生一次，就會讓家庭成員之間最基本的信任基礎徹底瓦解？'
    ],
    study: [
      '澤上於地在學習中象徵知識如水澤般匯聚在大地之上——你目前的知識體系是各方學問已自然交融形成一個有機整體的階段，還是各領域知識仍然散落各處尚未找到整合的框架？',
      '引吉強調需要正確的學習方向與方法來引導知識的匯聚：你是選擇跟隨一位能引導你建立系統化知識架構的導師或課程，還是自己摸索從大量碎片化資訊中嘗試歸納整合？',
      '萃如嗟如在學習中反映知識累積到一定階段後產生的困惑與瓶頸，哪個核心基礎科目如果繼續被你用表面理解的方式跳過，就會成為後續所有進階知識無法有效匯聚的根本障礙？'
    ],
    health: [
      '萃如嗟如在健康中象徵身體能量匯聚的過程裡出現的疲態與不適——你目前的身心狀態是能量正集中投入某個重要領域導致其他面向出現匱乏訊號，還是整體能量都處於低迷難以有效匯聚？',
      '齎咨涕洟提醒過度的情緒波動與壓力累積會對身體產生實質傷害：你是選擇建立定期的情緒釋放機制比如運動或書寫來疏導壓力，還是繼續把壓力壓在心底直到身體發出明確的疼痛或失調警訊？',
      '澤上於地說明身體的各種訊號會匯聚成整體的健康圖像，哪種持續超過兩週的身體不適若仍被你用忽視的方式對待，就會從可自行恢復的小問題發展成需要專業醫療介入的慢性隱患？'
    ],
    decision: [
      '有孚不終乃亂乃萃在決策中強調若初心動搖則所有選項的優劣將陷入混亂——你目前面臨的這個決定是否仍與你最初的核心意圖保持一致，還是在過程中已被各方意見拉扯到偏離了初衷？',
      '大吉無咎提醒即便看似大吉的選項仍需檢視是否存在隱藏代價：你是選擇深入挖掘每個看似的機會背後可能被忽略的風險與附帶條件，還是先抓住眼前的大吉之勢之後再應對問題？',
      '萃有位說明每個決策都需要找到最適合自己的定位與切入點，你在什麼情況下會意識到自己一直在模仿別人的選擇路徑而非根據自身實際資源條件做出真正適合自己的決策？'
    ],
    business: [
      '澤上於地在創業中象徵市場資源如水澤般匯聚於穩固的商業基礎之上——你目前的商業基礎是穩固到足以承載更多資源匯入的階段，還是基礎尚在搖晃卻急於吸引更多資源導致結構風險倍增？',
      '引吉強調商業模式需要正確的市場牽引力來實現資源匯聚：你是選擇把有限資源集中投入到已被驗證有牽引力的核心業務上，還是分散嘗試多個方向期待其中一個自然引爆匯聚效應？',
      '萃有位提醒每個企業必須在市場中找到自己不可替代的生態位置，哪條業務線一旦發現已經完全可被競爭對手替代且無任何差異化優勢，就該果斷收縮而非繼續消耗稀缺資源？'
    ],
    legal: [
      '有孚不終乃亂乃萃在法律事務中警告誠信一旦無法自始至終維持所有證據鏈與主張將陷入混亂——你目前的案件或合約中是否存在前後矛盾的陳述或文件漏洞足以被對方徹底推翻？',
      '引吉強調在法律程序中找到對你有利的引導性證據或程序優勢：你是選擇投入資源深入挖掘可能被你忽略但極具牽引力的關鍵證據線索，還是依賴現有資料維持目前的被動應對策略？',
      '齎咨涕洟提醒法律紛爭中的情緒消耗不容小覷，哪個程序階段一旦通過而你仍未做好充分的情緒與資源準備，就會在後續漫長的訴訟過程中陷入體力與財力的雙重枯竭？'
    ],
    spiritual: [
      '澤上於地在靈性修行中象徵所有智慧最終匯聚於踏實的生命土壤——你目前的內在修行是已有清晰的核心信念體系讓各方領悟自然匯聚歸一，還是仍在不同門派與方法之間來回搖擺？',
      '萃如嗟如在修行中反映深入匯聚時可能出現的孤獨感與自我懷疑：你是選擇接受這份孤獨作為深入修行必經的階段繼續向內探索，還是向外尋求更多同修或社群的支持來緩解不安？',
      '引吉提醒靈性成長需要某個關鍵的契機或引導來突破瓶頸，哪種長期重複卻無法帶來實質成長的修行模式若繼續維持，就會讓你的內在探索停滯在自我安慰而非真正的突破？'
    ],
  },
};

// ============================================================================
// HEX 46 升 (地風升) — Rising, ascending, gradual elevation, organic growth
// Imagery per category:
//   general: 地中生木, 允升大吉, 貞吉升階
//   career: 允升大吉, 升虛邑, 貞吉升階
//   love: 孚乃利用禴, 冥升, 允升大吉
//   money: 升虛邑, 冥升, 貞吉升階
//   people: 允升大吉, 王用亨于岐山, 升虛邑
//   family: 貞吉升階, 冥升, 允升大吉
//   study: 地中生木, 允升大吉, 升虛邑
//   health: 冥升, 地中生木, 孚乃利用禴
//   decision: 冥升, 升虛邑, 允升大吉
//   business: 地中生木, 允升大吉, 王用亨于岐山
//   legal: 貞吉升階, 允升大吉, 升虛邑
//   spiritual: 地中生木, 王用亨于岐山, 孚乃利用禴
// ============================================================================
const HEX46 = {
  hexagramId: 46,
  hexagramName: '升',
  gua: '地風升',
  questions: {
    general: [
      '地中生木的升卦象徵樹木從土地中順應自然節奏向上生長——你目前的成長狀態是如春筍般順勢而升的穩健節奏，還是感覺根基尚淺卻被外力強行拔高導致搖晃不穩？',
      '允升大吉代表得到認可後的順勢晉升與貞吉升階的腳踏實地逐級攀升：你是選擇先獲得關鍵人物的正式認可後再啟動躍升計劃，還是堅持一步一腳印地積累每級實力不求速成？',
      '地中生木提醒樹木的向上高度取決於根系的深度，哪個基礎能力若繼續被你跳過而只追求表面的高度成長，就會在某個高度之後因為根基不足而無法繼續支撐向上攀升？'
    ],
    career: [
      '允升大吉描繪在職場中獲得認可與信任後的順勢晉升——你目前的工作表現是已被上級或市場明確認可正處於上升通道中，還是仍在等待第一次關鍵性的肯定來打開晉升之門？',
      '升虛邑象徵晉升到一個新的但空曠尚未建制的領域：你是選擇接受這個升虛邑般的機會先佔住新的高度再從零開始搭建體系，還是寧可留在現有安穩位置等待更成熟的晉升機會？',
      '貞吉升階強調每級晉升都需要穩固的基礎而非跳級躍升，你為了追求速度而跳過了一個能力積累階段後，到了第幾個關鍵項目仍無法獨立駕馭時就該承認跨越的台階尚未真正踏實？'
    ],
    love: [
      '孚乃利用禴說明真誠的心意比豐盛的物質更能推動關係向上升級——你目前在感情中的付出是以真誠的日常關懷來滋養關係，還是傾向於用物質與排場來表達但缺乏心靈的深度連結？',
      '冥升警示在感情中不知不覺地陷入盲目的向上追逐卻忘了停下檢視方向：你是選擇定期坐下來與對方檢視關係的成長方向是否仍符合雙方的真實期待，還是任由關係隨慣性自動上升直到某天發現已經偏離？',
      '允升大吉在感情中代表關係獲得雙方認可後的穩定升級，哪個關鍵的承諾或里程碑如果一直沒有被正式確認，就會讓你們的關係停留在模糊地帶無法真正進入下一個階段？'
    ],
    money: [
      '升虛邑象徵資金投入到一個前景廣闊但尚未被開墾的領域——你目前的資產配置中是否存在流向看似有巨大成長空間但實際尚未產生任何回報的空曠領域？',
      '冥升在財務中警告不知不覺的資產膨脹可能帶來盲目的樂觀：你是選擇定期重新評估每項資產的真實回報率剔除那些只是名義上升但實質虧損的部位，還是繼續看著總額增加就感到安心？',
      '貞吉升階強調財務成長應該是一階一階穩固攀升而非跳躍式暴富，你在沒有建立足夠風險緩衝的情況下追求高報酬投資，本金虧損到什麼比例就該回到最基本的儲蓄與穩健配置？'
    ],
    people: [
      '允升大吉在人際中意味著獲得他人真心認可後關係自然升級——你目前的人際網絡是已有核心群體對你產生由衷的信任與推薦讓你的影響力自然上升，還是仍在努力證明自己以獲取第一層的基本認可？',
      '王用亨于岐山描繪君王在岐山祭祀以凝聚人心向上——你是選擇先建立一個能凝聚眾人的核心願景或價值主張讓志同道合者自然匯聚，還是逐一維繫個別關係期待量變引起質變？',
      '升虛邑提醒人脈網絡擴張後可能出現空有名單而無實質連結的虛胖現象，你在社交網絡快速擴張的過程中到了什麼規模就該停下來檢視真正有意義的深度連結佔比是否過低？'
    ],
    family: [
      '貞吉升階在家庭中強調家庭關係的提升需要一步一階的積累而非跳躍——你目前的家庭關係是正處於穩定地逐級改善的上升趨勢中，還是因某次重大事件後試圖跳躍式修復卻發現基礎不穩？',
      '冥升警告家庭成員可能在不知不覺中各自向不同方向成長而漸行漸遠：你是選擇定期安排家庭時間讓每個人的成長方向保持互相理解與同步，還是各自忙各自的直到某天發現彼此已完全陌生？',
      '允升大吉代表家庭獲得共同認可後的整體向上，哪個長期被你們全家迴避的核心矛盾若繼續不被正式面對與解決，就會讓所有表面的家庭和諧都建立在沙地上隨時可能崩塌？'
    ],
    study: [
      '地中生木在學習中象徵知識如樹木般從基礎土壤中自然向上生長——你目前的學習方式是有穩固的基礎知識作為土壤支撐著新知識的向上延伸，還是基礎漏洞百出卻急於學習高階內容？',
      '允升大吉代表學習獲得認可後的信心提升：你是選擇先通過一次正式的檢定或實作來獲得對自身能力的客觀認可從而建立信心，還是直接挑戰更高難度的內容以跳過檢定的壓力？',
      '升虛邑提醒進入一個全新的知識領域時會面臨空曠無依的階段，你在進入新領域學習後到了多久仍無法建立基本的概念地圖時，就該回頭重新檢視學習方法而非繼續盲目堆積資訊？'
    ],
    health: [
      '冥升在健康中警告身體的某些指標可能在不知不覺中悄悄攀升——你最近是否有定期追蹤的血壓、體重或體脂數據，還是完全憑感覺判斷自己的身體狀態卻忽略了沉默的數字警訊？',
      '地中生木提醒身體的康復如樹木生長需要時間與耐心不能強行拔高：你是選擇接受身體需要循序漸進的恢復節奏不因進度慢而焦慮，還是急於看到效果而過度訓練或依賴速效手段？',
      '孚乃利用禴強調真誠的日常養生遠比昂貴的保健品更重要，哪種你明知有害卻長期以誠意不足的藉口持續的生活習慣，已經累積到了再不改變就會產生不可逆健康損害的程度？'
    ],
    decision: [
      '冥升在決策中警告你可能在不知不覺中已被環境推著向某個方向上升而失去了主動判斷——你目前正在推進的這個決定，是你清醒選擇的結果還是因為大家都在做所以你也跟著做的慣性上升？',
      '升虛邑象徵選擇進入一個充滿潛力但當前空無一物的領域：你是選擇承擔這份不確定性先進入佔據位置再逐步建設，還是等待這個領域出現更多成功案例證明可行性後再跟進？',
      '允升大吉要求決策必須獲得關鍵資訊或關鍵人物的認可才能確保方向正確，你在沒有經過任何外部客觀驗證的情況下做了多少次重大決定後，就該意識到自己的判斷需要一個校準機制？'
    ],
    business: [
      '地中生木在創業中象徵商業模式必須如樹木般從穩固的市場土壤中自然生長——你目前的商業根基是建立在真實的客戶需求土壤之上，還是建立在融資與概念之上缺乏實際市場的滋養？',
      '允升大吉代表商業模式獲得市場認可後的順勢增長：你是選擇先把資源集中在讓核心客戶成為自發推薦的傳播節點以實現口碑式的自然上升，還是投入大量行銷預算追求短期數據的快速攀升？',
      '王用亨于岐山描繪企業領導者需要建立一個能凝聚團隊與客戶的核心理念，哪個核心價值如果連你自己都無法清晰表達或身體力行，就會讓整個組織在上升過程中失去方向感而內部瓦解？'
    ],
    legal: [
      '貞吉升階在法律事務中強調程序的正確推進需要一階一階穩固進行——你目前的案件或合約推進是按正規程序逐級處理還是試圖跳過某些環節以求快速升到有利位置？',
      '允升大吉提醒在法律程序中獲得關鍵證據或權威意見的認可至關重要：你是選擇先尋求專業法律意見獲得對案件方向的客觀評估後再決定策略，還是憑自己的理解直接推進程序？',
      '升虛邑警示在法律事務中若基礎不穩就急於上升到更高的訴訟層級可能適得其反，你在證據鏈尚未完整建立的情況下推進到哪個程序階段，就會發現自己站在一個空無支撐的高處隨時可能跌落？'
    ],
    spiritual: [
      '地中生木在修行中象徵靈性的提升必須如樹木般從內在的土壤中自然生長——你目前的內在成長是發自內心的真實提升還是為了符合某種外在期待而表演出來的修行姿態？',
      '王用亨于岐山描繪以虔誠之心在山巔祭祀象徵靈性需要一個高遠而專注的錨點：你是選擇建立一個固定而真誠的日常修行儀式作為靈性上升的基石，還是偶爾有感觸時才進行深度的內在探索？',
      '孚乃利用禴強調真誠的內在修為遠比外在形式重要，哪種你持續進行卻心不在焉的修行形式如果繼續維持，就會讓你的靈性成長淪為一種自我安慰的慣性動作而毫無實質提升？'
    ],
  },
};

// ============================================================================
// BUILD ENTRIES
// ============================================================================
function buildEntries(hex) {
  const entries = [];
  for (const category of CATEGORIES) {
    const trio = hex.questions[category];
    if (!trio || trio.length !== 3) {
      throw new Error(`Missing/invalid trio for hex ${hex.hexagramId} category ${category}`);
    }
    trio.forEach((question, idx) => {
      entries.push({
        id: `rf-${String(hex.hexagramId).padStart(3, '0')}-${category}-${idx + 1}`,
        hexagramId: hex.hexagramId,
        hexagramName: hex.hexagramName,
        category,
        categoryName: CATEGORY_NAMES[category],
        question,
        basis: [hex.hexagramName, hex.gua, CATEGORY_NAMES[category]],
        qualityLevel: 'refined',
        reviewed: false,
        reviewedBy: 'reflection-wC-refl-45-46',
        reviewedAt: '2026-07-13',
        needsHumanReview: true,
        version: '1.8.0-waveC-hex45-46',
      });
    });
  }
  return entries;
}

const newEntries45 = buildEntries(HEX45);
const newEntries46 = buildEntries(HEX46);
const allNewEntries = [...newEntries45, ...newEntries46];

console.log(`Generated ${newEntries45.length} entries for hex 45 + ${newEntries46.length} entries for hex 46 = ${allNewEntries.length} total.`);

// ============================================================================
// CHECK 1: Total count = 72
// ============================================================================
if (allNewEntries.length !== 72) {
  console.error(`COUNT ERROR: expected 72, got ${allNewEntries.length}`);
  process.exit(1);
}
console.log('CHECK 1 PASSED: 72 total entries.');

// ============================================================================
// CHECK 2: Length 38-105 and ends with ？
// ============================================================================
console.log('\n=== LENGTH & FORMAT CHECK ===');
let lengthFailures = 0;
for (const entry of allNewEntries) {
  const q = entry.question;
  const len = q.length;
  if (len < 38 || len > 105) {
    console.error(`  FAIL: ${entry.id} length=${len}`);
    lengthFailures++;
  }
  if (!q.endsWith('？')) {
    console.error(`  FAIL: ${entry.id} does not end with ？`);
    lengthFailures++;
  }
  // Q2 must have 還是
  if (entry.id.endsWith('-2') && !q.includes('還是')) {
    console.error(`  FAIL: ${entry.id} Q2 missing 還是`);
    lengthFailures++;
  }
}
if (lengthFailures > 0) {
  console.error(`\n${lengthFailures} length/format failures — ABORTING`);
  process.exit(1);
}
console.log(`  All ${allNewEntries.length} entries pass length (38-105), trailing ？, and Q2 還是 checks.`);

// ============================================================================
// CHECK 3: Question type markers — Q1=state, Q2=choice, Q3=risk/boundary
// ============================================================================
console.log('\n=== QUESTION TYPE MARKER CHECK ===');
const stateMarkers = ['狀態', '處於', '階段', '是否', '目前', '當前', '此刻', '還在', '還記得', '已'];
const riskMarkers = ['何時', '多少天', '多久', '幾個月', '哪個階段', '多少個', '第幾個', '第幾次', '界限', '邊界', '風險', '止損', '退出', '緩衝', '時機', '窗口', '何種', '多少次', '什麼深度', '什麼程度', '天內', '底線', '比例', '層次', '層面', '環節', '訊號', '信號', '工作日', '轉折點', '哪種', '哪條', '哪道', '哪個時間', '哪個程序', '什麼期限', '多久', '哪個', '什麼時候', '什麼情況下', '到了什麼', '到了多久', '到了第幾'];
let markerFailures = 0;
for (const entry of allNewEntries) {
  if (entry.id.endsWith('-1')) {
    if (!stateMarkers.some(m => entry.question.includes(m))) {
      console.error(`  FAIL: ${entry.id} Q1 missing state marker`);
      markerFailures++;
    }
  }
  if (entry.id.endsWith('-3')) {
    if (!riskMarkers.some(m => entry.question.includes(m))) {
      console.error(`  FAIL: ${entry.id} Q3 missing risk/boundary marker`);
      markerFailures++;
    }
  }
}
if (markerFailures > 0) {
  console.error(`\n${markerFailures} marker failures — ABORTING`);
  process.exit(1);
}
console.log(`  All Q1/Q3 markers verified.`);

// ============================================================================
// CHECK 4: NORMALIZED UNIQUENESS — The critical check
// ============================================================================
console.log('\n=== NORMALIZED UNIQUENESS CHECK ===');

// Imagery/core terms to strip (longest first)
const ALL_IMAGERY_45 = [
  '有孚不終乃亂乃萃', '澤上於地', '萃如嗟如', '齎咨涕洟',
  '萃有位', '大吉無咎', '引吉', '澤地萃', '萃',
];
const ALL_IMAGERY_46 = [
  '王用亨于岐山', '孚乃利用禴', '地中生木', '貞吉升階',
  '允升大吉', '升虛邑', '冥升', '地風升', '升',
];
const ALL_IMAGERY = [...ALL_IMAGERY_45, ...ALL_IMAGERY_46].sort((a, b) => b.length - a.length);

const COMMON_WORDS = new Set([
  '的', '你', '我', '他', '她', '是', '在', '了', '有', '不', '這', '那', '著',
  '也', '都', '就', '會', '要', '能', '可以', '一個', '一種', '一些', '什麼',
  '目前', '當前', '此刻', '選擇', '狀態', '是否', '還是', '或者', '已經', '還是',
  '自己', '對方', '這個', '那個', '需要', '應該', '如果', '因為', '所以',
  '沒有', '可能', '覺得', '認為', '知道', '了解', '理解',
  '進行', '使用', '透過', '經過', '來自', '對於', '關於', '這樣', '那樣',
  '之間', '之中', '之後', '之前', '裡面', '外面', '時候', '什麼時候',
  '多少', '如何', '為什麼', '怎麼', '哪裡', '哪個', '怎樣', '做', '讓',
  '把', '被', '從', '對', '向', '到', '給', '和', '與', '或', '而', '但',
  '卻', '才', '便', '還', '又', '再', '更', '最', '很', '太', '非常',
  '比較', '相當', '特別', '完全', '根本', '確實', '也', '也許', '大概', '一定',
  '必須', '當然', '終於', '曾經', '正在', '將會',
  '繼續', '開始', '結束', '完成', '實現', '發生', '出現', '存在', '變化',
  '改變', '發展', '成長', '進步', '改善', '提升', '降低', '增加', '減少',
  '機會', '問題', '方式', '方法', '方向', '目標', '結果', '過程', '關係',
  '影響', '作用', '功能', '意義', '價值', '基礎', '條件', '情況', '環境',
  '資源', '能力', '經驗', '知識', '技能', '態度', '觀念', '想法', '感受',
  '情緒', '心理', '行為', '習慣', '模式', '結構', '系統', '機制', '節奏',
  '時機', '時間', '空間', '壓力', '風險', '挑戰', '困難', '限制', '障礙',
  '平衡', '穩定', '持續', '長期', '短期', '正面', '負面', '積極', '消極',
  '主動', '被動', '明顯', '清楚', '模糊', '確定', '不確定', '安全', '危險',
  '成功', '失敗', '得失', '決定', '判斷', '評估', '分析', '考慮',
  '思考', '反思', '檢視', '觀察', '注意', '重視', '忽略', '堅持', '放棄',
  '接受', '拒絕', '面對', '逃避', '追求', '避開', '投入', '退出', '進入',
  '離開', '保持', '調整', '適應', '突破', '建立', '破壞', '維護',
  '修復', '創造', '消滅', '擴大', '縮小', '深入', '快', '慢',
  '多', '少', '大', '小', '高', '低', '強', '弱', '深', '淺', '遠', '近',
  '新', '舊', '好', '壞', '對', '錯', '真', '假', '實', '虛', '內', '外',
  '上', '下', '前', '後', '左', '右', '整體', '局部', '全局', '細節',
  '核心', '邊緣', '中心', '周圍', '生命', '生活', '工作', '學習', '健康',
  '愛情', '金錢', '家庭', '朋友', '社交', '事業', '商業', '法律', '心靈',
  '精神', '身體', '心理', '靈魂', '內心', '外在', '內在',
  '現在', '還', '嘛', '呢', '嗎', '喔', '哦', '吶', '啊', '吧', '呀',
  '是否還', '究竟是', '而且', '因此', '但是', '然後', '所以',
]);

function normalize(str) {
  let s = str;
  // strip hex names
  s = s.split('萃').join('').split('升').join('').split('澤地').join('').split('地風').join('');
  // strip imagery terms (longest first)
  for (const t of ALL_IMAGERY) s = s.split(t).join('');
  // strip category names
  for (const c of Object.values(CATEGORY_NAMES)) s = s.split(c).join('');
  // strip punctuation and whitespace
  s = s.replace(/[，。？！、：；「」『』（）…—\-—\s]/g, '');
  // strip common words
  const segments = [];
  let current = '';
  for (const ch of s) {
    current += ch;
    let matched = false;
    for (const cw of COMMON_WORDS) {
      if (current.endsWith(cw) && current.length >= cw.length) {
        const before = current.slice(0, -cw.length);
        if (before) segments.push(before);
        current = '';
        matched = true;
        break;
      }
    }
    if (matched) continue;
  }
  if (current) segments.push(current);
  return segments.join('');
}

function checkUniqueness(entries, hexLabel) {
  const normed = entries.map(e => ({ id: e.id, norm: normalize(e.question) }));
  const seen = new Map();
  normed.forEach(({ id, norm }) => {
    if (!seen.has(norm)) seen.set(norm, []);
    seen.get(norm).push(id);
  });
  let uniqueCount = 0;
  const dupGroups = [];
  for (const [norm, ids] of seen.entries()) {
    if (ids.length === 1) {
      uniqueCount++;
    } else {
      dupGroups.push(ids);
    }
  }
  return { total: entries.length, uniqueCount, dupGroups };
}

const uniq45 = checkUniqueness(newEntries45, 'Hex45');
const uniq46 = checkUniqueness(newEntries46, 'Hex46');
const uniqBoth = checkUniqueness(allNewEntries, 'Hex45+46');

console.log(`  Hex 45 (萃) normU: ${uniq45.uniqueCount}/${uniq45.total}`);
if (uniq45.dupGroups.length > 0) {
  console.log('  Hex 45 duplicate groups:');
  uniq45.dupGroups.forEach(g => console.log('    ' + JSON.stringify(g)));
}
console.log(`  Hex 46 (升) normU: ${uniq46.uniqueCount}/${uniq46.total}`);
if (uniq46.dupGroups.length > 0) {
  console.log('  Hex 46 duplicate groups:');
  uniq46.dupGroups.forEach(g => console.log('    ' + JSON.stringify(g)));
}
console.log(`  Combined normU: ${uniqBoth.uniqueCount}/${uniqBoth.total}`);
if (uniqBoth.dupGroups.length > 0) {
  console.log('  Combined duplicate groups:');
  uniqBoth.dupGroups.forEach(g => console.log('    ' + JSON.stringify(g)));
}

const MIN_UNIQUE = 32;
let uniquenessFailed = false;
if (uniq45.uniqueCount < MIN_UNIQUE) {
  console.error(`  *** UNIQUENESS FAILED for hex45: ${uniq45.uniqueCount}/36 < ${MIN_UNIQUE}/36 ***`);
  uniquenessFailed = true;
}
if (uniq46.uniqueCount < MIN_UNIQUE) {
  console.error(`  *** UNIQUENESS FAILED for hex46: ${uniq46.uniqueCount}/36 < ${MIN_UNIQUE}/36 ***`);
  uniquenessFailed = true;
}
if (uniqBoth.uniqueCount < 68) {
  console.error(`  *** CROSS-HEX UNIQUENESS FAILED: ${uniqBoth.uniqueCount}/72 < 68/72 ***`);
  uniquenessFailed = true;
}

if (uniquenessFailed) {
  console.error('\nNOT WRITING FILE — fix questions and re-run.');
  process.exit(1);
}
console.log('  Normalized uniqueness PASSED for all checks.');

// ============================================================================
// LOAD EXISTING DATA & MERGE
// ============================================================================
console.log('\n=== LOADING EXISTING DATA ===');
const rawCode = fs.readFileSync(DATA_FILE, 'utf8');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(rawCode, sandbox);
const existingData = sandbox.window.Zero1MatrixData.reflectionQuestions;

if (!Array.isArray(existingData)) {
  throw new Error('Failed to load existing reflectionQuestions array');
}

console.log(`  Loaded existing data: ${existingData.length} questions total.`);
const before45 = existingData.filter(e => e.hexagramId === 45).length;
const before46 = existingData.filter(e => e.hexagramId === 46).length;
console.log(`  Existing hex45=${before45}, hex46=${before46}`);

const filtered = existingData.filter(e => e.hexagramId !== 45 && e.hexagramId !== 46);
const merged = [...filtered, ...allNewEntries];

merged.sort((a, b) => a.hexagramId - b.hexagramId);

console.log(`  New total: ${merged.length} (removed ${before45 + before46}, added 72)`);

// ============================================================================
// WRITE FILE
// ============================================================================
const output =
  "window.Zero1MatrixData = window.Zero1MatrixData || {};\n" +
  "window.Zero1MatrixData.reflectionQuestions = " + JSON.stringify(merged) + ";\n";

fs.writeFileSync(DATA_FILE, output, 'utf8');
console.log(`\n=== WRITTEN ===`);
console.log(`  ${merged.length} total entries written to ${DATA_FILE}`);

// ============================================================================
// VERIFY with node --check
// ============================================================================
const { execFileSync } = require('child_process');
try {
  execFileSync(NODE_EXE, ['--check', DATA_FILE], { stdio: 'pipe' });
  console.log('  node --check PASSED.');
} catch (e) {
  console.error('  node --check FAILED');
  console.error(e.stderr ? e.stderr.toString() : '');
  process.exit(1);
}

// ============================================================================
// VERIFY reload
// ============================================================================
const verifyCode = fs.readFileSync(DATA_FILE, 'utf8');
const verifySandbox = { window: {} };
vm.createContext(verifySandbox);
vm.runInContext(verifyCode, verifySandbox);
const verifyData = verifySandbox.window.Zero1MatrixData.reflectionQuestions;
console.log(`  Verification reload: ${verifyData.length} total questions.`);
const v45 = verifyData.filter(e => e.hexagramId === 45);
const v46 = verifyData.filter(e => e.hexagramId === 46);
console.log(`  Verification hex45=${v45.length}, hex46=${v46.length}`);

if (v45.length !== 36 || v46.length !== 36) {
  throw new Error('Verification failed: expected 36 questions each for hex45 and hex46');
}

console.log('\n=== wC_refl_45_46 COMPLETE ===');
console.log(`  Hex 45 normU: ${uniq45.uniqueCount}/36`);
console.log(`  Hex 46 normU: ${uniq46.uniqueCount}/36`);
console.log(`  Combined normU: ${uniqBoth.uniqueCount}/72`);