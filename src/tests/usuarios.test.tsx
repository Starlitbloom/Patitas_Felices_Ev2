/* =========================================================
   Prueba P01 — CREATE del módulo de usuarios

   Verifica que crearUsuario agregue correctamente
   un usuario nuevo al sistema.
========================================================= */
import { beforeEach, expect, test } from 'vitest'
import { asegurarDatosIniciales, crearUsuario, listarUsuarios } from '../services/usuariosService'

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

