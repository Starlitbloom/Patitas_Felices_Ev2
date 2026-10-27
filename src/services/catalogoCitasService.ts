
/* =========================================================
   PATITAS FELICES - CATÁLOGO PARA SOLICITAR CITA

   FUNCIONALIDADES:
   1. Definir los servicios del catálogo veterinario.
   2. Indicar las especies de cada servicio.
   3. Relacionar los servicios con los veterinarios.
   4. Filtrar servicios según la mascota.
   5. Filtrar veterinarios según su especialidad.
   6. Validar las combinaciones de reserva.
   7. Mostrar precios en pesos chilenos.
   8. Mostrar la duración de cada servicio.
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

/* Especies disponibles. */

export type EspecieCita =
  | 'Perro'
  | 'Gato'
  | 'Ave'
  | 'Conejo'


/* Categorías del catálogo. */

export type GrupoServicioCita =
  | 'Consultas'
  | 'Vacunación'
  | 'Cirugía'
  | 'Desparasitación'
  | 'Exámenes'
  | 'Otros'


/* Estructura de cada servicio veterinario. */

export interface ServicioCita {

  /* Código único del catálogo. */
  codigo: string

  /* Nombre del servicio. */
  nombre: string

  /* Categoría. */
  grupo: GrupoServicioCita

  /* Especies que pueden recibirlo. */
  especies: EspecieCita[]

  /* Duración indicada en el catálogo. */
  duracionMinutos: number

  /* Precio en pesos chilenos. */
  precioCLP: number

  /* Veterinarios que realizan el servicio. */
  veterinarioIds?: number[]

  /* Información adicional. */
  nota?: string
}


/* =========================================================
   2. GRUPOS DE ESPECIES
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
   3. CATÁLOGO DE SERVICIOS VETERINARIOS
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
    precioCLP: 15000,
    veterinarioIds: [1]
  },

  {
    codigo: 'SV002',
    nombre: 'Consulta urgencia',
    grupo: 'Consultas',
    especies: [...PERRO_GATO],
    duracionMinutos: 30,
    precioCLP: 25000,
    nota:
      'Requiere confirmación de disponibilidad. Fuera de horario: recargo de $10.000 según el catálogo.'
  },

  {
    codigo: 'SV003',
    nombre: 'Control postoperatorio',
    grupo: 'Consultas',
    especies: [...PERRO_GATO],
    duracionMinutos: 20,
    precioCLP: 10000,
    veterinarioIds: [2]
  },

  {
    codigo: 'SV004',
    nombre: 'Consulta ave / conejo',
    grupo: 'Consultas',
    especies: ['Ave', 'Conejo'],
    duracionMinutos: 30,
    precioCLP: 18000,
    veterinarioIds: [3]
  },

  {
    codigo: 'SV005',
    nombre: 'Segunda opinión médica',
    grupo: 'Consultas',
    especies: [...TODAS],
    duracionMinutos: 40,
    precioCLP: 20000,
    nota:
      'Se requiere una ficha clínica previa.'
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
    precioCLP: 12000,
    veterinarioIds: [3]
  },

  {
    codigo: 'VA002',
    nombre: 'Vacuna sextuple canina',
    grupo: 'Vacunación',
    especies: ['Perro'],
    duracionMinutos: 10,
    precioCLP: 18000,
    veterinarioIds: [3]
  },

  {
    codigo: 'VA003',
    nombre: 'Vacuna bivalente felina',
    grupo: 'Vacunación',
    especies: ['Gato'],
    duracionMinutos: 10,
    precioCLP: 15000,
    veterinarioIds: [3]
  },

  {
    codigo: 'VA004',
    nombre: 'Vacuna triple felina',
    grupo: 'Vacunación',
    especies: ['Gato'],
    duracionMinutos: 10,
    precioCLP: 17000,
    veterinarioIds: [3]
  },

  {
    codigo: 'VA005',
    nombre: 'Vacuna Bordetella canina',
    grupo: 'Vacunación',
    especies: ['Perro'],
    duracionMinutos: 10,
    precioCLP: 14000,
    veterinarioIds: [3]
  },

  {
    codigo: 'VA006',
    nombre: 'Vacuna antirrábica felina',
    grupo: 'Vacunación',
    especies: ['Gato'],
    duracionMinutos: 10,
    precioCLP: 12000,
    veterinarioIds: [3]
  },


  /* =====================================================
     CIRUGÍAS
  ===================================================== */

  {
    codigo: 'CI001',
    nombre: 'Esterilización hembra canina',
    grupo: 'Cirugía',
    especies: ['Perro'],
    duracionMinutos: 90,
    precioCLP: 80000,
    veterinarioIds: [2]
  },

  {
    codigo: 'CI002',
    nombre: 'Esterilización macho canino',
    grupo: 'Cirugía',
    especies: ['Perro'],
    duracionMinutos: 60,
    precioCLP: 60000,
    veterinarioIds: [2]
  },

  {
    codigo: 'CI003',
    nombre: 'Esterilización hembra felina',
    grupo: 'Cirugía',
    especies: ['Gato'],
    duracionMinutos: 60,
    precioCLP: 65000,
    veterinarioIds: [2]
  },

  {
    codigo: 'CI004',
    nombre: 'Esterilización macho felino',
    grupo: 'Cirugía',
    especies: ['Gato'],
    duracionMinutos: 45,
    precioCLP: 50000,
    veterinarioIds: [2]
  },

  {
    codigo: 'CI005',
    nombre: 'Extirpación de tumor cutáneo',
    grupo: 'Cirugía',
    especies: [...PERRO_GATO],
    duracionMinutos: 60,
    precioCLP: 120000,
    veterinarioIds: [2],
    nota:
      'Precio referencial: puede variar según el tamaño. Requiere evaluación previa.'
  },

  {
    codigo: 'CI006',
    nombre: 'Cesárea de urgencia',
    grupo: 'Cirugía',
    especies: [...PERRO_GATO],
    duracionMinutos: 120,
    precioCLP: 180000,
    nota:
      'Procedimiento urgente sujeto a evaluación y confirmación de la clínica.'
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
    precioCLP: 8000,
    veterinarioIds: [3]
  },

  {
    codigo: 'DE002',
    nombre: 'Desparasitación interna medianos (10-25 kg)',
    grupo: 'Desparasitación',
    especies: ['Perro'],
    duracionMinutos: 5,
    precioCLP: 9500,
    veterinarioIds: [3]
  },

  {
    codigo: 'DE003',
    nombre: 'Desparasitación interna grandes (>25 kg)',
    grupo: 'Desparasitación',
    especies: ['Perro'],
    duracionMinutos: 5,
    precioCLP: 11000,
    veterinarioIds: [3]
  },

  {
    codigo: 'DE004',
    nombre: 'Desparasitación interna felina',
    grupo: 'Desparasitación',
    especies: ['Gato'],
    duracionMinutos: 5,
    precioCLP: 8000,
    veterinarioIds: [3]
  },

  {
    codigo: 'DE005',
    nombre: 'Antiparasitario externo (pipeta)',
    grupo: 'Desparasitación',
    especies: [...PERRO_GATO],
    duracionMinutos: 5,
    precioCLP: 7500,
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
    duracionMinutos: 30,
    precioCLP: 22000
  },

  {
    codigo: 'EX002',
    nombre: 'Perfil bioquímico completo',
    grupo: 'Exámenes',
    especies: [...PERRO_GATO],
    duracionMinutos: 30,
    precioCLP: 35000
  },

  {
    codigo: 'EX003',
    nombre: 'Radiografía (1 proyección)',
    grupo: 'Exámenes',
    especies: [...PERRO_GATO],
    duracionMinutos: 20,
    precioCLP: 28000
  },

  {
    codigo: 'EX004',
    nombre: 'Ecografía abdominal',
    grupo: 'Exámenes',
    especies: [...PERRO_GATO],
    duracionMinutos: 30,
    precioCLP: 45000
  },

  {
    codigo: 'EX005',
    nombre: 'Test de leishmaniasis',
    grupo: 'Exámenes',
    especies: ['Perro'],
    duracionMinutos: 20,
    precioCLP: 18000
  },


  /* =====================================================
     OTROS PROCEDIMIENTOS
  ===================================================== */

  {
    codigo: 'OT001',
    nombre: 'Corte de uñas',
    grupo: 'Otros',
    especies: [...PERRO_GATO],
    duracionMinutos: 15,
    precioCLP: 5000
  },

  {
    codigo: 'OT002',
    nombre: 'Limpieza dental',
    grupo: 'Otros',
    especies: [...PERRO_GATO],
    duracionMinutos: 45,
    precioCLP: 55000,
    nota:
      'Requiere anestesia y evaluación previa.'
  },

  {
    codigo: 'OT003',
    nombre: 'Microchip identificación',
    grupo: 'Otros',
    especies: [...PERRO_GATO],
    duracionMinutos: 10,
    precioCLP: 15000
  },

  {
    codigo: 'OT004',
    nombre: 'Hospitalización (por día)',
    grupo: 'Otros',
    especies: [...PERRO_GATO],
    duracionMinutos: 1440,
    precioCLP: 30000,
    nota:
      'El precio y la duración corresponden a un día de hospitalización. Requiere confirmación de la clínica.'
  }

]


/* =========================================================
   4. FORMATEAR PRECIO EN PESOS CHILENOS
========================================================= */

export function formatearPrecioCLP(
  precio: number
): string {

  return '$' + precio.toLocaleString('es-CL')
}


/* =========================================================
   5. FORMATEAR DURACIÓN DEL SERVICIO
  ================= */

export function formatearDuracionServicio(
  minutos: number
): string {

  /* Hospitalización de un día. */

  if (minutos === 1440) {
    return '24 horas (por día)'
  }

  /* Duraciones en horas exactas. */

  if (
    minutos >= 60 &&
    minutos % 60 === 0
  ) {

    const horas = minutos / 60

    return `${horas} ${
      horas === 1 ? 'hora' : 'horas'
    }`
  }

  /* Duraciones en minutos. */

  return `${minutos} minutos`
}


/* =========================================================
   6. OBTENER ESPECIE DESDE EL FORMULARIO
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
   7. FILTRAR SERVICIOS POR ESPECIE
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
   8. BUSCAR SERVICIO POR NOMBRE

   Devuelve todos sus datos:
   - Precio.
   - Duración.
   - Categoría.
   - Veterinarios.
========================================================= */

export function obtenerServicioCita(
  nombre: string
): ServicioCita | null {

  return CATALOGO_CITAS.find(
    (servicio) => servicio.nombre === nombre
  ) ?? null
}


/* =========================================================
   9. AGRUPAR SERVICIOS POR CATEGORÍA
========================================================= */

export function agruparServiciosCita(
  especie: EspecieCita | null
): Record<string, ServicioCita[]> {

  const resultado: Record<
    string,
    ServicioCita[]
  > = {}

  for (
    const servicio of serviciosPorEspecie(especie)
  ) {

    if (!resultado[servicio.grupo]) {
      resultado[servicio.grupo] = []
    }

    resultado[servicio.grupo].push(servicio)
  }

  return resultado
}


/* =========================================================
   10. FILTRAR VETERINARIOS POR ESPECIE Y SERVICIO
========================================================= */

export function veterinariosPorServicio(
  especie: EspecieCita | null,
  nombreServicio: string
): Veterinario[] {

  /* Se necesita especie y servicio. */

  if (!especie || !nombreServicio) {
    return []
  }

  const servicio = obtenerServicioCita(
    nombreServicio
  )

  /* El servicio debe existir y ser compatible. */

  if (
    !servicio ||
    !servicio.especies.includes(especie)
  ) {
    return []
  }

  /* Convertir especie al formato del equipo. */

  const especiesVeterinarios = {
    Perro: 'Perros',
    Gato: 'Gatos',
    Ave: 'Aves',
    Conejo: 'Conejos'
  } as const

  const especieVeterinario =
    especiesVeterinarios[especie]

  /* Obtener médicos disponibles. */

  const veterinarios = listarVeterinarios()

  return veterinarios.filter((veterinario) => {

    /* Debe ser médico veterinario. */

    const esMedico =
      veterinario.cargo === 'Médico veterinario'

    /* Debe atender la especie. */

    const atiendeEspecie =
      veterinario.especies.includes(
        especieVeterinario
      )

    /* Debe realizar el servicio solicitado. */

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
   11. VALIDAR COMBINACIÓN COMPLETA
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
   12. INDICAR SI LA CLÍNICA DEBE CONFIRMAR
       EL PROFESIONAL
========================================================= */

export function profesionalPorConfirmar(
  nombreServicio: string
): boolean {

  const servicio = obtenerServicioCita(
    nombreServicio
  )

  return Boolean(
    servicio &&
    !servicio.veterinarioIds
  )
}