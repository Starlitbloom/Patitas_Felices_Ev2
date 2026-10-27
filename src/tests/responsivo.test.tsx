/* =========================================================
   verificar que el componente tenga las clases responsivas de Bootstrap
   y que la prueba detecte si alguien elimina una de ellas.
   Archivo probado: src/componentes/organismos/GrillaEquipo.tsx
========================================================= */
import { test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { GrillaEquipo } from '../componentes/organismos/GrillaEquipo'
import { listarVeterinarios } from '../services/veterinariosService'

test('RESPONSIVO: GrillaEquipo usa las clases col-12, col-md-6 y col-lg-4 en cada tarjeta', () => {
  // Datos de prueba: los 5 integrantes del equipo (3 médicos, 1 técnico, 1 recepcionista)
  const veterinarios = listarVeterinarios()

  // Mostramos la grilla (MemoryRouter porque las tarjetas tienen enlaces "Ver perfil")
  render(
    <MemoryRouter>
      <GrillaEquipo veterinarios={veterinarios} />
    </MemoryRouter>,
  )

  // Buscamos las columnas de la grilla
  const columnas = screen.getAllByTestId('columna-veterinario')
  expect(columnas.length).toBe(5)

  // Comprobamos las clases responsivas en cada columna:
  // col-12 → 1 por fila en celular · col-md-6 → 2 en tablet · col-lg-4 → 3 en computador
  for (const columna of columnas) {
    expect(columna).toHaveClass('col-12')
    expect(columna).toHaveClass('col-md-6')
    expect(columna).toHaveClass('col-lg-4')
  }
})