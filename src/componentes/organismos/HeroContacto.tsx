
/* =========================================================
   CONTACTO
   HERO CONTACTO

   Presentación principal de la página Contacto.
========================================================= */

export default function HeroContacto() {
  return (
    <section className="hero-contacto">

      {/*Burbujas decorativas */}
      <div className="burbuja-contacto burbuja-contacto-1"></div>
      <div className="burbuja-contacto burbuja-contacto-2"></div>

      <div className="contenedor hero-contacto-contenido">

        {/* Textos principales */}
        <div className="hero-contacto-texto">

          <span className="etiqueta-contacto">
            Estamos para ayudarte
          </span>

          <h1>
            Hablemos sobre el cuidado de tu mascota
          </h1>

          <p>
            Si tienes dudas, necesitas orientación o deseas
            comunicarte con nosotros, completa el formulario.
            Nuestro equipo estará encantado de ayudarte.
          </p>

        </div>

        {/* Ilustración */}
        <div className="hero-contacto-imagen">

          <div className="circulo-hero-contacto"></div>

          <img
            src="/img/veterinario.png"
            alt="Ilustración de atención veterinaria"
          />

        </div>

      </div>
    </section>
  )
}
