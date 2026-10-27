/* PÁGINA — Detalle de mascota (ruta /mascotas/:id).
   Muestra la ficha con foto y datos, y tres accesos (ficha clínica,
   historial y vacunas) que despliegan su contenido debajo. */
import { Link, useParams } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  esFavorita,
  alternarFavorita,
  obtenerHistorial,
  obtenerMascotaPorId,
  obtenerVacunas,
} from '../services/mascotasService'
import { TEXTO_ESTADO_MASCOTA } from '../types/mascota'
import { listarCitasUsuario } from '../services/citasService'
import { obtenerEspecieCita } from '../services/catalogoCitasService'

import { HeroDetalleMascota } from '../componentes/organismos/HeroDetalleMascota'
import { BloqueCompletarMascota } from '../componentes/organismos/BloqueCompletarMascota'
import { TituloSeccion } from '../componentes/moleculas/TituloSeccion'
import { TarjetaRegistroClinico } from '../componentes/moleculas/TarjetaRegistroClinico'
import { TarjetaVacuna } from '../componentes/moleculas/TarjetaVacuna'

/* Las tres secciones que se pueden abrir bajo la ficha */
type Seccion = 'ficha' | 'historial' | 'vacunas'

/* Las tres tarjetas de acceso que hay bajo la ficha (icono, textos y a qué sección abren) */
const ACCESOS: { clave: Seccion; icono: string; titulo: string; texto: string; enlace: string }[] = [
  {
    clave: 'ficha',
    icono: '/img/icono-ficha-clinica.png',
    titulo: 'Ficha clínica',
    texto: 'Datos generales y registro de nuevas atenciones.',
    enlace: 'Ir a la ficha',
  },
  {
    clave: 'historial',
    icono: '/img/icono-historial-clinico.png',
    titulo: 'Historial clínico',
    texto: 'Consultas y tratamientos anteriores.',
    enlace: 'Ver historial',
  },
  {
    clave: 'vacunas',
    icono: '/img/icono-vacunas.png',
    titulo: 'Vacunas',
    texto: 'Calendario de vacunación y refuerzos.',
    enlace: 'Ver vacunas',
  },
]

export default function DetalleMascotaPage() {
  /* Id de la mascota que viene en la dirección (/mascotas/:id) y usuario con sesión iniciada */
  const { id } = useParams<{ id: string }>()
  const { usuario } = useAuth()

  /* Se lee la mascota en cada render, así se ve actualizada después de guardar cambios */
  const mascota = id ? obtenerMascotaPorId(id) : null

  /* Tarjeta de acceso abierta (null = ninguna) */
  const [seccion, setSeccion] = useState<Seccion | null>(null)

  /* Si la mascota está en favoritos */
  const [favorita, setFavorita] = useState(() => (id ? esFavorita(id) : false))

  /* Se incrementa al guardar cambios para volver a leer la mascota */
  const [, setVersion] = useState(0)

  if (!mascota) {
    return (
      <main className="seccion-detalle-mascota">
        <HeroDetalleMascota />
        <section className="detalle-fondo-ficha">
          <div className="contenedor detalle-mascota-contenedor">
            <div className="mascota-no-encontrada">
              <h2>Mascota no encontrada</h2>
              <p>No existe un paciente registrado con el identificador "{id}".</p>
              <Link to="/mascotas" className="volver-listado">
                Volver al listado de mascotas
              </Link>
            </div>
          </div>
        </section>
      </main>
    )
  }
  /* Datos de la mascota que se muestran en la ficha */
  const { nombre, especie, raza, edad, sexo, peso, dueño,correoDueño, imagen, estado, descripcion } = mascota

  /* Solo el dueño/a puede completar o editar los datos */
  const esDueño = !!usuario && usuario.correo.toLowerCase() === (correoDueño ?? '').toLowerCase()

  /* Agrega o quita la mascota de favoritos */
  const manejarFavorita = () => setFavorita(alternarFavorita(mascota.id))

  /* Registros clínicos que se muestran al abrir las tarjetas de acceso */
  const historial = obtenerHistorial(mascota.id)
  const vacunas = obtenerVacunas(mascota.id)

/* =========================================================
   CITAS SOLICITADAS PARA ESTA MASCOTA

   - Consulta las citas del propietario.
   - Comprueba nombre y especie de la mascota.
   - Muestra citas pendientes, confirmadas,
     completadas y canceladas.
   - No modifica el historial clínico existente.
========================================================= */

const citasMascota = esDueño
  ? listarCitasUsuario(usuario.correo)
      .filter((cita) => {

        const mismoNombre =
          cita.mascota.trim().toLocaleLowerCase('es-CL') ===
          mascota.nombre.trim().toLocaleLowerCase('es-CL')

        const especieCita = obtenerEspecieCita(
          cita.tipoMascota,
          cita.otraEspecie ?? ''
        )

        const mismaEspecie =
          especieCita === mascota.especie

        return mismoNombre && mismaEspecie
      })
      .sort((a, b) =>
        `${b.fecha} ${b.hora}`.localeCompare(
          `${a.fecha} ${a.hora}`
        )
      )
  : []

  return (
    <main className="seccion-detalle-mascota">
      {/* Banner superior */}
      <HeroDetalleMascota />

        <section className="detalle-fondo-ficha" aria-label="Ficha de la mascota">
        <div className="contenedor detalle-mascota-contenedor">
        {/* Botón para volver al catálogo */}
        <Link to="/mascotas" className="volver-listado">
          ← Volver al listado de mascotas
        </Link>

        {/* Tarjeta principal: foto + datos */}
        <div className="detalle-mascota-cabecera" id="ficha-mascota">
          {/* Foto de la mascota */}
          <div className="detalle-mascota-imagen">
            <img src={imagen} alt={`${nombre}, ${especie.toLowerCase()}`} />
          </div>

          <div className="detalle-mascota-info">
            {/* Nombre y botón de favoritos */}
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

            {/* Especie, raza y estado de salud */}
            <p className="raza-especie">
              {especie}
              {raza ? ` · ${raza}` : ''}
            </p>
            <span className={`estado-badge estado-${estado}`}>{TEXTO_ESTADO_MASCOTA[estado]}</span>

            {/* Datos en cajas de colores: edad, sexo, peso y dueño/a */}
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
                {dueño}
              </li>
            </ul>

            {/* Descripción de la mascota */}
            <p className="detalle-mascota-descripcion">{descripcion}</p>

            {/* Completar o editar los datos (solo el dueño/a) */}
            {esDueño && usuario && (
              <div className="detalle-mascota-completar">
                <BloqueCompletarMascota
                  mascota={mascota}
                  correoSolicitante={usuario.correo}
                  onGuardado={() => setVersion((v) => v + 1)}
                />
              </div>
            )}
            </div>
          </div>
          </div>
      </section>

        {/* Zona con fondo rosa de confeti: accesos y su contenido, a todo el ancho de la página */}
        <section className="detalle-fondo-clinico">
          <div className="contenedor">

        {/* Accesos a ficha clínica, historial y vacunas: al pulsar uno se despliega debajo */}
        <div className="accesos-clinicos">
          {ACCESOS.map((acceso) => {
            /* Si esta tarjeta es la que está abierta */
            const activo = seccion === acceso.clave
            return (
              <a
                key={acceso.clave}
                href="#"
                className={`acceso-clinico ${activo ? 'acceso-clinico--activo' : ''}`}
                aria-expanded={activo}
                onClick={(e) => {
                  /* Abre la tarjeta, o la cierra si ya estaba abierta */
                  e.preventDefault()
                  setSeccion(activo ? null : acceso.clave)
                  // "Ir a la ficha": al abrirla, sube hasta la tarjeta de la mascota
                  if (acceso.clave === 'ficha' && !activo) {
                    document.getElementById('ficha-mascota')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                }}
              >
                <span className="icono-acceso">
                  <img src={acceso.icono} alt={acceso.titulo} />
                </span>
                <h3>{acceso.titulo}</h3>
                <p>{acceso.texto}</p>
                <span className="flecha">{acceso.enlace} →</span>
              </a>
            )
          })}
        </div>

       
{/* =========================================================
    FICHA CLÍNICA
    Mostrar las citas solicitadas de la mascota.
========================================================= */}

{seccion === 'ficha' && (

  <section className="detalle-clinico-panel">

    <TituloSeccion
      etiqueta="Ficha clínica"
      titulo="Citas y atenciones recientes"
    />

    {/* =========================================
       CITAS SOLICITADAS
    ========================================= */}

    {esDueño && (

      <div>

        <h3>Citas solicitadas</h3>

        <div className="lista-registros">

          {citasMascota.length === 0 ? (

            <p className="registros-vacio">
              Esta mascota todavía no tiene
              citas solicitadas.
            </p>

          ) : (

            
citasMascota.map((cita) => (

  <article
    key={String(cita.id)}
    className="cita-mascota-card"
  >

    {/* ENCABEZADO DE LA CITA */}

    <div className="cita-mascota-header">

      <div className="cita-mascota-icono">
        🩺
      </div>

      <div className="cita-mascota-titulo">

        <h4>{cita.servicio}</h4>

        <p>Atención veterinaria de {mascota.nombre}</p>

      </div>

      <span
        className={`cita-mascota-estado cita-mascota-estado--${
          (cita.estado || 'Pendiente').toLowerCase()
        }`}
      >
        {cita.estado || 'Pendiente'}
      </span>

    </div>


    {/* INFORMACIÓN DE LA CITA */}

    <div className="cita-mascota-datos">

      <div className="cita-mascota-dato cita-mascota-dato--rosa">

        <span className="cita-mascota-dato-icono">
          📅
        </span>

        <div>
          <small>Fecha de atención</small>

          <strong>
            {cita.fecha.split('-').reverse().join('/')}
          </strong>
        </div>

      </div>


      <div className="cita-mascota-dato cita-mascota-dato--celeste">

        <span className="cita-mascota-dato-icono">
          🕒
        </span>

        <div>
          <small>Hora de atención</small>

          <strong>
            {cita.hora} hrs.
          </strong>
        </div>

      </div>


      <div className="cita-mascota-dato cita-mascota-dato--lila">

        <span className="cita-mascota-dato-icono">
          👩‍⚕️
        </span>

        <div>
          <small>Veterinario asignado</small>

          <strong>
            {cita.veterinarioNombre || 'Por confirmar'}
          </strong>
        </div>

      </div>

    </div>


    {/* MOTIVO DE CONSULTA */}

    <div className="cita-mascota-motivo">

      <div className="cita-mascota-motivo-titulo">
        📝 Motivo de la consulta
      </div>

      <p>{cita.motivo}</p>

    </div>


    {/* AVISO DE ESTADO */}

    {cita.estado !== 'Completada' && (

      <div className="cita-mascota-aviso">

        <span>ℹ️</span>

        <p>
          {cita.estado === 'Pendiente'
            ? 'Tu solicitud está pendiente de confirmación por parte de la veterinaria.'
            : cita.estado === 'Confirmada'
              ? 'Tu cita fue confirmada. La atención todavía no se ha realizado.'
              : cita.estado === 'Cancelada'
                ? 'Esta cita fue cancelada.'
                : 'Esta cita todavía no corresponde a una atención clínica realizada.'}
        </p>

      </div>

    )}

  </article>

))


          )}

        </div>

        <p>
          <Link to="/mis-citas">
            Ver todas mis citas →
          </Link>
        </p>

      </div>

    )}


    {/* =========================================
  
        ATENCIONES CLÍNICAS REGISTRADAS
        Conservamos el historial existente.
    ========================================= */}

    <h3>Atenciones clínicas registradas</h3>

    <div className="lista-registros">

      {historial.length === 0 ? (

        <p className="registros-vacio">
          Aún no hay atenciones registradas
          para esta mascota.
        </p>

      ) : (

        historial.slice(0, 2).map(
          (registro, indice) => (

            <TarjetaRegistroClinico
              key={indice}
              {...registro}
            />

          )
        )

      )}

    </div>

  </section>

)}

        {/* Historial clínico: todas las atenciones */}
        {seccion === 'historial' && (
          <section className="detalle-clinico-panel">
            <TituloSeccion etiqueta="Historial médico" titulo="Atenciones registradas" />
            <div className="lista-registros">
              {historial.length === 0 ? (
                <p className="registros-vacio">Aún no hay atenciones registradas para esta mascota.</p>
              ) : (
                historial.map((registro, indice) => <TarjetaRegistroClinico key={indice} {...registro} />)
              )}
            </div>
          </section>
        )}

        {/* Vacunas: calendario de vacunación */}
        {seccion === 'vacunas' && (
          <section className="detalle-clinico-panel">
            <TituloSeccion etiqueta="Calendario de vacunación" titulo="Vacunas aplicadas" />
            <div className="lista-registros">
              {vacunas.length === 0 ? (
                <p className="registros-vacio">Esta mascota no tiene vacunas registradas.</p>
              ) : (
                vacunas.map((registro, indice) => <TarjetaVacuna key={indice} {...registro} />)
              )}
            </div>
          </section>
        )}
        </div>
      </section>
    </main>
  )
}