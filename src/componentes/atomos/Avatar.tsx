/* ÁTOMO — Avatar: muestra la foto si existe; si no, las iniciales
   (o un emoji de respaldo cuando tampoco hay nombre). */
export interface AvatarProps {
  src?: string
  nombre?: string
  apellidos?: string
  className?: string
}

/** Devuelve las iniciales en mayúscula (ej: "Maria", "Calfileo" -> "MC"). */
export function obtenerIniciales(nombre = '', apellidos = ''): string {
  return `${nombre.trim()[0] ?? ''}${apellidos.trim()[0] ?? ''}`.toUpperCase()
}

/** Muestra la foto de perfil; si no hay, las iniciales; si tampoco hay nombre, una huellita. */
export function Avatar({ src, nombre = '', apellidos = '', className = '' }: AvatarProps) {
  const iniciales = obtenerIniciales(nombre, apellidos)
  return (
    <div className={className}>
      {src ? (
        <img src={src} alt={`Foto de ${nombre}`.trim()} />
      ) : (
        <span aria-label="Sin foto de perfil">{iniciales || '🐾'}</span>
      )}
    </div>
  )
}
