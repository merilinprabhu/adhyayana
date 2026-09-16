import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const apkMimePlugin = () => ({
  name: 'apk-mime-plugin',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url && req.url.includes('.apk')) {
        res.setHeader('Content-Type', 'application/vnd.android.package-archive')
        res.setHeader('Content-Disposition', 'attachment; filename="Adhyayana.apk"')
      }
      next()
    })
  }
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apkMimePlugin()],
})
