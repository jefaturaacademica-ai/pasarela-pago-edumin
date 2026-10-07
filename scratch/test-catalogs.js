import puppeteer from 'puppeteer';

async function testCatalogs() {
  console.log('🚀 Testing #diplomados and #cursos interactive catalog routes...');
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  try {
    // 1. Test #diplomados
    await page.goto('http://localhost:4173/#diplomados', { waitUntil: 'networkidle0' });
    const hasDiplomadosModal = await page.evaluate(() => {
      return document.body.innerText.includes('DIPLOMADOS DE ALTA ESPECIALIZACIÓN MINERA') || document.body.innerText.includes('Derecho Minero');
    });
    console.log('✅ #diplomados modal visible:', hasDiplomadosModal);

    // 2. Test #cursos
    await page.goto('http://localhost:4173/#cursos', { waitUntil: 'networkidle0' });
    const hasCursosModal = await page.evaluate(() => {
      return document.body.innerText.includes('CURSO DE IA DE 0 A 100') || document.body.innerText.includes('Prompt Engineering');
    });
    console.log('✅ #cursos modal visible:', hasCursosModal);

    if (errors.length === 0) {
      console.log('🎉 PERFECT SCORE! 0 Errors encountered in catalog tests.');
    } else {
      console.error('❌ Errors found:', errors);
    }
  } catch (err) {
    console.error('Execution error:', err);
  } finally {
    await browser.close();
  }
}

testCatalogs();
