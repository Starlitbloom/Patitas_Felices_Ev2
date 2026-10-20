/* ORGANISMO — Adelanto de novedades con enlace a la página completa. */
import { Link } from 'react-router-dom'
import { NOVEDADES_DESTACADAS } from '../../data/contenidoInicio'
import { Etiqueta } from '../atomos/Etiqueta'

const TEMAS = ['Salud', 'Bienestar', 'Prevención', 'Consejos']

export function SeccionNovedades() {
  return (
    <section className="quienes-somos">
      <div className="quienes-contenido">
        <div className="quienes-texto">
          <Etiqueta>Al día con tu mascota</Etiqueta>
          <h2>Últimas novedades</h2>
          <p>Campañas de vacunación, consejos de cuidado y novedades de la clínica para que siempre estés informado.</p>
          <div className="quienes-destacados">
            {TEMAS.map((t) => (
              <span key={t} className="destacado">
                ♡ {t}
              </span>
            ))}
          </div>
          <div className="quienes-mini-lista">
            {NOVEDADES_DESTACADAS.map((n) => (
              <Link key={n.titulo} to="/novedades" className="quienes-mini-item">
                <span className="quienes-mini-icono">{n.icono}</span>
                <div className="quienes-mini-texto">
                  <h4>{n.titulo}</h4>
                  <span>{n.fecha}</span>
                </div>
                <span className="quienes-mini-flecha">→</span>
              </Link>
            ))}
          </div>
          <div className="hero-botones mt-4">
            <Link to="/novedades" className="boton-principal">
              Ver todas las novedades <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <div className="quienes-imagenes">
          <div className="quienes-decoracion decoracion-qs-rosa" />
          <div className="quienes-decoracion decoracion-qs-celeste" />
          <div className="carrusel-nosotros">
            <img src="/img/atencion-perrito.jfif" alt="Veterinaria atendiendo a un perro" className="imagen-nosotros imagen-nosotros-1" />
            <img src="/img/equipo.png" alt="Equipo veterinario junto a un perro" className="imagen-nosotros imagen-nosotros-2" />
          </div>
          <div className="quienes-badge">
            <span>🐾</span> Actualizado cada semana
          </div>
        </div>
      </div>
    </section>
  )
}
