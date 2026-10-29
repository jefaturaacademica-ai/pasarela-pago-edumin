// Vercel Serverless Function: Coupon Validation & State API
// Hardened against Public Coupon Scraping and Enumeration Attacks

import { applyCorsAndSecurity } from './_security.js';

let serverCoupons = [
  { code: 'EDUMIN-IA-50', discount: 50, isUsed: true },
  { code: 'EDUMIN-IA-30', discount: 30, isUsed: true },
  { code: 'RECCIP-100', discount: 100, isUsed: false }
];

export default async function handler(req, res) {
  if (applyCorsAndSecurity(req, res, 'GET,POST,OPTIONS')) {
    return;
  }

  if (req.method === 'GET') {
    const { code } = req.query;
    // Security Fix: Do not dump all coupons if code is missing
    if (!code || typeof code !== 'string' || !code.trim()) {
      return res.status(400).json({ valid: false, error: 'Debe ingresar un código de cupón para validar.' });
    }

    const cleanCode = code.trim().toUpperCase();
    const found = serverCoupons.find(c => c.code.toUpperCase() === cleanCode);

    if (!found) {
      return res.status(404).json({ valid: false, error: 'Cupón no encontrado o inválido.' });
    }
    if (found.isUsed) {
      return res.status(400).json({ valid: false, error: 'Este cupón ya fue canjeado anteriormente.' });
    }

    return res.status(200).json({ valid: true, discountAmount: found.discount, code: found.code });
  }

  if (req.method === 'POST') {
    const { action, code, studentDni } = req.body || {};

    if (action === 'REDEEM') {
      const cleanCode = (code || '').trim().toUpperCase();
      const target = serverCoupons.find(c => c.code.toUpperCase() === cleanCode);

      if (!target) return res.status(404).json({ success: false, error: 'Cupón no encontrado.' });
      if (target.isUsed) return res.status(400).json({ success: false, error: 'Cupón ya fue canjeado anteriormente.' });

      target.isUsed = true;
      target.usedBy = studentDni || 'Anónimo';
      target.usedAt = new Date().toISOString();

      return res.status(200).json({ success: true, message: 'Cupón canjeado con éxito.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed.' });
}
