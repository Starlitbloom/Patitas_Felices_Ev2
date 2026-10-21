/* ORGANISMO — Grilla responsiva de tarjetas del equipo.
   Bootstrap: 1 columna en móvil (col-12), 2 en tablet (col-md-6), 3 en computador (col-lg-4).
   Si no hay resultados, muestra un mensaje en lugar de la grilla. */
import type { Veterinario } from '../../types/veterinario'
import { TarjetaVeterinario } from '../moleculas/TarjetaVeterinario'

export interface GrillaEquipoProps {
  veterinarios: Veterinario[]
}

export function GrillaEquipo({ veterinarios }: GrillaEquipoProps) {
  if (veterinarios.length === 0) {
    return <p className="equipo-vacio">No encontramos profesionales con esos filtros. Prueba con otra combinación.</p>
  }
  return (
    <div className="row g-4">
      {veterinarios.map((v) => (
        <div key={v.id} className="col-12 col-md-6 col-lg-4" data-testid="columna-veterinario">
          <TarjetaVeterinario veterinario={v} />
        </div>
      ))}
    </div>
  )
}
