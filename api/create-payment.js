// Vercel Serverless Function: Integration bridge with Lyra / Izipay REST API V4
// Officially synchronized with: Instituto Técnico Avanza SAC (74025911)
// Documentation: https://secure.micuentaweb.pe/doc/es-PE/ & github.com/izipay-pe

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { amount, currency = 'PEN', orderId, customer, mode = 'production' } = req.body || {};

    const username = process.env.IZIPAY_USERNAME || '74025911';
    const endpoint = process.env.IZIPAY_ENDPOINT || 'https://api.micuentaweb.pe';

    // Amount in cents (e.g. S/ 1.00 = 100 centavos, S/ 540.00 = 54000 centavos)
    const amountInCents = Math.round((parseFloat(amount) || 540) * 100);

    const primaryUrl = `${endpoint}/api-payment/V4/Charge/CreatePayment`;
    const fallbackUrl = `${endpoint}/v1/charge/createPayment`;

    const payload = {
      amount: amountInCents,
      currency: currency,
      orderId: orderId || `EDUMIN-${Date.now()}`,
      customer: {
        email: customer?.email || 'alumno@edumin.pe',
        reference: customer?.phone || '987654321',
        billingDetails: {
          firstName: customer?.firstName || 'Alumno',
          lastName: customer?.lastName || 'EDUMIN',
        }
      }
    };

    // Define Credential Sets (Production & Test)
    const prodCredentials = {
      name: 'production',
      password: process.env.IZIPAY_PROD_PASSWORD || process.env.IZIPAY_PASSWORD || 'prodpassword_Vy6dFo4zqtRw5hcArFK3OJLulkeLy8ZcwGkMA9cGWST6e',
      publicKey: process.env.IZIPAY_PROD_PUBLIC_KEY || process.env.IZIPAY_PUBLIC_KEY || '74025911:publickey_1CQKXa0PBgF9WaUgdifdq74GsfJ5loyKKHQvBalFPOXuf'
    };

    const testCredentials = {
      name: 'test',
      password: process.env.IZIPAY_TEST_PASSWORD || 'testpassword_Ocqpw5nlHREDJikgqvxDsoeUWcaZ0JGvdKFJC02Arg50C',
      publicKey: process.env.IZIPAY_TEST_PUBLIC_KEY || '74025911:testpublickey_1L5AjIZ7vATPByuE2QQxDD8lsm5zd9pIWqnKUF4eJHcJ'
    };

    // Primary attempt order based on user mode
    const attempts = mode === 'production' 
      ? [prodCredentials, testCredentials] 
      : [testCredentials, prodCredentials];

    let lastError = null;
    let lastResponse = null;

    for (const cred of attempts) {
      const authHeader = 'Basic ' + Buffer.from(`${username}:${cred.password}`).toString('base64');

      let response = await fetch(primaryUrl, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok && response.status === 404) {
        response = await fetch(fallbackUrl, {
          method: 'POST',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });
      }

      const data = await response.json();

      if (data.status === 'SUCCESS' && data.answer?.formToken) {
        return res.status(200).json({
          success: true,
          mode: cred.name,
          formToken: data.answer.formToken,
          publicKey: cred.publicKey,
          clientEndpoint: endpoint,
          clientJsUrl: 'https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js'
        });
      }

      lastError = data.errorMessage || data.answer?.errorMessage || data._type || 'invalid login or private key';
      lastResponse = data;
    }

    // If both attempts returned error
    return res.status(400).json({
      success: false,
      error: `Respuesta de Izipay: ${lastError}`,
      rawResponse: lastResponse
    });

  } catch (error) {
    console.error('Error en /api/create-payment:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error interno del servidor'
    });
  }
}
