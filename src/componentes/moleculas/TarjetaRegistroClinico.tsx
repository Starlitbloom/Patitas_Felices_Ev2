/* MOLÉCULA — Una atención del historial clínico. */
import type { RegistroClinico } from '../../types/mascota'

export function TarjetaRegistroClinico({ fecha, motivo, diagnostico, tratamiento, veterinario, servicios }: RegistroClinico) {
  return (
    <article className="registro-clinico">
      <span className="registro-fecha">{fecha}</span>
      <div>
        <h3>{motivo}</h3>
        <p>
          <strong>Diagnóstico: </strong>
          {diagnostico}
        </p>
        <p>
          <strong>Tratamiento: </strong>
          {tratamiento}
        </p>
        {/* Servicios realizados: solo si la atención los tiene */}
        {servicios && servicios.length > 0 && (
          <p>
            <strong>Servicios: </strong>
            {servicios.join(' · ')}
          </p>
        )}
        <p>
          <strong>Atendido por: </strong>
          {veterinario}
        </p>
      </div>
    </article>
  )
}