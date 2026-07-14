# check_hard_correctness.ps1 - Live computation of hard correctness
$dataDir = "D:\AI_PROJECTS\Zero1Matrix\src\data"
$hexContent = Get-Content "$dataDir\hexagrams.data.js" -Raw -Encoding UTF8
$hexJson = $hexContent.Substring($hexContent.IndexOf('= [') + 2, $hexContent.LastIndexOf('];') + 1 - $hexContent.IndexOf('= [') - 2)
$hexagrams = $hexJson | ConvertFrom-Json -Depth 10

$trigramMap = @{ "000"="坤"; "001"="艮"; "010"="坎"; "011"="巽"; "100"="震"; "101"="離"; "110"="兌"; "111"="乾" }
function getTrigram($lines) { return $trigramMap[($lines -join '')] }

$patterns = @{}
$duplicates = @()
$trigramMismatches = @()
$knownFixtures = @{9="小畜"; 20="觀"; 37="家人"; 42="益"; 53="漸"}
$knownFailures = 0
$hexCount = $hexagrams.Count

foreach ($h in $hexagrams) {
  $pattern = ($h.lines | ForEach-Object { "$_" }) -join ''
  if ($patterns.ContainsKey($pattern)) {
    $duplicates += @{ pattern=$pattern; id1=$patterns[$pattern]; id2=$h.id }
  } else {
    $patterns[$pattern] = $h.id
  }
  
  $lower = getTrigram($h.lines[0..2])
  $upper = getTrigram($h.lines[3..5])
  if ($h.lower -and $h.lower -ne $lower) { $trigramMismatches += @{ id=$h.id; field="lower"; expected=$lower; actual=$h.lower } }
  if ($h.upper -and $h.upper -ne $upper) { $trigramMismatches += @{ id=$h.id; field="upper"; expected=$upper; actual=$h.upper } }
  
  if ($knownFixtures.ContainsKey([int]$h.id)) {
    # Verify the hex exists and has correct name
    if ($h.name -ne $knownFixtures[[int]$h.id]) { $knownFailures++ }
  }
}

$result = [PSCustomObject]@{
  pass = ($hexCount -eq 64 -and $patterns.Count -eq 64 -and $duplicates.Count -eq 0 -and $trigramMismatches.Count -eq 0 -and $knownFailures -eq 0)
  hexagramCount = $hexCount
  uniquePatterns = $patterns.Count
  duplicatePatterns = $duplicates.Count
  duplicateDetails = $duplicates
  trigramMismatchesCount = $trigramMismatches.Count
  trigramMismatchDetails = $trigramMismatches
  knownFixtureFailures = $knownFailures
  bottomUpTrigramMap = $trigramMap
}

$resultJson = $result | ConvertTo-Json -Depth 10
$resultJson | Set-Content "D:\AI_PROJECTS\Zero1Matrix\tests\results\hard-correctness-results.json" -Encoding UTF8
"window.Zero1MatrixHardCorrectness = $resultJson;" | Set-Content "D:\AI_PROJECTS\Zero1Matrix\tests\results\hard-correctness-results.data.js" -Encoding UTF8

Write-Host "Hard Correctness: $(if($result.pass){'PASS'}else{'FAIL'})"
Write-Host "  hexagrams: $hexCount, unique patterns: $($patterns.Count), dups: $($duplicates.Count)"
Write-Host "  trigram mismatches: $($trigramMismatches.Count)"
Write-Host "  known fixture failures: $knownFailures"
exit $(if($result.pass){0}else{1})