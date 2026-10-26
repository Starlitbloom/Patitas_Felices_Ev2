/* ORGANISMO — Menú lateral del panel admin.
   Usa el Offcanvas de Bootstrap con responsive="lg":
   - en computador (≥ 992px) se ve fijo a la izquierda, como en la EP1
   - en tablet/móvil se oculta y se abre como panel deslizable
   El menú depende del rol: la recepcionista no ve Usuarios ni Reportes. */
import { NavLink } from 'react-router-dom'
import Offcanvas from 'react-bootstrap/Offcanvas'

export interface BarraLateralAdminProps {
  /** true = administrador; false = recepcionista */
  esAdmin: boolean
  abierta: boolean
  onCerrar: () => void
  onCerrarSesion: () => void
}

const ITEMS = [
  { to: '/admin', texto: 'Dashboard', icono: '/img/icono-admin-dashboard.png', end: true },
  { to: '/admin/usuarios', texto: 'Usuarios', icono: '/img/icono-admin-usuarios.png', soloAdmin: true },
  { to: '/admin/mascotas', texto: 'Mascotas', icono: '🐾' },
  { to: '/admin/citas', texto: 'Citas', icono: '/img/icono-admin-citas.png' },
  { to: '/admin/agenda', texto: 'Agenda', icono: '📅' },
  { to: '/admin/reportes', texto: 'Reportes', icono: '/img/icono-admin-reportes.png', soloAdmin: true },
  { to: '/', texto: 'Ver sitio', icono: '/img/icono-admin-ver-sitio.png', end: true },
]

function Icono({ icono }: { icono: string }) {
  return icono.startsWith('/') ? (
    <img src={icono} alt="" className="admin-nav-icono" />
  ) : (
    <span className="admin-nav-icono admin-nav-icono--emoji" aria-hidden="true">
      {icono}
    </span>
  )
}

export function BarraLateralAdmin({ esAdmin, abierta, onCerrar, onCerrarSesion }: BarraLateralAdminProps) {
  const clase = ({ isActive }: { isActive: boolean }) =>
    `admin-nav-item ${isActive ? 'admin-nav-item--activo' : ''}`.trim()

  return (
    <Offcanvas show={abierta} onHide={onCerrar} responsive="lg" className="admin-sidebar" aria-label="Menú admin">
      <Offcanvas.Header closeButton closeVariant="white" className="d-lg-none p-0" />
      <div className="admin-sidebar-logo">
        <img src="/img/logo-patitas.png" alt="Logo Patitas Felices" />
        <span>Patitas Felices</span>
      </div>
      <p className="admin-sidebar-rol">{esAdmin ? 'Admin' : 'Recepción'}</p>
      <nav className="admin-nav" aria-label="Navegación del panel">
        {ITEMS.filter((item) => esAdmin || !item.soloAdmin).map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={clase} onClick={onCerrar}>
            <Icono icono={item.icono} />
            <span>{item.texto}</span>
          </NavLink>
        ))}
        <button type="button" className="admin-nav-item admin-nav-item--salir" onClick={onCerrarSesion}>
          <Icono icono="/img/icono-admin-cerrar-sesion.png" />
          <span>Cerrar sesión</span>
        </button>
      </nav>
    </Offcanvas>
  )
}
