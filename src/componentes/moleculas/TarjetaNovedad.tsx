
/* =========================================================
   NOVEDADES
   TARJETA NOVEDAD

   Muestra la imagen, categoría, fecha, título
   y descripción de una publicación.

   Utiliza Link de React Router para navegar
   al detalle sin recargar la aplicación.
========================================================= */

import { Link } from 'react-router-dom'
import type { Novedad } from '../../data/contenidoNovedades'

//  Propiedades tipadas con TypeScript.
interface TarjetaNovedadProps {
  novedad: Novedad
}

export function TarjetaNovedad({
  novedad
}: TarjetaNovedadProps) {
  return (
    <article className="tarjeta-novedad">

      {/* Imagen y categoría de la publicación */}
      <div className="tarjeta-imagen">
        <img
          src={novedad.imagen}
          alt={novedad.alt}
        />

        <span className={`categoria categoria-${
          novedad.categoria === 'Prevención'
            ? 'celeste'
            : 'rosa'
        }`}>
          {novedad.categoria}
        </span>
      </div>

      {/* Información de la publicación */}
      <div className="tarjeta-contenido">

        <p className="fecha">{novedad.fecha}</p>

        <h3>{novedad.titulo}</h3>

        <p>{novedad.descripcion}</p>

        {/* Ruta específica de cada artículo */}
        <Link to={`/detalle-novedad?articulo=${novedad.id}`}>
          Leer más →
        </Link>

      </div>
    </article>
  )
}
