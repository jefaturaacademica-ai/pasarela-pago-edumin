const username = '74025911';

// Test variations for testpassword
const testVariations = [
  'testpassword_Ocqpw5nlHREDJikgqvxDsoeUWcaZ0JGvdKFJC02Arg50C',
  'testpassword_0cqpw5nlHREDJikgqvxDsoeUWcaZ0JGvdKFJC02Arg50C',
  'testpassword_Ocqpw5nIHREDJikgqvxDsoeUWcaZ0JGvdKFJC02Arg50C',
  'testpassword_Ocqpw51HREDJikgqvxDsoeUWcaZ0JGvdKFJC02Arg50C',
  'testpassword_Ocqpw5nlHREDJikgqvxDsoeUWcaZOJGvdKFJC02Arg50C',
];

// Test variations for prodpassword
const prodVariations = [
  'prodpassword_Vy6dFo4zqtRw5hcArFK3OJLulkeLy8ZcwGkMA9cGWST6e',
  'prodpassword_Vy6dFo4zqtRw5hcArFK30JLulkeLy8ZcwGkMA9cGWST6e',
  'prodpassword_Vy6dFo4zqtRw5hcArFK3OJLuIkeLy8ZcwGkMA9cGWST6e',
  'prodpassword_Vy6dFo4zqtRw5hcArFK3OJLUlkeLy8ZcwGkMA9cGWST6e',
  'prodpassword_Vy6dFo4zqtRw5hcArFK3OJlulkeLy8ZcwGkMA9cGWST6e',
  'prodpassword_Vy6dFo4zqtRw5hcArFK3OJLulkeLy8ZcwGkMA9cGWST6E',
];

async function check(pwd) {
  const authHeader = 'Basic ' + Buffer.from(`${username}:${pwd}`).toString('base64');
  try {
    const res = await fetch('https://api.micuentaweb.pe/api-payment/V4/Charge/CreatePayment', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount: 100, currency: 'PEN', orderId: `CHK-${Date.now()}` })
    });
    const data = await res.json();
    if (data.status === 'SUCCESS') {
      console.log('✅ EXITO CON CLAVE:', pwd);
      return true;
    } else {
      console.log('❌ Falló con:', pwd, '-> Error:', data.answer?.errorMessage || data.errorMessage);
    }
  } catch (e) {
    console.log('Error de red con:', pwd, e.message);
  }
  return false;
}

async function main() {
  console.log('Probando variaciones de TEST...');
  for (const p of testVariations) {
    if (await check(p)) break;
  }

  console.log('\nProbando variaciones de PROD...');
  for (const p of prodVariations) {
    if (await check(p)) break;
  }
}

main();
