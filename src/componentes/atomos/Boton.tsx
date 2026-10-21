/* ÁTOMO — Botón reutilizable.
   Una sola pieza para todos los botones del sitio: la "variante"
   decide qué clase CSS de la EP1 se aplica. */
import type { ReactNode } from 'react'

export type VarianteBoton =
  | 'principal' // botón morado del sitio público
  | 'degradado' // botón principal con degradado (login)
  | 'limpiar' // botón secundario del panel admin
  | 'exportar' // botón de exportar del panel admin
  | 'ver'
  | 'editar'
  | 'eliminar'
  | 'accion' // botón de acción admin genérico

const CLASES: Record<VarianteBoton, string> = {
  principal: 'boton-principal',
  degradado: 'boton-principal boton-principal--degradado',
  limpiar: 'admin-btn-limpiar',
  exportar: 'admin-btn-exportar',
  ver: 'admin-btn-accion admin-btn-accion--ver',
  editar: 'admin-btn-accion admin-btn-accion--editar',
  eliminar: 'admin-btn-accion admin-btn-accion--eliminar',
  accion: 'admin-btn-accion',
}

export interface BotonProps {
  children: ReactNode
  variante?: VarianteBoton
  type?: 'button' | 'submit'
  onClick?: () => void
  disabled?: boolean
  /** Muestra la flecha ⟶ al final (estilo de la EP1). */
  flecha?: boolean
  title?: string
  className?: string
  'aria-label'?: string
}

export function Boton({
  children,
  variante = 'principal',
  type = 'button',
  onClick,
  disabled = false,
  flecha = false,
  title,
  className = '',
  'aria-label': ariaLabel,
}: BotonProps) {
  return (
    <button
      type={type}
      className={`${CLASES[variante]} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel}
    >
      <span>{children}</span>
      {flecha && (
        <span className="flecha-boton" aria-hidden="true">
          ⟶
        </span>
      )}
    </button>
  )
}
