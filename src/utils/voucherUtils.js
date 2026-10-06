/**
 * Utility to generate and trigger printing/saving of official EDUMIN Payment Voucher
 */
export function printPaymentVoucher(txData) {
  const printWindow = window.open('', '_blank', 'width=800,height=900');
  if (!printWindow) {
    alert('Por favor permite las ventanas emergentes en tu navegador para ver el voucher.');
    return;
  }

  const logoUrl = "https://raw.githubusercontent.com/videoconferenciasdiplomado-alt/imagenes/main/logo/logo%20blanco.png";
  const now = txData.dateFormatted || txData.createdDate || new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' });

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>Voucher de Confirmación de Pago - EDUMIN</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #0f172a; }
        .voucher-card { max-width: 550px; margin: 0 auto; background: #ffffff; border-radius: 20px; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px rgba(0,0,0,0.08); overflow: hidden; }
        .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; padding: 25px; text-align: center; position: relative; }
        .logo { height: 42px; margin-bottom: 8px; }
        .subtitle { font-size: 11px; text-transform: uppercase; tracking: 1px; color: #38bdf8; font-weight: 700; margin: 0; }
        .status-badge { display: inline-block; background: #10b981; color: #ffffff; font-size: 11px; font-weight: 900; text-transform: uppercase; padding: 4px 12px; border-radius: 50px; margin-top: 10px; }
        .body { padding: 25px; }
        .info-row { display: flex; justify-content: space-between; border-bottom: 1px dashed #e2e8f0; padding: 10px 0; font-size: 13px; }
        .info-label { color: #64748b; font-weight: 600; }
        .info-val { font-weight: 700; color: #0f172a; text-align: right; }
        .amount-box { background: #ecfdf5; border: 1px solid #a7f3d0; padding: 15px; border-radius: 12px; text-align: center; margin: 20px 0 10px 0; }
        .amount-label { font-size: 11px; color: #047857; text-transform: uppercase; font-weight: 700; }
        .amount-val { font-size: 24px; color: #059669; font-weight: 900; }
        .footer { background: #f1f5f9; padding: 15px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; }
        .print-btn { display: block; width: 100%; padding: 12px; background: #00a499; color: #ffffff; font-weight: 800; border: none; border-radius: 12px; font-size: 13px; cursor: pointer; margin-top: 15px; text-transform: uppercase; }
        @media print { .print-btn { display: none; } }
      </style>
    </head>
    <body>
      <div class="voucher-card">
        <div class="header">
          <img src="${logoUrl}" class="logo" alt="EDUMIN Logo" />
          <p class="subtitle">Comprobante Oficial de Confirmación de Pago</p>
          <div class="status-badge">✓ TRANSACCIÓN APROBADA - IZIPAY</div>
        </div>

        <div class="body">
          <div class="amount-box">
            <div class="amount-label">Monto Total Pagado</div>
            <div class="amount-val">S/ ${Number(txData.amount || 540).toFixed(2)} PEN</div>
          </div>

          <div class="info-row">
            <span class="info-label">N° de Pedido / Orden:</span>
            <span class="info-val" style="color: #d97706; font-family: monospace;">${txData.orderNumber || txData.id || 'IZI-849201'}</span>
          </div>

          <div class="info-row">
            <span class="info-label">Alumno Matriculado:</span>
            <span class="info-val">${txData.clientName || `${txData.firstName || ''} ${txData.lastName || ''}`.trim() || 'Alumno EDUMIN'}</span>
          </div>

          <div class="info-row">
            <span class="info-label">DNI / Documento:</span>
            <span class="info-val">${txData.dni || 'Sin DNI'}</span>
          </div>

          ${txData.diplomado ? `
          <div class="info-row">
            <span class="info-label">Diplomado Elegido:</span>
            <span class="info-val" style="color: #00a499;">${txData.diplomado}</span>
          </div>
          ` : ''}

          <div class="info-row">
            <span class="info-label">Programa / Paquete:</span>
            <span class="info-val">${txData.packageName || 'PROGRAMA COMPLETO'}</span>
          </div>

          <div class="info-row">
            <span class="info-label">Tipo de Comprobante:</span>
            <span class="info-val">${txData.invoiceType === 'factura' ? `FACTURA ELECTRÓNICA (RUC: ${txData.ruc || ''})` : 'BOLETA DE VENTA ELECTRÓNICA'}</span>
          </div>

          <div class="info-row">
            <span class="info-label">Pasarela / Banco:</span>
            <span class="info-val">Izipay Online Perú (SSL Aprobado)</span>
          </div>

          <div class="info-row">
            <span class="info-label">Comercio Emisor:</span>
            <span class="info-val">Instituto Técnico Avanza SAC</span>
          </div>

          <div class="info-row" style="border-bottom: none;">
            <span class="info-label">Fecha y Hora de Emisión:</span>
            <span class="info-val">${now}</span>
          </div>

          <button onclick="window.print()" class="print-btn">🖨️ Imprimir o Guardar en PDF</button>
        </div>

        <div class="footer">
          EDUMIN • Centro de Capacitación Especializado en Minería<br/>
          Soporte y Atención Académica por WhatsApp: +51 951 101 765 / +51 987 423 200
        </div>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
