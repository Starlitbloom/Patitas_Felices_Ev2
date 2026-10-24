/* ORGANISMO — Tabla de mascotas del panel admin. */
import type { Mascota } from '../../types/mascota'
import { FilaMascota } from '../moleculas/FilaMascota'

export interface TablaMascotasProps {
  mascotas: Mascota[]
  onEditar: (mascota: Mascota) => void
  onEliminar: (mascota: Mascota) => void
  onAtencion: (mascota: Mascota) => void // abre el formulario de atención
  onVacuna: (mascota: Mascota) => void // abre el formulario de vacuna
}

export function TablaMascotas({ mascotas, onEditar, onEliminar, onAtencion, onVacuna }: TablaMascotasProps) {
  /* Sin mascotas: solo se muestra un mensaje */
  if (mascotas.length === 0) {
    return <p className="admin-tabla-vacia">No hay mascotas registradas.</p>
  }

  return (
    <div className="admin-tabla-wrap table-responsive">
      <table className="admin-tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Especie</th>
            <th>Raza</th>
            <th>Dueño/a</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {mascotas.map((m) => (
            <FilaMascota 
              key={m.id} 
              mascota={m} 
              onEditar={onEditar} 
              onEliminar={onEliminar}
              onAtencion={onAtencion}
              onVacuna={onVacuna}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}