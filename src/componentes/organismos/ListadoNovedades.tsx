
/* =========================================================
    NOVEDADES
    LISTADO DE NOVEDADES

   Contiene:
   - Artículo destacado.
   - Filtro por categoría.
   - Tarjetas reutilizables.
   - Mensaje cuando no existen resultados.

   Utilizamos useState para controlar el filtro.
========================================================= */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { NOVEDADES } from '../../data/contenidoNovedades'
import { TarjetaNovedad } from '../moleculas/TarjetaNovedad'
import { TituloSeccion } from '../moleculas/TituloSeccion'

// Categorías disponibles.
const categorias = [
  'Todas',
  'Salud',
  'Prevención',
  'Bienestar',
  'Consejos'
]

export default function ListadoNovedades() {

  // Estado del filtro seleccionado.
  const [categoria, setCategoria] = useState('Todas')

  // Identificamos el artículo destacado.
  const destacada = NOVEDADES.find(
    (novedad) => novedad.id === 'vacunas'
  )

  /* =========================================================
      FILTRO DE NOVEDADES

     - Todas: muestra las tres noticias habituales.
     - Salud: incluye la noticia destacada de vacunación.
     - Otras categorías: muestra sus noticias respectivas.

  ========================================================= */

  const publicaciones = NOVEDADES.filter((novedad) =>
    categoria === 'Todas'
      ? novedad.id !== 'vacunas'
      : novedad.categoria === categoria
  )

  return (
    <>
      {/* =========================================
          ARTÍCULO DESTACADO
      ========================================= */}

      {destacada && (
        <section className="seccion-destacada">
          <div className="contenedor">

            <TituloSeccion
              etiqueta="Destacado"
              titulo="Lo más reciente"
              descripcion="Información importante para cuidar la salud y bienestar de tu compañero."
            />

            <article className="novedad-destacada nueva-destacada">

              {/* Imagen principal */}
              <div className="destacada-imagen nueva-imagen">
                <img
                  src={destacada.imagen}
                  alt={destacada.alt}
                />
              </div>

              {/* Información */}
              <div className="destacada-info nueva-info">
                <span className="categoria-texto">
                  {destacada.categoria}
                </span>

                <p className="fecha">
                  {destacada.fecha}
                </p>

                <h2>{destacada.titulo}</h2>

                <p>{destacada.descripcion}</p>

                <div className="destacada-beneficios">
                  <span>♡ Prevención</span>
                  <span>🐾 Cuidado responsable</span>
                </div>

                <Link
                  className="boton-leer"
                  to={`/detalle-novedad?articulo=${destacada.id}`}
                >
                  Leer artículo →
                </Link>
              </div>

            </article>
          </div>
        </section>
      )}

      {/* =========================================
          MÁS NOVEDADES
      ========================================= */}

      <section className="seccion-novedades">
        <div className="contenedor">

          <TituloSeccion
            etiqueta="Consejos para tu compañero"
            titulo="Más novedades"
            descripcion="Pequeños consejos que pueden hacer una gran diferencia en el bienestar de tu mascota."
          />

          {/* Filtros con useState */}
          <div
            className="d-flex flex-wrap gap-2 mb-4"
            role="group"
            aria-label="Filtrar novedades por categoría"
          >
            {categorias.map((opcion) => (
              <button
                key={opcion}
                type="button"
                className={`btn ${
                  categoria === opcion
                    ? 'btn-primary'
                    : 'btn-outline-primary'
                }`}
                aria-pressed={categoria === opcion}
                onClick={() => setCategoria(opcion)}
              >
                {opcion}
              </button>
            ))}
          </div>

          {/* Tarjetas filtradas */}
          {publicaciones.length > 0 ? (
            <div className="grid-novedades">
              {publicaciones.map((novedad) => (
                <TarjetaNovedad
                  key={novedad.id}
                  novedad={novedad}
                />
              ))}
            </div>
          ) : (
            <p role="status">
              No hay otras novedades disponibles
              en esta categoría.
            </p>
          )}

        </div>
      </section>
    </>
  )
}
