/* ORGANISMO — Preguntas frecuentes.
   Guarda en useState el índice de la pregunta abierta: así solo
   puede haber una abierta a la vez (comportamiento de la EP1). */
import { useState } from 'react'
import { PREGUNTAS_FRECUENTES } from '../../data/contenidoInicio'
import { ItemFaq } from '../moleculas/ItemFaq'
import { TituloSeccion } from '../moleculas/TituloSeccion'

export interface SeccionFaqProps {
  preguntas?: typeof PREGUNTAS_FRECUENTES
}

export function SeccionFaq({ preguntas = PREGUNTAS_FRECUENTES }: SeccionFaqProps) {
  const [abierta, setAbierta] = useState<number | null>(null)

  return (
    <section className="faq">
      <div className="contenedor">
        <TituloSeccion
          etiqueta="Resolvemos tus dudas"
          titulo="Preguntas frecuentes"
          descripcion="Si tienes otra duda, contáctanos y te respondemos con gusto."
        />
        <div className="faq-lista">
          {preguntas.map((p, i) => (
            <ItemFaq
              key={p.pregunta}
              {...p}
              abierto={abierta === i}
              onAlternar={() => setAbierta(abierta === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
