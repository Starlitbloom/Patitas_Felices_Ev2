/* MOLÉCULA — Campo de fecha con calendario redondo (reemplaza al calendario nativo del navegador).
   Muestra un botón con la fecha elegida; al pulsarlo se abre el calendario debajo.
   Controlado: recibe y entrega la fecha como texto "2026-10-24" (el mismo formato de <input type="date">). */
import { useEffect, useRef, useState } from 'react'
import { MensajeError } from '../atomos/MensajeError'

export interface CampoFechaProps {
  id: string
  etiqueta: string
  /** Fecha elegida como "2026-10-24" (vacío = sin fecha). */
  valor: string
  onCambio: (valor: string) => void
  error?: string | null
  /** Primer día que se puede elegir ("2026-10-24"); los anteriores quedan bloqueados. */
  minimo?: string
}

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
const DIAS_SEMANA = ['lu', 'ma', 'mi', 'ju', 'vi', 'sá', 'do']

const dosDigitos = (n: number) => String(n).padStart(2, '0')

/* Arma "2026-10-24" a partir del año, el mes (0 a 11) y el día */
const aIso = (anio: number, mes: number, dia: number) => `${anio}-${dosDigitos(mes + 1)}-${dosDigitos(dia)}`

/* Fecha de hoy como "2026-10-24" */
function hoyIso(): string {
  const h = new Date()
  return aIso(h.getFullYear(), h.getMonth(), h.getDate())
}

/* Lo que se ve en el botón: "2026-10-24" → "24-10-2026" */
function textoFecha(iso: string): string {
  const [anio, mes, dia] = iso.split('-')
  return `${dia}-${mes}-${anio}`
}

/* Año y mes (0 a 11) que muestra el calendario al abrirse: el de la fecha elegida o el de hoy */
function mesInicial(iso: string): { anio: number; mes: number } {
  const [anio, mes] = (iso || hoyIso()).split('-').map(Number)
  return { anio, mes: mes - 1 }
}

export function CampoFecha({ id, etiqueta, valor, onCambio, error, minimo }: CampoFechaProps) {
  const [abierto, setAbierto] = useState(false)
  const [visible, setVisible] = useState(() => mesInicial(valor))
  const contenedor = useRef<HTMLDivElement>(null)

  /* Con el calendario abierto: se cierra al pulsar fuera o al apretar Escape */
  useEffect(() => {
    if (!abierto) return
    const alPulsarFuera = (e: MouseEvent) => {
      if (contenedor.current && !contenedor.current.contains(e.target as Node)) setAbierto(false)
    }
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAbierto(false)
    }
    document.addEventListener('mousedown', alPulsarFuera)
    document.addEventListener('keydown', alTeclear)
    return () => {
      document.removeEventListener('mousedown', alPulsarFuera)
      document.removeEventListener('keydown', alTeclear)
    }
  }, [abierto])

  /* Abre o cierra; al abrir muestra el mes de la fecha elegida */
  const alternar = () => {
    if (!abierto) setVisible(mesInicial(valor))
    setAbierto(!abierto)
  }

  /* Pasa al mes anterior (-1) o al siguiente (+1) */
  const moverMes = (paso: number) => {
    setVisible(({ anio, mes }) => {
      const nuevo = new Date(anio, mes + paso, 1)
      return { anio: nuevo.getFullYear(), mes: nuevo.getMonth() }
    })
  }

  /* Elige un día y cierra el calendario */
  const elegir = (iso: string) => {
    onCambio(iso)
    setAbierto(false)
  }

  /* Casillas del mes: huecos antes del día 1 (la semana parte en lunes) y luego los días */
  const hueco = (new Date(visible.anio, visible.mes, 1).getDay() + 6) % 7
  const diasDelMes = new Date(visible.anio, visible.mes + 1, 0).getDate()
  const casillas: (number | null)[] = [
    ...Array<null>(hueco).fill(null),
    ...Array.from({ length: diasDelMes }, (_, i) => i + 1),
  ]

  const hoy = hoyIso()

  return (
    <div ref={contenedor} className={`campo campo-fecha ${error ? 'campo--invalido' : ''}`.trim()}>
      <label htmlFor={id}>{etiqueta}</label>

      {/* Botón que muestra la fecha elegida */}
      <button
        type="button"
        id={id}
        className={`campo-fecha-boton ${valor ? '' : 'campo-fecha-boton--vacio'}`.trim()}
        onClick={alternar}
        aria-haspopup="dialog"
        aria-expanded={abierto}
        aria-invalid={error ? true : undefined}
      >
        {valor ? textoFecha(valor) : 'Selecciona una fecha'}
      </button>

      {abierto && (
        <div className="calendario" role="dialog" aria-label={`Calendario de ${etiqueta}`}>
          {/* Mes y año, con flechas para cambiar de mes */}
          <div className="calendario-cabecera">
            <button type="button" className="calendario-flecha" onClick={() => moverMes(-1)} aria-label="Mes anterior">
              ‹
            </button>
            <span>
              {MESES[visible.mes]} de {visible.anio}
            </span>
            <button type="button" className="calendario-flecha" onClick={() => moverMes(1)} aria-label="Mes siguiente">
              ›
            </button>
          </div>

          {/* Letras de los días de la semana */}
          <div className="calendario-semana">
            {DIAS_SEMANA.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          {/* Días del mes */}
          <div className="calendario-dias">
            {casillas.map((dia, i) => {
              if (dia === null) return <span key={`hueco-${i}`} />
              const iso = aIso(visible.anio, visible.mes, dia)
              const clases = ['calendario-dia']
              if (iso === hoy) clases.push('calendario-dia--hoy')
              if (iso === valor) clases.push('calendario-dia--elegido')
              return (
                <button
                  key={iso}
                  type="button"
                  className={clases.join(' ')}
                  disabled={minimo !== undefined && minimo !== '' && iso < minimo}
                  onClick={() => elegir(iso)}
                >
                  {dia}
                </button>
              )
            })}
          </div>

          {/* Atajos: borrar la fecha o elegir hoy */}
          <div className="calendario-pie">
            <button type="button" onClick={() => elegir('')}>
              Borrar
            </button>
            <button type="button" onClick={() => elegir(hoy)}>
              Hoy
            </button>
          </div>
        </div>
      )}

      <MensajeError mensaje={error} id={`${id}-error`} />
    </div>
  )
}