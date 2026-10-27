
/* =========================================================
   Prueba P03 — Vista "Nuestro equipo"

   Verifica:
   1. Que el filtro por cargo muestre los profesionales correctos.
   2. Que una búsqueda sin resultados muestre un mensaje.
   3. Que las tarjetas tengan las clases responsivas
      para celulares, tablets y computadores.
========================================================= */

import { expect, test } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import EquipoPage from '../paginas/EquipoPage'

test('P03 - FILTRO Y RESPONSIVIDAD: filtrar profesionales y verificar diseño responsivo', () => {

  // Datos de prueba
  const cargo = 'Médico veterinario'
  const busquedaSinResultados = 'Zzz'

  // Renderizar la página del equipo
  render(
    <MemoryRouter>
      <EquipoPage />
    </MemoryRouter>,
  )

  // 1. COMPROBAR RESPONSIVIDAD

  const columnasIniciales =
    screen.getAllByTestId('columna-veterinario')

  // Deben mostrarse los 5 integrantes del equipo
  expect(columnasIniciales).toHaveLength(5)

  // Verificar clases de Bootstrap
  for (const columna of columnasIniciales) {
    expect(columna).toHaveClass('col-12')
    expect(columna).toHaveClass('col-md-6')
    expect(columna).toHaveClass('col-lg-4')
  }

  // 2. COMPROBAR FILTRO POR CARGO

  fireEvent.change(
    screen.getByLabelText('Cargo'),
    { target: { value: cargo } }
  )

  // Deben quedar solamente los 3 médicos veterinarios
  expect(
    screen.getAllByTestId('columna-veterinario')
  ).toHaveLength(3)

  // La recepcionista no debe aparecer
  expect(
    screen.queryByText('Josefa Medina')
  ).toBe(null)

  // 3. COMPROBAR BÚSQUEDA SIN RESULTADOS

  fireEvent.change(
    screen.getByLabelText('Buscar por nombre'),
    { target: { value: busquedaSinResultados } }
  )

  // Debe mostrarse el mensaje correspondiente
  expect(
    screen.getByText(/No encontramos profesionales/)
  ).toBeInTheDocument()

})
