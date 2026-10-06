const { JSDOM } = require('jsdom');
const fs = require('fs');

const rawFile = fs.readFileSync('C:/Users/USER/.gemini/antigravity/brain/63e30e6b-ab34-4a65-bc63-b7e24f2379f7/.system_generated/steps/1600/content.md', 'utf8');
const jsCode = rawFile.replace(/^Title:[\s\S]*?---\s*/, '');

const dom = new JSDOM('<!DOCTYPE html><html><body><div id="root"></div></body></html>', {
  runScripts: 'dangerously',
  url: 'https://edumin-pasarela-pago.vercel.app/'
});

dom.window.addEventListener('error', (event) => {
  console.error('JSDOM Window Error:', event.error || event.message);
});

try {
  const scriptEl = dom.window.document.createElement('script');
  scriptEl.textContent = jsCode;
  dom.window.document.body.appendChild(scriptEl);
  console.log('JSDOM eval completed! Root innerHTML length:', dom.window.document.getElementById('root').innerHTML.length);
} catch (e) {
  console.error('JSDOM Eval Exception:', e);
}
