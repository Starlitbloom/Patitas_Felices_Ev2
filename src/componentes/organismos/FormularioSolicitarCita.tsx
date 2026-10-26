/* =========================================================
   PATITAS FELICES - SOLICITAR CITA 
   formulario con catálogo y médicos compatibles.

   Se conecta con catalogoCitasService.ts y reutiliza
   los veterinarios creados por el equipo.
  
========================================================= */

import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'

import {
  crearCita,
  fechaLocalHoy,
  HORARIOS_CITAS,
  horasOcupadas
} from '../../services/citasService'

import {
  obtenerVeterinarioPorId
} from '../../services/veterinariosService'

import {
  agruparServiciosCita,
  citaCompatibleConCatalogo,
  obtenerEspecieCita,
  obtenerServicioCita,
  profesionalPorConfirmar
} from '../../services/catalogoCitasService'

import SelectorVeterinarioCita from './SelectorVeterinarioCita'

import type { Veterinario } from '../../types/veterinario'


/* =========================================================
   1. TIPOS DE DATOS DEL FORMULARIO
========================================================= */

type OtraEspecie = '' | 'Ave' | 'Conejo'

type UnidadEdad = 'meses' | 'anios'

interface DatosCita {
  nombreDueno: string
  correo: string
  telefono: string

  nombreMascota: string
  edadMascota: string
  unidadEdad: UnidadEdad

  tipoMascota: string
  otraEspecie: OtraEspecie

  servicio: string
  veterinarioId: number | null

  fecha: string
  hora: string
  motivo: string

  confirmarDatos: boolean
}

type Campo = keyof DatosCita

type ErroresCita = Partial<Record<Campo, string>>


/* =========================================================
   2. CAMPOS QUE DEBEMOS VALIDAR
========================================================= */

const CAMPOS: Campo[] = [
  'nombreDueno',
  'correo',
  'telefono',
  'nombreMascota',
  'edadMascota',
  'unidadEdad',
  'tipoMascota',
  'otraEspecie',
  'servicio',
  'veterinarioId',
  'fecha',
  'hora',
  'motivo',
  'confirmarDatos'
]


/* =========================================================
   3. OPCIONES DE MASCOTAS
========================================================= */

const MASCOTAS = [
  {
    valor: 'Perro',
    titulo: 'Perro',
    detalle: 'Nuestro mejor amigo',
    imagen: 'icono-perro.png'
  },
  {
    valor: 'Gato',
    titulo: 'Gato',
    detalle: 'Curioso y especial',
    imagen: 'icono-gato.png'
  },
  {
    valor: 'Otro',
    titulo: 'Otro',
    detalle: 'Otra mascota',
    imagen: 'icono-otro.png'
  }
]


/* =========================================================
   4. DÍAS DE LA SEMANA Y NOMBRES VÁLIDOS
========================================================= */

const DIAS = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado'
]

const NOMBRE_VALIDO =
  /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:[ '-][A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*$/


/* =========================================================
   5. VALIDAR FORMATO DE FECHA
========================================================= */

function convertirFecha(fecha: string): Date | null {

  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return null
  }

  const [anio, mes, dia] = fecha.split('-').map(Number)

  const objeto = new Date(anio, mes - 1, dia)

  return (
    objeto.getFullYear() === anio &&
    objeto.getMonth() === mes - 1 &&
    objeto.getDate() === dia
  )
    ? objeto
    : null
}


/* =========================================================
   6. COMPROBAR DÍA DEL VETERINARIO
========================================================= */

function atiendeDia(
  medico: Veterinario | null,
  fecha: string
): boolean {

  const dia = convertirFecha(fecha)

  return Boolean(
    medico &&
    dia &&
    medico.dias.includes(DIAS[dia.getDay()])
  )
}


/* =========================================================
   7. COMPROBAR HORARIO DEL VETERINARIO
========================================================= */

function atiendeHora(
  medico: Veterinario | null,
  hora: string
): boolean {

  if (!medico || !hora) {
    return false
  }

  const rango = medico.horario.match(
    /^(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})$/
  )

  return Boolean(
    rango &&
    hora >= rango[1] &&
    hora < rango[2]
  )
}


/* =========================================================
   8. EVITAR CITAS EN HORAS PASADAS
========================================================= */

function esFutura(
  fecha: string,
  hora: string
): boolean {

  if (!hora || !fecha) {
    return false
  }

  if (fecha !== fechaLocalHoy()) {
    return fecha > fechaLocalHoy()
  }

  const ahora = new Date()

  const [h, m] = hora.split(':').map(Number)

  return (
    h * 60 + m >
    ahora.getHours() * 60 + ahora.getMinutes()
  )
}


/* =========================================================
   9. FUNCIÓN GENERAL DE VALIDACIÓN
========================================================= */

function validar(
  campo: Campo,
  datos: DatosCita,
  ocupadas: string[]
): string {

  /* Obtenemos la especie desde el catálogo. */
  const especie = obtenerEspecieCita(
    datos.tipoMascota,
    datos.otraEspecie
  )

  /* Consultamos el veterinario seleccionado. */
  const medico =
    datos.veterinarioId == null
      ? null
      : obtenerVeterinarioPorId(datos.veterinarioId)


  switch (campo) {

    /* -----------------------------------------
       Nombre del dueño.
    ----------------------------------------- */

    case 'nombreDueno': {

      const nombre = datos.nombreDueno.trim()

      if (nombre.length < 3 || nombre.length > 60) {
        return 'Ingresa tu nombre entre 3 y 60 caracteres.'
      }

      return NOMBRE_VALIDO.test(nombre)
        ? ''
        : 'El nombre solo puede contener letras y espacios.'
    }


    /* -----------------------------------------
       Correo electrónico.
    ----------------------------------------- */

    case 'correo':

      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        datos.correo.trim()
      )
        ? ''
        : 'Ingresa un correo válido.'


    /* -----------------------------------------
       Teléfono celular chileno.
    ----------------------------------------- */

    case 'telefono':

      return /^(?:\+?56)?9\d{8}$/.test(
        datos.telefono.replace(/[\s-]/g, '')
      )
        ? ''
        : 'Ingresa un celular chileno válido. Ej.: +56 9 1234 5678.'


    /* -----------------------------------------
       Nombre de la mascota.
    ----------------------------------------- */

    case 'nombreMascota': {

      const nombre = datos.nombreMascota.trim()

      if (nombre.length < 2 || nombre.length > 40) {
        return 'El nombre de la mascota debe tener entre 2 y 40 caracteres.'
      }

      return NOMBRE_VALIDO.test(nombre)
        ? ''
        : 'El nombre de la mascota debe contener letras, no números.'
    }


    /* -----------------------------------------
       Unidad de la edad.
    ----------------------------------------- */

    case 'unidadEdad':

      return ['meses', 'anios'].includes(
        datos.unidadEdad
      )
        ? ''
        : 'Elige meses o años.'


    /* -----------------------------------------
       Edad de la mascota.
    ----------------------------------------- */

    case 'edadMascota': {

      const edad = Number(datos.edadMascota)

      if (!datos.edadMascota.trim()) {
        return 'Ingresa la edad de tu mascota.'
      }

      if (!Number.isInteger(edad)) {
        return 'La edad debe ser un número entero.'
      }

      if (datos.unidadEdad === 'meses') {

        return edad >= 1 && edad <= 11
          ? ''
          : 'Ingresa entre 1 y 11 meses.'
      }

      return edad >= 1 && edad <= 30
        ? ''
        : 'Ingresa entre 1 y 30 años.'
    }


    /* -----------------------------------------
       Tipo de mascota.
    ----------------------------------------- */

    case 'tipoMascota':

      return ['Perro', 'Gato', 'Otro'].includes(
        datos.tipoMascota
      )
        ? ''
        : 'Selecciona el tipo de mascota.'


    /* -----------------------------------------
       Ave o Conejo.
    ----------------------------------------- */

    case 'otraEspecie':

      return (
        datos.tipoMascota !== 'Otro' ||
        ['Ave', 'Conejo'].includes(datos.otraEspecie)
      )
        ? ''
        : 'Selecciona Ave o Conejo.'


    /* -----------------------------------------
       VALIDAR SERVICIO POR ESPECIE
    ----------------------------------------- */

    case 'servicio': {

      if (!especie) {
        return 'Primero selecciona la especie de tu mascota.'
      }

      const servicio = obtenerServicioCita(
        datos.servicio
      )

      if (!servicio) {
        return 'Selecciona un servicio veterinario.'
      }

      return servicio.especies.includes(especie)
        ? ''
        : 'Ese servicio no corresponde a tu mascota.'
    }
    /* -----------------------------------------
       VALIDAR MÉDICO Y SERVICIO
    ----------------------------------------- */
    case 'veterinarioId': {

      if (!medico || datos.veterinarioId == null) {
        return 'Selecciona un veterinario.'
      }

      if (
        !citaCompatibleConCatalogo(
          especie,
          datos.servicio,
          datos.veterinarioId
        )
      ) {
        return 'Este médico no realiza el servicio seleccionado para esta especie.'
      }

      if (
        datos.fecha &&
        !atiendeDia(medico, datos.fecha)
      ) {
        return `${medico.nombre} no atiende ese día.`
      }

      return ''
    }

    /* -----------------------------------------
       Fecha de la cita.
    ----------------------------------------- */

    case 'fecha': {

      const fecha = convertirFecha(datos.fecha)

      if (!fecha) {
        return 'Selecciona una fecha válida.'
      }

      if (datos.fecha < fechaLocalHoy()) {
        return 'No puedes solicitar una fecha anterior a hoy.'
      }

      if ([0, 6].includes(fecha.getDay())) {
        return 'Selecciona un día de lunes a viernes.'
      }

      if (!medico) {
        return 'Primero selecciona un veterinario.'
      }

      return atiendeDia(medico, datos.fecha)
        ? ''
        : `${medico.nombre} no atiende ese día.`
    }
    /* -----------------------------------------
       Hora de la cita.
    ---------------------------------------- */
    case 'hora': {

      if (
        !datos.hora ||
        !HORARIOS_CITAS.some(
          (hora) => hora === datos.hora
        )
      ) {
        return 'Selecciona una hora válida.'
      }

      if (
        !medico ||
        !atiendeDia(medico, datos.fecha) ||
        !atiendeHora(medico, datos.hora)
      ) {
        return 'El veterinario no atiende en ese día y horario.'
      }

      if (!esFutura(datos.fecha, datos.hora)) {
        return 'Selecciona una hora futura.'
      }

      if (ocupadas.includes(datos.hora)) {
        return 'Ese horario ya está ocupado para este veterinario.'
      }

      return ''
    }
    /* -----------------------------------------
       Motivo de la consulta.
    ----------------------------------------- */
    case 'motivo': {

      const motivo = datos.motivo.trim()

      if (motivo.length < 10) {
        return 'Explica el motivo en al menos 10 caracteres.'
      }

      if (motivo.length > 500) {
        return 'El motivo no puede superar los 500 caracteres.'
      }

      return /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(motivo)
        ? ''
        : 'Escribe una explicación con palabras, no solo símbolos.'
    }

    /* -----------------------------------------
       Confirmación obligatoria.
    ----------------------------------------- */
    case 'confirmarDatos':

      return datos.confirmarDatos
        ? ''
        : 'Confirma que los datos son correctos.'
  }
}
/* =========================================================
   9.1 HORA ELEGIDA DESDE LA AGENDA DEL MÉDICO
   Lee y valida los parámetros de la URL. Si algo no
   corresponde (médico, fecha u hora), se ignora.
========================================================= */
interface PreferenciaAgenda {
  veterinarioId: number
  fecha: string
  hora: string
}

function leerPreferencia(
  parametros: URLSearchParams
): PreferenciaAgenda | null {

  const veterinarioId = Number(parametros.get('veterinario'))
  const fecha = parametros.get('fecha') ?? ''
  const hora = parametros.get('hora') ?? ''

  const medico = obtenerVeterinarioPorId(veterinarioId)

  if (
    !medico ||
    medico.cargo !== 'Médico veterinario' ||
    !convertirFecha(fecha) ||
    fecha < fechaLocalHoy() ||
    !HORARIOS_CITAS.some((opcion) => opcion === hora)
  ) {
    return null
  }

  return { veterinarioId, fecha, hora }
}

/* "2026-10-27" → "martes 27 de octubre" */
function fechaLarga(fecha: string): string {
  const objeto = convertirFecha(fecha)
  return objeto
    ? objeto.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })
    : fecha
}

/* =========================================================
   10. COMPONENTE PRINCIPAL
========================================================= */
export default function FormularioSolicitarCita() {

  const { usuario } = useAuth()

  const formularioRef = useRef<HTMLFormElement>(null)

  /* Hora elegida desde la agenda del médico (/equipo/:id).
     Llega en la URL: /solicitar-cita?veterinario=2&fecha=2026-10-27&hora=10:00 */
  const [parametros] = useSearchParams()
  const [preferencia, setPreferencia] = useState<PreferenciaAgenda | null>(
    () => leerPreferencia(parametros)
  )
  /* Valores iniciales. */
  const [datos, setDatos] = useState<DatosCita>(() => ({

    nombreDueno:
      `${usuario?.nombre ?? ''} ${usuario?.apellidos ?? ''}`.trim(),

    correo: usuario?.correo ?? '',
    telefono: usuario?.telefono ?? '',

    nombreMascota: '',
    edadMascota: '',
    unidadEdad: 'anios',

    tipoMascota: '',
    otraEspecie: '',

    servicio: '',
    veterinarioId: null,

    fecha: '',
    hora: '',
    motivo: '',

    confirmarDatos: false
  }))

  /* Estados para mostrar errores y éxito. */
  const [errores, setErrores] =
    useState<ErroresCita>({})

  const [visitados, setVisitados] =
    useState<Campo[]>([])

  const [enviada, setEnviada] =
    useState(false)

  const [errorGeneral, setErrorGeneral] =
    useState('')


  /* =====================================================
     11. COMPLETAR LOS DATOS DEL USUARIO
  ===================================================== */
  useEffect(() => {

    if (!usuario) {
      return
    }

    setDatos((anterior) => ({

      ...anterior,

      nombreDueno:
        anterior.nombreDueno ||
        `${usuario.nombre} ${usuario.apellidos}`.trim(),

      correo:
        anterior.correo || usuario.correo,

      telefono:
        anterior.telefono || usuario.telefono
    }))

  }, [usuario])
  /* =====================================================
     12. OBTENER ESPECIE SELECCIONADA
     El catálogo diferencia:
     Perro, Gato, Ave y Conejo.
  ===================================================== */
  const especie = obtenerEspecieCita(
    datos.tipoMascota,
    datos.otraEspecie
  )
  /* ====================================================
     FILTRAR SERVICIOS POR ESPECIE
     El catálogo devuelve solamente los que
     corresponden al tipo de mascotas
  ===================================================== */
  const gruposServicio = agruparServiciosCita(
    especie
  )

  /* Información del servicio seleccionado. */
  const servicioActual = obtenerServicioCita(
    datos.servicio
  )


  /* ¿La clínica debe confirmar el profesional? */
  const confirmarProfesional = profesionalPorConfirmar(
    datos.servicio
  )
  /* =====================================================
     14. OBTENER VETERINARIO

     Utilizamos la información real del equipo:
     nombre, especialidad, días y horario.
  ===================================================== */
  const medico =
    datos.veterinarioId == null
      ? null
      : obtenerVeterinarioPorId(
          datos.veterinarioId
        )

 /* =====================================================
     15. REVISAR HORAS OCUPADAS
 ===================================================== */
const ocupadas =
  datos.fecha && datos.veterinarioId != null
    ? horasOcupadas(
        datos.fecha,
        undefined,
        datos.veterinarioId,
        datos.servicio // Duración del servicio, si corresponde
      )
    : []

  /* =====================================================
     16. ACTUALIZAR LOS DATOS DEL FORMULARIO

     Cuando cambian datos:
     - Se actualiza el estado.
     - Se limpian mensajes generales.
     - Se revalidan los campos utilizados.
  ===================================================== */
  function actualizar(nuevos: DatosCita) {

    setDatos(nuevos)

    setErrorGeneral('')

    const nuevasOcupadas =
      nuevos.fecha && nuevos.veterinarioId != null
        ? horasOcupadas(
            nuevos.fecha,
            undefined,
            nuevos.veterinarioId,
            nuevos.servicio // servicio actualizado
          )
        : []

    setErrores((anterior) => {

      const resultado = { ...anterior }

      for (const campo of visitados) {

        resultado[campo] = validar(
          campo,
          nuevos,
          nuevasOcupadas
        )
      }

      return resultado
    })
  }
  /* =====================================================
     17. MANEJAR LOS CAMBIOS
  ===================================================== */
  function manejarCambio(
    evento: ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement |
      HTMLTextAreaElement
    >
  ) {

    if (enviada) {
      return
    }

    const campo = evento.target.name as Campo

    const valor =
      evento.target instanceof HTMLInputElement &&
      evento.target.type === 'checkbox'
        ? evento.target.checked
        : evento.target.value

    const nuevos = {
      ...datos,
      [campo]: valor
    } as DatosCita
    /* -----------------------------------------
       CAMBIO DE TIPO DE MASCOTA
    ----------------------------------------- */
    if (campo === 'tipoMascota') {

      nuevos.otraEspecie = ''

      nuevos.servicio = ''

      nuevos.veterinarioId = null

      nuevos.fecha = ''

      nuevos.hora = ''
    }
    /* -----------------------------------------
       CAMBIO ENTRE AVE Y CONEJO

       Volvemos a seleccionar servicio y médico
       para mantener la compatibilidad.
    ----------------------------------------- */
    if (campo === 'otraEspecie') {

      nuevos.servicio = ''

      nuevos.veterinarioId = null

      nuevos.fecha = ''

      nuevos.hora = ''
    }

    /* -----------------------------------------
       NUEVO: CAMBIO DE SERVICIO
    ----------------------------------------- */
    if (campo === 'servicio') {

      nuevos.veterinarioId = null

      nuevos.fecha = ''

      nuevos.hora = ''

      /* Si viene una hora elegida en la agenda y el médico
         realiza este servicio, se completa automáticamente. */
      if (
        preferencia &&
        citaCompatibleConCatalogo(
          obtenerEspecieCita(nuevos.tipoMascota, nuevos.otraEspecie),
          nuevos.servicio,
          preferencia.veterinarioId
        )
      ) {
        nuevos.veterinarioId = preferencia.veterinarioId
        nuevos.fecha = preferencia.fecha
        nuevos.hora = preferencia.hora
        aplicarPreferencia(nuevos)
        return
      }
    }


    /* Al cambiar la fecha se borra la hora. */
    if (campo === 'fecha') {
      nuevos.hora = ''
    }


    /* Evita confundir 5 meses con 5 años. */
    if (campo === 'unidadEdad') {
      nuevos.edadMascota = ''
    }


    actualizar(nuevos)
  }
  /* =====================================================
     17.1 APLICAR LA HORA ELEGIDA EN LA AGENDA
     Guarda los datos y valida de inmediato médico, fecha
     y hora (por si el bloque se ocupó mientras tanto).
  ===================================================== */
  function aplicarPreferencia(nuevos: DatosCita) {

    actualizar(nuevos)

    const camposAgenda: Campo[] = ['veterinarioId', 'fecha', 'hora']

    const ocupadasAgenda =
      nuevos.veterinarioId != null
        ? horasOcupadas(nuevos.fecha, undefined, nuevos.veterinarioId, nuevos.servicio)
        : []

    setVisitados((anteriores) => [
      ...anteriores,
      ...camposAgenda.filter((campo) => !anteriores.includes(campo))
    ])

    setErrores((anteriores) => {
      const resultado = { ...anteriores }
      for (const campo of camposAgenda) {
        resultado[campo] = validar(campo, nuevos, ocupadasAgenda)
      }
      return resultado
    })
  }

  /* Médico de la hora elegida (para el aviso) y si calza con el servicio actual. */
  const medicoPreferido = preferencia
    ? obtenerVeterinarioPorId(preferencia.veterinarioId)
    : null

  const preferenciaNoCalza = Boolean(
    preferencia &&
    datos.servicio &&
    !citaCompatibleConCatalogo(especie, datos.servicio, preferencia.veterinarioId)
  )

  /* =====================================================
     18. SELECCIONAR VETERINARIO
     Guarda el ID del veterinario elegido.
  ===================================================== */
  function seleccionarVeterinario(id: number) {

    if (enviada) {
      return
    }

    const nuevos: DatosCita = {

      ...datos,

      veterinarioId: id,

      fecha: '',

      hora: ''
    }

    actualizar(nuevos)

    setVisitados((anteriores) =>
      anteriores.includes('veterinarioId')
        ? anteriores
        : [...anteriores, 'veterinarioId']
    )

    setErrores((anteriores) => ({

      ...anteriores,

      veterinarioId: validar(
        'veterinarioId',
        nuevos,
        []
      )
    }))
  }

  /* =====================================================
     19. VALIDAR CUANDO SALIMOS DE UN CAMPO                                                       
  ===================================================== */
  function manejarSalida(campo: Campo) {

    if (enviada) {
      return
    }

    setVisitados((anteriores) =>
      anteriores.includes(campo)
        ? anteriores
        : [...anteriores, campo]
    )

    setErrores((anteriores) => ({

      ...anteriores,

      [campo]: validar(
        campo,
        datos,
        ocupadas
      )
    }))
  }

  /* =====================================================
     20. MOSTRAR ERRORES BAJO LOS CAMPOS
  ===================================================== */
  function errorDe(campo: Campo) {

    return errores[campo] ? (

      <small
        className="mensaje-error"
        role="alert"
      >
        {errores[campo]}
      </small>

    ) : null
  }

  /* =====================================================
     21. GUARDAR LA CITA

     Revisamos:
     - Usuario conectado.
     - Datos del dueño.
     - Nombre y edad de la mascota.
     - Especie válida.
     - Servicio compatible.
     - Veterinario compatible.
     - Fecha y hora disponibles.
     - Motivo de consulta.
     - Confirmación final.
  ===================================================== */
  function enviar(
    evento: FormEvent<HTMLFormElement>
  ) {

    evento.preventDefault()

    if (enviada) {
      return
    }

    if (!usuario) {

      setErrorGeneral(
        'Inicia sesión para solicitar una cita.'
      )

      return
    }
    /* -----------------------------------------
       Actualizar disponibilidad antes de guardar.
    ----------------------------------------- */
    const actuales =
      datos.fecha && datos.veterinarioId != null
        ? horasOcupadas(
            datos.fecha,
            undefined,
            datos.veterinarioId,
            datos.servicio //comprueba la duración
          )
        : []
    /* -----------------------------------------
       Validar todos los campos.
    ----------------------------------------- */
    const nuevosErrores: ErroresCita = {}

    for (const campo of CAMPOS) {

      const mensaje = validar(
        campo,
        datos,
        actuales
      )

      if (mensaje) {
        nuevosErrores[campo] = mensaje
      }
    }

    setErrores(nuevosErrores)

    setVisitados(CAMPOS)
    /* -----------------------------------------
       Si hay errores, no guardamos la cita.
    ----------------------------------------- */
    const primerError = CAMPOS.find(
      (campo) => Boolean(nuevosErrores[campo])
    )

    if (primerError) {

      setErrorGeneral(
        'Revisa los campos marcados antes de continuar.'
      )

      formularioRef.current
        ?.querySelector<HTMLElement>(
          `[name="${primerError}"]`
        )
        ?.focus()

      return
    }
    /* -----------------------------------------
       Confirmar que existe un médico válido.
    ----------------------------------------- */
    if (!medico || datos.veterinarioId == null) {

      setErrorGeneral(
        'Selecciona un médico compatible con el servicio.'
      )

      return
    }

    /* -----------------------------------------
       CONVERTIR EDAD A AÑOS
    ----------------------------------------- */
    const edadEnAnios =
      datos.unidadEdad === 'meses'
        ? Number(datos.edadMascota) / 12
        : Number(datos.edadMascota)
    /* -----------------------------------------
       REGISTRAR EN EL SERVICIO DE CITAS

       Se guarda:
       - Información del usuario.
       - Datos de la mascota.
       - Servicio elegido.
       - Veterinario.
       - Fecha y hora.
       - Motivo.
    ----------------------------------------- */
    const resultado = crearCita({

      correoUsuario: usuario.correo,

      nombreUsuario:
        `${usuario.nombre} ${usuario.apellidos}`.trim(),

      dueno: datos.nombreDueno.trim(),

      propietario: datos.nombreDueno.trim(),

      correo: datos.correo.trim(),

      telefono: datos.telefono.trim(),

      mascota: datos.nombreMascota.trim(),

      tipoMascota: datos.tipoMascota,

      otraEspecie: datos.otraEspecie,

      edadMascota: edadEnAnios,

      veterinarioId: datos.veterinarioId,

      veterinarioNombre: medico.nombre,

      servicio: datos.servicio,

      fecha: datos.fecha,

      hora: datos.hora,

      motivo: datos.motivo.trim()
    })

    /* Si el servicio detecta un error, lo mostramos. */
    if (!resultado.ok) {

      setErrorGeneral(resultado.mensaje)

      return
    }
    /* Confirmamos que la solicitud fue guardada. */
    setErrores({})

    setErrorGeneral('')

    setEnviada(true)
  }
  /* =====================================================
     22. INTERFAZ DEL FORMULARIO
  ===================================================== */
  return (

    <section className="seccion-solicitar-cita">

      <div className="contenedor">
        {/* =========================================
            ENCABEZADO
        ========================================= */}
        <div className="encabezado-formulario-cita">

          <span>Solicitud de atención</span>

          <h2>Cuéntanos sobre tu mascota</h2>

          <p>
            Completa los siguientes pasos
            para solicitar una cita.
          </p>

        </div>
        {/* =========================================
            INDICADOR DE LOS TRES PASOS
        ========================================= */}
        <div
          className="indicador-pasos"
          aria-label="Pasos de la solicitud"
        >

          <div className="paso-indicador">

            <span>1</span>

            <div>
              <strong>Tus datos</strong>
              <small>Información de contacto</small>
            </div>

          </div>

          <div className="linea-paso" />

          <div className="paso-indicador">

            <span className="paso-rosa">2</span>

            <div>
              <strong>Tu mascota</strong>
              <small>Cuéntanos sobre ella</small>
            </div>

          </div>

          <div className="linea-paso" />

          <div className="paso-indicador">

            <span className="paso-morado">3</span>

            <div>
              <strong>La cita</strong>
              <small>Fecha y atención</small>
            </div>

          </div>

        </div>
        {/* =========================================
            AVISO DE SESIÓN
        ========================================= */}
        <div className="aviso-sesion">

          <div
            className="aviso-sesion-icono"
            aria-hidden="true"
          >
            🔒
          </div>

          <div className="aviso-sesion-texto">

            <strong>
              Tu solicitud quedará vinculada a tu cuenta
            </strong>

            <p>
              Podrás consultar su estado desde «Mis citas».
            </p>

          </div>

          <span className="aviso-proximamente">
            Sesión activa
          </span>

        </div>
        {/* =========================================
            HORA ELEGIDA DESDE LA AGENDA DEL MÉDICO
        ========================================= */}
        {preferencia && medicoPreferido && !enviada && (
          <div
            className={`cita-preseleccion ${preferenciaNoCalza ? 'cita-preseleccion--aviso' : ''}`}
            role="status"
          >
            <strong>
              📅 Hora elegida: {medicoPreferido.nombre} · {fechaLarga(preferencia.fecha)} · {preferencia.hora} hrs
            </strong>
            <p>
              {preferenciaNoCalza
                ? `${medicoPreferido.nombre} no realiza el servicio elegido para esta especie. Elige otro profesional en el paso 3 o cambia el servicio.`
                : 'Completa tus datos, los de tu mascota y el servicio: el médico, la fecha y la hora se completarán solos.'}
            </p>
            <button
              type="button"
              className="btn btn-link btn-sm p-0 mt-1"
              onClick={() => setPreferencia(null)}
            >
              Quitar esta hora y elegir otra
            </button>
          </div>
        )}
        {/* =========================================
            FORMULARIO
        ========================================= */}
        <form
          className="formulario-cita"
          ref={formularioRef}
          onSubmit={enviar}
          noValidate
        >
          {/* =====================================
              PASO 1: DATOS DEL DUEÑO
          ===================================== */}
          <section className="bloque-formulario bloque-celeste">

            <div className="titulo-bloque">

              <span className="numero-paso">1</span>

              <div>
                <h3>Datos del dueño</h3>
                <p>¿Con quién debemos comunicarnos?</p>
              </div>

            </div>


            <div className="grid-campos">


              {/* Nombre completo */}
              <div className="grupo-campo">

                <label htmlFor="nombreDueno">
                  Nombre completo *
                </label>

                <input
                  id="nombreDueno"
                  name="nombreDueno"
                  type="text"
                  maxLength={60}
                  autoComplete="name"
                  placeholder="Ej.: Camila González"
                  value={datos.nombreDueno}
                  onChange={manejarCambio}
                  onBlur={() =>
                    manejarSalida('nombreDueno')
                  }
                  aria-invalid={!!errores.nombreDueno}
                />

                {errorDe('nombreDueno')}

              </div>


              {/* Correo electrónico */}
              <div className="grupo-campo">

                <label htmlFor="correoCita">
                  Correo electrónico *
                </label>

                <input
                  id="correoCita"
                  name="correo"
                  type="email"
                  autoComplete="email"
                  placeholder="correo@ejemplo.cl"
                  value={datos.correo}
                  onChange={manejarCambio}
                  onBlur={() =>
                    manejarSalida('correo')
                  }
                  aria-invalid={!!errores.correo}
                />

                {errorDe('correo')}

              </div>


              {/* Teléfono */}
              <div className="grupo-campo">

                <label htmlFor="telefonoCita">
                  Teléfono *
                </label>

                <input
                  id="telefonoCita"
                  name="telefono"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+56 9 1234 5678"
                  value={datos.telefono}
                  onChange={manejarCambio}
                  onBlur={() =>
                    manejarSalida('telefono')
                  }
                  aria-invalid={!!errores.telefono}
                />

                {errorDe('telefono')}

              </div>

            </div>

          </section>
          {/* =====================================
              PASO 2: DATOS DE LA MASCOTA
          ===================================== */}
          <section className="bloque-formulario bloque-rosa">

            <div className="titulo-bloque">

              <span className="numero-paso numero-paso-rosa">
                2
              </span>

              <div>
                <h3>Datos de la mascota</h3>
                <p>Queremos conocer a tu compañero.</p>
              </div>

            </div>


            <div className="grid-mascota">

              {/* Nombre de la mascota con validación */}
              <div className="grupo-campo">

                <label htmlFor="nombreMascota">
                  Nombre de la mascota *
                </label>

                <input
                  id="nombreMascota"
                  name="nombreMascota"
                  type="text"
                  minLength={2}
                  maxLength={40}
                  placeholder="Ej.: Luna"
                  value={datos.nombreMascota}
                  onChange={manejarCambio}
                  onBlur={() =>
                    manejarSalida('nombreMascota')
                  }
                  aria-invalid={!!errores.nombreMascota}
                />

                <small
                  style={{
                    color: '#6F6F78',
                    marginTop: '6px'
                  }}
                >
                  Entre 2 y 40 caracteres, sin números.
                </small>

                {errorDe('nombreMascota')}

              </div>
              {/* Edad en meses o años */}
              <div className="grupo-campo">

                <label htmlFor="edadMascota">
                  Edad aproximada *
                </label>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'minmax(0,1fr) minmax(105px,120px)',
                    gap: '10px'
                  }}
                >

                  <input
                    id="edadMascota"
                    name="edadMascota"
                    type="number"
                    min={1}
                    max={
                      datos.unidadEdad === 'meses'
                        ? 11
                        : 30
                    }
                    step={1}
                    placeholder="Ej.: 5"
                    value={datos.edadMascota}
                    onChange={manejarCambio}
                    onBlur={() =>
                      manejarSalida('edadMascota')
                    }
                    aria-invalid={!!errores.edadMascota}
                  />

                  <select
                    id="unidadEdadMascota"
                    name="unidadEdad"
                    aria-label="Unidad de edad"
                    value={datos.unidadEdad}
                    onChange={manejarCambio}
                  >

                    <option value="meses">
                      Meses
                    </option>

                    <option value="anios">
                      Años
                    </option>

                  </select>

                </div>

                <small
                  style={{
                    color: '#6F6F78',
                    marginTop: '6px'
                  }}
                >
                  {datos.unidadEdad === 'meses'
                    ? 'Entre 1 y 11 meses.'
                    : 'Entre 1 y 30 años.'}
                </small>

                {errorDe('edadMascota')}

              </div>

            </div>
            {/* =====================================
                SELECCIÓN DEL TIPO DE MASCOTA
            ===================================== */}
            <div className="grupo-opciones">

              <div
                className="titulo-opciones"
                id="tipoMascotaTitulo"
              >
                Tipo de mascota *
              </div>

              <div
                className="opciones-mascota"
                role="radiogroup"
                aria-labelledby="tipoMascotaTitulo"
              >

                {MASCOTAS.map((mascota) => (

                  <label
                    className="tarjeta-opcion"
                    key={mascota.valor}
                  >

                    <input
                      type="radio"
                      name="tipoMascota"
                      value={mascota.valor}
                      checked={
                        datos.tipoMascota === mascota.valor
                      }
                      onChange={manejarCambio}
                      onBlur={() =>
                        manejarSalida('tipoMascota')
                      }
                    />

                    <div className="contenedor-icono-mascota">

                      <img
                        src={`/img/${mascota.imagen}`}
                        alt={mascota.titulo}
                        className="imagen-tipo-mascota"
                      />

                    </div>

                    <strong>
                      {mascota.titulo}
                    </strong>

                    <small>
                      {mascota.detalle}
                    </small>

                  </label>

                ))}

              </div>

              {errorDe('tipoMascota')}

            </div>
            {/* =====================================
                OPCIÓN AVE O CONEJO
            ===================================== */}
            {datos.tipoMascota === 'Otro' && (

              <div className="grupo-campo campo-otra-especie">

                <label htmlFor="otraEspecieCita">
                  ¿Qué tipo de mascota tienes? *
                </label>

                <select
                  id="otraEspecieCita"
                  name="otraEspecie"
                  value={datos.otraEspecie}
                  onChange={manejarCambio}
                  onBlur={() =>
                    manejarSalida('otraEspecie')
                  }
                  aria-invalid={!!errores.otraEspecie}
                >

                  <option value="">
                    Selecciona una especie
                  </option>

                  <option value="Ave">
                    Ave
                  </option>

                  <option value="Conejo">
                    Conejo
                  </option>

                </select>

                {errorDe('otraEspecie')}

              </div>

            )}

          </section>
          {/* =====================================
              PASO 3: INFORMACIÓN DE LA CITA
          ==================================== */}
          <section className="bloque-formulario bloque-morado">

            <div className="titulo-bloque">

              <span className="numero-paso numero-paso-morado">
                3
              </span>

              <div>

                <h3>Información de la cita</h3>

                <p>
                  Selecciona atención, profesional,
                  fecha y horario.
                </p>

              </div>

            </div>
            {/* =====================================
                SERVICIOS POR ESPECIE
            ===================================== */}
            <div className="grupo-opciones">

              <label
                htmlFor="servicioCita"
                className="titulo-opciones"
              >
                ¿Qué atención necesitas? *
              </label>

              <p className="ayuda-servicio-cita">
                Primero elige la especie de tu mascota.
                Solo aparecerán los servicios compatibles.
              </p>

              <div className="grupo-campo selector-servicio-cita">

                <select
                  id="servicioCita"
                  name="servicio"
                  value={datos.servicio}
                  onChange={manejarCambio}
                  onBlur={() =>
                    manejarSalida('servicio')
                  }
                  disabled={!especie}
                  aria-invalid={!!errores.servicio}
                >

                  <option value="">

                    {especie
                      ? 'Selecciona un servicio'
                      : 'Primero selecciona tu mascota'}

                  </option>


                  {/* Recorremos los grupos del catálogo. */}
                  {Object.entries(gruposServicio).map(
                    ([grupo, servicios]) => (

                      <optgroup
                        key={grupo}
                        label={grupo}
                      >

                        {/* Solo servicios compatibles. */}
                        {servicios.map((servicio) => (

                          <option
                            key={servicio.codigo}
                            value={servicio.nombre}
                          >
                            {servicio.nombre}
                          </option>

                        ))}

                      </optgroup>

                    )
                  )}

                </select>

                {errorDe('servicio')}

              </div>

            </div>
            {/* =====================================
                SELECTOR DE VETERINARIOS
                El selector filtra automáticamente
                los profesionales compatibles.
            ===================================== */}
            <SelectorVeterinarioCita
              tipoMascota={datos.tipoMascota}
              otraEspecie={datos.otraEspecie}
              servicio={datos.servicio}
              veterinarioId={datos.veterinarioId}
              onSeleccionar={seleccionarVeterinario}
              error={errores.veterinarioId}
            />
            {/* =====================================
                FECHA Y HORA
            ===================================== */}
            <div className="grid-fecha">


              {/* Fecha */}
              <div className="grupo-campo">

                <label htmlFor="fechaCita">
                  Fecha *
                </label>

                <input
                  id="fechaCita"
                  name="fecha"
                  type="date"
                  min={fechaLocalHoy()}
                  value={datos.fecha}
                  onChange={manejarCambio}
                  onBlur={() =>
                    manejarSalida('fecha')
                  }
                  disabled={!medico}
                  aria-invalid={!!errores.fecha}
                />

                {errorDe('fecha')}

              </div>

              {/* Hora */}
              <div className="grupo-campo">

                <label htmlFor="horaCita">
                  Hora *
                </label>

                <select
                  id="horaCita"
                  name="hora"
                  value={datos.hora}
                  onChange={manejarCambio}
                  onBlur={() =>
                    manejarSalida('hora')
                  }
                  disabled={
                    !medico ||
                    !atiendeDia(medico, datos.fecha)
                  }
                  aria-invalid={!!errores.hora}
                >
                  <option value="">
                    Selecciona un horario
                  </option>

                  {/* Generamos las horas permitidas. */}
                  {HORARIOS_CITAS.map((hora) => {

                    const fuera = !atiendeHora(
                      medico,
                      hora
                    )

                    const ocupada = ocupadas.includes(
                      hora
                    )

                    const pasada = !esFutura(
                      datos.fecha,
                      hora
                    )

                    return (

                      <option
                        key={hora}
                        value={hora}
                        disabled={
                          fuera ||
                          ocupada ||
                          pasada
                        }
                      >

                        {hora}

                        {fuera
                          ? ' (fuera de jornada)'
                          : ocupada
                            ? ' (no disponible)'
                            : pasada
                              ? ' (ya pasó)'
                              : ''}

                      </option>

                    )
                  })}

                </select>

                {errorDe('hora')}

              </div>

            </div>
            {/* ====================================
                INFORMACIÓN DEL HORARIO DEL MÉDICO
            ===================================== */}
            {medico ? (

              <p className="aviso-horario-veterinario">

                <strong>
                  Horario de {medico.nombre}:
                </strong>

                {' '}

                {medico.dias.join(', ')}

                {' · '}

                {medico.horario} hrs.

              </p>

            ) : (

              <p className="aviso-horario-veterinario">

                Selecciona un servicio y un veterinario
                para consultar sus horarios.

              </p>

            )}
            {/* Si el médico no trabaja ese día. */}
            {medico &&
              datos.fecha &&
              !atiendeDia(medico, datos.fecha) && (

                <p
                  className="mensaje-error"
                  role="alert"
                >

                  {medico.nombre} no atiende ese día.
                  Selecciona otra fecha.

                </p>

              )}
            {/* ====================================
                MOTIVO DE CONSULTA
            ===================================== */}
            <div className="grupo-campo motivo-consulta">

              <label htmlFor="motivoCita">
                Cuéntanos el motivo de la consulta *
              </label>

              <textarea
                id="motivoCita"
                name="motivo"
                minLength={10}
                maxLength={500}
                required
                value={datos.motivo}
                onChange={manejarCambio}
                onBlur={() =>
                  manejarSalida('motivo')
                }
                placeholder="Ej.: Mi gatito lleva dos días sin querer comer."
                aria-invalid={!!errores.motivo}
              />

              {errorDe('motivo')}

              <div className="detalle-textarea">

                <span>Mínimo 10 caracteres</span>

                <span>
                  {datos.motivo.length} / 500
                </span>

              </div>

            </div>

          </section>
          {/* =====================================
              PASO FINAL: CONFIRMAR SOLICITUD
          ===================================== */}
          <section className="bloque-confirmacion">

            <div className="confirmacion-superior">

              <div>

                <span className="etiqueta-final">
                  Último paso
                </span>

                <h3>Revisa tu solicitud</h3>

                <p>
                  Verifica que todos los datos
                  sean correctos.
                </p>

              </div>

              <div className="estado-solicitud">

                <span className="punto-estado" />

                Pendiente

              </div>

            </div>
            {/* =====================================
                RESUMEN DE LA MASCOTA
            ===================================== */}
            {datos.nombreMascota && (

              <div className="resumen-veterinario-elegido">

                <strong>
                  Mascota:
                </strong>

                {' '}

                {datos.nombreMascota.trim()}

                {datos.edadMascota && (

                  ` · ${datos.edadMascota} ${
                    datos.unidadEdad === 'meses'
                      ? 'mes(es)'
                      : 'año(s)'
                  }`

                )}

              </div>

            )}
            {/* =====================================
                NUEVO: RESUMEN DEL SERVICIO
            ===================================== */}
            {servicioActual && (

              <div className="resumen-veterinario-elegido">

                <strong>
                  Servicio:
                </strong>

                {' '}

                {servicioActual.nombre}

              </div>

            )}
            {/* =====================================
                RESUMEN DEL VETERINARIO
            ===================================== */}
            {medico && (

              <div className="resumen-veterinario-elegido">

                <strong>
                  Veterinario:
                </strong>

                {' '}

                {medico.nombre}

                {' · '}

                {medico.area}


                {confirmarProfesional && (

                  <p>
                    La clínica debe confirmar quién
                    realizará este procedimiento.
                  </p>

                )}

              </div>

            )}
            {/* =====================================
                CASILLA DE CONFIRMACIÓN
            ===================================== */}
            <div className="confirmacion-formulario">

              <label className="check-confirmacion">

                <input
                  type="checkbox"
                  name="confirmarDatos"
                  checked={datos.confirmarDatos}
                  onChange={manejarCambio}
                  onBlur={() =>
                    manejarSalida('confirmarDatos')
                  }
                  aria-invalid={!!errores.confirmarDatos}
                />

                <span>
                  Confirmo que los datos ingresados
                  son correctos.
                </span>

              </label>

              {errorDe('confirmarDatos')}

            </div>
            {/* =====================================
                BOTÓN SOLICITAR CITA
            ==================================== */}
            <div className="acciones-formulario-cita">

              <button
                type="submit"
                className="boton-solicitar-cita"
                disabled={enviada}
              >

                {enviada
                  ? 'Solicitud enviada ✓'
                  : 'Solicitar cita →'}

              </button>

              <p>
                La solicitud se guardará como{' '}
                <strong>Pendiente</strong>,
                hasta que la clínica la confirme.
              </p>

            </div>

            {/* Error general del formulario. */}
            {errorGeneral && (

              <p
                className="mensaje-error"
                role="alert"
              >
                {errorGeneral}
              </p>

            )}
            {/* =====================================
                MENSAJE DE SOLICITUD REGISTRADA
            ===================================== */}
            {enviada && (

              <div
                className="mensaje-exito-cita mostrar"
                role="status"
                aria-live="polite"
              >

                <div className="mensaje-exito-icono">
                  ✓
                </div>

                <div className="mensaje-exito-contenido">

                  <h3>¡Solicitud enviada!</h3>

                  <p>

                    La solicitud de{' '}

                    <strong>
                      {datos.nombreMascota}
                    </strong>

                    {' '}para{' '}

                    <strong>
                      {datos.servicio}
                    </strong>

                    {' '}con{' '}

                    <strong>
                      {medico?.nombre}
                    </strong>

                    {' '}quedó{' '}

                    <strong>
                      Pendiente
                    </strong>.

                  </p>

                  <Link
                    to="/mis-citas"
                    className="boton-ver-mis-citas"
                  >
                    Ver mis citas →
                  </Link>

                </div>

              </div>

            )}

          </section>

        </form>

      </div>

    </section>

  )
}