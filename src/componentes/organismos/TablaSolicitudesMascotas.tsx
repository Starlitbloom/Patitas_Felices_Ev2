/* ORGANISMO — Tabla de solicitudes de cambio pendientes (panel admin). */
import type { CambiosSolicitud, SolicitudCambio } from '../../types/mascota'
import { Boton } from '../atomos/Boton'

export interface TablaSolicitudesMascotasProps {
  solicitudes: SolicitudCambio[]
  /** Devuelve el nombre de la mascota a partir de su id. */
  nombreMascota: (id: string) => string
    /** Devuelve la foto actual de la mascota a partir de su id. */
  imagenMascota: (id: string) => string
  onAprobar: (solicitud: SolicitudCambio) => void
  onRechazar: (solicitud: SolicitudCambio) => void
}

const ETIQUETA_CAMBIO: Record<keyof CambiosSolicitud, string> = {
  raza: 'Raza',
  sexo: 'Sexo',
  peso: 'Peso',
  imagen: 'Foto',
  descripcion: 'Descripción',
}

/* Lista solo los campos con valor; la foto nueva se muestra en miniatura */
function resumirCambios(cambios: CambiosSolicitud) {
  return (Object.keys(ETIQUETA_CAMBIO) as (keyof CambiosSolicitud)[])
    .filter((campo) => cambios[campo])
    .map((campo) => (
      <div key={campo}>
        <strong>{ETIQUETA_CAMBIO[campo]}:</strong>{' '}
        {campo === 'imagen' ? (
          <img className="solicitud-foto-nueva" src={cambios.imagen} alt="Foto nueva propuesta" />
        ) : (
          cambios[campo]
        )}
      </div>
    ))
}

export function TablaSolicitudesMascotas({ solicitudes, nombreMascota, imagenMascota, onAprobar, onRechazar }: TablaSolicitudesMascotasProps) {
  return (
    <div className="admin-tabla-wrap table-responsive">
      <table className="admin-tabla">
        <thead>
          <tr>
            <th>Mascota</th>
            <th>Solicitado por</th>
            <th>Cambios propuestos</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.length === 0 ? (
            <tr>
              <td colSpan={5} className="admin-tabla-sin-datos">
                No hay solicitudes pendientes.
              </td>
            </tr>
          ) : (
            solicitudes.map((s) => (
              <tr key={s.id}>
                {/* Mascota: foto actual + nombre */}
                <td>
                  <div className="admin-celda-mascota">
                    {imagenMascota(s.mascotaId) && <img src={imagenMascota(s.mascotaId)} alt="" />}
                    <span>{nombreMascota(s.mascotaId)}</span>
                  </div>
                </td>
                <td>{s.correoSolicitante}</td>
                <td>{resumirCambios(s.cambios)}</td>
                <td>{new Date(s.fechaSolicitud).toLocaleDateString('es-CL')}</td>
                <td>
                  <div className="admin-acciones-fila">
                    <Boton variante="editar" onClick={() => onAprobar(s)}>
                      Aprobar
                    </Boton>
                    <Boton variante="eliminar" onClick={() => onRechazar(s)}>
                      Rechazar
                    </Boton>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}