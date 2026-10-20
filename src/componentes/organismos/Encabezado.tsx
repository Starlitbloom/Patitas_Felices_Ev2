/* ORGANISMO — Encabezado del sitio público.
   Usa el Navbar de Bootstrap (react-bootstrap) para que en móviles y
   tablets el menú se colapse en un botón hamburguesa.
   Es un componente de PRESENTACIÓN: recibe por props si hay sesión. */
import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar'

export interface EncabezadoProps {
  sesionActiva: boolean
  esAdmin: boolean
  /** Header transparente que flota sobre el hero (solo en Inicio). */
  flotante?: boolean
}

interface EnlaceMenu {
  to: string
  texto: string
  soloSesion?: boolean
}

const ENLACES: EnlaceMenu[] = [
  { to: '/', texto: 'Inicio' },
  { to: '/nosotros', texto: 'Nosotros' },
  { to: '/equipo', texto: 'Equipo' },
  { to: '/mascotas', texto: 'Mascotas', soloSesion: true },
  { to: '/novedades', texto: 'Novedades' },
  { to: '/contacto', texto: 'Contacto' },
  { to: '/perfil', texto: 'Mi perfil', soloSesion: true },
]

export function Encabezado({ sesionActiva, esAdmin, flotante = false }: EncabezadoProps) {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [conSombra, setConSombra] = useState(false)

  // Sombra detrás del header flotante al hacer scroll (antes en index-interactivo.js)
  useEffect(() => {
    if (!flotante) return
    const actualizar = () => setConSombra(window.scrollY > 40)
    actualizar()
    window.addEventListener('scroll', actualizar, { passive: true })
    return () => window.removeEventListener('scroll', actualizar)
  }, [flotante])

  const cerrarMenu = () => setMenuAbierto(false)
  const claseEnlace = ({ isActive }: { isActive: boolean }) => (isActive ? 'activo' : undefined)

  // "Iniciar sesión" para visitantes; para usuarios conectados, su sección principal
  const cuenta = !sesionActiva
    ? { to: '/login', texto: 'Iniciar sesión' }
    : esAdmin
      ? { to: '/admin', texto: 'Panel admin' }
      : { to: '/mis-citas', texto: 'Mis citas' }

  return (
    <>
      <header className={`header-principal ${menuAbierto ? 'header-principal--abierto' : ''}`.trim()}>
        <div className="fondo-header fondo-izquierdo" />
        <div className="fondo-header fondo-derecho" />

        <Navbar as="div" expand="lg" expanded={menuAbierto} onToggle={setMenuAbierto} className="contenedor-header">
          <Link to="/" className="logo-enlace" onClick={cerrarMenu}>
            <img src="/img/logo-patitas.png" alt="Logo Veterinaria Patitas Felices" className="logo" />
          </Link>

          <Navbar.Toggle aria-controls="menu-principal" aria-label="Abrir menú" className="boton-menu" />

          <Navbar.Collapse id="menu-principal" className="menu-principal">
            <nav aria-label="Navegación principal">
              <ul>
                {ENLACES.filter((e) => !e.soloSesion || sesionActiva).map((e) => (
                  <li key={e.to}>
                    <NavLink to={e.to} end={e.to === '/'} className={claseEnlace} onClick={cerrarMenu}>
                      {e.texto}
                    </NavLink>
                  </li>
                ))}
                <li>
                  <NavLink to={cuenta.to} className={claseEnlace} onClick={cerrarMenu}>
                    {cuenta.texto}
                  </NavLink>
                </li>
                <li>
                  <Link to="/solicitar-cita" className="btn-cita" onClick={cerrarMenu}>
                    <img src="/img/calendario.png" alt="" className="icono-calendario" />
                    <span>Solicitar cita</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </Navbar.Collapse>
        </Navbar>
      </header>
      {flotante && <div className={`header-sombra ${conSombra ? 'visible' : ''}`.trim()} />}
    </>
  )
}
