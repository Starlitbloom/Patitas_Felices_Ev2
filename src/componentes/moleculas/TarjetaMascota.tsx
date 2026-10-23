/* MOLÉCULA — Tarjeta de una mascota en el catálogo "Mis mascotas"..
   Antes esa función devolvía un string de HTML con innerHTML;
   acá es un componente que recibe la mascota por props y el
   estado de favorito se maneja arriba (en la página), igual
   que el patrón de FiltrosEquipo: el componente solo "avisa"
   con onAlternarFavorita, no decide nada por su cuenta. */
import { Link } from 'react-router-dom'
import type { Mascota } from '../../types/mascota'
import { TEXTO_ESTADO_MASCOTA } from '../../types/mascota'

export interface TarjetaMascotaProps {
  mascota: Mascota
  favorita: boolean
  onAlternarFavorita: (id: string) => void
}

export function TarjetaMascota({ mascota, favorita, onAlternarFavorita }: TarjetaMascotaProps) {
  const { id, nombre, especie, raza, dueño, imagen, estado, completo } = mascota

  return (
    <article className="tarjeta-mascota h-100">
      <div className="tarjeta-mascota-imagen">
        <span className={`estado-badge estado-${estado}`}>{TEXTO_ESTADO_MASCOTA[estado]}</span>

        <button
          type="button"
          className={`boton-favorito ${favorita ? 'activo' : ''}`}
          onClick={() => onAlternarFavorita(id)}
          aria-pressed={favorita}
          aria-label={favorita ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          {favorita ? '♥' : '♡'}
        </button>

        <img src={imagen} alt={`${nombre}, ${especie.toLowerCase()}`} />
      </div>

      {!completo && (
        <div className="alerta-incompleta">
          ⚠️ Datos incompletos — <Link to={`/mascotas/${id}`}>completar ficha →</Link>
        </div>
      )}

      <div className="tarjeta-mascota-contenido">
        <h3>{nombre}</h3>
        <p className="raza-especie">
          {especie}
          {raza ? ` · ${raza}` : ''}
        </p>
        <p className="dueno">Dueño/a: {dueño}</p>
        <Link to={`/mascotas/${id}`}>Ver ficha completa →</Link>
      </div>
    </article>
  )
}