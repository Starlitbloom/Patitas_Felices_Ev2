/* ORGANISMO — Grilla de la agenda del día (hora × médico) para recepción.
   Presentacional: recibe las columnas ya calculadas por agendaService
   y avisa con onVerCita cuando se hace clic en una cita. */
import type { Cita } from '../../services/citasService'
import type { ColumnaMedico } from '../../services/agendaService'

export interface GrillaAgendaDiaProps {
  horas: readonly string[]
  columnas: ColumnaMedico[]
  onVerCita: (cita: Cita) => void
}

const ICONO_ESPECIE: Record<string, string> = { Perro: '🐶', Gato: '🐱', Ave: '🦜', Conejo: '🐰' }

export function iconoMascota(cita: Cita): string {
  return ICONO_ESPECIE[cita.tipoMascota] ?? ICONO_ESPECIE[cita.otraEspecie ?? ''] ?? '🐾'
}

export function GrillaAgendaDia({ horas, columnas, onVerCita }: GrillaAgendaDiaProps) {
  return (
    <div className="agenda-dia-wrap">
      <div
        className="agenda-dia-grilla"
        style={{ gridTemplateColumns: `70px repeat(${columnas.length}, minmax(190px, 1fr))` }}
      >
        {/* Fila de títulos: una columna por médico */}
        <div className="agenda-dia-esquina" />
        {columnas.map(({ veterinario, atiende }) => (
          <div key={veterinario.id} className="agenda-dia-medico">
            <img src={veterinario.imagen} alt="" />
            <div>
              <strong>{veterinario.nombre}</strong>
              <span>{atiende ? `${veterinario.horario} hrs` : 'No atiende este día'}</span>
            </div>
          </div>
        ))}

        {/* Una fila por hora */}
        {horas.map((hora, fila) => (
          <div key={hora} className="agenda-dia-fila" style={{ display: 'contents' }}>
            <div className="agenda-dia-hora">{hora}</div>
            {columnas.map(({ veterinario, celdas }) => {
              const celda = celdas[fila]
              const clave = `${veterinario.id}-${hora}`

              if (celda.tipo === 'cita' && celda.cita) {
                const cita = celda.cita
                return (
                  <button
                    key={clave}
                    type="button"
                    className={`agenda-celda agenda-celda--cita agenda-estado--${cita.estado.toLowerCase()}`}
                    onClick={() => onVerCita(cita)}
                    data-testid="celda-cita"
                  >
                    <span className="agenda-celda-mascota">
                      {iconoMascota(cita)} {cita.mascota}
                    </span>
                    <span className="agenda-celda-detalle">{cita.servicio}</span>
                    <span className="agenda-celda-detalle">{cita.dueno || cita.nombreUsuario}</span>
                    <span className="agenda-celda-estado">{cita.estado}</span>
                  </button>
                )
              }

              if (celda.tipo === 'continua') {
                return (
                  <div key={clave} className="agenda-celda agenda-celda--continua">
                    ↳ {celda.cita?.mascota}
                  </div>
                )
              }

              return (
                <div key={clave} className={`agenda-celda agenda-celda--${celda.tipo}`}>
                  {celda.tipo === 'libre' ? 'Libre' : ''}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
