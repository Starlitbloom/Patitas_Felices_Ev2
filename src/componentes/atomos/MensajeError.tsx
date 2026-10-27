/* ÁTOMO — Mensaje de error de un campo.
   Renderizado condicional: si no hay mensaje, no se dibuja nada. */
export interface MensajeErrorProps {
  mensaje?: string | null
  id?: string
}

/** Mensaje de error que se muestra debajo de un campo de formulario. */
export function MensajeError({ mensaje, id }: MensajeErrorProps) {
  if (!mensaje) return null
  return (
    <p className="campo__error" id={id} role="alert">
      {mensaje}
    </p>
  )
}
