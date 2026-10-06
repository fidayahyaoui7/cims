const fs = require('fs');
const path = require('path');

// Paths to translation files
const enPath = path.join(__dirname, '../public/locales/en/translation.json');
const frPath = path.join(__dirname, '../public/locales/fr/translation.json');
const arPath = path.join(__dirname, '../public/locales/ar/translation.json');

// Read all translation files
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const fr = JSON.parse(fs.readFileSync(frPath, 'utf8'));
const ar = JSON.parse(fs.readFileSync(arPath, 'utf8'));

// Get all unique keys from all files
const allKeys = new Set([
  ...Object.keys(en),
  ...Object.keys(fr),
  ...Object.keys(ar)
]);

// Function to update a translation file with missing keys
function updateTranslations(baseLang, targetLang, targetPath) {
  const updated = { ...targetLang };
  let addedCount = 0;
  let updatedCount = 0;

  for (const key of allKeys) {
    if (!(key in updated)) {
      updated[key] = baseLang[key] || `[TRANSLATION NEEDED] ${key}`;
      addedCount++;
    } else if (updated[key] === baseLang[key] && baseLang !== targetLang) {
      // If the translation is the same as English, mark it for review
      updated[key] = `[REVIEW] ${updated[key]}`;
      updatedCount++;
    }
  }

  // Sort keys alphabetically
  const sorted = {};
  Object.keys(updated)
    .sort()
    .forEach(key => {
      sorted[key] = updated[key];
    });

  // Write back to file
  fs.writeFileSync(targetPath, JSON.stringify(sorted, null, 2) + '\n');
  
  return { added: addedCount, updated: updatedCount };
}

// Update all language files
console.log('Updating French translations...');
const frStats = updateTranslations(en, fr, frPath);
console.log(`  - Added: ${frStats.added}, Marked for review: ${frStats.updated}`);

console.log('Updating Arabic translations...');
const arStats = updateTranslations(en, ar, arPath);
console.log(`  - Added: ${arStats.added}, Marked for review: ${arStats.updated}`);

console.log('Translation sync complete!');
