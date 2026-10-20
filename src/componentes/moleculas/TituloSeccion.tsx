/* MOLÉCULA — Encabezado de sección (etiqueta + título + bajada opcional). */
import { Etiqueta } from '../atomos/Etiqueta'

export interface TituloSeccionProps {
  etiqueta: string
  titulo: string
  descripcion?: string
}

export function TituloSeccion({ etiqueta, titulo, descripcion }: TituloSeccionProps) {
  return (
    <div className="titulo-seccion">
      <Etiqueta>{etiqueta}</Etiqueta>
      <h2>{titulo}</h2>
      {descripcion && <p>{descripcion}</p>}
    </div>
  )
}
