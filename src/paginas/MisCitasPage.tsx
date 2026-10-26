
/* =========================================================
   PATITAS FELICES - MIS CITAS 

   MI PARTE:
   - Mostrar las citas del usuario conectado.
   - Mostrar mascota, especie, servicio y veterinario.
   - Consultar el estado de cada solicitud.
   - Modificar fecha y hora de citas Pendientes.
   - Cancelar citas Pendientes.
   - Evitar horarios ocupados.
   - Conservar el diseño original de la EV1.
========================================================= */

/* =========================================================
   1. IMPORTACIONES
========================================================= */

import { useEffect, useState } from 'react'

import type {
  CSSProperties,
  FormEvent
} from 'react'

import { Link } from 'react-router-dom'
import '../styles/estilo-mis-citas.css'
import { useAuth } from '../context/AuthContext'

import {
  actualizarCita,
  fechaLocalHoy,
  HORARIOS_CITAS,
  horasOcupadas,
  listarCitasUsuario
} from '../services/citasService'

import type {
  Cita,
  EstadoCita
} from '../services/citasService'

import '../styles/estilo-mis-citas.css'


/* =========================================================
   2. FORMATEAR FECHA

   Convierte una fecha como 2026-10-27
   a un formato fácil de leer.
========================================================= */
function mostrarFecha(fecha: string): string {

  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return fecha || 'Por confirmar'
  }

  const [anio, mes, dia] = fecha
    .split('-')
    .map(Number)

  const valor = new Date(anio, mes - 1, dia)

  if (
    valor.getFullYear() !== anio ||
    valor.getMonth() !== mes - 1 ||
    valor.getDate() !== dia
  ) {
    return 'Fecha inválida'
  }

  return valor.toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

/* =========================================================
   3. OBTENER IMAGEN DE LA MASCOTA
========================================================= */
function imagenMascota(tipo: string): string {

  const nombre = (tipo || '')
    .trim()
    .toLowerCase()

  if (
    ['perro', 'perra', 'canino', 'canina']
      .includes(nombre)
  ) {
    return '/img/icono-perro.png'
  }

  if (
    ['gato', 'gata', 'felino', 'felina']
      .includes(nombre)
  ) {
    return '/img/icono-gato.png'
  }

  return '/img/icono-otro.png'
}


/* =========================================================
   4. MOSTRAR ESPECIE
========================================================= */

function mostrarEspecie(cita: Cita): string {

  return cita.tipoMascota === 'Otro'
    ? cita.otraEspecie || 'Otra especie'
    : cita.tipoMascota || 'Mascota'
}

/* =========================================================
   5. MOSTRAR EDAD EN MESES O AÑOS
   Ejemplos:
   0.5  -> 6 meses.
   0.25 -> 3 meses.
   2    -> 2 años.
========================================================= */
function mostrarEdad(edad: number): string {

  if (!Number.isFinite(edad) || edad <= 0) {
    return 'Edad no indicada'
  }

  if (edad < 1) {

    const meses = Math.round(edad * 12)

    return `${meses} ${
      meses === 1 ? 'mes' : 'meses'
    }`
  }

  return `${edad} ${
    edad === 1 ? 'año' : 'años'
  }`
}

/* =========================================================
   6. COLORES DE LOS ESTADOS
   Pendiente -> Amarillo.
   Confirmada -> Verde.
   Completada -> Celeste.
   Cancelada -> Rosado.
========================================================= */
function claseEstado(
  estado: EstadoCita
): string {

  switch (estado) {

    case 'Confirmada':
      return 'estado-confirmada'

    case 'Completada':
      return 'estado-completada'

    case 'Cancelada':
      return 'estado-cancelada'

    default:
      return 'estado-pendiente'
  }
}

/* =========================================================
   7. ORDENAR CITAS
   Mostramos primero las solicitudes
   registradas más recientemente.
========================================================= */
function ordenarCitas(citas: Cita[]): Cita[] {

  return [...citas].sort((a, b) => {

    const registroA =
      Date.parse(a.fechaRegistro || '') || 0

    const registroB =
      Date.parse(b.fechaRegistro || '') || 0

    if (registroA !== registroB) {
      return registroB - registroA
    }

    return `${b.fecha} ${b.hora}`
      .localeCompare(`${a.fecha} ${a.hora}`)
  })
}

/* =========================================================
   8. COMPONENTE PRINCIPAL MIS CITAS
   useState permite almacenar:
   - Las citas.
   - El filtro de estado.
   - La cita que se está modificando.
   - Los mensajes de error o confirmación.
========================================================= */
export default function MisCitasPage() {

  const { usuario } = useAuth()


  /* -------------------------------------------------------
     CITAS DEL USUARIO
  ------------------------------------------------------- */

  const [citas, setCitas] = useState<Cita[]>([])

  /* -------------------------------------------------------
     FILTRO POR ESTADO
     Por defecto mostramos todas las solicitudes.
  ------------------------------------------------------- */
  const [filtroEstado, setFiltroEstado] =
    useState('Todas')

  /* -------------------------------------------------------
     CITA QUE ESTAMOS MODIFICANDO
  ------------------------------------------------------- */
  const [editandoId, setEditandoId] =
    useState<string | null>(null)


  /* -------------------------------------------------------
     NUEVA FECHA Y HORA
  ------------------------------------------------------- */

  const [nuevaFecha, setNuevaFecha] =
    useState('')

  const [nuevaHora, setNuevaHora] =
    useState('')

  const [errorEdicion, setErrorEdicion] =
    useState('')


  /* -------------------------------------------------------
     CONFIRMACIÓN PARA CANCELAR
  ------------------------------------------------------- */

  const [cancelandoId, setCancelandoId] =
    useState<string | null>(null)

  /* -------------------------------------------------------
     MENSAJES AL USUARIO
  ------------------------------------------------------- */
  const [mensaje, setMensaje] =
    useState('')

  const [mensajeEsError, setMensajeEsError] =
    useState(false)

  /* =====================================================
     9. CARGAR CITAS DEL USUARIO
  ===================================================== */
  useEffect(() => {

    setCitas(
      usuario
        ? ordenarCitas(
            listarCitasUsuario(usuario.correo)
          )
        : []
    )

  }, [usuario?.correo])

  /* =====================================================
     10. RECARGAR CITAS
  ===================================================== */
  function recargarCitas() {

    setCitas(
      usuario
        ? ordenarCitas(
            listarCitasUsuario(usuario.correo)
          )
        : []
    )
  }
  /* =====================================================
     11. FILTRAR CITAS POR ESTADO
     Ejemplos:
     Todas.
     Pendiente.
     Confirmada.
     Completada.
     Cancelada.
  ===================================================== */
  const citasVisibles = citas.filter(
    (cita) =>
      filtroEstado === 'Todas' ||
      (cita.estado || 'Pendiente') === filtroEstado
  )


  /* =====================================================
     12. ABRIR MODIFICACIÓN
     Solo permitimos modificar solicitudes Pendientes.
  ===================================================== */
  function abrirEdicion(cita: Cita) {

    if (cita.estado !== 'Pendiente') {
      return
    }

    setEditandoId(String(cita.id))

    setNuevaFecha(cita.fecha || '')

    setNuevaHora(cita.hora || '')

    setErrorEdicion('')

    setMensaje('')

    setCancelandoId(null)
  }
  /* =====================================================
     13. CERRAR MODIFICACIÓN
  ===================================================== */
  function cerrarEdicion() {

    setEditandoId(null)

    setNuevaFecha('')

    setNuevaHora('')

    setErrorEdicion('')
  }

  /* =====================================================
     14. OBTENER CITA QUE ESTAMOS EDITANDO
  ===================================================== */

  const citaEditando = citas.find(
    (cita) =>
      String(cita.id) === editandoId
  )
  /* =====================================================
     15. CONSULTAR HORAS NO DISPONIBLES
  ===================================================== */
  const horasNoDisponibles =
    citaEditando && nuevaFecha
      ? horasOcupadas(
          nuevaFecha,
          citaEditando.id,
          citaEditando.veterinarioId,
          citaEditando.servicio
        )
      : []

  /* =====================================================
     16. GUARDAR MODIFICACIÓN
  ===================================================== */
  function guardarCambios(
    evento: FormEvent<HTMLFormElement>
  ) {

    evento.preventDefault()

    setErrorEdicion('')

    /* -----------------------------------------
       Comprobar que la cita exista,
       pertenezca al usuario y esté Pendiente.
    ----------------------------------------- */
    if (
      !usuario ||
      !citaEditando ||
      citaEditando.estado !== 'Pendiente' ||
      (
        citaEditando.correoUsuario ||
        citaEditando.correo ||
        ''
      ).toLowerCase() !== usuario.correo.toLowerCase()
    ) {

      setErrorEdicion(
        'No puedes modificar esta solicitud.'
      )

      return
    }


    /* -----------------------------------------
       Validar fecha obligatoria.
    ----------------------------------------- */

    if (!nuevaFecha) {

      setErrorEdicion(
        'Selecciona una nueva fecha.'
      )

      return
    }


    /* -----------------------------------------
       Impedir fechas pasadas.
    ---------------------------------------- */
    if (nuevaFecha < fechaLocalHoy()) {

      setErrorEdicion(
        'La fecha no puede ser anterior a hoy.'
      )

      return
    }

    /* -----------------------------------------
       Validar hora obligatoria.
    ----------------------------------------- */
    if (!nuevaHora) {

      setErrorEdicion(
        'Selecciona una nueva hora.'
      )

      return
    }

    /* -----------------------------------------
       Comprobar disponibilidad.
    ----------------------------------------- */
    if (
      horasNoDisponibles.includes(nuevaHora)
    ) {

      setErrorEdicion(
        'Esta hora no está disponible para el servicio seleccionado.'
      )

      return
    }

    /* -----------------------------------------
       Guardar con nuestro servicio.
    ----------------------------------------- */
    const resultado = actualizarCita(
      citaEditando.id,
      {
        fecha: nuevaFecha,
        hora: nuevaHora
      }
    )


    if (!resultado.ok) {

      setErrorEdicion(resultado.mensaje)

      return
    }

    /* -----------------------------------------
       Actualizar pantalla y mostrar mensaje.
    ----------------------------------------- */
    cerrarEdicion()

    recargarCitas()

    setMensajeEsError(false)

    setMensaje(
      'La fecha y la hora de tu cita se actualizaron correctamente.'
    )
  }

  /* =====================================================
     17. CONFIRMAR CANCELACIÓN
  ===================================================== */
  function confirmarCancelacion(cita: Cita) {

    if (
      !usuario ||
      cita.estado !== 'Pendiente' ||
      (
        cita.correoUsuario ||
        cita.correo ||
        ''
      ).toLowerCase() !== usuario.correo.toLowerCase()
    ) {

      setMensajeEsError(true)

      setMensaje(
        'No se puede cancelar esta solicitud.'
      )

      return
    }

    /* -----------------------------------------
       Actualizar estado de la cita.
    ----------------------------------------- */
    const resultado = actualizarCita(
      cita.id,
      {
        estado: 'Cancelada'
      }
    )


    if (!resultado.ok) {

      setMensajeEsError(true)

      setMensaje(resultado.mensaje)

      return
    }

    /* -----------------------------------------
       Mostrar cambios.
    ----------------------------------------- */
    setCancelandoId(null)

    cerrarEdicion()

    recargarCitas()

    setMensajeEsError(false)

    setMensaje(
      'La cita fue cancelada. Su horario volvió a estar disponible.'
    )
  }
  /* =====================================================
     18. INTERFAZ VISUAL
  ===================================================== */
  return (

    <div className="mis-citas-v2">

      {/* =========================================
          HERO MIS CITAS
      ========================================= */}
      <section className="hero-mis-citas">

        <div
          className="decoracion-mis-citas decoracion-uno"
          aria-hidden="true"
        />

        <div
          className="decoracion-mis-citas decoracion-dos"
          aria-hidden="true"
        />


        <div className="contenedor hero-mis-citas-contenido">

          {/* TEXTO PRINCIPAL */}
          <div className="hero-mis-citas-texto">

            <span className="etiqueta-mis-citas">
              Tus solicitudes
            </span>

            <h1>
              Revisa tus
              <span>citas veterinarias</span>
            </h1>

            <p>
              Consulta tus solicitudes, revisa su estado
              y mantén organizada la atención de tu mascota.
            </p>

            <Link
              to="/solicitar-cita"
              className="boton-nueva-cita"
            >
              Solicitar nueva cita
              <span aria-hidden="true">→</span>
            </Link>

          </div>

          {/* IMAGEN ORIGINAL */}
          <div className="hero-mis-citas-imagen">

            <img
              src="/img/mis-citas-mascotas.png"
              alt="Perro y gato junto a un calendario de citas veterinarias"
              className="imagen-mis-citas"
            />

          </div>

        </div>

      </section>
      {/* =========================================
          CONTENIDO PRINCIPAL
      ========================================= */}
      <main className="seccion-mis-citas">

        <div className="contenedor">
          {/* =====================================
              ENCABEZADO Y CONTADOR DE CITAS
          ===================================== */}
          <div className="encabezado-citas">

            <div>

              <span>
                Mis solicitudes
              </span>

              <h2>
                Citas registradas
              </h2>

              <p>
                Aquí encontrarás las citas que has
                solicitado para tus mascotas.
              </p>

            </div>

            {/* Contador de citas del usuario */}
            <div
              className="contador-citas"
              aria-label={`${citas.length} citas registradas`}
            >

              <strong>
                {citas.length}
              </strong>

              <span>
                {citas.length === 1
                  ? 'cita'
                  : 'citas'}
              </span>

            </div>

          </div>
          {/* =====================================
              FILTRO POR ESTADO
          ===================================== */}
          {citas.length > 0 && (

            <div className="filtros-mis-citas">

              <label htmlFor="filtroEstadoCitas">
                Mostrar citas
              </label>

              <select
                id="filtroEstadoCitas"
                value={filtroEstado}
                onChange={(evento) =>
                  setFiltroEstado(evento.target.value)
                }
              >

                <option value="Todas">
                  Todas
                </option>

                <option value="Pendiente">
                  Pendientes
                </option>

                <option value="Confirmada">
                  Confirmadas
                </option>

                <option value="Completada">
                  Completadas
                </option>

                <option value="Cancelada">
                  Canceladas
                </option>

              </select>

            </div>

          )}

          {/* =====================================
              MENSAJES DE OPERACIONES
          ===================================== */}
          {mensaje && (

            <p
              className={`mensaje-gestion-cita ${
                mensajeEsError
                  ? 'mensaje-gestion-error'
                  : ''
              }`}
              role="status"
            >
              {mensaje}
            </p>

          )}
          {/* =====================================
              CUANDO NO EXISTEN CITAS
          ===================================== */}
          {citas.length === 0 ? (

            <section
              className="sin-citas"
              aria-live="polite"
            >

              <div
                className="icono-sin-citas"
                aria-hidden="true"
              >
                ♡
              </div>

              <span>
                Tu agenda está vacía
              </span>

              <h2>
                Aún no tienes citas registradas
              </h2>

              <p>
                Cuando solicites una atención para tu mascota,
                aparecerá aquí junto con su fecha,
                horario y estado.
              </p>

              <Link
                to="/solicitar-cita"
                className="boton-sin-citas"
              >
                Solicitar mi primera cita
                <span aria-hidden="true">→</span>
              </Link>

            </section>

          ) : citasVisibles.length === 0 ? (
            /* =====================================
               CUANDO EL FILTRO NO TIENE RESULTADOS
            ===================================== */
            <section className="sin-citas">

              <div
                className="icono-sin-citas"
                aria-hidden="true"
              >
                ♡
              </div>

              <h2>
                No hay citas en este estado
              </h2>

              <p>
                Prueba seleccionando otro estado
                en el filtro.
              </p>

              <button
                type="button"
                className="boton-sin-citas"
                onClick={() =>
                  setFiltroEstado('Todas')
                }
              >
                Mostrar todas las citas
              </button>

            </section>
          ) : (
            /* =====================================
               LISTADO DE CITAS
            ===================================== */
            <section
              className="contenedor-citas"
              aria-label="Mis solicitudes de citas"
            >

              {citasVisibles.map((cita) => {
                /* =================================
                   DATOS DE CADA TARJETA
                ================================= */
                const imagen = imagenMascota(
                  cita.tipoMascota
                )

                const estado =
                  cita.estado || 'Pendiente'

                const puedeGestionar =
                  estado === 'Pendiente'

                const abierta =
                  editandoId === String(cita.id)

                const confirmando =
                  cancelandoId === String(cita.id)
                /* =================================
                   IMAGEN DE FONDO
                   Cada tarjeta muestra una
                   ilustración según su especie.
                ================================= */
                const fondo = {
                  '--imagen-mascota':
                    `url("${imagen}")`
                } as CSSProperties


                return (

                  <article
                    key={String(cita.id)}
                    className="tarjeta-cita"
                    style={fondo}
                  >
                    {/* =========================
                        NOMBRE Y ESTADO
                    ========================= */}
                    <div className="cita-superior">

                      <div className="cita-mascota">

                        <div className="icono-mascota-cita">

                          <img
                            src={imagen}
                            alt={`Ilustración de ${
                              mostrarEspecie(cita)
                            }`}
                            className="imagen-icono-mascota"
                          />

                        </div>


                        <div className="informacion-mascota-cita">

                          <h3>
                            {cita.mascota || 'Mascota'}
                          </h3>

                          <span>
                            {mostrarEspecie(cita)}
                          </span>

                        </div>

                      </div>


                      {/* Estado de la cita */}
                      <span
                        className={`estado-cita ${
                          claseEstado(estado)
                        }`}
                      >
                        {estado}
                      </span>

                    </div>
                    {/* =========================
                        DATOS DE LA CITA
                    ========================= */}
                    <div className="datos-cita">


                      <div className="dato-cita">
                        <span>Servicio</span>

                        <strong>
                          {cita.servicio || 'Sin servicio'}
                        </strong>
                      </div>


                      <div className="dato-cita">
                        <span>Fecha</span>

                        <strong>
                          {mostrarFecha(cita.fecha)}
                        </strong>
                      </div>


                      <div className="dato-cita">
                        <span>Hora</span>

                        <strong>
                          {cita.hora || 'Por confirmar'}
                        </strong>
                      </div>


                      <div className="dato-cita">
                        <span>Propietario</span>

                        <strong>
                          {cita.dueno ||
                            cita.propietario ||
                            'No indicado'}
                        </strong>
                      </div>


                      {/* veterinario elegido */}
                      <div className="dato-cita">

                        <span>Veterinario</span>

                        <strong>
                          {cita.veterinarioNombre ||
                            'Por confirmar'}
                        </strong>

                      </div>

                      {/* edad en meses o años */}
                      <div className="dato-cita">

                        <span>Edad de la mascota</span>

                        <strong>
                          {mostrarEdad(
                            Number(cita.edadMascota)
                          )}
                        </strong>

                      </div>

                    </div>

                    {/* =========================
                        MOTIVO DE CONSULTA
                    ========================= */}
                    <div className="motivo-cita">

                      <span>
                        Motivo o información adicional
                      </span>

                      <p>
                        {cita.motivo?.trim() ||
                          'Sin información adicional.'}
                      </p>

                    </div>
                    {/* =========================
                        PROFESIONAL POR CONFIRMAR
                    ========================= */}
                    {cita.profesionalPorConfirmar &&
                      estado !== 'Cancelada' && (

                        <p className="aviso-confirmacion-profesional">
                          El profesional solicitado está sujeto
                          a confirmación de la clínica.
                        </p>

                      )}


                    {/* =========================
                        BOTONES Y MODIFICACIÓN
                    ========================= */}

                    {puedeGestionar && (

                      <>

                        {/* =====================
                            FORMULARIO MODIFICAR
                        ===================== */}

                        {abierta && (

                          <form
                            className="formulario-editar-cita"
                            onSubmit={guardarCambios}
                          >
                            {/* Nueva fecha */}
                            <div className="campo-editar-cita">

                              <label
                                htmlFor={`fecha-editar-${cita.id}`}
                              >
                                Nueva fecha
                              </label>

                              <input
                                id={`fecha-editar-${cita.id}`}
                                type="date"
                                min={fechaLocalHoy()}
                                value={nuevaFecha}
                                onChange={(evento) => {

                                  setNuevaFecha(
                                    evento.target.value
                                  )

                                  setNuevaHora('')

                                  setErrorEdicion('')
                                }}
                                required
                              />

                            </div>

                            {/* Nueva hora */}
                            <div className="campo-editar-cita">

                              <label
                                htmlFor={`hora-editar-${cita.id}`}
                              >
                                Nueva hora
                              </label>

                              <select
                                id={`hora-editar-${cita.id}`}
                                value={nuevaHora}
                                onChange={(evento) => {

                                  setNuevaHora(
                                    evento.target.value
                                  )

                                  setErrorEdicion('')
                                }}
                                disabled={!nuevaFecha}
                                required
                              >

                                <option value="">
                                  Selecciona una hora
                                </option>

                                {HORARIOS_CITAS.map((hora) => (

                                  <option
                                    key={hora}
                                    value={hora}
                                    disabled={
                                      horasNoDisponibles.includes(hora)
                                    }
                                  >
                                    {hora}

                                    {horasNoDisponibles.includes(hora)
                                      ? ' (no disponible)'
                                      : ''}
                                  </option>

                                ))}

                              </select>

                            </div>


                            {/* Error de modificación */}
                            {errorEdicion && (

                              <p
                                className="mensaje-error-edicion"
                                role="alert"
                              >
                                {errorEdicion}
                              </p>

                            )}


                            {/* Botones Guardar y Volver */}
                            <div className="acciones-edicion-cita">

                              <button
                                type="submit"
                                className="boton-guardar-cambios"
                              >
                                Guardar cambios
                              </button>

                              <button
                                type="button"
                                className="boton-cerrar-edicion"
                                onClick={cerrarEdicion}
                              >
                                Volver
                              </button>

                            </div>

                          </form>

                        )}


                        {/* =====================
                            CONFIRMAR CANCELACIÓN
                        ===================== */}

                        {confirmando && (

                          <div
                            className="confirmacion-cancelar-cita"
                            role="group"
                            aria-label="Confirmar cancelación"
                          >

                            <strong>
                              ¿Quieres cancelar esta cita?
                            </strong>

                            <p>
                              La solicitud quedará en estado Cancelada.
                            </p>

                            <div className="acciones-edicion-cita">

                              <button
                                type="button"
                                className="boton-cancelar-cita"
                                onClick={() =>
                                  confirmarCancelacion(cita)
                                }
                              >
                                Sí, cancelar cita
                              </button>

                              <button
                                type="button"
                                className="boton-cerrar-edicion"
                                onClick={() =>
                                  setCancelandoId(null)
                                }
                              >
                                Volver
                              </button>

                            </div>

                          </div>

                        )}

                        {/* =====================
                            BOTONES PRINCIPALES
                        ===================== */}
                        {!abierta && !confirmando && (

                          <div className="acciones-cita">

                            <button
                              type="button"
                              className="boton-modificar-cita"
                              onClick={() =>
                                abrirEdicion(cita)
                              }
                            >
                              Modificar fecha y hora
                            </button>

                            <button
                              type="button"
                              className="boton-cancelar-cita"
                              onClick={() => {

                                setCancelandoId(
                                  String(cita.id)
                                )

                                cerrarEdicion()

                                setMensaje('')
                              }}
                            >
                              Cancelar cita
                            </button>

                          </div>

                        )}

                      </>

                    )}

                  </article>

                )
              })}

            </section>

          )}

        </div>

      </main>
      {/* =========================================
          SECCIÓN DE AYUDA ORIGINAL
      ========================================= */}
      <section className="ayuda-mis-citas">

        <div className="contenedor">

          <div className="tarjeta-ayuda-mis-citas">

            {/* TEXTO */}
            <div className="texto-ayuda-mis-citas">

              <span className="etiqueta-ayuda">
                ¿Tienes alguna duda?
              </span>

              <h2>
                Estamos para ayudarte
              </h2>

              <p>
                Si necesitas modificar información o
                tienes dudas sobre una solicitud,
                puedes contactarnos.
                Estamos para orientarte.
              </p>

              <div className="beneficios-ayuda-citas">

                <span>
                  ♡ Atención cercana
                </span>

                <span>
                  ✦ Resolvemos tus dudas
                </span>

              </div>

            </div>

            {/* IMAGEN ORIGINAL */}
            <div className="imagen-ayuda-citas">

              <div
                className="circulo-ayuda circulo-ayuda-rosa"
                aria-hidden="true"
              />

              <div
                className="circulo-ayuda circulo-ayuda-celeste"
                aria-hidden="true"
              />

              <img
                src="/img/mascotas-cita.png"
                alt="Perro y gato de Patitas Felices"
              />

            </div>

            {/* BOTÓN DE CONTACTO */}
            <div className="accion-ayuda-citas">

              <Link
                to="/contacto"
                className="boton-ayuda"
              >
                Ir a contacto

                <span aria-hidden="true">
                  →
                </span>

              </Link>

              <small>
                Estamos para orientarte
              </small>

            </div>

          </div>

        </div>

      </section>

    </div>

  )
}