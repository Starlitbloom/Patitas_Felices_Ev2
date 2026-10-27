
/* P11 - Registrar una cita veterinaria */

import { beforeEach, expect, test } from 'vitest'
import {
  crearCita,
  listarCitasUsuario
} from '../services/citasService'

import {
  obtenerServicioCita
} from '../services/catalogoCitasService'

import { datosCitaPrueba } from './datos-citas'

beforeEach(() => localStorage.clear())

test('P11 - registra una cita veterinaria correctamente', () => {
  const resultado = crearCita(datosCitaPrueba())

  expect(resultado.ok).toBe(true)
  if (!resultado.ok) return

  expect(resultado.dato.estado).toBe('Pendiente')
  expect(resultado.dato.duracionMinutos).toBe(30)

  expect(
    listarCitasUsuario('CLIENTE@EJEMPLO.CL')
  ).toHaveLength(1)

  expect(
    obtenerServicioCita('Consulta general')?.precioCLP
  ).toBe(15000)
})
