/* Funciones puras para los reportes: agrupar y contar. */

/** Cuenta cuántos elementos hay por cada valor de "clave" y ordena de mayor a menor. */
export function contarPor<T>(items: T[], clave: (item: T) => string): [string, number][] {
  const conteo: Record<string, number> = {}
  items.forEach((item) => {
    const k = clave(item)
    conteo[k] = (conteo[k] ?? 0) + 1
  })
  return Object.entries(conteo).sort((a, b) => b[1] - a[1])
}

/** Recorta textos largos para las etiquetas de los gráficos. */
export const recortar = (texto: string, max: number) => (texto.length > max ? `${texto.slice(0, max)}…` : texto)
