
/* MOLÉCULA — Tarjeta de servicio / beneficio (imagen + título + texto).
   Se reutiliza en "Nuestros servicios" y en las tarjetas flotantes del hero. */
export interface TarjetaServicioProps {
  imagen: string
  titulo: string
  descripcion: string
  variante?: 'servicio' | 'flotante'
}

/** Tarjeta de servicio del inicio; la variante "flotante" se usa sobre el hero. */
export function TarjetaServicio({ imagen, titulo, descripcion, variante = 'servicio' }: TarjetaServicioProps) {
  if (variante === 'flotante') {
    return (
      <div className="tarjeta-flotante">
        <img src={imagen} alt="" className="tarjeta-flotante-imagen" />
        <h3>{titulo}</h3>
        <p>{descripcion}</p>
      </div>
    )
  }
  return (
    <article className="valor">
      <img src={imagen} alt="" className="icono-valor" />
      <h3>{titulo}</h3>
      <p>{descripcion}</p>
    </article>
  )
}


/* =========================================================
   PÁGINA NOSOTROS
   MOLÉCULA: TARJETA MISIÓN Y VISIÓN

   Componente reutilizable para mostrar:
   - Nuestra misión.
   - Nuestra visión.
========================================================= */

export interface TarjetaMisionVisionProps {
  tipo: 'mision' | 'vision'
  imagen: string
  titulo: string
  descripcion: string
  etiqueta: string
  frase: string
}

export function TarjetaMisionVision({
  tipo,
  imagen,
  titulo,
  descripcion,
  etiqueta,
  frase
}: TarjetaMisionVisionProps) {
  return (
    <article className={`tarjeta tarjeta-${tipo}`}>

      {/* Decoración e imagen de la tarjeta */}
      <div className="contenedor-ilustracion">
        <div className={`fondo-ilustracion fondo-${tipo}`} />

        <img
          src={imagen}
          alt={titulo}
          className="ilustracion-mision"
        />
      </div>

      {/* Contenido de misión o visión */}
      <div className="contenido-tarjeta">

        <span
          className={
            tipo === 'vision'
              ? 'mini-etiqueta mini-etiqueta-vision'
              : 'mini-etiqueta'
          }
        >
          {etiqueta}
        </span>

        <h3>{titulo}</h3>

        <p>{descripcion}</p>

        <div
          className={
            tipo === 'vision'
              ? 'frase-mision frase-vision'
              : 'frase-mision'
          }
        >
          {frase}
        </div>

      </div>
    </article>
  )
}
