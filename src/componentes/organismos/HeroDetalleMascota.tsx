/* ORGANISMO — Banner superior del detalle de mascota (texto + ilustración).
   Es contenido fijo: no recibe datos ni tiene estado. */

export function HeroDetalleMascota() {
  return (
    <section className="detalle-hero">
      <div className="contenedor detalle-hero-contenido">
        {/* Columna izquierda: etiqueta, título y bajada */}
        <div className="detalle-hero-texto">
          {/* Etiqueta celeste sobre el título */}
          <span className="detalle-hero-etiqueta">🐾 Tus mascotas</span>

          {/* Título: la segunda línea va en azul (el span) */}
          <h1>
            Toda su información <span>en un solo lugar</span>
          </h1>

          {/* Texto que explica qué se puede ver en la página */}
          <p>
            Consulta los datos de tu mascota, revisa su ficha clínica, historial de atenciones y calendario de
            vacunación.
          </p>
        </div>

        {/* Columna derecha: ilustración con dos formas de color detrás */}
        <div className="detalle-hero-ilustracion">
          {/* Formas rosa y celeste de fondo (solo decoración) */}
          <div className="detalle-hero-forma detalle-hero-forma--rosa"></div>
          <div className="detalle-hero-forma detalle-hero-forma--celeste"></div>

          {/* Imagen de perro y gato (está en public/img) */}
          <img src="/img/mascotas-cita.png" alt="Ilustración de mascotas de Patitas Felices" />
        </div>
      </div>
    </section>
  )
}