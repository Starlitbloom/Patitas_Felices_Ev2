/* ORGANISMO — "Cómo cuidamos a tu mascota": texto + video de YouTube (contenido estático). */

export function VideoCuidados() {
  return (
    <section className="contenedor seccion-video-cuidados" aria-labelledby="titulo-video-cuidados">
      <div className="video-cuidados-tarjeta">
        <div className="video-cuidados-texto">
          <span className="seccion-etiqueta">Guía rápida</span>
          <h2 id="titulo-video-cuidados">Cómo cuidamos a tu mascota</h2>
          <p>Conoce un poco más sobre nuestra rutina de control, vacunación y seguimiento clínico.</p>

          <div className="video-cuidados-puntos">
            <div>
              <span>✓</span>
              Control preventivo
            </div>
            <div>
              <span>✓</span>
              Vacunación
            </div>
            <div>
              <span>✓</span>
              Seguimiento clínico
            </div>
          </div>
        </div>

        <div className="video-embebido">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/8G7ACda1JhY"
            title="Cómo cuidamos a tu mascota - Veterinaria Patitas Felices"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  )
}