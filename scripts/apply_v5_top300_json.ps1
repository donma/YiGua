# apply_v5_top300_json.ps1 - Use JSON parsing to apply v5 refinement
$pairFile = "D:\AI_PROJECTS\Zero1Matrix\src\data\pairInterpretations.data.js"
$hexFile = "D:\AI_PROJECTS\Zero1Matrix\src\data\hexagrams.data.js"
$todoFile = "D:\AI_PROJECTS\Zero1Matrix\src\data\pairExpansionTop300.todo.data.js"

# Read and extract JSON from pair file
$pairContent = Get-Content $pairFile -Raw -Encoding UTF8
$jsonStart = $pairContent.IndexOf('= [') + 3
$jsonEnd = $pairContent.LastIndexOf('];')
$jsonText = $pairContent.Substring($jsonStart, $jsonEnd - $jsonStart)

# Parse JSON
$pairs = $jsonText | ConvertFrom-Json -Depth 10
Write-Host "Parsed $($pairs.Count) pairs"

# Parse hexagrams
$hexContent = Get-Content $hexFile -Raw -Encoding UTF8
$hexMap = @{}
$hPattern = '"id":\s*(\d+)[\s\S]*?"name":\s*"([^"]+)"[\s\S]*?"fullName":\s*"([^"]+)"[\s\S]*?"tone":\s*"([^"]+)"'
foreach ($m in [regex]::Matches($hexContent, $hPattern)) {
  $hexMap[[int]$m.Groups[1].Value] = @{
    name = $m.Groups[2].Value
    fullName = $m.Groups[3].Value
    tone = $m.Groups[4].Value
  }
}

# Parse v5 todo IDs
$todoContent = Get-Content $todoFile -Raw -Encoding UTF8
$v5Ids = @{}
$tPattern = '"id":\s*"(pair-(\d+)-(\d+))"'
foreach ($m in [regex]::Matches($todoContent, $tPattern)) {
  $v5Ids[$m.Groups[1].Value] = @{ from = [int]$m.Groups[2].Value; to = [int]$m.Groups[3].Value }
}
Write-Host "v5 todo: $($v5Ids.Count) pairs"

# Tone transition mapping
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

$count = 0
foreach ($pair in $pairs) {
  if ($v5Ids.ContainsKey($pair.id) -and $pair.needsExpansion) {
    $vp = $v5Ids[$pair.id]
    $f = if ($hexMap.ContainsKey($vp.from)) { $hexMap[$vp.from] } else { @{name='?';fullName='?';tone='?'} }
    $t = if ($hexMap.ContainsKey($vp.to)) { $hexMap[$vp.to] } else { @{name='?';fullName='?';tone='?'} }
    
    $tt = if ($toneMap.ContainsKey($t.tone)) { $toneMap[$t.tone] } else { '由進轉守' }
    
    $pair | Add-Member -NotePropertyName 'transitionTone' -NotePropertyValue $tt -Force
    $pair.summary = "本卦$($f.fullName)代表當前局勢呈現「$($f.tone)」的特質，變為$($t.fullName)則表示後勢逐步轉向「$($t.tone)」。此變化不是立刻轉換，而是提醒你：看清本卦指出的當前限制，順著變卦給出的方向調整，才能讓局勢往好的方向發展。"
    $pair.advice = "不要只看本卦的現況就急著下判斷。先理解$($f.name)卦當前給你的提醒是什麼，再用$($t.name)卦的方向來調整下一步。若問工作，宜先穩住基礎，再看後勢機會；若問關係，宜先處理當前矛盾，再考慮未來走向。"
    $pair.risk = "最大的風險是只看變卦的結果，卻不處理本卦$($f.name)的問題。另一風險是把$($t.name)卦的趨勢當成必然，忽略了中間需要你主動調整的過程。"
    $pair | Add-Member -NotePropertyName 'timing' -NotePropertyValue "先安頓，再轉向；先觀察$($t.name)卦的訊號出現，再順勢而行。不宜在本卦問題未解時急著轉變。" -Force
    
    $sa = @{ clarity=4; action=3; risk=-2; change=8; support=5; timing=2 }
    if ($f.tone -match '險|困') { $sa.risk -= 3; $sa.clarity -= 1 }
    if ($t.tone -match '順|通') { $sa.clarity += 2; $sa.support += 3 }
    if ($f.tone -match '開創|進') { $sa.action += 2; $sa.change += 2 }
    if ($t.tone -match '守|止') { $sa.action -= 2; $sa.timing -= 1 }
    
    $pair.scoreAdjust = [PSCustomObject]@{ clarity=$sa.clarity; action=$sa.action; risk=$sa.risk; change=$sa.change; support=$sa.support; timing=$sa.timing }
    $pair.basis = @($f.name, $t.name, "卦辭", "象辭")
    $pair | Add-Member -NotePropertyName 'qualityLevel' -NotePropertyValue 'v5-top300-refined' -Force
    $pair.needsExpansion = $false
    $pair.version = "1.5.0-v5"
    
    $count++
  }
}
Write-Host "Refined $count v5 pairs"

# Convert back to JSON and save
$json = $pairs | ConvertTo-Json -Depth 10 -Compress
$jsContent = "window.Zero1MatrixData = window.Zero1MatrixData || {};`r`nwindow.Zero1MatrixData.pairInterpretations = $json;"
$jsContent | Set-Content $pairFile -Encoding UTF8 -NoNewline
Write-Host "Saved. Size: $($jsContent.Length) bytes"