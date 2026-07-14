# check_file_mode.ps1 - Scan for fetch/XMLHttpRequest violations in core files
$violations = @()
$filesScanned = 0
$scanDirs = @("D:\AI_PROJECTS\Zero1Matrix\index.html", "D:\AI_PROJECTS\Zero1Matrix\tools", "D:\AI_PROJECTS\Zero1Matrix\src\js")

foreach ($dir in $scanDirs) {
  $files = if (Test-Path $dir -PathType Container) { Get-ChildItem $dir -Recurse -Include *.html,*.js } else { Get-Item $dir }
  foreach ($f in $files) {
    if ($f.Name -eq "sw.js") { continue }
    $content = Get-Content $f.FullName -Raw -Encoding UTF8 -ErrorAction SilentlyContinue
    if (-not $content) { continue }
    $filesScanned++
    
    # Check for fetch("./ or fetch("../ or fetch("*.json
    $fetchPatterns = [regex]::Matches($content, 'fetch\s*\(\s*["\x60][^"\x60]*\.json["\x60]')
    foreach ($m in $fetchPatterns) {
      $violations += @{ file=$f.Name; line=$m.Value; type="fetch(json)" }
    }
    
    # Check XMLHttpRequest
    if ($content -match 'XMLHttpRequest') {
      $violations += @{ file=$f.Name; line="XMLHttpRequest"; type="xhr" }
    }
    
    # Check import("*.json")
    $importPatterns = [regex]::Matches($content, 'import\s*\(\s*["\x60][^"\x60]*\.json["\x60]\s*\)')
    foreach ($m in $importPatterns) {
      $violations += @{ file=$f.Name; line=$m.Value; type="import(json)" }
    }
  }
}

$pass = $violations.Count -eq 0
$result = [PSCustomObject]@{
  pass = $pass
  violations = $violations
  filesScanned = $filesScanned
  notes = "sw.js excluded (PWA fetch handler)"
}

$resultJson = $result | ConvertTo-Json -Depth 10
$resultJson | Set-Content "D:\AI_PROJECTS\Zero1Matrix\tests\results\file-mode-results.json" -Encoding UTF8
"window.Zero1MatrixFileMode = $resultJson;" | Set-Content "D:\AI_PROJECTS\Zero1Matrix\tests\results\file-mode-results.data.js" -Encoding UTF8

Write-Host "file:// check: $(if($pass){'PASS'}else{'FAIL'})"
Write-Host "  Files scanned: $filesScanned, Violations: $($violations.Count)"
foreach ($v in $violations) { Write-Host "  VIOLATION: $($v.file) - $($v.line) ($($v.type))" }
exit $(if($pass){0}else{1})