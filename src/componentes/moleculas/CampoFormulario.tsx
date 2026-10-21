/* MOLÉCULA — Campo de formulario = etiqueta + input + mensaje de error.
   Es un input CONTROLADO: su valor vive en el estado del formulario
   padre (prop "valor") y cada cambio se avisa con "onCambio". */
import type { HTMLInputTypeAttribute } from 'react'
import { MensajeError } from '../atomos/MensajeError'

export interface CampoFormularioProps {
  id: string
  etiqueta: string
  valor: string
  onCambio: (valor: string) => void
  tipo?: HTMLInputTypeAttribute
  error?: string | null
  ayuda?: string
  /** Ícono dentro del input (estilo "pastilla" del login). */
  icono?: string
  placeholder?: string
  maxLength?: number
  disabled?: boolean
  autoComplete?: string
}

export function CampoFormulario({
  id,
  etiqueta,
  valor,
  onCambio,
  tipo = 'text',
  error,
  ayuda,
  icono,
  placeholder,
  maxLength,
  disabled,
  autoComplete,
}: CampoFormularioProps) {
  const input = (
    <input
      id={id}
      name={id}
      type={tipo}
      value={valor}
      onChange={(e) => onCambio(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      disabled={disabled}
      autoComplete={autoComplete}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${id}-error` : undefined}
    />
  )

  return (
    <div className={`campo ${icono ? 'campo-icono' : ''} ${error ? 'campo--invalido' : ''}`.replace(/\s+/g, ' ').trim()}>
      <label htmlFor={id}>{etiqueta}</label>
      {icono ? (
        <div className="campo-icono-wrap">
          <span className="campo-icono-simbolo" aria-hidden="true">
            {icono}
          </span>
          {input}
        </div>
      ) : (
        input
      )}
      {ayuda && <p className="campo__ayuda">{ayuda}</p>}
      <MensajeError mensaje={error} id={`${id}-error`} />
    </div>
  )
}
