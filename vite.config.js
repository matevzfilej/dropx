import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  // If deploying to https://<user>.github.io/<repo>/ uncomment the next line and set to '/<repo>/'
  // base: '/dropx-web/'
})
