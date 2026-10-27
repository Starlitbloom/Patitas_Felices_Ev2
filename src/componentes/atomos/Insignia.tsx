/* ÁTOMO — Insignia (badge) de rol o estado. */
export type TipoInsignia = 'admin' | 'recepcionista' | 'cliente' | 'activo' | 'inactivo'

/** Props de la insignia: tipo (define el color) y texto opcional. */
export interface InsigniaProps {
  tipo: TipoInsignia
  /** Texto a mostrar; por defecto el mismo tipo. */
  texto?: string
}

/** Badge de rol o estado (admin, recepcionista, cliente, activo, inactivo). */
export function Insignia({ tipo, texto }: InsigniaProps) {
  return <span className={`admin-badge admin-badge--${tipo}`}>{texto ?? tipo}</span>
}
