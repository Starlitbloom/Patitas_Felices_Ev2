/* =========================================================
   Ninguna página o componente debe leer localStorage directo:
   todo pasa por aquí y por almacenamiento.ts.
========================================================= */
import type {
  CambiosMascota,
  CambiosSolicitud,
  FiltrosMascotas,
  Mascota,
  NuevaMascota,
  RegistroClinico,
  RegistroVacuna,
  SolicitudCambio,
} from '../types/mascota'
import type { ResultadoOperacion } from '../types/usuario'
import { HISTORIALES_INICIALES, MASCOTAS_INICIALES, VACUNAS_INICIALES } from '../data/mascotasIniciales'
import { CLAVES, guardarColeccion, guardarObjeto, leerColeccion, leerObjeto } from './almacenamiento'
import { validarRequerido } from '../utils/validaciones'

/** Genera un id único para una mascota nueva (mismo patrón que generarId() de usuarios). */
export function generarIdMascota(): string {
  return `m-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

/** Siembra los datos de ejemplo la primera vez que corre la app (se llama desde main.tsx). */
export function asegurarDatosInicialesMascotas(): void {
  if (localStorage.getItem(CLAVES.mascotas) === null) {
    guardarColeccion(CLAVES.mascotas, MASCOTAS_INICIALES)
  }
  if (localStorage.getItem(CLAVES.historialesMascotas) === null) {
    guardarObjeto(CLAVES.historialesMascotas, HISTORIALES_INICIALES)
  }
  if (localStorage.getItem(CLAVES.vacunasMascotas) === null) {
    guardarObjeto(CLAVES.vacunasMascotas, VACUNAS_INICIALES)
  }
}

/* =========================================================
   LECTURA
========================================================= */

export function listarMascotas(): Mascota[] {
  return leerColeccion<Mascota>(CLAVES.mascotas)
}

/** Mascotas de un dueño/a (lo usa la vista pública "Mis mascotas", filtrada por sesión). */
export function listarMascotasPorDueno(correo: string): Mascota[] {
  const objetivo = correo.trim().toLowerCase()
  return listarMascotas().filter((m) => m.correoDueño.trim().toLowerCase() === objetivo)
}

export function obtenerMascotaPorId(id: string): Mascota | null {
  return listarMascotas().find((m) => m.id === id) ?? null
}

/* =========================================================
   CRUD (lo usa el panel admin)
========================================================= */

export function crearMascota(datos: NuevaMascota): ResultadoOperacion<Mascota> {
  const errorNombre = validarRequerido(datos.nombre, 'El nombre', 40)
  if (errorNombre) return { ok: false, campo: 'nombre', mensaje: errorNombre }

  const errorRaza = validarRequerido(datos.raza, 'La raza', 40)
  if (errorRaza) return { ok: false, campo: 'raza', mensaje: errorRaza }

  const nueva: Mascota = { ...datos, id: generarIdMascota() }
  const lista = listarMascotas()
  lista.push(nueva)
  guardarColeccion(CLAVES.mascotas, lista)
  return { ok: true, dato: nueva }
}

export function actualizarMascota(id: string, cambios: CambiosMascota): ResultadoOperacion<Mascota> {
  const lista = listarMascotas()
  const indice = lista.findIndex((m) => m.id === id)
  if (indice === -1) return { ok: false, campo: 'id', mensaje: 'La mascota no existe.' }

  if (cambios.nombre !== undefined) {
    const errorNombre = validarRequerido(cambios.nombre, 'El nombre', 40)
    if (errorNombre) return { ok: false, campo: 'nombre', mensaje: errorNombre }
  }

  const actualizada: Mascota = { ...lista[indice], ...cambios }
  lista[indice] = actualizada
  guardarColeccion(CLAVES.mascotas, lista)
  return { ok: true, dato: actualizada }
}

export function eliminarMascota(id: string): boolean {
  const lista = listarMascotas()
  const filtrada = lista.filter((m) => m.id !== id)
  if (filtrada.length === lista.length) return false
  guardarColeccion(CLAVES.mascotas, filtrada)
  return true
}

/* =========================================================
   FILTROS (función pura: se puede probar por separado)
========================================================= */

export function filtrarMascotas(lista: Mascota[], filtros: FiltrosMascotas): Mascota[] {
  const texto = filtros.texto.trim().toLowerCase()
  const favoritos = obtenerFavoritos()
  return lista.filter(
    (m) =>
      (!texto || m.nombre.toLowerCase().includes(texto)) &&
      (!filtros.especie || m.especie === filtros.especie) &&
      (!filtros.soloFavoritas || favoritos.includes(m.id)),
  )
}

/* =========================================================
   FAVORITOS (migrado desde la EP1: localStorage aparte, por id)
========================================================= */

export function obtenerFavoritos(): string[] {
  return leerObjeto<string[]>(CLAVES.favoritosMascotas) ?? []
}

export function esFavorita(id: string): boolean {
  return obtenerFavoritos().includes(id)
}

/** Agrega/quita el id de favoritos y devuelve el nuevo estado (true = quedó como favorita). */
export function alternarFavorita(id: string): boolean {
  const favoritos = obtenerFavoritos()
  const indice = favoritos.indexOf(id)
  if (indice === -1) favoritos.push(id)
  else favoritos.splice(indice, 1)
  guardarObjeto(CLAVES.favoritosMascotas, favoritos)
  return favoritos.includes(id)
}

/* =========================================================
   FICHA/HISTORIAL CLÍNICO
========================================================= */

export function obtenerHistorial(idMascota: string): RegistroClinico[] {
  const todos = leerObjeto<Record<string, RegistroClinico[]>>(CLAVES.historialesMascotas) ?? {}
  return todos[idMascota] ?? []
}

/** Agrega una nueva atención al inicio del historial (lo más reciente primero). */
export function agregarRegistroClinico(idMascota: string, registro: RegistroClinico): void {
  const todos = leerObjeto<Record<string, RegistroClinico[]>>(CLAVES.historialesMascotas) ?? {}
  todos[idMascota] = [registro, ...(todos[idMascota] ?? [])]
  guardarObjeto(CLAVES.historialesMascotas, todos)
}

/* =========================================================
   VACUNAS
========================================================= */

export function obtenerVacunas(idMascota: string): RegistroVacuna[] {
  const todos = leerObjeto<Record<string, RegistroVacuna[]>>(CLAVES.vacunasMascotas) ?? {}
  return todos[idMascota] ?? []
}

export function agregarVacuna(idMascota: string, registro: RegistroVacuna): void {
  const todos = leerObjeto<Record<string, RegistroVacuna[]>>(CLAVES.vacunasMascotas) ?? {}
  todos[idMascota] = [registro, ...(todos[idMascota] ?? [])]
  guardarObjeto(CLAVES.vacunasMascotas, todos)
}

/* =========================================================
   SOLICITUDES DE CAMBIO
========================================================= */

export function listarSolicitudes(): SolicitudCambio[] {
  return leerColeccion<SolicitudCambio>(CLAVES.solicitudesMascotas)
}

export function listarSolicitudesPendientes(): SolicitudCambio[] {
  return listarSolicitudes().filter((s) => s.estado === 'pendiente')
}

/** Solicitud pendiente de una mascota (si el dueño/a ya envió cambios y aún no se resuelven). */
export function obtenerSolicitudPendiente(mascotaId: string): SolicitudCambio | null {
  return listarSolicitudesPendientes().find((s) => s.mascotaId === mascotaId) ?? null
}

/**
 * El dueño/a envía los datos de su mascota. Igual que en la EP1:
 * - si la ficha estaba incompleta, los cambios se aplican directo ('aplicado');
 * - si ya estaba completa, se crea una solicitud pendiente de aprobación ('solicitud').
 */
export function enviarCambiosMascota(
  idMascota: string,
  correoSolicitante: string,
  cambios: CambiosSolicitud,
): ResultadoOperacion<'aplicado' | 'solicitud'> {
  const errorRaza = validarRequerido(cambios.raza, 'La raza', 40)
  if (errorRaza) return { ok: false, campo: 'raza', mensaje: errorRaza }

  const mascota = obtenerMascotaPorId(idMascota)
  if (!mascota) return { ok: false, campo: 'id', mensaje: 'La mascota no existe.' }

  if (!mascota.completo) {
    actualizarMascota(idMascota, { ...cambios, completo: true })
    return { ok: true, dato: 'aplicado' }
  }

  const solicitudes = listarSolicitudes()
  solicitudes.push({
    id: `sol-${Date.now()}`,
    mascotaId: idMascota,
    correoSolicitante,
    cambios,
    estado: 'pendiente',
    fechaSolicitud: new Date().toISOString(),
    fechaResolucion: null,
  })
  guardarColeccion(CLAVES.solicitudesMascotas, solicitudes)
  return { ok: true, dato: 'solicitud' }
}

/** Resuelve una solicitud pendiente. Devuelve false si no existe o ya estaba resuelta. */
function resolverSolicitud(id: string, estado: 'aprobada' | 'rechazada'): boolean {
  const solicitudes = listarSolicitudes()
  const solicitud = solicitudes.find((s) => s.id === id)
  if (!solicitud || solicitud.estado !== 'pendiente') return false

  if (estado === 'aprobada') {
    actualizarMascota(solicitud.mascotaId, { ...solicitud.cambios, completo: true })
  }

  solicitud.estado = estado
  solicitud.fechaResolucion = new Date().toISOString()
  guardarColeccion(CLAVES.solicitudesMascotas, solicitudes)
  return true
}

export const aprobarSolicitud = (id: string) => resolverSolicitud(id, 'aprobada')
export const rechazarSolicitud = (id: string) => resolverSolicitud(id, 'rechazada')