/* =========================================================
   sesionService — inicio y cierre de sesión.
   La sesión se guarda en localStorage SIN la contraseña.
========================================================= */
import type { ResultadoOperacion, Usuario, UsuarioSesion } from '../types/usuario'
import { CLAVES, borrar, guardarObjeto, leerObjeto } from './almacenamiento'
import { obtenerUsuarioPorCorreo } from './usuariosService'

/** Quita la contraseña antes de guardar el usuario como sesión. */
export function aSesion(usuario: Usuario): UsuarioSesion {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...sinPassword } = usuario
  return sinPassword
}

export function obtenerSesion(): UsuarioSesion | null {
  return leerObjeto<UsuarioSesion>(CLAVES.sesion)
}

export function guardarSesion(usuario: Usuario): UsuarioSesion {
  const sesion = aSesion(usuario)
  guardarObjeto(CLAVES.sesion, sesion)
  return sesion
}

export function cerrarSesion(): void {
  borrar(CLAVES.sesion)
}

/**
 * Verifica correo y contraseña. Si son correctos guarda la sesión.
 * Devuelve el campo con problema para mostrar el error junto a él.
 */
export function autenticar(correo: string, password: string): ResultadoOperacion<UsuarioSesion> {
  const usuario = obtenerUsuarioPorCorreo(correo)
  if (!usuario) {
    return { ok: false, campo: 'correo', mensaje: 'No existe una cuenta registrada con este correo.' }
  }
  if (usuario.password !== password) {
    return { ok: false, campo: 'password', mensaje: 'Contraseña incorrecta.' }
  }
  if (usuario.activo === false) {
    return { ok: false, campo: 'correo', mensaje: 'Tu cuenta está desactivada. Contacta a la clínica.' }
  }
  return { ok: true, dato: guardarSesion(usuario) }
}
