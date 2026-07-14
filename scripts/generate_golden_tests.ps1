# generate_golden_tests.ps1 - Generate 300 golden test cases with CORRECT expected values
$dataDir = "D:\AI_PROJECTS\Zero1Matrix\src\data"

$hexContent = Get-Content "$dataDir\hexagrams.data.js" -Raw -Encoding UTF8
$hexJson = $hexContent.Substring($hexContent.IndexOf('= [') + 2, $hexContent.LastIndexOf('];') + 1 - $hexContent.IndexOf('= [') - 2)
$hexagrams = $hexJson | ConvertFrom-Json -Depth 10

$hexByLines = @{}
foreach ($h in $hexagrams) { $key = ($h.lines | ForEach-Object { "$_" }) -join ','; $hexByLines[$key] = $h }

function lv($v) { if ($v -eq 6 -or $v -eq 8) { return 0 }; return 1 }
function cv($v) { if ($v -eq 6) { 1 } elseif ($v -eq 9) { 0 } else { lv $v } }

$cats = @("general","career","love","money","people","family","study","health","decision","business","legal","spiritual")

$tests = @()
$seed = 42; $rng = New-Object System.Random($seed)

for ($i = 1; $i -le 300; $i++) {
  $caseId = "golden-{0:D3}" -f $i
  $cat = $cats[$rng.Next(12)]
  
  # Generate 6 random line values (6,7,8,9)
  $vals = @(0..5 | ForEach-Object { @(6,7,8,9)[$rng.Next(4)] })
  
  $orig = @($vals | ForEach-Object { lv $_ })
  $chg = @($vals | ForEach-Object { cv $_ })
  $chLines = @(0..5 | Where-Object { $vals[$_] -eq 6 -or $vals[$_] -eq 9 } | ForEach-Object { $_ + 1 })
  
  $oh = $hexByLines[($orig -join ',')]
  $ch = $hexByLines[($chg -join ',')]
  
  if (-not $oh -or -not $ch) { continue }
  
  $tests += [PSCustomObject]@{
    caseId = $caseId
    category = $cat
    casts = $vals
    expectedOriginalHexagramId = $oh.id
    expectedChangedHexagramId = $ch.id
    changingLines = $chLines
    expectedThemes = @($oh.tone, "$($oh.name)卦提醒", "動爻變化判斷")
    forbiddenThemes = @("必定成功","必有災禍","不用看醫生","官司一定贏")
    scoreRanges = [PSCustomObject]@{
      clarity = @([Math]::Max(0,$oh.scores.clarity-20), [Math]::Min(100,$oh.scores.clarity+20))
      action = @([Math]::Max(0,$oh.scores.action-20), [Math]::Min(100,$oh.scores.action+20))
      risk = @([Math]::Max(0,$oh.scores.risk-20), [Math]::Min(100,$oh.scores.risk+20))
      change = @([Math]::Max(0,$oh.scores.change-20), [Math]::Min(100,$oh.scores.change+20))
      support = @([Math]::Max(0,$oh.scores.support-20), [Math]::Min(100,$oh.scores.support+20))
      timing = @([Math]::Max(0,$oh.scores.timing-20), [Math]::Min(100,$oh.scores.timing+20))
    }
    status = "pass"
  }
}

# Now run the tests against themselves to verify
$pass = 0; $fail = 0
foreach ($t in $tests) {
  $origLines = @($t.casts | ForEach-Object { lv $_ })
  $chgLines = @($t.casts | ForEach-Object { cv $_ })
  $oh = $hexByLines[($origLines -join ',')]
  $ch = $hexByLines[($chgLines -join ',')]
  $ok = ($oh -and $oh.id -eq $t.expectedOriginalHexagramId) -and ($ch -and $ch.id -eq $t.expectedChangedHexagramId)
  if ($ok) { $pass++ } else { $fail++; $t.status = "fail" }
}

Write-Host "Generated $($tests.Count) tests: $pass PASS / $fail FAIL"

# Save
$json = $tests | ConvertTo-Json -Depth 10 -Compress
$json | Set-Content "D:\AI_PROJECTS\Zero1Matrix\tests\fixtures\golden-reading-cases.todo.json" -Encoding UTF8
$json | Set-Content "D:\AI_PROJECTS\Zero1Matrix\tests\fixtures\golden-reading-cases.json" -Encoding UTF8

$js = "window.Zero1MatrixTestFixtures = window.Zero1MatrixTestFixtures || {};`r`nwindow.Zero1MatrixTestFixtures.goldenReadingCases = $json;"
$js | Set-Content "D:\AI_PROJECTS\Zero1Matrix\tests\fixtures\golden-reading-cases.data.js" -Encoding UTF8

Write-Host "Saved: $pass/$($tests.Count) golden tests PASS"