/* =========================================================
   Procesamiento de la foto de perfil (migrado de usuarios.js).
   Recorta la imagen al cuadrado central, la reduce a 200x200
   y la comprime a JPEG 0.8 para que quepa en localStorage
   (evita el error QuotaExceededError).
========================================================= */

export const TAMANO_MAX_AVATAR = 5 * 1024 * 1024 // 5 MB del archivo original
export const AVATAR_LADO_PX = 200

/** Devuelve un mensaje de error si el archivo no sirve como avatar, o null si es válido. */
export function validarArchivoAvatar(archivo: File): string | null {
  if (!archivo.type.startsWith('image/')) return 'Selecciona un archivo de imagen.'
  if (archivo.size > TAMANO_MAX_AVATAR) return 'La imagen es muy pesada. Usa una de menos de 5 MB.'
  return null
}

export function redimensionarImagen(archivo: File, lado = AVATAR_LADO_PX): Promise<string> {
  return new Promise((resolve, reject) => {
    const lector = new FileReader()
    lector.onload = () => {
      const img = new Image()
      img.onload = () => {
        const corte = Math.min(img.width, img.height)
        const offsetX = (img.width - corte) / 2
        const offsetY = (img.height - corte) / 2
        const canvas = document.createElement('canvas')
        canvas.width = lado
        canvas.height = lado
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject(new Error('Canvas no disponible'))
        ctx.drawImage(img, offsetX, offsetY, corte, corte, 0, 0, lado, lado)
        resolve(canvas.toDataURL('image/jpeg', 0.8))
      }
      img.onerror = reject
      img.src = lector.result as string
    }
    lector.onerror = reject
    lector.readAsDataURL(archivo)
  })
}
