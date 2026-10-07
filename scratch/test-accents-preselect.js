import puppeteer from 'puppeteer';

async function testAccentsAndPreselect() {
  console.log('🚀 Testing accent-insensitive search & diplomado pre-selection...');
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  try {
    // 1. Open #diplomados
    await page.goto('http://localhost:4173/#diplomados', { waitUntil: 'networkidle0' });

    // 2. Type "logistica" (WITHOUT accent) into search input
    await page.type('input[placeholder*="Buscar"]', 'logistica');
    await new Promise(r => setTimeout(r, 400));

    // Check filtered card count
    const cardTitles = await page.evaluate(() => {
      const titles = Array.from(document.querySelectorAll('h3')).map(h => h.innerText);
      return titles.filter(t => t.toLowerCase().includes('log') || t.toLowerCase().includes('comercio') || t.toLowerCase().includes('almacen'));
    });

    console.log('✅ Search "logistica" matched items:', cardTitles.length);

    // 3. Click first MATRICULARME button
    const matricularButtons = await page.$$('button');
    for (const btn of matricularButtons) {
      const text = await page.evaluate(el => el.innerText, btn);
      if (text.includes('MATRICULARME EN ESTE DIPLOMADO')) {
        await btn.click();
        break;
      }
    }

    await new Promise(r => setTimeout(r, 600));

    // Check if StudentRegisterModal opened and has a diplomado selected
    const selectedDiplomado = await page.evaluate(() => {
      const select = document.querySelector('select[required]');
      return select ? select.value : null;
    });

    console.log('✅ Pre-selected diplomado in form dropdown:', selectedDiplomado);

    if (errors.length === 0 && cardTitles.length > 0 && selectedDiplomado) {
      console.log('🎉 PERFECT SCORE! Accents and pre-selection verified successfully.');
    } else {
      console.error('❌ Verification failed:', { errors, cardTitles, selectedDiplomado });
    }

  } catch (err) {
    console.error('Execution error:', err);
  } finally {
    await browser.close();
  }
}

testAccentsAndPreselect();
