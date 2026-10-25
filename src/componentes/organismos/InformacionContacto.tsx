
/* =========================================================
    CONTACTO
    INFORMACIÓN DE CONTACTO
========================================================= */

import { Etiqueta } from '../atomos/Etiqueta'

// Datos recibidos desde ContactoPage.
interface InformacionContactoProps {
  correo: string
  telefono: string
  direccion: string
  horario: string
}

export default function InformacionContacto({
  correo,
  telefono,
  direccion,
  horario
}: InformacionContactoProps) {

  // Datos de las cuatro tarjetas.
  const tarjetas = [
    {
      titulo: 'Correo electrónico',
      descripcion: 'Escríbenos y responderemos tus consultas.',
      dato: correo,
      icono: '✉',
      clase: 'tarjeta-correo'
    },
    {
      titulo: 'Teléfono',
      descripcion: 'Comunícate con nosotros durante nuestro horario.',
      dato: telefono,
      icono: '☎',
      clase: 'tarjeta-telefono'
    },
    {
      titulo: 'Ubicación',
      descripcion: 'Visítanos para recibir atención veterinaria.',
      dato: direccion,
      icono: '●',
      clase: 'tarjeta-ubicacion'
    },
    {
      titulo: 'Horario de atención',
      descripcion: 'Lunes a viernes',
      dato: horario, // Usar el horario recibido desde ContactoPage
      icono: '◷',
      clase: 'tarjeta-horario'
    }
  ]

  return (
    <section className="seccion-informacion-contacto">
      <div className="contenedor">

        {/* Título de la sección */}
        <div className="titulo-seccion">
          <Etiqueta>Estamos cerca de ti</Etiqueta>

          <h2>Información de contacto</h2>

          <p>
            Puedes comunicarte con nosotros mediante
            nuestros distintos canales de atención.
          </p>
        </div>

        {/* Cuatro tarjetas */}
        <div className="grid-info-contacto">
          {tarjetas.map((tarjeta) => (
            <article
              key={tarjeta.titulo}
              className={`tarjeta-info-contacto ${tarjeta.clase}`}
            >

              <div
                className="icono-info-contacto"
                aria-hidden="true"
              >
                {tarjeta.icono}
              </div>

              <h3>{tarjeta.titulo}</h3>

              <p>{tarjeta.descripcion}</p>

              <strong className="dato-info-contacto">
                {tarjeta.dato}
              </strong>

            </article>
          ))}
        </div>

      </div>
    </section>
  )
}
