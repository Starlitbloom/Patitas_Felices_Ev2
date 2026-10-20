/* ORGANISMO — Llamado final a solicitar una cita. */
import { Link } from 'react-router-dom'
import { Etiqueta } from '../atomos/Etiqueta'

export function SeccionCta() {
  return (
    <section className="cta-cita">
      <div className="contenedor">
        <div className="cta-contenido">
          <div className="cta-texto">
            <Etiqueta>🐾 Estamos para ayudarte</Etiqueta>
            <h2>¿Tu mascota necesita atención?</h2>
            <p>Solicita una cita de manera rápida y déjanos acompañarte en el cuidado, salud y bienestar de tu compañero.</p>
            <div className="cta-beneficios">
              <span>♡ Atención cercana</span>
              <span>✦ Agenda fácil y rápida</span>
            </div>
          </div>
          <div className="cta-ilustracion">
            <div className="cta-fondo cta-fondo-rosa" />
            <div className="cta-fondo cta-fondo-celeste" />
            <img src="/img/cta-mascotas.png" alt="Perro y gato representando el cuidado de mascotas" />
          </div>
          <div className="cta-accion">
            <Link to="/solicitar-cita" className="boton-cta">
              Solicitar cita <span>→</span>
            </Link>
            <small>Agenda en pocos pasos</small>
          </div>
        </div>
      </div>
    </section>
  )
}
