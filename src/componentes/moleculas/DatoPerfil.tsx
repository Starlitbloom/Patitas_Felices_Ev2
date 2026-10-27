/* MOLÉCULA — Fila "etiqueta: valor" de la vista de solo lectura del perfil. */
export interface DatoPerfilProps {
  etiqueta: string
  valor?: string
  /** Texto cuando el valor está vacío. */
  vacio?: string
}

/** Fila "etiqueta: valor" del perfil; si el valor está vacío muestra un guion. */
export function DatoPerfil({ etiqueta, valor, vacio = '—' }: DatoPerfilProps) {
  return (
    <div className="perfil-dato-fila">
      <span className="perfil-dato-fila-label">{etiqueta}</span>
      <span className="perfil-dato-fila-valor">{valor?.trim() ? valor : vacio}</span>
    </div>
  )
}
