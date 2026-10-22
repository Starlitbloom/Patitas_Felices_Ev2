
/* =========================================================
    PÁGINA NOVEDADES
    HERO NOVEDADES

   Contiene:
   - Imagen principal de mascotas.
   - Título de la página.
   - Descripción de novedades.
   - Categorías de información.

  
========================================================= */

//Categorías del Hero.
const categoriasNovedades = [
  'Salud',
  'Bienestar',
  'Prevención',
  'Consejos'
]

// Organismo principal.
function HeroNovedades() {
  return (
    <section className="hero-novedades">

      {/* Círculos decorativos del fondo */}
      <div className="burbuja burbuja-1"></div>
      <div className="burbuja burbuja-2"></div>

      <div className="hero-contenido">

        {/* Imagen principal de mascotas */}
        <div className="hero-imagen-novedades">

          <div className="circulo-decorativo circulo-rosa"></div>
          <div className="circulo-decorativo circulo-morado"></div>

          <img
            src="/img/grupo-de-perro.webp"
            alt="Grupo de perros y gatos"
          />

        </div>

        {/* Información del Hero */}
        <div className="hero-texto-novedades">

          {/* Etiqueta propia del diseño original */}
          <span className="etiqueta-hero">
            Patitas al día
          </span>

          {/* Título principal */}
          <h1>
            Novedades y consejos para{' '}
            <span>cuidar a tu mascota</span>
          </h1>

          {/* Descripción */}
          <p>
            Encuentra información, recomendaciones y
            novedades para acompañar a tu mascota
            en cada etapa de su vida.
          </p>

          {/* Categorías generadas desde un arreglo */}
          <div className="categorias-hero">

            {categoriasNovedades.map((categoria) => (
              <span key={categoria}>
                ♡ {categoria}
              </span>
            ))}

          </div>

        </div>

      </div>
    </section>
  )
}

export default HeroNovedades
