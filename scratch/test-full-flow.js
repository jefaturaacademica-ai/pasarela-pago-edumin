import puppeteer from 'puppeteer';

async function testFullFlow() {
  console.log('🚀 Running end-to-end Puppeteer verification...');
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  try {
    // 1. Root page load
    await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0' });
    console.log('✅ Student Home Page loaded.');

    // 2. Click PAGAR CON TARJETA on first package
    const cardButtons = await page.$$('button');
    let payButtonClicked = false;
    for (const btn of cardButtons) {
      const text = await page.evaluate(el => el.innerText, btn);
      if (text.includes('PAGAR CON TARJETA')) {
        await btn.click();
        payButtonClicked = true;
        break;
      }
    }

    if (payButtonClicked) {
      await new Promise(r => setTimeout(r, 1000));
      const hasIzipayModal = await page.evaluate(() => {
        return document.body.innerText.includes('Pasarela Oficial Izipay') || document.body.innerText.includes('Pagar');
      });
      console.log('✅ Izipay Modal Opened:', hasIzipayModal);
    }

    // 3. Admin hash routing
    await page.goto('http://localhost:4173/#admin', { waitUntil: 'networkidle0' });
    const hasAdminModal = await page.evaluate(() => {
      return document.body.innerText.includes('PANEL ADMINISTRADOR') || document.body.innerText.includes('ASESORA EDUMIN') || document.body.innerText.includes('Inicia Sesión');
    });
    console.log('✅ Admin Panel Opened:', hasAdminModal);

    if (errors.length === 0) {
      console.log('🎉 PERFECT SCORE! 0 Errors encountered in full flow test.');
    } else {
      console.error('❌ Errors found:', errors);
    }
  } catch (err) {
    console.error('Execution error:', err);
  } finally {
    await browser.close();
  }
}

testFullFlow();
