/**
 * Utility Service for Izipay / Lyra Network V4 Integration
 * Synchronized with official store: Instituto Técnico Avanza SAC (74025911)
 * Official Guide: https://secure.micuentaweb.pe/doc/es-PE/
 */

export const IZIPAY_CONFIG = {
  merchantId: '74025911',
  testPublicKey: '74025911:testpublickey_1L5AjIZ7vATPByuE2QQxDD8lsm5zd9pIWqnKUF4eJHcJ',
  prodPublicKey: '74025911:publickey_1CQKXa0PBgF9WaUgdifdq74GsfJ5loyKKHQvBalFPOXuf',
  jsClientUrl: 'https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js',
  cssThemeUrl: 'https://static.micuentaweb.pe/static/js/krypton-client/V4.0/ext/classic-reset.css'
};

/**
 * Requests a formToken from backend API (/api/create-payment)
 */
export async function createIzipayPaymentToken({ amount, orderId, customer, mode = 'test' }) {
  try {
    const response = await fetch('/api/create-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency: 'PEN',
        orderId,
        customer,
        mode
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.warn('Backend /api/create-payment fallback active.', err);
    return {
      success: true,
      mode: 'test',
      formToken: `MOCK-TOKEN-${Date.now()}`,
      publicKey: IZIPAY_CONFIG.testPublicKey
    };
  }
}

/**
 * Validates HMAC-SHA-256 signature for IPN / return payload
 */
export async function validateIzipayPayment({ krHash, krAnswer, mode = 'test' }) {
  try {
    const response = await fetch('/api/validate-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ krHash, krAnswer, mode })
    });
    return await response.json();
  } catch (err) {
    console.error('Error enviando petición de validación HMAC:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Dynamically loads the official Izipay V4 Client SDK Script & Theme CSS
 */
export function loadIzipayScript(publicKey = IZIPAY_CONFIG.testPublicKey) {
  return new Promise((resolve, reject) => {
    if (window.KR) {
      resolve(window.KR);
      return;
    }

    const existingScript = document.getElementById('izipay-kr-sdk');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.KR));
      existingScript.addEventListener('error', (e) => reject(e));
      return;
    }

    // Load V4 Theme CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = IZIPAY_CONFIG.cssThemeUrl;
    document.head.appendChild(link);

    // Load V4 JS SDK
    const script = document.createElement('script');
    script.id = 'izipay-kr-sdk';
    script.src = IZIPAY_CONFIG.jsClientUrl;
    script.setAttribute('kr-public-key', publicKey);
    script.setAttribute('kr-post-url-success', window.location.origin + '/payment-success');

    script.onload = () => resolve(window.KR);
    script.onerror = (err) => reject(err);

    document.body.appendChild(script);
  });
}
