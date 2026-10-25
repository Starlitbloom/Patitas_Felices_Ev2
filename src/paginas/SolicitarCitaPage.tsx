
/* SOLICITAR CITA */

import { Link } from 'react-router-dom'
import HeroSolicitarCita from '../componentes/organismos/HeroSolicitarCita'
import FormularioSolicitarCita from '../componentes/organismos/FormularioSolicitarCita'
import { RutaProtegida } from '../routes/RutaProtegida'
import '../styles/estilo-solicitar-cita.css'

export default function SolicitarCitaPage() {
  return (
    <RutaProtegida>
      <main className="solicitar-cita-v2">
        {/*  Encabezado */}
        <HeroSolicitarCita />

        {/*  Formulario */}
        <FormularioSolicitarCita />

        {/* Seccion de ayuda */}
        <section className="seccion-ayuda-cita">
          <div className="contenedor ayuda-cita-contenido">
            <div className="ayuda-cita-texto">
              <span className="etiqueta-ayuda">
                ¿Necesitas ayuda?
              </span>

              <h2>Estamos para orientarte</h2>

              <p>
                Si tienes dudas antes de solicitar tu cita,
                escríbenos y estaremos encantados de ayudarte.
              </p>
            </div>

            <div className="ayuda-cita-imagen">
              <img
                src="/img/mascotas-cita.png"
                alt="Mascotas de Veterinaria Patitas Felices"
              />
            </div>

            <Link
              to="/contacto"
              className="boton-contacto-cita"
            >
              Ir a contacto
              <span aria-hidden="true"> → </span>
            </Link>
          </div>
        </section>
      </main>
    </RutaProtegida>
  )
}
