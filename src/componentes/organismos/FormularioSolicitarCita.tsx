
/* =========================================================
   VETERINARIA PATITAS FELICES
   FUNCIONALIDADES:
   1. Datos del dueño.
   2. Datos de la mascota.
   3. Edad en meses o años.
   4. Validación del nombre de la mascota.
   5. Selección de Perro, Gato, Ave o Conejo.
   6. Selección del veterinario compatible.
   7. Servicios veterinarios.
   8. Fecha y hora según la agenda del médico.
   9. Validación del motivo de consulta.
   10. Registro de la cita como Pendiente.
========================================================= */

import { useEffect, useRef, useState } from 'react'

import type {
  ChangeEvent,
  FormEvent
} from 'react'

import { Link } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'

import {
  crearCita,
  fechaLocalHoy,
  HORARIOS_CITAS,
  horasOcupadas,
  SERVICIOS_CITAS
} from '../../services/citasService'

import {
  obtenerVeterinarioPorId
} from '../../services/veterinariosService'

import SelectorVeterinarioCita from './SelectorVeterinarioCita'

import type {
  Especie,
  Veterinario
} from '../../types/veterinario'


/* =========================================================
   1. TIPOS DE DATOS
   unidadEdad:
   - meses: mascotas menores de un año.
   - anios: mascotas de uno o más años.
========================================================= */

type OtraEspecie = '' | 'Ave' | 'Conejo'

type UnidadEdad = 'meses' | 'anios'

interface DatosCita {

  // Información del dueño.
  nombreDueno: string
  correo: string
  telefono: string

  // Información de la mascota.
  nombreMascota: string
  edadMascota: string
  unidadEdad: UnidadEdad
  tipoMascota: string
  otraEspecie: OtraEspecie

  // Veterinario elegido.
  veterinarioId: number | null

  // Información de la cita.
  servicio: string
  fecha: string
  hora: string
  motivo: string

  // Confirmación del formulario.
  confirmarDatos: boolean
}

type Campo = keyof DatosCita

type ErroresCita = Partial<Record<Campo, string>>


/* =========================================================
   2. CAMPOS QUE SE VALIDARÁN AL ENVIAR
========================================================= */

const campos: Campo[] = [
  'nombreDueno',
  'correo',
  'telefono',
  'nombreMascota',
  'edadMascota',
  'unidadEdad',
  'tipoMascota',
  'otraEspecie',
  'veterinarioId',
  'servicio',
  'fecha',
  'hora',
  'motivo',
  'confirmarDatos'
]


/* =========================================================
   3. EXPRESIONES REGULARES
========================================================= */

const regexNombre =
  /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:[ '-][A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*$/

const regexCorreo =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const regexTelefono =
  /^(?:\+?56)?9\d{8}$/


/* =========================================================
   4. DÍAS DE LA SEMANA
========================================================= */

const nombresDias = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado'
]


/* =========================================================
   5. TIPOS DE MASCOTAS
========================================================= */

const tiposMascota = [
  {
    valor: 'Perro',
    titulo: 'Perro',
    detalle: 'Nuestro mejor amigo',
    imagen: 'icono-perro.png',
    color: 'icono-perro'
  },
  {
    valor: 'Gato',
    titulo: 'Gato',
    detalle: 'Curioso y especial',
    imagen: 'icono-gato.png',
    color: 'icono-gato'
  },
  {
    valor: 'Otro',
    titulo: 'Otro',
    detalle: 'Otra mascota',
    imagen: 'icono-otro.png',
    color: 'icono-otro'
  }
]


/* =========================================================
   6. VALIDAR FORMATO DE FECHA
========================================================= */

function fechaCorrecta(
  fecha: string
): Date | null {

  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return null
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
    return null
  }

  return valor
}


/* =========================================================
   7. COMPROBAR DÍA DEL VETERINARIO
========================================================= */

function atiendeEseDia(
  medico: Veterinario | null,
  fecha: string
): boolean {

  const fechaElegida = fechaCorrecta(fecha)

  if (!medico || !fechaElegida) {
    return false
  }

  const nombreDia = nombresDias[
    fechaElegida.getDay()
  ]

  return medico.dias.includes(nombreDia)
}


/* =========================================================
   8. COMPROBAR HORARIO DEL VETERINARIO
========================================================= */

function atiendeEsaHora(
  medico: Veterinario | null,
  hora: string
): boolean {

  if (!medico || !hora) {
    return false
  }

  const rango = medico.horario.match(
    /^(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})$/
  )

  if (!rango) {
    return false
  }

  const inicio = rango[1]
  const fin = rango[2]

  return hora >= inicio && hora < fin
}


/* =========================================================
   9. IMPEDIR RESERVAS EN HORAS PASADAS
========================================================= */

function esHoraFutura(
  fecha: string,
  hora: string
): boolean {

  if (fecha !== fechaLocalHoy()) {
    return true
  }

  const ahora = new Date()

  const [h, m] = hora
    .split(':')
    .map(Number)

  const minutosCita = h * 60 + m

  const minutosActuales =
    ahora.getHours() * 60 +
    ahora.getMinutes()

  return minutosCita > minutosActuales
}

/* =========================================================
   10. IDENTIFICAR ESPECIE
========================================================= */

function obtenerEspecie(
  datos: DatosCita
): Especie | null {

  if (datos.tipoMascota === 'Perro') {
    return 'Perros'
  }

  if (datos.tipoMascota === 'Gato') {
    return 'Gatos'
  }

  if (
    datos.tipoMascota === 'Otro' &&
    datos.otraEspecie === 'Ave'
  ) {
    return 'Aves'
  }

  if (
    datos.tipoMascota === 'Otro' &&
    datos.otraEspecie === 'Conejo'
  ) {
    return 'Conejos'
  }

  return null
}


/* =========================================================
   11. VALIDAR NOMBRE DE LA MASCOTA
========================================================= */

function validarNombreMascota(
  nombreIngresado: string
): string {

  const nombre = nombreIngresado.trim()

  if (!nombre) {
    return 'Debes ingresar el nombre de tu mascota.'
  }

  if (nombre.length < 2) {
    return 'El nombre debe tener al menos 2 caracteres.'
  }

  if (nombre.length > 40) {
    return 'El nombre no puede superar los 40 caracteres.'
  }

  if (!regexNombre.test(nombre)) {
    return 'El nombre solo puede contener letras, espacios y guiones.'
  }

  return ''
}


/* =========================================================
   12.VALIDAR EDAD DE LA MASCOTA
========================================================= */

function validarEdadMascota(
  edadIngresada: string,
  unidadEdad: UnidadEdad
): string {

  const valor = edadIngresada.trim()

  if (!valor) {
    return 'Debes ingresar la edad de tu mascota.'
  }

  const edad = Number(valor)

  if (!Number.isInteger(edad)) {
    return 'La edad debe ser un número entero.'
  }

  if (unidadEdad === 'meses') {

    if (edad < 1 || edad > 11) {
      return 'Ingresa una edad entre 1 y 11 meses.'
    }

    return ''
  }

  if (unidadEdad === 'anios') {

    if (edad < 1 || edad > 30) {
      return 'Ingresa una edad entre 1 y 30 años.'
    }

    return ''
  }

  return 'Selecciona meses o años.'
}


/* =========================================================
   13. VALIDAR MOTIVO DE CONSULTA
========================================================= */

function validarMotivoConsulta(
  textoIngresado: string
): string {

  const motivo = textoIngresado.trim()

  if (!motivo) {
    return 'Debes explicar el motivo de la consulta.'
  }

  if (motivo.length < 10) {
    return 'Escribe al menos 10 caracteres explicando el motivo.'
  }

  if (motivo.length > 500) {
    return 'El motivo no puede superar los 500 caracteres.'
  }

  if (!/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(motivo)) {
    return 'El motivo debe contener una explicación con letras.'
  }

  return ''
}


/* =========================================================
   14. FUNCIÓN GENERAL DE VALIDACIÓN
========================================================= */

function validarCampo(
  campo: Campo,
  datos: DatosCita,
  ocupadas: string[]
): string {

  switch (campo) {

    /* -----------------------------------------
       Nombre del dueño.
    ----------------------------------------- */
    case 'nombreDueno': {

      const nombre = datos.nombreDueno.trim()

      if (!nombre) {
        return 'Debes ingresar tu nombre completo.'
      }

      if (nombre.length < 3 || nombre.length > 60) {
        return 'El nombre debe tener entre 3 y 60 caracteres.'
      }

      return regexNombre.test(nombre)
        ? ''
        : 'El nombre solo puede contener letras.'
    }

    /* -----------------------------------------
       Correo electrónico.
    ----------------------------------------- */
    case 'correo': {

      return regexCorreo.test(datos.correo.trim())
        ? ''
        : 'Ingresa un correo electrónico válido.'
    }

    /* -----------------------------------------
       Teléfono chileno.
    ----------------------------------------- */
    case 'telefono': {

      const telefono = datos.telefono.replace(
        /[\s-]/g,
        ''
      )

      return regexTelefono.test(telefono)
        ? ''
        : 'Ingresa un celular chileno válido. Ej.: +56 9 1234 5678.'
    }

    /* -----------------------------------------
       Nombre de la mascota.

       Utiliza nuestra validación mejorada.
    ----------------------------------------- */
    case 'nombreMascota': {

      return validarNombreMascota(
        datos.nombreMascota
      )
    }

    /* -----------------------------------------
       Edad de la mascota.

       Valida según meses o años.
    ----------------------------------------- */
    case 'edadMascota': {

      return validarEdadMascota(
        datos.edadMascota,
        datos.unidadEdad
      )
    }

    /* -----------------------------------------
       Unidad de la edad.
    ----------------------------------------- */
    case 'unidadEdad': {

      return ['meses', 'anios'].includes(
        datos.unidadEdad
      )
        ? ''
        : 'Selecciona meses o años.'
    }

    /* -----------------------------------------
       Tipo de mascota.
    ----------------------------------------- */
    case 'tipoMascota': {

      return ['Perro', 'Gato', 'Otro'].includes(
        datos.tipoMascota
      )
        ? ''
        : 'Selecciona el tipo de mascota.'
    }

    /* -----------------------------------------
       Ave o Conejo.
    ----------------------------------------- */
    case 'otraEspecie': {

      if (datos.tipoMascota !== 'Otro') {
        return ''
      }

      return ['Ave', 'Conejo'].includes(
        datos.otraEspecie
      )
        ? ''
        : 'Indica si tu mascota es un ave o un conejo.'
    }

    /* -----------------------------------------
       Validar veterinario y especie.
    ----------------------------------------- */
    case 'veterinarioId': {

      const medico =
        datos.veterinarioId == null
          ? null
          : obtenerVeterinarioPorId(
              datos.veterinarioId
            )

      if (
        !medico ||
        medico.cargo !== 'Médico veterinario'
      ) {
        return 'Selecciona un médico veterinario.'
      }

      const especie = obtenerEspecie(datos)

      if (
        !especie ||
        !medico.especies.includes(especie)
      ) {
        return 'Este veterinario no atiende la especie seleccionada.'
      }

      if (
        datos.fecha &&
        !atiendeEseDia(medico, datos.fecha)
      ) {
        return `${medico.nombre} no atiende en la fecha seleccionada.`
      }

      if (
        datos.hora &&
        !atiendeEsaHora(medico, datos.hora)
      ) {
        return `${medico.nombre} no atiende a esa hora.`
      }

      return ''
    }

    /* -----------------------------------------
       Servicio veterinario.
    ----------------------------------------- */
    case 'servicio': {

      const servicios = Object.values(
        SERVICIOS_CITAS
      ).flat()

      return servicios.includes(datos.servicio)
        ? ''
        : 'Selecciona un servicio veterinario.'
    }

    /* -----------------------------------------
       Fecha.
    ----------------------------------------- */
    case 'fecha': {

      const fecha = fechaCorrecta(datos.fecha)

      if (!fecha) {
        return 'Selecciona una fecha válida.'
      }

      if (datos.fecha < fechaLocalHoy()) {
        return 'No puedes reservar una fecha anterior a hoy.'
      }

      if ([0, 6].includes(fecha.getDay())) {
        return 'Selecciona un día de lunes a viernes.'
      }

      const medico =
        datos.veterinarioId == null
          ? null
          : obtenerVeterinarioPorId(
              datos.veterinarioId
            )

      if (
        medico &&
        !atiendeEseDia(medico, datos.fecha)
      ) {
        return `${medico.nombre} no trabaja ese día.`
      }

      return ''
    }

    /* -----------------------------------------
       Hora.
    ----------------------------------------- */
    case 'hora': {

      if (
        !datos.hora ||
        !HORARIOS_CITAS.some(
          (horario) => horario === datos.hora
        )
      ) {
        return 'Selecciona un horario disponible.'
      }

      const medico =
        datos.veterinarioId == null
          ? null
          : obtenerVeterinarioPorId(
              datos.veterinarioId
            )

      if (!medico) {
        return 'Primero selecciona un veterinario.'
      }

      if (
        !atiendeEseDia(medico, datos.fecha) ||
        !atiendeEsaHora(medico, datos.hora)
      ) {
        return 'El veterinario no atiende en ese día u horario.'
      }

      if (!esHoraFutura(datos.fecha, datos.hora)) {
        return 'Selecciona una hora futura.'
      }

      if (ocupadas.includes(datos.hora)) {
        return 'Este veterinario ya tiene una cita a esa hora.'
      }

      return ''
    }

    /* -----------------------------------------
       Motivo de consulta.
    ----------------------------------------- */
    case 'motivo': {

      return validarMotivoConsulta(
        datos.motivo
      )
    }

    /* -----------------------------------------
       Confirmación final.
    ----------------------------------------- */
    case 'confirmarDatos': {

      return datos.confirmarDatos
        ? ''
        : 'Confirma que los datos ingresados son correctos.'
    }
  }
}


/* =========================================================
   15. COMPONENTE PRINCIPAL
========================================================= */

export default function FormularioSolicitarCita() {

  const { usuario } = useAuth()

  const formularioRef = useRef<HTMLFormElement>(null)


  /* -------------------------------------------------------
     Valores iniciales del formulario.
  ------------------------------------------------------- */

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

    veterinarioId: null,

    servicio: '',
    fecha: '',
    hora: '',
    motivo: '',

    confirmarDatos: false
  }))


  /* -------------------------------------------------------
     Estados para validaciones y confirmación.
  ------------------------------------------------------- */

  const [errores, setErrores] =
    useState<ErroresCita>({})

  const [visitados, setVisitados] =
    useState<Campo[]>([])

  const [enviada, setEnviada] =
    useState(false)

  const [errorGeneral, setErrorGeneral] =
    useState('')


  /* -------------------------------------------------------
     Completar datos del dueño.
  ------------------------------------------------------- */

  useEffect(() => {

    if (!usuario) {
      return
    }

    setDatos((anteriores) => ({

      ...anteriores,

      nombreDueno:
        anteriores.nombreDueno ||
        `${usuario.nombre} ${usuario.apellidos}`.trim(),

      correo:
        anteriores.correo || usuario.correo,

      telefono:
        anteriores.telefono || usuario.telefono
    }))

  }, [usuario])


  /* -------------------------------------------------------
     Obtener veterinario seleccionado.
  ------------------------------------------------------- */

  const medico =
    datos.veterinarioId == null
      ? null
      : obtenerVeterinarioPorId(
          datos.veterinarioId
        )


  /* -------------------------------------------------------
     Consultar horas ocupadas por veterinario.
     Cada médico tiene una agenda independiente.
  ------------------------------------------------------- */

  const ocupadas =
    datos.fecha && datos.veterinarioId != null
      ? horasOcupadas(
          datos.fecha,
          undefined,
          datos.veterinarioId
        )
      : []


  /* =====================================================
     16. ACTUALIZAR FORMULARIO

     Cada vez que cambia un dato:
     - Guardamos el valor nuevo.
     - Limpiamos el error general.
     - Volvemos a validar los campos visitados.
  ===================================================== */

  function actualizar(
    nuevos: DatosCita,
    campo: Campo
  ) {

    setDatos(nuevos)
    setErrorGeneral('')

    const nuevasOcupadas =
      nuevos.fecha && nuevos.veterinarioId != null
        ? horasOcupadas(
            nuevos.fecha,
            undefined,
            nuevos.veterinarioId
          )
        : []

    setErrores((anteriores) => {

      const actualizados = { ...anteriores }

      for (const visitado of visitados) {

        actualizados[visitado] = validarCampo(
          visitado,
          nuevos,
          nuevasOcupadas
        )
      }

      // Cambiar la mascota invalida la selección anterior.
      if (
        campo === 'tipoMascota' ||
        campo === 'otraEspecie'
      ) {
        actualizados.veterinarioId = ''
        actualizados.hora = ''
      }

      // Cambiar la fecha obliga a elegir otra hora.
      if (campo === 'fecha') {
        actualizados.hora = ''
      }

      // Cambiar meses/años vuelve a validar la edad.
      if (campo === 'unidadEdad') {
        actualizados.edadMascota = ''
      }

      return actualizados
    })
  }


  /* =====================================================
     17. MANEJAR CAMBIOS
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


    // Si cambia el tipo de mascota,
    // debe elegir nuevamente al veterinario.
    if (campo === 'tipoMascota') {
      nuevos.otraEspecie = ''
      nuevos.veterinarioId = null
      nuevos.hora = ''
    }

    // Si cambia Ave por Conejo o viceversa,
    // también debe elegir otro veterinario.
    if (campo === 'otraEspecie') {
      nuevos.veterinarioId = null
      nuevos.hora = ''
    }

    // Si cambia la fecha, limpiamos la hora anterior.
    if (campo === 'fecha') {
      nuevos.hora = ''
    }

  
    if (campo === 'unidadEdad') {
      nuevos.edadMascota = ''
    }

    actualizar(nuevos, campo)
  }

  /* =====================================================
     18. SELECCIONAR VETERINARIO
  ===================================================== */

  function seleccionarVeterinario(id: number) {

    if (enviada) {
      return
    }

    const nuevos: DatosCita = {
      ...datos,
      veterinarioId: id,
      hora: ''
    }

    actualizar(nuevos, 'veterinarioId')

    setVisitados((anteriores) =>
      anteriores.includes('veterinarioId')
        ? anteriores
        : [...anteriores, 'veterinarioId']
    )

    setErrores((anteriores) => ({
      ...anteriores,

      veterinarioId: validarCampo(
        'veterinarioId',
        nuevos,
        []
      )
    }))
  }
  /* =====================================================
     19. VALIDAR AL SALIR DEL CAMPO
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

      [campo]: validarCampo(
        campo,
        datos,
        ocupadas
      )
    }))
  }

  /* =====================================================
     20. MOSTRAR ERROR DE UN CAMPO
  ===================================================== */

  function mostrarError(campo: Campo) {

    if (!errores[campo]) {
      return null
    }

    return (
      <small
        className="mensaje-error"
        role="alert"
      >
        {errores[campo]}
      </small>
    )
  }

  /* =====================================================
     21. ENVIAR SOLICITUD

     Antes de guardar:
     - Comprobamos que exista una sesión.
     - Validamos todos los campos.
     - Revisamos la disponibilidad del veterinario.
     - Registramos la cita como Pendiente.
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

    // Consultamos nuevamente la agenda.
    const actuales =
      datos.fecha && datos.veterinarioId != null
        ? horasOcupadas(
            datos.fecha,
            undefined,
            datos.veterinarioId
          )
        : []

    // Revisamos todos los campos del formulario.
    const nuevosErrores: ErroresCita = {}

    for (const campo of campos) {

      const mensaje = validarCampo(
        campo,
        datos,
        actuales
      )

      if (mensaje) {
        nuevosErrores[campo] = mensaje
      }
    }

    setErrores(nuevosErrores)
    setVisitados(campos)

    // Si existe un error, no guardamos la cita.
    const primero = campos.find(
      (campo) => Boolean(nuevosErrores[campo])
    )

    if (primero) {

      const elemento =
        formularioRef.current?.elements.namedItem(
          primero
        )

      if (elemento instanceof HTMLElement) {
        elemento.focus()
      }

      setErrorGeneral(
        'Revisa los campos señalados antes de continuar.'
      )

      return
    }

    // Es obligatorio tener un veterinario seleccionado.
    if (!medico || datos.veterinarioId == null) {

      setErrorGeneral(
        'Selecciona un veterinario.'
      )

      return
    }

    /* ---------------------------------------------------
       GUARDAR EDAD EN EL FORMATO DEL SERVICIO ACTUAL
    --------------------------------------------------- */

    const edadEnAnios =
      datos.unidadEdad === 'meses'
        ? Number(datos.edadMascota) / 12
        : Number(datos.edadMascota)


    /* ---------------------------------------------------
       REGISTRAR LA CITA
    --------------------------------------------------- */

    const resultado = crearCita({

      // Usuario de la sesión.
      correoUsuario: usuario.correo,

      nombreUsuario:
        `${usuario.nombre} ${usuario.apellidos}`.trim(),

      // Información de contacto.
      dueno: datos.nombreDueno.trim(),
      propietario: datos.nombreDueno.trim(),
      correo: datos.correo.trim(),
      telefono: datos.telefono.trim(),

      // Información de la mascota.
      mascota: datos.nombreMascota.trim(),
      tipoMascota: datos.tipoMascota,
      otraEspecie: datos.otraEspecie,
      edadMascota: edadEnAnios,

      // Veterinario elegido.
      veterinarioId: datos.veterinarioId,
      veterinarioNombre: medico.nombre,

      // Información de la consulta.
      servicio: datos.servicio,
      fecha: datos.fecha,
      hora: datos.hora,
      motivo: datos.motivo.trim()
    })

    // Mostrar un error si no se pudo registrar.
    if (!resultado.ok) {

      setErrorGeneral(resultado.mensaje)

      return
    }

    // Confirmar que se guardó la solicitud.
    setErrores({})
    setErrorGeneral('')
    setEnviada(true)
  }


  /* =====================================================
     22. INTERFAZ VISUAL 
     Contiene los campos, imágenes,
     tarjetas y mensajes del formulario.
  ===================================================== */

  return (

    <section className="seccion-solicitar-cita">

      <div className="contenedor">


        {/* =============================================
            ENCABEZADO
        ============================================= */}

        <div className="encabezado-formulario-cita">

          <span>Solicitud de atención</span>

          <h2>Cuéntanos sobre tu mascota</h2>

          <p>
            Completa los siguientes pasos
            para solicitar una cita.
          </p>

        </div>


        {/* =============================================
            INDICADOR DE LOS TRES PASOS
        ============================================= */}

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


        {/* =============================================
            AVISO DE SESIÓN
        ============================================= */}

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


        {/* =============================================
            FORMULARIO
        ============================================= */}

        <form
          ref={formularioRef}
          className="formulario-cita"
          onSubmit={enviar}
          noValidate
        >


          {/* =========================================
              PASO 1 - DATOS DEL DUEÑO
          ========================================= */}

          <section className="bloque-formulario bloque-celeste">

            <div className="titulo-bloque">

              <span className="numero-paso">1</span>

              <div>
                <h3>Datos del dueño</h3>
                <p>¿Con quién debemos comunicarnos?</p>
              </div>

            </div>


            <div className="grid-campos">

              {/* NOMBRE DEL DUEÑO */}
              <div className="grupo-campo">

                <label htmlFor="nombreDueno">
                  Nombre completo *
                </label>

                <input
                  id="nombreDueno"
                  name="nombreDueno"
                  type="text"
                  maxLength={60}
                  value={datos.nombreDueno}
                  onChange={manejarCambio}
                  onBlur={() => manejarSalida('nombreDueno')}
                  placeholder="Ej.: Camila González"
                  autoComplete="name"
                  aria-invalid={!!errores.nombreDueno}
                />

                {mostrarError('nombreDueno')}

              </div>


              {/* CORREO */}
              <div className="grupo-campo">

                <label htmlFor="correoCita">
                  Correo electrónico *
                </label>

                <input
                  id="correoCita"
                  name="correo"
                  type="email"
                  value={datos.correo}
                  onChange={manejarCambio}
                  onBlur={() => manejarSalida('correo')}
                  placeholder="correo@ejemplo.cl"
                  autoComplete="email"
                  aria-invalid={!!errores.correo}
                />

                {mostrarError('correo')}

              </div>


              {/* TELÉFONO */}
              <div className="grupo-campo">

                <label htmlFor="telefonoCita">
                  Teléfono *
                </label>

                <input
                  id="telefonoCita"
                  name="telefono"
                  type="tel"
                  value={datos.telefono}
                  onChange={manejarCambio}
                  onBlur={() => manejarSalida('telefono')}
                  placeholder="+56 9 1234 5678"
                  autoComplete="tel"
                  aria-invalid={!!errores.telefono}
                />

                {mostrarError('telefono')}

              </div>

            </div>

          </section>


          {/* =========================================
              PASO 2 - DATOS DE LA MASCOTA
          ========================================= */}

          <section className="bloque-formulario bloque-rosa">

            <div className="titulo-bloque">

              <span className="numero-paso numero-paso-rosa">
                2
              </span>

              <div>
                <h3>Datos de la mascota</h3>

                <p>
                  Queremos conocer a tu compañero.
                </p>
              </div>

            </div>


            <div className="grid-mascota">


              {/* =====================================
                  NOMBRE DE LA MASCOTA
              ===================================== */}

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
                  value={datos.nombreMascota}
                  onChange={manejarCambio}
                  onBlur={() =>
                    manejarSalida('nombreMascota')
                  }
                  placeholder="Ej.: Luna"
                  aria-invalid={!!errores.nombreMascota}
                  aria-describedby="ayudaNombreMascota"
                />

                <small
                  id="ayudaNombreMascota"
                  style={{
                    color: '#6F6F78',
                    marginTop: '6px'
                  }}
                >
                  Entre 2 y 40 caracteres, sin números.
                </small>

                {mostrarError('nombreMascota')}

              </div>


              {/* =====================================
                  EDAD EN MESES O AÑOS
              ===================================== */}

              <div className="grupo-campo">

                <label htmlFor="edadMascota">
                  Edad aproximada *
                </label>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'minmax(0, 1fr) minmax(105px, 120px)',
                    gap: '10px',
                    alignItems: 'start'
                  }}
                >

                  {/* CANTIDAD */}
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
                    value={datos.edadMascota}
                    onChange={manejarCambio}
                    onBlur={() =>
                      manejarSalida('edadMascota')
                    }
                    placeholder={
                      datos.unidadEdad === 'meses'
                        ? 'Ej.: 5'
                        : 'Ej.: 2'
                    }
                    aria-label="Cantidad de edad"
                    aria-invalid={!!errores.edadMascota}
                  />

                  {/* UNIDAD: MESES O AÑOS */}
                  <select
                    id="unidadEdadMascota"
                    name="unidadEdad"
                    value={datos.unidadEdad}
                    onChange={manejarCambio}
                    aria-label="Unidad de edad"
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
                    ? 'Ingresa entre 1 y 11 meses.'
                    : 'Ingresa entre 1 y 30 años.'}
                </small>

                {mostrarError('edadMascota')}
                {mostrarError('unidadEdad')}

              </div>

            </div>


            {/* =====================================
                TARJETAS DE MASCOTAS
            ===================================== */}

            <div className="grupo-opciones">

              <div
                className="titulo-opciones"
                id="tituloTiposMascota"
              >
                Tipo de mascota *
              </div>

              <div
                className="opciones-mascota"
                role="radiogroup"
                aria-labelledby="tituloTiposMascota"
              >

                {tiposMascota.map((tipo) => (

                  <label
                    className="tarjeta-opcion"
                    key={tipo.valor}
                  >

                    <input
                      type="radio"
                      name="tipoMascota"
                      value={tipo.valor}
                      checked={
                        datos.tipoMascota === tipo.valor
                      }
                      onChange={manejarCambio}
                      onBlur={() =>
                        manejarSalida('tipoMascota')
                      }
                    />

                    <div
                      className={
                        `contenedor-icono-mascota ${tipo.color}`
                      }
                    >

                      <img
                        src={`/img/${tipo.imagen}`}
                        alt={tipo.titulo}
                        className="imagen-tipo-mascota"
                      />

                    </div>

                    <strong>{tipo.titulo}</strong>

                    <small>{tipo.detalle}</small>

                  </label>

                ))}

              </div>

              {mostrarError('tipoMascota')}

            </div>


            {/* =====================================
                AVE O CONEJO
                Solo aparece al seleccionar "Otro".
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

                {mostrarError('otraEspecie')}

              </div>

            )}

          </section>


          {/* =========================================
              PASO 3 - INFORMACIÓN DE LA CITA
          ========================================= */}

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
                SERVICIO VETERINARIO
            ===================================== */}

            <div className="grupo-opciones">

              <label
                htmlFor="servicioCita"
                className="titulo-opciones"
              >
                ¿Qué atención necesitas? *
              </label>

              <div className="grupo-campo selector-servicio-cita">

                <select
                  id="servicioCita"
                  name="servicio"
                  value={datos.servicio}
                  onChange={manejarCambio}
                  onBlur={() =>
                    manejarSalida('servicio')
                  }
                  aria-invalid={!!errores.servicio}
                >

                  <option value="">
                    Selecciona un servicio
                  </option>

                  {Object.entries(SERVICIOS_CITAS).map(
                    ([grupo, opciones]) => (

                      <optgroup
                        key={grupo}
                        label={grupo}
                      >

                        {opciones.map((servicio) => (

                          <option
                            key={servicio}
                            value={servicio}
                          >
                            {servicio}
                          </option>

                        ))}

                      </optgroup>

                    )
                  )}

                </select>

                {mostrarError('servicio')}

              </div>

            </div>


            {/* =====================================
                SELECTOR DE VETERINARIOS
            ===================================== */}

            <SelectorVeterinarioCita
              tipoMascota={datos.tipoMascota}
              otraEspecie={datos.otraEspecie}
              veterinarioId={datos.veterinarioId}
              onSeleccionar={seleccionarVeterinario}
              error={errores.veterinarioId}
            />


            {/* =====================================
                FECHA Y HORA
            ===================================== */}

            <div className="grid-fecha">

              {/* FECHA */}
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
                  disabled={
                    datos.veterinarioId == null
                  }
                  aria-invalid={!!errores.fecha}
                />

                {mostrarError('fecha')}

              </div>


              {/* HORA */}
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
                    !datos.fecha ||
                    !atiendeEseDia(
                      medico,
                      datos.fecha
                    )
                  }
                  aria-invalid={!!errores.hora}
                >

                  <option value="">
                    Selecciona un horario
                  </option>

                  {HORARIOS_CITAS.map((hora) => {

                    // Horario fuera de la jornada.
                    const fueraDeJornada =
                      !atiendeEsaHora(medico, hora)

                    // Hora que ya tiene una cita.
                    const reservado =
                      ocupadas.includes(hora)

                    // Hora que ya pasó, si la fecha es hoy.
                    const pasado =
                      !esHoraFutura(
                        datos.fecha,
                        hora
                      )

                    return (

                      <option
                        key={hora}
                        value={hora}
                        disabled={
                          fueraDeJornada ||
                          reservado ||
                          pasado
                        }
                      >

                        {hora}

                        {fueraDeJornada
                          ? ' (fuera de jornada)'
                          : reservado
                            ? ' (reservado)'
                            : pasado
                              ? ' (ya pasó)'
                              : ''}

                      </option>

                    )
                  })}

                </select>

                {mostrarError('hora')}

              </div>

            </div>


            {/* =====================================
                RECORDATORIO DEL HORARIO DEL MÉDICO
            ===================================== */}

            {!medico && (

              <p className="aviso-horario-veterinario">
                Elige un veterinario para consultar
                sus fechas y horarios.
              </p>

            )}

            {medico && (

              <p className="aviso-horario-veterinario">

                <strong>
                  Horario de {medico.nombre}:
                </strong>

                {' '}

                {medico.dias.join(', ')}

                {' · '}

                {medico.horario} hrs.

              </p>

            )}


            {/* Avisar si el médico no atiende ese día. */}
            {medico &&
              datos.fecha &&
              !atiendeEseDia(medico, datos.fecha) && (

                <p
                  className="mensaje-error"
                  role="alert"
                >
                  {medico.nombre} no atiende ese día.
                  Selecciona otra fecha.
                </p>

              )}


            {/* =====================================
                MOTIVO DE LA CONSULTA
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
                placeholder="Ej.: Mi gatito lleva dos días sin querer comer y necesito una revisión veterinaria."
                aria-invalid={!!errores.motivo}
                aria-describedby="ayudaMotivoCita"
              />

              {/* Descripción de la validación */}
              <small
                id="ayudaMotivoCita"
                style={{
                  color: '#6F6F78',
                  marginTop: '6px'
                }}
              >
                Describe brevemente qué necesita tu mascota.
                Mínimo 10 caracteres.
              </small>

              {/* Mensaje de error */}
              {mostrarError('motivo')}

              {/* Contador de caracteres */}
              <div className="detalle-textarea">

                <span>
                  Campo obligatorio
                </span>

                <span>
                  {datos.motivo.length} / 500
                </span>

              </div>

            </div>

          </section>


          {/* =========================================
              PASO FINAL - CONFIRMACIÓN
          ========================================= */}

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

                  <span>
                    {' · '}
                    {datos.edadMascota}

                    {' '}

                    {datos.unidadEdad === 'meses'
                      ? Number(datos.edadMascota) === 1
                        ? 'mes'
                        : 'meses'
                      : Number(datos.edadMascota) === 1
                        ? 'año'
                        : 'años'}
                  </span>

                )}

              </div>

            )}


            {/* =====================================
                RESUMEN DEL VETERINARIO ELEGIDO
            ===================================== */}

            {medico && (

              <div className="resumen-veterinario-elegido">

                <strong>
                  Veterinario elegido:
                </strong>

                {' '}

                {medico.nombre}

                {' · '}

                {medico.area}

              </div>

            )}


            {/* =====================================
                CONFIRMAR DATOS
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

              {mostrarError('confirmarDatos')}

            </div>


            {/* =====================================
                BOTÓN PARA SOLICITAR CITA
            ===================================== */}

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
                Tu solicitud quedará registrada como{' '}
                <strong>Pendiente</strong>.
              </p>

            </div>


            {/* ERROR GENERAL */}
            {errorGeneral && (

              <p
                className="mensaje-error"
                role="alert"
              >
                {errorGeneral}
              </p>

            )}


            {/* =====================================
                CONFIRMACIÓN DE SOLICITUD REGISTRADA.
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
                    Tu cita para{' '}
                    <strong>
                      {datos.nombreMascota.trim()}
                    </strong>
                    {' '}con{' '}
                    <strong>
                      {medico?.nombre}
                    </strong>
                    {' '}quedó registrada como{' '}
                    <strong>Pendiente</strong>.
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