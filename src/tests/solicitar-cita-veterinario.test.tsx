
/* P12 - Validar veterinario compatible */

import { beforeEach, expect, test } from 'vitest'

import {
  crearCita,
  listarCitas
} from '../services/citasService'

import { datosCitaPrueba } from './datos-citas'

beforeEach(() => localStorage.clear())

test('P12 - rechaza un veterinario incompatible con el servicio', () => {

  const resultado = crearCita(
    datosCitaPrueba({
      servicio: 'Vacuna antirrábica canina'
    })
  )

  expect(resultado.ok).toBe(false)

  if (resultado.ok) return

  expect(resultado.campo).toBe('servicio')
  expect(listarCitas()).toHaveLength(0)
})
