/* ORGANISMO — Filtros del catálogo "Mis mascotas".
   El filtro activo vive en la página (objeto de estado); este componente
   solo lo muestra y avisa los cambios con onCambio, igual que FiltrosEquipo. */
import { ESPECIES_MASCOTA } from '../../types/mascota'
import type { Especie, FiltrosMascotas as Filtros } from '../../types/mascota'

export interface FiltrosMascotasProps {
  filtros: Filtros
  onCambio: (filtros: Filtros) => void
  onLimpiar: () => void
}

/* Texto de cada botón en plural */
const TEXTO_ESPECIE: Record<Especie, string> = {
  Perro: 'Perros',
  Gato: 'Gatos',
  Conejo: 'Conejos',
  Ave: 'Aves',
}

export function FiltrosMascotas({ filtros, onCambio, onLimpiar }: FiltrosMascotasProps) {
  return (
    <form className="contenedor-filtros-mascotas" role="search" onSubmit={(e) => e.preventDefault()}>
      <span className="filtros-mascotas-titulo">Filtrar por</span>

      <input
        id="mascotas-buscar"
        type="search"
        className="filtro-buscar-mascotas"
        value={filtros.texto}
        placeholder="Buscar por nombre"
        aria-label="Buscar mascota por nombre"
        onChange={(e) => onCambio({ ...filtros, texto: e.target.value })}
      />

      <div className="filtros-mascotas">
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
            {TEXTO_ESPECIE[especie]}
          </button>
        ))}

        <button
          type="button"
          className={`filtro-especie filtro-favoritos ${filtros.soloFavoritas ? 'activo' : ''}`}
          onClick={() => onCambio({ ...filtros, soloFavoritas: !filtros.soloFavoritas })}
          aria-pressed={filtros.soloFavoritas}
        >
        <span className="estrella-favoritos">★</span> Favoritos
        </button>

        <button type="button" className="equipo-limpiar" onClick={onLimpiar}>
          Limpiar
        </button>
      </div>
    </form>
  )
}