/* Tipos de la vista "Nuestro equipo".
   Según el caso, el equipo de Veterinaria San Marcos tiene
   3 médicos veterinarios, 1 técnico veterinario y 1 recepcionista. */

export type Especie = 'Perros' | 'Gatos' | 'Conejos' | 'Aves'

export type Cargo = 'Médico veterinario' | 'Técnico veterinario' | 'Recepcionista'

export interface Veterinario {
  id: number
  nombre: string
  cargo: Cargo  
  titulo: string // Título profesional del integrante del equipo
  area: string // área o servicio principal (ej: "Cirugía menor")
  especies: Especie[] // vacío si no atiende pacientes (recepción)
  experiencia: number // años
  descripcion: string
  dias: string[]
  horario: string
  imagen: string
  correo: string
}

/** Filtros de la página de equipo ('' = sin filtrar). */
export interface FiltrosEquipo {
  texto: string
  cargo: '' | Cargo
  especie: '' | Especie
}
