const username = '74025911';
const testPassword = 'testpassword_Ocqpw5nlHREDJikgqvxDsoeUWcaZ0JGvdKFJC02Arg50C';
const prodPassword = 'prodpassword_UPpQJbTlmde3Gqwp8bfQTPQaJK1Q7eOqcVtduT9f6l52V';

async function test(label, password) {
  const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
  console.log(`\nTesting ${label}...`);
  try {
    const res = await fetch('https://api.micuentaweb.pe/api-payment/V4/Charge/CreatePayment', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: 100,
        currency: 'PEN',
        orderId: `ORD-${Date.now()}`,
        customer: { email: 'test@edumin.pe' }
      })
    });

    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Response:', text);
  } catch (e) {
    console.error('Error:', e.message);
  }
}

async function run() {
  await test('TEST KEY', testPassword);
  await test('PROD KEY', prodPassword);
}

run();
