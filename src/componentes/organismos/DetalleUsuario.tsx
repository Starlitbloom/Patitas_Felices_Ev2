/* ORGANISMO — Ficha de detalle de un usuario (vista /admin/usuarios/:id).
   Corrige el bug de la EP1: el estado Activo/Inactivo ahora se lee
   de usuario.activo en vez de estar fijo en el HTML. */
import type { Usuario } from '../../types/usuario'
import { Avatar } from '../atomos/Avatar'
import { Boton } from '../atomos/Boton'
import { Insignia } from '../atomos/Insignia'

export interface DetalleUsuarioProps {
  usuario: Usuario
  puedeEliminar: boolean
  onEditar: () => void
  onEliminar: () => void
  onExportar: () => void
}

const formatearFecha = (iso: string) =>
  new Date(iso).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })

export function DetalleUsuario({ usuario, puedeEliminar, onEditar, onEliminar, onExportar }: DetalleUsuarioProps) {
  return (
    <article className="admin-modal admin-detalle-tarjeta">
      <div className="admin-detalle-cabecera">
        <Avatar
          src={usuario.avatar}
          nombre={usuario.nombre}
          apellidos={usuario.apellidos}
          className="admin-detalle-avatar"
        />
        <div className="admin-detalle-info">
          <h3>
            {usuario.nombre} {usuario.apellidos}
          </h3>
          <p className="admin-detalle-run">RUN: {usuario.run || '—'}</p>
          <div className="admin-detalle-linea">
            <strong>{usuario.correo}</strong>
            <Insignia tipo={usuario.rol} />
          </div>
          <p className="admin-detalle-linea admin-detalle-secundaria">
            Tel: {usuario.telefono || 'No registrado'} · {usuario.region || 'Sin región'}
            {usuario.comuna ? ` / ${usuario.comuna}` : ''}
          </p>
          <p className="admin-detalle-linea admin-detalle-secundaria">
            Dirección: {usuario.direccion || 'No registrada'}
          </p>
          <p className="admin-detalle-linea admin-detalle-secundaria">
            Registrado el {formatearFecha(usuario.fechaRegistro)}
          </p>
          <Insignia tipo={usuario.activo ? 'activo' : 'inactivo'} texto={usuario.activo ? 'Activo' : 'Inactivo'} />
        </div>
      </div>

      <div className="admin-detalle-acciones">
        <Boton variante="editar" onClick={onEditar}>
          ✏️ Editar
        </Boton>
        <Boton
          variante="eliminar"
          onClick={onEliminar}
          disabled={!puedeEliminar}
          title={puedeEliminar ? undefined : 'No puedes eliminar tu propia cuenta'}
        >
          🗑️ Eliminar
        </Boton>
        <Boton variante="accion" onClick={onExportar}>
          📤 Exportar
        </Boton>
      </div>
    </article>
  )
}
