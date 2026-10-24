/* DATOS — Servicios que se pueden registrar en una atención.
   Son los mismos de "Solicitar cita" en la EP1, agrupados por tipo. */
import type { Especie } from '../types/mascota'

export interface GrupoServicios {
  grupo: string
  servicios: string[]
}

/* Servicios que no son vacunas */
export const GRUPOS_SERVICIOS: GrupoServicios[] = [
  {
    grupo: 'Cirugía',
    servicios: [
      'Esterilización hembra canina',
      'Esterilización macho canino',
      'Esterilización hembra felina',
      'Esterilización macho felino',
      'Extirpación de tumor cutáneo',
      'Cesárea de urgencia',
    ],
  },
  {
    grupo: 'Desparasitación',
    servicios: [
      'Desparasitación interna pequeños',
      'Desparasitación interna medianos',
      'Desparasitación interna grandes',
      'Desparasitación interna felina',
      'Desparasitación externa',
    ],
  },
  {
    grupo: 'Exámenes',
    servicios: ['Hemograma completo', 'Perfil bioquímico completo', 'Radiografía', 'Ecografía abdominal', 'Test de leishmaniasis'],
  },
  {
    grupo: 'Otros',
    servicios: ['Corte de uñas', 'Limpieza dental', 'Microchip identificación', 'Hospitalización'],
  },
]

/* Catálogo de vacunas de la clínica por especie.
   Conejos y aves no tienen catálogo (la EP1 solo tenía vacunas de perros y gatos). */
export const CATALOGO_VACUNAS: Partial<Record<Especie, string[]>> = {
  Perro: ['Vacuna antirrábica canina (VA001)', 'Vacuna sextuple canina (VA002)', 'Vacuna Bordetella canina (VA005)'],
  Gato: ['Vacuna bivalente felina (VA003)', 'Vacuna triple felina (VA004)', 'Vacuna antirrábica felina (VA006)'],
}