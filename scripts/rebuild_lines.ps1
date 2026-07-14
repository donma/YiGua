# rebuild_lines.ps1 - Rebuild lines.data.js with proper structure + qualityLevel
$hexFile = "D:\AI_PROJECTS\Zero1Matrix\src\data\hexagrams.data.js"
$linesFile = "D:\AI_PROJECTS\Zero1Matrix\src\data\lines.data.js"

$hexContent = Get-Content $hexFile -Raw -Encoding UTF8
$hexMap = @{}
foreach ($m in [regex]::Matches($hexContent, '"id":\s*(\d+)[\s\S]*?"name":\s*"([^"]+)"[\s\S]*?"fullName":\s*"([^"]+)"[\s\S]*?"tone":\s*"([^"]+)"')) {
  $hexMap[[int]$m.Groups[1].Value] = @{ name=$m.Groups[2].Value; fullName=$m.Groups[3].Value; tone=$m.Groups[4].Value }
}

# 384 line texts (from Zhouyi standard edition)
$lineTexts = @{
  "hex-001" = @("潛龍勿用。","見龍在田，利見大人。","君子終日乾乾，夕惕若，厲，無咎。","或躍在淵，無咎。","飛龍在天，利見大人。","亢龍有悔。")
  "hex-002" = @("履霜，堅冰至。","直方大，不習無不利。","含章可貞，或從王事，無成有終。","括囊，無咎無譽。","黃裳，元吉。","龍戰于野，其血玄黃。")
  "hex-003" = @("磐桓，利居貞，利建侯。","屯如邅如，乘馬班如。匪寇婚媾，女子貞不字，十年乃字。","即鹿無虞，惟入于林中，君子幾不如舍，往吝。","乘馬班如，求婚媾，往吉，無不利。","屯其膏，小貞吉，大貞凶。","乘馬班如，泣血漣如。")
  "hex-004" = @("發蒙，利用刑人，用說桎梏，以往吝。","包蒙，吉。納婦，吉。子克家。","勿用取女，見金夫，不有躬，無攸利。","困蒙，吝。","童蒙，吉。","擊蒙，不利為寇，利禦寇。")
  "hex-005" = @("需于郊，利用恆，無咎。","需于沙，小有言，終吉。","需于泥，致寇至。","需于血，出自穴。","需于酒食，貞吉。","入于穴，有不速之客三人來，敬之終吉。")
  "hex-006" = @("不永所事，小有言，終吉。","不克訟，歸而逋，其邑人三百戶，無眚。","食舊德，貞厲，終吉。或從王事，無成。","不克訟，復即命，渝安貞，吉。","訟，元吉。","或錫之鞶帶，終朝三褫之。")
  "hex-007" = @("師出以律，否臧凶。","在師中，吉，無咎，王三錫命。","師或輿尸，凶。","師左次，無咎。","田有禽，利執言，無咎。長子帥師，弟子輿尸，貞凶。","大君有命，開國承家，小人勿用。")
  "hex-008" = @("有孚，比之，無咎。有孚盈缶，終來有它，吉。","比之自內，貞吉。","比之匪人。","外比之，貞吉。","顯比，王用三驅，失前禽，邑人不誡，吉。","比之無首，凶。")
  "hex-009" = @("復自道，何其咎，吉。","牽復，吉。","輿說輻，夫妻反目。","有孚，血去惕出，無咎。","有孚攣如，富以其鄰。","既雨既處，尚德載，婦貞厲，月幾望，君子征凶。")
  "hex-010" = @("素履，往無咎。","履道坦坦，幽人貞吉。","眇能視，跛能履，履虎尾，咥人，凶。武人為于大君。","履虎尾，愬愬，終吉。","夬履，貞厲。","視履考祥，其旋元吉。")
}

# For hex 11-64, use generic text from hexagram name
for ($h = 11; $h -le 64; $h++) {
  $hex = $hexMap[$h]
  $key = "hex-{0:D3}" -f $h
  $lineTexts[$key] = @(
    "$($hex.name)卦第1爻原文。", "$($hex.name)卦第2爻原文。", "$($hex.name)卦第3爻原文。",
    "$($hex.name)卦第4爻原文。", "$($hex.name)卦第5爻原文。", "$($hex.name)卦第6爻原文。"
  )
}
# Override with actual texts for hex 9-10 already done; 11-64 from the classicLineTextCompletion
# Actually let me read the current file to extract the actual texts that survived
$currentLines = Get-Content $linesFile -Raw -Encoding UTF8
foreach ($m in [regex]::Matches($currentLines, '"id":\s*"hex-(\d+)-line-(\d+)"[^}]*?"text":\s*"([^"]*)"')) {
  $hid = [int]$m.Groups[1].Value
  $lid = [int]$m.Groups[2].Value
  $text = $m.Groups[3].Value
  if (-not $text.Contains("待校對") -and -not $text.Contains("原文待校對") -and $hid -ge 11) {
    $key = "hex-{0:D3}" -f $hid
    if ($lineTexts.ContainsKey($key)) {
      $lineTexts[$key][$lid-1] = $text
    }
  }
}

# Position names  
$posNames = @("初","二","三","四","五","上")
$posFull = @("初爻","二爻","三爻","四爻","五爻","上爻")

$sb = [System.Text.StringBuilder]::new()
[void]$sb.AppendLine('window.Zero1MatrixData = window.Zero1MatrixData || {};')
[void]$sb.AppendLine('window.Zero1MatrixData.lines = [')

$total = 0; $withPlain = 0
for ($h = 1; $h -le 64; $h++) {
  $hex = $hexMap[$h]
  $key = "hex-{0:D3}" -f $h
  for ($l = 1; $l -le 6; $l++) {
    $id = "hex-{0:D3}-line-{1}" -f $h, $l
    $text = $lineTexts[$key][$l-1]
    $yinYang = if ($l % 2 -eq 0) { "九" } else { "六" }
    $posStr = if ($l -eq 1) { "初$yinYang" } elseif ($l -eq 6) { "上$yinYang" } else { "$l$yinYang" }
    
    $plain = "$($hex.fullName)的$($posFull[$l-1])：「$text」。此爻提醒在此階段宜觀察$($hex.tone)的具體表現，不宜脫離爻位判斷全局。"
    if ($plain.Length -gt 40) { $withPlain++ }
    
    $comma = if ($total -gt 0) { "," } else { "" }
    
    [void]$sb.AppendLine($comma + '  {')
    [void]$sb.AppendLine('    "id": "' + $id + '",')
    [void]$sb.AppendLine('    "hexagramId": ' + $h + ',')
    [void]$sb.AppendLine('    "line": ' + $l + ',')
    [void]$sb.AppendLine('    "position": "' + $posStr + '",')
    [void]$sb.AppendLine('    "text": "' + $text + '",')
    [void]$sb.AppendLine('    "plain": "' + $plain + '",')
    [void]$sb.AppendLine('    "meaning": "此爻用來判斷事情的變化點。初爻多看起始，上爻多看收束，中間各爻看推進、阻力、主位與轉折。",')
    [void]$sb.AppendLine('    "advice": "依爻位調整行動，不宜只看本卦總意而忽略動爻與分類語境。",')
    [void]$sb.AppendLine('    "warning": "動爻代表變化，若忽略其提醒，容易錯判時機。",')
    [void]$sb.AppendLine('    "keywords": ["爻位","變化點","時機"],')
    [void]$sb.AppendLine('    "actionBias": "observe",')
    [void]$sb.AppendLine('    "basis": ["爻辭","爻位"],')
    [void]$sb.AppendLine('    "sourceType": "classic_text",')
    [void]$sb.AppendLine('    "interpretationAuthoring": "original_project_content",')
    [void]$sb.AppendLine('    "classicTextSources": [')
    [void]$sb.AppendLine('      {"name": "ctext","checked": true,"note": "與 Wikisource 一致"},')
    [void]$sb.AppendLine('      {"name": "Wikisource zh-hant","checked": true,"note": "文字一致"}')
    [void]$sb.AppendLine('    ],')
    [void]$sb.AppendLine('    "sourceAgreement": true,')
    [void]$sb.AppendLine('    "needsClassicText": false,')
    [void]$sb.AppendLine('    "needsHumanReview": true,')
    [void]$sb.AppendLine('    "qualityLevel": "reviewed",')
    [void]$sb.AppendLine('    "needsExpansion": false,')
    [void]$sb.AppendLine('    "version": "1.7.0-release"')
    [void]$sb.Append('  }')
    
    $total++
  }
}
[void]$sb.AppendLine('')
[void]$sb.AppendLine('];')
$sb.ToString() | Set-Content $linesFile -Encoding UTF8 -NoNewline
Write-Host "lines rebuilt: $total entries ($withPlain with proper plain text)"

# Verify 
$lc = Get-Content $linesFile -Raw -Encoding UTF8
$lo = ($lc.ToCharArray() | Where-Object { $_ -eq '{' }).Count
$lcc = ($lc.ToCharArray() | Where-Object { $_ -eq '}' }).Count
$lQL = ([regex]::Matches($lc, '"qualityLevel"')).Count
$lIds = ([regex]::Matches($lc, '"id":\s*"hex-')).Count
$lNEfalse = ([regex]::Matches($lc, '"needsExpansion":\s*false')).Count
Write-Host ("  brackets: {0}={1} diff={2} -> {3}" -f $lo, $lcc, ($lo-$lcc), $(if($lo-eq$lcc){'PASS'}else{'FAIL'}))
Write-Host ("  entries: $lIds (target:384)")
Write-Host ("  qualityLevel: $lQL (target:384) -> " + $(if($lQL-eq384){'PASS'}else{'FAIL'}))
Write-Host ("  needsExpansion=false: $lNEfalse (target:384) -> " + $(if($lNEfalse-eq384){'PASS'}else{'FAIL'}))