/* ORGANISMO — Filtros de la página de equipo (búsqueda + cargo + especie).
   Presentacional: el estado de los filtros vive en EquipoPage. */
import { CARGOS, ESPECIES } from '../../data/veterinarios'
import type { Cargo, Especie, FiltrosEquipo as Filtros } from '../../types/veterinario'

export interface FiltrosEquipoProps {
  filtros: Filtros
  onCambio: (filtros: Filtros) => void
  onLimpiar: () => void
}

export function FiltrosEquipo({ filtros, onCambio, onLimpiar }: FiltrosEquipoProps) {
  return (
    <form className="equipo-filtros row g-3 align-items-end" role="search" onSubmit={(e) => e.preventDefault()}>
      <div className="col-12 col-lg-4 campo mb-0">
        <label htmlFor="equipo-buscar">Buscar por nombre</label>
        <input
          id="equipo-buscar"
          type="search"
          value={filtros.texto}
          placeholder="Ej: Fernanda"
          onChange={(e) => onCambio({ ...filtros, texto: e.target.value })}
        />
      </div>
      <div className="col-12 col-md-6 col-lg-3 campo mb-0">
        <label htmlFor="equipo-cargo">Cargo</label>
        <select
          id="equipo-cargo"
          value={filtros.cargo}
          onChange={(e) => onCambio({ ...filtros, cargo: e.target.value as '' | Cargo })}
        >
          <option value="">Todos</option>
          {CARGOS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="col-12 col-md-6 col-lg-3 campo mb-0">
        <label htmlFor="equipo-especie">Atiende a</label>
        <select
          id="equipo-especie"
          value={filtros.especie}
          onChange={(e) => onCambio({ ...filtros, especie: e.target.value as '' | Especie })}
        >
          <option value="">Todas las especies</option>
          {ESPECIES.map((esp) => (
            <option key={esp} value={esp}>
              {esp}
            </option>
          ))}
        </select>
      </div>
      <div className="col-12 col-lg-2">
        <button type="button" className="equipo-limpiar w-100" onClick={onLimpiar}>
          Limpiar
        </button>
      </div>
    </form>
  )
}
