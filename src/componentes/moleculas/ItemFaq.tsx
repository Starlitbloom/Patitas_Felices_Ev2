/* MOLÉCULA — Pregunta frecuente (acordeón).
   Es controlado: el padre decide cuál está abierto ("abierto")
   y recibe el clic con "onAlternar". */
import { useRef } from 'react'

export interface ItemFaqProps {
  icono: string
  pregunta: string
  respuesta: string
  abierto: boolean
  onAlternar: () => void
}

export function ItemFaq({ icono, pregunta, respuesta, abierto, onAlternar }: ItemFaqProps) {
  const refRespuesta = useRef<HTMLDivElement>(null)
  return (
    <div className={`faq-item ${abierto ? 'faq-item--abierto' : ''}`.trim()}>
      <button type="button" className="faq-pregunta" onClick={onAlternar} aria-expanded={abierto}>
        <span className="faq-icono-tema">
          <img src={icono} alt="" />
        </span>
        <span className="faq-pregunta-texto">{pregunta}</span>
        <span className="faq-icono" aria-hidden="true">
          ＋
        </span>
      </button>
      <div
        ref={refRespuesta}
        className="faq-respuesta"
        // la altura real del contenido permite la animación de apertura del CSS
        style={{ maxHeight: abierto ? `${refRespuesta.current?.scrollHeight ?? 500}px` : undefined }}
      >
        <p>{respuesta}</p>
      </div>
    </div>
  )
}
