
/* =========================================================
   SOLICITAR CITA
   HERO SOLICITAR CITA

   Contiene:
   - Etiqueta informativa.
   - Título principal.
   - Descripción.
   - Beneficios.
   - Imagen original de mascotas.

========================================================= */

export default function HeroSolicitarCita() {
  return (
    <section className="hero-cita">

      {/* Decoraciones originales */}
      <div
        className="decoracion-cita decoracion-cita-1"
        aria-hidden="true"
      />

      <div
        className="decoracion-cita decoracion-cita-2"
        aria-hidden="true"
      />

      <div className="contenedor hero-cita-contenido">

        {/* =========================================
            TEXTO PRINCIPAL
        ========================================= */}

        <div className="hero-cita-texto">

          <span className="etiqueta-cita">
            Agenda fácil y rápida
          </span>

          <h1>
            Solicita una cita para{' '}
            <span>tu mascota</span>
          </h1>

          <p>
            Completa el formulario con los datos de tu mascota
            y selecciona el día y horario que prefieras.
          </p>

          {/* Beneficios de solicitar una cita */}
          <div className="hero-cita-beneficios">

            <span>
              ♡ Atención cercana
            </span>

            <span>
              ✦ Proceso sencillo
            </span>

            <span>
              ✓ Confirmación de tu solicitud
            </span>

          </div>

        </div>

        {/* =========================================
            IMAGEN ORIGINAL 
        ========================================= */}

        <div className="hero-cita-imagen">

          <img
            src="/img/mascotas-hero-cita.png"
            alt="Perros y gatos de Veterinaria Patitas Felices"
            className="imagen-hero-mascotas"
          />

        </div>

      </div>

    </section>
  )
}
