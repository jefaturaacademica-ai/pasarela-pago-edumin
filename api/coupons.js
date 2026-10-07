// Vercel Serverless Function: Coupon Validation & State API

let serverCoupons = [
  { code: 'EDUMIN-IA-50', discount: 50, isUsed: false },
  { code: 'EDUMIN-IA-30', discount: 30, isUsed: false },
  { code: 'RECCIP-100', discount: 100, isUsed: false }
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const { code } = req.query;
    if (!code) return res.status(200).json({ coupons: serverCoupons });
    
    const found = serverCoupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!found) return res.status(404).json({ valid: false, error: 'Cupón no encontrado.' });
    if (found.isUsed) return res.status(400).json({ valid: false, error: 'Este cupón ya fue canjeado.' });
    
    return res.status(200).json({ valid: true, discountAmount: found.discount, code: found.code });
  }

  if (req.method === 'POST') {
    const { action, code, studentDni, discount, description } = req.body || {};

    if (action === 'REDEEM') {
      const cleanCode = (code || '').trim().toUpperCase();
      const target = serverCoupons.find(c => c.code.toUpperCase() === cleanCode);
      if (!target) return res.status(404).json({ success: false, error: 'Cupón no encontrado.' });
      if (target.isUsed) return res.status(400).json({ success: false, error: 'Cupón ya fue canjeado.' });

      target.isUsed = true;
      target.usedBy = studentDni || 'Anónimo';
      target.usedAt = new Date().toISOString();

      return res.status(200).json({ success: true, message: 'Cupón canjeado con éxito.' });
    }

    if (action === 'CREATE') {
      const cleanCode = (code || '').trim().toUpperCase();
      if (serverCoupons.some(c => c.code.toUpperCase() === cleanCode)) {
        return res.status(400).json({ success: false, error: 'El cupón ya existe.' });
      }
      const newCoupon = { code: cleanCode, discount: Number(discount) || 50, isUsed: false, description };
      serverCoupons.unshift(newCoupon);
      return res.status(200).json({ success: true, coupon: newCoupon });
    }
  }

  return res.status(405).json({ error: 'Method not allowed.' });
}
