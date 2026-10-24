/* ORGANISMO — Tabla de historial clínico por paciente del panel admin.
   Muestra una fila por mascota con sus datos, su última atención y cuántas
   atenciones, vacunas y servicios tiene. Cada fila tiene un botón para abrir
   el historial completo del paciente. */
import type { Mascota } from '../../types/mascota'
import { obtenerHistorial, obtenerVacunas } from '../../services/mascotasService'
import { Boton } from '../atomos/Boton'

/* Lo que recibe la tabla desde la página */
export interface TablaHistorialPacientesProps {
  /** Mascotas que se muestran, una por fila. */
  mascotas: Mascota[]
  /** Se llama al pulsar "Ver historial": abre la ventana con el historial completo. */
  onVer: (mascota: Mascota) => void
  
}

export function TablaHistorialPacientes({ mascotas, onVer }: TablaHistorialPacientesProps) {
  /* Si no hay mascotas, en vez de la tabla vacía se muestra un mensaje */
  if (mascotas.length === 0) {
    return <p className="admin-tabla-vacia">No hay pacientes registrados.</p>
  }

  return (
    /* Contenedor con scroll horizontal por si la tabla no cabe en pantallas chicas */
    <div className="admin-tabla-wrap table-responsive">
      <table className="admin-tabla">
        {/* Títulos de las columnas */}
        <thead>
          <tr>
            <th>Paciente</th>
            <th>Especie</th>
            <th>Raza</th>
            <th>Dueño/a</th>
            <th>Última atención</th>
            <th>Atenciones</th>
            <th>Tratamiento</th>
            <th>Vacunas</th>
            <th>Servicios</th>
            <th>Acciones</th>
          </tr>
        </thead>

        {/* Una fila por cada mascota */}
        <tbody>
          {mascotas.map((m) => {
            /* Atenciones y vacunas guardadas de esta mascota (lo más reciente va primero) */
            const historial = obtenerHistorial(m.id)
            const vacunas = obtenerVacunas(m.id)

            /* Total de servicios realizados: se suman los de todas las atenciones.
               Las atenciones antiguas no tienen servicios, por eso el "?? 0" */
            const servicios = historial.reduce((total, atencion) => total + (atencion.servicios?.length ?? 0), 0)

            /* Última atención registrada (la primera de la lista), si existe */
            const ultima = historial[0]

            return (
              <tr key={m.id}>
                {/* Paciente: foto pequeña + nombre */}
                <td>
                  <div className="admin-celda-mascota">
                    {m.imagen && <img src={m.imagen} alt="" />}
                    <span>{m.nombre}</span>
                  </div>
                </td>

                {/* Datos generales de la mascota ("—" cuando no hay dato) */}
                <td>{m.especie}</td>
                <td>{m.raza || '—'}</td>
                <td>{m.dueño}</td>

                {/* Fecha de la última atención y cantidad de atenciones */}
                <td>{ultima?.fecha ?? '—'}</td>
                <td>{historial.length}</td>

                {/* Tratamiento de la última atención (se recorta con "…" si es largo;
                    al pasar el mouse se ve completo gracias al title) */}
                <td>
                  <span className="celda-recortada" title={ultima?.tratamiento}>
                    {ultima?.tratamiento ?? '—'}
                  </span>
                </td>

                {/* Cantidad de vacunas y de servicios realizados */}
                <td>{vacunas.length}</td>
                <td>{servicios}</td>

                {/* Botones de la fila */}
                <td>
                  <div className="admin-acciones-fila">
                    {/* Abre el historial completo de este paciente */}
                    <Boton variante="ver" onClick={() => onVer(m)} aria-label={`Ver historial de ${m.nombre}`}>
                      Ver historial
                    </Boton>
                    {/* Abre el formulario para editar los datos del paciente */}
                    
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}