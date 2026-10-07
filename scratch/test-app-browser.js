import puppeteer from 'puppeteer';

async function runTests() {
  console.log('🚀 Starting Puppeteer browser tests against local preview...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  const consoleLogs = [];
  const errors = [];

  page.on('console', msg => consoleLogs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => {
    errors.push(err.toString());
    console.error('🔥 PAGE ERROR STACK TRACE:\n', err.stack);
  });

  try {
    console.log('1. Navigating to http://localhost:4173/ ...');
    await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0' });

    console.log('Page Title:', await page.title());

    // Check if root has content
    const rootHtml = await page.evaluate(() => document.getElementById('root').innerHTML);
    console.log('Root HTML Length:', rootHtml.length);

    if (errors.length > 0) {
      console.error('❌ Page Errors Found:', errors);
    } else {
      console.log('✅ Page loaded with 0 page errors!');
    }

    // Test clicking Admin Panel link or navigating to #admin
    console.log('2. Navigating to #admin hash...');
    await page.goto('http://localhost:4173/#admin', { waitUntil: 'networkidle0' });

    const adminModalVisible = await page.evaluate(() => {
      return document.body.innerText.includes('PANEL ADMINISTRADOR') || document.body.innerText.includes('Asesora') || document.body.innerText.includes('Inicia Sesión');
    });
    console.log('Admin Modal Visible:', adminModalVisible);

    console.log('Console logs caught during run:', consoleLogs.slice(0, 10));

  } catch (err) {
    console.error('❌ Test execution error:', err);
  } finally {
    await browser.close();
  }
}

runTests();
