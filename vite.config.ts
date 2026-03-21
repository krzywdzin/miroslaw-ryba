import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import http from 'node:http'
import { execSync } from 'node:child_process'

function dockerProxyPlugin(): Plugin {
  return {
    name: 'docker-api-proxy',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/docker-api/')) return next()

        const path = req.url.replace('/docker-api', '')

        // Compose controls via child_process
        if (req.method === 'POST' && path === '/compose/up') {
          try {
            execSync('docker compose -f ./mirofish/docker-compose.yml up -d', {
              timeout: 30000,
            })
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ ok: true }))
          } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(
              JSON.stringify({
                error: err instanceof Error ? err.message : 'compose up failed',
              })
            )
          }
          return
        }

        if (req.method === 'POST' && path === '/compose/down') {
          try {
            execSync('docker compose -f ./mirofish/docker-compose.yml down', {
              timeout: 30000,
            })
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ ok: true }))
          } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(
              JSON.stringify({
                error:
                  err instanceof Error ? err.message : 'compose down failed',
              })
            )
          }
          return
        }

        // Forward all other requests to Docker socket
        const options: http.RequestOptions = {
          socketPath: '/var/run/docker.sock',
          path,
          method: req.method,
          headers: req.headers,
        }

        const proxyReq = http.request(options, (proxyRes) => {
          res.writeHead(proxyRes.statusCode ?? 500, proxyRes.headers)
          proxyRes.pipe(res)
        })

        proxyReq.on('error', () => {
          res.writeHead(503, { 'Content-Type': 'application/json' })
          res.end(
            JSON.stringify({
              error: 'Docker socket not available',
            })
          )
        })

        req.pipe(proxyReq)
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), dockerProxyPlugin()],
  server: {
    port: parseInt(process.env.VITE_PORT || '5173'),
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.BACKEND_PORT || '5050'}`,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
