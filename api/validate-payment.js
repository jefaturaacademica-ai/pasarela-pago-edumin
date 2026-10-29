// Vercel Serverless Function: HMAC-SHA-256 IPN / Webhook Hash Verifier for Izipay Perú
// Hardened with Timing-Safe Verification & Restricted CORS
import { applyCorsAndSecurity, verifyIzipaySignature } from './_security.js';

export default async function handler(req, res) {
  if (applyCorsAndSecurity(req, res, 'GET,OPTIONS,POST')) {
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { krHash, krAnswer, mode = 'production' } = req.body || {};

    if (!krHash || !krAnswer) {
      return res.status(400).json({ success: false, error: 'Missing kr-hash or kr-answer parameters' });
    }

    const isProd = (process.env.IZIPAY_MODE === 'production' || mode === 'production');
    const hmacKey = process.env.IZIPAY_HMAC_KEY || (
      isProd
        ? (process.env.IZIPAY_PROD_HMAC_KEY || 'zYUFL4g1K8kJvHNkuj5mLNmUvjowoXCF5tHm9Z7j6qHNn')
        : (process.env.IZIPAY_TEST_HMAC_KEY || 'D19YeRz2gfwmyfiX0h5UyOsvcbmuYkAQyNMQqXHM5UFl7')
    );

    // Cryptographically safe constant-time HMAC-SHA-256 verification
    const isValid = verifyIzipaySignature(krAnswer, krHash, hmacKey);

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
