
/* =========================================================
   PATITAS FELICES - CATÁLOGO PARA SOLICITAR CITA

   FUNCIONALIDADES:
   1. Definir los servicios reales del catálogo.
   2. Indicar a qué especies corresponde cada servicio.
   3. Relacionar servicios con especialidades médicas.
   4. Filtrar servicios según la mascota.
   5. Filtrar veterinarios según especie y servicio.
   6. Validar que la combinación elegida sea correcta.
========================================================= */

import {
  listarVeterinarios
} from './veterinariosService'

import type {
  Veterinario
} from '../types/veterinario'


/* =========================================================
   1. TIPOS DE DATOS
========================================================= */

// Especies que se pueden seleccionar en Solicitar Cita.
export type EspecieCita =
  | 'Perro'
  | 'Gato'
  | 'Ave'
  | 'Conejo'

// Grupos del catálogo original.
export type GrupoServicioCita =
  | 'Consultas'
  | 'Vacunación'
  | 'Cirugía'
  | 'Desparasitación'
  | 'Exámenes'
  | 'Otros'

// Estructura de un servicio veterinario.
export interface ServicioCita {

  // Código original del catálogo.
  codigo: string

  // Nombre del servicio.
  nombre: string

  // Categoría.
  grupo: GrupoServicioCita

  // Mascotas a las que corresponde.
  especies: EspecieCita[]

  // Duración indicada en el catálogo, en minutos.
  duracionMinutos: number

  /* ID de los veterinarios cuya especialidad
     registrada respalda el servicio.

     Si no se indica, el catálogo no permite
     asignar un médico específico con certeza.
  */
  veterinarioIds?: number[]

  // Información adicional, cuando corresponda.
  nota?: string
}


/* =========================================================
   2. ESPECIES QUE UTILIZA EL CATÁLOGO
========================================================= */

const PERRO_GATO: EspecieCita[] = [
  'Perro',
  'Gato'
]

const TODAS: EspecieCita[] = [
  'Perro',
  'Gato',
  'Ave',
  'Conejo'
]


/* =========================================================
   3. CATÁLOGO DE SERVICIOS
========================================================= */

export const CATALOGO_CITAS: ServicioCita[] = [

  /* =====================================================
     CONSULTAS
  ===================================================== */

  {
    codigo: 'SV001',
    nombre: 'Consulta general',
    grupo: 'Consultas',
    especies: [...PERRO_GATO],
    duracionMinutos: 30,
    veterinarioIds: [1]
  },

  {
    codigo: 'SV002',
    nombre: 'Consulta urgencia',
    grupo: 'Consultas',
    especies: [...PERRO_GATO],
    duracionMinutos: 30,
    nota: 'La atención de urgencia requiere confirmación de disponibilidad.'
  },

  {
    codigo: 'SV003',
    nombre: 'Control postoperatorio',
    grupo: 'Consultas',
    especies: [...PERRO_GATO],
    duracionMinutos: 20,
    veterinarioIds: [2]
  },

  {
    codigo: 'SV004',
    nombre: 'Consulta ave / conejo',
    grupo: 'Consultas',
    especies: ['Ave', 'Conejo'],
    duracionMinutos: 30,
    veterinarioIds: [3]
  },

  {
    codigo: 'SV005',
    nombre: 'Segunda opinión médica',
    grupo: 'Consultas',
    especies: [...TODAS],
    duracionMinutos: 40,
    nota: 'Se requiere una ficha clínica previa.'
  },


  /* =====================================================
     VACUNACIÓN
  ===================================================== */

  {
    codigo: 'VA001',
    nombre: 'Vacuna antirrábica canina',
    grupo: 'Vacunación',
    especies: ['Perro'],
    duracionMinutos: 10,
    veterinarioIds: [3]
  },

  {
    codigo: 'VA002',
    nombre: 'Vacuna sextuple canina',
    grupo: 'Vacunación',
    especies: ['Perro'],
    duracionMinutos: 10,
    veterinarioIds: [3]
  },

  {
    codigo: 'VA003',
    nombre: 'Vacuna bivalente felina',
    grupo: 'Vacunación',
    especies: ['Gato'],
    duracionMinutos: 10,
    veterinarioIds: [3]
  },

  {
    codigo: 'VA004',
    nombre: 'Vacuna triple felina',
    grupo: 'Vacunación',
    especies: ['Gato'],
    duracionMinutos: 10,
    veterinarioIds: [3]
  },

  {
    codigo: 'VA005',
    nombre: 'Vacuna Bordetella canina',
    grupo: 'Vacunación',
    especies: ['Perro'],
    duracionMinutos: 10,
    veterinarioIds: [3]
  },

  {
    codigo: 'VA006',
    nombre: 'Vacuna antirrábica felina',
    grupo: 'Vacunación',
    especies: ['Gato'],
    duracionMinutos: 10,
    veterinarioIds: [3]
  },


  /* =====================================================
     CIRUGÍA
  ===================================================== */

  {
    codigo: 'CI001',
    nombre: 'Esterilización hembra canina',
    grupo: 'Cirugía',
    especies: ['Perro'],
    duracionMinutos: 90,
    veterinarioIds: [2]
  },

  {
    codigo: 'CI002',
    nombre: 'Esterilización macho canino',
    grupo: 'Cirugía',
    especies: ['Perro'],
    duracionMinutos: 60,
    veterinarioIds: [2]
  },

  {
    codigo: 'CI003',
    nombre: 'Esterilización hembra felina',
    grupo: 'Cirugía',
    especies: ['Gato'],
    duracionMinutos: 60,
    veterinarioIds: [2]
  },

  {
    codigo: 'CI004',
    nombre: 'Esterilización macho felino',
    grupo: 'Cirugía',
    especies: ['Gato'],
    duracionMinutos: 45,
    veterinarioIds: [2]
  },

  {
    codigo: 'CI005',
    nombre: 'Extirpación de tumor cutáneo',
    grupo: 'Cirugía',
    especies: [...PERRO_GATO],
    duracionMinutos: 60,
    veterinarioIds: [2],
    nota: 'La realización del procedimiento requiere evaluación previa.'
  },

  {
    codigo: 'CI006',
    nombre: 'Cesárea de urgencia',
    grupo: 'Cirugía',
    especies: [...PERRO_GATO],
    duracionMinutos: 120,
    nota: 'Procedimiento urgente sujeto a evaluación y confirmación de la clínica.'
  },


  /* =====================================================
     DESPARASITACIÓN
  ===================================================== */

  {
    codigo: 'DE001',
    nombre: 'Desparasitación interna pequeños (<10 kg)',
    grupo: 'Desparasitación',
    especies: ['Perro'],
    duracionMinutos: 5,
    veterinarioIds: [3]
  },

  {
    codigo: 'DE002',
    nombre: 'Desparasitación interna medianos (10-25 kg)',
    grupo: 'Desparasitación',
    especies: ['Perro'],
    duracionMinutos: 5,
    veterinarioIds: [3]
  },

  {
    codigo: 'DE003',
    nombre: 'Desparasitación interna grandes (>25 kg)',
    grupo: 'Desparasitación',
    especies: ['Perro'],
    duracionMinutos: 5,
    veterinarioIds: [3]
  },

  {
    codigo: 'DE004',
    nombre: 'Desparasitación interna felina',
    grupo: 'Desparasitación',
    especies: ['Gato'],
    duracionMinutos: 5,
    veterinarioIds: [3]
  },

  {
    codigo: 'DE005',
    nombre: 'Antiparasitario externo (pipeta)',
    grupo: 'Desparasitación',
    especies: [...PERRO_GATO],
    duracionMinutos: 5,
    veterinarioIds: [3]
  },


  /* =====================================================
     EXÁMENES
  ===================================================== */

  {
    codigo: 'EX001',
    nombre: 'Hemograma completo',
    grupo: 'Exámenes',
    especies: [...PERRO_GATO],
    duracionMinutos: 30
  },

  {
    codigo: 'EX002',
    nombre: 'Perfil bioquímico completo',
    grupo: 'Exámenes',
    especies: [...PERRO_GATO],
    duracionMinutos: 30
  },

  {
    codigo: 'EX003',
    nombre: 'Radiografía (1 proyección)',
    grupo: 'Exámenes',
    especies: [...PERRO_GATO],
    duracionMinutos: 20
  },

  {
    codigo: 'EX004',
    nombre: 'Ecografía abdominal',
    grupo: 'Exámenes',
    especies: [...PERRO_GATO],
    duracionMinutos: 30
  },

  {
    codigo: 'EX005',
    nombre: 'Test de leishmaniasis',
    grupo: 'Exámenes',
    especies: ['Perro'],
    duracionMinutos: 20
  },


  /* =====================================================
     OTROS PROCEDIMIENTOS
  ===================================================== */

  {
    codigo: 'OT001',
    nombre: 'Corte de uñas',
    grupo: 'Otros',
    especies: [...PERRO_GATO],
    duracionMinutos: 15
  },

  {
    codigo: 'OT002',
    nombre: 'Limpieza dental',
    grupo: 'Otros',
    especies: [...PERRO_GATO],
    duracionMinutos: 45,
    nota: 'Requiere anestesia y evaluación previa.'
  },

  {
    codigo: 'OT003',
    nombre: 'Microchip identificación',
    grupo: 'Otros',
    especies: [...PERRO_GATO],
    duracionMinutos: 10
  },

  {
    codigo: 'OT004',
    nombre: 'Hospitalización (por día)',
    grupo: 'Otros',
    especies: [...PERRO_GATO],
    duracionMinutos: 1440,
    nota: 'La hospitalización requiere confirmación de la clínica.'
  }

]


/* =========================================================
   4. OBTENER ESPECIE DESDE EL FORMULARIO
========================================================= */

export function obtenerEspecieCita(
  tipoMascota: string,
  otraEspecie: string
): EspecieCita | null {

  if (tipoMascota === 'Perro') {
    return 'Perro'
  }

  if (tipoMascota === 'Gato') {
    return 'Gato'
  }

  if (tipoMascota === 'Otro') {

    if (otraEspecie === 'Ave') {
      return 'Ave'
    }

    if (otraEspecie === 'Conejo') {
      return 'Conejo'
    }
  }

  return null
}


/* =========================================================
   5. BUSCAR SERVICIOS POR ESPECIE
========================================================= */

export function serviciosPorEspecie(
  especie: EspecieCita | null
): ServicioCita[] {

  if (!especie) {
    return []
  }

  return CATALOGO_CITAS.filter(
    (servicio) =>
      servicio.especies.includes(especie)
  )
}


/* =========================================================
   6. BUSCAR UN SERVICIO POR SU NOMBRE
========================================================= */

export function obtenerServicioCita(
  nombre: string
): ServicioCita | null {

  return CATALOGO_CITAS.find(
    (servicio) => servicio.nombre === nombre
  ) ?? null
}


/* =========================================================
   7. AGRUPAR SERVICIOS
========================================================= */

export function agruparServiciosCita(
  especie: EspecieCita | null
): Record<string, ServicioCita[]> {

  const resultado: Record<string, ServicioCita[]> = {}

  for (const servicio of serviciosPorEspecie(especie)) {

    if (!resultado[servicio.grupo]) {
      resultado[servicio.grupo] = []
    }

    resultado[servicio.grupo].push(servicio)
  }

  return resultado
}


/* =========================================================
   8. FILTRAR VETERINARIOS POR ESPECIE Y SERVICIO
========================================================= */

export function veterinariosPorServicio(
  especie: EspecieCita | null,
  nombreServicio: string
): Veterinario[] {

  if (!especie || !nombreServicio) {
    return []
  }

  const servicio = obtenerServicioCita(
    nombreServicio
  )

  // El servicio debe existir y ser compatible.
  if (
    !servicio ||
    !servicio.especies.includes(especie)
  ) {
    return []
  }

  // Convertimos el nombre de la especie
  // al formato de los datos de veterinarios.
  const especiesVeterinarios = {
    Perro: 'Perros',
    Gato: 'Gatos',
    Ave: 'Aves',
    Conejo: 'Conejos'
  } as const

  const especieVeterinario =
    especiesVeterinarios[especie]

  // Consultamos la lista original del equipo.
  const veterinarios = listarVeterinarios()

  return veterinarios.filter((veterinario) => {

    // Debe ser médico veterinario.
    const esMedico =
      veterinario.cargo === 'Médico veterinario'

    // Debe atender la especie.
    const atiendeEspecie =
      veterinario.especies.includes(
        especieVeterinario
      )

    // Si hay médico especializado identificado,
    // debe ser uno de esos profesionales.
    const realizaServicio =
      !servicio.veterinarioIds ||
      servicio.veterinarioIds.includes(
        veterinario.id
      )

    return (
      esMedico &&
      atiendeEspecie &&
      realizaServicio
    )
  })
}


/* =========================================================
   9. VALIDAR LA COMBINACIÓN COMPLETA
   Comprobar:
   - Especie.
   - Servicio.
   - Veterinario.
========================================================= */

export function citaCompatibleConCatalogo(
  especie: EspecieCita | null,
  nombreServicio: string,
  veterinarioId: number
): boolean {

  return veterinariosPorServicio(
    especie,
    nombreServicio
  ).some(
    (veterinario) =>
      veterinario.id === veterinarioId
  )
}


/* =========================================================
   10. INDICAR SI EL PROFESIONAL ESTÁ DEFINIDO
========================================================= */

export function profesionalPorConfirmar(
  nombreServicio: string
): boolean {

  const servicio = obtenerServicioCita(
    nombreServicio
  )

  return Boolean(
    servicio && !servicio.veterinarioIds
  )
}