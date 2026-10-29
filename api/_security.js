// Shared Security, CORS and Cryptographic Utilities for EDUMIN Serverless Functions
import crypto from 'crypto';

const ALLOWED_ORIGINS = [
  'https://edumin-pasarela-pago.vercel.app',
  'https://edumin.pe',
  'https://www.edumin.pe',
  'http://localhost:5173',
  'http://localhost:4173',
  'http://localhost:3000'
];

/**
 * Applies strict CORS and defense-in-depth HTTP security headers.
 * Returns true if the request is an OPTIONS preflight (which is handled), false otherwise.
 */
export function applyCorsAndSecurity(req, res, methods = 'GET,POST,OPTIONS') {
  const origin = req.headers.origin;

  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (!origin) {
    // Direct server-to-server calls (e.g. Izipay IPN or cURL)
    res.setHeader('Access-Control-Allow-Origin', 'https://edumin-pasarela-pago.vercel.app');
  } else {
    // Untrusted origins
    res.setHeader('Access-Control-Allow-Origin', 'null');
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', methods);
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Security Headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
}

/**
 * Constant-time comparison to prevent side-channel timing attacks.
 */
export function safeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Verifies Izipay HMAC-SHA-256 signature for kr-answer / kr-hash payload.
 */
export function verifyIzipaySignature(krAnswer, krHash, hmacKey) {
  if (!krAnswer || !krHash || !hmacKey) return false;
  const answerString = typeof krAnswer === 'string' ? krAnswer : JSON.stringify(krAnswer);
  const calculated = crypto
    .createHmac('sha256', hmacKey)
    .update(answerString, 'utf8')
    .digest('hex');
  return safeCompare(calculated, krHash);
}
