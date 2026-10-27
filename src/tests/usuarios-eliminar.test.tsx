
/* P02 - Eliminar usuario con confirmación */

import { beforeEach, expect, test } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'

import { renderConApp } from './utils'

import {
  asegurarDatosIniciales,
  obtenerUsuarioPorId
} from '../services/usuariosService'

import { guardarSesion } from '../services/sesionService'
import UsuariosPage from '../paginas/admin/UsuariosPage'

beforeEach(() => {
  asegurarDatosIniciales()
})

test(
  'P02 - DELETE: eliminar un usuario con confirmación lo quita de la tabla y de los datos',
  () => {

    const nombreCompleto = 'Benjamín Soto Pérez'
    const correo = 'be.soto@duoc.cl'

    guardarSesion(
      obtenerUsuarioPorId('admin-maria')!
    )

    renderConApp(<UsuariosPage />)

    expect(
      screen.getByText(correo)
    ).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', {
        name: `Eliminar a ${nombreCompleto}`
      })
    )

    const confirmacion = screen.getByRole('dialog', {
      name: 'Eliminar usuario'
    })

    fireEvent.click(
      within(confirmacion).getByRole('button', {
        name: 'Eliminar'
      })
    )

    expect(
      screen.queryByText(correo)
    ).toBe(null)

    expect(
      obtenerUsuarioPorId('cli-002')
    ).toBe(null)

  }
)
