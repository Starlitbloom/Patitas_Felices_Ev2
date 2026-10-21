/* PLANTILLA — Estructura del sitio público: Encabezado + página + Pie.
   <Outlet /> es el "hueco" donde React Router dibuja la página actual.
   Es el contenedor del Encabezado: le pasa los datos de sesión por props. */
import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Encabezado } from '../organismos/Encabezado'
import { PiePagina } from '../organismos/PiePagina'

export function PlantillaPublica() {
  const { usuario, esPersonal } = useAuth()
  const { pathname } = useLocation()
  const esInicio = pathname === '/'

  // Al cambiar de página, volver arriba (en un sitio de varias páginas HTML esto pasaba solo)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className={`pagina ${esInicio ? 'pagina--inicio' : ''}`.trim()}>
      <Encabezado sesionActiva={!!usuario} accesoPanel={esPersonal} flotante={esInicio} />
      <Outlet />
      <PiePagina />
    </div>
  )
}
