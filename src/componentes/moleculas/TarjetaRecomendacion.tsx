
/* =========================================================
   DETALLE DE NOVEDADES
   TARJETA RECOMENDACIÓN

   Recibe:
   - Texto de la recomendación.
   - Icono correspondiente.

   Se reutiliza en los cuatro artículos.
========================================================= */

interface TarjetaRecomendacionProps {
  texto: string
  icono: string
}

export function TarjetaRecomendacion({
  texto,
  icono
}: TarjetaRecomendacionProps) {
  return (
    <div className="punto-item">

      {/* Imagen de la recomendación */}
      <div className="punto-icono">
        <img src={icono} alt="" />
      </div>

      {/* Texto de la recomendación */}
      <p>{texto}</p>

    </div>
  )
}
