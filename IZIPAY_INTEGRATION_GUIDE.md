# 🚀 Guía de Integración Izipay Perú (Instituto Técnico Avanza SAC)

Esta guía documenta la integración de la pasarela de pagos **Izipay Online Perú (Lyra Network V4 Engine)** para el comercio **Instituto Técnico Avanza SAC (ID: 500008234 / Usuario: 74025911)**.

---

## 🔑 Credenciales Sincronizadas del Back Office Vendedor

| Parámetro | Entorno de TEST (Pruebas) | Entorno de PRODUCCIÓN |
| :--- | :--- | :--- |
| **Usuario API REST** | `74025911` | `74025911` |
| **Contraseña API REST** | `testpassword_Ocqpw5nlHREDJikgqvxDsoeUWcaZ0JGvdKFJC02Arg50C` | `prodpassword_Vy6dFo4zqtRw5hcArFK3OJLulkeLy8ZcwGkMA9cGWST6e` |
| **Clave Pública JS** | `74025911:testpublickey_1L5AjIZ7vATPByuE2QQxDD8lsm5zd9pIWqnKUF4eJHcJ` | `74025911:publickey_1CQKXa0PBgF9WaUgdifdq74GsfJ5loyKKHQvBalFPOXuf` |
| **Clave HMAC-SHA-256 (IPN)** | `D19YeRz2gfwmyfiX0h5UyOsvcbmuykAQyNMQqXHM5UFI7` | `mR2JvdcDWB7iHR6s4IMYI4UAwh3Fc7qNwTt7Ip0YVBN9` |
| **Endpoint REST API** | `https://api.micuentaweb.pe` | `https://api.micuentaweb.pe` |
| **URL JavaScript Client V4** | `https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js` | Same |

---

## 🛠️ Flujo de Operación Integrado

```
[Cliente EDUMIN React]
       │
       │ 1. POST /api/create-payment (amount: 54000)
       ▼
[Serverless Function Node.js] ───(Basic Auth 74025911:password)───► [Izipay REST API V4]
       │                                                                  │
       │ 2. Devuelve formToken real                                       │ 3. Genera formToken
       ◄──────────────────────────────────────────────────────────────────┘
       │
       │ 4. Inicializa Pop-in SDK con formToken y kr-public-key
       ▼
[Modal de Pago Izipay Oficial] ───(Pago Exitoso)───► [IPN Webhook /api/validate-payment]
                                                             │
                                                             └─► Verifica Firma HMAC-SHA-256
```

---

## 🌐 Endpoints de API Implementados

1. **`POST /api/create-payment`**:
   - Genera el `formToken` de sesión interactiva enviando el monto en centavos (`S/ 540.00` = `54000`).
   - Admite el parámetro `"mode": "test"` o `"mode": "production"`.

2. **`POST /api/validate-payment`**:
   - Valida el `kr-hash` retornado por Izipay calculando la firma HMAC-SHA-256 usando la clave HMAC oficial.

---

## 🧪 Pruebas con Tarjetas de Test Izipay

Para realizar compras de prueba en entorno **TEST**:
- **Número de Tarjeta**: Usar tarjetas de prueba autorizadas por Izipay/Visa (ej. `4557 8910 2938 4819`).
- **Fecha de Expiración**: Cualquier fecha futura (ej. `12/28`).
- **CVV**: `123` o `891`.
