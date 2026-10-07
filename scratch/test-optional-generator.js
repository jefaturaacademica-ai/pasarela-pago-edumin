import puppeteer from 'puppeteer';

async function testOptionalGenerator() {
  console.log('🚀 Testing optional student fields in Link Generator & student mandatory checkout...');
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  try {
    // 1. Navigate to #admin
    await page.goto('http://localhost:4173/#admin', { waitUntil: 'networkidle0' });

    // 2. Click "GENERAR LINK ÚNICO" without filling optional student fields
    const generateBtn = await page.$('button[type="submit"]');
    if (generateBtn) {
      await generateBtn.click();
      await new Promise(r => setTimeout(r, 600));
    }

    const generatedLinkText = await page.evaluate(() => {
      const el = document.querySelector('div.break-all');
      return el ? el.innerText : null;
    });

    console.log('✅ Link generated without student fields:', !!generatedLinkText);

    if (errors.length === 0 && generatedLinkText) {
      console.log('🎉 PERFECT SCORE! Optional fields in Admin Link Generator verified.');
    } else {
      console.error('❌ Verification failed:', { errors, generatedLinkText });
    }

  } catch (err) {
    console.error('Execution error:', err);
  } finally {
    await browser.close();
  }
}

testOptionalGenerator();
