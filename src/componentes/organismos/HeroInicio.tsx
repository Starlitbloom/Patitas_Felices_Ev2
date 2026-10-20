/* ORGANISMO — Portada de la página de inicio + tarjetas flotantes. */
import { Link } from 'react-router-dom'
import { BENEFICIOS } from '../../data/contenidoInicio'
import { TarjetaServicio } from '../moleculas/TarjetaServicio'

export function HeroInicio() {
  return (
    <>
      <section className="hero-corte">
        <div className="hero-corte-imagen">
          <img src="/img/gato-con-patas-abiertas.jpg" alt="Gatito jugando con las patas abiertas" />
        </div>
        <div className="hero-corte-contenido">
          <div className="hero-corte-texto">
            <h1>
              Dile hola a tu nuevo
              <br />
              <span>mejor amigo</span>
            </h1>
            <p>
              Consultas, vacunación, cirugía y control de peso para perros, gatos, conejos y aves. Agenda tu hora en
              línea y lleva el historial clínico de tu mascota siempre a mano.
            </p>
            <Link to="/solicitar-cita" className="boton-principal">
              <span>Solicitar una cita</span>
              <span className="flecha-boton" aria-hidden="true">
                ⟶
              </span>
            </Link>
          </div>
        </div>
      </section>
      <div className="hero-corte-tarjetas">
        {BENEFICIOS.map((b) => (
          <TarjetaServicio key={b.titulo} {...b} variante="flotante" />
        ))}
      </div>
    </>
  )
}
