/* =========================================================
   Validaciones de formularios (migradas desde usuarios.js).
   Todas siguen el mismo contrato:
     - devuelven null si el valor es válido
     - devuelven un string con el mensaje de error si no lo es
   Son funciones puras (no tocan el DOM), por eso se pueden
   reutilizar en cualquier formulario y probar fácilmente.
========================================================= */

/** Dominios de correo aceptados por el caso. */
export const DOMINIOS_PERMITIDOS = ['duoc.cl', 'profesor.duoc.cl', 'gmail.com']

export function validarCorreo(correo: string): string | null {
  const valor = correo.trim()
  if (!valor) return 'El correo es obligatorio.'
  if (valor.length > 100) return 'El correo no puede superar los 100 caracteres.'
  const partes = valor.split('@')
  if (partes.length !== 2 || !partes[0]) return 'Ingresa un correo válido.'
  if (!DOMINIOS_PERMITIDOS.includes(partes[1].toLowerCase())) {
    return 'Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.'
  }
  return null
}

export function validarPassword(password: string): string | null {
  if (!password) return 'La contraseña es obligatoria.'
  if (password.length < 4 || password.length > 10) {
    return 'La contraseña debe tener entre 4 y 10 caracteres.'
  }
  return null
}

/** Valida que la confirmación sea igual a la contraseña. */
export function validarConfirmacion(password: string, confirmacion: string): string | null {
  return password !== confirmacion ? 'Las contraseñas no coinciden.' : null
}

/** Quita puntos y guion y pasa a mayúsculas: "19.011.022-2" → "190110222". */
export function limpiarRun(run: string): string {
  return run.replace(/\./g, '').replace(/-/g, '').trim().toUpperCase()
}

/**
 * Calcula el dígito verificador de un RUN chileno (algoritmo módulo 11)
 * y lo compara con el que trae el RUN. Recibe el RUN ya limpio.
 */
export function validarDigitoVerificador(runLimpio: string): boolean {
  const cuerpo = runLimpio.slice(0, -1)
  const dv = runLimpio.slice(-1).toUpperCase()
  if (!/^\d+$/.test(cuerpo)) return false

  let suma = 0
  let multiplo = 2
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * multiplo
    multiplo = multiplo === 7 ? 2 : multiplo + 1
  }
  const resto = 11 - (suma % 11)
  const dvEsperado = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto)
  return dv === dvEsperado
}

export function validarRun(run: string): string | null {
  if (!run.trim()) return 'El RUN es obligatorio.'
  const limpio = limpiarRun(run)
  if (limpio.length < 7 || limpio.length > 9) {
    return 'El RUN debe tener entre 7 y 9 caracteres, sin puntos ni guion.'
  }
  if (!validarDigitoVerificador(limpio)) return 'El RUN ingresado no es válido.'
  return null
}

/**
 * Validador genérico de campos obligatorios.
 * @param nombreCampo texto que se usa en el mensaje, ej: "El nombre"
 * @param maxLength largo máximo (opcional)
 */
export function validarRequerido(valor: string, nombreCampo: string, maxLength?: number): string | null {
  // "Los apellidos" → "son obligatorios"; "La región" → "es obligatoria"
  const plural = /^(Los|Las) /.test(nombreCampo)
  const femenino = /^(La|Las) /.test(nombreCampo)
  const obligatorio = `obligatori${femenino ? 'a' : 'o'}${plural ? 's' : ''}`
  if (!valor || valor.trim().length === 0) return `${nombreCampo} ${plural ? 'son' : 'es'} ${obligatorio}.`
  if (maxLength && valor.length > maxLength) {
    return `${nombreCampo} no ${plural ? "pueden" : "puede"} superar los ${maxLength} caracteres.`
  }
  return null
}

/** Teléfono opcional: si viene, debe tener solo dígitos, espacios o "+" (8 a 15 caracteres). */
export function validarTelefono(telefono: string): string | null {
  const valor = telefono.trim()
  if (!valor) return null
  if (!/^\+?[\d\s]{8,15}$/.test(valor)) return 'Ingresa un teléfono válido (solo números, 8 a 15 dígitos).'
  return null
}

/** true si el objeto de errores tiene al menos un mensaje. */
export function hayErrores(errores: Record<string, string | null | undefined>): boolean {
  return Object.values(errores).some((e) => e)
}
