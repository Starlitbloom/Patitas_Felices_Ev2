/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuración de Vite + Vitest en un solo archivo.
// - plugins: habilita JSX/TSX y el refresco rápido de React.
// - test: configuración de Vitest (entorno jsdom para simular el navegador).
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // permite usar describe/it/expect sin importarlos
    environment: 'jsdom', // simula window, document y localStorage
    setupFiles: './src/setupTests.ts', // se ejecuta antes de cada archivo de pruebas
    css: false, // las pruebas no necesitan procesar CSS
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'], // resumen en consola + reporte HTML en /coverage
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/main.tsx', // solo monta la app
        'src/vite-env.d.ts',
        'src/setupTests.ts',
        'src/**/*.test.{ts,tsx}',
        'src/tests/**', // ayudantes de las pruebas
        'src/types/**', // solo declaraciones de tipos, sin lógica
        'src/data/regiones.ts', // catálogo estático
      ],
    },
  },
})
