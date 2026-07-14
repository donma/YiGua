# refine_lineCategory_top8.ps1
# Generates refined lineCategoryInterpretations for hex 1-8 (乾坤屯蒙需訟師比)
# 8 hex * 6 lines * 12 categories = 576 entries

$file = "D:\AI_PROJECTS\Zero1Matrix\src\data\lineCategoryInterpretations.data.js"
$content = Get-Content $file -Raw -Encoding UTF8

# Line position descriptions
$positions = @{
  1 = @{name="初爻"; meaning="事情的起步階段，力量尚未成熟，適合觀察、準備，不宜貿然行動。"}
  2 = @{name="二爻"; meaning="事物開始有基礎，但仍需累積，此時適合低調努力，不宜急於求成。"}
  3 = @{name="三爻"; meaning="處於進退之間的關卡，壓力較大，需要謹慎判斷，避免冒進。"}
  4 = @{name="四爻"; meaning="接近核心但仍在外圍，可以開始觀察局勢變化，調整自己的位置與策略。"}
  5 = @{name="五爻"; meaning="居於主位，掌握較多主動權，但也承擔較大責任，宜穩健主導。"}
  6 = @{name="上爻"; meaning="事情接近尾聲或極點，此時需注意過猶不及，避免走極端。"}
}

# Category context
$categories = @{
  "general" = @{name="一般"; focus="整體局勢與進退節奏"}
  "career" = @{name="工作事業"; focus="職責、資源、主管、同事與推進時機"}
  "love" = @{name="感情關係"; focus="互動、信任、期待、距離與真實感受"}
  "money" = @{name="財運投資"; focus="金錢流動、風險、時機與資源分配"}
  "health" = @{name="健康身心"; focus="身體狀態、壓力、作息與自我照顧"}
  "study" = @{name="學業進修"; focus="學習、考試、技能累積與方向選擇"}
  "family" = @{name="家庭親子"; focus="家人關係、責任、溝通與長期和諧"}
  "friendship" = @{name="人際友誼"; focus="合作、信任、界線與互惠關係"}
  "travel" = @{name="出行遷移"; focus="移動、變化、環境轉換與適應力"}
  "legal" = @{name="官司訴訟"; focus="爭議、證據、程序與公平解決"}
  "decision" = @{name="重大決策"; focus="關鍵選擇、時機、風險與長期影響"}
  "creativity" = @{name="創意表現"; focus="靈感、表達、作品與突破框架"}
}

# Hexagram-specific context for each line position
$hexContexts = @{
  1 = @{  # 乾
    name="乾"; fullName="乾為天"; tone="剛健開創"
    1 = "潛龍勿用，力量已具但時機未到"
    2 = "見龍在田，開始被看見，適合與貴人連結"
    3 = "終日乾乾，勤奮努力，小心謹慎"
    4 = "或躍在淵，面臨關鍵跳躍，可進可守"
    5 = "飛龍在天，居於高位，影響力最大"
    6 = "亢龍有悔，過度高亢，需要收斂"
  }
  2 = @{  # 坤
    name="坤"; fullName="坤為地"; tone="厚載承順"
    1 = "履霜堅冰至，從微小訊號看到趨勢"
    2 = "直方大，正直寬厚，不需刻意表現"
    3 = "含章可貞，內在有才但不急於顯露"
    4 = "括囊無咎，收斂謹慎，避免多言"
    5 = "黃裳元吉，謙和居中，大吉之象"
    6 = "龍戰于野，陰陽相爭，避免極端對立"
  }
  3 = @{  # 屯
    name="屯"; fullName="水雷屯"; tone="開局艱難"
    1 = "磐桓難進，開局受阻，宜建立根基"
    2 = "屯如邅如，進退兩難，需要耐心等待"
    3 = "即鹿無虞，盲目追趕無益，宜停下"
    4 = "乘馬班如，尋求合作來突破困境"
    5 = "屯其膏，資源有限，小步推進較安全"
    6 = "泣血漣如，困境極點，情緒需節制"
  }
  4 = @{  # 蒙
    name="蒙"; fullName="山水蒙"; tone="啟蒙養正"
    1 = "發蒙，開始學習，需要正確引導"
    2 = "包蒙，包容學習中的不成熟"
    3 = "勿用取女，避免被表象迷惑"
    4 = "困蒙，學習遇到瓶頸，需要突破"
    5 = "童蒙，保持謙虛求教的態度"
    6 = "擊蒙，強力破除錯誤觀念"
  }
  5 = @{  # 需
    name="需"; fullName="水天需"; tone="等待時機"
    1 = "需于郊，在邊緣等待，不急於進入"
    2 = "需于沙，略有摩擦，堅持可過"
    3 = "需于泥，陷入困境，需要警惕"
    4 = "需于血，承受壓力，從困境中脫出"
    5 = "需于酒食，等待中有滋養，保持從容"
    6 = "入于穴，意外訪客，以禮相待可化解"
  }
  6 = @{  # 訟
    name="訟"; fullName="天水訟"; tone="爭訟對立"
    1 = "不永所事，爭端不宜拖延"
    2 = "不克訟，退讓避禍，保全自身"
    3 = "食舊德，依靠既有基礎，不求擴張"
    4 = "復即命，回到正軌，改變態度"
    5 = "訟元吉，以公正立場化解爭端"
    6 = "終朝三褫，得而復失，爭來的難長久"
  }
  7 = @{  # 師
    name="師"; fullName="地水師"; tone="統帥用兵"
    1 = "師出以律，行動必須有紀律"
    2 = "在師中吉，居中指揮，獲得信任"
    3 = "師或輿尸，指揮失當的風險"
    4 = "師左次，退守等待更好的時機"
    5 = "田有禽，明確目標，果斷行動"
    6 = "大君有命，功成之後的獎懲分明"
  }
  8 = @{  # 比
    name="比"; fullName="水地比"; tone="親附和合"
    1 = "有孚比之，以誠信為基礎建立關係"
    2 = "比之自內，從內心真誠靠近"
    3 = "比之匪人，謹慎選擇依附對象"
    4 = "外比之，向外尋求值得信任的盟友"
    5 = "顯比，以公開透明的方式建立關係"
    6 = "比之無首，關係缺乏主導，易散"
  }
}

$count = 0
for ($h = 1; $h -le 8; $h++) {
  $hc = $hexContexts[$h]
  for ($l = 1; $l -le 6; $l++) {
    $pos = $positions[$l]
    $lineCtx = $hc[$l]
    foreach ($catId in $categories.Keys) {
      $cat = $categories[$catId]
      $entryId = "hex-{0:D3}-line-{1}-{2}" -f $h, $l, $catId
      
      $meaning = "此為$($hc.fullName)的$($pos.name)（$lineCtx），問「$($cat.name)」時，表示在$($cat.focus)方面，當前處於$($pos.meaning)結合$($hc.name)卦的「$($hc.tone)」特質，需要特別注意$lineCtx。"
      $advice = "問$($cat.name)時，建議先理解$($hc.name)卦$($pos.name)的位置意義：$lineCtx。$($pos.meaning)在此分類下，宜先穩住基礎，再觀察$($hc.name)卦給出的具體訊號來決定下一步。"
      $warning = "最大的風險是忽略$($pos.name)的階段特性。$($hc.name)卦的提醒是$lineCtx，若在時機未成熟時強行推進，或在該守時貿然行動，容易適得其反。"

      $sa = @{clarity=2; action=0; risk=0; change=4; support=0; timing=0}
      if ($l -le 2) { $sa.action = -2; $sa.timing = -1 }
      if ($l -eq 5) { $sa.clarity = 4; $sa.action = 3 }
      if ($l -eq 6) { $sa.risk = -3; $sa.action = -2 }

      $newBlock = @"
    "meaning": "$meaning",
    "advice": "$advice",
    "warning": "$warning",
    "basis": [
      "$($hc.name)",
      "$($pos.name)",
      "$($cat.name)"
    ],
    "scoreAdjust": {
      "clarity": $($sa.clarity),
      "action": $($sa.action),
      "risk": $($sa.risk),
      "change": $($sa.change),
      "support": $($sa.support),
      "timing": $($sa.timing)
    },
    "needsExpansion": false,
    "needsHumanReview": true
"@

      $escId = [regex]::Escape($entryId)
      $pattern = '("id":\s*"' + $escId + '")[\s\S]*?("version":\s*"[^"]*")'
      if ($content -match $pattern) {
        $replacement = '$1,' + "`r`n" + '    "hexagramId": ' + $h + ',' + "`r`n" + '    "line": ' + $l + ',' + "`r`n" + '    "category": "' + $catId + '",' + "`r`n" + '    "categoryName": "' + $cat.name + '",' + "`r`n" + $newBlock + ',' + "`r`n" + '    $2'
        $content = $content -replace $pattern, $replacement
        $count++
      }
    }
  }
}

$content | Set-Content $file -Encoding UTF8 -NoNewline
Write-Host "Refined $count lineCategory entries for hex 1-8"
