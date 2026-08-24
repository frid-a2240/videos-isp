import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  // Vercel sirve la app en la raíz del dominio, IIS la sirve en /induccion/
  base: mode === 'iis' ? '/induccion/' : '/',
  plugins: [react()],
  server: {
    host: true  // ← agrega esta línea
  }
}))