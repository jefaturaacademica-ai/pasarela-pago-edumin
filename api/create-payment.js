// Vercel Serverless Function: Integration bridge with Lyra / Izipay REST API
// Based on official sample: github.com/lyra/webview-payment-sparkjava-integration-sample

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
    const { amount, currency = 'PEN', orderId, customer } = req.body || {};

    const username = process.env.IZIPAY_USERNAME || process.env.IZIPAY_SITE_ID;
    const password = process.env.IZIPAY_PASSWORD || process.env.IZIPAY_SECRET_KEY;
    const endpoint = process.env.IZIPAY_ENDPOINT || 'https://api.micuentaweb.pe';

    // Amount in cents (e.g. 540 PEN = 54000)
    const amountInCents = Math.round((parseFloat(amount) || 540) * 100);

    // If real Izipay credentials are provided in Vercel Environment Variables
    if (username && password) {
      const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
      
      const response = await fetch(`${endpoint}/v1/charge/createPayment`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
        })
      });

      const data = await response.json();

      if (data.status === 'SUCCESS' && data.answer?.formToken) {
        return res.status(200).json({
          success: true,
          mode: 'production',
          formToken: data.answer.formToken,
          publicKey: process.env.IZIPAY_PUBLIC_KEY || '',
          clientEndpoint: endpoint
        });
      } else {
        return res.status(400).json({
          success: false,
          error: data.errorMessage || 'Error generando formToken con Izipay',
          rawResponse: data
        });
      }
    }

    // Demo / Sandbox fallback mode if environment variables are not set yet
    const mockFormToken = `DEMO-FORM-TOKEN-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

    return res.status(200).json({
      success: true,
      mode: 'demo',
      formToken: mockFormToken,
      publicKey: 'DEMO-PUBLIC-KEY-EDUMIN-2026',
      message: 'Modo demostración activo. Configura IZIPAY_USERNAME e IZIPAY_PASSWORD en Vercel para conectividad en vivo con Izipay.'
    });

  } catch (error) {
    console.error('Error en /api/create-payment:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error interno del servidor'
    });
  }
}
