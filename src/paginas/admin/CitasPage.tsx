
/* =========================================================
   VETERINARIA PATITAS FELICES
   ADMINISTRAR CITAS - EVALUACIÓN 2

   Archivo: src/paginas/admin/CitasPage.tsx

   FUNCIONALIDADES:
   - Listar todas las citas veterinarias.
   - Buscar clientes y mascotas.
   - Filtrar por fecha y estado.
   - Confirmar, completar y cancelar citas.
   - Ver información de las solicitudes.
   - Reagendar únicamente los días del veterinario.
   - Bloquear horas ocupadas por otros pacientes.
   - Respetar la duración de cada atención.
========================================================= */

import { useState } from 'react'
import type { FormEvent } from 'react'

import { EncabezadoAdmin }
  from '../../componentes/organismos/EncabezadoAdmin'

import { obtenerVeterinarioPorId }
  from '../../services/veterinariosService'

import {
  actualizarCita,
  fechaLocalHoy,
  HORARIOS_CITAS,
  horasOcupadas,
  listarCitas
} from '../../services/citasService'

import type {
  Cita,
  EstadoCita
} from '../../services/citasService'

import '../../styles/estilo-admin-citas.css'


/* =========================================================
   1. TIPOS DE DATOS
========================================================= */

type FiltroEstado = 'Todas' | EstadoCita

type Orden = 'proximas' | 'recientes'

type AccionEstado =
  | 'Confirmada'
  | 'Completada'
  | 'Cancelada'

interface Confirmacion {
  id: string
  nuevoEstado: AccionEstado
}

interface FechaDisponible {
  valor: string
  etiqueta: string
}


/* =========================================================
   2. NORMALIZAR ESTADOS

   Mantiene compatibilidad con registros antiguos.
========================================================= */

function estadoDe(cita: Cita): EstadoCita {
  switch ((cita.estado || 'Pendiente').toLowerCase()) {
    case 'confirmada':
      return 'Confirmada'

    case 'completada':
      return 'Completada'

    case 'cancelada':
      return 'Cancelada'

    default:
      return 'Pendiente'
  }
}


/* =========================================================
   3. MOSTRAR FECHAS EN ESPAÑOL
========================================================= */

function fechaBonita(fecha: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha || '')) {
    return fecha || 'Por confirmar'
  }

  const [anio, mes, dia] = fecha
    .split('-')
    .map(Number)

  const objeto = new Date(anio, mes - 1, dia)

  if (
    objeto.getFullYear() !== anio ||
    objeto.getMonth() !== mes - 1 ||
    objeto.getDate() !== dia
  ) {
    return 'Fecha inválida'
  }

  return objeto.toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}


/* =========================================================
   4. OBTENER FECHAS DISPONIBLES DEL VETERINARIO

   CAMBIO 1:

   Ya no se permite seleccionar cualquier día.

   Esta función revisa:
   - Días de atención del veterinario.
   - Fechas de los próximos 90 días.
   - Que exista al menos una hora libre.
   - Que no sean horarios pasados.

   Los días se obtienen de veterinariosService.ts
   y de los datos del equipo veterinario.
========================================================= */

function fechasDisponiblesMedico(
  cita: Cita | undefined
): FechaDisponible[] {

  if (!cita || cita.veterinarioId == null) {
    return []
  }

  const medico = obtenerVeterinarioPorId(
    cita.veterinarioId
  )

  if (
    !medico ||
    medico.cargo !== 'Médico veterinario'
  ) {
    return []
  }

  const diasSemana = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado'
  ]

  const hoy = new Date()

  hoy.setHours(0, 0, 0, 0)

  const ahora = new Date()

  const minutosAhora =
    ahora.getHours() * 60 +
    ahora.getMinutes()

  const opciones: FechaDisponible[] = []

  /* Revisar los próximos 90 días. */

  for (
    let desplazamiento = 0;
    desplazamiento < 90;
    desplazamiento++
  ) {

    const dia = new Date(hoy)

    dia.setDate(
      hoy.getDate() + desplazamiento
    )

    const nombreDia = diasSemana[
      dia.getDay()
    ]

    /* -----------------------------------------
       No incluir días que el médico no atiende.
    ----------------------------------------- */

    if (!medico.dias.includes(nombreDia)) {
      continue
    }

    /* Convertir fecha a YYYY-MM-DD. */

    const valor = [
      dia.getFullYear(),
      String(dia.getMonth() + 1).padStart(2, '0'),
      String(dia.getDate()).padStart(2, '0')
    ].join('-')

    /* -----------------------------------------
       CAMBIO 2:

       Consultamos las horas ocupadas del médico.

       cita.id:
       Ignora la misma cita que estamos modificando.

       veterinarioId:
       Revisa solamente la agenda de ese médico.

       servicio:
       Considera la duración de la consulta.
    ----------------------------------------- */

    const ocupadas = horasOcupadas(
      valor,
      cita.id,
      cita.veterinarioId,
      cita.servicio
    )

    /* Comprobar si existe alguna hora libre. */

    const tieneHoraLibre = HORARIOS_CITAS.some(
      (hora) => {

        if (ocupadas.includes(hora)) {
          return false
        }

        /* Si es hoy, no ofrecer horas pasadas. */

        if (desplazamiento === 0) {

          const [horas, minutos] = hora
            .split(':')
            .map(Number)

          return (
            horas * 60 + minutos >
            minutosAhora
          )
        }

        return true
      }
    )

    /* No mostrar fechas completamente ocupadas. */

    if (!tieneHoraLibre) {
      continue
    }

    /* Agregar fecha disponible. */

    opciones.push({
      valor,

      etiqueta: dia.toLocaleDateString(
        'es-CL',
        {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }
      )
    })
  }

  return opciones
}


/* =========================================================
   5. FUNCIONES AUXILIARES
========================================================= */

function especieDe(cita: Cita): string {

  return cita.tipoMascota === 'Otro'
    ? cita.otraEspecie || 'Otra especie'
    : cita.tipoMascota || 'No indicada'
}

function nombreCliente(cita: Cita): string {

  return (
    cita.dueno ||
    cita.propietario ||
    cita.nombreUsuario ||
    'Sin nombre'
  )
}

function correoCliente(cita: Cita): string {

  return (
    cita.correo ||
    cita.correoUsuario ||
    'Sin correo'
  )
}

function textoAccion(
  estado: AccionEstado
): string {

  switch (estado) {
    case 'Confirmada':
      return 'confirmar'

    case 'Completada':
      return 'marcar como completada'

    case 'Cancelada':
      return 'cancelar'
  }
}


/* =========================================================
   6. COMPONENTE PRINCIPAL
========================================================= */

export default function CitasPage() {

  /* Obtener todas las citas guardadas. */

  const [citas, setCitas] = useState<Cita[]>(
    () => listarCitas()
  )

  /* Estados de los filtros. */

  const [busqueda, setBusqueda] = useState('')

  const [filtroEstado, setFiltroEstado] =
    useState<FiltroEstado>('Todas')

  const [filtroFecha, setFiltroFecha] =
    useState('')

  const [orden, setOrden] =
    useState<Orden>('proximas')

  /* Ventanas de información. */

  const [detalleId, setDetalleId] =
    useState<string | null>(null)

  const [confirmacion, setConfirmacion] =
    useState<Confirmacion | null>(null)

  /* Estados para modificar una cita. */

  const [reagendarId, setReagendarId] =
    useState<string | null>(null)

  const [nuevaFecha, setNuevaFecha] =
    useState('')

  const [nuevaHora, setNuevaHora] =
    useState('')

  const [errorReagenda, setErrorReagenda] =
    useState('')

  /* Mensajes de éxito y error. */

  const [aviso, setAviso] = useState('')

  const [avisoError, setAvisoError] =
    useState(false)


  /* =====================================================
     7. CONTADORES DE CITAS
  ===================================================== */

  const total = citas.length

  const pendientes = citas.filter(
    (cita) => estadoDe(cita) === 'Pendiente'
  ).length

  const confirmadas = citas.filter(
    (cita) => estadoDe(cita) === 'Confirmada'
  ).length

  const canceladas = citas.filter(
    (cita) => estadoDe(cita) === 'Cancelada'
  ).length


  /* =====================================================
     8. BÚSQUEDA Y FILTROS
  ===================================================== */

  const texto = busqueda.trim().toLowerCase()

  const visibles = citas
    .filter((cita) => {

      const coincideTexto =
        !texto ||
        [
          nombreCliente(cita),
          correoCliente(cita),
          cita.mascota,
          cita.servicio,
          cita.veterinarioNombre,
          cita.fecha
        ].some((valor) =>
          (valor || '')
            .toLowerCase()
            .includes(texto)
        )

      const coincideEstado =
        filtroEstado === 'Todas' ||
        estadoDe(cita) === filtroEstado

      const coincideFecha =
        !filtroFecha ||
        cita.fecha === filtroFecha

      return (
        coincideTexto &&
        coincideEstado &&
        coincideFecha
      )
    })
    .sort((a, b) => {

      if (orden === 'recientes') {

        return (
          b.fechaRegistro || ''
        ).localeCompare(
          a.fechaRegistro || ''
        )
      }

      return `${a.fecha || ''} ${a.hora || ''}`
        .localeCompare(
          `${b.fecha || ''} ${b.hora || ''}`
        )
    })


  /* =====================================================
     9. ENCONTRAR CITA SELECCIONADA
  ===================================================== */

  const detalle = citas.find(
    (cita) => String(cita.id) === detalleId
  )

  const citaReagenda = citas.find(
    (cita) => String(cita.id) === reagendarId
  )

  const citaAccion = citas.find(
    (cita) =>
      String(cita.id) === confirmacion?.id
  )


  /* =====================================================
     10. RECARGAR Y LIMPIAR FILTROS
  ===================================================== */

  function recargar() {
    setCitas(listarCitas())
  }

  function limpiarFiltros() {

    setBusqueda('')
    setFiltroEstado('Todas')
    setFiltroFecha('')
    setOrden('proximas')
  }


  /* =====================================================
     11. CAMBIAR ESTADO DE UNA CITA

     Pendiente -> Confirmada o Cancelada.
     Confirmada -> Completada o Cancelada.
  ===================================================== */

  function guardarEstado() {

    if (!confirmacion || !citaAccion) {
      return
    }

    const actual = estadoDe(citaAccion)

    const nuevo = confirmacion.nuevoEstado

    const permitido =
      (
        actual === 'Pendiente' &&
        ['Confirmada', 'Cancelada'].includes(nuevo)
      ) ||
      (
        actual === 'Confirmada' &&
        ['Completada', 'Cancelada'].includes(nuevo)
      )

    if (!permitido) {

      setAviso(
        'Esta cita ya cambió de estado.'
      )

      setAvisoError(true)

      setConfirmacion(null)

      recargar()

      return
    }

    const resultado = actualizarCita(
      citaAccion.id,
      { estado: nuevo }
    )

    if (!resultado.ok) {

      setAviso(resultado.mensaje)
      setAvisoError(true)

    } else {

      setAviso(
        `La cita de ${citaAccion.mascota || 'la mascota'} quedó ${nuevo.toLowerCase()}.`
      )

      setAvisoError(false)
    }

    setConfirmacion(null)
    setDetalleId(null)

    recargar()
  }


  /* =====================================================
     12. ABRIR FORMULARIO PARA REAGENDAR

     Solo permite modificar citas Pendientes
     o Confirmadas.

     La fecha debe encontrarse dentro de
     los días disponibles del veterinario.
  ===================================================== */

  function abrirReagenda(cita: Cita) {

    if (
      ['Cancelada', 'Completada'].includes(
        estadoDe(cita)
      )
    ) {
      return
    }

    setReagendarId(String(cita.id))

    const disponibles = fechasDisponiblesMedico(
      cita
    )

    const fechaValida = disponibles.some(
      (dia) => dia.valor === cita.fecha
    )

    setNuevaFecha(
      fechaValida ? cita.fecha : ''
    )

    /* Debe elegir explícitamente la nueva hora. */

    setNuevaHora('')

    setErrorReagenda('')
    setDetalleId(null)
    setAviso('')
  }


  /* =====================================================
     13. CERRAR FORMULARIO DE REAGENDAMIENTO
  ===================================================== */

  function cerrarReagenda() {

    setReagendarId(null)
    setNuevaFecha('')
    setNuevaHora('')
    setErrorReagenda('')
  }


  /* =====================================================
     14. FECHAS DISPONIBLES DEL VETERINARIO

     Esta lista incluye únicamente fechas con
     al menos una hora libre.
  ===================================================== */

  const fechasHabilitadas =
    fechasDisponiblesMedico(citaReagenda)

  const medicoReagenda =
    citaReagenda?.veterinarioId != null
      ? obtenerVeterinarioPorId(
          citaReagenda.veterinarioId
        )
      : null


  /* =====================================================
     15. CONSULTAR HORAS OCUPADAS

     IMPORTANTE:

     El segundo argumento excluye la cita actual.

     El tercer argumento permite comprobar
     únicamente la agenda del mismo doctor.

     El cuarto argumento considera la duración
     del servicio solicitado.
  ===================================================== */

  const horasNoDisponibles =
    citaReagenda && nuevaFecha
      ? horasOcupadas(
          nuevaFecha,
          citaReagenda.id,
          citaReagenda.veterinarioId,
          citaReagenda.servicio
        )
      : []


  /* =====================================================
     16. MOSTRAR SOLO HORAS LIBRES

     CAMBIO 2:

     Si el Dr. Ignacio Pavez tiene a Luna a las
     15:00, esa hora no aparecerá disponible para
     Toby con ese mismo médico.

     Otro veterinario sí puede tener una consulta
     a las 15:00 porque maneja su propia agenda.
  ===================================================== */

  const horasLibres: string[] =
    !nuevaFecha
      ? []
      : HORARIOS_CITAS.filter((hora) => {

          /* Ocultar horas ya reservadas. */

          if (
            horasNoDisponibles.includes(hora)
          ) {
            return false
          }

          /* No mostrar horas que ya pasaron. */

          if (
            nuevaFecha === fechaLocalHoy()
          ) {

            const [hh, mm] = hora
              .split(':')
              .map(Number)

            const ahora = new Date()

            return (
              hh * 60 + mm >
              ahora.getHours() * 60 +
              ahora.getMinutes()
            )
          }

          return true
        })


  /* =====================================================
     17. GUARDAR REAGENDAMIENTO

     Se comprueba nuevamente:
     - Estado de la cita.
     - Fecha disponible.
     - Hora disponible.
     - Conflictos con otros pacientes.
     - Duración del servicio.

     citasService.ts también vuelve a validar
     los datos antes de guardarlos.
  ===================================================== */

  function guardarReagenda(
    evento: FormEvent<HTMLFormElement>
  ) {

    evento.preventDefault()

    if (!citaReagenda) {
      return
    }

    /* No modificar citas finalizadas. */

    if (
      ['Cancelada', 'Completada'].includes(
        estadoDe(citaReagenda)
      )
    ) {

      setErrorReagenda(
        'No puedes reagendar una cita finalizada.'
      )

      return
    }

    /* Revisar fecha. */

    if (
      !nuevaFecha ||
      nuevaFecha < fechaLocalHoy()
    ) {

      setErrorReagenda(
        'Selecciona una fecha actual o futura.'
      )

      return
    }

    /* Comprobar día disponible del médico. */

    if (
      !fechasHabilitadas.some(
        (dia) => dia.valor === nuevaFecha
      )
    ) {

      setErrorReagenda(
        'Ese día no está disponible para el veterinario.'
      )

      return
    }

    /* Revisar horario libre. */

    if (
      !nuevaHora ||
      !horasLibres.includes(nuevaHora)
    ) {

      setErrorReagenda(
        'Selecciona una hora disponible del veterinario.'
      )

      return
    }

    /* -----------------------------------------
       COMPROBAR HORARIOS OCUPADOS OTRA VEZ

       Evita guardar dos pacientes que tengan
       horarios superpuestos con el mismo médico.
    ----------------------------------------- */

    const ocupadasActuales = horasOcupadas(
      nuevaFecha,
      citaReagenda.id,
      citaReagenda.veterinarioId,
      citaReagenda.servicio
    )

    if (
      ocupadasActuales.includes(nuevaHora)
    ) {

      setErrorReagenda(
        'El veterinario ya tiene otro paciente en ese horario.'
      )

      recargar()

      return
    }

    /* Verificar que la hora no haya pasado. */

    if (
      nuevaFecha === fechaLocalHoy()
    ) {

      const [horas, minutos] =
        nuevaHora.split(':').map(Number)

      const ahora = new Date()

      if (
        horas * 60 + minutos <=
        ahora.getHours() * 60 +
        ahora.getMinutes()
      ) {

        setErrorReagenda(
          'Ese horario ya pasó.'
        )

        return
      }
    }

    /* Guardar utilizando el servicio existente. */

    const resultado = actualizarCita(
      citaReagenda.id,
      {
        fecha: nuevaFecha,
        hora: nuevaHora
      }
    )

    if (!resultado.ok) {

      setErrorReagenda(resultado.mensaje)

      return
    }

    setAviso(
      'La cita fue reagendada correctamente.'
    )

    setAvisoError(false)

    cerrarReagenda()

    recargar()
  }


  /* =====================================================
     18. INTERFAZ DE ADMINISTRAR CITAS
  ===================================================== */

  return (

    <div className="admin-citas-pagina">


      {/* =========================================
          ENCABEZADO
      ========================================= */}

      <EncabezadoAdmin>
        Gestión de citas 🐾
      </EncabezadoAdmin>

      <p className="admin-citas-subtitulo">
        Revisa las solicitudes de atención,
        confirma citas y organiza la agenda de la clínica.
      </p>


      {/* =========================================
          INDICADORES DE CITAS
      ========================================= */}

      <section
        className="admin-kpis admin-citas-kpis"
        aria-label="Resumen de citas"
      >

        {[
          {
            titulo: 'Total de citas',
            numero: total,
            clase: 'total',
            icono: '/img/icono-admin-citas.png'
          },
          {
            titulo: 'Pendientes',
            numero: pendientes,
            clase: 'pendiente',
            icono: '/img/pendientes.png'
          },
          {
            titulo: 'Confirmadas',
            numero: confirmadas,
            clase: 'confirmada',
            icono: '/img/confirmadas.png'
          },
          {
            titulo: 'Canceladas',
            numero: canceladas,
            clase: 'cancelada',
            icono: '/img/canceladas.png'
          }
        ].map((item) => (

          <article
            key={item.clase}
            className={
              `admin-kpi admin-cita-kpi admin-cita-kpi--${item.clase}`
            }
          >

            <div className="admin-citas-icono-contenedor">

              <img
                className="admin-citas-kpi-icono"
                src={item.icono}
                alt=""
              />

            </div>

            <strong className="admin-kpi-numero">
              {item.numero}
            </strong>

            <span className="admin-kpi-label">
              {item.titulo}
            </span>

          </article>

        ))}

      </section>


      {/* =========================================
          PANEL DE FILTROS
      ========================================= */}

      <section
        className="admin-citas-panel"
        aria-label="Buscar y filtrar citas"
      >

        <div className="admin-citas-panel-titulo">

          <div>

            <span className="admin-citas-etiqueta">
              Agenda veterinaria
            </span>

            <h2>Solicitudes de citas</h2>

            <p>
              Busca por cliente, mascota,
              servicio o veterinario.
            </p>

          </div>

          <span className="admin-citas-contador">

            {visibles.length}

            {' '}

            {visibles.length === 1
              ? 'cita'
              : 'citas'}

          </span>

        </div>


        <div className="admin-citas-filtros">


          {/* Buscar solicitud */}
          <div className="admin-citas-campo admin-citas-campo--buscar">

            <label htmlFor="admin-buscar-cita">
              Buscar solicitud
            </label>

            <input
              id="admin-buscar-cita"
              type="search"
              value={busqueda}
              placeholder="Cliente, mascota, servicio..."
              onChange={(evento) =>
                setBusqueda(evento.target.value)
              }
            />

          </div>


          {/* Filtrar por estado */}
          <div className="admin-citas-campo">

            <label htmlFor="admin-estado-cita">
              Estado
            </label>

            <select
              id="admin-estado-cita"
              value={filtroEstado}
              onChange={(evento) =>
                setFiltroEstado(
                  evento.target.value as FiltroEstado
                )
              }
            >

              <option value="Todas">
                Todos los estados
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


          {/* Filtrar por fecha */}
          <div className="admin-citas-campo">

            <label htmlFor="admin-fecha-cita">
              Fecha
            </label>

            <input
              id="admin-fecha-cita"
              type="date"
              value={filtroFecha}
              onChange={(evento) =>
                setFiltroFecha(evento.target.value)
              }
            />

          </div>


          {/* Ordenar citas */}
          <div className="admin-citas-campo">

            <label htmlFor="admin-orden-citas">
              Ordenar
            </label>

            <select
              id="admin-orden-citas"
              value={orden}
              onChange={(evento) =>
                setOrden(
                  evento.target.value as Orden
                )
              }
            >

              <option value="proximas">
                Por fecha de atención
              </option>

              <option value="recientes">
                Más recientes primero
              </option>

            </select>

          </div>


          {/* Limpiar filtros */}
          <button
            type="button"
            className="admin-citas-btn-limpiar"
            onClick={limpiarFiltros}
          >
            Limpiar
          </button>

        </div>

      </section>


      {/* =========================================
          MENSAJES DE ÉXITO Y ERROR
      ========================================= */}

      {aviso && (

        <div
          className={
            `admin-citas-aviso ${
              avisoError
                ? 'admin-citas-aviso--error'
                : ''
            }`
          }
          role="status"
        >

          {aviso}

          <button
            type="button"
            aria-label="Cerrar mensaje"
            onClick={() => setAviso('')}
          >
            ×
          </button>

        </div>

      )}


      {/* =========================================
          TABLA DE CITAS
      ========================================= */}

      <section
        className="admin-tabla-seccion admin-citas-tabla-seccion"
        aria-label="Agenda de citas"
      >

        <div className="admin-citas-tabla-cabecera">

          <div>

            <h2>Agenda de citas</h2>

            <p>
              Revisa los detalles y administra
              las solicitudes.
            </p>

          </div>

        </div>


        {/* Cuando no hay resultados */}
        {visibles.length === 0 ? (

          <div className="admin-citas-vacio">

            <p>
              No se encontraron citas con estos filtros.
            </p>

            <button
              type="button"
              onClick={limpiarFiltros}
            >
              Limpiar filtros
            </button>

          </div>

        ) : (

          /* Tabla de solicitudes */
          <div className="admin-tabla-wrap table-responsive">

            <table className="admin-tabla admin-citas-tabla">

              <thead>

                <tr>
                  <th>Cliente</th>
                  <th>Mascota</th>
                  <th>Servicio / Médico</th>
                  <th>Fecha y hora</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>

              </thead>

              <tbody>

                {visibles.map((cita) => {

                  const estado = estadoDe(cita)

                  return (

                    <tr key={String(cita.id)}>


                      {/* Cliente */}
                      <td>

                        <strong className="admin-citas-cliente">
                          {nombreCliente(cita)}
                        </strong>

                        <small>
                          {correoCliente(cita)}
                        </small>

                      </td>


                      {/* Mascota */}
                      <td>

                        <strong className="admin-citas-mascota">
                          {cita.mascota || 'Sin nombre'}
                        </strong>

                        <small>
                          {especieDe(cita)}
                        </small>

                      </td>


                      {/* Servicio y veterinario */}
                      <td>

                        <strong className="admin-citas-servicio">
                          {cita.servicio || 'Sin servicio'}
                        </strong>

                        <small>
                          {cita.veterinarioNombre ||
                            'Profesional por confirmar'}
                        </small>

                      </td>


                      {/* Fecha y hora */}
                      <td>

                        <strong className="admin-citas-fecha">
                          {fechaBonita(cita.fecha)}
                        </strong>

                        <small className="admin-citas-hora">
                          {cita.hora || 'Por confirmar'}
                        </small>

                      </td>


                      {/* Estado */}
                      <td>

                        <span
                          className={
                            `admin-cita-badge admin-cita-badge--${estado.toLowerCase()}`
                          }
                        >
                          {estado}
                        </span>

                      </td>


                      {/* Botones de acciones */}
                      <td>

                        <div className="admin-citas-acciones">


                          {/* Ver detalle */}
                          <button
                            type="button"
                            className="admin-citas-btn admin-citas-btn--ver"
                            onClick={() =>
                              setDetalleId(String(cita.id))
                            }
                          >
                            Ver detalle
                          </button>


                          {/* Confirmar una cita pendiente */}
                          {estado === 'Pendiente' && (

                            <button
                              type="button"
                              className="admin-citas-btn admin-citas-btn--confirmar"
                              onClick={() =>
                                setConfirmacion({
                                  id: String(cita.id),
                                  nuevoEstado: 'Confirmada'
                                })
                              }
                            >
                              Confirmar
                            </button>

                          )}


                          {/* Completar una cita confirmada */}
                          {estado === 'Confirmada' && (

                            <button
                              type="button"
                              className="admin-citas-btn admin-citas-btn--confirmar"
                              onClick={() =>
                                setConfirmacion({
                                  id: String(cita.id),
                                  nuevoEstado: 'Completada'
                                })
                              }
                            >
                              Completar
                            </button>

                          )}


                          {/* Reagendar o cancelar */}
                          {(
                            estado === 'Pendiente' ||
                            estado === 'Confirmada'
                          ) && (

                            <>

                              <button
                                type="button"
                                className="admin-citas-btn admin-citas-btn--ver"
                                onClick={() =>
                                  abrirReagenda(cita)
                                }
                              >
                                Reagendar
                              </button>

                              <button
                                type="button"
                                className="admin-citas-btn admin-citas-btn--cancelar"
                                onClick={() =>
                                  setConfirmacion({
                                    id: String(cita.id),
                                    nuevoEstado: 'Cancelada'
                                  })
                                }
                              >
                                Cancelar
                              </button>

                            </>

                          )}

                        </div>

                      </td>

                    </tr>

                  )
                })}

              </tbody>

            </table>

          </div>

        )}

      </section>


      {/* =====================================================
          19. VENTANA PARA VER DETALLE DE CITA
      ===================================================== */}

      {detalle && (

        <div className="admin-citas-modal-fondo">

          <section
            className="admin-citas-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="detalle-cita-titulo"
          >

            <button
              type="button"
              className="admin-citas-modal-cerrar"
              aria-label="Cerrar detalle"
              onClick={() => setDetalleId(null)}
            >
              ×
            </button>


            <div className="admin-citas-modal-encabezado">

              <span className="admin-citas-modal-icono">
                📅
              </span>

              <div>

                <span className="admin-citas-etiqueta">
                  Detalle de solicitud
                </span>

                <h2 id="detalle-cita-titulo">
                  Cita de {detalle.mascota || 'mascota'}
                </h2>

              </div>

            </div>


            {/* Información de la cita */}
            <div className="admin-citas-modal-contenido">

              {[
                ['Cliente', nombreCliente(detalle)],
                ['Correo', correoCliente(detalle)],
                ['Teléfono', detalle.telefono || 'No indicado'],
                [
                  'Mascota',
                  `${detalle.mascota || 'Sin nombre'} · ${especieDe(detalle)}`
                ],
                ['Servicio', detalle.servicio || 'Sin servicio'],
                [
                  'Veterinario',
                  detalle.veterinarioNombre || 'Por confirmar'
                ],
                ['Fecha', fechaBonita(detalle.fecha)],
                ['Hora', detalle.hora || 'Por confirmar'],
                ['Estado', estadoDe(detalle)],
                [
                  'Duración',
                  detalle.duracionMinutos
                    ? `${detalle.duracionMinutos} minutos`
                    : 'No indicada'
                ]
              ].map(([titulo, valor]) => (

                <div
                  key={titulo}
                  className="admin-citas-detalle-bloque"
                >

                  <span>{titulo}</span>

                  <strong>{valor}</strong>

                </div>

              ))}


              {/* Motivo de la consulta */}
              <div className="admin-citas-detalle-bloque admin-citas-detalle-bloque--ancho">

                <span>Motivo de consulta</span>

                <p>
                  {detalle.motivo || 'No indicado'}
                </p>

              </div>


              {/* Aviso de profesional por confirmar */}
              {detalle.profesionalPorConfirmar && (

                <div className="admin-citas-detalle-bloque admin-citas-detalle-bloque--ancho">

                  <span>Observación</span>

                  <p>
                    La clínica debe confirmar
                    el profesional responsable
                    de esta atención.
                  </p>

                </div>

              )}

            </div>


            <div className="admin-citas-modal-acciones">

              <button
                type="button"
                className="admin-citas-btn-secundario"
                onClick={() => setDetalleId(null)}
              >
                Cerrar
              </button>

            </div>

          </section>

        </div>

      )}


      {/* =====================================================
          20. VENTANA PARA REAGENDAR UNA CITA

          NUEVAS VALIDACIONES:

          ✓ Solo días del veterinario.
          ✓ Solo fechas con horas disponibles.
          ✓ No permite horas duplicadas.
          ✓ Respeta la duración del servicio.
      ===================================================== */}

      {citaReagenda && (

        <div className="admin-citas-modal-fondo">

          <section
            className="admin-citas-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reagendar-cita-titulo"
          >

            <button
              type="button"
              className="admin-citas-modal-cerrar"
              aria-label="Cerrar reagendamiento"
              onClick={cerrarReagenda}
            >
              ×
            </button>


            <div className="admin-citas-modal-encabezado">

              <span className="admin-citas-modal-icono">
                🗓️
              </span>

              <div>

                <span className="admin-citas-etiqueta">
                  Agenda veterinaria
                </span>

                <h2 id="reagendar-cita-titulo">
                  Reagendar a {citaReagenda.mascota || 'la mascota'}
                </h2>

              </div>

            </div>


            {/* Servicio y profesional */}
            <p className="admin-citas-modal-descripcion">

              Servicio: <strong>
                {citaReagenda.servicio}
              </strong>

              {' · '}

              Veterinario: <strong>
                {citaReagenda.veterinarioNombre ||
                  'Por confirmar'}
              </strong>

            </p>


            {/* Días reales de atención del veterinario */}
            {medicoReagenda && (

              <p className="admin-citas-modal-descripcion">

                <strong>Días de atención:</strong>

                {' '}

                {medicoReagenda.dias.join(', ')}

                {' · '}

                {medicoReagenda.horario}

              </p>

            )}


            <form
              className="admin-citas-form-reagendar"
              onSubmit={guardarReagenda}
            >


              {/* =====================================
                  CAMBIO 1:
                  SELECCIONAR SOLO DÍAS DISPONIBLES
              ===================================== */}

              <div className="admin-citas-campo">

                <label htmlFor="fecha-reagenda">
                  Fecha disponible del veterinario
                </label>

                <select
                  id="fecha-reagenda"
                  value={nuevaFecha}
                  required
                  disabled={
                    fechasHabilitadas.length === 0
                  }
                  onChange={(evento) => {

                    setNuevaFecha(evento.target.value)

                    /* Limpiar hora al cambiar fecha. */
                    setNuevaHora('')

                    setErrorReagenda('')

                  }}
                >

                  <option value="">
                    Selecciona un día disponible
                  </option>

                  {fechasHabilitadas.map((dia) => (

                    <option
                      key={dia.valor}
                      value={dia.valor}
                    >
                      {dia.etiqueta}
                    </option>

                  ))}

                </select>


                {/* Sin fechas disponibles */}
                {fechasHabilitadas.length === 0 && (

                  <small className="admin-citas-ayuda-fecha">

                    No hay fechas con horarios disponibles
                    para este profesional durante los
                    próximos 90 días.

                  </small>

                )}

              </div>


              {/* =====================================
                  CAMBIO 2:
                  MOSTRAR SOLO HORAS LIBRES DEL MÉDICO
              ===================================== */}

              <div className="admin-citas-campo">

                <label htmlFor="hora-reagenda">
                  Nueva hora
                </label>

                <select
                  id="hora-reagenda"
                  value={nuevaHora}
                  required
                  disabled={
                    !nuevaFecha ||
                    horasLibres.length === 0
                  }
                  onChange={(evento) => {

                    setNuevaHora(evento.target.value)
                    setErrorReagenda('')

                  }}
                >

                  <option value="">
                    Selecciona una hora libre
                  </option>

                  {horasLibres.map((hora) => (

                    <option
                      key={hora}
                      value={hora}
                    >
                      {hora}
                    </option>

                  ))}

                </select>


                {/* Aviso si no tiene horas disponibles */}
                {nuevaFecha &&
                  horasLibres.length === 0 && (

                  <small className="admin-citas-ayuda-fecha">

                    Este veterinario no tiene horas
                    libres en la fecha seleccionada.
                    Elige otro día.

                  </small>

                )}

              </div>


              {/* Mensaje de error */}
              {errorReagenda && (

                <p
                  className="admin-citas-error"
                  role="alert"
                >
                  {errorReagenda}
                </p>

              )}


              {/* Botones */}
              <div className="admin-citas-modal-acciones">

                <button
                  type="button"
                  className="admin-citas-btn-secundario"
                  onClick={cerrarReagenda}
                >
                  Volver
                </button>

                <button
                  type="submit"
                  className="admin-citas-btn-confirmar"
                >
                  Guardar nueva fecha
                </button>

              </div>

            </form>

          </section>

        </div>

      )}

      {/* =====================================================
          21. VENTANA PARA CONFIRMAR CAMBIO DE ESTADO

          Previene cambios accidentales.
      ===================================================== */}
      {confirmacion && citaAccion && (

        <div className="admin-citas-modal-fondo">

          <section
            className="admin-citas-modal admin-citas-modal--confirmacion"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirmar-estado-titulo"
          >

            <div className="admin-citas-confirmacion-icono">
              ✓
            </div>


            <h2 id="confirmar-estado-titulo">

              ¿Deseas{' '}

              {textoAccion(
                confirmacion.nuevoEstado
              )}

              {' '}esta cita?

            </h2>


            <p>

              Mascota: <strong>
                {citaAccion.mascota || 'Sin nombre'}
              </strong>

              <br />

              Estado actual: {estadoDe(citaAccion)}.

            </p>


            <div className="admin-citas-confirmacion-botones">

              <button
                type="button"
                className="admin-citas-btn-secundario"
                onClick={() =>
                  setConfirmacion(null)
                }
              >
                Volver
              </button>

              <button
                type="button"
                className={
                  `admin-citas-btn-confirmar ${
                    confirmacion.nuevoEstado === 'Cancelada'
                      ? 'admin-citas-btn-confirmar--cancelar'
                      : ''
                  }`
                }
                onClick={guardarEstado}
              >

                Sí, {textoAccion(
                  confirmacion.nuevoEstado
                )}

              </button>

            </div>

          </section>

        </div>

      )}

    </div>

  )
}