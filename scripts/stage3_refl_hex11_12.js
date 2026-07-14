// stage3_refl_hex11_12.js
// Generates PER-HEX-PER-CATEGORY UNIQUE reflection questions for hexagrams 11 (泰) and 12 (否)
// 12 categories x 3 questions each x 2 hexagrams = 72 total
// Q1: Current State, Q2: Action & Choice, Q3: Risk/Boundary/Timing
// Traditional Chinese, 38-105 chars, ends with ?

const vm = require('vm');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA_FILE = path.join(ROOT, 'src', 'data', 'reflectionQuestions.data.js');
const NODE_EXE = path.join(ROOT, '.nodejs', 'node-v22.14.0-win-x64', 'node.exe');

// ─── Load existing data ───
global.window = {};
const rawCode = fs.readFileSync(DATA_FILE, 'utf8');
vm.runInThisContext(rawCode);
const allEntries = global.window.Zero1MatrixData.reflectionQuestions;

const now = new Date().toISOString().split('T')[0];

// ============================================================================
// HEX 11: 泰 (地天泰)
// ============================================================================
const hex11Questions = [
  // ── general ──
  { id: "rf-011-general-1", category: "general", categoryName: "一般",
    question: "天地交而萬物通的當下，你正處於小往大來的哪個階段——初期的小投入已開始回報、中期正在累積、還是已接近無平不陂的轉折點？哪個信號最能代表你此刻的真實位置？",
    basis: ["天地交","小往大來","無平不陂","一般"] },
  { id: "rf-011-general-2", category: "general", categoryName: "一般",
    question: "當小往大來的勢頭正在你身邊展開時，你面前有兩條路——繼續用包荒的包容力擴大格局，還是收縮防線檢視無平不陂的潛在風險？你選擇哪一條的具體依據是什麼？",
    basis: ["小往大來","包荒","無平不陂","一般"] },
  { id: "rf-011-general-3", category: "general", categoryName: "一般",
    question: "無往不復的鐵律意味著此刻的通暢必然包含下一次逆轉的種子——你目前最可能忽略的轉折前兆是什麼？當哪三個信號同時出現時，你會確信天地交的雙向流通已開始單邊化？",
    basis: ["無平不陂無往不復","天地交","一般"] },

  // ── career ──
  { id: "rf-011-career-1", category: "career", categoryName: "工作事業",
    question: "拔茅茹的職場連動效應中，你與哪些同根者正處於集體上升期——你們的同步位移是否仍穩固？如果團隊核心成員中的一位突然離開，你的位置會受多大程度的震動？",
    basis: ["拔茅茹","工作事業"] },
  { id: "rf-011-career-2", category: "career", categoryName: "工作事業",
    question: "用馮河的果斷跨越與包荒的耐心包容正在你面前對峙——跨部門資源爭奪或重大提案面前，你該選擇不顧規則跳躍過去，還是先建立更廣泛的共識再前進？你的判斷標準是什麼？",
    basis: ["用馮河","包荒","工作事業"] },
  { id: "rf-011-career-3", category: "career", categoryName: "工作事業",
    question: "城復于隍的崩塌從不在高光時刻發生——你目前的職位優勢建立在哪些隨時可能失效的基礎上？當直屬主管對你的公開支持出現第幾次微妙退縮時，你會啟動橫向防護而非繼續向上依賴？",
    basis: ["城復于隍","工作事業"] },

  // ── love ──
  { id: "rf-011-love-1", category: "love", categoryName: "感情關係",
    question: "天地交在感情中指向一種罕見的雙向敞開——你此刻感受到的是真正的互相滲透，還是只有你在主動降下防備？帝乙歸妹式的長期承諾契機，在你的關係中已經出現了嗎？",
    basis: ["天地交","帝乙歸妹","感情關係"] },
  { id: "rf-011-love-2", category: "love", categoryName: "感情關係",
    question: "小往大來的累積策略在感情中意味著每日微小的善意投資——你此刻應該繼續用這份耐心等待對方回應，還是設立明確的回饋期限並在期限後做出更果斷的選擇？你如何判斷繼續等待與及時止損的界線？",
    basis: ["小往大來","感情關係"] },
  { id: "rf-011-love-3", category: "love", categoryName: "感情關係",
    question: "無平不陂的規律提醒你感情的最高點即是下一個考驗的起點——在親密與獨立的張力中，哪一條界線一旦被跨越就會從天地交通變成互相窒息？你為這條界線設定的具體信號是什麼？",
    basis: ["無平不陂","天地交","感情關係"] },

  // ── money ──
  { id: "rf-011-money-1", category: "money", categoryName: "金錢財運",
    question: "小往大來在財務上體現為複利式積累——你目前的資金流向中，哪些微小的定期投入已經開始產生不成比例的回報？哪些投入仍在包荒的容忍期內尚未驗證方向是否正確？",
    basis: ["小往大來","包荒","金錢財運"] },
  { id: "rf-011-money-2", category: "money", categoryName: "金錢財運",
    question: "包荒的包容力在金錢管理中是雙面刃——你該繼續寬容那些暫時虧損但具長期潛力的配置，還是該果斷割捨以守住現金流？無平不陂的警示下，你的止損線畫在哪個具體數字上？",
    basis: ["包荒","無平不陂","金錢財運"] },
  { id: "rf-011-money-3", category: "money", categoryName: "金錢財運",
    question: "小往大來的累積已達幾成飽和度時你該啟動下一輪佈局而非繼續加碼？無平不陂的轉折在財務上的具體前兆是什麼——是連續幾次原本穩定的收益開始波動時你該收縮而非擴張？",
    basis: ["小往大來","無平不陂","金錢財運"] },

  // ── people ──
  { id: "rf-011-people-1", category: "people", categoryName: "人際合作",
    question: "拔茅茹的同盟結構中，誰是你真正的同根者——那些在你無法提供資源時仍然站在你這邊的人？包荒的包容力是否讓你誤將暫時利益重疊的過客也納入了核心圈？",
    basis: ["拔茅茹","包荒","人際合作"] },
  { id: "rf-011-people-2", category: "people", categoryName: "人際合作",
    question: "不富以其鄰的困境已經擺在面前——當你的資源無法同時照顧所有盟友時，你該選擇集中支持最核心的兩三人，還是分散資源維持廣泛但淺層的關係網？你取捨的具體原則是什麼？",
    basis: ["不富以其鄰","人際合作"] },
  { id: "rf-011-people-3", category: "people", categoryName: "人際合作",
    question: "拔茅茹的集體上升期大約維持一到兩季——當核心圈內有人連續幾次未回應你的同步請求時，你該將其移出核心層？包荒的包容何時從美德變成讓破壞性合作者長期停留的陷阱？",
    basis: ["拔茅茹","包荒","人際合作"] },

  // ── family ──
  { id: "rf-011-family-1", category: "family", categoryName: "家庭親人",
    question: "天地交在家庭中的理想狀態是雙向理解而非單向教導——你家中目前的溝通是真正的雙向流通，還是只有表面和諧？拔茅茹的連動效應中，家中每個成員的重大變動是否已被其他成員真正知曉？",
    basis: ["天地交","拔茅茹","家庭親人"] },
  { id: "rf-011-family-2", category: "family", categoryName: "家庭親人",
    question: "帝乙歸妹式的跨代結合決策（如長輩同住或子女婚姻）面前，你該堅持傳統的家庭結構期待，還是接受新的聯盟模式？雙方各自不可退讓的底線是什麼，交集處是否存在雙方都能接受的方案？",
    basis: ["帝乙歸妹","家庭親人"] },
  { id: "rf-011-family-3", category: "family", categoryName: "家庭親人",
    question: "城復于隍的崩塌始於日常儀式的被忽視——你家中連續幾週無人主動分享近況時代表溝通已中斷而非沒有問題？家庭對話的慣性需要多久才能建立，在此之前你如何防止因不耐煩而退回單向命令模式？",
    basis: ["城復于隍","天地交","家庭親人"] },

  // ── study ──
  { id: "rf-011-study-1", category: "study", categoryName: "學習考試",
    question: "小往大來在學習中的複利效應已在你的每日投入中啟動了嗎——前三十天的沉默期你正在經歷還是已經突破？包荒的困惑期中，哪些尚未理解的概念其實會在後續學習中自然消解而非需要此刻強攻？",
    basis: ["小往大來","包荒","學習考試"] },
  { id: "rf-011-study-2", category: "study", categoryName: "學習考試",
    question: "財成天地之道要求你超越記憶進入理解層——你該繼續用既有方法深耕同一領域，還是跨出舒適區用已學的原則去解釋完全不相關的新領域來驗證你是否真正掌握了底層規律？",
    basis: ["財成天地之道","學習考試"] },
  { id: "rf-011-study-3", category: "study", categoryName: "學習考試",
    question: "小往大來的複利效應在持續投入多少天後才會從量變到質變？包荒的困惑期如果超過多久仍未突破，就代表不是正常的整合階段而是學習方向本身需要重新校準？",
    basis: ["小往大來","包荒","學習考試"] },

  // ── health ──
  { id: "rf-011-health-1", category: "health", categoryName: "身心健康",
    question: "天地交在身體層面意味著內在系統的雙向流通——你目前的作息、飲食與情緒之間是否形成了良性循環，還是某一環節正在單向消耗其他系統？小往大來的微小習慣積累，哪些已開始產生可見的健康改善？",
    basis: ["天地交","小往大來","身心健康"] },
  { id: "rf-011-health-2", category: "health", categoryName: "身心健康",
    question: "當身體發出無平不陂的早期信號（如持續疲勞或小病不斷），你該選擇休息暫停以恢復天地交的平衡，還是繼續硬撐完成眼前的責任？你的身體邊界在哪個具體指標出現時就必須優先修復而非繼續輸出？",
    basis: ["無平不陂","天地交","身心健康"] },
  { id: "rf-011-health-3", category: "health", categoryName: "身心健康",
    question: "天地交的雙向流通一旦單邊化（只消耗不恢復），身體會在多久內從泰轉否？小往大來的健康投資最容易被什麼打斷——是外在壓力打亂作息，還是內在的僥倖心態讓你覺得偶爾透支無所謂？",
    basis: ["天地交","小往大來","身心健康"] },

  // ── decision ──
  { id: "rf-011-decision-1", category: "decision", categoryName: "重大決策",
    question: "小往大來的漸進驗證路線與用馮河的果斷跳躍在你當前的重大決策中哪個更適用——你面對的選項是可逆的小型測試還是不可逆的關鍵窗口？你的決策框架中，目前哪些假設前提仍然成立、哪些已經動搖？",
    basis: ["小往大來","用馮河","重大決策"] },
  { id: "rf-011-decision-2", category: "decision", categoryName: "重大決策",
    question: "無平不陂無往不復警告每一個看似平坦的選項都藏著下坡——你面前兩個互相排斥的選擇中，哪個的風險是可控可逆的、哪個的失誤會觸發城復于隍式的連鎖崩塌？你選擇的依據是風險最小化還是機會最大化？",
    basis: ["無平不陂無往不復","城復于隍","重大決策"] },
  { id: "rf-011-decision-3", category: "decision", categoryName: "重大決策",
    question: "城復于隍從不發生在決策當下——你花數年建立的決策框架中，哪一個核心假設一旦被證明不再成立就會導致全面崩塌？無平不陂的信號是：當一個選項連續幾次被所有人認為完全沒有風險時，那正是最大風險的所在？",
    basis: ["城復于隍","無平不陂","重大決策"] },

  // ── business ──
  { id: "rf-011-business-1", category: "business", categoryName: "商業經營",
    question: "小往大來在商業中的複利邏輯是否已在你目前的經營數據中顯現——哪些小規模投入的邊際回報正在加速擴大？財成天地之道要求你理解行業底層規律，你目前對市場底層邏輯的掌握達到什麼程度？",
    basis: ["小往大來","財成天地之道","商業經營"] },
  { id: "rf-011-business-2", category: "business", categoryName: "商業經營",
    question: "用馮河的商業決策面前——你該繼續觀望市場信號等到數據充分再做判斷，還是趁競爭對手猶豫時率先跨越進入新領域？財成天地之道的底層規律理解能否幫你判斷此刻是機會窗口還是陷阱誘餌？",
    basis: ["用馮河","財成天地之道","商業經營"] },
  { id: "rf-011-business-3", category: "business", categoryName: "商業經營",
    question: "小往大來的累積曲線何時會進入邊際遞減階段——當投入增加但回報增長放緩時，你是該轉向財成天地之道的結構性創新而非繼續在同一模式上加碼？這個轉折點在你的行業中通常出現在第幾個季度？",
    basis: ["小往大來","財成天地之道","商業經營"] },

  // ── legal ──
  { id: "rf-011-legal-1", category: "legal", categoryName: "法律事務",
    question: "小往大來在法律事務中意味著微小證據的累積終將形成不可動搖的結論鏈——你目前的案件中哪些看似微小的細節正在成為關鍵支點？包荒的包容力是否讓你在妥協談判中忽略了對方正在越過的法律底線？",
    basis: ["小往大來","包荒","法律事務"] },
  { id: "rf-011-legal-2", category: "legal", categoryName: "法律事務",
    question: "包荒的包容與法律的剛性邊界正在衝突——你該選擇接受一個不完美但可執行的和解方案，還是堅持訴訟直到完全勝訴？無平不陂的警示下，堅持訴訟的代價（時間、金錢、精力）是否已被你完全計入考量？",
    basis: ["包荒","無平不陂","法律事務"] },
  { id: "rf-011-legal-3", category: "legal", categoryName: "法律事務",
    question: "無平不陂在法律程序中何時會突然顯現——當對方連續幾次在程序上讓步時，那是真誠和解的信號還是誘使你放鬆警惕的策略？小往大來的證據鏈何時已足夠強大到可以啟動最終行動而非繼續等待更多證據？",
    basis: ["無平不陂","小往大來","法律事務"] },

  // ── spiritual ──
  { id: "rf-011-spiritual-1", category: "spiritual", categoryName: "心境修行",
    question: "天地交的內在結構是否已在你身上形成——當外在行動與內在價值觀能夠雙向流通時，你不需要刻意堅持什麼，因為選擇自然反映信念。包荒的自我接納中，你目前最難接納自己的哪一個長期矛盾或陰暗面？",
    basis: ["天地交","包荒","心境修行"] },
  { id: "rf-011-spiritual-2", category: "spiritual", categoryName: "心境修行",
    question: "財成天地之道的價值校準面前——你該繼續在現有路徑上用小往大來的每日微小修行累積深度，還是徹底轉向一個更符合你核心價值但充滿不確定的新方向？你所做的事是否在滋養你所相信的世界？",
    basis: ["財成天地之道","小往大來","心境修行"] },
  { id: "rf-011-spiritual-3", category: "spiritual", categoryName: "心境修行",
    question: "天地交的內在對話從刻意行為變成自然習慣需要至少二十一天——在此之前，哪個最容易讓你放棄的自我欺騙模式會反覆出現？包荒的自我接納何時會滑向自我放縱，界線在哪裡——是當接納變成不行動的藉口時？",
    basis: ["天地交","包荒","心境修行"] }
];

// ============================================================================
// HEX 12: 否 (天地否)
// ============================================================================
const hex12Questions = [
  // ── general ──
  { id: "rf-012-general-1", category: "general", categoryName: "一般",
    question: "天地不交的閉塞狀態中，否之匪人提醒你這不是個人失敗而是系統性阻塞——你目前感受到的阻力中，哪些確實來自外部環境的結構性斷裂，哪些是你將環境問題內化為自我懷疑的結果？儉德辟難的收縮程度是否已足夠？",
    basis: ["天地不交","否之匪人","儉德辟難","一般"] },
  { id: "rf-012-general-2", category: "general", categoryName: "一般",
    question: "休否的策略是暫停而非放棄——你面前有兩個選擇：繼續在天地不交的閉塞中強推並消耗自己，還是完全停下來用儉德辟難收縮防線等待環境鬆動？你如何判斷休否的暫停該維持多久才不至於變成永久撤退？",
    basis: ["休否","儉德辟難","天地不交","一般"] },
  { id: "rf-012-general-3", category: "general", categoryName: "一般",
    question: "傾否的翻轉窗口極短——當僵持已久的阻塞突然出現第三方調解或外部衝擊時，你需要在多久內準備好備選方案才不至於錯過？休否的暫停若超過哪個時間點就會從策略性等待變成逃避性停滯？",
    basis: ["傾否","休否","一般"] },

  // ── career ──
  { id: "rf-012-career-1", category: "career", categoryName: "工作事業",
    question: "天地不交的職場閉塞中，大往小來的回報不對等正在消耗你——你付出的比往常更多但得到的認可與資源卻更少，這是組織資源分配機制的暫時失靈還是你所在的部門本身已被邊緣化？休否的職場策略是否已經啟動？",
    basis: ["天地不交","大往小來","休否","工作事業"] },
  { id: "rf-012-career-2", category: "career", categoryName: "工作事業",
    question: "有命無咎是職場閉塞期唯一的行動準則——你該選擇等待高層明確指令後再行動以確保安全，還是趁組織混亂時主動出擊填補權力真空？前者保守但穩妥，後者高回報但可能觸怒尚未表態的上級，你如何抉擇？",
    basis: ["有命無咎","工作事業"] },
  { id: "rf-012-career-3", category: "career", categoryName: "工作事業",
    question: "大往小來的回報不對等如果超過多久沒有改善就該在外部分散風險而非繼續等待？天地不交的組織閉塞期通常持續一到兩季——在此期間做不可逆的職涯決定（辭職或接受調動）的風險邊界在哪裡？",
    basis: ["大往小來","天地不交","工作事業"] },

  // ── love ──
  { id: "rf-012-love-1", category: "love", categoryName: "感情關係",
    question: "天地不交在感情中的雙向封閉是否已經發生——過去兩週內雙方主動開啟有意義對話的次數是否少於三次？包承的獨自支撐中，你是否正在把獨自撐住關係的重量誤認為愛的證明而非透支的前兆？",
    basis: ["天地不交","包承","感情關係"] },
  { id: "rf-012-love-2", category: "love", categoryName: "感情關係",
    question: "包羞的羞恥感讓雙方都不願先開口——你該選擇冒著被拒絕的風險主動伸手打破沉默，還是用休否的暫停給彼此冷靜觀察的空間？如果你選擇主動開口，那封不寄出的信中哪些部分在放置二十四小時後仍然值得傳達？",
    basis: ["包羞","休否","感情關係"] },
  { id: "rf-012-love-3", category: "love", categoryName: "感情關係",
    question: "包承的獨自支撐最多能維持多久就必須轉為誠實對話或放手？休否的暫停如果超過幾個月就會從保護變成冷暴力——你為這段關係設定的觀察期限是多久？當期限到來時你是否有勇氣做出不可逆的決定？",
    basis: ["包承","休否","感情關係"] },

  // ── money ──
  { id: "rf-012-money-1", category: "money", categoryName: "金錢財運",
    question: "大往小來在財務上的高投入低回報是否正在發生——你投入的資金與精力比往常更多，但收益卻持續縮水？儉德辟難的財務策略中，你已經暫停了哪些不必要的支出、延後了哪些非緊急的消費決定？",
    basis: ["大往小來","儉德辟難","金錢財運"] },
  { id: "rf-012-money-2", category: "money", categoryName: "金錢財運",
    question: "休否在財務管理中的應用是暫停所有非必要的投資決策——你該選擇全面凍結新投資等待市場信號明朗，還是趁資產價格低迷時逆向佈局？大往小來的教訓下，此刻的逆向操作是遠見還是賭博？",
    basis: ["休否","大往小來","金錢財運"] },
  { id: "rf-012-money-3", category: "money", categoryName: "金錢財運",
    question: "儉德辟難的收縮策略應維持到什麼信號出現為止——是市場流動性恢復、政策轉向還是你個人的現金流壓力緩解？大往小來的回報不對等如果超過幾個季度仍無改善，是否代表你的資產配置本身需要根本性調整？",
    basis: ["儉德辟難","大往小來","金錢財運"] },

  // ── people ──
  { id: "rf-012-people-1", category: "people", categoryName: "人際合作",
    question: "天地不交的人際信任斷裂中，過去三個月內哪些合作對象曾經主動向你同步資訊或提供幫助？包承式的單向關係中，你是否正在對那些只接受而不回饋的人持續投入資源？包羞的未處理傷害正在阻斷哪些本可修復的連結？",
    basis: ["天地不交","包承","包羞","人際合作"] },
  { id: "rf-012-people-2", category: "people", categoryName: "人際合作",
    question: "有命無咎的新合作契機來自可信第三方推薦時才可謹慎接受——你面前有兩個選項：接受一個有背書的新合作機會但需承擔再度失望的風險，還是用休否的全面凍結拒絕所有新邀約直到信任完全修復？你如何權衡孤立風險與合作風險？",
    basis: ["有命無咎","休否","人際合作"] },
  { id: "rf-012-people-3", category: "people", categoryName: "人際合作",
    question: "包承式的單向關係在設立止損點後需給對方多久觀察期——如果對方完全未察覺你的撤退，這段關係是否本來就不存在？休否的人際暫停若超過多久就會變成永久孤立，使你的合作網絡過度萎縮而無法恢復？",
    basis: ["包承","休否","人際合作"] },

  // ── family ──
  { id: "rf-012-family-1", category: "family", categoryName: "家庭親人",
    question: "天地不交的代際斷裂中，家中每個人是否都有機會完整表達自己的想法而不被打斷？包羞的傷害循環裡，家庭中哪些未處理的舊傷口正在讓每個人都活在對彼此的假設中而不自知？休否的禁評斷期是否已經啟動？",
    basis: ["天地不交","包羞","休否","家庭親人"] },
  { id: "rf-012-family-2", category: "family", categoryName: "家庭親人",
    question: "傾否的結構性重置需要勇氣徹底改變舊規則——你該選擇在衝突降溫後提出全新的家庭互動規則，還是繼續用修補的方式在舊模式上打補丁？舊模式中哪一個規則的改變會帶動整個家庭系統的連鎖更新？",
    basis: ["傾否","家庭親人"] },
  { id: "rf-012-family-3", category: "family", categoryName: "家庭親人",
    question: "天地不交的家庭溝通斷裂若超過多久未被處理就會固化成每個人的防衛習慣？休否的禁評斷期不宜超過幾天——超過這個期限就會從保護變成另一種形式的逃避？傾否的結構重置時機通常在家庭經歷什麼樣的外部事件之後？",
    basis: ["天地不交","休否","傾否","家庭親人"] },

  // ── study ──
  { id: "rf-012-study-1", category: "study", categoryName: "學習考試",
    question: "天地不交的學習阻塞中，大往小來的低轉化率正在發生——你讀了三小時但能記住的不到三成，這是你與當前學習對象的方法不匹配還是基礎知識有缺口？休否的完全暫停是否比繼續硬讀更能讓大腦背景處理機制整合碎片資訊？",
    basis: ["天地不交","大往小來","休否","學習考試"] },
  { id: "rf-012-study-2", category: "study", categoryName: "學習考試",
    question: "傾否的方法轉換面前——你該繼續用視覺閱讀的既有路徑依賴，還是徹底切換到聽覺或動覺的學習模式？如果你一直獨自學習，找一個學習夥伴互相教學是否能打破天地不交的理解阻塞？你願意冒方法轉換的短期不適應風險嗎？",
    basis: ["傾否","學習考試"] },
  { id: "rf-012-study-3", category: "study", categoryName: "學習考試",
    question: "天地不交的學習阻塞超過幾天就必須主動切換方法而非繼續加倍投入？休否的完全暫停不宜超過多久——超過這個時間學習慣性會完全中斷而重新啟動的成本更高？傾否的方法轉換效果若在幾週後仍未顯現就需更根本的目標校準？",
    basis: ["天地不交","休否","傾否","學習考試"] },

  // ── health ──
  { id: "rf-012-health-1", category: "health", categoryName: "身心健康",
    question: "休否在身體健康上的應用是停止對自己身體的持續透支——你目前的身心狀態中，哪一個系統正在發出天地不交的閉塞信號（如睡眠無法恢復疲勞、消化無法吸收營養）？有命無咎提醒你：身體的明確警訊是否已經出現而你仍在忽視？",
    basis: ["休否","天地不交","有命無咎","身心健康"] },
  { id: "rf-012-health-2", category: "health", categoryName: "身心健康",
    question: "天地不交的健康危機中你面臨兩個選擇——用休否的完全暫停給身體修復的時間但可能落後於工作進度，還是繼續硬撐直到有命無咎的明確醫療診斷出現才被迫停下？等待診斷的過程中你正在支付什麼看不見的代價？",
    basis: ["天地不交","休否","有命無咎","身心健康"] },
  { id: "rf-012-health-3", category: "health", categoryName: "身心健康",
    question: "休否的身體暫停需要多久才能讓天地不交的閉塞狀態開始逆轉——少於這個時間你無法從既有的消耗慣性中脫離？有命無咎的外部信號（如體檢報告或醫生明確警告）出現時，你是否有執行休否的行動力還是會繼續拖延？",
    basis: ["休否","天地不交","有命無咎","身心健康"] },

  // ── decision ──
  { id: "rf-012-decision-1", category: "decision", categoryName: "重大決策",
    question: "否之匪人的核心困境是決策所需的關鍵資訊被結構性遮蔽——你正在猶豫的決定中，右邊「需要但尚未掌握的關鍵資訊」是否超過三項？有命無咎的外部觸發條件（如高層會議或政策發布）是否尚未達成因此決策不該在此刻啟動？",
    basis: ["否之匪人","有命無咎","重大決策"] },
  { id: "rf-012-decision-2", category: "decision", categoryName: "重大決策",
    question: "休否的決策暫停與儉德辟難的範圍縮小正在對峙——你該選擇把所有不可逆的重大決定都推遲到資訊充足時，還是將大決定拆成可逆的小決定用可控成本逐步試探？傾否的認知翻轉能否藉由聆聽觀點不同者的完整陳述來觸發？",
    basis: ["休否","儉德辟難","傾否","重大決策"] },
  { id: "rf-012-decision-3", category: "decision", categoryName: "重大決策",
    question: "否之匪人的資訊遮蔽通常不會超過一季——但休否的決策暫停若超過多久，維持現狀本身就會成為一個不可逆的決定？有命無咎的外部信號通常在關鍵事件後多久內出現，若超過這個時間仍無信號是否代表你等待的方向本身有誤？",
    basis: ["否之匪人","休否","有命無咎","重大決策"] },

  // ── business ──
  { id: "rf-012-business-1", category: "business", categoryName: "商業經營",
    question: "大往小來在商業中的高投入低回報是否正在侵蝕你的現金流——你投入的資源比競爭對手更多但市佔率或利潤率卻在萎縮？休否的商業策略中，哪些產品線或市場區塊該被暫停或終止以釋放被鎖死的資源？",
    basis: ["大往小來","休否","商業經營"] },
  { id: "rf-012-business-2", category: "business", categoryName: "商業經營",
    question: "傾否的市場翻轉面前——你該選擇在行業低迷時用休否的策略守住現金等待復甦，還是趁競爭對手收縮時逆向擴張搶佔市場份額？大往小來的教訓下，此刻的逆向擴張是建立在對傾否時機的準確判斷還是絕望的賭博？",
    basis: ["傾否","休否","大往小來","商業經營"] },
  { id: "rf-012-business-3", category: "business", categoryName: "商業經營",
    question: "大往小來的回報不對等若超過幾個季度仍未改善就需考慮根本性的商業模式轉型？休否的收縮策略應維持到什麼市場信號出現——是行業龍頭開始招聘、上游供應商恢復信用放帳、還是終端客戶的採購頻率回升？",
    basis: ["大往小來","休否","商業經營"] },

  // ── legal ──
  { id: "rf-012-legal-1", category: "legal", categoryName: "法律事務",
    question: "否之匪人在法律事務中意味著關鍵證據或有利判例被結構性遮蔽——你目前案件中哪些核心資訊明知存在卻無法取得？有命無咎提醒你：是否有明確的外部信號如新證人出現或司法解釋更新能打破當前僵局？",
    basis: ["否之匪人","有命無咎","法律事務"] },
  { id: "rf-012-legal-2", category: "legal", categoryName: "法律事務",
    question: "休否的法律策略是暫停不可逆的程序推進——你該等待有命無咎的明確信號如判例變更或新法規頒布後再行動，還是用程序上的小規模試探如申請部分證據開示來測試法庭態度？等待成本與試探風險哪個更大？",
    basis: ["休否","有命無咎","法律事務"] },
  { id: "rf-012-legal-3", category: "legal", categoryName: "法律事務",
    question: "否之匪人的資訊遮蔽在法律程序中通常不會超過多久——重大結構性證據不可能被永久隱藏？休否的程序暫停若超過哪個法定期限就會導致權利失效或時效消滅的不可逆後果？有命無咎的轉折信號最可能來自哪個外部事件？",
    basis: ["否之匪人","休否","有命無咎","法律事務"] },

  // ── spiritual ──
  { id: "rf-012-spiritual-1", category: "spiritual", categoryName: "心境修行",
    question: "天地不交的內在分裂中，你明知什麼是對的但行動卻反覆偏離那個方向——這是你個人的意志薄弱，還是你所處環境正在經歷價值混亂的震盪而你感受到的撕裂感是環境的症狀？休否的自我暫停是否已啟動來切斷自動化的負面思維鏈？",
    basis: ["天地不交","休否","心境修行"] },
  { id: "rf-012-spiritual-2", category: "spiritual", categoryName: "心境修行",
    question: "傾否的價值重估面前——你該選擇繼續在舊信念體系的廢墟上修修補補，還是讓它徹底倒塌並在廢墟中重建更堅固的新價值觀？否之匪人提醒你環境確實有問題，但你如何回應環境仍然是你自己的選擇——你選擇修補還是重建？",
    basis: ["傾否","否之匪人","心境修行"] },
  { id: "rf-012-spiritual-3", category: "spiritual", categoryName: "心境修行",
    question: "休否的自我暫停每次只需幾分鐘但關鍵在於頻率——你每天能執行多少次短暫暫停來切斷自動化負面思維？傾否的價值重估從舊體系廢墟到新穩定結構通常需要幾個月，在此期間你如何防止走向虛無——推翻舊價值卻不建立新信念？",
    basis: ["休否","傾否","心境修行"] }
];

// ============================================================================
// Replace entries for hex 11 and hex 12
// ============================================================================
const hex11ById = new Map(hex11Questions.map(q => [q.id, q]));
const hex12ById = new Map(hex12Questions.map(q => [q.id, q]));
let replaced11 = 0;
let replaced12 = 0;

for (let i = 0; i < allEntries.length; i++) {
  const entry = allEntries[i];
  if (entry.hexagramId === 11 && hex11ById.has(entry.id)) {
    const newData = hex11ById.get(entry.id);
    entry.question = newData.question;
    entry.basis = newData.basis;
    entry.qualityLevel = "refined";
    entry.reviewed = false;
    entry.needsHumanReview = true;
    entry.reviewedBy = "stage3-refl-hex11";
    entry.reviewedAt = now;
    entry.version = "3.0.0-stage3-refl";
    replaced11++;
  }
  if (entry.hexagramId === 12 && hex12ById.has(entry.id)) {
    const newData = hex12ById.get(entry.id);
    entry.question = newData.question;
    entry.basis = newData.basis;
    entry.qualityLevel = "refined";
    entry.reviewed = false;
    entry.needsHumanReview = true;
    entry.reviewedBy = "stage3-refl-hex12";
    entry.reviewedAt = now;
    entry.version = "3.0.0-stage3-refl";
    replaced12++;
  }
}

console.log(`Replaced hex 11: ${replaced11}/36`);
console.log(`Replaced hex 12: ${replaced12}/36`);

// ============================================================================
// Verification
// ============================================================================
const h11Updated = allEntries.filter(e => e.hexagramId === 11);
const h12Updated = allEntries.filter(e => e.hexagramId === 12);

const ALL_CATEGORIES = ["general","career","love","money","people","family","study","health","decision","business","legal","spiritual"];

function verifyHex(arr, hexId, hexName) {
  let allPass = true;

  // Check all 12 categories present with 3 questions each
  const byCat = {};
  for (const e of arr) {
    byCat[e.category] = (byCat[e.category] || 0) + 1;
  }
  const missingCats = ALL_CATEGORIES.filter(c => !byCat[c]);
  const incompleteCats = ALL_CATEGORIES.filter(c => byCat[c] !== 3);
  if (missingCats.length > 0) {
    console.log(`Hex ${hexId} MISSING categories: ${missingCats.join(", ")}`);
    allPass = false;
  }
  if (incompleteCats.length > 0) {
    console.log(`Hex ${hexId} INCOMPLETE categories (not 3 each): ${incompleteCats.map(c => `${c}=${byCat[c]}`).join(", ")}`);
    allPass = false;
  }

  // Check lengths (38-105 chars), ends with ?, qualityLevel/fields
  let lenFail = 0;
  let qFail = 0;
  let fieldFail = 0;
  let noHexImg = 0;

  for (const e of arr) {
    const q = e.question || "";
    if (q.length < 38 || q.length > 105) {
      lenFail++;
      console.log(`  LEN FAIL [${e.id}]: ${q.length} chars`);
    }
    if (!q.endsWith("？")) {
      qFail++;
      console.log(`  QMARK FAIL [${e.id}]: does not end with ？`);
    }
    if (e.qualityLevel !== "refined" || e.reviewed !== false || e.needsHumanReview !== true) {
      fieldFail++;
      console.log(`  FIELD FAIL [${e.id}]: ql=${e.qualityLevel} rv=${e.reviewed} nhr=${e.needsHumanReview}`);
    }

    // Check hex-specific imagery: at least some basis entries contain hex imagery
    const basis = e.basis || [];
    const hexTerms = hexId === 11
      ? ["小往大來","天地交","無平不陂","無往不復","包荒","拔茅茹","用馮河","城復于隍","帝乙歸妹","不富以其鄰","財成天地"]
      : ["天地不交","否之匪人","休否","傾否","儉德辟難","大往小來","包承","包羞","有命無咎"];
    const hasHexTerm = basis.some(b => hexTerms.some(t => b.includes(t)));
    if (!hasHexTerm) {
      noHexImg++;
      console.log(`  IMG FAIL [${e.id}]: no hex imagery in basis`);
    }
  }

  console.log(`Hex ${hexId} (${hexName}):`);
  console.log(`  Categories: ${Object.keys(byCat).length}/12, Questions: ${arr.length}/36`);
  console.log(`  Length (38-105): ${lenFail === 0 ? "ALL PASS" : `${lenFail} FAIL`}`);
  console.log(`  Question mark: ${qFail === 0 ? "ALL PASS" : `${qFail} FAIL`}`);
  console.log(`  Field values: ${fieldFail === 0 ? "ALL PASS" : `${fieldFail} FAIL`}`);
  console.log(`  Hex imagery in basis: ${noHexImg === 0 ? "ALL PASS" : `${noHexImg} FAIL (${36 - noHexImg}/36 have imagery)`}`);

  if (lenFail > 0 || qFail > 0 || fieldFail > 0 || noHexImg > 0) allPass = false;

  // Uniqueness check
  function normQ(text) {
    return String(text || "")
      .replace(/小往大來|拔茅茹|包荒|用馮河|帝乙歸妹|城復于隍|天地交|財成天地|無平不陂|無往不復|不富以其鄰|否之匪人|大往小來|包承|包羞|有命無咎|休否|傾否|天地不交|儉德辟難/g, "")
      .replace(/[，。、；：！？「」\s\d]/g, "")
      .substring(0, 80);
  }

  // Per-group uniqueness (within each category, 3 questions should be distinct)
  let groupUniqOk = 0;
  let groupUniqFail = 0;
  for (const cat of ALL_CATEGORIES) {
    const group = arr.filter(e => e.category === cat).map(e => normQ(e.question));
    const unique = new Set(group).size;
    if (unique === 3) {
      groupUniqOk++;
    } else {
      groupUniqFail++;
      console.log(`  UNIQ FAIL [${cat}]: only ${unique}/3 unique in group`);
    }
  }
  console.log(`  Per-group uniqueness: ${groupUniqOk}/12 groups fully unique, ${groupUniqFail} failures`);

  // Per-hex uniqueness
  const allNorm = arr.map(e => normQ(e.question));
  const hexUniq = new Set(allNorm).size;
  const hexUniqOk = hexUniq >= 32;
  console.log(`  Per-hex uniqueness: ${hexUniq}/36 unique (need >=32) ${hexUniqOk ? "PASS" : "FAIL"}`);
  if (!hexUniqOk) allPass = false;

  return allPass;
}

console.log("\n=== VERIFICATION ===");
const p11 = verifyHex(h11Updated, 11, "泰");
console.log("");
const p12 = verifyHex(h12Updated, 12, "否");

// ============================================================================
// Write back
// ============================================================================
const output = "window.Zero1MatrixData = window.Zero1MatrixData || {};\nwindow.Zero1MatrixData.reflectionQuestions = " + JSON.stringify(allEntries) + ";";
fs.writeFileSync(DATA_FILE, output, 'utf8');
console.log(`\nWritten: ${DATA_FILE}`);
console.log(`Total entries: ${allEntries.length}`);

// ============================================================================
// Verify written file with node --check equivalent
// ============================================================================
const verifyRaw = fs.readFileSync(DATA_FILE, 'utf8');
const verifyMatch = verifyRaw.match(/^window\.Zero1MatrixData = window\.Zero1MatrixData \|\| \{\};\nwindow\.Zero1MatrixData\.reflectionQuestions = \[.*\];$/s);
console.log(`File format: ${verifyMatch ? "CORRECT" : "MISMATCH"}`);

try {
  new Function(verifyRaw);
  console.log("node --check equivalent: PASS (no syntax errors)");
} catch (e) {
  console.log("node --check equivalent: FAIL - " + e.message);
}

console.log(`\nOverall: ${(p11 && p12) ? "ALL PASS" : "SOME FAILURES"}`);
console.log("Done: stage3_refl_hex11_12");