/**
 * Utility Service for Izipay / Lyra Network V4 Integration
 * Synchronized with official store: Instituto Técnico Avanza SAC (74025911)
 * Official Guide: https://secure.micuentaweb.pe/doc/es-PE/
 */

export const IZIPAY_CONFIG = {
  merchantId: '74025911',
  testPublicKey: '74025911:testpublickey_1L5AjiZ7vATPByuE2QqXDD8lsm5zd9piWqnKUF4eJHcxJ',
  prodPublicKey: '74025911:publickey_1cQKXa0PBgf9WaUgdIfdq74GsfJ5loyKKHQvBalFPOXuf',
  testHmacKey: 'D19YeRz2gfwmyfiX0h5UyOsvcbmuYkAQyNMQqXHM5UFl7',
  prodHmacKey: 'mR2JvdcDW8i7iHR6s4IMYI4UAwh3Fc7qNwTt7Ip0YVBN9',
  jsClientUrl: 'https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js',
  cssThemeUrl: 'https://static.micuentaweb.pe/static/js/krypton-client/V4.0/ext/classic-reset.css'
};

/**
 * Requests a formToken from backend API (/api/create-payment)
 */
export async function createIzipayPaymentToken({ amount, orderId, customer, mode = 'production' }) {
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
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP error ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.warn('Backend /api/create-payment fallback active.', err);
    return {
      success: false,
      error: err.message || 'Error conectando con servidor Izipay.'
    };
  }
}

/**
 * Validates HMAC-SHA-256 signature for IPN / return payload
 */
export async function validateIzipayPayment({ krHash, krAnswer, mode = 'production' }) {
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
 * Dynamically loads/reloads the official Izipay V4 Client SDK Script with the matching publicKey
 */
export function loadIzipayScript(publicKey = IZIPAY_CONFIG.prodPublicKey) {
  return new Promise((resolve, reject) => {
    const existingScript = document.getElementById('izipay-kr-sdk');

    // If script exists but with a DIFFERENT public key, remove it to reload with matching key
    if (existingScript) {
      const currentKey = existingScript.getAttribute('kr-public-key');
      if (currentKey !== publicKey) {
        console.log('Cambiando llave pública Izipay en el DOM:', currentKey, '=>', publicKey);
        existingScript.remove();
        if (window.KR) {
          try {
            delete window.KR;
          } catch (e) {
            window.KR = undefined;
          }
        }
      } else if (window.KR) {
        resolve(window.KR);
        return;
      }
    }

    // Load V4 Theme CSS if not present
    if (!document.getElementById('izipay-kr-theme')) {
      const link = document.createElement('link');
      link.id = 'izipay-kr-theme';
      link.rel = 'stylesheet';
      link.href = IZIPAY_CONFIG.cssThemeUrl;
      document.head.appendChild(link);
    }

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
