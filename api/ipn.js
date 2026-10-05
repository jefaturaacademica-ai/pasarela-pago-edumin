// Vercel Serverless Function: Izipay REST API V4 IPN Notification Handler
// Automatically forwards Izipay IPN notifications to n8n Webhook

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS' || req.method === 'HEAD') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ success: true, message: 'EDUMIN Izipay IPN Endpoint Active' });
  }

  try {
    const ipnData = req.body || {};
    const webhookUrl = 'https://n8n.gcg-corp.com/webhook/c592d97d-78d1-4ead-8bed-673be3464658';

    const orderStatus = ipnData['kr-answer']?.orderStatus || ipnData.orderStatus || 'UNKNOWN';
    const orderDetails = ipnData['kr-answer']?.orderDetails || {};
    const customerDetails = ipnData['kr-answer']?.customer || {};

    const payload = {
      event: orderStatus === 'PAID' ? 'payment_success' : 'payment_rejected',
      status: orderStatus === 'PAID' ? 'SUCCESS' : 'REJECTED',
      orderNumber: orderDetails.orderId || 'N/A',
      amount: orderDetails.orderTotalAmount ? orderDetails.orderTotalAmount / 100 : 0,
      currency: orderDetails.orderCurrency || 'PEN',
      customer: {
        name: `${customerDetails.billingDetails?.firstName || ''} ${customerDetails.billingDetails?.lastName || ''}`.trim() || 'Alumno EDUMIN',
        email: customerDetails.email || 'alumno@edumin.pe',
        phone: customerDetails.reference || customerDetails.billingDetails?.phoneNumber || '987654321'
      },
      merchant: {
        name: 'Instituto Técnico Avanza SAC',
        shopId: '74025911'
      },
      rawIpnData: ipnData,
      timestamp: new Date().toISOString()
    };

    // Forward to n8n
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    return res.status(200).json({ success: true, message: 'IPN recibido y notificado a n8n' });
  } catch (error) {
    console.error('Error procesando IPN Izipay:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
