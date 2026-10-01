/**
 * Utility Service for Izipay / Lyra Network Integration
 * Inspired by github.com/lyra/webview-payment-sparkjava-integration-sample
 */

/**
 * Requests a formToken from our backend API (/api/create-payment)
 */
export async function createIzipayPaymentToken({ amount, orderId, customer }) {
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
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.warn('Backend /api/create-payment not active or offline. Falling back to frontend mock mode.', err);
    return {
      success: true,
      mode: 'mock_fallback',
      formToken: `MOCK-TOKEN-${Date.now()}`,
      publicKey: 'MOCK-PUBLIC-KEY'
    };
  }
}

/**
 * Dynamically loads the Lyra/Izipay KR Client SDK Script
 */
export function loadIzipayScript(publicKey, endpoint = 'https://api.micuentaweb.pe') {
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

    // Load Theme CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${endpoint}/static/js/kws-sdk/v1.3.0/static/css/kws.bootstrap.min.css`;
    document.head.appendChild(link);

    // Load JS SDK
    const script = document.createElement('script');
    script.id = 'izipay-kr-sdk';
    script.src = `${endpoint}/static/js/kws-sdk/v1.3.0/static/js/kws.bootstrap.min.js`;
    if (publicKey) {
      script.setAttribute('kr-public-key', publicKey);
      script.setAttribute('kr-post-url-success', window.location.origin + '/payment-success');
    }

    script.onload = () => resolve(window.KR);
    script.onerror = (err) => reject(err);

    document.body.appendChild(script);
  });
}
