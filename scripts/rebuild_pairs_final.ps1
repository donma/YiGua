# rebuild_pairs_final.ps1 - Build pairInterpretations from scratch with v5+v6 refinements
$hexFile = "D:\AI_PROJECTS\Zero1Matrix\src\data\hexagrams.data.js"
$todoFile = "D:\AI_PROJECTS\Zero1Matrix\src\data\pairExpansionTop300.todo.data.js"

$hexContent = Get-Content $hexFile -Raw -Encoding UTF8
$todoContent = Get-Content $todoFile -Raw -Encoding UTF8

# Parse hexagrams
$hexMap = @{}
foreach ($m in [regex]::Matches($hexContent, '"id":\s*(\d+)[\s\S]*?"name":\s*"([^"]+)"[\s\S]*?"fullName":\s*"([^"]+)"[\s\S]*?"tone":\s*"([^"]+)"')) {
  $hexMap[[int]$m.Groups[1].Value] = @{ name=$m.Groups[2].Value; fullName=$m.Groups[3].Value; tone=$m.Groups[4].Value }
}

# Parse v5 todo (these get refinement)
$v5Ids = @{}
foreach ($m in [regex]::Matches($todoContent, '"id":\s*"(pair-(\d+)-(\d+))"')) {
  $v5Ids[$m.Groups[1].Value] = @{ from=[int]$m.Groups[2].Value; to=[int]$m.Groups[3].Value }
}

# v6 refined IDs (from the patch file - 600 entries)
$v6PatchContent = Get-Content "D:\AI_PROJECTS\Zero1Matrix\src\data\pairInterpretations.v6.301-900.patch.data.js" -Raw -Encoding UTF8
$v6Ids = @{}
foreach ($m in [regex]::Matches($v6PatchContent, '"id":\s*"(pair-(\d+)-(\d+))"')) {
  $v6Ids[$m.Groups[1].Value] = @{ from=[int]$m.Groups[2].Value; to=[int]$m.Groups[3].Value }
}
Write-Host "v5: $($v5Ids.Count), v6: $($v6Ids.Count)"

$toneMap = @{
  '剛健開創'='由進轉守';'厚載承順'='由守轉進';'開局艱難'='由亂入合';'啟蒙養正'='由閉轉通'
  '等待時機'='由動轉止';'爭訟對立'='由爭轉和';'統帥用兵'='由爭轉和';'親附和合'='由分裂轉凝聚'
  '小有積蓄'='由未成轉既成';'謹慎前行'='由進轉守';'通泰安和'='由盛轉衰';'閉塞不通'='由閉轉通'
  '與人和同'='由分裂轉凝聚';'大有收穫'='由既成轉未穩';'謙遜退讓'='由進轉守';'愉悅安樂'='由盛轉衰'
  '追隨順應'='由止轉動';'整治積弊'='由衰轉復';'臨近督導'='由內修轉外放';'觀察省思'='由外求轉內修'
  '決斷刑獄'='由爭轉和';'文飾修飾'='由內修轉外放';'剝落衰敗'='由衰轉復';'回歸復始'='由衰轉復'
  '真實無妄'='由亂入合';'大有積蓄'='由既成轉未穩';'頤養生息'='由止轉動';'過度失衡'='由盛轉衰'
  '重險深陷'='由險轉順';'附麗光明'='由閉轉通';'感應互動'='由止轉動';'恆常持久'='由既成轉未穩'
  '退避隱藏'='由進轉守';'強盛壯大'='由盛轉衰';'前進上升'='由止轉動';'光明受阻'='由順入險'
  '家人相處'='由內修轉外放';'乖離對立'='由和轉爭';'艱難險阻'='由險轉順';'解除困難'='由險轉順'
  '減損節制'='由進轉守';'增益助長'='由衰轉復';'決斷果敢'='由爭轉和';'相遇遇合'='由分裂轉凝聚'
  '會聚集結'='由分裂轉凝聚';'上升進取'='由止轉動';'困厄受制'='由險轉順';'井養不窮'='由閉轉通'
  '變革改革'='由衰轉復';'鼎立更新'='由衰轉復';'震動驚變'='由順入險';'靜止安守'='由動轉止'
  '漸進累積'='由未成轉既成';'歸屬婚嫁'='由分裂轉凝聚';'豐盛充盈'='由既成轉未穩';'旅居在外'='由順入險'
  '巽順深入'='由外求轉內修';'喜悅和樂'='由分裂轉凝聚';'渙散離析'='由分裂轉凝聚';'節制有度'='由進轉守'
  '中道誠信'='由分裂轉凝聚';'小有過度'='由進轉守';'事已成就'='由既成轉未穩';'事未成就'='由亂入合'
}

$lines = @()
$lines += 'window.Zero1MatrixData = window.Zero1MatrixData || {};'
$lines += 'window.Zero1MatrixData.pairInterpretations = ['

$totalBuilt = 0
$refinedCount = 0

for ($from = 1; $from -le 64; $from++) {
  $f = $hexMap[$from]
  for ($to = 1; $to -le 64; $to++) {
    $idItem = "pair-{0:D3}-{1:D3}" -f $from, $to
    $t = $hexMap[$to]
    $isRefined = $v5Ids.ContainsKey($idItem) -or $v6Ids.ContainsKey($idItem)
    
    if ($from -eq $to) {
      $type = "本卦不變"
      $summary = "$($f.fullName)不變，表示此事目前核心課題穩定，宜重點看本卦與分類解讀。"
      $scoreChange = 0
    } else {
      $type = "由$($f.tone)轉向$($t.tone)"
      $summary = "本卦由$($f.fullName)轉為$($t.fullName)，表示局勢從「$($f.tone)」逐步轉向「$($t.tone)」。"
      $scoreChange = 8
    }
    
    if ($isRefined) {
      $tt = if ($toneMap.ContainsKey($t.tone)) { $toneMap[$t.tone] } else { '由進轉守' }
      $refSummary = "本卦$($f.fullName)代表當前局勢呈現「$($f.tone)」的特質，變為$($t.fullName)則表示後勢逐步轉向「$($t.tone)」。此變化不是立刻轉換，而是提醒你：看清本卦指出的當前限制，順著變卦給出的方向調整，才能讓局勢往好的方向發展。"
      $refAdvice = "不要只看本卦的現況就急著下判斷。先理解$($f.name)卦當前給你的提醒是什麼，再用$($t.name)卦的方向來調整下一步。若問工作，宜先穩住基礎，再看後勢機會；若問關係，宜先處理當前矛盾，再考慮未來走向。"
      $refRisk = "最大的風險是只看變卦的結果，卻不處理本卦$($f.name)的問題。另一風險是把$($t.name)卦的趨勢當成必然，忽略了中間需要你主動調整的過程。"
      $refTiming = "先安頓，再轉向；先觀察$($t.name)卦的訊號出現，再順勢而行。不宜在本卦問題未解時急著轉變。"
      
      $saClarity = 4; $saAction = 3; $saRisk = -2; $saChange = 8; $saSupport = 5; $saTiming = 2
      if ($f.tone -match '險|困') { $saRisk -= 3; $saClarity -= 1 }
      if ($t.tone -match '順|通') { $saClarity += 2; $saSupport += 3 }
      if ($f.tone -match '開創|進') { $saAction += 2; $saChange += 2 }
      if ($t.tone -match '守|止') { $saAction -= 2; $saTiming -= 1 }
      
      $entry = @"
  {
    "id": "$idItem",
    "from": $from,
    "to": $to,
    "type": "$type",
    "transitionTone": "$tt",
    "summary": "$refSummary",
    "advice": "$refAdvice",
    "risk": "$refRisk",
    "timing": "$refTiming",
    "basis": ["$($f.name)","$($t.name)","卦辭","象辭"],
    "scoreAdjust": {"clarity":$saClarity,"action":$saAction,"risk":$saRisk,"change":$saChange,"support":$saSupport,"timing":$saTiming},
    "qualityLevel": "v5v6-pair-refined",
    "needsExpansion": false,
    "needsHumanReview": true,
    "version": "1.6.0-v6"
  }
"@
      $refinedCount++
    } else {
      $entry = @"
  {
    "id": "$idItem",
    "from": $from,
    "to": $to,
    "type": "$type",
    "summary": "$summary",
    "advice": "看本卦以辨現況，看變卦以辨後勢。行動上宜先處理本卦指出的當前課題，再順勢調整。",
    "risk": "若只追求變卦的結果，而不處理本卦的問題，容易造成判斷跳躍。",
    "basis": ["$($f.name)","$($t.name)","本卦變卦關係"],
    "scoreAdjust": {"clarity":0,"action":0,"risk":0,"change":$scoreChange,"support":0,"timing":0},
    "needsExpansion": true,
    "needsHumanReview": true,
    "version": "1.0.0"
  }
"@
    }
    
    if ($totalBuilt -gt 0) { $lines += "  ," }
    # Remove trailing newline and add comma separator if not first
    $lines += $entry.TrimEnd()
    $totalBuilt++
  }
}

$lines += '];'

$output = $lines -join "`r`n"
$output | Set-Content "D:\AI_PROJECTS\Zero1Matrix\src\data\pairInterpretations.data.js" -Encoding UTF8 -NoNewline
Write-Host "Built $totalBuilt entries ($refinedCount refined)"

# Verify
$content = Get-Content "D:\AI_PROJECTS\Zero1Matrix\src\data\pairInterpretations.data.js" -Raw -Encoding UTF8
$open = ($content.ToCharArray() | Where-Object { $_ -eq '{' }).Count
$close = ($content.ToCharArray() | Where-Object { $_ -eq '}' }).Count
$ids = [regex]::Matches($content, '"id":\s*"pair-(\d+-\d+)"') | ForEach-Object { $_.Groups[1].Value }
Write-Host "Brackets: $open=$close diff=$($open-$close)"
Write-Host "IDs: $($ids.Count) unique=$($ids | Sort-Object -Unique).Count"
$neTrue = ([regex]::Matches($content, '"needsExpansion":\s*true')).Count
$neFalse = ([regex]::Matches($content, '"needsExpansion":\s*false')).Count
$nhrTrue = ([regex]::Matches($content, '"needsHumanReview":\s*true')).Count
$tt = ([regex]::Matches($content, '"transitionTone"')).Count
$ti = ([regex]::Matches($content, '"timing":\s*"')).Count
Write-Host "needsExpansion=true: $neTrue, false: $neFalse (missing: $($ids.Count-$neTrue-$neFalse))"
Write-Host "needsHumanReview=true: $nhrTrue"
Write-Host "transitionTone: $tt, timing: $ti"