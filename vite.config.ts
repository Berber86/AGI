import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  server: {
    host: '0.0.0.0',
    port: 5173,
    // @ts-ignore allow all hosts for Arena preview
    allowedHosts: true as any,
    hmr: {
      clientPort: 443
    },
    cors: true
  },
  preview: {
    host: '0.0.0.0',
    port: 4173
  }
})
