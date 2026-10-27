/* =========================================================
   Prueba P09 — DELETE en el panel de mascotas
   Archivo probado: src/paginas/admin/MascotasPage.tsx
   (confirmación antes de eliminar + borrado en localStorage)
   Antes de la prueba se cargan las 6 mascotas iniciales
   (src/data/mascotasIniciales.ts).
========================================================= */

// Herramientas de Vitest: beforeEach (se repite antes de cada prueba), expect (comprobar) y test (definir una prueba)
import { beforeEach, expect, test } from 'vitest'
// fireEvent: simula clics; screen: busca cosas en la pantalla; within: busca solo dentro de un elemento
import { fireEvent, screen, within } from '@testing-library/react'
// Ayudante de tu compañera: dibuja la página con enrutador y sesión, como en la app real
import { renderConApp } from './utils'
// Carga las 6 mascotas iniciales y permite leer una mascota guardada por su id
import { asegurarDatosInicialesMascotas, obtenerMascotaPorId } from '../services/mascotasService'
// La página del panel de administración que se va a probar
import MascotasPage from '../paginas/admin/MascotasPage'

// Esto se ejecuta antes de cada prueba, para partir siempre con los mismos datos
beforeEach(() => {
  asegurarDatosInicialesMascotas() // las 6 mascotas iniciales
})

// Definición de la prueba: el texto es el nombre que aparecerá en el informe
test('P09 - DELETE: eliminar una mascota con confirmación la quita de la tabla y de los datos', () => {
  // Dibuja el panel en una pantalla simulada
  renderConApp(<MascotasPage />)
  // La página tiene 3 tablas (solicitudes, mascotas e historial): la de mascotas es la segunda
  const tabla = within(screen.getAllByRole('table')[1])
  // Antes de eliminar, Rocky debe estar en la tabla
  expect(tabla.getByText('Rocky')).toBeInTheDocument()

  // Simula un clic en el botón "Eliminar" de Rocky
  fireEvent.click(screen.getByRole('button', { name: 'Eliminar a Rocky' }))
  // Debe abrirse una ventana que pide confirmar
  const confirmacion = screen.getByRole('dialog', { name: 'Eliminar mascota' })
  // Todavía no se borró nada: Rocky sigue guardado
  expect(obtenerMascotaPorId('rocky')).not.toBe(null)

  // Simula un clic en el botón "Eliminar" dentro de la ventana de confirmación
  fireEvent.click(within(confirmacion).getByRole('button', { name: 'Eliminar' }))

  // Después de confirmar, Rocky ya no debe estar en la tabla (queryByText devuelve null si no lo encuentra)
  expect(tabla.queryByText('Rocky')).toBe(null)
  // Y tampoco en localStorage
  expect(obtenerMascotaPorId('rocky')).toBe(null)
})