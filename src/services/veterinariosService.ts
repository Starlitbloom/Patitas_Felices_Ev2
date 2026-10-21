/* =========================================================
   veterinariosService — fuente de datos del equipo de la clínica.
   Lectura y filtros sobre los datos simulados de data/veterinarios.ts.
========================================================= */
import { VETERINARIOS } from '../data/veterinarios'
import type { FiltrosEquipo, Veterinario } from '../types/veterinario'

export function listarVeterinarios(): Veterinario[] {
  return VETERINARIOS
}

export function obtenerVeterinarioPorId(id: number): Veterinario | null {
  return VETERINARIOS.find((v) => v.id === id) ?? null
}

/**
 * Filtra por nombre (texto), cargo y especie atendida.
 * Un filtro vacío ('') no restringe nada. No modifica la lista original.
 */
export function filtrarVeterinarios(lista: Veterinario[], filtros: FiltrosEquipo): Veterinario[] {
  const texto = filtros.texto.trim().toLowerCase()
  return lista.filter(
    (v) =>
      (!texto || v.nombre.toLowerCase().includes(texto)) &&
      (!filtros.cargo || v.cargo === filtros.cargo) &&
      (!filtros.especie || v.especies.includes(filtros.especie)),
  )
}
