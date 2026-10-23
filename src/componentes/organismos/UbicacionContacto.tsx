
/* =========================================================
   CONTACTO
   UBICACIÓN DE LA VETERINARIA

   Funcionalidades:
   - Mostrar la ubicación de la veterinaria.
   - Presentar la dirección.
   - Incorporar un mapa de Google Maps.
   - Utilizar propiedades para reutilizar el componente.
========================================================= */

import { TituloSeccion } from '../moleculas/TituloSeccion'

// Propiedades del organismo.
interface UbicacionContactoProps {
  direccion: string
  ciudad: string
  mapaUrl?: string
}

// Sección de ubicación.
export default function UbicacionContacto({
  direccion,
  ciudad,
  mapaUrl
}: UbicacionContactoProps) {
  return (
    <section className="seccion-ubicacion-contacto">

      <div className="contenedor">

        {/* Título reutilizable */}
        <TituloSeccion
          etiqueta="Encuéntranos"
          titulo="Nuestra ubicación"
          descripcion="Conoce dónde estamos y cómo llegar a nuestra veterinaria."
        />

        {/*Contenido de ubicación */}
        <div className="ubicacion-contacto-contenido">

          {/* Información de dirección */}
          <div className="ubicacion-contacto-info">

            <div className="ubicacion-contacto-icono" aria-hidden="true">
              📍
            </div>

            <h3>Visítanos</h3>

            <p>
              Estamos ubicados en {ciudad}.
            </p>

            <p className="ubicacion-contacto-direccion">
              {direccion}
            </p>

            <p>
              Te esperamos para acompañarte en el cuidado
              y bienestar de tu mascota.
            </p>

          </div>

          {/* Mapa de ubicación */}
          <div className="ubicacion-contacto-mapa">

            {mapaUrl ? (
              <iframe
                src={mapaUrl}
                title="Mapa de ubicación de Veterinaria Patitas Felices"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : (
              <div className="ubicacion-contacto-sin-mapa">
                <span aria-hidden="true">📍</span>
                <p>Mapa de ubicación pendiente de configurar.</p>
              </div>
            )}

          </div>

        </div>

      </div>

    </section>
  )
}
