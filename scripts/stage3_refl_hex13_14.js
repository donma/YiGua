// stage3_refl_hex13_14.js — PER-HEX-PER-CATEGORY UNIQUE reflection questions for hex 13 (同人) and hex 14 (大有)
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const DATA_FILE = path.join(ROOT, "src", "data", "reflectionQuestions.data.js");
const NODE_EXE = path.join(ROOT, ".nodejs", "node-v22.14.0-win-x64", "node.exe");

// ── Load existing data ──────────────────────────────────────────────
const rawSrc = fs.readFileSync(DATA_FILE, "utf8");
const ctx = { window: { Zero1MatrixData: {} } };
vm.createContext(ctx);
vm.runInContext(rawSrc, ctx);
const arr = ctx.window.Zero1MatrixData.reflectionQuestions;

const now = new Date().toISOString().split("T")[0];

// ── Category metadata ──────────────────────────────────────────────
const catMeta = {
  general: "一般",
  career: "工作事業",
  love: "感情關係",
  money: "money",
  people: "人際合作",
  family: "家庭親人",
  study: "學習考試",
  health: "health",
  decision: "重大決策",
  business: "business",
  legal: "legal",
  spiritual: "心境修行",
};

// ── HEX 13 同人 ─ PER-HEX-PER-CATEGORY UNIQUE reflection questions ──
const hex13 = {
  general: [
    {
      q: "同人于野的開闊合作境界中，你目前最接近哪一爻的階段——是初九同人于門的初步信任、六二同人于宗的小圈限制、還是上九同人于郊的退守距離？你憑什麼證據判斷這個位置？",
      basis: ["同人于野", "同人于門", "同人于宗", "類族辨物", "一般"],
    },
    {
      q: "當「類族辨物」要求你先分清人群差異再決定合作方式時，你面對兩個真實選項：先分類後篩選合作對象，還是先開放參與再在過程中自然分化——你目前最該選哪一個？為什麼？",
      basis: ["類族辨物", "同人于野", "一般"],
    },
    {
      q: "同人于門建立的信任圈何時開始變成同人于宗吝的排他堡壘？那個從「健康邊界」滑向「封閉宗派」的信號在你目前處境中是什麼？一旦信號出現，你要付出什麼代價才能轉回同人于野的開放狀態？",
      basis: ["同人于門", "同人于宗", "同人于野", "一般"],
    },
  ],
  career: [
    {
      q: "在天火同人的職場格局中，你目前的工作位置更接近哪一個爻象——同人于門的團隊內初始信任、伏戎于莽的潛藏競爭尚未浮現、還是乘其墉的已看見機會但尚未入局？這個位置決定了你當前最該優先處理的是什麼？",
      basis: ["同人于門", "伏戎于莽", "乘其墉", "工作事業"],
    },
    {
      q: "當「伏戎于莽」的職場暗流開始浮現——你察覺到同事間未公開的競爭或敵意——你的兩個真實選項是主動公開化讓陽光消毒，還是先鞏固「同人于門」的核心團隊再決定如何回應？哪個更適合你當前的處境？",
      basis: ["伏戎于莽", "同人于門", "工作事業"],
    },
    {
      q: "乘其墉的狀態讓你站在組織的牆頭看見兩邊——你何時該翻牆進入新的角色、何時該退回原地？判斷翻牆時機的關鍵信號是什麼？如果錯過最佳時機，你將面臨什麼樣的代價？",
      basis: ["乘其墉", "同人于野", "工作事業"],
    },
  ],
  love: [
    {
      q: "在同人卦的感情關係中，你目前處於哪個階段——是還在同人于門的初步試探與建立信任，還是已進入同人于宗的小世界排他狀態，抑或正在經歷先號咷而後笑的衝突轉化期？你怎麼確認這個判斷是準確的？",
      basis: ["同人于門", "同人于宗", "先號咷而後笑", "感情關係"],
    },
    {
      q: "當關係中出現「先號咷而後笑」的衝突模式——激烈爭吵後才迎來真正的理解——你的兩個選項是讓衝突走完它必須走的過程等待笑聲自然出現，還是主動介入加速從號咷到笑的轉化？這兩種策略的風險分別是什麼？",
      basis: ["先號咷而後笑", "同人于野", "感情關係"],
    },
    {
      q: "同人于宗吝的封閉親密何時開始傷害關係——當你們兩人世界排拒所有外部檢視時，什麼信號顯示這種封閉已不再是深情而是逃避信任驗證？如果繼續停留在同人于宗，最嚴重的長期代價可能是什麼？",
      basis: ["同人于宗", "同人于野", "感情關係"],
    },
  ],
  money: [
    {
      q: "在同人卦的財務格局中，你目前的理財方式更接近哪一種狀態——同人于野的開放分散投資、同人于門的與少數可信夥伴合作、還是同人于宗的只與親近小圈共享資源？你憑什麼斷定當前的模式是適合你現階段的？",
      basis: ["同人于野", "同人于門", "同人于宗", "money"],
    },
    {
      q: "當財務資源需要與人合作時，你面對兩個真實選項：以同人于野的原則向所有人開放透明的合作條件，還是以同人于門的方式先與少數已驗證可信的人建立深度財務合作？你的處境中哪個風險更大？",
      basis: ["同人于野", "同人于門", "money"],
    },
    {
      q: "同人于宗的財務封閉——只與家人或極親近者共享財務資訊與資源——何時會從安全保護變成風險集中？那個警示信號是什麼？當信號出現時你必須在多長時間內轉向更開放的模式才能避免損失？",
      basis: ["同人于宗", "同人于野", "money"],
    },
  ],
  people: [
    {
      q: "在建立人際合作網絡時，你目前處於同人卦的哪個階段——同人于門的從少數可信者起步、類族辨物的正在分辨各方動機與底線、還是伏戎于莽的已察覺潛在衝突正在醞釀？這個階段最迫切需要你解決的問題是什麼？",
      basis: ["同人于門", "類族辨物", "伏戎于莽", "人際合作"],
    },
    {
      q: "當你需要擴大人際合作圈時，兩個真實路徑擺在面前：用「類族辨物」先仔細分辨每個潛在合作者的動機與底線再決定是否納入，還是以「同人于野」的開放態度先接納再在互動中自然篩選？哪個更適合你目前合作網絡的成熟度？",
      basis: ["類族辨物", "同人于野", "人際合作"],
    },
    {
      q: "伏戎于莽的潛伏衝突在你的合作關係中何時會從「可控的隱患」升級為「即將引爆的危機」？那個升級信號是什麼？如果錯過這個信號，你將付出的最大代價是失去什麼關係或機會？",
      basis: ["伏戎于莽", "同人于門", "人際合作"],
    },
  ],
  family: [
    {
      q: "在同人卦的家庭關係中，你目前的家庭互動模式最接近哪一爻——同人于門的門內信任但角色模糊、同人于宗的小家庭封閉排外、還是同人于郊的已意識到需要適當距離？你依據家庭中哪個具體現象做出這個判斷？",
      basis: ["同人于門", "同人于宗", "同人于郊", "家庭親人"],
    },
    {
      q: "當「類族辨物」要求你在家庭內部也分清每個人的差異——誰擅長什麼、誰的極限在哪——你的兩個選項是正式坐下來做一次家庭角色與責任的盤點對話，還是透過日常互動慢慢調整讓分工自然形成？哪個更可能打破當前的僵局？",
      basis: ["類族辨物", "同人于門", "家庭親人"],
    },
    {
      q: "同人于宗吝的家庭封閉模式——資源與決策只限核心家庭成員、排拒外部支持——何時開始傷害家庭成員的成長？那個「封閉已變成桎梏」的信號是什麼？從封閉轉向同人于郊的健康距離，你需要跨越的最大心理障礙是什麼？",
      basis: ["同人于宗", "同人于郊", "家庭親人"],
    },
  ],
  study: [
    {
      q: "在學習過程中，你目前處於同人卦的哪個階段——同人于門的已找到對的學習入口與夥伴、伏戎于莽的已發現潛伏的基礎誤解正在影響進階學習、還是類族辨物的正在系統性整理知識之間的差異與關聯？哪個階段的條件最不成熟？",
      basis: ["同人于門", "伏戎于莽", "類族辨物", "學習考試"],
    },
    {
      q: "當你發現學習瓶頸時，兩個真實策略是：用「類族辨物」的方法畫出概念關係圖找出相似概念的關鍵差異，還是回到「同人于門」找一個能坦誠討論你瓶頸的導師或夥伴來幫你看清盲點？你當前的學習階段更需要哪一個？",
      basis: ["類族辨物", "同人于門", "學習考試"],
    },
    {
      q: "伏戎于莽的潛伏誤解——那些藏在意識深處的錯誤基礎觀念——何時會在關鍵時刻突然爆發摧毀你的學習成果？你能用什麼方法主動偵測這些隱藏錯誤而不等到考試或應用時才被它們偷襲？如果放任不管，最嚴重的後果是什麼？",
      basis: ["伏戎于莽", "類族辨物", "學習考試"],
    },
  ],
  health: [
    {
      q: "在同人卦的健康視角中，你目前的身心狀態最接近哪個意象——同人于門的基本健康習慣已建立但尚未形成系統、先號咷而後笑的正在經歷身體或情緒的波動與修復、還是同人于野的整體健康已達開闊穩定的狀態？你如何判斷這個定位？",
      basis: ["同人于門", "先號咷而後笑", "同人于野", "health"],
    },
    {
      q: "當健康出現「先號咷而後笑」的波動——身體發出不適信號後需要一段修復期才能恢復——你的兩個真實選項是立即全面調整生活方式以加速恢復，還是接受身體節奏讓修復自然走完它的過程？你過去哪種方式更有效？",
      basis: ["先號咷而後笑", "同人于門", "health"],
    },
    {
      q: "同人于門的健康管理——只在基本層面維持、沒有建立全面系統——何時會從「夠用」變成「不足」？那個警示身體在透支的信號是什麼？當信號出現時，你需要付出多少時間和精力才能從門內的零散習慣升級到同人于野的整體健康格局？",
      basis: ["同人于門", "同人于野", "health"],
    },
  ],
  decision: [
    {
      q: "在重大決策面前，你處於同人卦的哪個位置——乘其墉的牆頭審視尚未落地、伏戎于莽的已察覺潛藏風險、還是先號咷而後笑的已決定正在承受短期痛苦等待釋放？這個定位對下一步意味著什麼？",
      basis: ["乘其墉", "伏戎于莽", "先號咷而後笑", "重大決策"],
    },
    {
      q: "當你處於乘其墉的審視階段——站在決策牆頭看見兩邊但尚未落地——你的兩個真實選項是設一個明確的截止日期強迫自己翻牆，還是繼續收集資訊直到某個確定的信號出現再行動？哪個選項在你過去的重大決策中更少讓你後悔？",
      basis: ["乘其墉", "同人于野", "重大決策"],
    },
    {
      q: "先號咷而後笑的決策節奏中，號咷階段的痛苦何時變成「正常的陣痛」、何時變成「決策錯誤的信號」？你如何區分這兩者？如果誤判——把錯誤信號當正常陣痛繼續堅持——最嚴重的後果是什麼？何時應該果斷中止轉向？",
      basis: ["先號咷而後笑", "伏戎于莽", "重大決策"],
    },
  ],
  business: [
    {
      q: "在商業經營中，你目前的合作與市場策略最接近同人卦的哪一爻——同人于野的全面開放市場合作、同人于門的與少數核心夥伴深度綁定、還是伏戎于莽的市場中有未公開的競爭威脅正在醞釀？哪個面向是你目前最該優先處理的？",
      basis: ["同人于野", "同人于門", "伏戎于莽", "business"],
    },
    {
      q: "當商業需要擴張時，兩個真實路徑擺在面前：以同人于野的策略向全市場開放合作機會來者不拒但管理成本高，還是以同人于門的策略只與少數經過嚴格篩選的合作夥伴深度合作但可能錯過機會？你目前的資源與階段更支持哪一種？",
      basis: ["同人于野", "同人于門", "business"],
    },
    {
      q: "伏戎于莽的商業威脅——競爭對手的潛在動作或市場中未公開的風險——何時從「可忽略的背景噪音」升級為「必須立即應對的危機」？那個信號是什麼？如果反應太慢，你的商業模式中最脆弱的環節會最先被什麼方式擊穿？",
      basis: ["伏戎于莽", "同人于野", "business"],
    },
  ],
  legal: [
    {
      q: "在法律合規事務中，你目前的處境最接近同人卦哪個意象——同人于野的規則公開透明適用於所有人、類族辨物的正在分辨不同法律主體之間的權利義務差異、還是伏戎于莽的潛在法律風險尚未完全暴露？你判斷這個定位的依據是什麼？",
      basis: ["同人于野", "類族辨物", "伏戎于莽", "legal"],
    },
    {
      q: "面臨法律合規模糊地帶時，兩個真實選項是：用「類族辨物」仔細區分不同情境的法律界限再決定行動，還是以「同人于野」的原則直接選擇最公開透明、對所有人都公平的方案即使成本更高？哪個更能降低你的長期風險？",
      basis: ["類族辨物", "同人于野", "legal"],
    },
    {
      q: "伏戎于莽的法律風險——那些尚未被發現或尚未爆發的合規問題——在你的處境中最大的潛伏點在哪裡？什麼信號會提醒你這些風險即將從潛伏轉為現實？如果這些風險集中爆發，你的法律防線中最先被突破的是哪一個環節？",
      basis: ["伏戎于莽", "同人于野", "legal"],
    },
  ],
  spiritual: [
    {
      q: "在心境修行中，你目前最接近同人卦哪個意象——同人于野的內在開闊不需標籤定義自我、先號咷而後笑的正經歷拆解與整合的痛苦轉化、還是同人于郊的已從喧囂中退開讓內在聲音不被淹沒？你如何確認這就是你現在的位置？",
      basis: ["同人于野", "先號咷而後笑", "同人于郊", "心境修行"],
    },
    {
      q: "當內在出現「先號咷而後笑」的成長陣痛——舊的自我認知瓦解新的尚未成形——你的真實選項是獨處中讓過程自然走完不尋求外在確認，還是主動尋求智者或修行夥伴的陪伴指引來加速轉化？哪個更可能讓你抵達真正的笑聲？",
      basis: ["先號咷而後笑", "同人于郊", "心境修行"],
    },
    {
      q: "同人于郊的退守——從人群喧囂中適度退出以保護內在空間——何時會從「必要的修行距離」滑向「逃避人群的孤立」？那條界線的警示信號是什麼？如果跨越了這條線，你要如何重新回到同人于野的開闊而不失去郊外修來的定力？",
      basis: ["同人于郊", "同人于野", "心境修行"],
    },
  ],
};

// ── HEX 14 大有 ─ PER-HEX-PER-CATEGORY UNIQUE reflection questions ──
const hex14 = {
  general: [
    {
      q: "在火天大有的豐盛格局中，你目前最接近哪一爻的狀態——初九無交害的豐收初期尚未樹敵、九二大車以載的已具備承載使命的資源、還是上九自天祐之的已超越個人努力進入天道護佑階段？你手中最有力的證據是什麼？",
      basis: ["無交害", "大車以載", "自天祐之", "火在天上", "遏惡揚善", "一般"],
    },
    {
      q: "當「火在天上」讓你的每個決定都被放大檢視時，你面對兩個真實選項：以「遏惡揚善」為準則在每個分配決策中公開明確的道德標準即使這會得罪一些人，還是以「無交害」為優先盡量不製造任何敵意平穩過渡？你的處境中哪個更危險？",
      basis: ["火在天上", "遏惡揚善", "無交害", "一般"],
    },
    {
      q: "大車以載的豐盛資源承載何時會從「使命的工具」變成「炫耀的負擔」？那個「你已不再是在承載而是在展示」的信號是什麼？一旦大車變成了展品而非運輸工具，你需要付出什麼代價才能重新讓它回到承載的正軌？",
      basis: ["大車以載", "火在天上", "一般"],
    },
  ],
  career: [
    {
      q: "在大有卦的職場豐盛中，你目前的位置最接近哪一爻——大車以載的被賦予重任承載組織使命、公用亨于天子的已將成果公開奉獻給更高目標、還是匪其彭的正在修行不因職位盛大而自我膨脹？你當前的最大瓶頸在哪個層面？",
      basis: ["大車以載", "公用亨于天子", "匪其彭", "工作事業"],
    },
    {
      q: "當職位帶來資源與影響力時，你的兩個真實選項是：執行「公用亨于天子」將核心成果公開奉獻給組織的更高目標不附帶個人晉升條件，還是先確保個人位置穩固再逐步釋放資源與功勞？在你的職場文化中，哪個策略的長期風險更低？",
      basis: ["公用亨于天子", "匪其彭", "工作事業"],
    },
    {
      q: "匪其彭的自我節制——在盛大職位中不覺得自己盛大——何時會從「謙虛美德」變成「錯失應得機會」？那條邊界在哪裡？如果你過度壓抑自己不爭取應得的認可，長期下來最大的職業代價是什麼？",
      basis: ["匪其彭", "大車以載", "工作事業"],
    },
  ],
  love: [
    {
      q: "在大有卦的感情關係中，你目前最接近哪個爻象——厥孚交如的雙向誠信正在流動、威如吉的已在誠信基礎上建立健康邊界與威嚴、還是自天祐之的已達孚信與威嚴平衡不再需控制來維持安全感？你憑什麼判斷這個定位？",
      basis: ["厥孚交如", "威如吉", "自天祐之", "感情關係"],
    },
    {
      q: "當關係中需在「厥孚交如」的柔軟誠信與「威如吉」的堅定邊界間取得平衡時，你的真實選項是先強化雙向誠信交流讓對方有足夠安全感再設邊界，還是先明確不可退讓的邊界再在邊界內建立孚信？你過去經驗告訴你哪個順序更有效？",
      basis: ["厥孚交如", "威如吉", "感情關係"],
    },
    {
      q: "自天祐之的放手——當你已盡力經營關係而結果不再由你控制時——什麼信號告訴你「繼續努力」已變成「緊抓不放」？如果錯過這個放手信號繼續用控制來維持安全感，關係中最可能先破裂的是哪個部分？",
      basis: ["自天祐之", "厥孚交如", "感情關係"],
    },
  ],
  money: [
    {
      q: "在大有卦的財務格局中，你目前最接近哪一爻——大車以載的已累積足夠資源需思考如何承載與運用、無交害的財務操作中尚未製造不必要風險或敵意、還是匪其彭的正警惕自己不要因財富累積而自我膨脹？最大財務風險藏在哪個面向？",
      basis: ["大車以載", "無交害", "匪其彭", "money"],
    },
    {
      q: "當財務資源充足時，兩個真實路徑是：用「大車以載」將資源投入能承載你長期使命的資產配置即使流動性降低，還是保持「無交害」的策略分散配置避免任何可能樹敵或引起糾紛的投資？你的風險承受力與人生階段更適合哪一個？",
      basis: ["大車以載", "無交害", "money"],
    },
    {
      q: "匪其彭的財務謙遜——不因資產增加而自我膨脹做出超出能力的財務決策——何時會從「審慎」變成「過度保守錯失機會」？那個區分兩者的關鍵信號是什麼？如果你因為害怕膨脹而長期不敢運用資源，最嚴重的機會成本是多少？",
      basis: ["匪其彭", "大車以載", "money"],
    },
  ],
  people: [
    {
      q: "在大有卦的人際關係中，你目前最接近哪一爻——無交害的擁有資源時謹慎不造不必要敵意、公用亨于天子的將合作成果公開歸功於團隊與組織、還是遏惡揚善的正建立明確的獎善抑惡信號系統？哪個面向最需要你此刻的注意？",
      basis: ["無交害", "公用亨于天子", "遏惡揚善", "人際合作"],
    },
    {
      q: "當你擁有相對優勢時，兩個真實策略是：以「無交害」為優先避免任何可能被解讀為傲慢的言行處處謹慎，還是以「遏惡揚善」為準則公開讚揚符合共同價值的行為私下制止偏離原則的行為？哪個策略更能建立長久信任？",
      basis: ["無交害", "遏惡揚善", "人際合作"],
    },
    {
      q: "公用亨于天子的公開歸功——將合作成果歸於團隊與更高目標——何時會從「慷慨」變成「自我抹殺」？那個邊界在哪裡？如果你長期只歸功他人而不讓自己的貢獻被看見，人際網絡中你將面臨的最大風險是什麼？",
      basis: ["公用亨于天子", "無交害", "人際合作"],
    },
  ],
  family: [
    {
      q: "在大有卦的家庭關係中，你目前最接近哪一爻——大車以載的你作為承載者運送全家前行、厥孚交如的家庭溝通以雙向誠信為基礎正流動、還是威如吉的已在孚信基礎上建立必要權威與邊界？你判斷的關鍵證據是什麼？",
      basis: ["大車以載", "厥孚交如", "威如吉", "家庭親人"],
    },
    {
      q: "當家庭資源分配需決策時，兩個路徑是：以「大車以載」的承載者角色由你決定資源分配確保全家方向一致，還是以「厥孚交如」讓每個成員說出真實需求後共同決定分配方案？你的家庭目前更需要效率還是參與感？",
      basis: ["大車以載", "厥孚交如", "家庭親人"],
    },
    {
      q: "威如吉的家庭邊界——承載者需要有原則的堅定以避免豐盛養出依賴——何時會從「必要的權威」變成「壓制性的威權」？那個轉變的信號是什麼？如果跨越了這條線，家庭中最先出現的負面反應可能是什麼？",
      basis: ["威如吉", "厥孚交如", "家庭親人"],
    },
  ],
  study: [
    {
      q: "在大有卦的學習格局中，你目前最接近哪一爻——大車以載的已累積大量知識需轉化為應用能力、匪其彭的正警惕自己不要因學問累積而傲慢、還是遏惡揚善的正建立篩選機制分辨什麼知識值得深入什麼該放下？哪個階段最需要突破？",
      basis: ["大車以載", "匪其彭", "遏惡揚善", "學習考試"],
    },
    {
      q: "當知識儲備達到一定程度後，兩個真實選項是：執行「匪其彭」的瘦身——刪除那些占據記憶空間卻永遠不會再用的知識讓大車更輕盈，還是用「遏惡揚善」建立篩選標準只吸收能讓你有能力行動的知識？你目前更迫切需要做哪一個？",
      basis: ["匪其彭", "遏惡揚善", "學習考試"],
    },
    {
      q: "大車以載的知識累積何時會從「資產」變成「負擔」——當你知道得越多反而越難做出決定？那個「知識已成為行動障礙」的信號是什麼？如果你不及時清理知識大車中過時與無用的內容，學習效率會以什麼方式開始下降？",
      basis: ["大車以載", "匪其彭", "學習考試"],
    },
  ],
  health: [
    {
      q: "在大有卦的健康視角中，你目前的身心狀態最接近哪個意象——自天祐之的整體健康順暢似乎有天道護佑、厥孚交如的身心內外真誠一致沒有偽裝的消耗、還是無交害的雖有資源但謹慎不因放縱而損害健康？哪個面向的條件最不成熟？",
      basis: ["自天祐之", "厥孚交如", "無交害", "health"],
    },
    {
      q: "當健康管理需要取捨時，兩個真實策略是：追求「自天祐之」的順其自然相信身體有自我修復能力不過度干預，還是以「無交害」的謹慎態度主動排除所有可能損害健康的行為與環境因素？你的年齡與身體狀況更支持哪一種？",
      basis: ["自天祐之", "無交害", "health"],
    },
    {
      q: "厥孚交如的身心一致——外在表現與內在感受沒有落差——何時會從「健康的真誠」變成「不健康的自我暴露」？那條邊界在哪裡？如果為了維持身心一致而忽略了必要的社會面具與防護，健康上最可能先出現什麼問題？",
      basis: ["厥孚交如", "自天祐之", "health"],
    },
  ],
  decision: [
    {
      q: "在大有卦的決策格局中，你目前最接近哪一爻——匪其彭的即使資源充足也警惕自我膨脹影響判斷、自天祐之的已做完所有能做的事承認結果不全在手中、還是無交害的在執行階段謹慎避免製造不必要敵意？哪個階段最需關注？",
      basis: ["匪其彭", "自天祐之", "無交害", "重大決策"],
    },
    {
      q: "當重大決策做出後，兩個真實態度是：以「自天祐之」的心態接受結果中有不可控的部分不再焦慮，還是以「無交害」的謹慎在執行過程中持續監控每一個可能引發敵意的環節並即時調整？你的決策經驗中哪種態度帶來的長期結果更好？",
      basis: ["自天祐之", "無交害", "重大決策"],
    },
    {
      q: "匪其彭的決策清醒——不因資源充足和過去成功而自我膨脹——何時會從「健康的謙遜」變成「自我懷疑導致猶豫不決」？那條線在哪裡？如果因為過度警惕膨脹而不敢做出果斷決定，你在快速變化的環境中會錯過什麼樣的窗口期？",
      basis: ["匪其彭", "自天祐之", "重大決策"],
    },
  ],
  business: [
    {
      q: "在大有卦的商業格局中，你目前最接近哪一爻——大車以載的已具備承載市場使命的資源與能力、公用亨于天子的將商業成果回饋給更大生態系統、還是匪其彭的正警惕市場成功後自我膨脹？當前最大挑戰在哪層面？",
      basis: ["大車以載", "公用亨于天子", "匪其彭", "business"],
    },
    {
      q: "當商業模式需要規模化時，兩個真實路徑是：以「大車以載」的方式集中資源全力推動核心業務快速擴張，還是以「匪其彭」的克制避免因成功而過度擴張導致管理失控？你的市場階段與團隊能力更支持哪一種策略？",
      basis: ["大車以載", "匪其彭", "business"],
    },
    {
      q: "公用亨于天子的商業奉獻——將利潤或資源回饋給更大的生態系統——何時會從「格局與責任」變成「不切實際的理想主義」？那條界線在哪裡？如果過早或過度執行公用亨于天子而削弱了企業的生存能力，最先受到衝擊的是哪個部門？",
      basis: ["公用亨于天子", "大車以載", "business"],
    },
  ],
  legal: [
    {
      q: "在大有卦的法律合規視角中，你目前最接近哪一爻——無交害的法律操作謹慎不造不必要訴訟風險、厥孚交如的以誠信為基礎處理所有法律關係文件真實透明、還是威如吉的在誠信外已建立必要法律邊界與威懾力？哪個面向最薄弱？",
      basis: ["無交害", "厥孚交如", "威如吉", "legal"],
    },
    {
      q: "當法律事務需在柔性與剛性間選擇，兩個策略是：以「厥孚交如」的誠信交流為基礎先嘗試協商解決避免訴訟，還是以「威如吉」的姿態直接明確法律邊界與底線讓對方知道立場不可動搖？你的具體案件中哪種更可能保護核心利益？",
      basis: ["厥孚交如", "威如吉", "legal"],
    },
    {
      q: "無交害的法律謹慎——不製造不必要的法律風險與敵意——何時會從「明智的防範」變成「過度退讓失去應有權益」？那條界線在哪裡？如果因為害怕法律糾紛而長期放棄應有的法律主張，最嚴重的長期後果是什麼？",
      basis: ["無交害", "威如吉", "legal"],
    },
  ],
  spiritual: [
    {
      q: "在大有卦的心境修行中，你目前最接近哪個意象——自天祐之的感受到內在秩序與天道一致時的順暢護佑、厥孚交如的內在真誠與外顯行動完全一致、還是威如吉的已建立不被外在得失搖擺的內在定力？你如何確認這個判斷？",
      basis: ["自天祐之", "厥孚交如", "威如吉", "心境修行"],
    },
    {
      q: "當外在成就起伏時，兩個真實態度是：回到「自天祐之」提醒自己已盡力剩下的交給天道不再焦慮，還是用「威如吉」的內在定力告訴自己無論外在如何變化內在核心不被動搖？在你的實際體驗中，哪種態度更難做到、但也更重要？",
      basis: ["自天祐之", "威如吉", "心境修行"],
    },
    {
      q: "厥孚交如的內外一致——獨處時與人群中是同一個人——何時會從「修行的真誠」變成「不適應社會的僵硬」？那條邊界在哪裡？如果為了維持絕對的內外一致而在需要彈性的社交場合失去靈活，心境修行中會出現什麼樣的反噬？",
      basis: ["厥孚交如", "自天祐之", "心境修行"],
    },
  ],
};

// ── Helper: build question entry ────────────────────────────────────
function makeEntry(hexNum, hexName, cat, catName, qObj, idx) {
  const pad = String(hexNum).padStart(3, "0");
  return {
    id: `rf-${pad}-${cat}-${idx}`,
    hexagramId: hexNum,
    hexagramName: hexName,
    category: cat,
    categoryName: catName,
    question: qObj.q,
    basis: qObj.basis,
    qualityLevel: "refined",
    reviewed: false,
    reviewedBy: "stage3-refl-hex13-14",
    reviewedAt: now,
    needsHumanReview: true,
    version: "2.0.0-stage3-refl",
  };
}

// ── Apply updates ──────────────────────────────────────────────────
let updatedCount = 0;

function applyHex(hexNum, hexName, hexData) {
  const pad = String(hexNum).padStart(3, "0");
  for (const [cat, questions] of Object.entries(hexData)) {
    for (let i = 0; i < 3; i++) {
      const targetId = `rf-${pad}-${cat}-${i + 1}`;
      const targetIdx = arr.findIndex((x) => x.id === targetId);
      if (targetIdx === -1) {
        console.error(`  MISSING: ${targetId} — not found in array`);
        continue;
      }
      const newEntry = makeEntry(hexNum, hexName, cat, catMeta[cat], questions[i], i + 1);
      arr[targetIdx] = newEntry;
      updatedCount++;
    }
  }
}

console.log("=== Hex 13 (同人) ===");
applyHex(13, "同人", hex13);
console.log(`  Updated ${Object.keys(hex13).length * 3} questions`);

console.log("=== Hex 14 (大有) ===");
applyHex(14, "大有", hex14);
console.log(`  Updated ${Object.keys(hex14).length * 3} questions`);

console.log(`\nTotal questions updated: ${updatedCount}`);

// ── Validation ──────────────────────────────────────────────────────
console.log("\n=== Question length validation (38-105 chars) ===");
let lenErrors = 0;
for (const h of [13, 14]) {
  const hData = h === 13 ? hex13 : hex14;
  for (const [cat, qs] of Object.entries(hData)) {
    for (let i = 0; i < qs.length; i++) {
      const len = qs[i].q.length;
      if (len < 38 || len > 105) {
        console.log(`  hex-${h} ${cat}-${i + 1}: ${len} chars (need 38-105)`);
        lenErrors++;
      }
    }
  }
}
if (lenErrors === 0) {
  console.log("  All questions within 38-105 character range.");
}

// ── Imagery usage per category validation ───────────────────────────
console.log("\n=== Per-group imagery usage (target >= 2/3) ===");
const hex13Imagery = {
  general: ["同人于野", "同人于門", "同人于宗", "類族辨物"],
  career: ["同人于野", "同人于門", "伏戎于莽", "乘其墉"],
  love: ["同人于野", "同人于宗", "先號咷而後笑"],
  money: ["同人于野", "同人于門", "同人于宗"],
  people: ["同人于野", "同人于門", "類族辨物", "伏戎于莽"],
  family: ["同人于門", "同人于宗", "類族辨物", "同人于郊"],
  study: ["同人于門", "伏戎于莽", "類族辨物"],
  health: ["同人于門", "先號咷而後笑", "同人于野"],
  decision: ["乘其墉", "伏戎于莽", "先號咷而後笑", "同人于野"],
  business: ["同人于野", "同人于門", "伏戎于莽"],
  legal: ["同人于野", "類族辨物", "伏戎于莽"],
  spiritual: ["同人于野", "先號咷而後笑", "同人于郊"],
};

const hex14Imagery = {
  general: ["大車以載", "無交害", "火在天上", "遏惡揚善"],
  career: ["大車以載", "公用亨于天子", "匪其彭"],
  love: ["厥孚交如", "威如吉", "自天祐之"],
  money: ["大車以載", "無交害", "匪其彭"],
  people: ["無交害", "公用亨于天子", "遏惡揚善"],
  family: ["大車以載", "厥孚交如", "威如吉"],
  study: ["大車以載", "匪其彭", "遏惡揚善"],
  health: ["自天祐之", "厥孚交如", "無交害"],
  decision: ["匪其彭", "自天祐之", "無交害"],
  business: ["大車以載", "公用亨于天子", "匪其彭"],
  legal: ["無交害", "厥孚交如", "威如吉"],
  spiritual: ["自天祐之", "厥孚交如", "威如吉"],
};

let imgErrors = 0;
let totalGroups = 0;
let groupsWith2Plus = 0;

function countImageryInGroup(questions, imageryList) {
  const counts = questions.map((q) => {
    return imageryList.filter((img) => q.q.includes(img)).length;
  });
  return counts;
}

for (const [hexNum, hexData, imgMap] of [
  [13, hex13, hex13Imagery],
  [14, hex14, hex14Imagery],
]) {
  for (const [cat, qs] of Object.entries(hexData)) {
    const required = imgMap[cat];
    if (!required) continue;
    totalGroups++;
    const counts = countImageryInGroup(qs, required);
    const qWithImagery = counts.filter((c) => c > 0).length;
    if (qWithImagery < 2) {
      console.log(`  hex-${hexNum} ${cat}: only ${qWithImagery}/3 questions use specific hex imagery`);
      imgErrors++;
    } else {
      groupsWith2Plus++;
    }
  }
}

console.log(`  Groups with >=2 imagery: ${groupsWith2Plus}/${totalGroups}`);
if (imgErrors === 0) {
  console.log("  All groups pass >=2/3 imagery requirement.");
}

// ── Per-hex normU check (total unique imagery uses across all 36 questions) ──
console.log("\n=== Per-hex imagery coverage ===");
for (const [hexNum, hexData, imgMap] of [
  [13, hex13, hex13Imagery],
  [14, hex14, hex14Imagery],
]) {
  const allImagery = [...new Set(Object.values(imgMap).flat())];
  let totalUses = 0;
  for (const [cat, qs] of Object.entries(hexData)) {
    for (const q of qs) {
      for (const img of allImagery) {
        if (q.q.includes(img)) totalUses++;
      }
    }
  }
  console.log(`  Hex ${hexNum}: ${totalUses} total imagery uses across 36 questions (target >= 32)`);
  if (totalUses < 32) {
    console.log(`    WARNING: below target of 32`);
  }
}

// ── Uniqueness check ─────────────────────────────────────────────────
console.log("\n=== Uniqueness check ===");
const allHex13Qs = Object.values(hex13).flat().map((x) => x.q);
const allHex14Qs = Object.values(hex14).flat().map((x) => x.q);
const unique13 = new Set(allHex13Qs);
const unique14 = new Set(allHex14Qs);
console.log(`  Hex 13: ${unique13.size}/36 unique questions`);
console.log(`  Hex 14: ${unique14.size}/36 unique questions`);
const combined = new Set([...allHex13Qs, ...allHex14Qs]);
console.log(`  Combined: ${combined.size}/72 unique across both hexagrams`);

// ── Prohibited skeleton check ───────────────────────────────────────
console.log("\n=== Prohibited skeleton check ===");
const prohibitedPatterns = [
  /最貼近你目前的處境嗎/,
  /如果是.*它反映在/,
  /如果不是.*你感覺自己更接近/,
  /最核心的提醒是不要停留在.*的表面含義/,
  /它背後還有更深一層的結構問題/,
  /最需要重新檢視的是什麼.*是方法.*對象.*節奏/,
  /的對面是什麼/,
  /相反的狀態.*無論是過度還是不足.*會以什麼方式表現出來/,
  /這條界線在你目前的處境中是否已經被觸及/,
];

let skeletonErrors = 0;
for (const [label, qs] of [["Hex13", allHex13Qs], ["Hex14", allHex14Qs]]) {
  for (const q of qs) {
    for (const pat of prohibitedPatterns) {
      if (pat.test(q)) {
        console.log(`  SKELETON FOUND in ${label}: ${q.substring(0, 60)}...`);
        skeletonErrors++;
        break;
      }
    }
  }
}
if (skeletonErrors === 0) {
  console.log("  No prohibited skeleton patterns found.");
}

// ── Write back ─────────────────────────────────────────────────────
const output =
  "window.Zero1MatrixData = window.Zero1MatrixData || {};\n" +
  "window.Zero1MatrixData.reflectionQuestions = " +
  JSON.stringify(arr) +
  ";\n";

fs.writeFileSync(DATA_FILE, output, "utf8");
console.log(`\nWritten to: ${DATA_FILE}`);
console.log(`File size: ${Buffer.byteLength(output, "utf8")} bytes`);

// ── Verify with node --check ───────────────────────────────────────
console.log("\n=== Syntax verification ===");
const { execSync } = require("child_process");
try {
  execSync(`"${NODE_EXE}" --check "${DATA_FILE}"`, { encoding: "utf8", stdio: "pipe" });
  console.log("  node --check: PASSED (no syntax errors)");
} catch (e) {
  console.error("  node --check: FAILED");
  console.error(e.stderr || e.message);
  process.exit(1);
}

// ── Verify data round-trip ─────────────────────────────────────────
console.log("\n=== Data round-trip verification ===");
const verifySrc = fs.readFileSync(DATA_FILE, "utf8");
const verifyCtx = { window: { Zero1MatrixData: {} } };
vm.createContext(verifyCtx);
vm.runInContext(verifySrc, verifyCtx);
const verifyArr = verifyCtx.window.Zero1MatrixData.reflectionQuestions;

const cats = Object.keys(catMeta);
let verifyErrors = 0;
for (const h of [13, 14]) {
  for (const c of cats) {
    for (let i = 1; i <= 3; i++) {
      const pad = String(h).padStart(3, "0");
      const targetId = `rf-${pad}-${c}-${i}`;
      const item = verifyArr.find((x) => x.id === targetId);
      if (!item) {
        console.log(`  MISSING: ${targetId} after write`);
        verifyErrors++;
        continue;
      }
      if (item.version !== "2.0.0-stage3-refl") {
        console.log(`  VERSION MISMATCH: ${targetId} version=${item.version}`);
        verifyErrors++;
      }
      if (item.reviewedBy !== "stage3-refl-hex13-14") {
        console.log(`  REVIEWEDBY MISMATCH: ${targetId}`);
        verifyErrors++;
      }
      if (item.qualityLevel !== "refined") {
        console.log(`  QUALITY MISMATCH: ${targetId} qualityLevel=${item.qualityLevel}`);
        verifyErrors++;
      }
      if (item.reviewed !== false) {
        console.log(`  REVIEWED MISMATCH: ${targetId} reviewed=${item.reviewed}`);
        verifyErrors++;
      }
      if (item.needsHumanReview !== true) {
        console.log(`  NEEDSHUMANREVIEW MISMATCH: ${targetId}`);
        verifyErrors++;
      }
    }
  }
}
if (verifyErrors === 0) {
  console.log("  Round-trip verification: PASSED (all 72 questions verified)");
}

console.log("\nDone.");