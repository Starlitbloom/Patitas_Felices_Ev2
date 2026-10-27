// Archivo de preparación de las pruebas (lo carga Vitest antes de cada test).
// Agrega los "matchers" de jest-dom: toBeInTheDocument, toHaveClass, toBeDisabled, etc.
import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup() // desmonta lo renderizado
  localStorage.clear() // cada prueba parte con el almacenamiento vacío
})

// jsdom no implementa window.scrollTo (lo usa PlantillaPublica al cambiar de página):
// se reemplaza por una función simulada (mock) que no hace nada.
window.scrollTo = vi.fn() as unknown as typeof window.scrollTo
