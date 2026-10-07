import puppeteer from 'puppeteer';

async function run() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  page.on('console', msg => console.log('LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => console.error('🔥 PAGEERROR:', err.message, '\nSTACK:', err.stack));

  console.log('Navigating directly to http://localhost:4173/#admin');
  await page.goto('http://localhost:4173/#admin');
  await new Promise(r => setTimeout(r, 1500));

  const text = await page.evaluate(() => document.body.innerText);
  console.log('Body text:', text.slice(0, 400));

  await browser.close();
}

run();
