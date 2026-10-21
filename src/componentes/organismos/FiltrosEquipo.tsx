/* ORGANISMO — Filtros de la página de equipo (búsqueda + especialidad + especie).
   Presentacional: el estado de los filtros vive en EquipoPage. */
import { ESPECIALIDADES, ESPECIES } from '../../data/veterinarios'
import type { Especialidad, Especie, FiltrosEquipo as Filtros } from '../../types/veterinario'

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
        <label htmlFor="equipo-especialidad">Especialidad</label>
        <select
          id="equipo-especialidad"
          value={filtros.especialidad}
          onChange={(e) => onCambio({ ...filtros, especialidad: e.target.value as '' | Especialidad })}
        >
          <option value="">Todas</option>
          {ESPECIALIDADES.map((esp) => (
            <option key={esp} value={esp}>
              {esp}
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
