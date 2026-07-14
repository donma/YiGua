/*
Zero1Matrix v7 safe merge reference.
禁止使用 PowerShell regex 修改大型 data.js。
*/

function mergeById(baseRecords, patchRecords) {
  const baseIds = new Set(baseRecords.map(x => x.id));
  const patchIds = new Set();

  for (const rec of patchRecords) {
    if (!baseIds.has(rec.id)) {
      throw new Error(`Unknown patch id: ${rec.id}`);
    }
    if (patchIds.has(rec.id)) {
      throw new Error(`Duplicate patch id: ${rec.id}`);
    }
    patchIds.add(rec.id);
  }

  const patchMap = new Map(patchRecords.map(x => [x.id, x]));
  return baseRecords.map(rec => patchMap.has(rec.id) ? {...rec, ...patchMap.get(rec.id)} : rec);
}

function validateUniqueIds(records, expectedCount) {
  const ids = records.map(x => x.id);
  const unique = new Set(ids);
  if (records.length !== expectedCount) throw new Error(`Expected ${expectedCount}, got ${records.length}`);
  if (unique.size !== expectedCount) throw new Error(`Duplicate or missing ids: ${unique.size}/${expectedCount}`);
}
