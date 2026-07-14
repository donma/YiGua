// Stage 2: Generate unique per-category content for Hexagrams 19 (臨) and 20 (觀)
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');

const DATA_PATH = path.join(__dirname, '..', 'src', 'data', 'categoryInterpretations.data.js');

const categoryNames = {
  general: '一般', career: '事業工作', love: '感情關係', money: '財務金錢',
  people: '人際合作', family: '家庭關係', study: '學習考試', health: '健康身心',
  decision: '決策抉擇', business: '商業經營', legal: '法律事務', spiritual: '心靈成長'
};

const scoreAdjustBase = { clarity: 0, action: 0, risk: 0, change: 0, support: 0, timing: 0 };
function sa(overrides) { return Object.assign({}, scoreAdjustBase, overrides); }

// ---------------------------------------------------------------------------
// HEX 19 臨 entries
// ---------------------------------------------------------------------------
const hex19 = {
  general: {
    basis: ['元亨利貞', '澤上有地', '至于八月有凶'],
    meaning: '臨卦講靠近、治理、帶領與機會逐步到來。澤上有地為君子教養萬民之象，元亨利貞說明起勢極盛，但「至于八月有凶」提醒盛極必有轉折。核心矛盾在於：眼前局勢正在向你靠近，你是否已備好承接的制度與心態，而不只是享受氣勢。',
    advice: '先確認自己是主動治理者還是被動被靠近者，再依此決定要建立規則或是等待被納入。第一步盤點手上資源與人力，第二步設定八個月內的檢查點，若氣勢轉弱立即收斂擴張腳步，改採鞏固策略。',
    warning: '常見錯誤是把當前順勢誤認為長久保證，因而過度擴張人事或承諾。八月之凶並非詛咒，而是提醒制度未建立前的盛勢終將反轉，若毫無準備會被突然收縮的局面拖垮。',
    timing: '成熟訊號是資源與人手到位、規則已寫成文字；若只是口頭承諾與臨時人力集結，代表尚未到可以擴張的時機，應先觀察一個完整周期再行動。'
  },
  career: {
    basis: ['咸臨吉無不利', '至臨', '知臨'],
    meaning: '職場情境中臨卦談的是與上級或團隊逐漸靠近合作的過程。咸臨吉無不利指真誠感應下的合作能順利推進；至臨代表真正進入現場、承擔實務；知臨則要求先理解組織處境再介入領導，避免空降式指揮引發抵觸。',
    advice: '接任新職務或擴大職責前，先以咸臨精神與同事建立真誠互動，再親自到第一線核實至臨階段的實際狀況，最後才用知臨的判斷力調整管理方式，切勿跳過現場查核直接下指令。',
    warning: '最容易犯的錯誤是還沒弄清楚部門實況就急著下達治理決策，或用表面熱絡取代真正理解，這類知臨不足的介入常導致下屬陽奉陰違、執行落空。',
    timing: '當你已能具體說出團隊真實困難與資源缺口，且獲得基層初步信任時，才是擴大領導範圍的成熟時機；若仍停留在會議室的想像階段，應暫緩推動重大改組。'
  },
  love: {
    basis: ['咸臨', '甘臨', '敦臨'],
    meaning: '感情中臨卦描繪從彼此感應到長久承諾的漸進歷程。咸臨是雙方自然而然的靠近與呼應；甘臨警示只用甜言蜜語討好對方而缺乏實質付出的關係，難以持久；敦臨則是經過時間考驗、厚實可信的穩定連結。',
    advice: '檢視目前關係屬於咸臨的自然感應期還是已滑向甘臨的表面討好，若發現後者需主動增加實際承諾與陪伴行動，逐步將關係推向敦臨式的厚實信任，而非停留在言語層面。',
    warning: '甘臨的陷阱在於一方持續用討好換取關係延續，卻迴避責任與衝突，久了會讓對方感到空洞失望，最終在關鍵時刻發現承諾不堪一擊。',
    timing: '當雙方能在意見不合時仍願意留下處理問題，而非只用甜言蜜語帶過，代表關係正邁向敦臨的成熟階段；若總是靠哄勸迴避核心問題，仍屬需要觀察的甘臨期。'
  },
  money: {
    basis: ['至于八月有凶', '甘臨', '敦臨'],
    meaning: '財務上臨卦提醒收入或機會正在靠近，但甘臨式的僥倖心態（只想著甜頭而忽略風險評估）容易在八月之凶到來時付出代價。真正穩健的做法是建立敦臨般厚實的財務紀律，而非被短期順風沖昏頭。',
    advice: '收入增加或機會湧入時，先設定固定比例存入緊急預備金，再檢視支出是否隨氣勢放大而失控，最後為未來六到八個月設下資金壓力測試，確保順境結束仍有餘裕。',
    warning: '危險訊號是把眼前寬裕視為常態，貿然增加固定支出或槓桿承諾，一旦遇到八月之凶式的景氣或收入轉折，將面臨無法回頭的資金缺口。',
    timing: '當你已能承受收入下滑三成仍維持基本開銷，代表財務結構夠敦厚可以承接更多機會；若目前收支只是勉強打平，應先鞏固而非擴張。'
  },
  people: {
    basis: ['咸臨', '咸臨吉無不利', '至臨'],
    meaning: '人際合作上臨卦強調靠近與真誠感應帶來的順利連結。咸臨吉無不利說明雙方若出於真心互動，合作自然通暢；至臨則要求親自到場參與而非遙控，這是建立團隊信任不可省略的一步。',
    advice: '建立新合作關係時，先安排實際共事或面對面互動，累積咸臨式的真誠感應，再逐步承擔共同任務進入至臨階段，讓對方感受到你確實在場而非僅止於口頭合作。',
    warning: '常見誤區是只靠訊息往來維持關係，缺乏實際共同經歷，這種缺乏至臨基礎的合作在壓力測試下容易瞬間瓦解，彼此互信不堪一擊。',
    timing: '當雙方已共同經歷過至少一次具體任務並互相補位成功，代表合作關係進入穩定期；若仍停留在初次接觸的寒暄階段，不宜貿然委以重任。'
  },
  family: {
    basis: ['敦臨', '咸臨', '君子以教思無窮容保民無疆'],
    meaning: '家庭關係中臨卦以敦臨為核心，代表厚實、長久且願意承擔責任的親情連結。君子以教思無窮容保民無疆指出家中長輩對晚輩的教養應如大地般包容且延續不絕，咸臨則是家人間自然的情感呼應。',
    advice: '面對家庭教養或照顧責任，先以咸臨的自然關心建立日常互動，再逐步落實敦臨式的長期承諾，例如固定探視或穩定的財務支持，讓家人感受到可依靠的厚實感而非一時興起。',
    warning: '容易出現的問題是家庭承諾時濃時淡，缺乏敦臨的持續性，讓年長或年幼的家人在需要依靠時反而感到不確定，長期下來會削弱家庭信任基礎。',
    timing: '當家庭中的照顧或教養安排已能穩定運作超過一段時間且各方都感到安心，即是敦臨已然成形；若仍需臨時調整或口頭承諾支撐，代表尚在建立信任的過程中。'
  },
  study: {
    basis: ['知臨', '至臨', '咸臨吉無不利'],
    meaning: '學習上臨卦以知臨為核心，指先理解學科脈絡與自身程度，才能有效帶領自己前進。至臨要求親自動手練習而非只看理論，咸臨吉無不利則說明與老師或同儕真誠互動能讓學習進程順暢無礙。',
    advice: '開始新的學習計畫前，先誠實評估自己目前程度做到知臨的自我理解，再安排實作練習進入至臨階段，並主動與老師同學交流建立咸臨式的支持網絡，三者缺一則進度容易受阻。',
    warning: '常見的失誤是只蒐集資料卻不做知臨式的自我評估，或只聽課不練習，停留在表面理解，考試或應用時才發現至臨的實作基礎完全不足。',
    timing: '當你能不看筆記獨立解出練習題，且能向他人清楚解說概念，代表已具備知臨與至臨的成熟度；若仍需頻繁翻閱資料才能作答，應延後進入更難的階段。'
  },
  health: {
    basis: ['敦臨', '至于八月有凶', '甘臨'],
    meaning: '健康面向上，臨卦提醒身體狀態如同盛勢一樣可能在不知不覺間累積壓力，甘臨式的僥倖（仗著目前還撐得住而忽略警訊）容易在八月之凶般的臨界點爆發。敦臨提醒建立長期穩定的生活節奏才是根本。本欄不做醫療診斷。',
    advice: '若近期感覺體力或精神仍可負荷但已有輕微異常，應優先安排規律作息與適度休息，並在症狀持續或加重時盡快諮詢專業醫療人員，而非以甘臨心態拖延不處理。',
    warning: '危險訊號是明知身體已發出警訊卻用「還撐得住」的甘臨心態一再延後檢查或休息，等到類似八月之凶的臨界點到來時，往往已錯過及早處理的時機。',
    timing: '當你能持續一段時間維持穩定作息且身體反應正向，代表生活節奏已進入敦臨般的穩固狀態；若仍時常靠意志力硬撐，應視為需要調整而非可以擴大負荷的訊號。'
  },
  decision: {
    basis: ['知臨', '至于八月有凶', '至臨'],
    meaning: '決策情境中臨卦要求先做到知臨，也就是充分理解情勢再行動，而非憑一時氣勢躁進。至于八月有凶提醒任何選擇都有時效性與反轉風險，至臨則強調決策者應親自查核關鍵資訊，而非仰賴二手報告。',
    advice: '面對重大選擇時，先列出目前已知與未知資訊做知臨式盤點，再親自查核最關鍵的一兩項事實達到至臨標準，最後設定一個時間點重新評估是否會遇上八月之凶式的情勢轉折。',
    warning: '常見錯誤是在資訊不全時就依賴他人轉述做決定，省略至臨的親自查核步驟，一旦情勢如八月之凶般逆轉，將難以即時因應甚至無法回頭。',
    timing: '當關鍵事實已由你親自確認且設有重新評估的時間點，才適合做出具約束力的決定；若仍有重要疑點未查證，應延後拍板等待更充分的知臨基礎。'
  },
  business: {
    basis: ['至臨', '知臨', '至于八月有凶'],
    meaning: '商業經營上臨卦提醒機會正逐步靠近，但至臨要求經營者親自參與第一線營運，知臨要求真正理解市場而非憑想像擴張，至于八月有凶則警示順風期必有時限，需在盛勢中預留應變空間。本欄不做獲利保證。',
    advice: '擴張業務前，先安排自己或核心幹部親自到第一線了解客戶與流程做到至臨，再依實際市場回饋調整策略達成知臨，同時為未來半年到八個月設下保守情境的現金流測試。',
    warning: '常見的失誤是經營者脫離現場只憑報表決策，缺乏至臨的實務掌握，一旦順風轉為逆風如八月之凶，將因不了解真實狀況而反應遲緩甚至誤判。',
    timing: '當核心團隊已能準確描述客戶真實需求與現場問題，且備有應對景氣轉折的預備方案，才是適合擴大投入的時機；若仍仰賴外部報告做判斷，應先深入現場再行擴張。'
  },
  legal: {
    basis: ['甘臨', '知臨', '元亨利貞'],
    meaning: '法律事務中臨卦提醒切勿以甘臨式的口頭承諾或表面和解取代正式文件與程序，知臨要求充分理解法律關係與條文內容後再簽署或行動，元亨利貞則說明程序完備才能真正保障各方權益。本欄不做法律結果判定。',
    advice: '簽署任何具法律效力的文件前，先確實理解條款內容與各方義務達成知臨，避免僅憑對方口頭保證的甘臨式承諾行事，並保留完整書面紀錄以備查證，必要時諮詢專業法律人員。',
    warning: '常見風險是被對方甜言蜜語般的甘臨式保證說服而省略書面確認，日後若發生爭議將因缺乏憑證而處於不利位置，難以主張應有權益。',
    timing: '當所有關鍵條款已以書面確認且雙方權責清楚，才適合正式簽署或推進程序；若仍停留在口頭協議階段，應暫緩承諾重大事項並先完成必要文件程序。'
  },
  spiritual: {
    basis: ['君子以教思無窮容保民無疆', '敦臨', '知臨'],
    meaning: '心靈成長層面臨卦強調由知臨的自我覺察出發，逐步發展出敦臨般厚實穩定的內在狀態，君子以教思無窮容保民無疆提醒真正的成長會自然延伸為對他人的包容與付出，而非只停留在個人層次。',
    advice: '檢視近期的內在變化是否只是短暫的情緒起伏，還是已能做到知臨式的自我理解；若已有覺察，可嘗試將這份理解延伸為對周遭人事的包容行動，逐步累積敦臨式的穩定內在。',
    warning: '容易出現的偏差是把一時的感動或領悟當成已經完成的成長，缺乏敦臨的持續實踐，過一段時間後又回到原本的習性反應，未能真正內化。',
    timing: '當你能在情緒波動後仍維持原有的價值判斷與待人態度，代表內在已具備敦臨的穩定度；若仍容易因外在事件而全盤動搖，代表成長歷程仍在知臨的覺察階段。'
  }
};

// ---------------------------------------------------------------------------
// HEX 20 觀 entries
// ---------------------------------------------------------------------------
const hex20 = {
  general: {
    basis: ['盥而不薦有孚顒若', '風行地上', '觀我生'],
    meaning: '觀卦談觀察、被觀察與建立公信力。盥而不薦有孚顒若指真正的份量在儀式前敬慎的內在狀態，而非事後展示的排場。風行地上比喻影響力無形卻能遍及各處。核心矛盾在於：你是在認真觀察局勢，還是只在意別人怎麼看你。',
    advice: '先靜下來做觀我生的自我檢視，誠實評估自己的言行對周遭造成的實際影響，再決定對外呈現的方式；避免把心力都放在如何被看見，而忽略了觀察本身應有的敬慎態度。',
    warning: '常見錯誤是重視表面形象勝過實質內容，如同只重視薦而忽略盥的敬慎準備，這種本末倒置會讓外界的信任隨時間流逝而非增長。',
    timing: '當你能在沒有觀眾的情況下依然維持一致的言行標準，代表已具備盥而不薦的敬慎狀態；若言行只在被注視時才端正，代表公信力尚未真正建立。'
  },
  career: {
    basis: ['觀國之光', '觀其生', '闚觀'],
    meaning: '職場情境中觀卦提醒你正被上級與同事觀察，也同時在觀察組織全貌。觀國之光代表從制度與文化層次理解公司運作，觀其生要求觀察他人實際作為而非表面說法，闚觀則警示只從自己狹窄崗位判斷全局的局限。',
    advice: '在評估職涯機會或組織變動前，先跳脫闚觀式的狹窄視角，主動了解跨部門運作達到觀國之光的高度，並以觀其生的態度觀察同事與主管的實際行為模式，而非僅聽片面說法。',
    warning: '常見失誤是僅憑自己部門的片面經驗（闚觀）判斷整體組織方向，容易誤判公司文化或政策用意，導致職涯選擇與實際處境脫節。',
    timing: '當你已能說出跨部門的運作邏輯與公司整體策略方向，代表視野已從闚觀提升到觀國之光的層次，適合承擔更大範圍的職責；若仍只熟悉自己崗位，應先拓展觀察範圍。'
  },
  love: {
    basis: ['觀我生', '觀其生', '童觀'],
    meaning: '感情關係中觀卦提醒先做觀我生的自我檢視，了解自己在關係中的言行模式，再以觀其生的態度真實觀察對方的作為，而非停留在童觀式天真幼稚、只看表面浪漫的階段。',
    advice: '交往初期容易陷入童觀，只憑美好想像判斷對方；建議刻意觀察對方在壓力情境下的實際反應達成觀其生，同時定期做觀我生的自我檢視，確認自己是否也維持一致的言行。',
    warning: '常見的危險是停留在童觀階段，只憑對方的表面言詞或初期熱情就投入承諾，忽略觀察其在困難時刻的真實作為，日後容易發現落差過大。',
    timing: '當你已在多種情境下觀察過對方的真實反應，且雙方都能坦誠檢視自己的行為模式，代表關係已超越童觀進入成熟評估階段；若僅憑初期印象判斷，仍屬需要觀察的時期。'
  },
  money: {
    basis: ['闚觀', '童觀', '觀國之光'],
    meaning: '財務決策中觀卦提醒避免闚觀式只看單一數字或短期消息就下判斷，也要避免童觀式憑直覺或流行話題衝動配置資源，應提升到觀國之光的高度，理解整體經濟與自身財務全貌後再行規劃。',
    advice: '檢視預算或資源分配前，先跳脫闚觀的片面視角，整理收支全貌與長期目標達到觀國之光的層次，避免因童觀式的一時流行資訊而臨時調整重大財務決定。',
    warning: '常見錯誤是被單一消息來源或他人片面說法（闚觀）影響判斷，或如童觀般被表面熱潮吸引而忽略自身實際財務狀況，導致資源配置失衡。',
    timing: '當你已能綜觀全年收支並理解外部環境對自身財務的整體影響，才適合做較大幅度的資源調整；若仍僅憑片段資訊判斷，應先擴大觀察範圍再行動。'
  },
  people: {
    basis: ['觀其生', '觀國之光', '風行地上'],
    meaning: '人際合作中觀卦強調以觀其生的態度真實觀察合作對象的一貫作為，並以觀國之光的高度理解整體人脈網絡與組織文化，風行地上比喻良好的信譽會如風般自然遍及各處，無需刻意宣傳。',
    advice: '評估新的合作對象時，優先觀察其過往實際作為（觀其生）而非僅聽介紹或自我陳述，同時了解對方在更大人脈網絡中的評價（觀國之光），讓信任建立在具體觀察而非片面印象。',
    warning: '常見的疏忽是只憑對方單次表現或他人轉述就快速建立信任，缺乏觀其生式的持續觀察，日後若對方言行不一將難以及時察覺風險。',
    timing: '當你已透過多個情境或第三方管道確認對方的一貫作為，且風評如風行地上般穩定一致，才適合深化合作關係；若資訊來源單一，應先擴大觀察管道。'
  },
  family: {
    basis: ['觀我生', '童觀', '觀其生'],
    meaning: '家庭關係中觀卦提醒先做觀我生的自我省察，了解自己在家庭中的言行如何影響其他成員，避免以童觀式簡化或幼稚的眼光看待家人需求，並以觀其生的態度真實理解長輩或晚輩的實際處境。',
    advice: '面對家庭中的分歧時，先反思自己的言行是否造成誤解達成觀我生，再實際了解家人當下的真實處境與需求（觀其生），避免用童觀式的既定印象評斷家人的行為動機。',
    warning: '常見的問題是用童觀式的簡化眼光看待家人，例如認定長輩固執或晚輩不懂事，而未真正觀察對方當下處境，容易加深家庭中的隔閡與誤解。',
    timing: '當你已能放下既定印象、實際了解家人目前的真實狀況與壓力來源，才適合提出調整家庭安排的建議；若仍憑舊有印象判斷，應先花時間重新觀察。'
  },
  study: {
    basis: ['童觀', '闚觀', '觀我生君子無咎'],
    meaning: '學習上觀卦提醒需跳脫童觀式對學科的天真幼稚理解，也要避免闚觀式只從單一角度或單元判斷整體知識架構，觀我生君子無咎則說明持續自我檢視學習方法的人能避免重大失誤。',
    advice: '學習新領域時，先誠實承認自己可能停留在童觀階段的片面理解，透過多元教材與角度補足闚觀式的視野限制，並定期以觀我生的態度檢視自己的學習方法是否需要調整。',
    warning: '常見的錯誤是滿足於童觀式的表面理解就自認已經掌握，或僅依賴單一資源（闚觀）而未察覺知識架構的缺漏，考試或應用時才發現理解不足。',
    timing: '當你已能從多個角度解釋同一概念且能自我檢視理解上的盲點，代表學習已超越童觀與闚觀階段；若仍只能複誦單一說法，應持續擴大學習角度。'
  },
  health: {
    basis: ['觀我生', '盥而不薦有孚顒若', '觀其生'],
    meaning: '健康面向上觀卦強調觀我生的自我覺察，誠實記錄身體發出的訊號，而非等到症狀明顯才注意；盥而不薦有孚顒若提醒平日敬慎的生活習慣比事後補救更重要。本欄不做醫療診斷。',
    advice: '養成定期記錄身體狀態的習慣達成觀我生的自我觀察，若發現異常訊號持續或加重，應盡快諮詢專業醫療人員，同時觀察家人（觀其生）是否也有需要留意的健康變化。',
    warning: '常見的疏忽是忽視觀我生式的日常身體訊號，只在狀況嚴重時才處理，如同只重視盥而不薦中的表面展示卻缺乏平日敬慎的準備，容易錯失早期調整的機會。',
    timing: '當你已能持續且客觀地記錄自身狀態變化，並在異常出現時及早尋求專業協助，代表已建立良好的自我觀察習慣；若仍習慣忽略小訊號，應盡快調整觀察頻率。'
  },
  decision: {
    basis: ['闚觀', '觀我生君子無咎', '觀國之光'],
    meaning: '決策情境中觀卦提醒避免闚觀式只從單一資訊來源或角度判斷，應提升到觀國之光的高度綜觀全局，觀我生君子無咎則說明先檢視自身立場與偏見再做決定，能大幅降低重大失誤的機率。',
    advice: '面對重要選擇時，先列出所有可取得的資訊來源，避免闚觀式僅依賴單一觀點，再以觀我生的態度檢視自己的既有偏好是否影響判斷，最後綜合全局做出決定。',
    warning: '常見錯誤是僅憑單一管道或第一印象（闚觀）就快速下決定，忽略自身立場可能帶來的偏誤，日後回顧時才發現當初的判斷基礎過於片面。',
    timing: '當你已從多個獨立來源交叉確認關鍵資訊，且誠實檢視過自己的立場偏好，才適合做出具約束力的決定；若資訊來源單一，應延後決策並擴大查證範圍。'
  },
  business: {
    basis: ['觀國之光', '先王以省方觀民設教', '闚觀'],
    meaning: '商業經營上觀卦要求以觀國之光的高度理解市場全貌與產業趨勢，先王以省方觀民設教比喻經營者應親自巡視了解實際需求後才制定制度，避免闚觀式僅憑內部報表判斷外部市場。本欄不做獲利保證。',
    advice: '制定重大商業策略前，先安排實地市場調查或客戶訪談，如先王省方般親自了解需求，再綜合產業趨勢達到觀國之光的視野，避免僅憑闚觀式的內部數據就下判斷。',
    warning: '常見的失誤是經營團隊只依賴內部報表或過去經驗（闚觀）判斷市場，缺乏親自省方的第一手了解，容易在市場變化時反應遲緩甚至誤判方向。',
    timing: '當團隊已具備完整市場調查與產業全局理解，且策略方向來自第一手觀察而非二手推測，才適合大規模投入資源；若仍僅依賴內部數據，應先補強實地了解。'
  },
  legal: {
    basis: ['觀我生君子無咎', '觀國之光', '盥而不薦有孚顒若'],
    meaning: '法律事務中觀卦提醒先做觀我生君子無咎的自我檢視，確認自身行為與文件是否合乎規範，再以觀國之光的角度理解相關法規全貌，盥而不薦有孚顒若則強調程序前的敬慎準備比事後補救更重要。本欄不做法律結果判定。',
    advice: '簽署文件或進行法律程序前，先自我檢視相關資料是否完備達成觀我生君子無咎，再了解整體法規背景達到觀國之光的層次，並在程序開始前就以敬慎態度準備妥當，而非事後補救。',
    warning: '常見的風險是忽略事前的敬慎準備，如同只重視盥而不薦中的形式而缺乏事前確實查核，一旦文件或程序出現疏漏，事後補救往往為時已晚。',
    timing: '當所有文件與法規理解都已在程序開始前完成確認，且經過自我檢視無明顯疏漏，才適合正式推進法律程序；若準備尚不完整，應先暫緩並補足查核。'
  },
  spiritual: {
    basis: ['盥而不薦有孚顒若', '觀我生', '觀其生'],
    meaning: '心靈成長層面觀卦強調盥而不薦有孚顒若式的內在敬慎，重視自身動機是否真誠而非追求他人肯定的表象；觀我生要求持續自我覺察，觀其生則提醒也要理解他人真實處境，避免將個人期待投射於他人身上。',
    advice: '定期靜下心檢視自己行動背後的真實動機，做到盥而不薦的內在敬慎而非只求外在肯定，同時透過觀我生持續自我覺察，並以觀其生的態度理解他人處境，避免過度投射自身期待。',
    warning: '常見的偏差是把追求外界認可當成成長的證明，忽略盥而不薦所強調的內在敬慎，也容易將自己的價值觀投射到他人身上而誤解對方真實需求。',
    timing: '當你的行動動機已能不依賴外界肯定仍保持一致，且能清楚區分自身投射與他人真實處境，代表內在成長已趨於成熟；若仍需外界認可才能安心，應持續深化自我覺察。'
  }
};

function buildEntries(hexagramId, hexData, hexName, sceneName, scoreOverrides) {
  const categories = ['general','career','love','money','people','family','study','health','decision','business','legal','spiritual'];
  return categories.map(cat => {
    const d = hexData[cat];
    return {
      id: `hex-${String(hexagramId).padStart(3,'0')}-${cat}`,
      hexagramId: hexagramId,
      category: cat,
      categoryName: categoryNames[cat],
      meaning: d.meaning,
      advice: d.advice,
      warning: d.warning,
      timing: d.timing,
      basis: d.basis,
      scoreAdjust: sa(scoreOverrides[cat] || {}),
      qualityLevel: 'refined',
      reviewed: false,
      reviewedBy: 'category-gold-review',
      reviewedAt: '2026-07-13',
      needsHumanReview: true,
      version: '1.7.1-gold-cat'
    };
  });
}

// Distinct scoreAdjust per category to reflect hexagram-specific nuance
const scoreOverrides19 = {
  general: { change: 5, timing: -5 },
  career: { action: 5, support: 5 },
  love: { support: 5, clarity: 5 },
  money: { risk: 5, action: -5 },
  people: { support: 10 },
  family: { support: 10, change: -5 },
  study: { clarity: 10 },
  health: { risk: 5, timing: -5 },
  decision: { clarity: 5, risk: 5 },
  business: { action: 5, risk: 5 },
  legal: { clarity: 5, risk: -5 },
  spiritual: { clarity: 5, change: 5 }
};

const scoreOverrides20 = {
  general: { clarity: 10 },
  career: { clarity: 5, support: 5 },
  love: { clarity: 5, support: 5 },
  money: { clarity: 10, risk: -5 },
  people: { clarity: 5, support: 10 },
  family: { clarity: 5, support: 5 },
  study: { clarity: 10, action: -5 },
  health: { clarity: 5, timing: -5 },
  decision: { clarity: 10, action: -5 },
  business: { clarity: 5, action: 5 },
  legal: { clarity: 10, risk: -5 },
  spiritual: { clarity: 10, change: 5 }
};

const entries19 = buildEntries(19, hex19, '臨', '地澤臨', scoreOverrides19);
const entries20 = buildEntries(20, hex20, '觀', '風地觀', scoreOverrides20);
const newEntries = entries19.concat(entries20);

// ---------------------------------------------------------------------------
// Load existing data file via vm, replace hex19/20 entries, write back
// ---------------------------------------------------------------------------
const filePath = path.join(__dirname, '..', 'src', 'data', 'categoryInterpretations.data.js');
const src = fs.readFileSync(filePath, 'utf8');

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(src, sandbox, { filename: filePath });

const existing = sandbox.window.Zero1MatrixData.categoryInterpretations;
if (!Array.isArray(existing)) {
  throw new Error('Failed to load existing categoryInterpretations array');
}

const idsToReplace = new Set(newEntries.map(e => e.id));
const filtered = existing.filter(e => !idsToReplace.has(e.id));

// Also remove any stray entries that match hexagramId 19/20 but different id naming
const finalFiltered = filtered.filter(e => !(e.hexagramId === 19 || e.hexagramId === 20));

const finalArray = finalFiltered.concat(newEntries);

// Sort by hexagramId then category to keep it tidy (optional, matches likely original ordering)
finalArray.sort((a, b) => {
  if (a.hexagramId !== b.hexagramId) return a.hexagramId - b.hexagramId;
  const order = ['general','career','love','money','people','family','study','health','decision','business','legal','spiritual'];
  return order.indexOf(a.category) - order.indexOf(b.category);
});

const outputContent = "window.Zero1MatrixData = window.Zero1MatrixData || {};\n" +
  "window.Zero1MatrixData.categoryInterpretations = " + JSON.stringify(finalArray) + ";\n";

fs.writeFileSync(filePath, outputContent, { encoding: 'utf8' });

console.log('Written ' + finalArray.length + ' total entries (' + newEntries.length + ' new/updated for hex 19 & 20).');

// ---------------------------------------------------------------------------
// Verify with node --check
// ---------------------------------------------------------------------------
try {
  const nodeExe = process.execPath;
  execFileSync(nodeExe, ['--check', filePath], { stdio: 'inherit' });
  console.log('node --check passed: syntax OK.');
} catch (err) {
  console.error('node --check FAILED:', err.message);
  process.exit(1);
}

// Quick sanity re-load check
const verifySrc = fs.readFileSync(filePath, 'utf8');
const verifySandbox = { window: {} };
vm.createContext(verifySandbox);
vm.runInContext(verifySrc, verifySandbox, { filename: filePath });
const verifyData = verifySandbox.window.Zero1MatrixData.categoryInterpretations;
const hex19Count = verifyData.filter(e => e.hexagramId === 19).length;
const hex20Count = verifyData.filter(e => e.hexagramId === 20).length;
console.log('Hex 19 entries:', hex19Count, '| Hex 20 entries:', hex20Count);
if (hex19Count !== 12 || hex20Count !== 12) {
  console.error('WARNING: expected 12 entries each for hex 19 and hex 20.');
  process.exit(1);
}
console.log('All checks passed.');
