/* Guardia de rutas (reemplaza protegerRutaAdmin() de la EP1).
   - Sin sesión → redirige a /login
   - Ruta solo para admin y el usuario no lo es → redirige al inicio */
import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export interface RutaProtegidaProps {
  children: ReactNode
  soloAdmin?: boolean
}

export function RutaProtegida({ children, soloAdmin = false }: RutaProtegidaProps) {
  const { usuario, esAdmin } = useAuth()
  const location = useLocation()

  if (!usuario) return <Navigate to="/login" replace state={{ desde: location.pathname }} />
  if (soloAdmin && !esAdmin) return <Navigate to="/" replace />
  return <>{children}</>
}
