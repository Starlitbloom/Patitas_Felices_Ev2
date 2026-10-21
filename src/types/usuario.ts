/* =========================================================
   Tipos del módulo de usuarios.
   Centralizar los tipos aquí permite que servicios, páginas
   y componentes hablen "el mismo idioma" y que TypeScript
   avise si falta un campo o se usa uno que no existe.
========================================================= */

/**
 * Roles del sistema (control de acceso basado en roles, según el caso):
 * - admin: gestiona todo el sistema, incluidos usuarios y reportes
 * - recepcionista: personal de la clínica; gestiona citas y fichas, NO usuarios
 * - cliente: dueño/a de mascota
 */
export type Rol = 'cliente' | 'recepcionista' | 'admin'

/** Texto para mostrar cada rol en pantalla. */
export const NOMBRE_ROL: Record<Rol, string> = {
  admin: 'Administrador',
  recepcionista: 'Recepcionista',
  cliente: 'Dueño/a de mascota',
}

/** Usuario tal como se guarda en la fuente de datos (localStorage). */
export interface Usuario {
  id: string
  run: string
  nombre: string
  apellidos: string
  correo: string
  password: string
  telefono: string
  region: string
  comuna: string
  direccion: string
  rol: Rol
  activo: boolean
  avatar?: string // foto comprimida en base64 (opcional)
  fechaRegistro: string // ISO, la usa el KPI "Nuevos esta semana"
}

/** Datos necesarios para crear un usuario (el servicio genera id y fecha). */
export type NuevoUsuario = Omit<Usuario, 'id' | 'fechaRegistro' | 'avatar'>

/** Campos que se pueden modificar de un usuario existente. */
export type CambiosUsuario = Partial<Omit<Usuario, 'id' | 'fechaRegistro'>>

/** Usuario en sesión: igual que Usuario pero SIN la contraseña. */
export type UsuarioSesion = Omit<Usuario, 'password'>

/** Opciones de orden del listado del panel admin. */
export type OrdenUsuarios = 'recientes' | 'az' | 'za'

/** Filtros de búsqueda del listado de usuarios. */
export interface FiltrosUsuarios {
  texto: string
  rol: '' | Rol
  orden: OrdenUsuarios
}

/**
 * Resultado de una operación del servicio. Si falla, indica qué campo
 * causó el problema para mostrar el mensaje junto a ese campo.
 */
export type ResultadoOperacion<T> =
  | { ok: true; dato: T }
  | { ok: false; campo: string; mensaje: string }

/** Mapa campo → mensaje de error (null = sin error). */
export type ErroresFormulario<C extends string> = Partial<Record<C, string | null>>
