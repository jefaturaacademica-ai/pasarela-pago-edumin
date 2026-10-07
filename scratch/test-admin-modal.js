import puppeteer from 'puppeteer';

async function testAdmin() {
  console.log('Testing Admin Login and Modal in Puppeteer...');
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.error('BROWSER PAGEERROR:', err));

  try {
    await page.goto('http://localhost:4173/#admin', { waitUntil: 'networkidle0' });
    console.log('Page loaded with #admin hash!');

    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log('Body snippet:', bodyText.slice(0, 300));

  } catch (err) {
    console.error('Test Error:', err);
  } finally {
    await browser.close();
  }
}

testAdmin();
