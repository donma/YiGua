const fs = require('fs');
const path = require('path');

// ─── HEX 33 遯 (Retreat / 退) ───
const H33_CATEGORIES = [
  {
    categoryId: 'general', categoryName: '一般',
    imagery: ['隱退如一層薄霜覆蓋秋草天色向晚而你收攏自己的影子',
               '退避如暮鳥歸林不爭朝夕靜默中自有天地',
               '遠小人如避寒風寧可退半步不與惡浪爭高下'],
    questions: [
      '當你感到局勢對你不利時，你通常如何判斷該退讓還是繼續堅持這與真實的情緒和直覺有何關聯？',
      '在哪些情況下退讓反而讓你獲得了更大的空間或新的契機請你分享一個真實的具體經歷與轉變？',
      '你如何區分「智慧的退避」和「逃避責任」之間的界線，在現實中這種判斷對你有何啟發？',
    ]
  },
  {
    categoryId: 'career', categoryName: '工作事業',
    imagery: ['退後一步讓出舞台而你的價值並不因此減少如月隱雲後光仍普照',
               '職場如棋局有時棄子方能騰挪空間遠景比一時輸贏重要',
               '保持距離如工匠隔火觀鐵不讓妒忌之火灼傷自己的專業'],
    questions: [
      '在工作中什麼情況讓你覺得「此刻放手比抓緊更有長遠價值」，請用一次真實經歷來說明？',
      '當同事或上司比你更具主導性時，你如何在不失自己立場的前提下選擇退讓與配合來促成整體目標？',
      '職場中你曾靠「不爭」而最終獲得更多信任或機會嗎請具體描述那段過程和關鍵的轉折點？',
    ]
  },
  {
    categoryId: 'love', categoryName: '感情關係',
    imagery: ['熱情冷卻後的空隙如兩棵樹之間終於有了風可穿行的距離',
               '愛有時需要退讓如退潮露出更多海岸彼此的邊界才逐漸清晰',
               '暫時的分離如同一滴淚落入大海不是消失而是融入更廣闊的存在'],
    questions: [
      '在親密關係中你如何判斷此刻是需要保持一點距離而非靠近的時刻這帶來了什麼意外收穫？',
      '當伴侶需要獨處空間時你內心深處最先湧起的是不安還是信任而這背後的原因又是什麼呢？',
      '你在關係中有過「退一步反而讓彼此更靠近」的體驗嗎當初那股壓力是透過什麼方式逐漸轉化的？',
    ]
  },
  {
    categoryId: 'money', categoryName: '財務金錢',
    imagery: ['錢財如瀑布落深潭與其逆流而上不如在下方靜待水勢自然盈滿',
               '保守理財如將種子埋入土中而非撒在風裡靜候季節輪轉',
               '節制消費如小溪改道繞石而過避開了漩渦般的陷阱'],
    questions: [
      '在資金緊張時你如何克制衝動支出哪些具體作法讓你在壓力下依然真正守住了財務底線？',
      '你是否有過「不投資反而賺更多」的經驗這讓你重新學到了什麼關於風險與耐性的理財原則？',
      '面對金錢壓力時「穩定現金流」的價值在你心中有多重它如何影響你的重大消費決策？',
    ]
  },
  {
    categoryId: 'people', categoryName: '人際合作',
    imagery: ['某些關係如秋葉從枝頭飄落不帶怨懟地各自落地這本身就是一種完整的結束',
               '退讓並非軟弱而是把對話的河流讓給對方先流自己隨後匯入',
               '保持微妙距離如兩艘船各自航行卻在無線電中默契互通'],
    questions: [
      '過去一年中你是否有意減少與某些人的往來這對你的精神狀態和時間安排產生了什麼變化？',
      '在人際衝突中你如何做到「退而不傷」既不讓自己委屈也不刺激對方的情緒請舉一個實例？',
      '你認為什麼樣的朋友關係值得你主動退一步去維護反之在何種情況下你認為絕對不值得退讓？',
    ]
  },
  {
    categoryId: 'family', categoryName: '家庭親人',
    imagery: ['親情如屋簷下的沉默每個人的退讓都是為了給這棟老房子多留一口讓電線不短路',
               '家庭中的退讓像潮汐規律不是軟弱而是讓每個人都能在同一片沙灘上行走',
               '長輩的退位不是衰弱是把自己從正門移到側門讓下一代從中門大方走出去'],
    questions: [
      '家人之間什麼樣的退讓是你最珍惜的這些退讓又是如何讓你們之間的關係變得更加和諧？',
      '你是否有過為家人的利益而主動放棄自己某些權益的經歷那之後你的內心感受究竟如何？',
      '面對家庭衝突時你如何平衡「退一步海闊天空」和「原則不可妥協」這兩種態度你的底線又在哪裡？',
    ]
  },
  {
    categoryId: 'study', categoryName: '學習考試',
    imagery: ['學習的某個階段如書頁翻過前半卷後半卷需要一段空白來醞釀新的理解',
               '退一步再讀同一段文字彷彿踏上更高的臺階俯瞰原先的困惑',
               '考試前的退讓不是放棄而是把焦慮的拳頭鬆開讓知識如水流回手心'],
    questions: [
      '你是否有過「暫時不學某樣東西反而後來學得更好」的經驗這段間隔為何起了關鍵作用？',
      '面對考試或考核壓力時你如何讓自己「從緊張中退一步」以獲得更清晰的頭腦來從容應對？',
      '學習路上你曾放棄過哪些不適合自己的進修方向這個決定是怎樣讓你看見更多可能和新的選擇？',
    ]
  },
  {
    categoryId: 'health', categoryName: '身心狀態',
    imagery: ['身體的警訊如遠方地平線上的雷聲趁風雨未至退入屋內便是最好的保護',
               '心靈的退讓是把滿溢的憂慮輕輕倒入夜色讓星光代為收納',
               '跟自己保持一點距離如觀看池塘中的倒影不因波紋而忘記原本的寧靜'],
    questions: [
      '你的身體最近是否發出需要「放慢」的訊號你是如何認真地回應這些來自身體的警示？',
      '什麼情況下你會強迫自己暫停工作或熬夜去好好休息這個決定對你來說到底有多難下？',
      '心理健康層面你曾經歷過什麼「退一步才看得清問題全貌」的深刻時刻那次體驗帶來了怎樣的轉變？',
    ]
  },
  {
    categoryId: 'decision', categoryName: '重大決策',
    imagery: ['重大決定前先退三步觀全局如登山者離開樹林才能看清整座山脈的走向',
               '惡劣環境下不做決定也是一種決定如船長在暴風中暫時收帆',
               '退讓之智在於把投票權暫時交給時間讓更成熟的自己去選擇'],
    questions: [
      '當你在一個重要決定上猶豫時是什麼讓你最終選擇「暫緩而不是倉促決定」這背後的核心考量是什麼？',
      '你有沒有因為「太急著決定」而後悔的經歷這之後你的決策節奏有什麼具體的調整和改變？',
      '在重大選擇面前你如何判斷「現在退一步」和「永遠失去機會」的分界線有什麼判斷標準可依循？',
    ]
  },
  {
    categoryId: 'business', categoryName: '創業經營',
    imagery: ['創業如奔馬在懸崖前勒韁不是失敗是讓自己還有道路可選',
               '收縮業務線像修剪果樹忍痛砍掉多餘枝椏來年的花朵會更密集',
               '市場浮躁時退一步重新校準方向如同帆船在逆風中做一個之字調整'],
    questions: [
      '創業過程中你曾為長遠利益在什麼關鍵時刻選擇了主動收縮或撤退這個決定如何影響了後續發展？',
      '你如何判斷一個產品或項目是「該暫時退卻」還是「該堅持突破」的階段這個判斷有什麼依據？',
      '當市場競爭激烈時你如何用「退一步」的思維找到差異化的生存策略這種逆向思考帶來過什麼成果？',
    ]
  },
  {
    categoryId: 'legal', categoryName: '官非合約',
    imagery: ['法律糾紛如藤蔓纏繞每退一步不是妥協而是從糾結中抽出一根藤',
               '合約如一道門檻有時放下爭執退一步觀察門框結構才能看見條約裡潛藏的空間',
               '不正面衝突如水流繞過岩石省去的時間與精力就是最大的勝利'],
    questions: [
      '面對合約爭議時你曾用什麼「以退為進」的方式巧妙化解了潛在的風險和衝突請具體描述那次經驗？',
      '你認為在什麼情況下主動退讓可以避免長年訴訟的傷害你會如何權衡得失並做出最終取捨？',
      '在處理官非壓力時如何不讓「爭一口氣」的情緒主導你做出不理性的決定有什麼具體方法可冷靜下來？',
    ]
  },
  {
    categoryId: 'spiritual', categoryName: '心境修行',
    imagery: ['退回到一片空白如晨霧散去後山中只剩鳥鳴跟自己對話的聲音',
               '修行不在多爭一寸理而在退一步之後心無掛礙的空曠',
               '靜坐如退入內在的庭院把外面的門關上一次讓靈魂喘一口完整的氣'],
    questions: [
      '你最近在哪些時刻感到「退一步就是真正的解脫」那份深刻的感受持續了多久對你的心境有何長遠影響？',
      '修行層面你如何練習「放手的勇氣」什麼內在習慣幫助你真正做到了退讓請分享一個具體練習方法？',
      '什麼樣的經歷讓你明白「退讓不是失去而是把空間留給更重要的東西」這份體悟發生在什麼人生階段？',
    ]
  },
];

// ─── HEX 34 大壯 (Great Power / 大壯) ───
const H34_CATEGORIES = [
  {
    categoryId: 'general', categoryName: '一般',
    imagery: ['力量如駿馬的後蹄緊扣大地在起跳前整個世界都感到微微震動',
               '大壯之力不是咆哮而是體內每一根骨頭都意識到自己可撐起一片天',
               '手握巨石卻輕輕放在需要的地方這就是大壯的真正智慧'],
    questions: [
      '你目前人生中最強的地方是什麼領域你是從何時開始以及如何真正意識到這份力量的存在？',
      '當你感覺自己充滿力量時最容易犯什麼錯請回想一次懊悔教訓這些經驗最終教會了你什麼？',
      '大壯提醒「用好力量而不是炫耀力量」這個道理在你的日常生活中有哪些具體實踐的例子？',
    ]
  },
  {
    categoryId: 'career', categoryName: '工作事業',
    imagery: ['職場中的力量如成熟果樹不喧嘩但果實累累那是年復一年靜默累積的證明',
               '真正強勢不是壓制同事而是像一個好舵手讓全船的人在風暴中依然信任你',
               '專業能力的巔峰如鐵匠精準落槌每一下都讓鐵胚更接近理想形狀'],
    questions: [
      '你在職場中最有底氣的專業能力是什麼這份底氣是怎樣經過時間一步步被打造出來的？',
      '當你掌握權力或主導權時如何避免「強勢傷人」同時把團隊帶往更好方向這方面的拿捏有什麼心得？',
      '回顧你的職業生涯哪個階段你第一次感覺「自己真的變得強大了」那個關鍵契機究竟是什麼樣的事件？',
    ]
  },
  {
    categoryId: 'love', categoryName: '感情關係',
    imagery: ['愛情中的強不是壓制對方而是你的溫暖讓伴侶在寒冬中也覺得被春天包圍',
               '最好的關係裡兩個人各自是完整的太陽不需要誰吞噬誰的光',
               '成熟的愛如同兩棵高大楠木各撐一片天底下的土壤卻緊緊相連'],
    questions: [
      '你覺得自己在關係中最有力量的部分是什麼是包容是堅持還是另一種品質請展開說說？',
      '健康的強大在愛情中如何展現怎樣才不會讓伴侶感到壓迫或被支配請用你觀察到的例子來說明？',
      '你曾有「因為自己變得更強關係反而更脆弱」的經驗嗎你是如何調整之後關係才重新回到平衡的？',
    ]
  },
  {
    categoryId: 'money', categoryName: '財務金錢',
    imagery: ['財務力量如同地下礦脈看不見卻能讓整座城市運轉這來自不顯現的積累',
               '金錢如馴馬握韁繩的手腕要穩且柔既讓馬兒奔跑又不能讓馬失控',
               '真正的財務自由不是錢多到溢出而是錢的流動始終在你指掌之間'],
    questions: [
      '財務上最有底氣的決定對你而言是哪一次這個決定如何增強了你後續面對風險時的信心和底氣？',
      '你認為「財務力量」和「財務安全感」是同一回事嗎兩者之間的差距在哪裡你更看重哪一個層面？',
      '有了更強的經濟基礎後你會如何使用這份力量去影響你所在意的人或事物你最想優先改變什麼？',
    ]
  },
  {
    categoryId: 'people', categoryName: '人際合作',
    imagery: ['強大的社交不是人人認識你而是關鍵時刻總有人願意把信任交到你手上',
               '在人際中力量如榕樹垂下的氣根越多連結根基就越深密',
               '真正的影響力是當你沉默的時候別人也願意等待你的下一句話'],
    questions: [
      '你的人際力量來自哪個特質是誠信、資源、智慧還是別的什麼你能用一個具體場景來舉例子說明嗎？',
      '當你處於團隊中的強勢地位時如何讓弱勢的夥伴同樣有發言權和安全空間你實際採取過哪些措施？',
      '你有被他人當成「可依靠的力量」的體驗嗎這份責任讓你感到壓力還是動力兩者之間的比例是怎樣的？',
    ]
  },
  {
    categoryId: 'family', categoryName: '家庭親人',
    imagery: ['家庭裡真正的強是默默扛起風雨的那個肩膀不吭聲但全家都睡得安穩',
               '大壯在家中如房子的地基最深處卻承擔一切看不見但沒它不行',
               '長輩的力量如家傳食譜不寫在紙上但在每一道菜的味道裡都能嚐出傳承'],
    questions: [
      '家人眼中你在什麼方面是最強的支撐這份被需要的感覺如何影響你日常的家庭角色和責任分配？',
      '當你成為家庭中實際的支柱時如何處理「扛太多」和「適度放手」的平衡問題有什麼具體的界線或訊號？',
      '你覺得什麼樣的「家庭力量」最可以傳承給下一代你會用什麼方式傳遞這份力量給他們？',
    ]
  },
  {
    categoryId: 'study', categoryName: '學習考試',
    imagery: ['學習的真正力量不是背誦如河而是理解如何開鑿河道讓知識自然流動',
               '考試前的大壯是把所有知識點像調兵遣將一樣分列清楚不慌不亂',
               '智慧的力量不是累積資料而是像老農識別每一粒種子知道何時該讓它發芽'],
    questions: [
      '你最有把握的學科或技能給了你什麼樣的自信這份自信有沒有進一步擴散到你人生的其他方面？',
      '學習過程中你如何利用自己的強項去攻克弱點這方面有什麼獨特的心得和方法可以分享？',
      '什麼時候你第一次感覺到「知識真的就是力量」那個場景帶給你怎樣的觸動以及後續的行為改變？',
    ]
  },
  {
    categoryId: 'health', categoryName: '身心狀態',
    imagery: ['身體的大壯不是肌肉的多寡而是清晨醒來精神飽滿好像可以擁抱整天的挑戰',
               '心理力量如海岸巖石任憑浪潮反覆沖刷仍舊保持自己原本的形狀',
               '真正的健康能量是內在的火爐燒得穩定而不是一下狂奔一下熄滅'],
    questions: [
      '你目前的身體狀態讓你感到最有力量的地方是什麼這個優勢如何幫助你的日常生活和工作表現？',
      '當心理能量非常強大時你如何避免「自以為無所不能」導致身體透支有什麼實際的提醒機制嗎？',
      '身心都強勢時你如何把這份能量用在最有意義而非最刺激的事情上你用什麼方式篩選和聚焦方向？',
    ]
  },
  {
    categoryId: 'decision', categoryName: '重大決策',
    imagery: ['決策的強大不是快而是像象群遷徙知道每一步踏在何處水源就在前方某個定點',
               '站在力量的峰頂做選擇不是把所有人都推開而是把正確的人拉上頂點',
               '大壯的決策力來自多條路都走過後的篤定就像航海者靠星象而非浪花判斷方向'],
    questions: [
      '當你擁有較大主導權時如何確保自己的重大決定不會變成一意孤行你會主動設置什麼樣的制衡機制？',
      '你認為一個「強而有力的決定」和「魯莽的決定」之間最重要的區別是什麼請用一個實例來對比說明？',
      '在什麼情況下你覺得放棄決策主導權反而展現了更強的自制和遠見你是否有過這樣的親身經歷？',
    ]
  },
  {
    categoryId: 'business', categoryName: '創業經營',
    imagery: ['創業的大壯是你站在自己的品牌前像一面旗幟讓市場看到便知方向',
               '經營力量不是壟斷是讓你的服務成為一條河流大家自願過來取水而非被迫',
               '強勢的產品就像一個誠實的工匠他的作品會自己講故事不需要太多廣告'],
    questions: [
      '創業中最讓你感到自己「真正強大」的時刻是什麼這個力量來自資源還是信念請具體描述那個場景？',
      '當你的商業模式站穩之後你如何運用這份優勢去承擔更大的社會責任你最想做的是什麼樣的貢獻？',
      '在市場主導權面前你如何避免「強大變成傲慢」讓客戶始終感覺被尊重有什麼具體的服務原則或慣例？',
    ]
  },
  {
    categoryId: 'legal', categoryName: '官非合約',
    imagery: ['合約中的力量如印章落下不是威脅而是讓雙方的承諾在紙上有了分量',
               '面對官非時真正的強是法律知識加上冷靜的判斷而非情緒化的攻擊',
               '和解的力量在於你握有勝算卻選擇放下錘子改用更建設性的方式解決'],
    questions: [
      '當你握有合約談判優勢時如何不濫用這份優勢並促成雙贏結果請舉出一個成功的談判案例來說明？',
      '在官非或合約爭議中怎樣運用自己的專業力量去保護自己同時降低對立情緒有什麼溝通策略可分享？',
      '你有過「本可追究到底卻選擇和解」的經驗嗎這個決定讓你獲得或學到了什麼對你後續處事有何影響？',
    ]
  },
  {
    categoryId: 'spiritual', categoryName: '心境修行',
    imagery: ['內在力量的極致是當你能靜靜地坐著讓思想之馬不再狂奔而能走到遠方',
               '修行帶來的強大如湖水映天遼闊而平靜不需要波浪來證明自己的深度',
               '大壯在心境層面是「無敵」的體驗不再需要對抗任何東西因為你已成為容納一切的那個容器'],
    questions: [
      '修行過程中你感受到最強烈的內在力量是什麼時候這份力量如何改變你的生活態度和待人處事方式？',
      '當你內心變得越來越強大時是否發現自己反而更願意讓步其中的邏輯你能說說這是怎樣的一種心境轉變？',
      '如何將內在的「大壯」能量轉化為對他人有益的行動而非僅僅是獨善其身你有沒有具體的實踐計劃？',
    ]
  },
];

// ─── NORMALIZATION ───
function norm(q) {
  // Remove hex-specific imagery references, category names, and generic fillers
  let s = q;
  // Strip imagery patterns
  s = s.replace(/如[^，。；？！？\s]{6,40}/g, '');
  s = s.replace(/像[^，。；？！？\s]{6,40}/g, '');
  s = s.replace(/如同[^，。；？！？\s]{6,40}/g, '');
  s = s.replace(/「[^」]{2,20}」/g, '');
  s = s.replace(/傳統中/g, '');
  // Generic common wording
  const stopWords = ['的', '了', '是', '在', '和', '與', '或', '也', '都', '就', '而', '及', '但', '這',
                     '你', '我', '他', '她', '它', '們', '那', '什麼', '哪', '怎麼', '如何', '為何',
                     '一個', '一種', '一次', '一下', '一些', '這個', '那個', '自己', '可以', '會', '要',
                     '有', '讓', '把', '被', '從', '對', '向', '到', '為', '因為', '所以', '如果', '當',
                     '是否', '哪些', '什麼樣', '怎樣', '做出', '覺得', '認為', '感到', '知道', '應該', '需要',
                     '能夠', '可能', '已經', '曾經', '目前', '現在', '最近', '過去', '未來', '時候', '之後',
                     '之間', '之中', '當中', '裡面', '表示', '代表', '包含', '透過', '關於', '來說', '而言',
                     '對於', '請問', '可否', '請', '你嗎', '你呢', '請告訴我', '比', '上', '下', '中',
                     '更', '最', '很', '不', '沒', '最', '才', '又', '再', '過', '著', '嗎', '呢', '吧', '啊',
                     '並', '非', '所', '具', '擁有', '其中', '仍然', '依然', '還是', '持續', '繼續',
                     '明顯', '主要', '基本', '本質', '關鍵', '重要', '核心', '根本', '的確', '確實',
                     '長遠', '長期', '短期', '現在', '過去', '未來', '終於', '突然', '逐漸',
                     '覺得', '認為', '以為', '感覺', '看法', '想法', '建議', '意見', '觀點'];
  // We preserve Chinese characters as content-significant tokens
  for (const w of stopWords) {
    s = s.replace(new RegExp(w, 'g'), '');
  }
  // Remove punctuation
  s = s.replace(/[，。；？！？、：""''（）【】「」《》…—\-\s]/g, '');
  return s;
}

// ─── VALIDATE ───
function validate(questions, hexName, hexId) {
  if (questions.length !== 36) {
    console.error(`[FAIL] ${hexName}: expected 36, got ${questions.length}`);
    return false;
  }
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i].question;
    if (q.length < 38 || q.length > 105) {
      console.error(`[FAIL] ${hexName} #${i}: len=${q.length} (need 38-105): ${q.slice(0,60)}...`);
      return false;
    }
    if (!q.endsWith('？')) {
      console.error(`[FAIL] ${hexName} #${i}: does not end with ？: "${q.slice(-5)}"`);
      return false;
    }
  }

  // Check normalized uniqueness per hex
  const normed = questions.map(b => norm(b.question));
  const seen = new Set();
  const dupes = [];
  for (let i = 0; i < normed.length; i++) {
    if (seen.has(normed[i])) {
      dupes.push({ idx: i, norm: normed[i], q: questions[i].question });
    }
    seen.add(normed[i]);
  }
  const normU = seen.size;
  if (normU >= 32) {
    console.log(`[PASS] ${hexName}: ${normU}/36 distinct normalized`);
  } else {
    console.error(`[FAIL] ${hexName}: normU=${normU}/36 (need >=32)`);
    for (const d of dupes.slice(0, 10)) {
      console.error(`  dup at #${d.idx}: ${d.q.slice(0,80)}`);
    }
    return false;
  }
  return true;
}

function getCategoryIdForHex(categoryId, hexId) {
  return `${hexId}-${categoryId}`;
}

function build() {
  const all = [];

  for (let ci = 0; ci < H33_CATEGORIES.length; ci++) {
    const cat = H33_CATEGORIES[ci];
    for (let qi = 0; qi < cat.questions.length; qi++) {
      all.push({
        id: `rf-033-${cat.categoryId}-${qi+1}`,
        hexagramId: 33,
        hexagramName: '遯',
        category: cat.categoryId,
        categoryName: cat.categoryName,
        question: cat.questions[qi],
        basis: ['遯', cat.categoryName],
        qualityLevel: 'draft',
        version: '1.0.0-auto',
      });
    }
  }

  for (let ci = 0; ci < H34_CATEGORIES.length; ci++) {
    const cat = H34_CATEGORIES[ci];
    for (let qi = 0; qi < cat.questions.length; qi++) {
      all.push({
        id: `rf-034-${cat.categoryId}-${qi+1}`,
        hexagramId: 34,
        hexagramName: '大壯',
        category: cat.categoryId,
        categoryName: cat.categoryName,
        question: cat.questions[qi],
        basis: ['大壯', cat.categoryName],
        qualityLevel: 'draft',
        version: '1.0.0-auto',
      });
    }
  }

  // Run validations
  const h33 = all.filter(b => b.hexagramId === 33);
  const h34 = all.filter(b => b.hexagramId === 34);

  const r33 = validate(h33, '遯(33)', 33);
  const r34 = validate(h34, '大壯(34)', 34);

  if (!r33 || !r34) {
    console.error('\n[ABORT] Validation failed. Not writing file.');
    process.exit(1);
  }

  // Cross-hex validation: no cross-hex dupes
  const crossNormed = all.map(b => ({ norm: norm(b.question), hex: b.hexagramId, q: b.question }));
  const crossSeen = {};
  let crossDupes = false;
  for (const item of crossNormed) {
    if (crossSeen[item.norm] && crossSeen[item.norm] !== item.hex) {
      console.error(`[FAIL] Cross-hex dup: hex${crossSeen[item.norm]} & hex${item.hex}: ${item.q.slice(0,60)}...`);
      crossDupes = true;
    }
    crossSeen[item.norm] = item.hex;
  }
  if (crossDupes) {
    console.error('[ABORT] Cross-hex duplicates found.');
    process.exit(1);
  }

  console.log(`\n[PASS] ALL checks passed. Cross-hex unique: ${Object.keys(crossSeen).length} of ${all.length}`);

  // Build output
  const outPath = path.resolve(__dirname, '..', 'src', 'data', 'reflectionQuestions.data.js');
  const existing = fs.readFileSync(outPath, 'utf-8');
  const existingData = existing
    .replace('window.Zero1MatrixData = window.Zero1MatrixData || {};', '')
    .replace(/window\.Zero1MatrixData\.reflectionQuestions\s*=\s*/, '')
    .trim();

  let existingArr;
  try {
    existingArr = JSON.parse(existingData.slice(0, -1)); // remove trailing semicolon
  } catch {
    existingArr = [];
  }

  // Merge: remove any old hex 33,34 entries, append new ones
  const filtered = existingArr.filter(b => b.hexagramId !== 33 && b.hexagramId !== 34);
  const merged = filtered.concat(all);

  const js = `window.Zero1MatrixData = window.Zero1MatrixData || {};
window.Zero1MatrixData.reflectionQuestions = ${JSON.stringify(merged)};`;

  fs.writeFileSync(outPath, js, 'utf-8');
  console.log(`\n[DONE] Wrote ${all.length} new entries. Total in file: ${merged.length}`);
}

build();
