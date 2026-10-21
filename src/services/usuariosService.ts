/* =========================================================
   usuariosService — fuente de datos simulada del módulo de usuarios.
   Implementa el CRUD completo sobre localStorage:
     C → crearUsuario
     R → listarUsuarios / obtenerUsuarioPorId / obtenerUsuarioPorCorreo
     U → actualizarUsuario
     D → eliminarUsuario
   Además: filtros de búsqueda y carga de datos iniciales.
   Las páginas NUNCA leen localStorage directamente: siempre
   pasan por este módulo.
========================================================= */
import type {
  CambiosUsuario,
  FiltrosUsuarios,
  NuevoUsuario,
  ResultadoOperacion,
  Usuario,
} from '../types/usuario'
import { ADMINS_FIJOS, CLIENTES_EJEMPLO } from '../data/usuariosIniciales'
import { CLAVES, guardarColeccion, leerColeccion } from './almacenamiento'
import { limpiarRun } from '../utils/validaciones'

/** Genera un id único y corto (ej: "u-lz3k9a-4f2c"). */
export function generarId(): string {
  return `u-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

const mismoCorreo = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase()

/* ---------------- LEER (Read) ---------------- */

export function listarUsuarios(): Usuario[] {
  return leerColeccion<Usuario>(CLAVES.usuarios)
}

export function obtenerUsuarioPorId(id: string): Usuario | null {
  return listarUsuarios().find((u) => u.id === id) ?? null
}

export function obtenerUsuarioPorCorreo(correo: string): Usuario | null {
  return listarUsuarios().find((u) => u.correo && mismoCorreo(u.correo, correo)) ?? null
}

/* ---------------- CREAR (Create) ---------------- */

export function crearUsuario(datos: NuevoUsuario): ResultadoOperacion<Usuario> {
  const usuarios = listarUsuarios()

  if (usuarios.some((u) => mismoCorreo(u.correo, datos.correo))) {
    return { ok: false, campo: 'correo', mensaje: 'Ya existe una cuenta registrada con este correo.' }
  }
  if (usuarios.some((u) => limpiarRun(u.run) === limpiarRun(datos.run))) {
    return { ok: false, campo: 'run', mensaje: 'Ya existe una cuenta registrada con este RUN.' }
  }

  const nuevo: Usuario = {
    ...datos,
    correo: datos.correo.trim(),
    id: generarId(),
    fechaRegistro: new Date().toISOString(),
  }
  guardarColeccion(CLAVES.usuarios, [...usuarios, nuevo])
  return { ok: true, dato: nuevo }
}

/* ---------------- ACTUALIZAR (Update) ---------------- */

export function actualizarUsuario(id: string, cambios: CambiosUsuario): ResultadoOperacion<Usuario> {
  const usuarios = listarUsuarios()
  const indice = usuarios.findIndex((u) => u.id === id)
  if (indice === -1) {
    return { ok: false, campo: 'id', mensaje: 'El usuario no existe.' }
  }

  // El nuevo correo no puede pertenecer a OTRO usuario
  if (cambios.correo && usuarios.some((u) => u.id !== id && mismoCorreo(u.correo, cambios.correo!))) {
    return { ok: false, campo: 'correo', mensaje: 'Ese correo ya está en uso por otra cuenta.' }
  }

  // Si la contraseña viene vacía se conserva la anterior
  const { password, ...resto } = cambios
  const actualizado: Usuario = {
    ...usuarios[indice],
    ...resto,
    ...(password ? { password } : {}),
  }
  const copia = [...usuarios]
  copia[indice] = actualizado
  guardarColeccion(CLAVES.usuarios, copia)
  return { ok: true, dato: actualizado }
}

/* ---------------- ELIMINAR (Delete) ---------------- */

/** Devuelve true si se eliminó, false si el id no existía. */
export function eliminarUsuario(id: string): boolean {
  const usuarios = listarUsuarios()
  const restantes = usuarios.filter((u) => u.id !== id)
  if (restantes.length === usuarios.length) return false
  guardarColeccion(CLAVES.usuarios, restantes)
  return true
}

/* ---------------- FILTROS DE BÚSQUEDA ---------------- */

/**
 * Aplica búsqueda por texto (RUN, nombre, apellidos o correo),
 * filtro por rol y orden. No modifica el arreglo original.
 */
export function filtrarUsuarios(usuarios: Usuario[], filtros: FiltrosUsuarios): Usuario[] {
  const texto = filtros.texto.trim().toLowerCase()
  let resultado = usuarios.filter((u) => {
    const coincideTexto =
      !texto || `${u.run} ${u.nombre} ${u.apellidos} ${u.correo}`.toLowerCase().includes(texto)
    const coincideRol = !filtros.rol || u.rol === filtros.rol
    return coincideTexto && coincideRol
  })

  if (filtros.orden === 'az') {
    resultado = [...resultado].sort((a, b) => a.nombre.localeCompare(b.nombre))
  } else if (filtros.orden === 'za') {
    resultado = [...resultado].sort((a, b) => b.nombre.localeCompare(a.nombre))
  } else {
    resultado = [...resultado].sort((a, b) => b.fechaRegistro.localeCompare(a.fechaRegistro))
  }
  return resultado
}

/* ---------------- DATOS INICIALES ---------------- */

/**
 * Se ejecuta al iniciar la app:
 * 1. Si no hay usuarios, carga los datos de ejemplo.
 * 2. Completa campos faltantes de usuarios antiguos de la EP1 (id, activo, fecha).
 * 3. Garantiza que las cuentas admin fijas existan con su rol y contraseña.
 */
export function asegurarDatosIniciales(): void {
  let usuarios = listarUsuarios()
  if (usuarios.length === 0) {
    usuarios = [...ADMINS_FIJOS, ...CLIENTES_EJEMPLO]
  }

  usuarios = usuarios.map((u) => ({
    ...u,
    id: u.id ?? generarId(),
    rol: u.rol ?? 'cliente',
    activo: u.activo !== false,
    fechaRegistro: u.fechaRegistro ?? new Date(0).toISOString(),
    telefono: u.telefono ?? '',
    region: u.region ?? '',
    comuna: u.comuna ?? '',
    direccion: u.direccion ?? '',
  }))

  ADMINS_FIJOS.forEach((admin) => {
    const existente = usuarios.find((u) => u.correo && mismoCorreo(u.correo, admin.correo))
    if (existente) {
      existente.rol = 'admin'
      existente.password = admin.password
      existente.activo = true
    } else {
      usuarios.push(admin)
    }
  })

  guardarColeccion(CLAVES.usuarios, usuarios)
}
