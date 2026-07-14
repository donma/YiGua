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

// ===== HEX 47 困 questions =====
// Imagery per cat:
// general: 澤無水, 困于石, 來徐徐
// career: 臀困于株木, 困于赤紱, 來徐徐
// love: 困于酒食, 困于葛藟, 來徐徐
// money: 困于石, 困于赤紱, 劓刖
// people: 困于葛藟, 來徐徐, 困于酒食
// family: 困于赤紱, 臀困于株木, 劓刖
// study: 困于石, 來徐徐, 困于酒食
// health: 臀困于株木, 劓刖, 澤無水
// decision: 劓刖, 困于赤紱, 困于石
// business: 澤無水, 困于赤紱, 困于葛藟
// legal: 劓刖, 困于石, 臀困于株木
// spiritual: 澤無水, 困于葛藟, 來徐徐

const HEX47 = {
  hexagramId: 47,
  hexagramName: '困',
  full: '澤水困',
  data: {}
};

// Q1=state, Q2=choice(compare 2 options), Q3=risk/boundary/timing
HEX47.data.general = {
  imgs: ['澤無水', '困于石', '來徐徐'],
  q1: '困卦澤無水暗示你目前生活中的資源正在枯竭，你覺得自己處在澤中水剛開始下滲的初期還是已經見底乾裂、連維持基本運轉都很勉強的階段？',
  q2: '面對困于石般擋在前方的硬性障礙，你傾向先繞路尋找旁邊可能存在的替代路徑，還是堅持正面應對試圖用自己的力量推開那塊石頭？',
  q3: '哪個具體的生活變化一旦出現，會代表來徐徐的轉機已從等待中的合理延遲變成永久性的錯失窗口，繼續原地等待將不再是策略而是自我消耗？',
};
HEX47.data.career = {
  imgs: ['臀困于株木', '困于赤紱', '來徐徐'],
  q1: '臀困于株木暗示你可能正坐在一個沒有成長空間的職位上，你是剛意識到枯木無法生長但還不確定該往哪裡跳，還是已經坐到枯木開始腐朽、連基本安全感都在流失？',
  q2: '當職場困于赤紱被頭銜與名分綁住卻沒有實質權力，你會選擇放下光環去開拓新的專業領域建立真正的影響力，還是繼續在體制內等待上級重新分配權力給你？',
  q3: '來徐徐的職涯轉換節奏中，哪個具體的市場或個人訊號會提醒你準備期已經拖得太久，從耐心等待最佳時機變成了用準備當藉口逃避做出真正改變的決定？',
};
HEX47.data.love = {
  imgs: ['困于酒食', '困于葛藟', '來徐徐'],
  q1: '困于酒食顯示你的感情可能被外在應酬與日常瑣事層層稀釋，你覺得這段關係是還有感情基礎只是被酒食暫時覆蓋，還是已經稀釋到連核心的情感連結都感受不到了？',
  q2: '當關係被困于葛藟般的藤蔓小事層層纏繞時，你會選擇一次只挑最簡單的那根藤蔓慢慢解開不讓自己過度疲累，還是找一個機會坐下來把所有糾結一次攤開處理？',
  q3: '在感情修復的來徐徐過程中，哪個具體的行為或態度轉變會提示你這段等待已從必要的冷靜期滑向了無限期的冷戰，關係不但沒有癒合反而正在慢性死亡？',
};
HEX47.data.money = {
  imgs: ['困于石', '困于赤紱', '劓刖'],
  q1: '困于石代表你的資金被硬性資產卡住無法變現，你目前是現金流還能勉強周轉只是資產流動性差，還是連維持每月基本支出的現金都已經快要見底了？',
  q2: '面對困于赤紱為維持某種生活水準而持續超支的壓力，你會選擇放下身段砍掉那些用來裝飾身分的非必要支出，還是寧可增加負債也要保持現有的生活面貌？',
  q3: '經歷劓刖式的財務打擊後，哪個具體的財務數字或行為變化會告訴你創傷後急於翻本的心態已經取代了理性判斷，繼續操作不是在投資而是在賭博式地逃避損失感？',
};
HEX47.data.people = {
  imgs: ['困于葛藟', '來徐徐', '困于酒食'],
  q1: '困于葛藟形容你被人情藤蔓纏繞的狀態，你覺得目前是人情壓力雖多但還能一根一根理出頭緒，還是已被纏到連拒絕別人的力氣都沒有、完全失去了自己的空間？',
  q2: '面對困于酒食式的社交消耗把時間花在大量飯局與表面關係上，你會選擇大幅減少應酬頻率把時間留給真正重要的少數人，還是繼續維持廣泛的人脈網絡以備不時之需？',
  q3: '在人際關係的來徐徐清理過程中，哪個具體的界線一旦被你反覆退讓，會讓對方把你設下的界線當成可以繼續推進的起點而非需要尊重的終點？',
};
HEX47.data.family = {
  imgs: ['困于赤紱', '臀困于株木', '劓刖'],
  q1: '困于赤紱顯示家庭可能為了外在體面而承受過多壓力，你覺得目前的家庭是為了面子偶爾犧牲舒適但還能承受，還是體面已經成為壓垮家庭成員幸福的主要來源？',
  q2: '當家庭關係變成臀困于株木般缺乏溫暖與生機時，你會選擇從最小的日常改變開始每天做一件讓家變溫暖的小事慢慢澆灌，還是安排一次徹底的家庭會議把所有問題攤開來討論？',
  q3: '家庭經歷劓刖式的重大傷害後，哪個具體的行為模式一旦反覆出現，代表創傷不但沒有被真正處理反而正在被全家人的沉默協議共同掩蓋，最終只會讓傷口化膿而非癒合？',
};
HEX47.data.study = {
  imgs: ['困于石', '來徐徐', '困于酒食'],
  q1: '困于石代表你在學習上遇到了某個怎麼讀都讀不通的硬關卡，你覺得這塊石頭是卡在基礎不穩導致的連鎖瓶頸，還是這個特定領域本身與你的思維模式有根本性的不匹配？',
  q2: '當學習進度被困于酒食般的外在干擾不斷打斷時，你會選擇建立每天固定的深度學習保護時段不讓任何事情打擾，還是順應生活的彈性有時間就讀、沒時間就等明天？',
  q3: '在來徐徐的學習累積中，哪個具體的時間節點一旦錯過，會讓暫時放下的休息從大腦必需的間隔沉澱變成永久性的放棄，之前累積的基礎也會因為荒廢太久而需要從頭來過？',
};
HEX47.data.health = {
  imgs: ['臀困于株木', '劓刖', '澤無水'],
  q1: '臀困于株木暗示你長期處於久坐或缺乏活力的身體狀態，你覺得目前只是偶爾僵硬疲勞還能靠週末補回來，還是身體的基礎代謝與循環已經明顯下降開始出現持續性的不適？',
  q2: '經歷劓刖式的身體重大損傷後，你會選擇完全遵從身體的節奏慢慢復健不給自己設定恢復期限，還是給自己一個明確的時間表督促自己一定要在某個日期前恢復到傷前水準？',
  q3: '當澤無水的身體能量枯竭訊號出現時，哪個具體的生理指標變化會告訴你靠咖啡因硬撐的日子已經到了身體即將用一場大病來強迫你停下來的最後通牒邊緣？',
};
HEX47.data.decision = {
  imgs: ['劓刖', '困于赤紱', '困于石'],
  q1: '劓刖代表你在做決定前已經承受了某種損失或傷害，你認為這些傷目前只是影響你的情緒讓判斷稍微偏離，還是已經實質性地剝奪了某些選項讓你只能在受限的範圍內做取捨？',
  q2: '當困于赤紱面子與身分正在干擾你的判斷力時，你會選擇問自己十年後回頭看哪個選擇更不可能後悔，還是優先考慮眼前這個決定會讓周圍的人怎麼看你、你的形象會不會受損？',
  q3: '面對困于石的硬性客觀限制時，哪個具體的資源或條件一旦被消耗到某個臨界點，會讓在限制中尋找最優解的空間完全消失，從還有選擇變成只能接受最差的那個結果？',
};
HEX47.data.business = {
  imgs: ['澤無水', '困于赤紱', '困于葛藟'],
  q1: '澤無水反映你的經營現金流正在枯竭，你覺得目前是季節性或短期性的流動緊張只要撐過這陣子就能回穩，還是核心業務模式本身已經無法產生足夠的現金流入？',
  q2: '當企業被困于赤紱的品牌形象綁架持續燒錢維持高端定位時，你會選擇放下身段務實地調整市場定位與價格策略先求生存，還是堅持品牌調性相信只要撐過去市場終究會回來買單？',
  q3: '在處理困于葛藟的組織複雜度問題時，哪個具體的營運指標一旦惡化到某個程度，會讓按部就班剪藤蔓的漸進策略變得不再可行，必須採取更激進的斷腕式重整才能保住企業的生存？',
};
HEX47.data.legal = {
  imgs: ['劓刖', '困于石', '臀困于株木'],
  q1: '劓刖代表你在法律程序中已承受了某種權益損害，你認為目前只是程序性的劣勢還有策略空間可以扭轉，還是核心證據與法律立場已經處於難以挽回的不利局面？',
  q2: '當案件陷入臀困于株木般的長期僵局程序反覆拖延看不到終點時，你會選擇務實地評估繼續耗下去的總成本是否已經超過勝訴價值並認真考慮和解，還是堅持到底不讓步相信正義最終會到來？',
  q3: '面對困于石的法律硬性障礙如時效已過或法條明確不利時，哪個具體的程序或時間節點一旦錯過，會讓尚可繞行的策略空間完全關閉，從還有選擇餘地變成只能被動接受不利判決？',
};
HEX47.data.spiritual = {
  imgs: ['澤無水', '困于葛藟', '來徐徐'],
  q1: '澤無水象徵你內心的靈感與熱情正在乾涸，你覺得這是一段必經的沉潛期舊水源枯竭後新水源遲早會浮現，還是已經乾涸太久開始懷疑自己是否還有重新湧出泉水的可能？',
  q2: '當心靈被困于葛藟般的無數煩惱與執著層層纏繞時，你會選擇從最外圍最不核心的執著開始練習一個一個放手，還是試圖找到那個你認為是根源的執著一次性地徹底解決它？',
  q3: '在來徐徐的心靈成長過程中，哪個具體的念頭或行為模式一旦反覆出現，代表等待已從耐心的自我接納變成消極的逃避，你正在用慢慢來的說詞合理化自己對改變的抗拒？',
};

// ===== HEX 48 井 questions =====
// Imagery per cat:
// general: 木上有水, 井甃無咎, 井冽寒泉食
// career: 井泥不食, 井渫不食, 井甃無咎
// love: 井谷射鮒, 井泥不食, 井冽寒泉食
// money: 井渫不食, 井泥不食, 井甃無咎
// people: 井收勿幕, 井冽寒泉食, 井泥不食
// family: 井甃無咎, 井谷射鮒, 井冽寒泉食
// study: 井泥不食, 井甃無咎, 木上有水
// health: 井冽寒泉食, 井渫不食, 木上有水
// decision: 井收勿幕, 井泥不食, 井渫不食
// business: 木上有水, 井冽寒泉食, 井甃無咎
// legal: 井甃無咎, 井泥不食, 井谷射鮒
// spiritual: 木上有水, 井冽寒泉食, 井收勿幕

const HEX48 = {
  hexagramId: 48,
  hexagramName: '井',
  full: '水風井',
  data: {}
};

HEX48.data.general = {
  imgs: ['木上有水', '井甃無咎', '井冽寒泉食'],
  q1: '木上有水暗示你需要有取水的工具才能從井中獲得資源，你覺得自己目前是井中有水但木桶漏水需要修補方法，還是連井本身都已經淤泥沉積太久需要先從清理井底開始？',
  q2: '當你發現生活中的基礎設施出現裂縫時，你會選擇井甃無咎立即動手修補不讓小裂縫擴大，還是先觀察一陣子確認裂縫真的在惡化再投入時間精力去處理？',
  q3: '在追求井冽寒泉食的清澈狀態過程中，哪個具體的跡象會提醒你維護已經過度變成完美主義，你正在為了讓井水達到不可能的理想純淨度而停止了正常取水使用？',
};
HEX48.data.career = {
  imgs: ['井泥不食', '井渫不食', '井甃無咎'],
  q1: '井泥不食暗示你的專業技能可能沉積了過時的知識與無效的經驗，你覺得這些淤泥是集中在某個特定領域只需局部清理，還是已經全面性地讓你的專業競爭力明顯落後於市場？',
  q2: '當你處於井渫不食的困境能力已恢復卻沒有被看見的機會時，你會選擇主動創造展示窗口在會議或專案中證明自己的新能力，還是繼續低調累積實力等待被動地被主管或市場發現？',
  q3: '在進行井甃無咎的職能修補時，哪個具體的市場或產業變化一旦出現，代表你正在補強的那個技能方向已經在你完成修補之前就被市場淘汰，投入的時間與精力將無法轉化為職涯回報？',
};
HEX48.data.love = {
  imgs: ['井谷射鮒', '井泥不食', '井冽寒泉食'],
  q1: '井谷射鮒暗示你們的感情基礎已淺到只能養小魚還有人在往井裡射箭，你覺得目前只是偶發的爭吵與消耗感情基礎還在只是需要停止互相攻擊，還是井水已經少到再射幾箭就會徹底乾涸？',
  q2: '當關係處於井泥不食被長期累積的負面情緒污染時，你會選擇每次只處理一個小問題用溫和而非指責的方式逐步清理淤泥，還是安排一次深度的坦誠對話試圖把所有舊帳一次攤開解決？',
  q3: '在感情恢復到井冽寒泉食的清澈狀態後，哪個具體的行為模式一旦重新出現，代表舊的淤泥正在重新沉積而你沒有察覺，關係正在從修復後的清澈悄悄滑回污染前的狀態？',
};
HEX48.data.money = {
  imgs: ['井渫不食', '井泥不食', '井甃無咎'],
  q1: '井渫不食暗示你擁有有價值的資產或能力卻沒有讓它們發揮應有的效益，你覺得是缺乏將資源轉化為收益的正確方法與管道，還是因為信心不足而不敢把已清理好的資源真正投入運用？',
  q2: '面對井泥不食的財務淤泥如混亂的記帳習慣或未檢視的浪費性支出，你會選擇花一個週末徹底整理所有帳戶與支出做一次全面性的財務大掃除，還是每月逐步改善先從最明顯的浪費開始一項一項處理？',
  q3: '在進行井甃無咎的財務結構修補時，哪個具體的財務數字或生活變化會告訴你修補的節奏已經太慢，缺口擴大的速度正在超過你修補的速度，必須採取更積極的行動而非按原計畫慢慢來？',
};
HEX48.data.people = {
  imgs: ['井收勿幕', '井冽寒泉食', '井泥不食'],
  q1: '井收勿幕提醒你人際資源是否保持開放共享，你覺得自己目前是樂於分享但有選擇性地把資源給值得的人，還是因為過去的受傷經驗已經在不知不覺中用幕布把整口井都蓋了起來？',
  q2: '當人際圈中存在井泥不食的消耗型關係持續汙染你的情緒健康時，你會選擇果斷設下界線或結束那些已經確認只消耗不滋養的關係，還是繼續用包容與善良的名義維持現狀期待對方有一天會改變？',
  q3: '在維持井冽寒泉食的高品質人際圈時，哪個具體的訊號會提醒你把篩選變成封閉，從健康地保護自己的能量滑向了過度防衛以至於連可能滋養你的新關係也被你擋在門外？',
};
HEX48.data.family = {
  imgs: ['井甃無咎', '井谷射鮒', '井冽寒泉食'],
  q1: '井甃無咎提醒家庭溝通模式與相處規則是否有裂縫需要修補，你覺得目前只是一些小裂縫偶爾漏水還能靠臨時補救撐過去，還是裂縫已經多到家庭成員之間的基本信任與安全感都在流失？',
  q2: '當家庭陷入井谷射鮒的互相消耗狀態資源匱乏卻還在指責攻擊時，你會選擇先啟動全家的停火協議暫停所有的指責與攻擊讓井水不再繼續減少，還是試圖找出誰該為現狀負責先解決責任歸屬再來談修復？',
  q3: '在家庭恢復到井冽寒泉食的和諧狀態後，哪個具體的互動模式一旦重新出現，代表舊的溝通裂縫正在悄悄復發而你因為享受和諧而選擇忽略，等到再次察覺時裂縫可能已經比上次更大？',
};
HEX48.data.study = {
  imgs: ['井泥不食', '井甃無咎', '木上有水'],
  q1: '井泥不食暗示你的知識體系中沉積了從未真正理解的基礎概念，你覺得這些淤泥是集中在少數幾個特定領域可以快速補強，還是已經廣泛地分布在整個知識體系中讓你越學越覺得根基不穩？',
  q2: '當需要進行井甃無咎的學習方法修補時，你會選擇先嘗試多種不同的學習策略找到最適合自己的方法再全力投入，還是直接參考公認最有效的方法嚴格執行相信只要紀律夠好任何方法都能見效？',
  q3: '在木上有水的學習過程中，哪個具體的學習成果或反饋會提醒你一直在優化木桶卻忘了檢查井裡還有沒有水，方法已經很精美但學習的熱情與好奇心這個源頭已經在不知不覺中枯竭？',
};
HEX48.data.health = {
  imgs: ['井冽寒泉食', '井渫不食', '木上有水'],
  q1: '井冽寒泉食代表身體機能運作順暢的健康狀態，你覺得自己目前是確實處於這種清澈健康的階段只需持續維護，還是只是表面上看起來沒事但身體已在發出你選擇忽略的輕微警訊？',
  q2: '當處於井渫不食身體已恢復但因過去的生病經驗而過度保護不敢正常活動時，你會選擇在醫生許可下逐步恢復正常活動量讓身體重新適應，還是繼續保持謹慎寧可少動也不願冒任何再次受傷的風險？',
  q3: '在木上有水的健康維護中，哪個具體的身體訊號或生活變化會提醒你把保養變成執念，對健康方法的追求本身已經成為新的壓力來源反而抵消了這些方法原本應該帶來的健康效益？',
};
HEX48.data.decision = {
  imgs: ['井收勿幕', '井泥不食', '井渫不食'],
  q1: '井收勿幕提醒你在做決策時不要因為猶豫而把井蓋起來不讓自己取用已知的好選項，你覺得目前是在好幾個可行選項之間難以取捨，還是已經隱約知道最佳選項卻因為恐懼承擔後果而假裝沒看到？',
  q2: '當決策基礎存在井泥不食的資訊淤泥如過時假設或未經驗證的偏見時，你會選擇暫緩決定先花足夠的時間清理這些判斷中的淤泥再行動，還是認為在動態環境中等太久也是一種風險傾向在現有資訊下先做決定再修正？',
  q3: '在井渫不食的決策準備已完成卻遲遲不敢行動時，哪個具體的外部變化或時間節點一旦錯過，會讓你從謹慎等待更多資訊變成過度準備導致的決策癱瘓，原本準備好的選項因為時機流逝而逐一失效？',
};
HEX48.data.business = {
  imgs: ['木上有水', '井冽寒泉食', '井甃無咎'],
  q1: '木上有水提醒經營者井與木桶缺一不可，你覺得自己的企業目前是核心資源穩固但商業模式需要優化，還是商業模式很精緻但核心產品或技術的競爭力正在被市場追趕甚至超越？',
  q2: '當企業處於井冽寒泉食的穩定經營狀態時，你會選擇把盈餘持續投入在產品品質與人才培訓上維持井水的清澈，還是抓住穩定期的機會將資源轉向拓展新市場或開發新產品線追求進一步成長？',
  q3: '在進行井甃無咎的營運漏洞修補時，哪個具體的財務或市場指標一旦觸及，代表你正在用修補小漏洞的勤奮來逃避對過時商業模式的根本性質疑，修補的速度已經追不上模式本身被市場淘汰的速度？',
};
HEX48.data.legal = {
  imgs: ['井甃無咎', '井泥不食', '井谷射鮒'],
  q1: '井甃無咎提醒法律基礎設施是否有漏洞需要修補，你覺得目前合約與政策中的潛在風險是少數幾個已知的項目可以排程處理，還是已經累積了太多長期被忽略的漏洞需要一次全面的法律健檢？',
  q2: '當法律程序中出現井谷射鮒的跡象資源有限卻還在細節上過度爭執時，你會選擇把有限的法律預算集中在最有影響力的核心爭點上放棄不重要的程序對抗，還是堅持在每一個爭點上都力爭到底不讓對方在任何地方佔到便宜？',
  q3: '在處理井泥不食的法律風險淤泥時，哪個具體的外部事件或監管變化一旦發生，會讓那些長期被忽略的法律漏洞從潛在風險瞬間變成正在發生的實際損害，屆時再來修補已經不是預防而是救火？',
};
HEX48.data.spiritual = {
  imgs: ['木上有水', '井冽寒泉食', '井收勿幕'],
  q1: '木上有水提醒你內在有井也需要有取水的工具，你覺得自己目前是缺少安靜下來取水的紀律明明知道方法卻沒有每天練習，還是用錯了取水工具一直在用不適合自己的方法試圖從內在汲取平靜？',
  q2: '當內在修行達到井冽寒泉食的清澈平靜狀態時，你會選擇井收勿幕把這份平靜與智慧用傾聽或陪伴的方式分享給身邊需要的人，還是保持低調覺得心靈成長是個人的事不需要也不應該主動對外分享？',
  q3: '在木上有水的日常練習中，哪個具體的心念或行為模式一旦出現，代表你的練習已經從自我覺察的工具變成了另一種形式的逃避，你在用修行的名義合理化對現實生活中該面對的問題的長期擱置？',
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
        version: '1.9.0-wC-refl-hex47-48',
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
  const newH47 = buildQuestions(HEX47);
  const newH48 = buildQuestions(HEX48);

  const allNew = newH47.concat(newH48);
  console.log('Built ' + allNew.length + ' new questions (36 hex47 + 36 hex48).\n');

  console.log('--- LENGTH VALIDATION ---');
  validateLengths(newH47, 'HEX47');
  validateLengths(newH48, 'HEX48');

  console.log('\n--- TERMINAL ？ VALIDATION ---');
  validateEndsWithQuestionMark(newH47, 'HEX47');
  validateEndsWithQuestionMark(newH48, 'HEX48');

  console.log('\n--- UNIQUENESS VALIDATION ---');
  validateUniqueness(newH47, 'HEX47');
  validateUniqueness(newH48, 'HEX48');
  validateUniqueness(allNew, 'HEX47+48 combined');

  console.log('\n--- normU VALIDATION (>= 32/36) ---');
  validateNormU(newH47, 'HEX47');
  validateNormU(newH48, 'HEX48');

  console.log('\n--- IMAGERY USAGE VALIDATION ---');
  validateImageryUsage(newH47, 'HEX47', '困');
  validateImageryUsage(newH48, 'HEX48', '井');

  console.log('\n--- Q-STRUCTURE VALIDATION (Q1/Q2 還是, Q3 not) ---');
  validateQStructure(newH47, 'HEX47');
  validateQStructure(newH48, 'HEX48');

  console.log('\n=== ALL 72 QUESTIONS PASSED VALIDATION. Writing data file. ===\n');

  const code = fs.readFileSync(DATA_PATH, 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: DATA_PATH });
  const data = sandbox.window.Zero1MatrixData.reflectionQuestions;
  if (!Array.isArray(data)) throw new Error('Failed to load existing reflectionQuestions array');

  console.log('Loaded existing data: ' + data.length + ' questions total.');

  const before47 = data.filter(function(d) { return d.hexagramId === 47; }).length;
  const before48 = data.filter(function(d) { return d.hexagramId === 48; }).length;
  console.log('Existing hex47=' + before47 + ', hex48=' + before48);

  const filtered = data.filter(function(d) { return d.hexagramId !== 47 && d.hexagramId !== 48; });
  const merged = filtered.concat(newH47).concat(newH48);

  merged.sort(function(a, b) { return a.hexagramId - b.hexagramId; });

  console.log('New total: ' + merged.length + ' (expected ' + (data.length - before47 - before48 + 72) + ')');

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
  const v47 = verifyData.filter(function(d) { return d.hexagramId === 47; });
  const v48 = verifyData.filter(function(d) { return d.hexagramId === 48; });
  console.log('Verification hex47=' + v47.length + ', hex48=' + v48.length);

  if (v47.length !== 36 || v48.length !== 36) {
    throw new Error('Verification failed: expected 36 questions each for hex47 and hex48');
  }

  const allVerified = v47.concat(v48);
  for (const q of allVerified) {
    if (q.qualityLevel !== 'refined') throw new Error(q.id + ': qualityLevel=' + q.qualityLevel);
    if (q.reviewed !== false) throw new Error(q.id + ': reviewed=' + q.reviewed);
    if (q.needsHumanReview !== true) throw new Error(q.id + ': needsHumanReview=' + q.needsHumanReview);
  }
  console.log('Quality field verification PASSED.');

  console.log('\nwC_refl_47_48.js generation COMPLETE - 72 questions written successfully.');
}

main();