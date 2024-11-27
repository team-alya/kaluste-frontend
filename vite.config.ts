import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mkcert()],
  server: {
    https: {
      key: undefined,  // You can specify the key here if needed
      cert: undefined, // You can specify the certificate here if needed
    },
  },
})
