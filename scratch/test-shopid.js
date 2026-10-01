const prodPassword = 'prodpassword_UPpQJbTlmde3Gqwp8bfQTPQaJK1Q7eOqcVtduT9f6l52V';
const testPassword = 'testpassword_Ocqpw5nlHREDJikgqvxDsoeUWcaZ0JGvdKFJC02Arg50C';

async function testUser(user, pwd) {
  const authHeader = 'Basic ' + Buffer.from(`${user}:${pwd}`).toString('base64');
  console.log(`\n--- Probando Usuario: ${user} ---`);
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
        orderId: `TEST-${Date.now()}`,
        customer: { email: 'test@edumin.pe' }
      })
    });
    const data = await res.json();
    console.log(`Status HTTP: ${res.status}`);
    console.log(`Response:`, JSON.stringify(data));
    if (data.status === 'SUCCESS') {
      console.log(`🎉 SUCCESS! Username ${user} WORKED!`);
    }
  } catch (e) {
    console.error(e.message);
  }
}

async function run() {
  await testUser('500008234', prodPassword);
  await testUser('500008234', testPassword);
  await testUser('74025911', prodPassword);
  await testUser('74025911', testPassword);
}

run();
