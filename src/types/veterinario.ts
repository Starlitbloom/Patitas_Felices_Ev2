/* Tipos de la vista "Equipo veterinario". */

export type Especie = 'Perros' | 'Gatos' | 'Conejos' | 'Aves'

export type Especialidad =
  | 'Medicina general'
  | 'Cirugía'
  | 'Dermatología'
  | 'Animales exóticos'
  | 'Medicina preventiva'
  | 'Nutrición'

export interface Veterinario {
  id: number
  nombre: string
  especialidad: Especialidad
  especies: Especie[]
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
  especialidad: '' | Especialidad
  especie: '' | Especie
}
