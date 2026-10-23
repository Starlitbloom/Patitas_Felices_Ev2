/* ORGANISMO — Banner de bienvenida de "Mis mascotas" (texto + ilustración).
   El botón baja hasta el catálogo (#catalogo-mascotas). */

export function HeroMascotas() {
  return (
    <section className="hero-mascotas">
      <div className="contenedor hero-mascotas-contenido">
        <div className="hero-mascotas-texto">
          <span className="hero-mascotas-etiqueta">🐾 Tus mascotas</span>

          <h1>
            Todo sobre tus mascotas <span>en un solo lugar</span>
          </h1>

          <p>
            Revisa las mascotas que has registrado y accede a su información clínica, controles, vacunas e historial
            cuando lo necesites.
          </p>

          <div className="hero-mascotas-acciones">
            <a href="#catalogo-mascotas" className="hero-mascotas-boton">
              Ver mis mascotas
              <span aria-hidden="true">→</span>
            </a>

            <div className="hero-mascotas-mini">
              <span className="hero-mascotas-mini-icono">♡</span>
              <span>Su información siempre a tu alcance</span>
            </div>
          </div>
        </div>

        <div className="hero-mascotas-ilustracion">
          <div className="hero-mascotas-forma hero-mascotas-forma--rosa"></div>
          <div className="hero-mascotas-forma hero-mascotas-forma--celeste"></div>

          <img src="/img/mascotas-cita.png" alt="Ilustración de mascotas de Patitas Felices" />

          <div className="hero-mascotas-decoracion hero-mascotas-decoracion--1">♡</div>
          <div className="hero-mascotas-decoracion hero-mascotas-decoracion--2">🐾</div>
        </div>
      </div>
    </section>
  )
}