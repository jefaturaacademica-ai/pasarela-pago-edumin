// Vercel Serverless Function: Forward payment status events to n8n Webhook
// Hardened with Strict CORS and Sanitization

import { applyCorsAndSecurity } from './_security.js';

export default async function handler(req, res) {
  if (applyCorsAndSecurity(req, res, 'POST,OPTIONS')) {
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const webhookUrl = process.env.N8N_WEBHOOK_URL || 'https://n8n.gcg-corp.com/webhook/c592d97d-78d1-4ead-8bed-673be3464658';

    const {
      status, // 'SUCCESS' | 'REJECTED' | 'ERROR'
      orderNumber,
      amount,
      currency = 'PEN',
      paymentDate,
      paymentDateFormatted,
      nombres,
      apellidos,
      nombreCompleto,
      dni,
      customer,
      diplomado,
      packageName,
      mode,
      errorMessage,
      paymentData
    } = req.body || {};

    const sanitizeStr = (str, maxLen = 120) => {
      if (typeof str !== 'string') return '';
      return str.replace(/[<>'"]/g, '').trim().slice(0, maxLen);
    };

    const activeDiplomado = sanitizeStr(diplomado || customer?.diplomado) || 'No especificado';
    const activeDni = sanitizeStr(dni || customer?.dni, 20) || 'No especificado';
    const activeNombres = sanitizeStr(nombres || customer?.firstName);
    const activeApellidos = sanitizeStr(apellidos || customer?.lastName);
    const activeFullName = sanitizeStr(nombreCompleto || customer?.fullName || customer?.name || `${activeNombres} ${activeApellidos}`.trim()) || 'Alumno EDUMIN';

    const nowIso = paymentDate || new Date().toISOString();
    const nowFormatted = paymentDateFormatted || new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' });

    const payload = {
      event: status === 'SUCCESS' ? 'payment_success' : 'payment_rejected',
      status: status || 'UNKNOWN',
      orderNumber: sanitizeStr(orderNumber, 64) || 'N/A',
      amount: parseFloat(amount) || 0,
      currency: currency === 'USD' ? 'USD' : 'PEN',
      paymentDate: nowIso,
      paymentDateFormatted: nowFormatted,
      nombres: activeNombres,
      apellidos: activeApellidos,
      nombreCompleto: activeFullName,
      dni: activeDni,
      diplomado: activeDiplomado,
      customer: {
        firstName: activeNombres,
        lastName: activeApellidos,
        fullName: activeFullName,
        name: activeFullName,
        email: sanitizeStr(customer?.email, 120) || 'alumno@edumin.pe',
        phone: (customer?.phone ? String(customer.phone).replace(/\D/g, '') : '').slice(0, 15) || '987654321',
        dni: activeDni,
        diplomado: activeDiplomado
      },
      packageName: sanitizeStr(packageName) || 'PROGRAMA DE ESPECIALIZACIÓN EDUMIN',
      mode: mode || 'production',
      errorMessage: errorMessage ? sanitizeStr(errorMessage, 200) : null,
      merchant: {
        name: 'Instituto Técnico Avanza SAC',
        shopId: '74025911'
      },
      paymentData: paymentData || null,
      timestamp: nowIso
    };

    console.log('Enviando notificación a n8n:', { orderNumber: payload.orderNumber, status: payload.status });

    const n8nRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const resText = await n8nRes.text();

    return res.status(200).json({
      success: true,
      notified: n8nRes.ok,
      n8nStatus: n8nRes.status,
      message: 'Notificación procesada con éxito'
    });

  } catch (error) {
    console.error('Error en /api/notify-n8n:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error notificando al servidor de automatización'
    });
  }
}
