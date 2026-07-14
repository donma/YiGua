# merge-v6-patches.ps1
# Merge pairInterpretations v6 patch (items 301-900) into pairInterpretations.data.js
# Merge lineCategoryInterpretations v6 patch (hex 9-16) into lineCategoryInterpretations.data.js

function Merge-By-Id($targetFile, $patchFile, $patchVar) {
  Write-Host "Reading $targetFile ..."
  $targetContent = Get-Content $targetFile -Raw -Encoding UTF8
  Write-Host "Reading $patchFile ..."
  $patchContent = Get-Content $patchFile -Raw -Encoding UTF8

  # Extract all entries from target by ID position
  $entries = @{}
  # Match each object: from "id" to just before the next "id" or end of array
  $targetPattern = '"id":\s*"([^"]+)"([\s\S]*?)(?=\s*\},\s*\{|$)'
  $targetMatches = [regex]::Matches($targetContent, $targetPattern)
  foreach ($m in $targetMatches) {
    $id = $m.Groups[1].Value
    $body = $m.Groups[2].Value
    $entries[$id] = $m.Value
  }
  Write-Host ("  Found " + $entries.Count + " entries in target")

  # Extract all patch entries  
  $patchEntries = @{}
  $patchPattern = '"id":\s*"([^"]+)"([\s\S]*?)(?=\s*\},\s*\{|\s*\];)'
  $patchMatches = [regex]::Matches($patchContent, $patchPattern)
  foreach ($m in $patchMatches) {
    $id = $m.Groups[1].Value
    $body = $m.Groups[2].Value
    $patchEntries[$id] = $m.Value
  }
  Write-Host ("  Found " + $patchEntries.Count + " entries in patch")

  # Merge: replace matching entries
  $mergeCount = 0
  foreach ($id in $patchEntries.Keys) {
    if ($entries.ContainsKey($id)) {
      $old = [regex]::Escape($entries[$id])
      $new = $patchEntries[$id]
      # Only replace the FIRST occurrence of this exact old entry
      $pos = $targetContent.IndexOf($entries[$id])
      if ($pos -ge 0) {
        $targetContent = $targetContent.Remove($pos, $entries[$id].Length).Insert($pos, $new)
        $mergeCount++
      }
    } else {
      Write-Host ("  WARN: id $id not found in target")
    }
  }
  
  $targetContent | Set-Content $targetFile -Encoding UTF8 -NoNewline
  Write-Host ("  Merged " + $mergeCount + " entries. Saved.")
  return $mergeCount
}

$base = "D:\AI_PROJECTS\Zero1Matrix\src\data"

# Merge pairInterpretations
$p1 = Merge-By-Id "$base\pairInterpretations.data.js" "$base\pairInterpretations.v6.301-900.patch.data.js"
Write-Host "pairInterpretations: merged $p1 entries"

# Merge lineCategoryInterpretations
$p2 = Merge-By-Id "$base\lineCategoryInterpretations.data.js" "$base\lineCategoryInterpretations.v6.hex9-16.patch.data.js"
Write-Host "lineCategoryInterpretations: merged $p2 entries"

Write-Host "v6 merge complete."
