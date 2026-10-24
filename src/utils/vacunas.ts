/* UTILIDAD — Reglas de las vacunas de una mascota: estado según el refuerzo y búsqueda por nombre. */
import type { EstadoVacuna, RegistroVacuna } from '../types/mascota'
import { fechaDeHoyInput, fechaTextoAIso } from './fechas'

/* Estado según el próximo refuerzo ("2026-11-24"):
   ya pasó → atrasada; falta 1 mes o menos → próxima; más que eso → al día */
export function calcularEstadoVacuna(proximoRefuerzo: string): EstadoVacuna {
  const hoy = fechaDeHoyInput()
  if (proximoRefuerzo < hoy) return 'atrasada'

  const limite = new Date()
  limite.setMonth(limite.getMonth() + 1)
  const mes = String(limite.getMonth() + 1).padStart(2, '0')
  const dia = String(limite.getDate()).padStart(2, '0')
  const dentroDeUnMes = `${limite.getFullYear()}-${mes}-${dia}`

  return proximoRefuerzo <= dentroDeUnMes ? 'proxima' : 'al-dia'
}

/* Estado de una vacuna ya guardada, calculado con la fecha de hoy.
   Si su fecha no se puede leer, se usa el estado que tenía guardado. */
export function estadoActualVacuna(registro: RegistroVacuna): EstadoVacuna {
  const iso = fechaTextoAIso(registro.proximoRefuerzo)
  return iso ? calcularEstadoVacuna(iso) : registro.estado
}

/* Busca si la mascota ya tiene registrada esa vacuna (sin importar mayúsculas) */
export function buscarVacuna(aplicadas: RegistroVacuna[], nombre: string): RegistroVacuna | undefined {
  const buscado = nombre.trim().toLowerCase()
  return aplicadas.find((v) => v.vacuna.trim().toLowerCase() === buscado)
}

/* Fecha de refuerzo que se propone al marcar una vacuna: un año desde hoy ("2027-10-24") */
export function refuerzoPorDefecto(): string {
  const fecha = new Date()
  fecha.setFullYear(fecha.getFullYear() + 1)
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  return `${fecha.getFullYear()}-${mes}-${dia}`
}