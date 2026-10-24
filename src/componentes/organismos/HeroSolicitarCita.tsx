
/* =========================================================
   SOLICITAR CITA
   HERO SOLICITAR CITA

   Presentación principal con:
   - Etiqueta.
   - Título.
   - Descripción.
   - Beneficios.
   - Ilustración de mascotas.
========================================================= */

export default function HeroSolicitarCita() {
  return (
    <section className="hero-cita">

      <div className="contenedor hero-cita-contenido">

        {/* =========================================
           INFORMACIÓN DEL HERO
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

          {/* Beneficios */}
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
         ILUSTRACIÓN DE MASCOTAS
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
