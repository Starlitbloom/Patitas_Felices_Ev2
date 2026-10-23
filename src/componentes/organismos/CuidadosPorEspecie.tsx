/* ORGANISMO — "Cuidados básicos por especie": 4 infografías que se
   amplían en un visor al hacer clic (estado = imagen abierta o null) */
import { useEffect, useState } from 'react'
import { TituloSeccion } from '../moleculas/TituloSeccion'

interface Infografia {
  src: string
  alt: string
}

const INFOGRAFIAS: Infografia[] = [
  { src: '/img/perritoinfografia.png', alt: 'Infografía cuidados de perro' },
  { src: '/img/gatitoinfografia.png', alt: 'Infografía cuidados de gato' },
  { src: '/img/conejosinfografia.png', alt: 'Infografía cuidados de conejo' },
  { src: '/img/avesinfografia.png', alt: 'Infografía cuidados de aves' },
]

export function CuidadosPorEspecie() {
  const [abierta, setAbierta] = useState<Infografia | null>(null)

  // Mismo atajo que en la EP1: la tecla Escape también cierra el visor.
  useEffect(() => {
    if (!abierta) return
    const manejarTecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAbierta(null)
    }
    document.addEventListener('keydown', manejarTecla)
    return () => document.removeEventListener('keydown', manejarTecla)
  }, [abierta])

  return (
    <section className="contenedor seccion-cuidados" aria-labelledby="titulo-cuidados">
      <TituloSeccion
        etiqueta="Guía rápida"
        titulo="Cuidados básicos por especie"
        descripcion="Algunas recomendaciones generales para mantener a tu mascota sana entre visita y visita"
      />

      <div className="grid-embebido">
        {INFOGRAFIAS.map((info) => (
          <article className="tarjeta-cuidado" key={info.src}>
            <img
              src={info.src}
              alt={info.alt}
              className="img-cuidados"
              onClick={() => setAbierta(info)}
            />
          </article>
        ))}
      </div>

      {/* Visor ampliado (lightbox): mismo markup que la EP1, pero visible
          solo cuando hay una infografía seleccionada en el estado. */}
      <div className={`visor-infografia ${abierta ? 'visor-infografia--abierto' : ''}`.trim()} onClick={(e) => { if (e.target === e.currentTarget) setAbierta(null) }}>
        <button type="button" className="visor-infografia-cerrar" aria-label="Cerrar imagen ampliada" onClick={() => setAbierta(null)}>
          ✕
        </button>
        {abierta && <img src={abierta.src} alt={abierta.alt} />}
      </div>
    </section>
  )
}