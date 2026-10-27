/* =========================================================
   Prueba P03 — Vista nueva "Nuestro equipo"
   Archivo probado: src/paginas/EquipoPage.tsx
   (filtros + estado + renderizado condicional)
========================================================= */
import { expect, test } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import EquipoPage from '../paginas/EquipoPage'

test('P03 - FILTRO: en EquipoPage elegir un cargo reduce la lista y sin resultados muestra un mensaje', () => {
  // Datos de prueba
  const cargo = 'Médico veterinario'
  const busquedaSinResultados = 'Zzz'

  render(
    <MemoryRouter>
      <EquipoPage />
    </MemoryRouter>,
  )
  fireEvent.change(screen.getByLabelText('Cargo'), { target: { value: cargo } })

  // El caso indica 3 médicos veterinarios
  expect(screen.getAllByTestId('columna-veterinario').length).toBe(3)
  expect(screen.queryByText('Josefa Medina')).toBe(null) // la recepcionista ya no aparece

  // Se busca un nombre que no existe → mensaje de lista vacía
  fireEvent.change(screen.getByLabelText('Buscar por nombre'), { target: { value: busquedaSinResultados } })
  expect(screen.getByText(/No encontramos profesionales/)).toBeInTheDocument()
})
