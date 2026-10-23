/* MOLÉCULA — Una fila del calendario de vacunas. */
import type { RegistroVacuna } from '../../types/mascota'
import { TEXTO_ESTADO_VACUNA } from '../../types/mascota'

export function TarjetaVacuna({ vacuna, fecha, proximoRefuerzo, estado }: RegistroVacuna) {
  return (
    <article className="registro-clinico">
      <span className="registro-fecha">{fecha}</span>
      <div>
        <h3>{vacuna}</h3>
        <p>
          <strong>Próximo refuerzo: </strong>
          {proximoRefuerzo}
        </p>
        <span className={`estado-badge-vacuna estado-${estado}`}>{TEXTO_ESTADO_VACUNA[estado]}</span>
      </div>
    </article>
  )
}