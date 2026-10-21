/* MOLÉCULA — Campo de selección (etiqueta + select + error). Controlado. */
import { MensajeError } from '../atomos/MensajeError'

export interface OpcionSelector {
  valor: string
  texto: string
}

export interface CampoSelectorProps {
  id: string
  etiqueta: string
  valor: string
  onCambio: (valor: string) => void
  opciones: OpcionSelector[]
  /** Primera opción vacía (ej: "Selecciona la región"). */
  textoVacio?: string
  error?: string | null
  disabled?: boolean
}

export function CampoSelector({
  id,
  etiqueta,
  valor,
  onCambio,
  opciones,
  textoVacio,
  error,
  disabled,
}: CampoSelectorProps) {
  return (
    <div className={`campo ${error ? 'campo--invalido' : ''}`.trim()}>
      <label htmlFor={id}>{etiqueta}</label>
      <select
        id={id}
        name={id}
        value={valor}
        onChange={(e) => onCambio(e.target.value)}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
      >
        {textoVacio !== undefined && <option value="">{textoVacio}</option>}
        {opciones.map((op) => (
          <option key={op.valor} value={op.valor}>
            {op.texto}
          </option>
        ))}
      </select>
      <MensajeError mensaje={error} id={`${id}-error`} />
    </div>
  )
}
