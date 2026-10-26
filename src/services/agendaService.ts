/* =========================================================
   SERVICIO — Agenda semanal de un médico veterinario.
   Arma la disponibilidad de lunes a viernes para el perfil
   /equipo/:id, usando:
   - los días y el horario del médico (src/data/veterinarios.ts)
   - las citas reales guardadas (citasService → horasOcupadas)
   Es una función pura respecto de la fecha: recibe "ahora"
   como parámetro para poder probarla con fechas fijas.
========================================================= */
import type { Veterinario } from '../types/veterinario'
import { HORARIOS_CITAS, horasOcupadas } from './citasService'

/** libre: se puede reservar · ocupado: ya tiene una cita · pasado: la hora ya pasó */
export type EstadoBloque = 'libre' | 'ocupado' | 'pasado'

export interface BloqueAgenda {
  hora: string
  estado: EstadoBloque
}

export interface DiaAgenda {
  fecha: string // formato AAAA-MM-DD (el mismo que usa citasService)
  nombre: string // "Lunes"
  etiqueta: string // "27 oct"
  atiende: boolean // false si el médico no trabaja ese día
  bloques: BloqueAgenda[]
}

const NOMBRES_DIA = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

/** Duración de un bloque de la agenda (una consulta general). */
const DURACION_BLOQUE = 60

/** Date → "AAAA-MM-DD" en hora local. */
export function aTextoFecha(fecha: Date): string {
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  return `${fecha.getFullYear()}-${mes}-${dia}`
}

function aMinutos(hora: string): number {
  const [h, m] = hora.split(':').map(Number)
  return h * 60 + m
}

/** Lunes de la semana de la fecha dada (el domingo cuenta como fin de semana anterior). */
export function lunesDeLaSemana(fecha: Date): Date {
  const lunes = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate())
  const dia = lunes.getDay() // 0 = domingo
  lunes.setDate(lunes.getDate() - (dia === 0 ? 6 : dia - 1))
  return lunes
}

/** Horas del selector de citas que caben completas dentro del horario del médico ("09:00 - 14:00"). */
export function horasDeJornada(veterinario: Veterinario): string[] {
  const rango = veterinario.horario.match(/^(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})$/)
  if (!rango) return []
  const entrada = aMinutos(rango[1])
  const salida = aMinutos(rango[2])
  return HORARIOS_CITAS.filter((hora) => {
    const inicio = aMinutos(hora)
    return inicio >= entrada && inicio + DURACION_BLOQUE <= salida
  })
}

/**
 * Genera los 5 días hábiles (lunes a viernes) de la semana que empieza en `lunes`.
 * @param veterinario médico del que se arma la agenda
 * @param lunes primer día de la semana a mostrar
 * @param ahora fecha y hora actual (para marcar los bloques que ya pasaron)
 */
export function generarAgendaSemanal(veterinario: Veterinario, lunes: Date, ahora: Date = new Date()): DiaAgenda[] {
  const hoy = aTextoFecha(ahora)
  const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes()
  const jornada = horasDeJornada(veterinario)

  return [0, 1, 2, 3, 4].map((desplazamiento) => {
    const dia = new Date(lunes.getFullYear(), lunes.getMonth(), lunes.getDate() + desplazamiento)
    const fecha = aTextoFecha(dia)
    const nombre = NOMBRES_DIA[dia.getDay()]
    const atiende = veterinario.dias.includes(nombre)

    // Horas que ya tienen una cita de este médico (las canceladas no cuentan)
    const ocupadas = atiende ? horasOcupadas(fecha, undefined, veterinario.id) : []

    const bloques: BloqueAgenda[] = atiende
      ? jornada.map((hora) => {
          const yaPaso = fecha < hoy || (fecha === hoy && aMinutos(hora) <= minutosAhora)
          const estado: EstadoBloque = yaPaso ? 'pasado' : ocupadas.includes(hora) ? 'ocupado' : 'libre'
          return { hora, estado }
        })
      : []

    return { fecha, nombre, etiqueta: `${dia.getDate()} ${MESES[dia.getMonth()]}`, atiende, bloques }
  })
}

/** Cuenta los bloques libres de una agenda (para el resumen "X horas disponibles"). */
export function contarLibres(agenda: DiaAgenda[]): number {
  return agenda.reduce((total, dia) => total + dia.bloques.filter((b) => b.estado === 'libre').length, 0)
}
