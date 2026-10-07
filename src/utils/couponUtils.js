// LocalStorage & Serverless Coupon Service for Single-Use Discount Coupons

const INITIAL_COUPONS = [
  { code: 'EDUMIN-IA-50', discount: 50, type: 'fixed', isUsed: false, usedBy: null, usedAt: null, description: 'Descuento S/ 50 Curso IA' },
  { code: 'EDUMIN-IA-30', discount: 30, type: 'fixed', isUsed: false, usedBy: null, usedAt: null, description: 'Descuento S/ 30 Curso IA' },
  { code: 'RECCIP-100', discount: 100, type: 'fixed', isUsed: false, usedBy: null, usedAt: null, description: 'Beca Parcial RECCIP S/ 100' },
  { code: 'BECA-IA-2026', discount: 50, type: 'fixed', isUsed: false, usedBy: null, usedAt: null, description: 'Beca Especial IA S/ 50' }
];

const STORAGE_KEY = 'edumin_coupons_v1';

export function getCoupons() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_COUPONS));
      return INITIAL_COUPONS;
    }
    return JSON.parse(raw);
  } catch (err) {
    return INITIAL_COUPONS;
  }
}

export function validateCoupon(code) {
  if (!code || typeof code !== 'string') {
    return { valid: false, error: 'Por favor ingresa un código de cupón.' };
  }
  const cleanCode = code.trim().toUpperCase();
  const coupons = getCoupons();
  const found = coupons.find(c => c.code.toUpperCase() === cleanCode);

  if (!found) {
    return { valid: false, error: 'El código de cupón ingresado no existe.' };
  }

  if (found.isUsed) {
    return { valid: false, error: `Este cupón ya fue canjeado el ${found.usedAt || 'anteriormente'} (DNI: ${found.usedBy || 'Alumno'}).` };
  }

  return {
    valid: true,
    coupon: found,
    discountAmount: found.discount,
    code: found.code
  };
}

export function markCouponAsUsed(code, studentDni = '') {
  if (!code) return false;
  const cleanCode = code.trim().toUpperCase();
  const coupons = getCoupons();
  const updated = coupons.map(c => {
    if (c.code.toUpperCase() === cleanCode) {
      return {
        ...c,
        isUsed: true,
        usedBy: studentDni || 'DNI No especificado',
        usedAt: new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' })
      };
    }
    return c;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return true;
}

export function createCoupon(code, discount, description = '') {
  if (!code || !discount) return { success: false, error: 'Código y monto de descuento son obligatorios.' };
  const cleanCode = code.trim().toUpperCase();
  const coupons = getCoupons();

  if (coupons.some(c => c.code.toUpperCase() === cleanCode)) {
    return { success: false, error: 'Ya existe un cupón con este código.' };
  }

  const newCoupon = {
    code: cleanCode,
    discount: Number(discount),
    type: 'fixed',
    isUsed: false,
    usedBy: null,
    usedAt: null,
    description: description.trim() || `Descuento S/ ${discount}`
  };

  const updated = [newCoupon, ...coupons];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return { success: true, coupon: newCoupon };
}
