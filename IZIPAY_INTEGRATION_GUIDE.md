# 🚀 Guía de Integración Izipay Perú (Lyra Network Engine)

Esta guía explica la arquitectura de integración con **Izipay Online (Perú)** basada en el estándar oficial de **Lyra Network** (`webview-payment-sparkjava-integration-sample`).

---

## 🛠️ 1. Arquitectura de Integración (Flujo Tokenizado)

La integración oficial de Izipay mediante el motor de **Lyra / MiCuentaWeb** sigue un flujo seguro en 2 pasos:

```
[Cliente React / Navegador]
       │
       │ 1. Solicita Token (POST /api/create-payment)
       ▼
[Backend Vercel Serverless] ───(Basic Auth API Key)───► [Servidor REST Izipay]
       │                                                         │
       │ 2. Devuelve formToken                                   │ 3. Retorna formToken
       ◄─────────────────────────────────────────────────────────┘
       │
       │ 4. Carga Formulario Izipay / Pop-in con formToken
       ▼
[Modal de Pago Izipay en Pantalla]
```

### ¿Por qué se usa un `formToken`?
Por seguridad PCI-DSS compliance, las tarjetas de crédito jamás tocan tu servidor frontend ni backend. El servidor de Izipay genera una sesión de pago temporal (`formToken`) firmada con tus llaves secretas.

---

## 🔑 2. Variables de Entorno en Vercel

Cuando Izipay te entregue las credenciales de Producción o Sandbox, simplemente agrégalas en **Vercel -> Settings -> Environment Variables**:

| Nombre de Variable | Descripción | Ejemplo / Formato |
| :--- | :--- | :--- |
| `IZIPAY_USERNAME` | Identificador de Tienda / Site ID | `87654321` |
| `IZIPAY_PASSWORD` | Clave Secreta de API (Test / Prod) | `testpassword_12345ABC...` |
| `IZIPAY_PUBLIC_KEY` | Llave Pública de JavaScript SDK | `87654321:publickey_XYZ...` |
| `IZIPAY_ENDPOINT` | Endpoint Servidor REST (Opcional) | `https://api.micuentaweb.pe` |

> 💡 **Nota:** Si no configuras las variables en Vercel, la aplicación funcionará automáticamente en **Modo Demostración / Simulación**, permitiéndote probar toda la interfaz y flujos sin errores.

---

## 💻 3. Archivos Clave Implementados

1. **`api/create-payment.js`**:
   - Función Serverless en Node.js de Vercel.
   - Realiza la llamada HTTP segura `POST /v1/charge/createPayment` con Basic Authentication a Izipay.
   - Recibe el monto en Soles (`S/ 540.00`), lo convierte a centavos (`54000`) y retorna el `formToken`.

2. **`src/utils/izipayService.js`**:
   - Servicio helper en React para interactuar con la API `/api/create-payment`.
   - Incluye cargador dinámico del SDK de JavaScript de Izipay (`kws.bootstrap.min.js`).

3. **`src/components/IzipayCheckoutModal.jsx`**:
   - Modal Pop-in oficial con diseño idéntico a las capturas de Izipay Perú.
   - Soporta tanto el **Formulario Interactivo Visual** como el **SDK de Izipay en vivo**.

---

## 🧪 4. Pruebas y Verificación

1. **Subir cambios a Vercel**:
   ```bash
   git add .
   git commit -m "feat: integrar cliente REST API Izipay y Serverless Token generation"
   git push origin main
   ```

2. **Verificar desplegado**:
   - Ingresa a [https://edumin-pasarela-pago.vercel.app/](https://edumin-pasarela-pago.vercel.app/)
   - Selecciona **Comprar Paquete** -> Completo / Full / Ilimitado.
   - Haz clic en **Pagar con Izipay**.
