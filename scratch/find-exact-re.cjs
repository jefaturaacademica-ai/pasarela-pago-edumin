const fs = require('fs');
const path = require('path');

const distDir = 'dist/assets';
const jsFile = fs.readdirSync(distDir).find(f => f.endsWith('.js'));
const content = fs.readFileSync(path.join(distDir, jsFile), 'utf8');

console.log('Dist file:', jsFile, 'Length:', content.length);

// Let's print the entire minified code from index 345000 to 358000
const tail = content.slice(345000);
console.log('Tail code around App and Modals:\n');

// Find all occurrences of "re" in tail
let idx = 345000;
while ((idx = content.indexOf('re(', idx)) !== -1) {
  const snippet = content.slice(Math.max(0, idx - 40), Math.min(content.length, idx + 40));
  console.log(`[At ${idx}]:`, snippet);
  idx += 30;
}
