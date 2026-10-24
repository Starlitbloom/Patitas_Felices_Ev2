/* DATOS — Servicios que se pueden registrar en una atención.
   Son los de "Solicitar cita" en la EP1, agrupados por tipo, más los de conejos y aves.
   Cada servicio dice qué especies lo usan; si no dice nada, sirve para todas. */
import type { Especie } from '../types/mascota'

export interface Servicio {
  nombre: string
  /** Especies a las que se ofrece. Si no se indica, es para todas. */
  especies?: Especie[]
}

export interface GrupoServicios {
  grupo: string
  servicios: Servicio[]
}

/* Servicios que no son vacunas */
export const GRUPOS_SERVICIOS: GrupoServicios[] = [
  {
    grupo: 'Cirugía',
    servicios: [
      { nombre: 'Esterilización hembra canina', especies: ['Perro'] },
      { nombre: 'Esterilización macho canino', especies: ['Perro'] },
      { nombre: 'Esterilización hembra felina', especies: ['Gato'] },
      { nombre: 'Esterilización macho felino', especies: ['Gato'] },
      { nombre: 'Esterilización hembra conejo', especies: ['Conejo'] },
      { nombre: 'Esterilización macho conejo', especies: ['Conejo'] },
      { nombre: 'Extirpación de tumor cutáneo', especies: ['Perro', 'Gato', 'Conejo'] },
      { nombre: 'Cesárea de urgencia', especies: ['Perro', 'Gato', 'Conejo'] },
    ],
  },
  {
    grupo: 'Desparasitación',
    servicios: [
      { nombre: 'Desparasitación interna pequeños', especies: ['Perro'] },
      { nombre: 'Desparasitación interna medianos', especies: ['Perro'] },
      { nombre: 'Desparasitación interna grandes', especies: ['Perro'] },
      { nombre: 'Desparasitación interna felina', especies: ['Gato'] },
      { nombre: 'Desparasitación interna conejo', especies: ['Conejo'] },
      { nombre: 'Desparasitación interna ave', especies: ['Ave'] },
      { nombre: 'Desparasitación externa' },
    ],
  },
  {
    grupo: 'Exámenes',
    servicios: [
      { nombre: 'Hemograma completo' },
      { nombre: 'Perfil bioquímico completo' },
      { nombre: 'Radiografía' },
      { nombre: 'Ecografía abdominal' },
      { nombre: 'Test de leishmaniasis', especies: ['Perro', 'Gato', 'Conejo'] },
    ],
  },
  {
    grupo: 'Otros',
    servicios: [
      { nombre: 'Corte de uñas' },
      { nombre: 'Limpieza dental', especies: ['Perro', 'Gato', 'Conejo'] },
      { nombre: 'Microchip identificación', especies: ['Perro', 'Gato'] },
      { nombre: 'Hospitalización' },
    ],
  },
]

/* Catálogo de vacunas de la clínica por especie.
   Conejos y aves no tienen catálogo (la EP1 solo tenía vacunas de perros y gatos). */
export const CATALOGO_VACUNAS: Partial<Record<Especie, string[]>> = {
  Perro: ['Vacuna antirrábica canina (VA001)', 'Vacuna sextuple canina (VA002)', 'Vacuna Bordetella canina (VA005)'],
  Gato: ['Vacuna bivalente felina (VA003)', 'Vacuna triple felina (VA004)', 'Vacuna antirrábica felina (VA006)'],
}