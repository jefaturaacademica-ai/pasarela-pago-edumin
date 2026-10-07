const fs = require('fs');
const path = require('path');

const distDir = 'dist/assets';
const files = fs.readdirSync(distDir);
const jsFile = files.find(f => f.endsWith('.js'));
const content = fs.readFileSync(path.join(distDir, jsFile), 'utf8');

console.log('Dist JS File:', jsFile, 'Length:', content.length);

// Search for references to variable 're' that are called or accessed before declaration
// Or search for 're=' or 'function re(' or 'const re=' or 'let re='
const reMatches = content.match(/(\b(const|let|var|function)\s+re\b|re\.[a-zA-Z_$0-9]+|re\()/g);
console.log('Matches for "re":', reMatches ? reMatches.slice(0, 20) : 'None');

// Let's find where 're' is used in the minified bundle
let idx = 0;
while ((idx = content.indexOf('re', idx)) !== -1) {
  const snippet = content.slice(Math.max(0, idx - 50), Math.min(content.length, idx + 50));
  if (snippet.includes('Cannot access') || snippet.includes('re(') || snippet.includes('re.')) {
    console.log('Snippet near idx', idx, ':', snippet);
  }
  idx += 50;
}
