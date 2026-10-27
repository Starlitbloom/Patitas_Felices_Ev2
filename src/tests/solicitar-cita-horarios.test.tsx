
/* P13 - Evitar horarios superpuestos */

import { beforeEach, expect, test } from 'vitest'

import {
  crearCita,
  horasOcupadas,
  listarCitas
} from '../services/citasService'

import {
  datosCitaPrueba,
  siguienteDiaSemana
} from './datos-citas'

beforeEach(() => localStorage.clear())

test('P13 - evita reservar citas con horarios superpuestos', () => {

  const cirugia = datosCitaPrueba({
    veterinarioId: 2,
    veterinarioNombre: 'Dr. Matías Contreras',
    servicio: 'Esterilización hembra canina',
    fecha: siguienteDiaSemana(2),
    hora: '10:00'
  })

  const primera = crearCita(cirugia)

  expect(primera.ok).toBe(true)

  expect(
    horasOcupadas(
      cirugia.fecha,
      undefined,
      2,
      cirugia.servicio
    )
  ).toContain('11:00')

  const segunda = crearCita({
    ...cirugia,
    mascota: 'Luna',
    hora: '11:00'
  })

  expect(segunda.ok).toBe(false)
  expect(listarCitas()).toHaveLength(1)
})
