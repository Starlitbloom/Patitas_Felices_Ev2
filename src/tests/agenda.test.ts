/* =========================================================
   Prueba P05 — Agenda de disponibilidad del médico
   Archivo probado: src/services/agendaService.ts
   Se simula una cita guardada en localStorage (datos simulados)
   y se usan fechas fijas para que el resultado no dependa del día real.
========================================================= */
import { expect, test } from 'vitest'
import { contarLibres, generarAgendaSemanal } from '../services/agendaService'
import { obtenerVeterinarioPorId } from '../services/veterinariosService'
import { CLAVES } from '../services/almacenamiento'

test('P05 - AGENDA: una hora con cita aparece ocupada y los días que el médico no atiende no tienen horas', () => {
  // Datos de prueba
  const medico = obtenerVeterinarioPorId(2)! // Dr. Matías Contreras: martes y jueves, 10:00 - 19:00
  const lunes = new Date(2030, 2, 4) // semana del lunes 4 de marzo de 2030
  const ahora = new Date(2030, 2, 1) // "hoy" es antes de esa semana: ninguna hora ha pasado
  const citaGuardada = {
    id: 'cita-prueba',
    veterinarioId: 2,
    fecha: '2030-03-05', // martes
    hora: '11:00',
    duracionMinutos: 60,
    servicio: 'Control postoperatorio',
    estado: 'Confirmada',
  }
  localStorage.setItem(CLAVES.citas, JSON.stringify([citaGuardada]))

  const agenda = generarAgendaSemanal(medico, lunes, ahora)
  const [lunesAgenda, martes] = agenda
  const estadoDe = (hora: string) => martes.bloques.find((b) => b.hora === hora)?.estado

  expect(agenda.length).toBe(5) // lunes a viernes
  expect(lunesAgenda.atiende).toBe(false) // no atiende los lunes
  expect(lunesAgenda.bloques.length).toBe(0)
  expect(estadoDe('11:00')).toBe('ocupado') // la hora con cita
  expect(estadoDe('10:00')).toBe('libre') // la hora anterior sigue libre
  expect(contarLibres(agenda)).toBe(17) // martes 9 horas - 1 ocupada + jueves 9 horas
})
