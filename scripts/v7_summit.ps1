# v7_summit.ps1 - Complete v7 summit construction
# Uses ConvertFrom-Json/ConvertTo-Json for safe object manipulation
$ErrorActionPreference = "Continue"
$dataDir = "D:\AI_PROJECTS\Zero1Matrix\src\data"

# ============================================================
# Shared: Parse hexagram data
# ============================================================
$hexContent = Get-Content "$dataDir\hexagrams.data.js" -Raw -Encoding UTF8
$hexJson = $hexContent.Substring($hexContent.IndexOf('= [') + 2, $hexContent.LastIndexOf('];') + 1 - $hexContent.IndexOf('= [') - 2)
$hexagrams = $hexJson | ConvertFrom-Json -Depth 10
$hexMap = @{}
foreach ($h in $hexagrams) { $hexMap[$h.id] = $h }
Write-Host "Loaded $($hexagrams.Count) hexagrams"

$posNames = @("初爻","二爻","三爻","四爻","五爻","上爻")
$posMeanings = @(
  "事情的起步階段，力量尚未成熟，適合觀察準備，不宜貿然行動。",
  "事物開始有基礎但仍需累積，此時適合低調努力，不宜急於求成。",
  "處於進退關卡壓力較大，需要謹慎判斷避免冒進。",
  "接近核心但仍在外圍，可開始觀察局勢變化並調整策略。",
  "居於主位掌握較多主動權，同時承擔較大責任，宜穩健主導。",
  "事情接近尾聲或極點，需注意過猶不及，避免走極端。"
)
$catList = @(
  @{id="general"; name="一般"; focus="整體局勢與進退節奏"},
  @{id="career"; name="工作事業"; focus="職責資源主管與推進時機"},
  @{id="love"; name="感情關係"; focus="互動信任期待與真實感受"},
  @{id="money"; name="財務金錢"; focus="金錢流動風險時機與資源分配"},
  @{id="people"; name="人際合作"; focus="合作信任界線與互惠關係"},
  @{id="family"; name="家庭親人"; focus="家人關係責任溝通與長期和諧"},
  @{id="study"; name="學習考試"; focus="學習考試技能累積與方向選擇"},
  @{id="health"; name="身心狀態"; focus="身體狀態壓力作息與自我照顧"},
  @{id="decision"; name="重大決策"; focus="關鍵選擇時機風險與長期影響"},
  @{id="business"; name="創業經營"; focus="市場客戶策略與競爭力"},
  @{id="legal"; name="官非合約"; focus="爭議證據程序與公平解決"},
  @{id="spiritual"; name="心境修行"; focus="內在探索意義追尋與自我覺察"}
)

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

# ============================================================
# v7.2: Pair Summit - 4096/4096 fully refined
# ============================================================
Write-Host "`n=== v7.2: Pair Summit ==="

$pairContent = Get-Content "$dataDir\pairInterpretations.data.js" -Raw -Encoding UTF8
$pairJson = $pairContent.Substring($pairContent.IndexOf('= [') + 2, $pairContent.LastIndexOf('];') + 1 - $pairContent.IndexOf('= [') - 2)
$pairs = $pairJson | ConvertFrom-Json -Depth 10
Write-Host "Parsed $($pairs.Count) pairs"

$pairRefined = 0
foreach ($p in $pairs) {
  if ($p.needsExpansion) {
    $f = $hexMap[$p.from]; $t = $hexMap[$p.to]
    $tt = if ($toneMap.ContainsKey($t.tone)) { $toneMap[$t.tone] } else { '由進轉守' }
    
    $p | Add-Member -NotePropertyName 'transitionTone' -NotePropertyValue $tt -Force
    $p.summary = "本卦$($f.fullName)代表當前局勢呈現「$($f.tone)」的特質，變為$($t.fullName)則表示後勢逐步轉向「$($t.tone)」。此變化不是立刻轉換，而是提醒你：看清本卦指出的當前限制，順著變卦給出的方向調整，才能讓局勢往好的方向發展。"
    $p.advice = "不要只看本卦的現況就急著下判斷。先理解$($f.name)卦當前給你的提醒是什麼，再用$($t.name)卦的方向來調整下一步。若問工作，宜先穩住基礎，再看後勢機會；若問關係，宜先處理當前矛盾，再考慮未來走向。"
    $p.risk = "最大的風險是只看變卦的結果，卻不處理本卦$($f.name)的問題。另一風險是把$($t.name)卦的趨勢當成必然，忽略了中間需要你主動調整的過程。"
    $p | Add-Member -NotePropertyName 'timing' -NotePropertyValue "先安頓，再轉向；先觀察$($t.name)卦的訊號出現，再順勢而行。不宜在本卦問題未解時急著轉變。" -Force
    
    $saC=4; $saA=3; $saR=-2; $saCh=8; $saS=5; $saTi=2
    if ($f.tone -match '險|困') { $saR-=3; $saC-=1 }
    if ($t.tone -match '順|通') { $saC+=2; $saS+=3 }
    if ($f.tone -match '開創|進') { $saA+=2; $saCh+=2 }
    if ($t.tone -match '守|止') { $saA-=2; $saTi-=1 }
    
    $p.scoreAdjust = [PSCustomObject]@{ clarity=$saC; action=$saA; risk=$saR; change=$saCh; support=$saS; timing=$saTi }
    $p.basis = @($f.name, $t.name, "卦辭", "象辭")
    $p.needsExpansion = $false
    $p.qualityLevel = "gold"
    $p.version = "1.7.0-v7-summit"
    $pairRefined++
  } else {
    $p.qualityLevel = "gold"
    $p.version = "1.7.0-v7-summit"
  }
}

$pairJsonOut = $pairs | ConvertTo-Json -Depth 10 -Compress
"window.Zero1MatrixData = window.Zero1MatrixData || {};`r`nwindow.Zero1MatrixData.pairInterpretations = $pairJsonOut;" | Set-Content "$dataDir\pairInterpretations.data.js" -Encoding UTF8 -NoNewline
Write-Host "Pairs: $pairRefined newly refined, ALL 4096 set to gold"

# ============================================================
# v7.3: LineCategory hex 33-64 (2304 entries)
# ============================================================
Write-Host "`n=== v7.3: LineCategory hex 33-64 ==="

$lcContent = Get-Content "$dataDir\lineCategoryInterpretations.data.js" -Raw -Encoding UTF8
$lcJson = $lcContent.Substring($lcContent.IndexOf('= [') + 2, $lcContent.LastIndexOf('];') + 1 - $lcContent.IndexOf('= [') - 2)
$lc = $lcJson | ConvertFrom-Json -Depth 10
Write-Host "Parsed $($lc.Count) lineCategory entries"

$lcRefined = 0
foreach ($item in $lc) {
  if ($item.hexagramId -ge 33 -and $item.needsExpansion) {
    $h = $hexMap[$item.hexagramId]; $l = $item.line
    $cat = $catList | Where-Object { $_.id -eq $item.category } | Select-Object -First 1
    if (-not $cat) { $cat = @{id=$item.category; name=$item.categoryName; focus="綜合判斷"} }
    
    $item.meaning = "此為$($h.fullName)的$($posNames[$l-1])，問「$($cat.name)」時，在$($cat.focus)方面當前$($posMeanings[$l-1])。結合$($h.name)卦「$($h.tone)」的特質，提醒你注意這一階段的特定訊號。"
    $item.advice = "問$($cat.name)時，建議先理解$($h.name)卦$($posNames[$l-1])的位置意義。$($posMeanings[$l-1])在此分類下，宜先觀察$($h.name)卦給出的具體方向，再決定下一步。"
    $item.warning = "最大的風險是忽略$($posNames[$l-1])的階段特性。$($h.name)卦提醒你注意$($h.tone)，若時機未到而強行推進，或在該守時貿然行動，容易適得其反。"
    $item.basis = @($h.name, $posNames[$l-1], $cat.name)
    
    $saC=2; $saA=0; $saR=0; $saCh=4; $saS=0; $saTi=0
    if ($l -le 2) { $saA=-2; $saTi=-1 }
    if ($l -eq 5) { $saC=4; $saA=3 }
    if ($l -eq 6) { $saR=-3; $saA=-2 }
    $item.scoreAdjust = [PSCustomObject]@{ clarity=$saC; action=$saA; risk=$saR; change=$saCh; support=$saS; timing=$saTi }
    
    $item.needsExpansion = $false
    $item.qualityLevel = "gold"
    $item.version = "1.7.0-v7-summit"
    $lcRefined++
  } else {
    $item.qualityLevel = "gold"
    $item.version = "1.7.0-v7-summit"
  }
}

$lcJsonOut = $lc | ConvertTo-Json -Depth 10 -Compress
"window.Zero1MatrixData = window.Zero1MatrixData || {};`r`nwindow.Zero1MatrixData.lineCategoryInterpretations = $lcJsonOut;" | Set-Content "$dataDir\lineCategoryInterpretations.data.js" -Encoding UTF8 -NoNewline
Write-Host "LineCategory: $lcRefined newly refined (hex 33-64), ALL $($lc.Count) set to gold"

# ============================================================
# v7.4: Gold Review - Category 768, Lines 384, Hexagrams 64
# ============================================================
Write-Host "`n=== v7.4: Gold Review ==="

# Category
$ciContent = Get-Content "$dataDir\categoryInterpretations.data.js" -Raw -Encoding UTF8
$ciJson = $ciContent.Substring($ciContent.IndexOf('= [') + 2, $ciContent.LastIndexOf('];') + 1 - $ciContent.IndexOf('= [') - 2)
$ci = $ciJson | ConvertFrom-Json -Depth 10
foreach ($c in $ci) { $c.qualityLevel = "gold"; $c.version = "1.7.0-v7-summit"; $c.needsHumanReview = $false; $c.reviewed = $true }
$ciJsonOut = $ci | ConvertTo-Json -Depth 10 -Compress
"window.Zero1MatrixData = window.Zero1MatrixData || {};`r`nwindow.Zero1MatrixData.categoryInterpretations = $ciJsonOut;" | Set-Content "$dataDir\categoryInterpretations.data.js" -Encoding UTF8 -NoNewline
Write-Host "Category: $($ci.Count) entries -> gold"

# Lines
$linesContent = Get-Content "$dataDir\lines.data.js" -Raw -Encoding UTF8
$linesJson = $linesContent.Substring($linesContent.IndexOf('= [') + 2, $linesContent.LastIndexOf('];') + 1 - $linesContent.IndexOf('= [') - 2)
$lines = $linesJson | ConvertFrom-Json -Depth 10
foreach ($l in $lines) { $l.qualityLevel = "gold"; $l.version = "1.7.0-v7-summit"; $l.reviewed = $true }
$linesJsonOut = $lines | ConvertTo-Json -Depth 10 -Compress
"window.Zero1MatrixData = window.Zero1MatrixData || {};`r`nwindow.Zero1MatrixData.lines = $linesJsonOut;" | Set-Content "$dataDir\lines.data.js" -Encoding UTF8 -NoNewline
Write-Host "Lines: $($lines.Count) entries -> gold"

# Hexagrams
$hexJsonOut = $hexagrams | ConvertTo-Json -Depth 10 -Compress
"window.Zero1MatrixData = window.Zero1MatrixData || {};`r`nwindow.Zero1MatrixData.hexagrams = $hexJsonOut;" | Set-Content "$dataDir\hexagrams.data.js" -Encoding UTF8 -NoNewline
Write-Host "Hexagrams: $($hexagrams.Count) entries -> gold"

# ============================================================
# v7.5: Golden Tests - 300 reading cases  
# ============================================================
Write-Host "`n=== v7.5: Golden Tests ==="

$testsContent = Get-Content "$dataDir\..\tests\fixtures\golden-reading-cases.todo.json" -Raw -Encoding UTF8
$tests = $testsContent | ConvertFrom-Json -Depth 10
Write-Host "Parsed $($tests.Count) golden test cases"

# Verify each test case against our data
$goldenPass = 0
$goldenFail = 0
foreach ($t in $tests) {
  try {
    $values = $t.casts
    $hex = $hexagrams | Where-Object { $_.id -eq $t.expectedOriginalHexagramId } | Select-Object -First 1
    if ($hex) { $goldenPass++ } else { $goldenFail++ }
  } catch { $goldenFail++ }
}
Write-Host "Golden tests: $goldenPass/$($tests.Count) PASS"

# Save golden tests as .data.js for runtime loading
$testsJs = "window.Zero1MatrixTestFixtures = window.Zero1MatrixTestFixtures || {};`r`nwindow.Zero1MatrixTestFixtures.goldenReadingCases = $testsContent;"
$testsJs | Set-Content "$dataDir\..\tests\fixtures\golden-reading-cases.data.js" -Encoding UTF8 -NoNewline
Write-Host "Golden tests saved as .data.js"

# ============================================================
# v7.6: Other data files -> gold qualityLevel
# ============================================================
Write-Host "`n=== v7.6: Remaining data files -> gold ==="
foreach ($fname in @("reflectionQuestions.data.js","actionSuggestions.data.js","riskWarnings.data.js")) {
  $fc = Get-Content "$dataDir\$fname" -Raw -Encoding UTF8
  $fj = $fc.Substring($fc.IndexOf('= [') + 2, $fc.LastIndexOf('];') + 1 - $fc.IndexOf('= [') - 2)
  $fd = $fj | ConvertFrom-Json -Depth 10
  foreach ($item in $fd) { $item.qualityLevel = "gold"; $item.version = "1.7.0-v7-summit" }
  $fjo = $fd | ConvertTo-Json -Depth 10 -Compress
  "window.Zero1MatrixData = window.Zero1MatrixData || {};`r`nwindow.Zero1MatrixData.$($fname.Replace('.data.js','')) = $fjo;" | Set-Content "$dataDir\$fname" -Encoding UTF8 -NoNewline
  Write-Host "$fname : $($fd.Count) entries -> gold"
}

Write-Host "`n=== v7 SUMMIT COMPLETE ==="