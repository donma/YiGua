# refine_lineCategory_top8_missing.ps1 - Fix remaining categories
$file = "D:\AI_PROJECTS\Zero1Matrix\src\data\lineCategoryInterpretations.data.js"
$content = Get-Content $file -Raw -Encoding UTF8

$positions = @{
  1 = @{name="初爻"; meaning="事情的起步階段，力量尚未成熟，適合觀察、準備，不宜貿然行動。"}
  2 = @{name="二爻"; meaning="事物開始有基礎，但仍需累積，此時適合低調努力，不宜急於求成。"}
  3 = @{name="三爻"; meaning="處於進退之間的關卡，壓力較大，需要謹慎判斷，避免冒進。"}
  4 = @{name="四爻"; meaning="接近核心但仍在外圍，可以開始觀察局勢變化，調整自己的位置與策略。"}
  5 = @{name="五爻"; meaning="居於主位，掌握較多主動權，但也承擔較大責任，宜穩健主導。"}
  6 = @{name="上爻"; meaning="事情接近尾聲或極點，此時需注意過猶不及，避免走極端。"}
}

$missingCats = @{
  "business" = @{name="商業經營"; focus="市場、客戶、策略與競爭力"}
  "people" = @{name="人際關係"; focus="合作、溝通、社交網絡與信任建立"}
  "spiritual" = @{name="心靈成長"; focus="內在探索、意義追尋、修行與自我覺察"}
}

$hexContexts = @{
  1 = @{name="乾"; fullName="乾為天"; tone="剛健開創"
    1="潛龍勿用"; 2="見龍在田"; 3="終日乾乾"; 4="或躍在淵"; 5="飛龍在天"; 6="亢龍有悔"}
  2 = @{name="坤"; fullName="坤為地"; tone="厚載承順"
    1="履霜堅冰至"; 2="直方大"; 3="含章可貞"; 4="括囊無咎"; 5="黃裳元吉"; 6="龍戰于野"}
  3 = @{name="屯"; fullName="水雷屯"; tone="開局艱難"
    1="磐桓難進"; 2="屯如邅如"; 3="即鹿無虞"; 4="乘馬班如"; 5="屯其膏"; 6="泣血漣如"}
  4 = @{name="蒙"; fullName="山水蒙"; tone="啟蒙養正"
    1="發蒙啟迪"; 2="包蒙包容"; 3="勿取表象"; 4="困蒙瓶頸"; 5="童蒙謙虛"; 6="擊蒙破除"}
  5 = @{name="需"; fullName="水天需"; tone="等待時機"
    1="需于郊"; 2="需于沙"; 3="需于泥"; 4="需于血"; 5="需于酒食"; 6="入于穴"}
  6 = @{name="訟"; fullName="天水訟"; tone="爭訟對立"
    1="不永所事"; 2="不克訟"; 3="食舊德"; 4="復即命"; 5="訟元吉"; 6="終朝三褫"}
  7 = @{name="師"; fullName="地水師"; tone="統帥用兵"
    1="師出以律"; 2="在師中吉"; 3="師或輿尸"; 4="師左次"; 5="田有禽"; 6="大君有命"}
  8 = @{name="比"; fullName="水地比"; tone="親附和合"
    1="有孚比之"; 2="比之自內"; 3="比之匪人"; 4="外比之"; 5="顯比"; 6="比之無首"}
}

$count = 0
for ($h = 1; $h -le 8; $h++) {
  $hc = $hexContexts[$h]
  for ($l = 1; $l -le 6; $l++) {
    $pos = $positions[$l]
    $lineCtx = $hc[$l]
    foreach ($catId in $missingCats.Keys) {
      $cat = $missingCats[$catId]
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
Write-Host "Refined $count missing lineCategory entries (business/people/spiritual)"
