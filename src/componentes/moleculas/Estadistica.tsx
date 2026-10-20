/* MOLÉCULA — Estadística con número animado.
   Reemplaza el contador de index-interactivo.js: cuando la tarjeta
   entra en pantalla (IntersectionObserver) el número sube de 0 a "hasta". */
import { useEffect, useRef, useState } from 'react'

export interface EstadisticaProps {
  icono: string
  hasta: number
  sufijo?: string
  etiqueta: string
}

export function Estadistica({ icono, hasta, sufijo = '', etiqueta }: EstadisticaProps) {
  const [valor, setValor] = useState(0)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const elemento = ref.current
    // Sin IntersectionObserver (navegadores antiguos o pruebas): muestra el valor final
    if (!elemento || typeof IntersectionObserver === 'undefined') {
      setValor(hasta)
      setVisible(true)
      return
    }
    let frame = 0
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return
        setVisible(true)
        observador.disconnect()
        const inicio = performance.now()
        const paso = (ahora: number) => {
          const progreso = Math.min((ahora - inicio) / 1200, 1)
          setValor(Math.floor(progreso * hasta))
          if (progreso < 1) frame = requestAnimationFrame(paso)
        }
        frame = requestAnimationFrame(paso)
      },
      { threshold: 0.5 },
    )
    observador.observe(elemento)
    return () => {
      observador.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [hasta])

  return (
    <div ref={ref} className={`estadistica ${visible ? 'estadistica--visible' : ''}`.trim()}>
      <div className="estadistica-icono">
        <img src={icono} alt="" />
      </div>
      <span className="estadistica-numero">
        {valor}
        {sufijo}
      </span>
      <p>{etiqueta}</p>
    </div>
  )
}
