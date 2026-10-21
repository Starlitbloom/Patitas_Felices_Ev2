/* ORGANISMO — Barra de búsqueda y filtros del listado de usuarios.
   Componente de presentación: recibe los filtros actuales por props
   y avisa cada cambio con onCambio (el estado vive en la página). */
import type { FiltrosUsuarios as Filtros, OrdenUsuarios, Rol } from '../../types/usuario'
import { Boton } from '../atomos/Boton'

export interface FiltrosUsuariosProps {
  filtros: Filtros
  onCambio: (filtros: Filtros) => void
  onLimpiar: () => void
  onExportar: () => void
  cantidadSeleccionados: number
  totalResultados: number
}

export function FiltrosUsuarios({
  filtros,
  onCambio,
  onLimpiar,
  onExportar,
  cantidadSeleccionados,
  totalResultados,
}: FiltrosUsuariosProps) {
  return (
    <section className="admin-filtros row g-2 align-items-center" aria-label="Filtros de usuarios">
      <div className="col-12 col-lg-5">
        <input
          type="search"
          className="admin-buscador w-100"
          placeholder="Buscar por RUN, nombre o correo..."
          value={filtros.texto}
          onChange={(e) => onCambio({ ...filtros, texto: e.target.value })}
          aria-label="Buscar usuarios"
        />
      </div>
      <div className="col-6 col-lg-2">
        <select
          className="admin-select w-100"
          value={filtros.rol}
          onChange={(e) => onCambio({ ...filtros, rol: e.target.value as '' | Rol })}
          aria-label="Filtrar por rol"
        >
          <option value="">Todos los roles</option>
          <option value="cliente">Cliente</option>
          <option value="admin">Administrador</option>
        </select>
      </div>
      <div className="col-6 col-lg-2">
        <select
          className="admin-select w-100"
          value={filtros.orden}
          onChange={(e) => onCambio({ ...filtros, orden: e.target.value as OrdenUsuarios })}
          aria-label="Ordenar"
        >
          <option value="recientes">Orden: Recientes</option>
          <option value="az">Orden: Nombre A-Z</option>
          <option value="za">Orden: Nombre Z-A</option>
        </select>
      </div>
      <div className="col-auto">
        <Boton variante="limpiar" onClick={onLimpiar}>
          Limpiar
        </Boton>
      </div>
      <div className="col-auto">
        <Boton variante="exportar" onClick={onExportar} disabled={cantidadSeleccionados === 0}>
          📤 Exportar seleccionados ({cantidadSeleccionados})
        </Boton>
      </div>
      <p className="admin-filtros-resumen col-12 mb-0" aria-live="polite">
        {totalResultados} {totalResultados === 1 ? 'usuario encontrado' : 'usuarios encontrados'}
      </p>
    </section>
  )
}
