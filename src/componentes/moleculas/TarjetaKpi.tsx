/* MOLÉCULA — Tarjeta de indicador (KPI) del panel admin.
   Si recibe "to", la tarjeta completa funciona como enlace. */
import { Link } from 'react-router-dom'

/** Props del indicador: ícono, número, texto y enlace opcional. */
export interface TarjetaKpiProps {
  icono: string
  numero: number
  etiqueta: string
  to?: string
}

/** Tarjeta de indicador (KPI) del panel. Si recibe "to", toda la tarjeta es un enlace. */
export function TarjetaKpi({ icono, numero, etiqueta, to }: TarjetaKpiProps) {
  const contenido = (
    <>
      <div className="admin-kpi-cabecera">
        <span className="admin-kpi-icono" aria-hidden="true">
          {icono}
        </span>
      </div>
      <span className="admin-kpi-numero">{numero}</span>
      <span className="admin-kpi-label">{etiqueta}</span>
    </>
  )
  return to ? (
    <Link to={to} className="admin-kpi admin-kpi--enlace">
      {contenido}
    </Link>
  ) : (
    <div className="admin-kpi">{contenido}</div>
  )
}
