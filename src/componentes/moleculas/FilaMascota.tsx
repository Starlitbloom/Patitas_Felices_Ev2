/* MOLÉCULA — Fila de la tabla de mascotas del panel admin. */
import type { Mascota } from '../../types/mascota'
import { TEXTO_ESTADO_MASCOTA } from '../../types/mascota'
import { Boton } from '../atomos/Boton'

export interface FilaMascotaProps {
  mascota: Mascota
  onEditar: (mascota: Mascota) => void
  onEliminar: (mascota: Mascota) => void
}

export function FilaMascota({ mascota, onEditar, onEliminar }: FilaMascotaProps) {
  const { nombre, especie, raza, dueno, estado } = mascota
  return (
    <tr>
      <td>{nombre}</td>
      <td>{especie}</td>
      <td>{raza || '—'}</td>
      <td>{dueno}</td>
      <td>
        <span className={`estado-badge estado-${estado}`}>{TEXTO_ESTADO_MASCOTA[estado]}</span>
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