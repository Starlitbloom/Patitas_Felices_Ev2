
/* =========================================================
    DETALLE DE NOVEDADES

   Funcionalidades:
   - Identificar el artículo desde la URL.
   - Mostrar su información completa.
   - Reutilizar las tarjetas de recomendaciones.
   - Volver a Novedades.
   - Mostrar la sección de solicitar cita.

========================================================= */

import { Link, useSearchParams } from 'react-router-dom'

// Datos de las publicaciones.
import { NOVEDADES } from '../data/contenidoNovedades'

// Textos completos de los artículos.
import { DETALLES_NOVEDADES } from '../data/detalleNovedades'

// Molécula desarrollada para nuestra parte.
import { TarjetaRecomendacion } from '../componentes/moleculas/TarjetaRecomendacion'

// Organismo reutilizado del proyecto.
import { SeccionCta } from '../componentes/organismos/SeccionCta'

// Estilos originales adaptados para React.
import '../styles/estilo-detalle-novedad.css'

function DetalleNovedadPage() {

  // Obtenemos el ID desde la URL.
  const [parametros] = useSearchParams()
  const id = parametros.get('articulo')

  // Buscamos la noticia seleccionada.
  const novedad = NOVEDADES.find(
    (item) => item.id === id
  )

  // Buscamos el contenido completo.
  const detalle = id
    ? DETALLES_NOVEDADES[id]
    : undefined

  // Si el artículo no existe, mostramos un mensaje.
  if (!novedad || !detalle) {
    return (
      <main className="container py-5 text-center">
        <h1>Artículo no encontrado</h1>

        <p>
          La publicación que buscas no está disponible.
        </p>

        <Link to="/novedades" className="boton-principal">
          Volver a novedades
        </Link>
      </main>
    )
  }

  return (
    <main>

      {/* =========================================
          PRESENTACIÓN DEL ARTÍCULO
      ========================================= */}

      <section className="hero-detalle">
        <div className="burbuja burbuja-1"></div>
        <div className="burbuja burbuja-2"></div>

        <div className="contenedor detalle-hero-contenido">

          <Link
            to="/novedades"
            className="volver-novedades"
          >
            ← Volver a novedades
          </Link>

          <span className="categoria-articulo">
            {novedad.categoria}
          </span>

          <p className="fecha-articulo">
            {novedad.fecha}
          </p>

          <h1>{novedad.titulo}</h1>

          <p className="resumen-articulo">
            {novedad.descripcion}
          </p>

        </div>
      </section>

      {/* =========================================
          IMAGEN PRINCIPAL DEL ARTÍCULO
      ========================================= */}

      <section className="seccion-imagen-articulo">
        <div className="contenedor">
          <div className="imagen-articulo">
            <img
              src={novedad.imagen}
              alt={novedad.alt}
            />
          </div>
        </div>
      </section>

      {/* =========================================
          CONTENIDO DEL ARTÍCULO
      ========================================= */}

      <section className="seccion-contenido-articulo">
        <div className="contenedor">

          <article className="articulo-contenido">

            <span className="etiqueta-contenido">
              Información para tu mascota
            </span>

            {/* Primer subtítulo */}
            <h2>{detalle.subtitulo}</h2>

            <p>{detalle.parrafo1}</p>
            <p>{detalle.parrafo2}</p>

            {/* Consejo destacado */}
            <div className="consejo-destacado">

              <div className="consejo-icono">
                ♡
              </div>

              <div className="consejo-texto">
                <span>Consejo Patitas Felices</span>
                <p>{detalle.consejo}</p>
              </div>

            </div>

            {/* Segunda parte del artículo */}
            <h2>{detalle.subtituloDos}</h2>

            <p>{detalle.parrafo3}</p>

            {/* Tres recomendaciones */}
            <div className="puntos-importantes">

              <h3>Recuerda</h3>

              <div className="grid-puntos">

                {detalle.recomendaciones.map(
                  (recomendacion) => (
                    <TarjetaRecomendacion
                      key={recomendacion.texto}
                      texto={recomendacion.texto}
                      icono={recomendacion.icono}
                    />
                  )
                )}

              </div>

            </div>

          </article>

        </div>
      </section>

      {/* =========================================
          VOLVER A NOVEDADES
      ========================================= */}

      <section className="seccion-volver">
        <div className="contenedor">
          <Link to="/novedades" className="boton-volver">
            ← Ver más novedades
          </Link>
        </div>
      </section>

      {/* Sección compartida de solicitar cita */}
      <SeccionCta />

    </main>
  )
}

export default DetalleNovedadPage
