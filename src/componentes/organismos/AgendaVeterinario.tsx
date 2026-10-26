/* ORGANISMO — Agenda semanal de disponibilidad de un médico veterinario.
   Presentacional: recibe los días ya calculados (agendaService) y avisa
   al padre con onElegir cuando se hace clic en un bloque libre. */
import type { DiaAgenda, EstadoBloque } from '../../services/agendaService'

export interface AgendaVeterinarioProps {
  nombreMedico: string
  dias: DiaAgenda[]
  /** Texto de la semana, ej: "27 oct – 31 oct" */
  tituloSemana: string
  totalLibres: number
  puedeRetroceder: boolean
  puedeAvanzar: boolean
  onAnterior: () => void
  onSiguiente: () => void
  onElegir: (fecha: string, hora: string) => void
}

const TEXTO_ESTADO: Record<EstadoBloque, string> = {
  libre: 'disponible',
  ocupado: 'ocupado',
  pasado: 'ya pasó',
}

export function AgendaVeterinario({
  nombreMedico,
  dias,
  tituloSemana,
  totalLibres,
  puedeRetroceder,
  puedeAvanzar,
  onAnterior,
  onSiguiente,
  onElegir,
}: AgendaVeterinarioProps) {
  return (
    <section className="agenda" aria-labelledby="agenda-titulo">
      <div className="agenda-cabecera">
        <div>
          <h2 id="agenda-titulo">Disponibilidad</h2>
          <p className="agenda-resumen" data-testid="agenda-resumen">
            {totalLibres > 0
              ? `${totalLibres} ${totalLibres === 1 ? 'hora disponible' : 'horas disponibles'} esta semana. Elige una para agendar con ${nombreMedico}.`
              : 'No quedan horas disponibles esta semana. Revisa la semana siguiente.'}
          </p>
        </div>
        <div className="agenda-navegacion">
          <button type="button" onClick={onAnterior} disabled={!puedeRetroceder} aria-label="Semana anterior">
            ‹
          </button>
          <span className="agenda-semana">{tituloSemana}</span>
          <button type="button" onClick={onSiguiente} disabled={!puedeAvanzar} aria-label="Semana siguiente">
            ›
          </button>
        </div>
      </div>

      <div className="agenda-grilla">
        {dias.map((dia) => (
          <div key={dia.fecha} className={`agenda-dia ${dia.atiende ? '' : 'agenda-dia--libre-medico'}`} data-testid="agenda-dia">
            <div className="agenda-dia-titulo">
              <strong>{dia.nombre}</strong>
              <span>{dia.etiqueta}</span>
            </div>

            {dia.atiende ? (
              <div className="agenda-bloques">
                {dia.bloques.map((bloque) => (
                  <button
                    key={bloque.hora}
                    type="button"
                    className={`agenda-bloque agenda-bloque--${bloque.estado}`}
                    disabled={bloque.estado !== 'libre'}
                    onClick={() => onElegir(dia.fecha, bloque.hora)}
                    aria-label={`${dia.nombre} ${dia.etiqueta}, ${bloque.hora}: ${TEXTO_ESTADO[bloque.estado]}`}
                  >
                    {bloque.hora}
                  </button>
                ))}
              </div>
            ) : (
              <p className="agenda-no-atiende">No atiende</p>
            )}
          </div>
        ))}
      </div>

      <ul className="agenda-leyenda" aria-label="Leyenda">
        <li>
          <span className="agenda-punto agenda-punto--libre" /> Disponible
        </li>
        <li>
          <span className="agenda-punto agenda-punto--ocupado" /> Ocupado
        </li>
        <li>
          <span className="agenda-punto agenda-punto--pasado" /> Ya pasó
        </li>
      </ul>
    </section>
  )
}
