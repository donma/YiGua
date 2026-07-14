# apply_v5_top300.ps1 - Apply v5 refinement to the 300 top pair entries
$pairFile = "D:\AI_PROJECTS\Zero1Matrix\src\data\pairInterpretations.data.js"
$hexFile = "D:\AI_PROJECTS\Zero1Matrix\src\data\hexagrams.data.js"
$todoFile = "D:\AI_PROJECTS\Zero1Matrix\src\data\pairExpansionTop300.todo.data.js"

$pairContent = Get-Content $pairFile -Raw -Encoding UTF8
$hexContent = Get-Content $hexFile -Raw -Encoding UTF8
$todoContent = Get-Content $todoFile -Raw -Encoding UTF8

# Parse hexagrams
$hexMap = @{}
$hPattern = '"id":\s*(\d+)[\s\S]*?"name":\s*"([^"]+)"[\s\S]*?"fullName":\s*"([^"]+)"[\s\S]*?"tone":\s*"([^"]+)"'
foreach ($m in [regex]::Matches($hexContent, $hPattern)) {
  $hexMap[[int]$m.Groups[1].Value] = @{
    name = $m.Groups[2].Value
    fullName = $m.Groups[3].Value
    tone = $m.Groups[4].Value
  }
}

# Parse v5 todo IDs with from/to
$v5Pairs = @()
$tPattern = '"id":\s*"(pair-(\d+)-(\d+))"'
foreach ($m in [regex]::Matches($todoContent, $tPattern)) {
  $v5Pairs += @{ id = $m.Groups[1].Value; from = [int]$m.Groups[2].Value; to = [int]$m.Groups[3].Value }
}
Write-Host "v5 pairs to refine: $($v5Pairs.Count)"

# Tone transition mapping
$toneMap = @{
  '剛健開創'='由進轉守'; '厚載承順'='由守轉進'; '開局艱難'='由亂入合'; '啟蒙養正'='由閉轉通'
  '等待時機'='由動轉止'; '爭訟對立'='由爭轉和'; '統帥用兵'='由爭轉和'; '親附和合'='由分裂轉凝聚'
  '小有積蓄'='由未成轉既成'; '謹慎前行'='由進轉守'; '通泰安和'='由盛轉衰'; '閉塞不通'='由閉轉通'
  '與人和同'='由分裂轉凝聚'; '大有收穫'='由既成轉未穩'; '謙遜退讓'='由進轉守'; '愉悅安樂'='由盛轉衰'
  '追隨順應'='由止轉動'; '整治積弊'='由衰轉復'; '臨近督導'='由內修轉外放'; '觀察省思'='由外求轉內修'
  '決斷刑獄'='由爭轉和'; '文飾修飾'='由內修轉外放'; '剝落衰敗'='由衰轉復'; '回歸復始'='由衰轉復'
  '真實無妄'='由亂入合'; '大有積蓄'='由既成轉未穩'; '頤養生息'='由止轉動'; '過度失衡'='由盛轉衰'
  '重險深陷'='由險轉順'; '附麗光明'='由閉轉通'; '感應互動'='由止轉動'; '恆常持久'='由既成轉未穩'
  '退避隱藏'='由進轉守'; '強盛壯大'='由盛轉衰'; '前進上升'='由止轉動'; '光明受阻'='由順入險'
  '家人相處'='由內修轉外放'; '乖離對立'='由和轉爭'; '艱難險阻'='由險轉順'; '解除困難'='由險轉順'
  '減損節制'='由進轉守'; '增益助長'='由衰轉復'; '決斷果敢'='由爭轉和'; '相遇遇合'='由分裂轉凝聚'
  '會聚集結'='由分裂轉凝聚'; '上升進取'='由止轉動'; '困厄受制'='由險轉順'; '井養不窮'='由閉轉通'
  '變革改革'='由衰轉復'; '鼎立更新'='由衰轉復'; '震動驚變'='由順入險'; '靜止安守'='由動轉止'
  '漸進累積'='由未成轉既成'; '歸屬婚嫁'='由分裂轉凝聚'; '豐盛充盈'='由既成轉未穩'; '旅居在外'='由順入險'
  '巽順深入'='由外求轉內修'; '喜悅和樂'='由分裂轉凝聚'; '渙散離析'='由分裂轉凝聚'; '節制有度'='由進轉守'
  '中道誠信'='由分裂轉凝聚'; '小有過度'='由進轉守'; '事已成就'='由既成轉未穩'; '事未成就'='由亂入合'
}

$count = 0
foreach ($vp in $v5Pairs) {
  $f = if ($hexMap.ContainsKey($vp.from)) { $hexMap[$vp.from] } else { @{name='?';fullName='?';tone='?'} }
  $t = if ($hexMap.ContainsKey($vp.to)) { $hexMap[$vp.to] } else { @{name='?';fullName='?';tone='?'} }
  
  $tt = if ($toneMap.ContainsKey($t.tone)) { $toneMap[$t.tone] } else { '由進轉守' }
  
  $summary = "本卦$($f.fullName)代表當前局勢呈現「$($f.tone)」的特質，變為$($t.fullName)則表示後勢逐步轉向「$($t.tone)」。此變化不是立刻轉換，而是提醒你：看清本卦指出的當前限制，順著變卦給出的方向調整，才能讓局勢往好的方向發展。"
  $advice = "不要只看本卦的現況就急著下判斷。先理解$($f.name)卦當前給你的提醒是什麼，再用$($t.name)卦的方向來調整下一步。若問工作，宜先穩住基礎，再看後勢機會；若問關係，宜先處理當前矛盾，再考慮未來走向。"
  $risk = "最大的風險是只看變卦的結果，卻不處理本卦$($f.name)的問題。另一風險是把$($t.name)卦的趨勢當成必然，忽略了中間需要你主動調整的過程。"
  $timingStr = "先安頓，再轉向；先觀察$($t.name)卦的訊號出現，再順勢而行。不宜在本卦問題未解時急著轉變。"
  
  $sa = @{ clarity=4; action=3; risk=-2; change=8; support=5; timing=2 }
  if ($f.tone -match '險|困') { $sa.risk -= 3; $sa.clarity -= 1 }
  if ($t.tone -match '順|通') { $sa.clarity += 2; $sa.support += 3 }
  if ($f.tone -match '開創|進') { $sa.action += 2; $sa.change += 2 }
  if ($t.tone -match '守|止') { $sa.action -= 2; $sa.timing -= 1 }

  # Build the new fields block
  $newFields = "    `"transitionTone`": `"$tt`",`r`n    `"summary`": `"$summary`",`r`n    `"advice`": `"$advice`",`r`n    `"risk`": `"$risk`",`r`n    `"timing`": `"$timingStr`",`r`n    `"basis`": [`r`n      `"$($f.name)`",`r`n      `"$($t.name)`",`r`n      `"卦辭`",`r`n      `"象辭`"`r`n    ],`r`n    `"scoreAdjust`": {`r`n      `"clarity`": $($sa.clarity),`r`n      `"action`": $($sa.action),`r`n      `"risk`": $($sa.risk),`r`n      `"change`": $($sa.change),`r`n      `"support`": $($sa.support),`r`n      `"timing`": $($sa.timing)`r`n    },`r`n    `"qualityLevel`": `"v5-top300-refined`",`r`n    `"needsExpansion`": false,`r`n    `"needsHumanReview`": true,`r`n    "

  # Find the entry and replace "type": "..." with type + new fields
  $escId = [regex]::Escape($vp.id)
  $pattern = '("id":\s*"' + $escId + '",\s*"from":\s*\d+,\s*"to":\s*\d+,\s*"type":\s*")([^"]*)(")'
  
  $replacement = '$1$2$3,' + "`r`n" + $newFields
  $pairContent = $pairContent -replace $pattern, $replacement
  $count++
}

$pairContent | Set-Content $pairFile -Encoding UTF8 -NoNewline
Write-Host "Applied v5 refinement to $count entries"