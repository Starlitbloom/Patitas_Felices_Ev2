/* ORGANISMO — Barra superior morada de cada página del panel. */
import type { ReactNode } from 'react'

export function EncabezadoAdmin({ children }: { children: ReactNode }) {
  return (
    <header className="admin-topbar">
      <div className="admin-topbar-fondo" />
      <div className="admin-topbar-contenido">
        <p className="admin-topbar-etiqueta">Panel de administración</p>
        <h1>{children}</h1>
      </div>
    </header>
  )
}
