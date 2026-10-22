
/* =========================================================
   PÁGINA NOSOTROS
   SECCIÓN MISIÓN Y VISIÓN

   Contiene:
   - Título de la sección.
   - Valores que inspiran a la veterinaria.
   - Tarjeta de misión.
   - Tarjeta de visión.
========================================================= */

import { TituloSeccion } from '../moleculas/TituloSeccion'
import { TarjetaMisionVision } from '../moleculas/TarjetaServicio'

// Datos de misión y visión.
const tarjetas = [
  {
    tipo: 'mision' as const,
    imagen: '/img/mision.png',
    titulo: 'Nuestra misión',
    descripcion:
      'Brindar atención veterinaria de calidad, promoviendo la salud, prevención y bienestar de las mascotas mediante un servicio cercano, responsable y comprometido.',
    etiqueta: 'Nuestro propósito',
    frase: '♡ Cuidar hoy para acompañar mañana'
  },
  {
    tipo: 'vision' as const,
    imagen: '/img/vision.png',
    titulo: 'Nuestra visión',
    descripcion:
      'Ser una veterinaria reconocida por la confianza, el compromiso y la calidad de atención entregada a cada mascota y a su familia.',
    etiqueta: 'Hacia el futuro',
    frase: '✦ Crecer junto a cada familia y cada huellita'
  }
]

//  Valores destacados de la sección.
const valores = [
  '♡ Cariño',
  '🐾 Compromiso',
  '✦ Confianza',
  '♡ Prevención'
]

function SeccionMisionVision() {
  return (
    <section className="mision-vision">
      <div className="contenedor">

        {/* Encabezado de misión y visión */}
        <div className="titulo-inspiracion">

          <TituloSeccion
            etiqueta="Nuestra esencia"
            titulo="Lo que nos inspira"
            descripcion="Nuestro trabajo se guía por el cariño, la prevención, la confianza y el compromiso con cada mascota y su familia."
          />

          {/* Valores de la veterinaria */}
          <div className="inspiracion-detalles">
            {valores.map((valor) => (
              <span key={valor}>
                {valor}
              </span>
            ))}
          </div>

        </div>

        {/* Tarjetas reutilizables de misión y visión */}
        <div className="tarjetas-mision">
          {tarjetas.map((tarjeta) => (
            <TarjetaMisionVision
              key={tarjeta.tipo}
              {...tarjeta}
            />
          ))}
        </div>

      </div>
    </section>
  )
}

export default SeccionMisionVision
