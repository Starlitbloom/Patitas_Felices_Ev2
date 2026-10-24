/* ORGANISMO — Contenido de la ventana "Historial" de un paciente (panel admin).
   Muestra la foto y los datos de la mascota, todas sus atenciones (con los servicios
   realizados) y su calendario de vacunas. Reutiliza las mismas tarjetas de la ficha
   pública para que el personal vea exactamente lo que ve el dueño. */
import type { EstadoMascota, Mascota } from '../../types/mascota'
import { TEXTO_ESTADO_MASCOTA } from '../../types/mascota'
import { obtenerHistorial, obtenerVacunas } from '../../services/mascotasService'
import { TarjetaRegistroClinico } from '../moleculas/TarjetaRegistroClinico'
import { TarjetaVacuna } from '../moleculas/TarjetaVacuna'

export interface DetalleHistorialPacienteProps {
  mascota: Mascota
}

/* Color de la insignia del estado (las mismas clases que usa la tabla de mascotas) */
const CLASE_BADGE: Record<EstadoMascota, string> = {
  'al-dia': 'admin-badge--activo',
  tratamiento: 'admin-badge--tratamiento',
  pendiente: 'admin-badge--pendiente',
}

export function DetalleHistorialPaciente({ mascota }: DetalleHistorialPacienteProps) {
  const { nombre, especie, raza, dueño, imagen, estado } = mascota

  /* Atenciones y vacunas guardadas de esta mascota (lo más reciente va primero) */
  const historial = obtenerHistorial(mascota.id)
  const vacunas = obtenerVacunas(mascota.id)

  return (
    <div className="historial-paciente">
      {/* Cabecera: foto, nombre, datos básicos y estado actual */}
      <div className="historial-paciente-cabecera">
        <div className="historial-paciente-foto">{imagen ? <img src={imagen} alt={`Foto de ${nombre}`} /> : <span>🐾</span>}</div>
        <div>
          <h3>{nombre}</h3>
          <p>
            {especie}
            {raza ? ` · ${raza}` : ''}
          </p>
          <p>Dueño/a: {dueño}</p>
          <span className={`admin-badge ${CLASE_BADGE[estado]}`}>{TEXTO_ESTADO_MASCOTA[estado]}</span>
        </div>
      </div>

      {/* Atenciones: todas las del historial, cada una con sus servicios */}
      <h4 className="admin-modal-seccion">Atenciones ({historial.length})</h4>
      <div className="lista-registros">
        {historial.length === 0 ? (
          <p className="historial-paciente-vacio">Aún no hay atenciones registradas para este paciente.</p>
        ) : (
          historial.map((registro, indice) => <TarjetaRegistroClinico key={indice} {...registro} />)
        )}
      </div>

      {/* Vacunas: calendario de vacunación del paciente */}
      <h4 className="admin-modal-seccion">Vacunas ({vacunas.length})</h4>
      <div className="lista-registros">
        {vacunas.length === 0 ? (
          <p className="historial-paciente-vacio">Este paciente no tiene vacunas registradas.</p>
        ) : (
          vacunas.map((registro, indice) => <TarjetaVacuna key={indice} {...registro} />)
        )}
      </div>
    </div>
  )
}