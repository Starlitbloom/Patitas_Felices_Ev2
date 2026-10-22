
/* =========================================================
   PÁGINA NOSOTROS
   HERO NOSOTROS
   Sección principal de la página Nosotros.
   Contiene:
   - Presentación de la veterinaria.
   - Botón para solicitar una cita.
   - Enlace para conocer más.
   - Beneficios de la veterinaria.
   - Carrusel de imágenes de mascotas.
========================================================= */

import { EnlaceBoton } from '../atomos/EnlaceBoton'

// =========================================================
//  DATOS DEL CARRUSEL
// =========================================================

// Arreglo con las imágenes de las mascotas.

const imagenesHero = [
  {
    src: '/img/gato-carino.png',
    alt: 'Gato recibiendo cariño'
  },
  {
    src: '/img/gato-amarillo.jfif',
    alt: 'Gato de pelaje naranja'
  },
  {
    src: '/img/mascotas_casa_cuidados.jpg',
    alt: 'Perro y gato descansando juntos'
  },
  {
    src: '/img/perro2.jfif',
    alt: 'Cachorro descansando sobre el pasto'
  },
  {
    src: '/img/perro3.webp',
    alt: 'Perro de Veterinaria Patitas Felices'
  }
]

// =========================================================
// DATOS DE LOS BENEFICIOS
// =========================================================

const beneficios = [
  'Atención cercana',
  'Prevención',
  'Bienestar animal'
]

// =========================================================
// ORGANISMO HERO NOSOTROS
// =========================================================

function HeroNosotros() {
  return (
    <section className="hero-nosotros">

      <div className="hero-contenido">

        {/* =========================================
            TEXTO PRINCIPAL
        ========================================= */}

        <div className="hero-texto">

          {/* Etiqueta original del Hero */}
          <span className="hero-etiqueta">
            Veterinaria Patitas Felices
          </span>

          {/* Título principal */}
          <h1>
            Cuidamos cada{' '}
            <span>huellita</span>{' '}
            con cariño
          </h1>

          {/* Descripción de la veterinaria */}
          <p className="hero-descripcion">
            Acompañamos a tu mascota en cada etapa
            de su vida, entregándole atención cercana,
            prevención y todo el cuidado que merece.
          </p>

          {/* =========================================
              BOTONES DE NAVEGACIÓN
          ========================================= */}

          <div className="hero-botones">

            {/* Átomo  */}
            <EnlaceBoton to="/solicitar-cita">
              Solicitar una cita{' '}
              <span aria-hidden="true">→</span>
            </EnlaceBoton>

            {/* Enlace a la sección Quiénes somos */}
            <a
              href="#quienes-somos"
              className="enlace-conocenos"
            >
              Conoce más sobre nosotros
            </a>

          </div>

          {/* =========================================
              BENEFICIOS DE LA VETERINARIA
          ========================================= */}

          <div className="hero-beneficios">

            {/* Mostramos los beneficios con map() */}
            {beneficios.map((beneficio) => (
              <div
                className="beneficio"
                key={beneficio}
              >
                <span aria-hidden="true">♡</span>
                <p>{beneficio}</p>
              </div>
            ))}

          </div>

        </div>

        {/* =========================================
            CARRUSEL DE IMÁGENES
        ========================================= */}

        <div className="hero-imagen">

          {/* Decoraciones originales */}
          <div className="decoracion decoracion-celeste"></div>
          <div className="decoracion decoracion-rosa"></div>

          {/* Carrusel de mascotas */}
          <div className="hero-carrusel">

            {imagenesHero.map((imagen, index) => (
              <img
                key={imagen.src}
                src={imagen.src}
                alt={imagen.alt}
                className={`hero-slide hero-slide-${index + 1}`}
              />
            ))}

          </div>

          {/* Huellita decorativa */}
          <span
            className="huellita-decorativa"
            aria-hidden="true"
          >
            🐾
          </span>

        </div>

      </div>

    </section>
  )
}

export default HeroNosotros
