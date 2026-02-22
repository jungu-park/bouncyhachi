import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'serve-static-html',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && (req.url.startsWith('/tools/') || req.url.startsWith('/games/') || req.url.startsWith('/fortune/')) && !req.url.includes('.')) {
            if (!req.url.endsWith('/')) {
              res.writeHead(301, { Location: req.url + '/' })
              res.end()
              return
            }
          }
          next()
        })
      }
    },
    {
      name: 'inject-adsense',
      enforce: 'post',
      apply: 'build',
      closeBundle() {
        const distDir = path.resolve(__dirname, 'dist')
        if (!fs.existsSync(distDir)) return

        const adsenseCode = `\n    <meta name="google-adsense-account" content="ca-pub-6892417081710938">\n    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6892417081710938" crossorigin="anonymous"></script>\n  </head>`

        const processDirectory = (dir: string) => {
          const files = fs.readdirSync(dir)
          for (const file of files) {
            const filePath = path.join(dir, file)
            const stat = fs.statSync(filePath)
            if (stat.isDirectory()) {
              processDirectory(filePath)
            } else if (file === 'index.html') {
              let html = fs.readFileSync(filePath, 'utf-8')
              if (!html.includes('ca-pub-6892417081710938')) {
                html = html.replace('</head>', adsenseCode)
                fs.writeFileSync(filePath, html)
              }
            }
          }
        }
        processDirectory(distDir)
      }
    }
  ],
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
})
