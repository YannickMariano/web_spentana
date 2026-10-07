import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// En développement (`npm run dev`), sert les fonctions serveur de `api/`
// (ex. /api/chat) comme le ferait Vercel en production : plus besoin de
// `vercel dev`. Les variables de `.env` (dont GEMINI_API_KEY) sont chargées
// côté serveur uniquement, jamais envoyées au navigateur.
function localApi() {
  return {
    name: 'local-api',
    apply: 'serve',
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), '')
      for (const [key, value] of Object.entries(env)) {
        if (process.env[key] === undefined) process.env[key] = value
      }

      server.middlewares.use('/api', async (req, res, next) => {
        const route = req.url.split('?')[0].replace(/^\/+|\/+$/g, '')
        if (!/^[a-z0-9-]+$/i.test(route)) return next()

        let handler
        try {
          handler = (await server.ssrLoadModule(`/api/${route}.js`)).default
        } catch {
          return next()
        }

        // Corps JSON, comme `req.body` sur Vercel.
        let raw = ''
        for await (const chunk of req) raw += chunk
        try {
          req.body = raw ? JSON.parse(raw) : {}
        } catch {
          req.body = {}
        }

        // Petites aides `res.status().json()` de Vercel.
        res.status = (code) => {
          res.statusCode = code
          return res
        }
        res.json = (data) => {
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify(data))
          return res
        }

        try {
          await handler(req, res)
        } catch (error) {
          server.config.logger.error(String(error?.stack ?? error))
          if (!res.headersSent) res.status(500).json({ error: 'Erreur serveur' })
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), localApi()],
})
