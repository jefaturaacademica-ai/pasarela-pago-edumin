// Vercel Serverless Function: Forward payment status events to n8n Webhook
// Target n8n Webhook: https://n8n.gcg-corp.com/webhook/c592d97d-78d1-4ead-8bed-673be3464658

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
    const webhookUrl = 'https://n8n.gcg-corp.com/webhook/c592d97d-78d1-4ead-8bed-673be3464658';

    const {
      status, // 'SUCCESS' | 'REJECTED' | 'ERROR'
      orderNumber,
      amount,
      currency = 'PEN',
      customer,
      diplomado,
      packageName,
      mode,
      errorMessage,
      paymentData
    } = req.body || {};

    const activeDiplomado = diplomado || customer?.diplomado || 'No especificado';

    const payload = {
      event: status === 'SUCCESS' ? 'payment_success' : 'payment_rejected',
      status: status || 'UNKNOWN',
      orderNumber: orderNumber || 'N/A',
      amount: amount || 0,
      currency: currency,
      diplomado: activeDiplomado,
      customer: {
        name: customer?.name || customer?.fullName || 'Alumno EDUMIN',
        email: customer?.email || 'alumno@edumin.pe',
        phone: customer?.phone || '987654321',
        diplomado: activeDiplomado
      },
      packageName: packageName || 'PROGRAMA DE ESPECIALIZACIÓN EDUMIN',
      mode: mode || 'production',
      errorMessage: errorMessage || null,
      merchant: {
        name: 'Instituto Técnico Avanza SAC',
        shopId: '74025911'
      },
      paymentData: paymentData || null,
      timestamp: new Date().toISOString()
    };

    console.log('Enviando notificación a n8n:', payload);

    const n8nRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const resText = await n8nRes.text();
    console.log('Respuesta de n8n Webhook:', n8nRes.status, resText);

    return res.status(200).json({
      success: true,
      n8nStatus: n8nRes.status,
      message: 'Notificación enviada a n8n correctamente'
    });

  } catch (error) {
    console.error('Error enviando notificación a n8n:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error notificando al webhook de n8n'
    });
  }
}
