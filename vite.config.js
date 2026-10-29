import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

function apiPlugin() {
  const handleApi = (req, res, next) => {
    if (!req.url.startsWith('/api/')) return next();

    const endpoint = req.url.split('?')[0].replace(/^\/api\//, '');
    try {
      const chunks = [];
      req.on('data', chunk => chunks.push(chunk));
      req.on('end', async () => {
        let body = {};
        try {
          const raw = Buffer.concat(chunks).toString();
          if (raw) body = JSON.parse(raw);
        } catch (e) {}

        const fakeReq = {
          method: req.method,
          headers: req.headers,
          body,
          query: Object.fromEntries(new URL(req.url, 'http://localhost').searchParams)
        };

        const fakeRes = {
          statusCode: 200,
          setHeader: (k, v) => res.setHeader(k, v),
          status: function(code) {
            this.statusCode = code;
            return this;
          },
          json: function(data) {
            res.statusCode = this.statusCode;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          },
          end: function(data) {
            res.statusCode = this.statusCode;
            res.end(data);
          }
        };

        try {
          const filePath = path.resolve(process.cwd(), 'api', `${endpoint}.js`);
          const fileUrl = pathToFileURL(filePath).href;
          const mod = await import(fileUrl);
          if (mod && mod.default) {
            await mod.default(fakeReq, fakeRes);
          } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: `No handler found for /api/${endpoint}` }));
          }
        } catch (importErr) {
          console.error(`Error loading API endpoint /api/${endpoint}:`, importErr);
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: `Not found: ${importErr.message}` }));
        }
      });
    } catch (err) {
      console.error(`Error handling /api/${endpoint}:`, err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: err.message }));
    }
  };

  return {
    name: 'vite-api-server-middleware',
    configureServer(server) {
      server.middlewares.use(handleApi);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handleApi);
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    apiPlugin(),
  ],
})
