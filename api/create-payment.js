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
    const { amount, currency = 'PEN', orderId, customer, mode = 'production', customPassword } = req.body || {};

    const username = process.env.IZIPAY_USERNAME || '74025911';
    const endpoint = process.env.IZIPAY_ENDPOINT || 'https://api.micuentaweb.pe';

    // Amount in cents (e.g. S/ 1.00 = 100 centavos, S/ 540.00 = 54000 centavos)
    const amountInCents = Math.round((parseFloat(amount) || 540) * 100);

    const primaryUrl = `${endpoint}/api-payment/V4/Charge/CreatePayment`;
    const fallbackUrl = `${endpoint}/v1/charge/createPayment`;

    // Parse customer names & details dynamically for Izipay Back Office
    const fullName = (customer?.fullName || customer?.name || `${customer?.firstName || ''} ${customer?.lastName || ''}`).trim();
    const nameParts = fullName ? fullName.split(/\s+/) : [];
    const firstName = customer?.firstName || nameParts[0] || 'Alumno';
    const lastName = customer?.lastName || (nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'EDUMIN');
    const email = customer?.email || 'alumno@edumin.pe';
    const phone = customer?.phone || '987654321';

    const payload = {
      amount: amountInCents,
      currency: currency,
      orderId: orderId || `EDUMIN-${Date.now()}`,
      customer: {
        email: email,
        reference: phone,
        billingDetails: {
          firstName: firstName,
          lastName: lastName,
          phoneNumber: phone,
        }
      }
    };

    // Candidate Passwords to attempt (using exact copied text strings)
    const passwordsToTry = [];
    
    if (customPassword && customPassword.trim()) {
      passwordsToTry.push({
        name: 'custom',
        password: customPassword.trim(),
        publicKey: process.env.IZIPAY_PROD_PUBLIC_KEY || '74025911:publickey_1cQKXa0PBgf9WaUgdIfdq74GsfJ5loyKKHQvBalFPOXuf'
      });
    }

    // Exact Production and Test credentials provided by user
    const prodCredentials = {
      name: 'production',
      password: process.env.IZIPAY_PROD_PASSWORD || process.env.IZIPAY_PASSWORD || 'prodpassword_UPpQJbTlmde3Gqwp8bfQTPQajK1Q7eOqcVtduT9f6l52V',
      publicKey: process.env.IZIPAY_PROD_PUBLIC_KEY || process.env.IZIPAY_PUBLIC_KEY || '74025911:publickey_1cQKXa0PBgf9WaUgdIfdq74GsfJ5loyKKHQvBalFPOXuf'
    };

    const testCredentials = {
      name: 'test',
      password: process.env.IZIPAY_TEST_PASSWORD || 'testpassword_Ocqpw5nlHREDJikgqvxDsoeUWcaZ0JGvdKfJC02Arg50C',
      publicKey: process.env.IZIPAY_TEST_PUBLIC_KEY || '74025911:testpublickey_1L5AjiZ7vATPByuE2QqXDD8lsm5zd9piWqnKUF4eJHcxJ'
    };

    if (mode === 'production') {
      passwordsToTry.push(prodCredentials, testCredentials);
    } else {
      passwordsToTry.push(testCredentials, prodCredentials);
    }

    let lastError = null;
    let lastResponse = null;

    for (const cred of passwordsToTry) {
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
