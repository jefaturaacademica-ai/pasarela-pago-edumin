// Vercel Serverless Function: HMAC-SHA-256 IPN / Webhook Hash Verifier for Izipay Perú
// Documentation: https://secure.micuentaweb.pe/doc/es-PE/

import crypto from 'crypto';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
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
    const { krHash, krAnswer, mode = 'test' } = req.body || {};

    if (!krHash || !krAnswer) {
      return res.status(400).json({ success: false, error: 'Missing kr-hash or kr-answer parameters' });
    }

    // HMAC Keys provided by Izipay Back Office (Instituto Técnico Avanza SAC)
    const isProd = (process.env.IZIPAY_MODE === 'production' || mode === 'production');
    const hmacKey = process.env.IZIPAY_HMAC_KEY || (
      isProd
        ? 'mR2JvdcDWB7iHR6s4IMYI4UAwh3Fc7qNwTt7Ip0YVBN9'
        : 'D19YeRz2gfwmyfiX0h5UyOsvcbmuykAQyNMQqXHM5UFI7'
    );

    // Compute HMAC-SHA-256 hash of krAnswer payload using hmacKey
    const answerString = typeof krAnswer === 'string' ? krAnswer : JSON.stringify(krAnswer);
    const calculatedHash = crypto
      .createHmac('sha256', hmacKey)
      .update(answerString, 'utf8')
      .digest('hex');

    const isValid = (calculatedHash === krHash);

    return res.status(200).json({
      success: true,
      isValid: isValid,
      orderStatus: typeof krAnswer === 'object' ? krAnswer?.orderStatus : null,
      orderDetails: typeof krAnswer === 'object' ? krAnswer?.orderDetails : null
    });

  } catch (error) {
    console.error('Error validando firma HMAC Izipay:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
