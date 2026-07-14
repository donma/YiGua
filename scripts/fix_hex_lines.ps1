$content = Get-Content "D:\AI_PROJECTS\Zero1Matrix\src\data\hexagrams.data.js" -Raw -Encoding UTF8
$fixes = @{
  9  = @("1,1,1,1,1,0", "1,1,1,0,1,1")
  20 = @("0,0,0,1,1,0", "0,0,0,0,1,1")
  37 = @("1,0,1,1,1,0", "1,0,1,0,1,1")
  42 = @("1,0,0,1,1,0", "1,0,0,0,1,1")
  53 = @("0,0,1,1,1,0", "0,0,1,0,1,1")
}
foreach ($h in $fixes.Keys) {
  $oldLine = '"lines": [' + "`r`n      " + ($fixes[$h][0] -replace ',', ',' + "`r`n      ") + "`r`n    ]"
  $newLine = '"lines": [' + "`r`n      " + ($fixes[$h][1] -replace ',', ',' + "`r`n      ") + "`r`n    ]"
  $pattern = '"id":\s*' + $h + '[^}]*?' + [regex]::Escape($oldLine)
  if ($content -match $pattern) {
    $content = $content -replace [regex]::Escape($oldLine), $newLine
    Write-Host ("Fixed hex " + $h)
  } else {
    Write-Host ("Hex " + $h + " pattern not found (maybe already fixed?)")
  }
}
$content | Set-Content "D:\AI_PROJECTS\Zero1Matrix\src\data\hexagrams.data.js" -Encoding UTF8 -NoNewline
Write-Host "Done."