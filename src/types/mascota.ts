/** Especies atendidas por la clínica, según el caso */
export type Especie = 'Perro' | 'Gato' | 'Conejo' | 'Ave' ;

export const ESPECIES_MASCOTA: Especie[] = ['Perro', 'Gato', 'Conejo', 'Ave']

export type Sexo = 'Macho' | 'Hembra' | ''

/** Estado general del paciente, mostrado como badge en la tarjeta/detalle */
export type EstadoMascota = 'al-dia' | 'tratamiento' | 'pendiente'

export const ESTADOS_MASCOTA: EstadoMascota[] = ['al-dia', 'tratamiento', 'pendiente']

export const TEXTO_ESTADO_MASCOTA: Record<EstadoMascota, string> = {
  'al-dia': 'Control al día',
  'tratamiento': 'En tratamiento',
  'pendiente': 'Vacunas pendientes',
}

/** Mascota tal como se guarda en la fuente de datos (localStorage). */
export interface Mascota{
    id: string
    nombre: string
    especie: Especie
    raza: string
    edad: string
    sexo: Sexo
    peso: string
    dueño: string
    correoDueño: string
    
    /** False mientras falten raza/sexo/peso/foto */
    completo : boolean
    imagen: string
    estado: EstadoMascota
    descripcion: string

}

/** Datos necesarios para crear una mascota ( el servicio genera el id) */
export type NuevaMascota = Omit<Mascota, 'id'>

/** Campos que se pueden modificar de una mascota existente */
export type CambiosMascota = Partial<Omit<Mascota, 'id'>>

/** filtros del listado "Mis mascotas" */
export interface FiltrosMascotas{
    texto : string
    especie: '' | Especie
    soloFavoritas: boolean
}

/* ==============================================================
    FICHA/HISTORIAL CLÍNICO
================================================================= */

export interface RegistroClinico{
    fecha: string
    motivo: string
    diagnostico: string
    tratamiento: string
    veterinario: string
    /** Servicios realizados en la atención (cirugía, exámenes, etc.). Las atenciones antiguas no lo tienen. */
    servicios?: string[]
}

/*===============================================================
    VACUNAS
=================================================================*/

export type EstadoVacuna = 'al-dia' | 'proxima' | 'atrasada'

export const TEXTO_ESTADO_VACUNA: Record<EstadoVacuna, string> = {
    'al-dia': 'Al día',
    'proxima': 'Próxima ',
    'atrasada': 'Atrasada'
}

export interface RegistroVacuna{
    vacuna: string
    fecha: string
    proximoRefuerzo: string
    estado: EstadoVacuna
}


/* =========================================================
   SOLICITUDES DE CAMBIO
   El dueño/a propone cambios sobre una mascota ya completa y
   el personal los aprueba o rechaza desde el panel admin.
========================================================= */

export type EstadoSolicitud = 'pendiente' | 'aprobada' | 'rechazada'

/** Datos que el dueño/a puede proponer cambiar. */
export interface CambiosSolicitud {
  raza: string
  sexo: Sexo
  peso: string
  imagen: string
  descripcion: string
}

export interface SolicitudCambio {
  id: string
  mascotaId: string
  correoSolicitante: string
  cambios: CambiosSolicitud
  estado: EstadoSolicitud
  fechaSolicitud: string // ISO
  fechaResolucion: string | null
}