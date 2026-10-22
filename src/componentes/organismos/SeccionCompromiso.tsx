
/* =========================================================
   PÁGINA NOSOTROS
   NUESTRO COMPROMISO

   Contiene cuatro tarjetas:
   - Atención veterinaria.
   - Vacunación.
   - Controles preventivos.
   - Bienestar animal.
========================================================= */

import { TituloSeccion } from '../moleculas/TituloSeccion'
import { TarjetaServicio } from '../moleculas/TarjetaServicio'

//  Información de las tarjetas.
const compromisos = [
  {
    imagen: '/img/veterinario.png',
    titulo: 'Atención veterinaria',
    descripcion:
      'Atención cercana y responsable para cuidar la salud de tu mascota.'
  },
  {
    imagen: '/img/vacuna.png',
    titulo: 'Vacunación',
    descripcion:
      'Prevención y protección para acompañar cada etapa de su vida.'
  },
  {
    imagen: '/img/cuidado.png',
    titulo: 'Controles preventivos',
    descripcion:
      'Revisiones periódicas para ayudar a mantener su salud y bienestar.'
  },
  {
    imagen: '/img/bienestar.png',
    titulo: 'Bienestar animal',
    descripcion:
      'Cuidado basado en el respeto, cariño y compromiso con cada paciente.'
  }
]

function SeccionCompromiso() {
  return (
    <section className="valores">
      <div className="contenedor">

        {/* Título reutilizable */}
        <TituloSeccion
          etiqueta="Siempre a tu lado"
          titulo="Nuestro compromiso"
          descripcion="Trabajamos pensando en la salud, prevención y bienestar de cada mascota."
        />

        {/* Cuatro tarjetas de compromiso */}
        <div className="grid-valores">
          {compromisos.map((compromiso) => (
            <TarjetaServicio
              key={compromiso.titulo}
              imagen={compromiso.imagen}
              titulo={compromiso.titulo}
              descripcion={compromiso.descripcion}
            />
          ))}
        </div>

      </div>
    </section>
  )
}

export default SeccionCompromiso
