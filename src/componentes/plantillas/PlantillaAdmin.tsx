/* PLANTILLA — Estructura del panel admin: menú lateral + contenido.
   En móviles agrega un botón ☰ para abrir el menú (Offcanvas de Bootstrap). */
import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { BarraLateralAdmin } from '../organismos/BarraLateralAdmin'

export function PlantillaAdmin() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const { cerrarSesion } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="admin-body">
      <div className="admin-layout">
        <BarraLateralAdmin
          abierta={menuAbierto}
          onCerrar={() => setMenuAbierto(false)}
          onCerrarSesion={() => {
            cerrarSesion()
            navigate('/login')
          }}
        />
        <main className="admin-contenido">
          <button
            type="button"
            className="admin-boton-menu d-lg-none"
            onClick={() => setMenuAbierto(true)}
            aria-label="Abrir menú del panel"
          >
            ☰ Menú
          </button>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
