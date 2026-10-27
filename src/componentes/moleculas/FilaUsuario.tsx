/* MOLÉCULA — Fila de la tabla de usuarios del panel admin. */
import type { Usuario } from '../../types/usuario'
import { Boton } from '../atomos/Boton'
import { Insignia } from '../atomos/Insignia'

/** Props de una fila de la tabla de usuarios, con las acciones que avisan al padre. */
export interface FilaUsuarioProps {
  usuario: Usuario
  seleccionado: boolean
  /** true si la fila corresponde al admin conectado (no puede eliminarse a sí mismo). */
  esUnoMismo: boolean
  onSeleccionar: (id: string, marcado: boolean) => void
  onVer: (usuario: Usuario) => void
  onEditar: (usuario: Usuario) => void
  onEliminar: (usuario: Usuario) => void
}

/** Fila de la tabla de usuarios: selección, datos, insignias de rol/estado y botones ver, editar y eliminar. */
export function FilaUsuario({
  usuario,
  seleccionado,
  esUnoMismo,
  onSeleccionar,
  onVer,
  onEditar,
  onEliminar,
}: FilaUsuarioProps) {
  const nombreCompleto = `${usuario.nombre} ${usuario.apellidos}`
  return (
    <tr>
      <td>
        <input
          type="checkbox"
          checked={seleccionado}
          onChange={(e) => onSeleccionar(usuario.id, e.target.checked)}
          aria-label={`Seleccionar a ${nombreCompleto}`}
        />
      </td>
      <td>{usuario.run || '—'}</td>
      <td>{usuario.nombre}</td>
      <td>{usuario.apellidos}</td>
      <td>{usuario.correo}</td>
      <td>{usuario.comuna || 'Sin comuna'}</td>
      <td>
        <Insignia tipo={usuario.rol} />
      </td>
      <td>
        <Insignia tipo={usuario.activo ? 'activo' : 'inactivo'} />
      </td>
      <td>
        <div className="admin-acciones-fila">
          <Boton variante="ver" onClick={() => onVer(usuario)} aria-label={`Ver a ${nombreCompleto}`}>
            Ver
          </Boton>
          <Boton variante="editar" onClick={() => onEditar(usuario)} aria-label={`Editar a ${nombreCompleto}`}>
            Editar
          </Boton>
          <Boton
            variante="eliminar"
            onClick={() => onEliminar(usuario)}
            disabled={esUnoMismo}
            title={esUnoMismo ? 'No puedes eliminar tu propia cuenta' : undefined}
            aria-label={`Eliminar a ${nombreCompleto}`}
          >
            Eliminar
          </Boton>
        </div>
      </td>
    </tr>
  )
}
