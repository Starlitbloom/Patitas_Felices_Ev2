/* ORGANISMO — Tarjeta con lista del perfil ("Mis mascotas", "Mis citas").
   Si no hay elementos muestra el estado vacío con un enlace de acción.
   Los módulos de mascotas y citas solo tienen que entregarle los items. */
import { Link } from 'react-router-dom'

export interface ItemLista {
  id: string
  titulo: string
  detalle?: string
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
            {enlace.texto} →
          </Link>
        </div>
      ) : (
        <ul className="list-unstyled mb-0">
          {items.map((item) => (
            <li key={item.id} className="perfil-mascota-item">
              <span>{iconoItem}</span>
              <div>
                <strong>{item.titulo}</strong>
                {item.detalle && (
                  <>
                    <br />
                    <small>{item.detalle}</small>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
