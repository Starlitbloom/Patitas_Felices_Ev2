/* ORGANISMO — Tabla de usuarios del panel admin.
   Compone una FilaUsuario por cada usuario recibido.
   Si la lista llega vacía, muestra un mensaje en lugar de la tabla. */
import type { Usuario } from '../../types/usuario'
import { FilaUsuario } from '../moleculas/FilaUsuario'

export interface TablaUsuariosProps {
  usuarios: Usuario[]
  /** id del admin conectado (para bloquear su propio botón Eliminar). */
  idSesion?: string
  seleccionados: Set<string>
  onSeleccionar: (id: string, marcado: boolean) => void
  onSeleccionarTodos: (marcado: boolean) => void
  onVer: (usuario: Usuario) => void
  onEditar: (usuario: Usuario) => void
  onEliminar: (usuario: Usuario) => void
}

export function TablaUsuarios({
  usuarios,
  idSesion,
  seleccionados,
  onSeleccionar,
  onSeleccionarTodos,
  onVer,
  onEditar,
  onEliminar,
}: TablaUsuariosProps) {
  if (usuarios.length === 0) {
    return <p className="admin-tabla-vacia">No se encontraron usuarios con esos filtros.</p>
  }

  const todosMarcados = usuarios.every((u) => seleccionados.has(u.id))

  return (
    <div className="admin-tabla-wrap table-responsive">
      <table className="admin-tabla">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={todosMarcados}
                onChange={(e) => onSeleccionarTodos(e.target.checked)}
                aria-label="Seleccionar todos"
              />
            </th>
            <th>RUN</th>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Correo</th>
            <th>Comuna</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <FilaUsuario
              key={u.id}
              usuario={u}
              seleccionado={seleccionados.has(u.id)}
              esUnoMismo={u.id === idSesion}
              onSeleccionar={onSeleccionar}
              onVer={onVer}
              onEditar={onEditar}
              onEliminar={onEliminar}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
