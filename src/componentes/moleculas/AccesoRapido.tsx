/* MOLÉCULA — Acceso rápido del panel admin (ícono + título + descripción + flecha).
   Navega con "to" o ejecuta una acción con "onClick". */
import { Link } from 'react-router-dom'

export interface AccesoRapidoProps {
  icono: string // emoji o ruta de imagen (/img/...)
  titulo: string
  descripcion: string
  to?: string
  onClick?: () => void
}

export function AccesoRapido({ icono, titulo, descripcion, to, onClick }: AccesoRapidoProps) {
  const contenido = (
    <>
      <div className="admin-acceso-icono">
        {icono.startsWith('/') ? <img src={icono} alt="" className="admin-usuarios-accion-icono" /> : icono}
      </div>
      <div>
        <h3>{titulo}</h3>
        <p>{descripcion}</p>
      </div>
      <span className="admin-acceso-flecha" aria-hidden="true">
        →
      </span>
    </>
  )
  if (to) {
    return (
      <Link to={to} className="admin-acceso">
        {contenido}
      </Link>
    )
  }
  return (
    <button type="button" className="admin-acceso admin-acceso--boton" onClick={onClick}>
      {contenido}
    </button>
  )
}
