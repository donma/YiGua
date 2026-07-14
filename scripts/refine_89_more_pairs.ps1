# refine_89_more_pairs.ps1
# Select 89 high-value pairs from needsExpansion=true and refine them
# Priority: pairs involving hex 1-16 (most referenced hexagrams)

$pairFile = "D:\AI_PROJECTS\Zero1Matrix\src\data\pairInterpretations.data.js"
$hexFile = "D:\AI_PROJECTS\Zero1Matrix\src\data\hexagrams.data.js"

$pairContent = Get-Content $pairFile -Raw -Encoding UTF8
$hexContent = Get-Content $hexFile -Raw -Encoding UTF8

# Parse hexagram data
$hexMap = @{}
$hPattern = '"id":\s*(\d+)[\s\S]*?"name":\s*"([^"]+)"[\s\S]*?"fullName":\s*"([^"]+)"[\s\S]*?"tone":\s*"([^"]+)"'
$hMatches = [regex]::Matches($hexContent, $hPattern)
foreach ($m in $hMatches) {
  $hid = [int]$m.Groups[1].Value
  $hexMap[$hid] = @{
    name = $m.Groups[2].Value
    fullName = $m.Groups[3].Value
    tone = $m.Groups[4].Value
  }
}

# Find needsExpansion=true entries
$nePattern = '"id":\s*"(pair-[^"]+)"[\s\S]*?"from":\s*(\d+)[\s\S]*?"to":\s*(\d+)[\s\S]*?"needsExpansion":\s*true'
$neMatches = [regex]::Matches($pairContent, $nePattern)
$needsEntries = @()
foreach ($m in $neMatches) {
  $needsEntries += @{
    id = $m.Groups[1].Value
    from = [int]$m.Groups[2].Value
    to = [int]$m.Groups[3].Value
  }
}

Write-Host "Total needsExpansion: $($needsEntries.Count)"

# Score for selecting high-value pairs
function Get-ValueScore($pair) {
  $score = 0
  # Prefer pairs involving key hexagrams (1-16 are most important)
  if ($pair.from -le 16) { $score += 100 }
  if ($pair.to -le 16) { $score += 100 }
  # Prefer pairs with distinct from/to (not self-pairs)
  if ($pair.from -ne $pair.to) { $score += 50 }
  # Prefer pairs with complementary hexagrams
  if ($pair.from -le 16 -and $pair.to -le 16) { $score += 50 }
  return $score
}

# Sort by score and take top 89 that don't already have needsExpansion=false
$toRefine = $needsEntries | Sort-Object -Descending { Get-ValueScore($_) } | Select-Object -First 89

Write-Host "Selected 89 pairs for refinement:"
$toRefine | ForEach-Object { Write-Host "  $($_.id) (from=$($_.from) to=$($_.to))" }

# Transition tone mapping
$toneTransition = @{
  '剛健開創' = '由進轉守'
  '厚載承順' = '由守轉進'
  '開局艱難' = '由亂入合'
  '啟蒙養正' = '由閉轉通'
  '等待時機' = '由動轉止'
  '爭訟對立' = '由爭轉和'
  '統帥用兵' = '由爭轉和'
  '親附和合' = '由分裂轉凝聚'
  '小有積蓄' = '由未成轉既成'
  '謹慎前行' = '由進轉守'
  '通泰安和' = '由盛轉衰'
  '閉塞不通' = '由閉轉通'
  '與人和同' = '由分裂轉凝聚'
  '大有收穫' = '由既成轉未穩'
  '謙遜退讓' = '由進轉守'
  '愉悅安樂' = '由盛轉衰'
  '追隨順應' = '由止轉動'
  '整治積弊' = '由衰轉復'
}

$defaultTone = '由進轉守'

$count = 0
foreach ($pair in $toRefine) {
  $f = if ($hexMap.ContainsKey($pair.from)) { $hexMap[$pair.from] } else { @{name='?';fullName='?';tone='?'} }
  $t = if ($hexMap.ContainsKey($pair.to)) { $hexMap[$pair.to] } else { @{name='?';fullName='?';tone='?'} }

  $tt = if ($toneTransition.ContainsKey($t.tone)) { $toneTransition[$t.tone] } else { $defaultTone }

  $summary = "本卦$($f.fullName)代表當前局勢呈現「$($f.tone)」的特質，變為$($t.fullName)則表示後勢逐步轉向「$($t.tone)」。此變化不是立刻轉換，而是提醒你：看清本卦指出的當前限制，順著變卦給出的方向調整，才能讓局勢往好的方向發展。"
  
  $advice = "不要只看本卦的現況就急著下判斷。先理解$($f.name)卦當前給你的提醒是什麼，再用$($t.name)卦的方向來調整下一步。若問工作，宜先穩住基礎，再看後勢機會；若問關係，宜先處理當前矛盾，再考慮未來走向。"
  
  $risk = "最大的風險是只看變卦的結果，卻不處理本卦$($f.name)的問題。另一風險是把$($t.name)卦的趨勢當成必然，忽略了中間需要你主動調整的過程。"
  
  $timingStr = "先安頓，再轉向；先觀察$($t.name)卦的訊號出現，再順勢而行。不宜在本卦問題未解時急著轉變。"

  # Score adjust
  $sa = @{ clarity = 4; action = 3; risk = -2; change = 8; support = 5; timing = 2 }
  if ($f.tone -match '險|困') { $sa.risk -= 3; $sa.clarity -= 1 }
  if ($t.tone -match '順|通') { $sa.clarity += 2; $sa.support += 3 }
  if ($f.tone -match '開創|進') { $sa.action += 2; $sa.change += 2 }
  if ($t.tone -match '守|止') { $sa.action -= 2; $sa.timing -= 1 }

  $newBlock = @"
    "transitionTone": "$tt",
    "summary": "$summary",
    "advice": "$advice",
    "risk": "$risk",
    "timing": "$timingStr",
    "basis": [
      "$($f.name)",
      "$($t.name)",
      "卦辭",
      "象辭"
    ],
    "scoreAdjust": {
      "clarity": $($sa.clarity),
      "action": $($sa.action),
      "risk": $($sa.risk),
      "change": $($sa.change),
      "support": $($sa.support),
      "timing": $($sa.timing)
    },
    "qualityLevel": "v6-extended-pair-refined",
    "needsExpansion": false,
    "needsHumanReview": true
"@

  $escId = [regex]::Escape($pair.id)
  # Match the full object from id to needsExpansion: true
  $pattern = '("id":\s*"' + $escId + '")[\s\S]*?("needsExpansion":\s*)true'
  
  if ($pairContent -match $pattern) {
    $replacement = '$1,' + "`r`n" + $newBlock + ',' + "`r`n" + '    $2false'
    $pairContent = $pairContent -replace $pattern, $replacement
    $count++
  } else {
    Write-Host "  WARN: no match for $($pair.id)"
  }
}

$pairContent | Set-Content $pairFile -Encoding UTF8 -NoNewline
Write-Host "Refined $count pairs. Saved."
