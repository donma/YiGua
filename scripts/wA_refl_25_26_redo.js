'use strict';
/**
 * wA_refl_25_26_redo.js — REGENERATE all 72 reflection questions for
 * Hexagram 25 (無妄) and Hexagram 26 (大畜) with TRULY DISTINCT
 * sentence structures per category — no template-and-swap.
 *
 * Each question is independently composed for that category's
 * specific real-world context. At least 2 of 3 per group use
 * hex-specific imagery (卦辭/爻辭 terms).
 *
 * MANDATORY in-script verification:
 *   1. All 72 questions >=38 && <=105 chars, end with ？
 *   2. normU >= 32/36 per hex (normalized uniqueness)
 *   3. Do NOT write until BOTH checks pass.
 */
const vm = require('vm');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const DATA_PATH = path.join(__dirname, '..', 'src', 'data', 'reflectionQuestions.data.js');

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

// ============================================================================
// HEX 25 無妄 (天雷無妄) — 不虛妄、意外事件、順應真實、正當行動vs妄動
// Imagery: 無妄往吉, 不耕穫不菑畬, 無妄之災, 或繫之牛, 無妄之疾勿藥有喜,
//          無妄行有眚, 天下雷行
// ============================================================================
const HEX25 = {
  hexagramId: 25,
  hexagramName: '無妄',
  full: '天雷無妄',
  data: {
    // general: 無妄往吉, 天下雷行, 無妄之災
    general: {
      imgs: ['無妄往吉', '天下雷行', '無妄之災'],
      q1: '當天下雷行般的突發變動接連出現時，你此刻的生活整體節奏是被打亂還是意外獲得了重新排序的機會？',
      q2: '在無妄往吉的提示下，你是選擇放下預設計畫順應當前情勢自然推進，還是堅持按照原有安排硬走到底？',
      q3: '什麼樣的訊號出現時，代表無妄之災已經從你能力範圍內的小波折，升級為需要徹底重新盤點整體方向的系統性意外？',
    },
    // career: 無妄往吉, 無妄行有眚, 不耕穫不菑畬
    career: {
      imgs: ['無妄往吉', '無妄行有眚', '不耕穫不菑畬'],
      q1: '你目前的職場位置，是不耕穫不菑畬那樣努力與回報暫時脫鉤的階段，還是成果正以你沒預料到的方式浮現？',
      q2: '眼前有個看似正當的職涯動作——你認為這是無妄往吉值得果斷推進的契機，還是更接近無妄行有眚一旦行動反而招損的盲動？',
      q3: '職場上哪一類決定一旦做了就很難回頭，讓你從不耕穫不菑畬的暫時等待期直接滑入無妄行有眚的錯誤軌道？',
    },
    // love: 無妄之災, 或繫之牛, 無妄之疾勿藥有喜
    love: {
      imgs: ['無妄之災', '或繫之牛', '無妄之疾勿藥有喜'],
      q1: '這段關係裡是否存在一件「或繫之牛」般的無主誤會——明明不屬於任何人的錯，卻被綁定在你們之間反覆發酵？',
      q2: '當感情出現意料之外的摩擦，你會像無妄之疾勿藥有喜那樣先觀察不強行處理，還是立刻追根究柢想找出誰對誰錯？',
      q3: '什麼樣的信任裂痕一旦出現，會讓原本可化解的無妄之災演變成或繫之牛那般雙方都被動綁死無法脫身的局面？',
    },
    // money: 不耕穫不菑畬, 無妄之災, 無妄行有眚
    money: {
      imgs: ['不耕穫不菑畬', '無妄之災', '無妄行有眚'],
      q1: '你目前的財務狀態，更像不耕穫不菑畬——投入和回報的因果鏈暫時斷開，還是無妄之災一筆非預期的支出剛好打中你的薄弱環節？',
      q2: '眼前有一筆看似合理的花費或投資，你要如何判斷這是必要配置還是無妄行有眚那類做了反而招損的妄動？',
      q3: '財務上哪個具體臨界點一旦被突破，會讓不耕穫不菑畬的短期週轉不順，惡化成無妄之災那樣需要大幅改變生活方式的長期缺口？',
    },
    // people: 無妄之災, 或繫之牛, 天下雷行
    people: {
      imgs: ['無妄之災', '或繫之牛', '天下雷行'],
      q1: '你的人際網絡中，有沒有哪段關係正處於天下雷行般的突發震盪期——對方突然的態度轉變讓你措手不及？',
      q2: '當合作夥伴捲入一場不屬於你的無妄之災，你是選擇主動站出來分擔風險，還是先保持距離等局勢明朗再表態？',
      q3: '哪種人際連帶責任一旦被綁上，就會像或繫之牛那樣讓你被動地捲入別人的問題，長期難以脫身？',
    },
    // family: 無妄之疾勿藥有喜, 不耕穫不菑畬, 無妄之災
    family: {
      imgs: ['無妄之疾勿藥有喜', '不耕穫不菑畬', '無妄之災'],
      q1: '家裡的某個矛盾是否像無妄之疾勿藥有喜所暗示的——其實不需要你刻意去「治」，給一點時間自然就會緩解？',
      q2: '面對家人之間不耕穫不菑畬般的付出不對等，你會選擇繼續默默承擔等待對方自己察覺，還是找時機把感受清楚地說出來？',
      q3: '家庭中什麼樣的無妄之災一旦發生——比如一場意外或誤解——會從單一事件蔓延成影響整個家庭結構的長期傷痕？',
    },
    // study: 不耕穫不菑畬, 無妄往吉, 無妄行有眚
    study: {
      imgs: ['不耕穫不菑畬', '無妄往吉', '無妄行有眚'],
      q1: '你目前的學習是否處於不耕穫不菑畬的狀態——明明花了很多時間，卻感覺沒有對應的進步，方法和內容之間脫節了？',
      q2: '在準備考試或進修的關鍵階段，你認為現在是無妄往吉應該信任既有基礎直接上考場，還是無妄行有眚需要再多確認一次盲點？',
      q3: '學習過程中哪一種妄動——比如考前臨時換方法或大量灌新內容——最容易讓不耕穫不菑畬的暫時卡關變成真正的失敗？',
    },
    // health: 無妄之疾勿藥有喜, 天下雷行, 無妄之災
    health: {
      imgs: ['無妄之疾勿藥有喜', '天下雷行', '無妄之災'],
      q1: '身體最近出現的不適，是像無妄之疾勿藥有喜那樣只需要調整作息就會自行恢復的短期訊號，還是天下雷行般來得突然且原因不明？',
      q2: '面對身體發出的警訊，你會選擇無妄之疾勿藥有喜先觀察一兩週讓身體自行調節，還是立刻就醫排除潛在風險？',
      q3: '生活習慣中哪一個長期被忽略的環節，最容易在某天突然觸發無妄之災——讓原本可逆的亞健康狀態變成需要長期處理的慢性問題？',
    },
    // decision: 無妄行有眚, 無妄之災, 或繫之牛
    decision: {
      imgs: ['無妄行有眚', '無妄之災', '或繫之牛'],
      q1: '你正在面對的這個重大選擇，有多少成分是出於真正的需要，又有多少其實是無妄行有眚——動機正當但時機或方式有問題的妄動？',
      q2: '眼前兩個選項中，一個可能帶來無妄之災的意外風險，另一個可能讓你像或繫之牛一樣被長期綁定——你更願意承受哪一種代價？',
      q3: '哪個時間節點一旦過了還不做決定，會讓本來只是無妄行有眚的猶豫，惡化成錯失所有選項的被動局面？',
    },
    // business: 不耕穫不菑畬, 無妄往吉, 無妄之災
    business: {
      imgs: ['不耕穫不菑畬', '無妄往吉', '無妄之災'],
      q1: '你的商業模式目前是否處於不耕穫不菑畬的尷尬期——投入的資源和市場回饋之間出現了你無法解釋的脫鉤？',
      q2: '當市場出現一個意料之外的窗口，你判斷這是無妄往吉該果斷投入的時機，還是無妄之災包裝成機會的陷阱？',
      q3: '經營上哪一類外部變數——比如政策轉向或關鍵合作夥伴退出——一旦發生，會把不耕穫不菑畬的暫時瓶頸變成危及生存的無妄之災？',
    },
    // legal: 無妄之災, 或繫之牛, 無妄行有眚
    legal: {
      imgs: ['無妄之災', '或繫之牛', '無妄行有眚'],
      q1: '你目前涉及的合約或爭議，有多少成分是真正的法律問題，有多少其實是或繫之牛般被第三方的問題連帶捲入？',
      q2: '在簽署一份看似標準的合約前，你要如何區分哪些條款屬於正常程序、哪些是無妄行有眚一旦簽下去就會在特定情境下反噬自己的隱患？',
      q3: '處理爭議的過程中，哪個具體動作一旦做出——比如在證據不全時先發聲明——會把可控的無妄之災升級為難以逆轉的法律劣勢？',
    },
    // spiritual: 天下雷行, 不耕穫不菑畬, 無妄之疾勿藥有喜
    spiritual: {
      imgs: ['天下雷行', '不耕穫不菑畬', '無妄之疾勿藥有喜'],
      q1: '當天下雷行般的外在變動不斷衝擊你的價值觀時，你內心哪個原本篤定的信念正在動搖，而哪個反而變得更清晰？',
      q2: '面對不耕穫不菑畬的狀態——你付出了真誠的努力卻看不到對等的內在成長，你會選擇繼續堅持這條路，還是重新檢視方向是否走偏了？',
      q3: '內心什麼樣的焦慮一旦被反覆壓抑，會像無妄之疾勿藥有喜提醒的那樣——不是所有問題都需要外力解決，但有些恰恰需要你主動面對才不會惡化？',
    },
  },
};

// ============================================================================
// HEX 26 大畜 (山天大畜) — 蓄積能力、約束強力、訓練制度、能量成熟
// Imagery: 有厲利已, 輿說輹, 良馬逐, 童牛之牿, 豶豕之牙, 何天之衢,
//          天在山中, 多識前言往行
// ============================================================================
const HEX26 = {
  hexagramId: 26,
  hexagramName: '大畜',
  full: '山天大畜',
  data: {
    // general: 天在山中, 何天之衢, 多識前言往行
    general: {
      imgs: ['天在山中', '何天之衢', '多識前言往行'],
      q1: '你目前的人生階段，更像天在山中——巨大潛能正被蓄積在一個看似受限的框架裡，還是何天之衢那樣已經看到通路在眼前展開？',
      q2: '在當前蓄勢待發的階段，你會選擇多識前言往行先廣泛吸收前人經驗再行動，還是相信自己直覺直接踏上何天之衢？',
      q3: '什麼樣的訊號出現時，代表天在山中的蓄積期已經過了最佳釋放點，正在從蓄力變成自我設限的停滯？',
    },
    // career: 良馬逐, 童牛之牿, 何天之衢
    career: {
      imgs: ['良馬逐', '童牛之牿', '何天之衢'],
      q1: '你目前的職涯階段，是良馬逐那樣能力與機會正在賽道上高速競逐，還是童牛之牿般被制度或上級約束住尚未獲得充分發揮的空間？',
      q2: '眼前有一個晉升或轉職的機會——你判斷這是何天之衢值得全力爭取的通道，還是需要像童牛之牿那樣先接受更多磨練再出手？',
      q3: '職涯中哪一個時間窗口一旦錯過，會讓良馬逐的黃金競逐期轉為被動等待，而非主動蓄力？',
    },
    // love: 有厲利已, 童牛之牿, 良馬逐
    love: {
      imgs: ['有厲利已', '童牛之牿', '良馬逐'],
      q1: '這段關係的節奏，是童牛之牿那樣雙方都在小心翼翼試探邊界，還是良馬逐般已經全速前進但需要留意是否有人在勉強跟隨？',
      q2: '當關係中出現有厲利已的危險訊號，你會選擇暫時停下腳步重新確認彼此的意願，還是認為繼續推進就能自然化解？',
      q3: '感情中哪一種「勉強」一旦被長期忽略——比如一方持續壓抑真實感受來配合另一方——會讓童牛之牿的保護性約束變成窒息關係的枷鎖？',
    },
    // money: 輿說輹, 有厲利已, 豶豕之牙
    money: {
      imgs: ['輿說輹', '有厲利已', '豶豕之牙'],
      q1: '你的財務結構中，有沒有哪個環節像輿說輹那樣——支撐系統的關鍵部件已經鬆動，但表面上還在運轉？',
      q2: '面對一項看似誘人的投資或消費，你如何判斷現在是有厲利已該果斷煞車的時刻，還是只是正常的風險波動？',
      q3: '財務上哪一種隱性支出——像豶豕之牙看似已拔除野性卻仍有潛在危險——一旦失控會從可控的預算超支變成結構性的償債危機？',
    },
    // people: 童牛之牿, 良馬逐, 豶豕之牙
    people: {
      imgs: ['童牛之牿', '良馬逐', '豶豕之牙'],
      q1: '你的合作關係中，有沒有哪個人像良馬逐那樣能力很強但節奏太快，讓團隊其他人疲於追趕反而降低了整體效能？',
      q2: '面對一個新合作的邀請，你傾向像童牛之牿那樣一開始就設好明確邊界，還是先全力投入等出現問題再調整？',
      q3: '人際合作中哪一類看似已解決的舊矛盾——如同豶豕之牙拔了牙的野豬——最容易在你最不設防的時候再次傷人？',
    },
    // family: 多識前言往行, 童牛之牿, 有厲利已
    family: {
      imgs: ['多識前言往行', '童牛之牿', '有厲利已'],
      q1: '家庭中長輩的經驗傳承——多識前言往行——在你目前的處境中，哪些部分仍然適用，哪些已經明顯需要重新詮釋？',
      q2: '在家庭角色的分配上，你是傾向像童牛之牿那樣從小就幫孩子或家人建立明確規矩，還是讓他們多嘗試、犯錯後再引導？',
      q3: '家庭互動中哪一種模式一旦被察覺有厲利已——比如某個成員長期承受過重負擔——再不調整就會從可修復的失衡變成關係的斷裂？',
    },
    // study: 多識前言往行, 良馬逐, 輿說輹
    study: {
      imgs: ['多識前言往行', '良馬逐', '輿說輹'],
      q1: '你目前的學習方式，是偏重多識前言往行大量吸收既有知識體系，還是良馬逐般已經進入實戰演練階段以輸出倒逼輸入？',
      q2: '當學習進度卡住時，你會選擇像檢查輿說輹那樣回頭找基礎環節的鬆動處，還是繼續加速期望用量的堆積來突破？',
      q3: '學習中最危險的「輿說輹時刻」是什麼——哪個基礎觀念一旦沒搞懂就繼續往下走，會讓後續所有進階內容都建立在錯誤的地基上？',
    },
    // health: 有厲利已, 天在山中, 輿說輹
    health: {
      imgs: ['有厲利已', '天在山中', '輿說輹'],
      q1: '你的身體是否正發出有厲利已的訊號——某個反覆出現的不適其實是在提醒你該停下來了，而不是繼續硬撐？',
      q2: '面對天在山中那樣被壓抑在體內的壓力，你會選擇透過運動或休息來釋放，還是先靠意志力撐過眼前這段高壓期？',
      q3: '身體哪一個系統就像輿說輹的關鍵部件——平時不太被注意，但一旦出問題就會導致整體運轉失靈——你最需要優先關注？',
    },
    // decision: 何天之衢, 有厲利已, 良馬逐
    decision: {
      imgs: ['何天之衢', '有厲利已', '良馬逐'],
      q1: '你眼前的決策，比較接近何天之衢那樣路徑已經清晰只需要勇氣踏上去，還是良馬逐那樣多個選項正在高速競爭讓你難以取捨？',
      q2: '當決策過程中出現有厲利已的危險訊號，你會選擇立刻暫停重新評估，還是設定一個明確的停損點後繼續推進？',
      q3: '哪個關鍵資訊一旦被你忽略或誤判，會讓原本看似何天之衢的康莊大道，實際上是通往良馬逐般消耗戰的無底賽道？',
    },
    // business: 何天之衢, 良馬逐, 天在山中
    business: {
      imgs: ['何天之衢', '良馬逐', '天在山中'],
      q1: '你的事業目前處於天在山中的蓄力階段——市場還沒看到你的真正實力，還是良馬逐般已經在賽道上和競爭對手正面對決？',
      q2: '當市場出現一條何天之衢般的明確通路，你會選擇集中所有資源全力衝刺，還是保留部分實力以防通路不如預期通暢？',
      q3: '經營中哪一個「天在山中」的潛能被你長期低估——某個團隊成員、某項技術或某個市場區隔——一旦錯過釋放時機就會被競爭對手搶先？',
    },
    // legal: 輿說輹, 豶豕之牙, 有厲利已
    legal: {
      imgs: ['輿說輹', '豶豕之牙', '有厲利已'],
      q1: '你手邊的合約或協議中，有沒有哪一條款像輿說輹那樣——平時看似無關緊要，但在特定條件觸發時會成為整個架構的致命鬆動點？',
      q2: '面對一份對方提出但條款模糊的協議，你傾向像處理豶豕之牙那樣先把潛在危險條款逐一拔除再簽，還是信任雙方關係先簽再補？',
      q3: '法律事務中哪一個有厲利已的訊號一旦出現——比如對方突然更換律師或拖延回應——代表你必須立刻改變策略而非繼續觀望？',
    },
    // spiritual: 天在山中, 多識前言往行, 何天之衢
    spiritual: {
      imgs: ['天在山中', '多識前言往行', '何天之衢'],
      q1: '你的內在狀態，是天在山中那樣深刻的能量正在安靜地蓄積，還是何天之衢已經感受到明確的方向正在召喚你前進？',
      q2: '在自我成長的路上，你目前更需要多識前言往行靜下心來吸收智慧傳統的滋養，還是放下書本直接走進何天之衢用行動來認識自己？',
      q3: '心靈探索中哪一個「天在山中」的盲區——你一直知道自己該面對卻始終繞開的內在課題——再不處理就會從可推遲的功課變成阻礙你前進的牆？',
    },
  },
};

// ============================================================================
// Build question objects
// ============================================================================
function buildQuestions(hexDef) {
  const out = [];
  for (const [catKey, catName] of CATEGORIES) {
    const d = hexDef.data[catKey];
    if (!d) throw new Error(`Missing data for hex ${hexDef.hexagramId} cat ${catKey}`);
    const entries = [d.q1, d.q2, d.q3];
    entries.forEach((question, idx) => {
      out.push({
        id: `rf-${String(hexDef.hexagramId).padStart(3, '0')}-${catKey}-${idx + 1}`,
        hexagramId: hexDef.hexagramId,
        hexagramName: hexDef.hexagramName,
        category: catKey,
        categoryName: catName,
        question,
        basis: [hexDef.hexagramName, d.imgs[idx] || d.imgs[0], catName],
        qualityLevel: 'refined',
        reviewed: false,
        needsHumanReview: true,
        version: '1.8.0-wA-refl-hex25-26-redo',
      });
    });
  }
  return out;
}

// ============================================================================
// NORMALIZED UNIQUENESS — strips hex names, imagery terms, category names,
// common words, then checks per-hex unique count >= 32/36
// ============================================================================
function normQuestion(q, hexName, allImgs, allCatNames) {
  let s = q.question;
  // Remove all hex-specific imagery terms (卦辭/爻辭 phrases)
  const allImgsFlat = allImgs.flatMap(i => [i, ...(i.length > 2 ? [i] : [])]);
  // Build a list of all terms to strip
  const termsToStrip = [
    hexName,
    '無妄', '大畜', '天雷無妄', '山天大畜', '天雷', '山天',
    ...allImgs,
  ];
  // Also strip category names
  for (const cn of allCatNames) {
    termsToStrip.push(cn);
  }
  // Strip common generic words that appear in nearly every question
  const genericWords = [
    '你', '我', '的', '是', '在', '了', '著', '嗎', '呢', '吧', '啊',
    '什麼', '哪個', '哪一', '哪些', '哪種', '這個', '那個', '這樣', '那樣',
    '目前', '現在', '當下', '眼前', '最近', '這段', '這個階段',
    '你認為', '你覺得', '你判斷', '你選擇', '你會', '你傾向',
    '比較', '還是', '或者', '還是說',
    '會讓', '會把', '會從', '會像', '會代表', '會提醒',
    '代表', '意味', '象徵',
    '如何', '怎麼', '為什麼', '是否', '有沒有',
    '一個', '一次', '一種', '一件', '一條', '一筆', '一份',
    '自己', '對方', '彼此', '之間', '之中', '當中',
    '需要', '應該', '可以', '可能', '能夠',
    '問題', '情況', '狀態', '狀況', '階段', '過程',
    '出現', '發生', '產生', '形成', '變成', '成為',
    '選擇', '決定', '判斷', '評估', '處理', '面對',
    '風險', '危險', '機會', '時機', '訊號', '跡象',
    '具體', '明顯', '真正', '關鍵', '重要', '主要',
    '已經', '正在', '即將', '尚未', '還沒有', '還未',
    '如果', '假如', '一旦', '當', '在於',
    '從', '到', '向', '對', '與', '和', '或',
    '不', '沒', '沒有', '不是',
    '讓', '把', '被', '將',
    '更', '最', '很', '太', '較',
    '卻', '但', '而', '且', '也', '就', '才', '都',
    '來', '去', '做', '說', '想', '看', '知道',
    '要', '能', '會', '該',
    '有', '無', '可', '非',
    '上', '下', '中', '內', '外',
    '大', '小', '多', '少',
    '人', '事', '物', '時', '地',
    '因為', '所以', '因此', '於是',
    '全部', '所有', '整體', '部分', '其他',
    '注意', '關注', '留意', '察覺', '發現',
    '提醒', '警示', '警告', '預警',
    '調整', '改變', '轉變', '變化',
    '前進', '後退', '停下', '暫停', '等待',
    '繼續', '開始', '結束', '完成',
    '接受', '拒絕', '放棄', '堅持',
    '行動', '動作', '行為', '做法',
    '方式', '方法', '方向', '路徑', '路線',
    '結果', '後果', '影響', '作用',
    '範圍', '邊界', '界線', '限度', '限制',
    '條件', '前提', '基礎', '根本',
    '層面', '面向', '角度', '維度',
    '第一', '第二', '第三',
    '超過', '超出', '低於', '不足',
    '長期', '短期', '暫時', '永久',
    '容易', '困難', '簡單', '複雜',
    '正常', '異常', '合理', '不合理',
    '可控', '不可控', '可逆', '不可逆',
    '主動', '被動',
    '加速', '減速', '放慢',
    '升級', '降級', '惡化', '改善',
    '累積', '消耗', '補充', '流失',
    '增加', '減少', '擴大', '縮小',
    '突破', '卡關', '瓶頸', '障礙',
    '成功', '失敗', '成長', '衰退',
    '信任', '懷疑', '支持', '反對',
    '壓力', '放鬆', '緊張', '平靜',
    '投入', '產出', '回報', '付出',
    '真實', '虛假', '正確', '錯誤',
    '過去', '未來', '現在',
  ];

  // Sort terms by length descending to strip longest first
  termsToStrip.sort((a, b) => b.length - a.length);
  for (const term of termsToStrip) {
    // Escape special regex chars
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    s = s.replace(new RegExp(escaped, 'g'), '');
  }
  // Also strip generic words
  for (const w of genericWords) {
    s = s.replace(new RegExp(w, 'g'), '');
  }
  // Remove punctuation
  s = s.replace(/[？?，,。.！!、；;：:「」『』【】（）()《》〈〉\s"'\-—…—]/g, '');
  return s;
}

function computeNormU(questions, label) {
  const hexName = questions[0].hexagramName;
  const allImgs = new Set();
  const allCatNames = new Set();
  for (const q of questions) {
    allImgs.add(q.basis[1]);
    allCatNames.add(q.categoryName);
  }
  const imgArr = Array.from(allImgs);
  const catArr = Array.from(allCatNames);

  const seen = new Map();
  let dupCount = 0;
  for (const q of questions) {
    const norm = normQuestion(q, hexName, imgArr, catArr);
    if (seen.has(norm)) {
      dupCount++;
      if (dupCount <= 5) {
        console.error(`  DUPLICATE norm: "${norm.substring(0,60)}" between ${seen.get(norm)} and ${q.id}`);
      }
    } else {
      seen.set(norm, q.id);
    }
  }
  const normU = questions.length - dupCount;
  const pct = ((normU / questions.length) * 100).toFixed(1);
  console.log(`[${label}] Normalized uniqueness: ${normU}/${questions.length} (${pct}%)`);
  return normU;
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================
function validateLengths(questions, label) {
  const bad = [];
  for (const q of questions) {
    const len = q.question.length;
    if (len < 38 || len > 105) {
      bad.push({ id: q.id, len, question: q.question });
    }
  }
  if (bad.length) {
    console.error(`[${label}] Length validation FAILED for ${bad.length} questions:`);
    bad.forEach((b) => console.error(`  ${b.id} len=${b.len}: ${b.question}`));
    throw new Error(`${label}: length validation failed`);
  }
  console.log(`[${label}] Length validation OK for ${questions.length} questions.`);
  const lens = questions.map(q => q.question.length);
  console.log(`  min=${Math.min(...lens)} max=${Math.max(...lens)} avg=${(lens.reduce((a,b)=>a+b,0)/lens.length).toFixed(1)}`);
}

function validateEndsWithQuestionMark(questions, label) {
  const bad = questions.filter((q) => !q.question.endsWith('？'));
  if (bad.length) {
    console.error(`[${label}] Missing terminal '？' for:`, bad.map((b) => b.id));
    throw new Error(`${label}: terminal punctuation validation failed`);
  }
  console.log(`[${label}] Terminal '？' validation OK.`);
}

function validateImageryUsage(questions, label) {
  const groupQuestions = {};
  for (const q of questions) {
    const key = `${q.hexagramId}-${q.category}`;
    if (!groupQuestions[key]) groupQuestions[key] = { questions: [], imgs: new Set() };
    groupQuestions[key].questions.push(q);
    groupQuestions[key].imgs.add(q.basis[1]);
  }
  const bad = [];
  for (const [key, g] of Object.entries(groupQuestions)) {
    const allImgs = Array.from(g.imgs);
    let imageryCount = 0;
    for (const q of g.questions) {
      const hasImagery = allImgs.some(term => q.question.includes(term));
      if (hasImagery) imageryCount++;
    }
    if (imageryCount < 2) {
      bad.push(`${key}: only ${imageryCount}/${g.questions.length} questions use hex imagery (need >=2)`);
    }
  }
  if (bad.length) {
    console.error(`[${label}] Imagery usage FAILED:`);
    bad.forEach(b => console.error(`  ${b}`));
    throw new Error(`${label}: imagery usage validation failed`);
  }
  console.log(`[${label}] Imagery usage OK: all ${Object.keys(groupQuestions).length} groups have >=2 hex-imagery questions.`);
}

// ============================================================================
// MAIN
// ============================================================================
function main() {
  const newH25 = buildQuestions(HEX25);
  const newH26 = buildQuestions(HEX26);

  const allNew = [...newH25, ...newH26];
  console.log(`Built ${allNew.length} new questions (36 hex25 + 36 hex26).\n`);

  // =========================================================================
  // MANDATORY CHECK 1: Length + terminal ？
  // =========================================================================
  console.log('--- LENGTH VALIDATION ---');
  validateLengths(newH25, 'HEX25');
  validateLengths(newH26, 'HEX26');

  console.log('\n--- TERMINAL ？ VALIDATION ---');
  validateEndsWithQuestionMark(newH25, 'HEX25');
  validateEndsWithQuestionMark(newH26, 'HEX26');

  // =========================================================================
  // MANDATORY CHECK 2: Normalized uniqueness >= 32/36 per hex
  // =========================================================================
  console.log('\n--- NORMALIZED UNIQUENESS VALIDATION ---');
  const normU25 = computeNormU(newH25, 'HEX25');
  const normU26 = computeNormU(newH26, 'HEX26');

  if (normU25 < 32) {
    console.error(`HEX25 normU=${normU25}/36 < 32 — FAIL. Must rewrite questions.`);
    throw new Error('HEX25: normalized uniqueness too low');
  }
  if (normU26 < 32) {
    console.error(`HEX26 normU=${normU26}/36 < 32 — FAIL. Must rewrite questions.`);
    throw new Error('HEX26: normalized uniqueness too low');
  }

  // =========================================================================
  // ADDITIONAL: Imagery usage
  // =========================================================================
  console.log('\n--- IMAGERY USAGE VALIDATION ---');
  validateImageryUsage(newH25, 'HEX25');
  validateImageryUsage(newH26, 'HEX26');

  // =========================================================================
  // ALL CHECKS PASSED — WRITE
  // =========================================================================
  console.log('\n=== ALL 72 QUESTIONS PASSED VALIDATION. Writing data file. ===\n');

  const code = fs.readFileSync(DATA_PATH, 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: DATA_PATH });
  const data = sandbox.window.Zero1MatrixData.reflectionQuestions;
  if (!Array.isArray(data)) throw new Error('Failed to load existing reflectionQuestions array');

  console.log(`Loaded existing data: ${data.length} questions total.`);

  const before25 = data.filter((d) => d.hexagramId === 25).length;
  const before26 = data.filter((d) => d.hexagramId === 26).length;
  console.log(`Existing hex25=${before25}, hex26=${before26}`);

  const filtered = data.filter((d) => d.hexagramId !== 25 && d.hexagramId !== 26);
  const merged = [...filtered, ...newH25, ...newH26];

  // Sort by hexagramId
  merged.sort((a, b) => a.hexagramId - b.hexagramId);

  console.log(`New total: ${merged.length} (expected ${data.length - before25 - before26 + 72})`);

  const output =
    "window.Zero1MatrixData = window.Zero1MatrixData || {};\n" +
    "window.Zero1MatrixData.reflectionQuestions = " +
    JSON.stringify(merged) +
    ";\n";

  fs.writeFileSync(DATA_PATH, output, 'utf8');
  console.log(`Written to ${DATA_PATH}`);

  // Verify with node --check
  try {
    execFileSync(process.execPath, ['--check', DATA_PATH], { stdio: 'inherit' });
    console.log('node --check PASSED.');
  } catch (e) {
    console.error('node --check FAILED.');
    throw e;
  }

  // Re-load to double check
  const verifyCode = fs.readFileSync(DATA_PATH, 'utf8');
  const verifySandbox = { window: {} };
  vm.createContext(verifySandbox);
  vm.runInContext(verifyCode, verifySandbox, { filename: DATA_PATH });
  const verifyData = verifySandbox.window.Zero1MatrixData.reflectionQuestions;
  console.log(`Verification reload: ${verifyData.length} total questions.`);
  const v25 = verifyData.filter((d) => d.hexagramId === 25);
  const v26 = verifyData.filter((d) => d.hexagramId === 26);
  console.log(`Verification hex25=${v25.length}, hex26=${v26.length}`);

  if (v25.length !== 36 || v26.length !== 36) {
    throw new Error('Verification failed: expected 36 questions each for hex25 and hex26');
  }

  // Final quality field check
  const allVerified = [...v25, ...v26];
  for (const q of allVerified) {
    if (q.qualityLevel !== 'refined') throw new Error(`${q.id}: qualityLevel=${q.qualityLevel}`);
    if (q.reviewed !== false) throw new Error(`${q.id}: reviewed=${q.reviewed}`);
    if (q.needsHumanReview !== true) throw new Error(`${q.id}: needsHumanReview=${q.needsHumanReview}`);
  }
  console.log('Quality field verification PASSED.');

  // Final per-hex normU report
  console.log(`\nFINAL normU: HEX25=${normU25}/36, HEX26=${normU26}/36`);
  console.log('\nwA_refl_25_26_redo.js generation COMPLETE — 72 questions written successfully.');
}

main();