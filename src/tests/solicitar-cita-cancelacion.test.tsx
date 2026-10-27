
/* P14 - Cancelar una cita y liberar el horario */

import { beforeEach, expect, test } from 'vitest'

import {
  actualizarCita,
  crearCita,
  horasOcupadas,
  listarCitas
} from '../services/citasService'

import { datosCitaPrueba } from './datos-citas'

beforeEach(() => localStorage.clear())

test('P14 - cancela una cita y libera el horario', () => {

  const datos = datosCitaPrueba()
  const creada = crearCita(datos)

  expect(creada.ok).toBe(true)
  if (!creada.ok) return

  expect(
    horasOcupadas(
      datos.fecha,
      undefined,
      1,
      datos.servicio
    )
  ).toContain('10:00')

  const cancelada = actualizarCita(creada.dato.id, {
    estado: 'Cancelada'
  })

  expect(cancelada.ok).toBe(true)

  expect(
    horasOcupadas(
      datos.fecha,
      undefined,
      1,
      datos.servicio
    )
  ).not.toContain('10:00')

  const nuevaReserva = crearCita(
    datosCitaPrueba({
      mascota: 'Luna'
    })
  )

  expect(nuevaReserva.ok).toBe(true)
  expect(listarCitas()).toHaveLength(2)
})
