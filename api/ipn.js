// Vercel Serverless Function: Izipay REST API V4 IPN Notification Handler
// Hardened with Cryptographic HMAC Signature Verification against Fake Payment Injection

import { applyCorsAndSecurity, verifyIzipaySignature } from './_security.js';

export default async function handler(req, res) {
  if (applyCorsAndSecurity(req, res, 'GET,POST,OPTIONS,HEAD')) {
    return;
  }

  if (req.method === 'GET') {
    return res.status(200).json({ success: true, message: 'EDUMIN Izipay IPN Secure Endpoint Active' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const ipnData = req.body || {};
    const webhookUrl = process.env.N8N_WEBHOOK_URL || 'https://n8n.gcg-corp.com/webhook/c592d97d-78d1-4ead-8bed-673be3464658';

    const krAnswer = ipnData['kr-answer'] || ipnData.krAnswer;
    const krHash = ipnData['kr-hash'] || ipnData.krHash;

    const prodHmacKey = process.env.IZIPAY_PROD_HMAC_KEY || process.env.IZIPAY_HMAC_KEY || 'zYUFL4g1K8kJvHNkuj5mLNmUvjowoXCF5tHm9Z7j6qHNn';
    const testHmacKey = process.env.IZIPAY_TEST_HMAC_KEY || 'D19YeRz2gfwmyfiX0h5UyOsvcbmuYkAQyNMQqXHM5UFl7';

    // 1. Mandatory Cryptographic Signature Verification
    let isSignatureValid = false;
    if (krAnswer && krHash) {
      isSignatureValid = verifyIzipaySignature(krAnswer, krHash, prodHmacKey) ||
                         verifyIzipaySignature(krAnswer, krHash, testHmacKey);
    }

    // Reject unverified IPNs to prevent forged payment enrollment
    if (!isSignatureValid) {
      console.warn('⚠️ [ALERTA DE SEGURIDAD] Rechazando IPN con firma inválida o ausente:', {
        hasAnswer: !!krAnswer,
        hasHash: !!krHash,
        ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress
      });
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Firma HMAC-SHA-256 de Izipay inválida o ausente'
      });
    }

    // 2. Parse verified payload
    const parsedAnswer = typeof krAnswer === 'string' ? JSON.parse(krAnswer) : krAnswer;
    const orderStatus = parsedAnswer?.orderStatus || 'UNKNOWN';
    const orderDetails = parsedAnswer?.orderDetails || {};
    const customerDetails = parsedAnswer?.customer || {};

    const payload = {
      event: orderStatus === 'PAID' ? 'payment_success' : 'payment_rejected',
      status: orderStatus === 'PAID' ? 'SUCCESS' : 'REJECTED',
      verified: true,
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

    // 3. Forward verified transaction to n8n
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    return res.status(200).json({ success: true, message: 'IPN autenticado y notificado a n8n' });
  } catch (error) {
    console.error('Error procesando IPN seguro Izipay:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
