const username = '74025911';

// Exact copied credentials from user text:
const prodPassword = 'prodpassword_UPpQJbTlmde3Gqwp8bfQTPQajK1Q7eOqcVtduT9f6l52V';
const testPassword = 'testpassword_Ocqpw5nlHREDJikgqvxDsoeUWcaZ0JGvdKfJC02Arg50C';

async function testApi(label, pwd) {
  const authHeader = 'Basic ' + Buffer.from(`${username}:${pwd}`).toString('base64');
  console.log(`\n--- Probando ${label} ---`);
  console.log(`Usuario: ${username}`);
  console.log(`Password: ${pwd}`);

  const payload = {
    amount: 100,
    currency: 'PEN',
    orderId: `EDUMIN-${Date.now()}`,
    customer: {
      email: 'alumno@edumin.pe'
    }
  };

  try {
    const res = await fetch('https://api.micuentaweb.pe/api-payment/V4/Charge/CreatePayment', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log('Status HTTP:', res.status);
    console.log('Resultado JSON:', JSON.stringify(data, null, 2));
    if (data.status === 'SUCCESS' && data.answer?.formToken) {
      console.log('🎉 ¡CONEXION EXITOSA! Token generado:', data.answer.formToken);
    }
  } catch (e) {
    console.error('Error:', e.message);
  }
}

async function run() {
  await testApi('PRODUCCION (CLAVE DE TEXTO DEL USUARIO)', prodPassword);
  await testApi('TEST (CLAVE DE TEXTO DEL USUARIO)', testPassword);
}

run();
