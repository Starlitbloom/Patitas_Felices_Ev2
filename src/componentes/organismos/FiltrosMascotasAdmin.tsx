/* ORGANISMO — Filtros del panel admin de mascotas (texto + especie). */
import type { Especie } from '../../types/mascota'
import { ESPECIES_MASCOTA } from '../../types/mascota'
import { Boton } from '../atomos/Boton'

export interface FiltrosMascotasAdminValor {
  texto: string
  especie: '' | Especie
}

export interface FiltrosMascotasAdminProps {
  filtros: FiltrosMascotasAdminValor
  onCambio: (filtros: FiltrosMascotasAdminValor) => void
  onLimpiar: () => void
  totalResultados: number
}

export function FiltrosMascotasAdmin({ filtros, onCambio, onLimpiar, totalResultados }: FiltrosMascotasAdminProps) {
  return (
    <section className="admin-filtros row g-2 align-items-center" aria-label="Filtros de mascotas">
      <div className="col-12 col-lg-5">
        <input
          type="search"
          className="admin-buscador w-100"
          placeholder="Buscar por nombre..."
          value={filtros.texto}
          onChange={(e) => onCambio({ ...filtros, texto: e.target.value })}
          aria-label="Buscar mascotas"
        />
      </div>
      <div className="col-6 col-lg-3">
        <select
          className="admin-select w-100"
          value={filtros.especie}
          onChange={(e) => onCambio({ ...filtros, especie: e.target.value as '' | Especie })}
          aria-label="Filtrar por especie"
        >
          <option value="">Todas las especies</option>
          {ESPECIES_MASCOTA.map((especie) => (
            <option key={especie} value={especie}>
              {especie}
            </option>
          ))}
        </select>
      </div>
      <div className="col-auto">
        <Boton variante="limpiar" onClick={onLimpiar}>
          Limpiar
        </Boton>
      </div>
      <p className="admin-filtros-resumen col-12 mb-0" aria-live="polite">
        {totalResultados} {totalResultados === 1 ? 'mascota encontrada' : 'mascotas encontradas'}
      </p>
    </section>
  )
}