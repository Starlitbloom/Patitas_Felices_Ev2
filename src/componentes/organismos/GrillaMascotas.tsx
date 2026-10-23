/* ORGANISMO — Grilla responsiva de tarjetas de mascota.
   recibe la lista YA FILTRADA
   (la página hace el filtrado llamando a filtrarMascotas()) y
   solo se encarga de pintarla, o mostrar un mensaje si no hay
   resultados. */
import type { Mascota } from '../../types/mascota'
import { TarjetaMascota } from '../moleculas/TarjetaMascota'

export interface GrillaMascotasProps {
  mascotas: Mascota[]
  favoritos: string[]
  onAlternarFavorita: (id: string) => void
}

export function GrillaMascotas({ mascotas, favoritos, onAlternarFavorita }: GrillaMascotasProps) {
  if (mascotas.length === 0) {
    return <p className="grid-mascotas-vacio">No hay mascotas registradas para este filtro.</p>
  }

  return (
    <div className="grid-mascotas">
      {mascotas.map((mascota) => (
        <TarjetaMascota
          key={mascota.id}
          mascota={mascota}
          favorita={favoritos.includes(mascota.id)}
          onAlternarFavorita={onAlternarFavorita}
        />
      ))}
    </div>
  )
}