
/* =========================================================
   PÁGINA NOSOTROS
   SECCIÓN ¿QUIÉNES SOMOS?

   Contiene:
   - Carrusel con imágenes de la veterinaria.
   - Presentación de Patitas Felices.
   - Información sobre nuestro propósito.
   - Tres características destacadas.
========================================================= */

import { Etiqueta } from '../atomos/Etiqueta'

// =========================================================
// IMÁGENES DE LA SECCIÓN
// =========================================================

const imagenesNosotros = [
  {
    src: '/img/atencion-perrito.jfif',
    alt: 'Veterinaria atendiendo a un perro'
  },
  {
    src: '/img/equipo.png',
    alt: 'Equipo veterinario junto a un perro'
  }
]

// =========================================================
// CARACTERÍSTICAS DESTACADAS
// =========================================================

const destacados = [
  'Atención cercana',
  'Cuidado responsable',
  'Amor por los animales'
]

// =========================================================
// ORGANISMO SECCIÓN QUIÉNES SOMOS
// =========================================================

function SeccionQuienesSomos() {
  return (
    <section
      className="quienes-somos"
      id="quienes-somos"
    >
      <div className="quienes-contenido">

        {/* =========================================
            CARRUSEL DE IMÁGENES
        ========================================= */}

        <div className="quienes-imagenes">

          {/* Decoraciones originales */}
          <div className="quienes-decoracion decoracion-qs-rosa"></div>
          <div className="quienes-decoracion decoracion-qs-celeste"></div>

          {/* Carrusel de fotografías */}
          <div className="carrusel-nosotros">

            {imagenesNosotros.map((imagen, index) => (
              <img
                key={imagen.src}
                src={imagen.src}
                alt={imagen.alt}
                className={`imagen-nosotros imagen-nosotros-${index + 1}`}
              />
            ))}

          </div>

          {/* Etiqueta decorativa sobre las imágenes */}
          <div className="quienes-badge">
            <span aria-hidden="true">♡</span>
            Cuidamos con cariño
          </div>

        </div>

        {/* =========================================
            INFORMACIÓN DE LA VETERINARIA
        ========================================= */}

        <div className="quienes-texto">

          {/* Átomo  */}
          <Etiqueta>Sobre nosotros</Etiqueta>

          <h2>¿Quiénes somos?</h2>

          {/* Presentación de la veterinaria */}
          <p>
            En <strong>Veterinaria Patitas Felices</strong>
            {' '}nos dedicamos al cuidado, prevención y bienestar
            de las mascotas, entregando una atención cercana,
            responsable y comprometida con cada paciente.
          </p>

          {/* Atención a las mascotas */}
          <p>
            Sabemos que cada mascota forma una parte importante
            de su familia. Por eso buscamos acompañarlas durante
            las distintas etapas de su vida, entregando orientación,
            controles preventivos y atención veterinaria pensada
            especialmente en sus necesidades.
          </p>

          {/* Propósito de Patitas Felices */}
          <p>
            Nuestro propósito es crear un espacio donde las mascotas
            puedan sentirse seguras y cuidadas, mientras sus familias
            encuentran confianza, apoyo y tranquilidad al momento
            de preocuparse por su salud.
          </p>

          {/* =========================================
              CARACTERÍSTICAS DESTACADAS
          ========================================= */}

          <div className="quienes-destacados">

            {destacados.map((destacado) => (
              <div
                className="destacado"
                key={destacado}
              >
                <span aria-hidden="true">♡</span>
                {destacado}
              </div>
            ))}

          </div>

        </div>

      </div>
    </section>
  )
}

export default SeccionQuienesSomos
