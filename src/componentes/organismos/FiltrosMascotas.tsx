/* ORGANISMO — Filtros del catálogo "Mis mascotas".
   Acá el filtro activo es un objeto de estado (FiltrosMascotas)
   que vive en la página; este componente solo lo muestra y
   avisa los cambios con onCambio, igual que FiltrosEquipo. */
import { ESPECIES_MASCOTA } from '../../types/mascota'
import type { FiltrosMascotas as Filtros } from '../../types/mascota'

export interface FiltrosMascotasProps {
  filtros: Filtros
  onCambio: (filtros: Filtros) => void
  onLimpiar: () => void
}

export function FiltrosMascotas({ filtros, onCambio, onLimpiar }: FiltrosMascotasProps) {
  return (
    <form className="mascotas-filtros row g-3 align-items-end" role="search" onSubmit={(e) => e.preventDefault()}>
      <div className="col-12 col-lg-4 campo mb-0">
        <label htmlFor="mascotas-buscar">Buscar por nombre</label>
        <input
          id="mascotas-buscar"
          type="search"
          value={filtros.texto}
          placeholder="Ej: Rocky"
          onChange={(e) => onCambio({ ...filtros, texto: e.target.value })}
        />
      </div>

      <div className="col-12 col-lg-8">
        <div className="filtros-mascotas mb-0">
          <button
            type="button"
            className={`filtro-especie ${filtros.especie === '' ? 'activo' : ''}`}
            onClick={() => onCambio({ ...filtros, especie: '' })}
          >
            Todas
          </button>

          {ESPECIES_MASCOTA.map((especie) => (
            <button
              key={especie}
              type="button"
              className={`filtro-especie ${filtros.especie === especie ? 'activo' : ''}`}
              onClick={() => onCambio({ ...filtros, especie })}
            >
              {especie}
            </button>
          ))}

          <button
            type="button"
            className={`filtro-especie ${filtros.soloFavoritas ? 'activo' : ''}`}
            onClick={() => onCambio({ ...filtros, soloFavoritas: !filtros.soloFavoritas })}
            aria-pressed={filtros.soloFavoritas}
          >
            ♥ Favoritas
          </button>

          <button type="button" className="equipo-limpiar" onClick={onLimpiar}>
            Limpiar
          </button>
        </div>
      </div>
    </form>
  )
}