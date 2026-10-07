import puppeteer from 'puppeteer';

async function testComponent() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  page.on('console', msg => console.log('CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.error('PAGEERROR STACK:', err.stack));

  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0' });

  // Execute JS inside the page to check component rendering
  await page.evaluate(() => {
    window.location.hash = '#admin';
  });

  await new Promise(r => setTimeout(r, 1000));
  await browser.close();
}

testComponent();
