/* MOLÉCULA — Fila de la tabla de mascotas del panel admin. */
import type { EstadoMascota, Mascota } from '../../types/mascota'
import { TEXTO_ESTADO_MASCOTA } from '../../types/mascota'
import { Boton } from '../atomos/Boton'

export interface FilaMascotaProps {
  mascota: Mascota
  onEditar: (mascota: Mascota) => void
  onEliminar: (mascota: Mascota) => void
}

/* Color de la insignia según el estado (clases del panel admin) */
const CLASE_BADGE: Record<EstadoMascota, string> = {
  'al-dia': 'admin-badge--activo',
  tratamiento: 'admin-badge--tratamiento',
  pendiente: 'admin-badge--pendiente',
}

export function FilaMascota({ mascota, onEditar, onEliminar }: FilaMascotaProps) {
  const { nombre, especie, raza, dueño, imagen, estado } = mascota
  return (
    <tr>
      <td>
        <div className="admin-celda-mascota">
          {imagen && <img src={imagen} alt="" />}
          <span>{nombre}</span>
        </div>
      </td>
      <td>{especie}</td>
      <td>{raza || '—'}</td>
      <td>{dueño}</td>
      <td>
        <span className={`admin-badge ${CLASE_BADGE[estado]}`}>{TEXTO_ESTADO_MASCOTA[estado]}</span>
      </td>
      <td>
        <div className="admin-acciones-fila">
          <Boton variante="editar" onClick={() => onEditar(mascota)} aria-label={`Editar a ${nombre}`}>
            Editar
          </Boton>
          <Boton variante="eliminar" onClick={() => onEliminar(mascota)} aria-label={`Eliminar a ${nombre}`}>
            Eliminar
          </Boton>
        </div>
      </td>
    </tr>
  )
}