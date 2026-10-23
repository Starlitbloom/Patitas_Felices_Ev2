/* ORGANISMO — Tarjeta con lista del perfil ("Mis mascotas", "Mis citas").
   Si no hay elementos muestra el estado vacío con un enlace de acción.
   Los módulos de mascotas y citas solo tienen que entregarle los items. */
import { Fragment, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

export interface ItemLista {
  id: string
  titulo: string
  detalle?: string
  /** Contenido bajo la tarjeta del ítem, en el fondo blanco (ej: acciones de la mascota). */
  extra?: ReactNode
}

export interface ListaPerfilProps {
  titulo: string
  icono: string
  iconoItem: string
  items: ItemLista[]
  textoVacio: string
  enlace: { to: string; texto: string }
  ancha?: boolean
}

export function ListaPerfil({ titulo, icono, iconoItem, items, textoVacio, enlace, ancha = false }: ListaPerfilProps) {
  return (
    <div className={`perfil-card ${ancha ? 'perfil-card--ancha' : ''}`.trim()}>
      <h2>
        <span>{icono}</span> {titulo}
      </h2>
      {items.length === 0 ? (
        <div className="perfil-lista-vacia">
          <p>{textoVacio}</p>
          <Link to={enlace.to} className="perfil-card-link">
            {enlace.texto}
          </Link>
        </div>
      ) : (
        <ul className="list-unstyled mb-0">
          {items.map((item) => (
            /* Fragment agrupa los dos <li> de cada ítem sin agregar una etiqueta extra */
            <Fragment key={item.id}>
              {/* Tarjeta gris del ítem: ícono, título y detalle */}
              <li className="perfil-mascota-item">
                <span>{iconoItem}</span>
                <div style={{ flex: 1 }}>
                  <strong>{item.titulo}</strong>
                  {item.detalle && (
                    <>
                      <br />
                      <small>{item.detalle}</small>
                    </>
                  )}
                </div>
              </li>

              {/* Contenido extra (botones de la mascota): va debajo de la tarjeta gris, en el fondo blanco */}
              {item.extra && <li className="perfil-mascota-extra">{item.extra}</li>}
            </Fragment>
          ))}
        </ul>
      )}
    </div>
  )
}
