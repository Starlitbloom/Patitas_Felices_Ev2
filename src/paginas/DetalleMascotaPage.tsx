/* PÁGINA — Detalle de mascota (ruta /mascotas/:id).
   Junta lo que en la EP1 eran 4 páginas separadas (detalle-mascota,
   ficha-clinica, historial-clinico, vacunas) en una sola, con pestañas. */
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import {
  esFavorita,
  alternarFavorita,
  obtenerHistorial,
  obtenerMascotaPorId,
  obtenerVacunas,
} from '../services/mascotasService'
import { TEXTO_ESTADO_MASCOTA } from '../types/mascota'
import { EnlaceBoton } from '../componentes/atomos/EnlaceBoton'
import { PestanasClinicas, type PestanaClinica } from '../componentes/moleculas/PestanasClinicas'
import { TarjetaRegistroClinico } from '../componentes/moleculas/TarjetaRegistroClinico'
import { TarjetaVacuna } from '../componentes/moleculas/TarjetaVacuna'

export default function DetalleMascotaPage() {
  const { id } = useParams<{ id: string }>()
  const mascota = id ? obtenerMascotaPorId(id) : null

  const [pestana, setPestana] = useState<PestanaClinica>('ficha')
  const [favorita, setFavorita] = useState(() => (id ? esFavorita(id) : false))

  if (!mascota) {
    return (
      <main className="seccion-mascotas">
        <div className="contenedor text-center">
          <h1>Mascota no encontrada</h1>
          <p>No existe un paciente registrado con el identificador "{id}".</p>
          <EnlaceBoton to="/mascotas" variante="secundario">
            ← Volver a mis mascotas
          </EnlaceBoton>
        </div>
      </main>
    )
  }

  const { nombre, especie, raza, edad, sexo, peso, dueno, imagen, estado, descripcion } = mascota

  const manejarFavorita = () => setFavorita(alternarFavorita(mascota.id))

  const historial = obtenerHistorial(mascota.id)
  const vacunas = obtenerVacunas(mascota.id)

  return (
    <main className="seccion-mascotas">
      <div className="contenedor">
        <a href="/mascotas" className="volver-listado">
          ← Volver al listado de mascotas
        </a>

        <div className="detalle-mascota-cabecera">
          <div className="detalle-mascota-imagen">
            <img src={imagen} alt={`${nombre}, ${especie.toLowerCase()}`} />
          </div>

          <div>
            <div className="detalle-mascota-titulo-fila">
              <h1>{nombre}</h1>
              <button
                type="button"
                className={`boton-favorito boton-favorito-detalle ${favorita ? 'activo' : ''}`}
                onClick={manejarFavorita}
                aria-pressed={favorita}
                aria-label={favorita ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              >
                {favorita ? '★ En favoritos' : '☆ Agregar a favoritos'}
              </button>
            </div>

            <p className="raza-especie">
              {especie}
              {raza ? ` · ${raza}` : ''}
            </p>
            <span className={`estado-badge estado-${estado}`}>{TEXTO_ESTADO_MASCOTA[estado]}</span>

            <PestanasClinicas activa={pestana} onCambio={setPestana} />

            {pestana === 'ficha' && (
              <>
                <ul className="lista-datos">
                  <li>
                    <strong>Edad</strong>
                    {edad}
                  </li>
                  <li>
                    <strong>Sexo</strong>
                    {sexo || 'No especificado'}
                  </li>
                  <li>
                    <strong>Peso</strong>
                    {peso || 'No especificado'}
                  </li>
                  <li>
                    <strong>Dueño/a</strong>
                    {dueno}
                  </li>
                </ul>
                <p className="detalle-mascota-descripcion">{descripcion}</p>
              </>
            )}

            {pestana === 'historial' && (
              <div className="lista-registros">
                {historial.length === 0 ? (
                  <p className="registros-vacio">Aún no hay atenciones registradas para esta mascota.</p>
                ) : (
                  historial.map((registro, indice) => <TarjetaRegistroClinico key={indice} {...registro} />)
                )}
              </div>
            )}

            {pestana === 'vacunas' && (
              <div className="lista-registros">
                {vacunas.length === 0 ? (
                  <p className="registros-vacio">Esta mascota no tiene vacunas registradas.</p>
                ) : (
                  vacunas.map((registro, indice) => <TarjetaVacuna key={indice} {...registro} />)
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}