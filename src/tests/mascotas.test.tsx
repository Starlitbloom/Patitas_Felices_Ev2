/* =========================================================
   Prueba P06 — Catálogo "Mis mascotas" (Fanny Chamorro)
   Archivo probado: src/paginas/MisMascotasPage.tsx
   (filtro por especie + buscador por nombre + mensaje de resultados)
   Se inicia sesión como Maria Calfileo, dueña de 3 mascotas:
   Rocky (perro), Luna y Michi (gatos).
========================================================= */

// Herramientas de Vitest: beforeEach (se repite antes de cada prueba), expect (comprobar) y test (definir una prueba)
import { beforeEach, expect, test } from 'vitest'
// Herramientas de Testing Library: fireEvent (simular clics y escritura) y screen (buscar cosas en la pantalla)
import { fireEvent, screen } from '@testing-library/react'
// Ayudante de tu compañera: dibuja la página con enrutador y sesión, como en la app real
import { renderConApp } from './utils'
// Carga las 6 mascotas iniciales en localStorage
import { asegurarDatosInicialesMascotas } from '../services/mascotasService'
// Guarda la sesión iniciada (simula que alguien hizo login)
import { guardarSesion } from '../services/sesionService'
// Carga los usuarios iniciales y permite buscar uno por su id
import { asegurarDatosIniciales, obtenerUsuarioPorId } from '../services/usuariosService'
// La página que se va a probar
import MisMascotasPage from '../paginas/MisMascotasPage'

// Esto se ejecuta antes de cada prueba, para partir siempre con los mismos datos
beforeEach(() => {
  asegurarDatosIniciales() // usuarios iniciales (para poder iniciar sesión)
  asegurarDatosInicialesMascotas() // las 6 mascotas iniciales
  guardarSesion(obtenerUsuarioPorId('admin-maria')!) // inicia sesión como Maria, la dueña
})

// Definición de la prueba: el texto es el nombre que aparecerá en el informe
test('P06 - FILTRO: en Mis mascotas elegir una especie o buscar por nombre reduce la lista', () => {
  // Datos de prueba
  const textoSinResultados = 'Zzz' // un nombre que no existe, para probar la lista vacía

  // Dibuja la página en una pantalla simulada
  renderConApp(<MisMascotasPage />)
  // Sin filtros, la página debe decir que hay 3 mascotas (las de Maria)
  expect(screen.getByText('3 mascotas encontradas')).toBeInTheDocument()

  // Por especie: solo quedan los gatos
  // Simula un clic en el botón "Gatos"
  fireEvent.click(screen.getByRole('button', { name: 'Gatos' }))
  // El contador ahora debe decir 2 (Luna y Michi)
  expect(screen.getByText('2 mascotas encontradas')).toBeInTheDocument()
  // Luna debe seguir visible porque es gata
  expect(screen.getByText('Luna')).toBeInTheDocument()
  // Rocky ya no debe aparecer (queryByText devuelve null si no lo encuentra)
  expect(screen.queryByText('Rocky')).toBe(null) // Rocky es perro

  // Por nombre inexistente: no queda ninguna
  // Simula escribir "Zzz" en el buscador por nombre
  fireEvent.change(screen.getByLabelText('Buscar mascota por nombre'), { target: { value: textoSinResultados } })
  // El contador debe decir 0
  expect(screen.getByText('0 mascotas encontradas')).toBeInTheDocument()
})