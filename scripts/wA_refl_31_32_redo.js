// wA_refl_31_32_redo.js — REGENERATE all 72 reflection questions for hex 31 & 32
// Fixes the "3 template skeletons rotated across 12 categories" bug
// Mandatory normalized uniqueness check before writeFileSync
const fs = require('fs');

// ============================================================================
// IMAGERY LISTS per category (as specified in requirements)
// ============================================================================
const hex31Imagery = {
  general:    ['山上有澤', '憧憧往來', '咸其拇'],
  career:     ['咸其腓', '執其隨', '憧憧往來'],
  love:       ['咸其拇', '咸其股', '咸其輔頰舌'],
  money:      ['執其隨', '憧憧往來', '咸其腓'],
  people:     ['憧憧往來', '咸其輔頰舌', '山上有澤'],
  family:     ['咸其拇', '咸其脢', '執其隨'],
  study:      ['咸其股', '憧憧往來', '山上有澤'],
  health:     ['咸其脢', '執其隨', '咸其拇'],
  decision:   ['憧憧往來', '執其隨', '咸其輔頰舌'],
  business:   ['山上有澤', '咸其股', '憧憧往來'],
  legal:      ['執其隨', '咸其輔頰舌', '咸其腓'],
  spiritual:  ['咸其脢', '山上有澤', '憧憧往來'],
};

const hex32Imagery = {
  general:    ['雷風恆', '君子以立不易方', '恆其德'],
  career:     ['不恆其德', '田無禽', '君子以立不易方'],
  love:       ['浚恆', '恆其德', '悔亡'],
  money:      ['振恆', '不恆其德', '田無禽'],
  people:     ['君子以立不易方', '不恆其德', '振恆'],
  family:     ['恆其德', '悔亡', '浚恆'],
  study:      ['田無禽', '君子以立不易方', '雷風恆'],
  health:     ['悔亡', '振恆', '浚恆'],
  decision:   ['浚恆', '振恆', '不恆其德'],
  business:   ['雷風恆', '田無禽', '恆其德'],
  legal:      ['不恆其德', '君子以立不易方', '振恆'],
  spiritual:  ['君子以立不易方', '雷風恆', '恆其德'],
};

// ============================================================================
// HEX 31 咸 (澤山咸) — Genuinely distinct sentence structures per category
// Core: 感應吸引、互相影響、身體到語言、關係節奏
// Q1=state, Q2=choice (2 real options with 還是), Q3=risk/boundary/timing
// ============================================================================
const hex31 = {
  general: [
    '山上有澤的交感格局中，澤水無聲浸潤山體——你此刻的生命場域裡，哪些無形的感應正在重塑你對自身處境的認知？',
    '咸其拇喻示感應始於最微小的觸動：你是選擇先踏出那謹慎的第一步讓世界回應你，還是穩守原地等對方的訊號先到達才有所行動？',
    '憧憧往來如無數念頭在人我感應中穿梭碰撞，你該在情緒共鳴累積到什麼程度時主動設立屏障以免被他人能量淹沒自己的判斷？'
  ],
  career: [
    '咸其腓的小腿感應說明你正處在職涯起跑的階段——你目前的位置是讓你每一步都有踏實的回饋，還是小腿早已麻木只是在機械移動？',
    '執其隨意味著你必須跟從某個方向前進：你是選擇那條專業過硬但溝通冰冷的技術型主管之路，還是投入那個善於協調但缺乏遠景的關係型領導麾下？',
    '憧憧往來的職場機會像潮汐反覆推送又撤退，你該在第幾次同一個機會反覆出現時就果斷抓住，而非等到浪退後才後悔猶豫太久？'
  ],
  love: [
    '咸其拇的初動感應猶如腳趾輕觸對方靈魂的邊緣——你此刻對某人的好感，是源於真實共振，還是孤獨製造的幻覺投射？',
    '咸其股讓你坐立不安、難以自持：你是選擇正面表白那份悸動並坦然接受任何結果，還是用沉默壓抑情感以保住現有關係的安穩不被打破？',
    '咸其輔頰舌的言語感應一旦越界便成浮詞虛語——你在親密對話中該在言辭觸及對方哪個敏感層面時就立即收住以避免信任開始崩裂？'
  ],
  money: [
    '執其隨讓你在理財上被動跟從他人的判斷——你目前的資金配置，是出於自己對風險的清晰認識，還是只因身邊的人都這麼做就跟著投入？',
    '憧憧往來恰似市場中無數真假訊號交織：你是選擇鎖定一條穩健的長期儲蓄路徑讓複利如山累積，還是利用短期波動靈活調度資金以爭取更快增長？',
    '咸其腓的起步階段提示財路初開但根基尚淺——你在某項投資的累計虧損達到本金多少比例時，就必須觸發停損機制而非幻想回本？'
  ],
  people: [
    '憧憧往來的人際潮水中，你此刻在群體裡的合作模式是互相激發創造力的雙向流動，還是單向輸出後感到被掏空的疲憊循環？',
    '咸其輔頰舌的言辭感應賦予你影響他人的表達力：你是選擇用坦誠直接的話語換取少數人的深度信任，還是以圓融得體的溝通維持廣泛但淺層的人際網絡？',
    '山上有澤提醒山澤相融卻各有邊界——你在合作關係中何時該從全然接納的狀態轉為明確說「不」，才不至於讓自己的資源被無節制地消耗？'
  ],
  family: [
    '咸其拇的微小觸碰是家庭感應的起點——你當前的親子關係是否仍保有那份最初的敏銳覺知，還是日常瑣碎早已讓彼此對對方的情緒變化麻木無感？',
    '咸其脢的背部感應意味著你背負著家族期望卻無法親眼看見全貌：你是選擇默默扛起這無言的重量繼續向前，還是坐下來把背後的壓力攤在家人面前坦誠協商？',
    '執其隨的家庭角色讓你在代際期待中習慣了服從——你在人生的哪個轉折點必須從遵從長輩規劃切換為獨立為自己做出重大決定？'
  ],
  study: [
    '咸其股的坐姿感應暗示你像久坐不動的求學者——你目前的知識吸收是否已停滯在理論層面而遲遲未能轉化為實際操作的能力？',
    '憧憧往來如同無數知識碎片在腦中紛飛碰撞：你是選擇鎖定一門核心技能反覆打磨直到精通如山，還是跨領域廣泛閱讀以保持思維的靈活度與廣闊視野？',
    '山上有澤的感通格局提醒學習需要感應與沉澱交替——你該在積累了多少個月的純理論輸入後就強制自己進入實踐階段，否則知識將永遠懸浮在空中？'
  ],
  health: [
    '咸其脢的背部感應是身體在替你承擔看不見的壓力——你近期是否察覺到某些反覆出現的身體緊繃，其實是情緒長期壓抑後在軀體上留下的印記？',
    '執其隨的跟從模式讓你的健康習慣依附於外在權威：你是選擇嚴格依照專業教練制定的訓練計畫執行，還是傾聽自己身體當下的直覺來調整節奏與強度？',
    '咸其拇的腳趾警訊是全身最早出現的微弱信號——你在身體出現哪類不適的初期徵兆時就該安排專業評估，而非等到問題放大後才匆忙就醫？'
  ],
  decision: [
    '憧憧往來的萬千思緒在你面對抉擇時如無數岔路同時展開——你此刻的決策狀態是被選項的多樣性癱瘓了判斷，還是仍保持著清晰的優先序？',
    '執其隨要求你在跟從直覺與聽從數據之間做出選擇：你是選擇憑第一感的敏銳迅速拍板然後承擔一切後果，還是收集更多外部證據反覆推演直到最後一刻才定案？',
    '咸其輔頰舌提醒一句說出口的決定就再也無法收回——你在做出那個可能徹底改變關係或局面的宣告之前，需要給自己設定多長的最後冷靜期以免衝動釀禍？'
  ],
  business: [
    '山上有澤的感通格局在商業中象徵流動資金與固定根基的呼應——你目前的商業模式是否實現了現金流與核心資產之間的健康循環，還是兩者已脫節？',
    '咸其股暗示商業行動前的坐立不安：你是選擇穩固現有市場板塊持續深耕提高護城河，還是大膽投入新產品線搶占尚未被定義的藍海空間？',
    '憧憧往來的商業合作邀約如走馬燈般輪轉——你在同步洽談多少個潛在合作方之後就必須鎖定其中一兩個深入推進，才不會讓團隊精力被無效分散？'
  ],
  legal: [
    '執其隨的法律處境讓你處於被動跟從程序的一方——你目前的案件或合約談判，是你在主導節奏，還是對方完全掌控了每一步的推進時程？',
    '咸其輔頰舌的口頭承諾在法律上模糊且難以舉證：你是選擇堅持逐條以書面契約明定權責以保護自身利益，還是基於雙方的信任基礎先以口頭共識推進再補文件？',
    '咸其腓的起步感應意味法律行動剛啟動但根基不穩——你在訴訟或仲裁進行到哪個具體環節時，就該認真評估和解的可能性而非一味追求全贏？'
  ],
  spiritual: [
    '咸其脢的背部感應指向那些你無法直接注視的內在陰影——你此刻的心靈狀態是否承載著某種你尚未命名卻深刻左右你選擇的無形力量？',
    '山上有澤的天地感通開闢兩條靈性路徑：你是選擇在山巔靜觀澤水映照天光以求得頓悟式的覺醒，還是涉入水中親歷流動以體驗漸修式的轉化？',
    '憧憧往來的妄念在靜心中翻騰不休——你在冥想或內觀練習時，該在第幾個念頭浮現時就重新錨定注意力，才不會讓整段練習徹底散亂而毫無收穫？'
  ],
};

// ============================================================================
// HEX 32 恆 (雷風恆) — Genuinely distinct sentence structures per category
// Core: 長期性、穩定制度、持續vs僵化、可維持節奏
// ============================================================================
const hex32 = {
  general: [
    '雷風恆的宇宙常道是雷動風行各居其位——你目前的生命節奏中，哪些恆常不變的習慣或信念正默默地支撐你度過眼前的變動期？',
    '君子以立不易方要求在外境變幻中守住內在定錨：你是選擇以雷的剛健堅守一個不可撼動的核心原則，還是如風般隨境調整立場以換取更大的生存彈性？',
    '恆其德的修養需要時間淬煉至骨髓——你正在培養的某項品德，要做到什麼程度才算是已內化為本能反應而非仍需刻意提醒自己？'
  ],
  career: [
    '不恆其德暗示你在職場上方向頻繁轉換——你目前的職業軌跡是策略性地在不同領域積累拼圖，還是因為缺乏定力而每次都在半途放棄？',
    '田無禽如耕耘多時卻未見收成：你是選擇在當前的專業領域繼續投入耐心等待行業周期的回暖，還是果斷轉換跑道去一個風險更高但回報更快的新賽道？',
    '君子以立不易方提醒在一個位置上待得夠久才有累積——你在目前職位停留多長時間仍看不到晉升或技能成長時，就該認定此處已無上升空間而啟動轉換計畫？'
  ],
  love: [
    '浚恆的過度深究讓你在感情中不斷挖掘對方心意的底層——你當前的關係狀態是否因為追問太深而把本該清澈的水攪成了無法看透的泥漿？',
    '恆其德的情感承諾是一場長期考驗：你是選擇在一段日趨平淡但地基扎實的關係中堅守當初的誓言，還是追隨內心重新燃起的悸動去探索未知的情感可能？',
    '悔亡代表悔恨終將消散——你在一段重要感情畫下句點後，需要為自己設立多長的情緒療癒期，才不會讓未竟的悔亡殘留干擾你對下一段關係的判斷？'
  ],
  money: [
    '振恆的財務震盪讓你無法建立穩定的節奏——你目前的收支結構是像地震中的建築那樣搖晃不定，還是已有足夠的應急儲備來吸收短期衝擊？',
    '不恆其德的理財方式意味著缺乏紀律：你是選擇鎖定一套嚴格的預算框架即使生活彈性受限也要執行到底，還是保持靈活的消費模式讓自己享受當下的品質？',
    '田無禽警告投入資源卻長期無回報的風險——你在連續幾個月的投資或副業都未產生正向現金流時，就該果斷喊停重新評估而非繼續填補虧損？'
  ],
  people: [
    '君子以立不易方的交友哲學講求恆定——你當前的社交結構是以少數幾個多年不變的核心朋友為支柱，還是不斷更替新面孔卻難以建立深層連結？',
    '不恆其德的人際關係因缺乏持續投入而脆弱：你是選擇縮小社交圈把真誠的時間投注在幾段老友情誼上深耕，還是保持廣泛結交的習慣讓社交網絡充滿新鮮能量？',
    '振恆的人際震盪預示舊有關係格局可能瓦解——你在察覺一段友誼開始出現裂痕後，經過多少次主動修復的嘗試仍未見改善時，就該設立邊界接受這段關係的自然終結？'
  ],
  family: [
    '恆其德作為家庭倫常的基石——你目前對家庭責任的堅守，是發自內心認同這份義務的恆定感，還是僅僅迫於社會與親族的期待而勉強維持？',
    '悔亡指向家族中未曾化解的舊日傷痕：你是選擇主動發起一次徹底的坦誠對話去面對那些被塵封的矛盾，還是繼續讓時間以極慢的速度自然撫平一切？',
    '浚恆提醒對家人追問過深往往適得其反——你在探詢家中某個敏感話題時，問到哪個層次就該主動收手給彼此留下緩衝，否則關係將產生難以修復的裂痕？'
  ],
  study: [
    '田無禽的學習困境讓你感到時間投入與成果完全不成比例——你目前的學習方法是否一直在錯誤的路徑上反覆耕耘，卻從未停下來檢視方法的有效性？',
    '君子以立不易方的治學態度：你是選擇鎖定一個學術領域終身鑽研以建立不可動搖的專業根基，還是跨學科融合多方知識在交叉地帶尋找獨特的創新視角？',
    '雷風恆的學習節奏要求恆常與變化交替——你該在每日固定學習幾個小時後就強制切換模式讓大腦進入休息狀態，否則持續衰減的效率只會讓投入變成自我安慰？'
  ],
  health: [
    '悔亡的消逝感讓你以為舊疾已經遠離——你當前的健康狀態是真正擺脫了過去反覆出現的隱患根源，還是僅僅處於發作間歇期而問題仍在暗處累積？',
    '振恆的身體震盪打亂了你原有的健康節奏：你是選擇回到最基礎的作息與飲食規律從根源重建身體的恆定狀態，還是依靠更強效的藥物或補充劑快速壓制眼前的症狀？',
    '浚恆的過度深求對身體是持續消耗——你在追求減重或增肌等健康目標時，該在身體發出哪類明確的過勞訊號時就立即放緩速度，以免從鍛鍊變成傷害？'
  ],
  decision: [
    '浚恆讓你在決策過程中陷入對細節的無盡深挖——你當前的判斷狀態是否已被分析癱瘓，手上握著大量資訊卻遲遲無法將它們整合為一個清晰的選擇？',
    '振恆的震盪帶來打破僵局的契機：你是選擇在動盪中果斷推翻原有方案另闢蹊徑如雷破長空，還是穩住現有框架進行小幅迭代如風徐徐推進？',
    '不恆其德警告反覆推翻決定的代價遠高於一次錯誤——你在一個重大抉擇上允許自己最多來回推翻多少次，就必須鎖定方向設立底線全力執行而不再回頭猶豫？'
  ],
  business: [
    '雷風恆的商業恆常之道在於找到不隨風向漂移的核心價值——你目前的經營是否已經識別出那些無論市場如何變化都不會失去競爭力的根基能力？',
    '田無禽如將資源投入卻遲遲未見商業轉化：你是選擇堅持當前的商業模式繼續培育市場等待用戶習慣養成，還是迅速調整策略轉向已被驗證的獲利方向？',
    '恆其德的商業信譽需要持續累積才能轉化為品牌資產——你在一個新市場堅持多長時間仍未達成盈虧平衡時，就該判斷是策略問題還是時機未到而做出調整？'
  ],
  legal: [
    '不恆其德的法律立場搖擺讓你在糾紛中失去可信度——你目前的案件或合約談判，是否因為立場反覆而讓對方察覺到你的底線其實並不牢固？',
    '君子以立不易方的法律原則考驗價值取捨：你是選擇在每個案件中嚴格堅守程序正義哪怕最終結果對你不利，還是靈活運用法律空間以追求最有利的實質結果？',
    '振恆的震盪預示法律糾紛可能在短時間內突然升級——你在收到對方首次強硬的法律行動通知後，必須在多少個工作日內做出正式回應才不致陷入無法逆轉的被動？'
  ],
  spiritual: [
    '君子以立不易方指向靈性修為中那個不可動搖的內在定錨——你當前的內在狀態是否已經找到了無論外在風雨如何都不會偏移的核心信念？',
    '雷風恆的宇宙節奏提供兩條修行路徑：你是選擇以雷的剛健之力主動衝破自我的限制以追求靈性躍升，還是以風的柔順之德順應自然節奏讓轉化在不知不覺中發生？',
    '恆其德的靈性修養最忌半途而廢——你在每日的靜心或修行練習中，該設定什麼樣的最低時間門檻作為不退轉的底線，才不會在忙碌中輕易妥協而放棄？'
  ],
};

// ============================================================================
// CATEGORY ORDER
// ============================================================================
const categories = [
  'general', 'career', 'love', 'money', 'people', 'family',
  'study', 'health', 'decision', 'business', 'legal', 'spiritual',
];

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

function validate(questions, hexName, imageryMap) {
  const errors = [];
  for (const cat of categories) {
    const qs = questions[cat];
    if (!qs || qs.length !== 3) {
      errors.push(`${hexName}/${cat}: expected 3 questions, got ${qs ? qs.length : 0}`);
      continue;
    }
    const imgs = imageryMap[cat];
    let imageryCount = 0;
    for (const img of imgs) {
      if (qs.some(q => q.includes(img))) imageryCount++;
    }
    if (imageryCount < 2) {
      errors.push(`${hexName}/${cat}: only ${imageryCount}/3 imagery terms used (need >=2)`);
    }
    for (let i = 0; i < 3; i++) {
      const q = qs[i];
      if (q.length < 38 || q.length > 105) {
        errors.push(`${hexName}/${cat}/Q${i + 1}: length ${q.length} (need 38-105)`);
      }
      if (!q.endsWith('？')) {
        errors.push(`${hexName}/${cat}/Q${i + 1}: does not end with ？`);
      }
      const openMarkers = ['哪', '什麼', '何', '多少', '如何', '怎', '是否', '還是', '多久', '多長', '多深', '幾', '几'];
      if (!openMarkers.some(m => q.includes(m))) {
        errors.push(`${hexName}/${cat}/Q${i + 1}: may not be open-ended`);
      }
      // Q1=state check
      if (i === 0) {
        const stateMarkers = ['狀態', '處於', '階段', '是否', '目前', '當前', '此刻', '還在'];
        if (!stateMarkers.some(m => q.includes(m))) {
          errors.push(`${hexName}/${cat}/Q1: should be state-oriented`);
        }
      }
      // Q2=choice check
      if (i === 1) {
        if (!q.includes('還是') && !q.includes('还是')) {
          errors.push(`${hexName}/${cat}/Q2: should be choice-oriented with 還是`);
        }
      }
      // Q3=risk/boundary/timing check
      if (i === 2) {
        const riskMarkers = ['何時', '多少天', '多久', '幾個月', '哪個階段', '多少個', '第幾個', '第幾次', '界限', '邊界', '風險', '止損', '退出', '緩衝', '時機', '窗口', '何種', '多少次', '什麼深度', '什麼程度', '天內', '多長', '幾個小時', '底線', '比例', '層次', '層面', '環節', '訊號', '信號', '工作日', '轉折點'];
        if (!riskMarkers.some(m => q.includes(m))) {
          errors.push(`${hexName}/${cat}/Q3: should be risk/boundary/timing-oriented`);
        }
      }
    }
  }
  return errors;
}

// ============================================================================
// NORMALIZED UNIQUENESS — the key fix
// ============================================================================
const HEX_NAME_TOKENS = ['咸', '恆', '澤山咸', '雷風恆'];
const ALL_IMAGERY = [
  ...Object.values(hex31Imagery).flat(),
  ...Object.values(hex32Imagery).flat(),
];
const ALL_CATEGORY_NAMES = [
  '一般', '工作事業', '感情關係', '財務金錢', '人際合作', '家庭親人',
  '學習考試', '身心狀態', '重大決策', '創業經營', '官非合約', '心境修行',
];
const COMMON_WORDS = new Set([
  '的', '你', '我', '他', '她', '是', '在', '了', '有', '不', '這', '那', '著',
  '也', '都', '就', '會', '要', '能', '可以', '一個', '一種', '一些', '什麼',
  '目前', '當前', '此刻', '選擇', '狀態', '是否', '還是', '或者', '已經',
  '自己', '對方', '這個', '那個', '需要', '應該', '如果', '因為', '所以',
  '沒有', '可以', '可能', '已經', '覺得', '認為', '知道', '了解', '理解',
  '進行', '使用', '透過', '經過', '來自', '對於', '關於', '這樣', '那樣',
  '之間', '之中', '之後', '之前', '裡面', '外面', '時候', '什麼時候',
  '多少', '如何', '為什麼', '怎麼', '哪裡', '哪個', '怎樣', '做', '讓',
  '把', '被', '從', '對', '向', '到', '給', '和', '與', '或', '而', '但',
  '卻', '才', '就', '便', '還', '又', '再', '更', '最', '很', '太', '非常',
  '比較', '相當', '特別', '完全', '根本', '確實', '也許', '大概', '一定',
  '必須', '必然', '當然', '突然', '終於', '已經', '曾經', '正在', '將會',
  '繼續', '開始', '結束', '完成', '實現', '發生', '出現', '存在', '變化',
  '改變', '發展', '成長', '進步', '改善', '提升', '降低', '增加', '減少',
  '機會', '問題', '方式', '方法', '方向', '目標', '結果', '過程', '關係',
  '影響', '作用', '功能', '意義', '價值', '基礎', '條件', '情況', '環境',
  '資源', '能力', '經驗', '知識', '技能', '態度', '觀念', '想法', '感受',
  '情緒', '心理', '行為', '習慣', '模式', '結構', '系統', '機制', '節奏',
  '時機', '時間', '空間', '壓力', '風險', '挑戰', '困難', '限制', '障礙',
  '平衡', '穩定', '持續', '長期', '短期', '正面', '負面', '積極', '消極',
  '主動', '被動', '明顯', '清楚', '模糊', '確定', '不確定', '安全', '危險',
  '成功', '失敗', '得失', '選擇', '決定', '判斷', '評估', '分析', '考慮',
  '思考', '反思', '檢視', '觀察', '注意', '重視', '忽略', '堅持', '放棄',
  '接受', '拒絕', '面對', '逃避', '追求', '避開', '投入', '退出', '進入',
  '離開', '保持', '調整', '適應', '突破', '限制', '建立', '破壞', '維護',
  '修復', '創造', '消滅', '擴大', '縮小', '深入', '淺出', '快', '慢',
  '多', '少', '大', '小', '高', '低', '強', '弱', '深', '淺', '遠', '近',
  '新', '舊', '好', '壞', '對', '錯', '真', '假', '實', '虛', '內', '外',
  '上', '下', '前', '後', '左', '右', '整體', '局部', '全局', '細節',
  '核心', '邊緣', '中心', '周圍', '生命', '生活', '工作', '學習', '健康',
  '愛情', '金錢', '家庭', '朋友', '社交', '事業', '商業', '法律', '心靈',
  '精神', '身體', '心理', '靈魂', '內心', '外在', '內在',
]);

function normalize(str) {
  let s = str;
  // strip hex names
  for (const t of HEX_NAME_TOKENS) s = s.split(t).join('');
  // strip imagery terms (longest first to avoid partial collisions)
  const sortedImagery = [...ALL_IMAGERY].sort((a, b) => b.length - a.length);
  for (const t of sortedImagery) s = s.split(t).join('');
  // strip category names
  for (const c of ALL_CATEGORY_NAMES) s = s.split(c).join('');
  // strip punctuation and whitespace
  s = s.replace(/[，。？！、：；「」『』（）…—\-\s]/g, '');
  // strip common words
  const segments = [];
  let current = '';
  for (const ch of s) {
    current += ch;
    // try to match multi-char common words
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

function checkUniqueness(questions, hexLabel) {
  const allQs = [];
  for (const cat of categories) {
    for (let i = 0; i < 3; i++) {
      allQs.push({ cat, idx: i, text: questions[cat][i], id: `${hexLabel}/${cat}/Q${i + 1}` });
    }
  }
  const normed = allQs.map(q => normalize(q.text));
  const seen = new Map();
  normed.forEach((n, i) => {
    if (!seen.has(n)) seen.set(n, []);
    seen.get(n).push(allQs[i].id);
  });
  let uniqueCount = 0;
  const dupGroups = [];
  for (const [n, ids] of seen.entries()) {
    if (ids.length === 1) {
      uniqueCount++;
    } else {
      dupGroups.push(ids);
    }
  }
  return { total: allQs.length, uniqueCount, dupGroups, seen };
}

// ============================================================================
// BUILD OUTPUT
// ============================================================================
function buildOutput(questions, hexNum, imageryMap) {
  const output = [];
  for (const cat of categories) {
    const imgs = imageryMap[cat];
    output.push({
      hexagram: hexNum,
      category: cat,
      questionType: 'state',
      question: questions[cat][0],
      imagery: imgs,
      qualityLevel: 'refined',
      reviewed: false,
      needsHumanReview: true,
    });
    output.push({
      hexagram: hexNum,
      category: cat,
      questionType: 'choice',
      question: questions[cat][1],
      imagery: imgs,
      qualityLevel: 'refined',
      reviewed: false,
      needsHumanReview: true,
    });
    output.push({
      hexagram: hexNum,
      category: cat,
      questionType: 'risk',
      question: questions[cat][2],
      imagery: imgs,
      qualityLevel: 'refined',
      reviewed: false,
      needsHumanReview: true,
    });
  }
  return output;
}

// ============================================================================
// RUN ALL CHECKS
// ============================================================================

// 1. Basic validation
console.log('=== VALIDATING HEX 31 (咸) ===');
const h31Errs = validate(hex31, 'hex31', hex31Imagery);
if (h31Errs.length > 0) {
  console.error('VALIDATION ERRORS:');
  h31Errs.forEach(e => console.error('  ' + e));
  process.exit(1);
}
console.log('  All 36 hex31 questions pass basic validation.');

console.log('\n=== VALIDATING HEX 32 (恆) ===');
const h32Errs = validate(hex32, 'hex32', hex32Imagery);
if (h32Errs.length > 0) {
  console.error('VALIDATION ERRORS:');
  h32Errs.forEach(e => console.error('  ' + e));
  process.exit(1);
}
console.log('  All 36 hex32 questions pass basic validation.');

// 2. Length & end-mark check
console.log('\n=== LENGTH CHECK ===');
const allEntries = [
  ...buildOutput(hex31, 31, hex31Imagery),
  ...buildOutput(hex32, 32, hex32Imagery),
];
let lengthErrors = 0;
for (const e of allEntries) {
  const len = e.question.length;
  if (len < 38 || len > 105) {
    console.error(`  FAIL: hex${e.hexagram}/${e.category}/${e.questionType}: length=${len} "${e.question}"`);
    lengthErrors++;
  }
  if (!e.question.endsWith('？')) {
    console.error(`  FAIL: hex${e.hexagram}/${e.category}/${e.questionType}: no trailing ？`);
    lengthErrors++;
  }
}
if (lengthErrors > 0) {
  console.error(`\n${lengthErrors} length/ending errors — NOT WRITING`);
  process.exit(1);
}
console.log(`  All ${allEntries.length} questions pass length (38-105) and ？ check.`);

// 3. Normalized uniqueness check — THE CRITICAL ONE
console.log('\n=== NORMALIZED UNIQUENESS CHECK ===');
const uniq31 = checkUniqueness(hex31, 'hex31');
const uniq32 = checkUniqueness(hex32, 'hex32');

console.log(`  Hex 31 (咸) normU: ${uniq31.uniqueCount}/${uniq31.total} (need >= 32/36)`);
if (uniq31.dupGroups.length > 0) {
  console.log('  Hex 31 duplicate groups:');
  uniq31.dupGroups.forEach(g => console.log('    ' + JSON.stringify(g)));
}

console.log(`  Hex 32 (恆) normU: ${uniq32.uniqueCount}/${uniq32.total} (need >= 32/36)`);
if (uniq32.dupGroups.length > 0) {
  console.log('  Hex 32 duplicate groups:');
  uniq32.dupGroups.forEach(g => console.log('    ' + JSON.stringify(g)));
}

const MIN_UNIQUE = 32;
let failed = false;
if (uniq31.uniqueCount < MIN_UNIQUE) {
  console.error(`  *** UNIQUENESS FAILED for hex31: ${uniq31.uniqueCount}/36 < ${MIN_UNIQUE}/36 ***`);
  failed = true;
}
if (uniq32.uniqueCount < MIN_UNIQUE) {
  console.error(`  *** UNIQUENESS FAILED for hex32: ${uniq32.uniqueCount}/36 < ${MIN_UNIQUE}/36 ***`);
  failed = true;
}

if (failed) {
  console.error('\nNOT WRITING FILE — fix questions and re-run.');
  process.exit(1);
}
console.log('  Uniqueness assertion PASSED for both hexagrams.');

// 4. Imagery usage per category
console.log('\n=== IMAGERY USAGE CHECK ===');
for (const [hexLabel, questions, imageryMap] of [
  ['hex31', hex31, hex31Imagery],
  ['hex32', hex32, hex32Imagery],
]) {
  for (const cat of categories) {
    const imgs = imageryMap[cat];
    let count = 0;
    const qs = questions[cat];
    const used = [];
    for (const img of imgs) {
      if (qs.some(q => q.includes(img))) {
        count++;
        used.push(img);
      }
    }
    if (count < 2) {
      console.error(`  FAIL: ${hexLabel}/${cat}: only ${count}/3 imagery used (${used.join(', ')})`);
    } else {
      console.log(`  OK: ${hexLabel}/${cat}: ${count}/3 imagery used`);
    }
  }
}

// 5. Total count check
if (allEntries.length !== 72) {
  console.error(`\n*** COUNT ERROR: expected 72, got ${allEntries.length} ***`);
  process.exit(1);
}

// ============================================================================
// WRITE FILE
// ============================================================================
const filePath = 'D:\\AI_PROJECTS\\Zero1Matrix\\data\\wA_refl_31_32.json';
const dir = 'D:\\AI_PROJECTS\\Zero1Matrix\\data';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(filePath, JSON.stringify(allEntries, null, 2), 'utf-8');

console.log(`\n=== WRITTEN ===`);
console.log(`  ${allEntries.length} questions → ${filePath}`);
console.log(`  Hex 31 normU: ${uniq31.uniqueCount}/36`);
console.log(`  Hex 32 normU: ${uniq32.uniqueCount}/36`);
console.log(`  qualityLevel: refined, reviewed: false, needsHumanReview: true`);