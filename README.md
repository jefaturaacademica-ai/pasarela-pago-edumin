# EDUMIN - Pasarela de Pago & Especialización Internacional

Plataforma oficial de recaudo y pagos de matrículas de **EDUMIN** con cobro al contado, financiamiento en cuotas a 30 días, pasarela Izipay (Lyra Network Engine) y generación de links de pago personalizados.

## 🚀 Características Principales

- **Vista Pública para Alumnos**:
  - Consulta de programas subvencionados al 70% (Programa Completo, Full e Ilimitado).
  - Pago al contado (S/ 540, S/ 900, S/ 1500) o Cuota 1 fija.
  - Pasarela Pop-in homologada de **Izipay Perú** (Apple Pay, Tarjetas Visa/Mastercard/Amex, Yape y QR BCP/BBVA).

- **Panel Administradora / Asesora (`/#admin`)**:
  - Acceso privado seguro por contraseña (`edumin2026`).
  - Generación de links de cuotas personalizadas.
  - Cobros con monto libre (ej. S/ 100 o S/ 120) con concepto manual.
  - Seguimiento de alumnos en cuotas con programación automática a 30 días.
  - Envío directo de enlaces por WhatsApp en 1 solo clic.

- **Integración Backend Izipay (Lyra Network Engine)**:
  - Servidor Serverless en `api/create-payment.js` para generación de `formToken` mediante la API REST de Izipay/Lyra (`POST /v1/charge/createPayment`).
  - Consulta la [Guía de Integración Izipay](./IZIPAY_INTEGRATION_GUIDE.md) para conectar tus credenciales de producción en Vercel.

## 📦 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build
```

## 🌐 Despliegue en Vercel

Configurado con `vercel.json` para soporte simultáneo de Serverless Functions `/api` y enrutamiento SPA.
