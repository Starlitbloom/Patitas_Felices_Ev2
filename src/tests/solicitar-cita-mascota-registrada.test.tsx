
/* P15 - Evitar fichas duplicadas de mascotas */

import { beforeEach, expect, test } from 'vitest'

import {
  registrarMascotaDesdeCita
} from '../services/registroMascotaCitaService'

import {
  listarMascotasPorDueno
} from '../services/mascotasService'

beforeEach(() => localStorage.clear())

test('P15 - evita duplicar la ficha de una mascota registrada', () => {

  const datos = {
    nombre: 'Oso',
    especie: 'Perro' as const,
    edad: '3 años',
    dueño: 'Camila González',
    correoDueño: 'cliente@ejemplo.cl'
  }

  const primera = registrarMascotaDesdeCita(datos)

  const segunda = registrarMascotaDesdeCita({
    ...datos,
    nombre: '  OSO ',
    correoDueño: 'CLIENTE@EJEMPLO.CL'
  })

  expect(segunda.id).toBe(primera.id)
  expect(primera.completo).toBe(false)

  expect(
    listarMascotasPorDueno('cliente@ejemplo.cl')
  ).toHaveLength(1)
})
