/* ÁTOMO — Enlace con apariencia de botón (usa Link de React Router).
   Ej.: botón "Volver al equipo" del detalle (variante secundaria). */
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export interface EnlaceBotonProps {
  to: string
  children: ReactNode
  variante?: 'principal' | 'secundario'
}

export function EnlaceBoton({ to, children, variante = 'principal' }: EnlaceBotonProps) {
  return (
    <Link to={to} className={variante === 'principal' ? 'boton-principal' : 'boton-principal boton-secundario'}>
      {children}
    </Link>
  )
}
