/* =========================================================
   datosEquipoService — lectura de datos de los otros módulos.
   Mascotas y citas pertenecen a los módulos de mis compañeras.
   Mientras ellas migran sus servicios a React, el perfil, el
   dashboard y los reportes leen esas colecciones desde aquí
   (mismas claves de localStorage que en la EP1).
   Cuando existan mascotasService y citasService, basta con
   cambiar estas funciones para que usen esos servicios.
========================================================= */
import { CLAVES, leerColeccion } from './almacenamiento'

/** Campos mínimos que este módulo necesita de una mascota. */
export interface MascotaResumen {
  id?: string
  nombre?: string
  especie?: string
  raza?: string
  estado?: string
  completo?: boolean
  correoDueño?: string
}

/** Campos mínimos que este módulo necesita de una cita. */
export interface CitaResumen {
  id?: string
  fecha?: string
  motivo?: string
  servicio?: string
  estado?: string
  correoUsuario?: string
}

export interface SolicitudMascota {
  estado?: string
}

export const listarMascotas = () => leerColeccion<MascotaResumen>(CLAVES.mascotas)
export const listarCitas = () => leerColeccion<CitaResumen>(CLAVES.citas)
export const listarSolicitudesMascotas = () => leerColeccion<SolicitudMascota>(CLAVES.solicitudesMascotas)

const igual = (a?: string, b?: string) => !!a && !!b && a.toLowerCase() === b.toLowerCase()

export const listarMascotasDe = (correo: string) => listarMascotas().filter((m) => igual(m.correoDueño, correo))
export const listarCitasDe = (correo: string) => listarCitas().filter((c) => igual(c.correoUsuario, correo))

/** Estado de una cita en minúsculas ("pendiente" si no tiene). */
export const estadoCita = (c: CitaResumen) => (c.estado || 'pendiente').toLowerCase()
