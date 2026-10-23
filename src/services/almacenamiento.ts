/* =========================================================
   Acceso a localStorage.
   Es la única parte del proyecto que habla directamente con
   el almacenamiento del navegador. Si algún día se reemplaza
   por una API real, solo cambia este archivo.
========================================================= */

/** Claves compartidas por todo el equipo (las mismas de la EP1). */
export const CLAVES = {
  usuarios: 'patitasFelices_usuarios',
  sesion: 'patitasFelices_sesion',
  mascotas: 'patitasFelices_mascotas',
  historialesMascotas: 'patitasFelices_historiales',
  vacunasMascotas: 'patitasFelices_vacunas',
  favoritosMascotas: 'patitasFelices_favoritosMascotas',
  citas: 'patitasFelices_citas',
  solicitudesMascotas: 'patitasFelices_solicitudesMascotas',
} as const

/**
 * Lee un arreglo JSON desde localStorage. Si la clave no existe
 * o el JSON está corrupto, devuelve [] en vez de romper la página.
 */
export function leerColeccion<T>(clave: string): T[] {
  try {
    const valor = JSON.parse(localStorage.getItem(clave) ?? '[]')
    return Array.isArray(valor) ? (valor as T[]) : []
  } catch {
    return []
  }
}

export function guardarColeccion<T>(clave: string, datos: T[]): void {
  localStorage.setItem(clave, JSON.stringify(datos))
}

/** Lee un objeto JSON (o null si no existe o está corrupto). */
export function leerObjeto<T>(clave: string): T | null {
  try {
    return JSON.parse(localStorage.getItem(clave) ?? 'null') as T | null
  } catch {
    return null
  }
}

export function guardarObjeto<T>(clave: string, dato: T): void {
  localStorage.setItem(clave, JSON.stringify(dato))
}

export function borrar(clave: string): void {
  localStorage.removeItem(clave)
}
