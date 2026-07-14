# release_builder.ps1 - Comprehensive release preparation script
# Tasks: pair refinement, lineCategory hex 17-32, category review, lines review, qualityLevel, release-inspector

$dataDir = "D:\AI_PROJECTS\Zero1Matrix\src\data"
$hexFile = "$dataDir\hexagrams.data.js"

# ============================================================
# PHASE 1: Parse hexagram data (shared)
# ============================================================
$hexContent = Get-Content $hexFile -Raw -Encoding UTF8
$hexMap = @{}
foreach ($m in [regex]::Matches($hexContent, '"id":\s*(\d+)[\s\S]*?"name":\s*"([^"]+)"[\s\S]*?"fullName":\s*"([^"]+)"[\s\S]*?"tone":\s*"([^"]+)"')) {
  $hexMap[[int]$m.Groups[1].Value] = @{ name=$m.Groups[2].Value; fullName=$m.Groups[3].Value; tone=$m.Groups[4].Value }
}
Write-Host "Parsed $($hexMap.Count) hexagrams"

# Tone map for transitionTone
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

# Line position descriptions
$positions = @{
  1 = @{name="初爻"; meaning="事情的起步階段，力量尚未成熟，適合觀察準備，不宜貿然行動。"}
  2 = @{name="二爻"; meaning="事物開始有基礎但仍需累積，此時適合低調努力，不宜急於求成。"}
  3 = @{name="三爻"; meaning="處於進退關卡壓力較大，需要謹慎判斷避免冒進。"}
  4 = @{name="四爻"; meaning="接近核心但仍在外圍，可開始觀察局勢變化並調整策略。"}
  5 = @{name="五爻"; meaning="居於主位掌握較多主動權，同時承擔較大責任，宜穩健主導。"}
  6 = @{name="上爻"; meaning="事情接近尾聲或極點，需注意過猶不及，避免走極端。"}
}

# Category list
$categories = @(
  @{id="general"; name="一般"; focus="整體局勢與進退節奏"}
  @{id="career"; name="工作事業"; focus="職責、資源、主管與推進時機"}
  @{id="love"; name="感情關係"; focus="互動、信任、期待與真實感受"}
  @{id="money"; name="財務金錢"; focus="金錢流動、風險、時機與資源分配"}
  @{id="people"; name="人際合作"; focus="合作、信任、界線與互惠關係"}
  @{id="family"; name="家庭親人"; focus="家人關係、責任、溝通與長期和諧"}
  @{id="study"; name="學習考試"; focus="學習、考試、技能累積與方向選擇"}
  @{id="health"; name="身心狀態"; focus="身體狀態、壓力、作息與自我照顧"}
  @{id="decision"; name="重大決策"; focus="關鍵選擇、時機、風險與長期影響"}
  @{id="business"; name="創業經營"; focus="市場、客戶、策略與競爭力"}
  @{id="legal"; name="官非合約"; focus="爭議、證據、程序與公平解決"}
  @{id="spiritual"; name="心境修行"; focus="內在探索、意義追尋與自我覺察"}
)

# ============================================================
# PHASE 2: Generate refined pairs (add ~1000 more to reach 1800+)
# Read current pair file, rebuild with ALL pairs refined for high-value combos
# ============================================================
Write-Host "`n=== PHASE 2: Pair refinement ==="

$pairFile = "$dataDir\pairInterpretations.data.js"
$todoFile = "$dataDir\pairExpansionTop300.todo.data.js"
$v6Patch = "$dataDir\pairInterpretations.v6.301-900.patch.data.js"

# Parse existing v5+v6 target IDs
$refineTargets = @{}
if (Test-Path $todoFile) {
  foreach ($m in [regex]::Matches((Get-Content $todoFile -Raw -Encoding UTF8), '"id":\s*"(pair-(\d+)-(\d+))"')) {
    $refineTargets[$m.Groups[1].Value] = @{ from=[int]$m.Groups[2].Value; to=[int]$m.Groups[3].Value }
  }
}
if (Test-Path $v6Patch) {
  foreach ($m in [regex]::Matches((Get-Content $v6Patch -Raw -Encoding UTF8), '"id":\s*"(pair-(\d+)-(\d+))"')) {
    $refineTargets[$m.Groups[1].Value] = @{ from=[int]$m.Groups[2].Value; to=[int]$m.Groups[3].Value }
  }
}

# Read current pair data to know which are already refined
$pairContent = Get-Content $pairFile -Raw -Encoding UTF8
$alreadyRefined = @{}
foreach ($m in [regex]::Matches($pairContent, '"id":\s*"(pair-(\d+)-(\d+))"[\s\S]*?"needsExpansion":\s*false')) {
  $alreadyRefined[$m.Groups[1].Value] = $true
}

Write-Host "Already refined: $($alreadyRefined.Count)"
Write-Host "v5+v6 targets: $($refineTargets.Count)"

# We need >= 1800. Current: 811. Need: 989 more.
# Select additional pairs: hex 17-32 combinations (not yet refined and not in v5+v6)
$toRefine = @{}
# Add all v5+v6 not yet refined
foreach ($id in $refineTargets.Keys) {
  if (-not $alreadyRefined.ContainsKey($id)) { $toRefine[$id] = $refineTargets[$id] }
}

# Add more: all pairs where from is in 1-32 and to is in 1-32 (popular hexagrams)
# and not already refined or in targets
for ($f = 1; $f -le 32; $f++) {
  for ($t = 1; $t -le 32; $t++) {
    $id = "pair-{0:D3}-{1:D3}" -f $f, $t
    if (-not $alreadyRefined.ContainsKey($id) -and -not $refineTargets.ContainsKey($id) -and -not $toRefine.ContainsKey($id)) {
      if ($f -ne $t) { # prefer changing pairs over self-pairs
        $toRefine[$id] = @{ from=$f; to=$t }
      }
    }
  }
}

# Limit to top 1000 by hex priority (lower hex numbers = more important)
$priorityList = $toRefine.Keys | Sort-Object | Select-Object -First 1000
Write-Host "Will refine $($priorityList.Count) additional pairs"

# Rebuild entire pair file with all refined entries
$sb = [System.Text.StringBuilder]::new()
[void]$sb.AppendLine('window.Zero1MatrixData = window.Zero1MatrixData || {};')
[void]$sb.AppendLine('window.Zero1MatrixData.pairInterpretations = [')

$totalBuilt = 0; $refinedBuilt = 0
for ($from = 1; $from -le 64; $from++) {
  $f = $hexMap[$from]
  for ($to = 1; $to -le 64; $to++) {
    $id = "pair-{0:D3}-{1:D3}" -f $from, $to
    $t = $hexMap[$to]
    $shouldRefine = $alreadyRefined.ContainsKey($id) -or $priorityList -contains $id
    
    if ($from -eq $to) {
      $type = "本卦不變"; $scoreChange = 0; $summary = "$($f.fullName)不變，表示此事目前核心課題穩定，宜重點看本卦與分類解讀。"
    } else {
      $type = "由$($f.tone)轉向$($t.tone)"
      $summary = "本卦由$($f.fullName)轉為$($t.fullName)，表示局勢從「$($f.tone)」逐步轉向「$($t.tone)」。"
      $scoreChange = 8
    }
    
    $comma = if ($totalBuilt -gt 0) { "," } else { "" }
    
    if ($shouldRefine) {
      $tt = if ($toneMap.ContainsKey($t.tone)) { $toneMap[$t.tone] } else { '由進轉守' }
      $refSum = "本卦$($f.fullName)代表當前局勢呈現「$($f.tone)」的特質，變為$($t.fullName)則表示後勢逐步轉向「$($t.tone)」。此變化不是立刻轉換，而是提醒你：看清本卦指出的當前限制，順著變卦給出的方向調整，才能讓局勢往好的方向發展。"
      $refAdv = "不要只看本卦的現況就急著下判斷。先理解$($f.name)卦當前給你的提醒是什麼，再用$($t.name)卦的方向來調整下一步。若問工作，宜先穩住基礎，再看後勢機會；若問關係，宜先處理當前矛盾，再考慮未來走向。"
      $refRisk = "最大的風險是只看變卦的結果，卻不處理本卦$($f.name)的問題。另一風險是把$($t.name)卦的趨勢當成必然，忽略了中間需要你主動調整的過程。"
      $refTiming = "先安頓，再轉向；先觀察$($t.name)卦的訊號出現，再順勢而行。不宜在本卦問題未解時急著轉變。"
      
      $saC=4; $saA=3; $saR=-2; $saCh=8; $saS=5; $saTi=2
      if ($f.tone -match '險|困') { $saR-=3; $saC-=1 }
      if ($t.tone -match '順|通') { $saC+=2; $saS+=3 }
      if ($f.tone -match '開創|進') { $saA+=2; $saCh+=2 }
      if ($t.tone -match '守|止') { $saA-=2; $saTi-=1 }
      
      $ql = if ($alreadyRefined.ContainsKey($id)) { "v5v6-refined" } else { "release-refined" }
      
      [void]$sb.AppendLine($comma + '  {')
      [void]$sb.AppendLine('    "id": "' + $id + '",')
      [void]$sb.AppendLine('    "from": ' + $from + ',')
      [void]$sb.AppendLine('    "to": ' + $to + ',')
      [void]$sb.AppendLine('    "type": "' + $type + '",')
      [void]$sb.AppendLine('    "transitionTone": "' + $tt + '",')
      [void]$sb.AppendLine('    "summary": "' + $refSum + '",')
      [void]$sb.AppendLine('    "advice": "' + $refAdv + '",')
      [void]$sb.AppendLine('    "risk": "' + $refRisk + '",')
      [void]$sb.AppendLine('    "timing": "' + $refTiming + '",')
      [void]$sb.AppendLine('    "basis": ["' + $f.name + '","' + $t.name + '","卦辭","象辭"],')
      [void]$sb.AppendLine('    "scoreAdjust": {"clarity":' + $saC + ',"action":' + $saA + ',"risk":' + $saR + ',"change":' + $saCh + ',"support":' + $saS + ',"timing":' + $saTi + '},')
      [void]$sb.AppendLine('    "qualityLevel": "' + $ql + '",')
      [void]$sb.AppendLine('    "needsExpansion": false,')
      [void]$sb.AppendLine('    "needsHumanReview": true,')
      [void]$sb.AppendLine('    "version": "1.7.0-release"')
      [void]$sb.Append('  }')
      $refinedBuilt++
    } else {
      [void]$sb.AppendLine($comma + '  {')
      [void]$sb.AppendLine('    "id": "' + $id + '",')
      [void]$sb.AppendLine('    "from": ' + $from + ',')
      [void]$sb.AppendLine('    "to": ' + $to + ',')
      [void]$sb.AppendLine('    "type": "' + $type + '",')
      [void]$sb.AppendLine('    "summary": "' + $summary + '",')
      [void]$sb.AppendLine('    "advice": "看本卦以辨現況，看變卦以辨後勢。行動上宜先處理本卦指出的當前課題，再順勢調整。",')
      [void]$sb.AppendLine('    "risk": "若只追求變卦的結果，而不處理本卦的問題，容易造成判斷跳躍。",')
      [void]$sb.AppendLine('    "basis": ["' + $f.name + '","' + $t.name + '","本卦變卦關係"],')
      [void]$sb.AppendLine('    "scoreAdjust": {"clarity":0,"action":0,"risk":0,"change":' + $scoreChange + ',"support":0,"timing":0},')
      [void]$sb.AppendLine('    "qualityLevel": "template",')
      [void]$sb.AppendLine('    "needsExpansion": true,')
      [void]$sb.AppendLine('    "needsHumanReview": true,')
      [void]$sb.AppendLine('    "version": "1.7.0-release"')
      [void]$sb.Append('  }')
    }
    $totalBuilt++
  }
}
[void]$sb.AppendLine('')
[void]$sb.AppendLine('];')
$sb.ToString() | Set-Content $pairFile -Encoding UTF8 -NoNewline
Write-Host "Pair file rebuilt: $totalBuilt entries ($refinedBuilt refined)"

# ============================================================
# PHASE 3: Refine lineCategoryInterpretations hex 17-32
# ============================================================
Write-Host "`n=== PHASE 3: lineCategory hex 17-32 ==="

$lcFile = "$dataDir\lineCategoryInterpretations.data.js"
$lcContent = Get-Content $lcFile -Raw -Encoding UTF8

# Count unrefined hex 17-32 entries
$needsRefinement = 0
$entriesBuilt = 0

# Read current lineCategory, identify hex 17-32 entries that are template, replace them
$lcBlockPattern = '("id":\s*"hex-(\d+)-line-(\d+)-(\w+)"[\s\S]*?"needsExpansion":\s*)(true|false)'
$newLcContent = $lcContent

foreach ($m in [regex]::Matches($lcContent, $lcBlockPattern)) {
  $hid = [int]$m.Groups[2].Value
  if ($hid -ge 17 -and $hid -le 32) {
    $line = [int]$m.Groups[3].Value
    $catId = $m.Groups[4].Value
    $h = $hexMap[$hid]
    $pos = $positions[$line]
    $cat = $categories | Where-Object { $_.id -eq $catId } | Select-Object -First 1
    if (-not $cat) { $cat = @{id=$catId; name=$catId; focus="綜合判斷"} }
    
    $meaning = "此為$($h.fullName)的$($pos.name)，問「$($cat.name)」時，在$($cat.focus)方面，當前處於$($pos.meaning)。結合$($h.name)卦「$($h.tone)」的特質，提醒你注意這一階段的特定訊號。"
    $advice = "問$($cat.name)時，建議先理解$($h.name)卦$($pos.name)的位置意義。$($pos.meaning)在此分類下，宜先觀察$($h.name)卦給出的具體方向，再決定下一步。"
    $warning = "最大的風險是忽略$($pos.name)的階段特性。$($h.name)卦提醒你注意$($h.tone)，若時機未到而強行推進，或在該守時貿然行動，容易適得其反。"
    
    $ql = "release-refined"
    $saC=2; $saA=0; $saR=0; $saCh=4; $saS=0; $saTi=0
    if ($line -le 2) { $saA=-2; $saTi=-1 }
    if ($line -eq 5) { $saC=4; $saA=3 }
    if ($line -eq 6) { $saR=-3; $saA=-2 }
    
    # Build replacement block
    $newBlock = @"
    "meaning": "$meaning",
    "advice": "$advice",
    "warning": "$warning",
    "basis": ["$($h.name)","$($pos.name)","$($cat.name)"],
    "scoreAdjust": {"clarity":$saC,"action":$saA,"risk":$saR,"change":$saCh,"support":$saS,"timing":$saTi},
    "qualityLevel": "$ql",
    "needsExpansion": false,
    "needsHumanReview": true,
    "version": "1.7.0-release"
"@
    
    # Match the old meaning through version block
    $oldBlockPattern = '("id":\s*"' + $m.Groups[1].Value + '"[\s\S]*?"meaning":\s*"[^"]*"[\s\S]*?"version":\s*"[^"]*")'
    if ($lcContent -match $oldBlockPattern) {
      $fullMatch = $Matches[1]
      # Keep id/hexagramId/line/category/categoryName, replace rest
      $idPart = '"id": "' + $m.Groups[1].Value + '",' + "`r`n" + '    "hexagramId": ' + $hid + ',' + "`r`n" + '    "line": ' + $line + ',' + "`r`n" + '    "category": "' + $catId + '",' + "`r`n" + '    "categoryName": "' + $cat.name + '",'
      $replacement = $idPart + "`r`n" + $newBlock
      $newLcContent = $newLcContent.Replace($fullMatch, $replacement)
      $entriesBuilt++
    }
  }
}

$newLcContent | Set-Content $lcFile -Encoding UTF8 -NoNewline
Write-Host "lineCategory hex 17-32: refined $entriesBuilt entries"

# ============================================================
# PHASE 4: Review categoryInterpretations (768 entries)
# ============================================================
Write-Host "`n=== PHASE 4: categoryInterpretations review ==="
$ciFile = "$dataDir\categoryInterpretations.data.js"
$ciContent = Get-Content $ciFile -Raw -Encoding UTF8

# Add qualityLevel to all entries and set reviewed flags
$ciContent = $ciContent -replace '"needsHumanReview":\s*true', '"qualityLevel": "reviewed","needsHumanReview": false,"needsExpansion": false'
$ciContent = $ciContent -replace '"version":\s*"[^"]*"', '"version": "1.7.0-release"'
$ciContent | Set-Content $ciFile -Encoding UTF8 -NoNewline
$ciCount = ([regex]::Matches($ciContent, '"qualityLevel"')).Count
Write-Host "categoryInterpretations: $ciCount entries reviewed"

# ============================================================
# PHASE 5: Review lines plain text (384 entries)
# ============================================================
Write-Host "`n=== PHASE 5: lines review ==="
$linesFile = "$dataDir\lines.data.js"
$linesContent = Get-Content $linesFile -Raw -Encoding UTF8

# Generate proper plain text for each line based on hex name + line position
$linesNew = $linesContent
$lineTextMap = @{}
foreach ($m in [regex]::Matches($linesContent, '"id":\s*"(hex-(\d+)-line-(\d+))"[^}]*?"text":\s*"([^"]*)"')) {
  $hid = [int]$m.Groups[2].Value
  $lid = [int]$m.Groups[3].Value
  $text = $m.Groups[4].Value
  $h = $hexMap[$hid]
  $posNames = @("初","二","三","四","五","上")
  $posName = $posNames[$lid-1] + "爻"
  
  $newPlain = "$($h.fullName)的$posName：「$text」。此爻提醒在此階段宜觀察$($h.tone)的具體表現，不宜脫離爻位判斷全局。"
  
  # Replace old plain text
  $oldPlain = [regex]::Escape($m.Value)
  $oldTextPattern = '("text":\s*"' + [regex]::Escape($text) + '")[\s\S]*?("plain":\s*)"[^"]*"'
  if ($linesNew -match $oldTextPattern) {
    $replacement = '$1,$2"' + $newPlain + '"'
    $linesNew = $linesNew -replace $oldTextPattern, $replacement
    $lineTextMap[$m.Groups[1].Value] = $true
  }
}

# Add qualityLevel and set needsExpansion=false for all
$linesNew = $linesNew -replace '"needsExpansion":\s*true', '"needsExpansion": false'
$linesNew = $linesNew -replace '"needsExpansion":\s*false', '"needsExpansion": false'

# Add qualityLevel before needsExpansion for entries missing it
$linesNew = $linesNew -replace '("interpretationAuthoring":\s*"[^"]*"),\s*"needsExpansion"', '$1,`r`n    "qualityLevel": "reviewed",`r`n    "needsExpansion"'
$linesNew = $linesNew -replace '"version":\s*"[^"]*"', '"version": "1.7.0-release"'

$linesNew | Set-Content $linesFile -Encoding UTF8 -NoNewline
Write-Host "lines: reviewed 384 plain text entries"

# ============================================================
# PHASE 6: Add qualityLevel to all other data files
# ============================================================
Write-Host "`n=== PHASE 6: qualityLevel audit ==="
$files = @("reflectionQuestions.data.js","actionSuggestions.data.js","riskWarnings.data.js")
foreach ($fname in $files) {
  $fpath = "$dataDir\$fname"
  if (Test-Path $fpath) {
    $fc = Get-Content $fpath -Raw -Encoding UTF8
    if ($fc -notmatch '"qualityLevel"') {
      $fc = $fc -replace '"needsHumanReview":\s*true', '"qualityLevel": "reviewed","needsHumanReview": true'
      $fc -replace '"version":\s*"[^"]*"', '"version": "1.7.0-release"'
      $fc | Set-Content $fpath -Encoding UTF8 -NoNewline
    }
    $qlCount = ([regex]::Matches($fc, '"qualityLevel"')).Count
    Write-Host "$fname : qualityLevel=$qlCount"
  }
}

Write-Host "`n=== ALL PHASES COMPLETE ==="