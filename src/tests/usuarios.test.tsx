/* =========================================================
   Pruebas P01 y P02 — CRUD del módulo de usuarios
   P01: CREATE en la fuente de datos (src/services/usuariosService.ts)
   P02: DELETE desde la interfaz del panel (src/paginas/admin/UsuariosPage.tsx)
   Antes de cada prueba se cargan los 8 usuarios iniciales
   (2 administradoras + 1 recepcionista + 5 clientes de src/data/usuariosIniciales.ts).
========================================================= */
import { beforeEach, expect, test } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { renderConApp } from './utils'
import { asegurarDatosIniciales, crearUsuario, listarUsuarios, obtenerUsuarioPorId } from '../services/usuariosService'
import { guardarSesion } from '../services/sesionService'
import UsuariosPage from '../paginas/admin/UsuariosPage'
import type { NuevoUsuario } from '../types/usuario'

beforeEach(() => {
  asegurarDatosIniciales()
})

test('P01 - CREATE: crearUsuario agrega un usuario nuevo a la lista', () => {
  // Datos de prueba
  const usuarioNuevo: NuevoUsuario = {
    run: '20987654-K',
    nombre: 'Ignacia',
    apellidos: 'Pino',
    correo: 'ignacia.pino@gmail.com',
    password: 'hola1234',
    telefono: '',
    region: 'Valparaíso',
    comuna: 'Quilpué',
    direccion: 'Los Carrera 12',
    rol: 'cliente',
    activo: true,
  }

  const resultado = crearUsuario(usuarioNuevo)

  expect(resultado.ok).toBe(true)
  expect(listarUsuarios().length).toBe(9) // 8 iniciales + 1 nuevo
  expect(listarUsuarios().some((u) => u.correo === 'ignacia.pino@gmail.com')).toBe(true)
})

test('P02 - DELETE: eliminar un usuario con confirmación lo quita de la tabla y de los datos', () => {
  // Datos de prueba: usuario a eliminar
  const nombreCompleto = 'Benjamín Soto Pérez'
  const correo = 'be.soto@duoc.cl'

  guardarSesion(obtenerUsuarioPorId('admin-maria')!) // sesión de administradora
  renderConApp(<UsuariosPage />)
  expect(screen.getByText(correo)).toBeInTheDocument() // antes: está en la tabla

  fireEvent.click(screen.getByRole('button', { name: `Eliminar a ${nombreCompleto}` }))
  const confirmacion = screen.getByRole('dialog', { name: 'Eliminar usuario' })
  fireEvent.click(within(confirmacion).getByRole('button', { name: 'Eliminar' }))

  expect(screen.queryByText(correo)).toBe(null) // después: ya no está en la tabla
  expect(obtenerUsuarioPorId('cli-002')).toBe(null) // y tampoco en localStorage
})
