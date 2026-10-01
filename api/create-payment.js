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
    const { amount, currency = 'PEN', orderId, customer, mode = 'test' } = req.body || {};

    // Official Izipay Merchant Credentials (Instituto Técnico Avanza SAC)
    const username = process.env.IZIPAY_USERNAME || '74025911';
    
    // Select Test or Production Password based on mode or env
    const isProd = (process.env.IZIPAY_MODE === 'production' || mode === 'production');
    const password = process.env.IZIPAY_PASSWORD || (
      isProd 
        ? 'prodpassword_Vy6dFo4zqtRw5hcArFK3OJLulkeLy8ZcwGkMA9cGWST6e'
        : 'testpassword_Ocqpw5nlHREDJikgqvxDsoeUWcaZ0JGvdKFJC02Arg50C'
    );

    const publicKey = process.env.IZIPAY_PUBLIC_KEY || (
      isProd
        ? '74025911:publickey_1CQKXa0PBgF9WaUgdifdq74GsfJ5loyKKHQvBalFPOXuf'
        : '74025911:testpublickey_1L5AjIZ7vATPByuE2QQxDD8lsm5zd9pIWqnKUF4eJHcJ'
    );

    const endpoint = process.env.IZIPAY_ENDPOINT || 'https://api.micuentaweb.pe';

    // Amount in cents (e.g. 540 PEN = 54000)
    const amountInCents = Math.round((parseFloat(amount) || 540) * 100);
    const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
    
    // Izipay REST API V4 endpoint: /api-payment/V4/Charge/CreatePayment or /v1/charge/createPayment
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

    let response = await fetch(primaryUrl, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok && response.status === 404) {
      // Try fallback URL if V4 path returns 404
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
        mode: isProd ? 'production' : 'test',
        formToken: data.answer.formToken,
        publicKey: publicKey,
        clientEndpoint: endpoint,
        clientJsUrl: 'https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js'
      });
    } else {
      return res.status(400).json({
        success: false,
        error: data.errorMessage || data._type || 'Error generando formToken con Izipay',
        rawResponse: data
      });
    }

  } catch (error) {
    console.error('Error en /api/create-payment:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error interno del servidor'
    });
  }
}
