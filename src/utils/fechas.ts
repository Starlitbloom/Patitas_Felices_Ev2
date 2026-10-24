/* UTILIDAD — Fechas en el formato que usa la app: "10 enero 2026".
   Los <input type="date"> entregan "2026-01-10"; acá se convierte.
   estas son para mascotas-admin */

const MESES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
]

/** Convierte "2026-01-10" (valor de un input de fecha) en "10 enero 2026". */
export function formatearFechaInput(valor: string): string {
  const [anio, mes, dia] = valor.split('-')
  return `${dia} ${MESES[Number(mes) - 1]} ${anio}`
}

/** Fecha de hoy como "2026-01-10": sirve de valor inicial para un input de fecha. */
export function fechaDeHoyInput(): string {
  const hoy = new Date()
  const mes = String(hoy.getMonth() + 1).padStart(2, '0')
  const dia = String(hoy.getDate()).padStart(2, '0')
  return `${hoy.getFullYear()}-${mes}-${dia}`
}
/** Convierte "24 noviembre 2026" (como se guardan las fechas) en "2026-11-24". Si no se entiende, devuelve "". */
export function fechaTextoAIso(texto: string): string {
  const [dia, mes, anio] = texto.trim().split(/\s+/)
  const numeroMes = MESES.indexOf((mes ?? '').toLowerCase()) + 1
  if (!dia || !anio || numeroMes === 0) return ''
  return `${anio}-${String(numeroMes).padStart(2, '0')}-${dia.padStart(2, '0')}`
}