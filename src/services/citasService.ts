/* =========================================================
   PATITAS FELICES - SERVICIO DE CITAS
   
   FUNCIONALIDADES:
   1. Crear solicitudes de citas.
   2. Consultar las citas guardadas.
   3. Filtrar citas de un usuario.
   4. Modificar citas.
   5. Cancelar o eliminar citas.
   6. Comprobar especie, servicio y veterinario.
   7. Comprobar días de atención.
   8. Comprobar horarios del médico.
   9. Considerar la duración de cada atención.
   10. Evitar reservas superpuestas.
========================================================= */
import {
  CLAVES,
  guardarColeccion,
  leerColeccion
} from './almacenamiento'

import {
  obtenerVeterinarioPorId
} from './veterinariosService'

import {
  CATALOGO_CITAS,
  citaCompatibleConCatalogo,
  obtenerEspecieCita,
  obtenerServicioCita,
  profesionalPorConfirmar
} from './catalogoCitasService'

import type {
  ResultadoOperacion
} from '../types/usuario'
/* =========================================================
   1. ESTADOS DE LAS CITAS
   Pendiente:
   La clínica todavía no la confirma.
   Confirmada:
   La clínica aceptó la cita.
   Completada:
   La atención ya se realizó.
   Cancelada:
   La cita no se realizará y libera el horario.
========================================================= */
export type EstadoCita =
  | 'Pendiente'
  | 'Confirmada'
  | 'Completada'
  | 'Cancelada'
/* =========================================================
   2. ESTRUCTURA DE UNA CITA
========================================================= */
export interface Cita {

  // Identificador único.
  id: string | number

  // Datos del usuario conectado.
  correoUsuario: string
  nombreUsuario: string

  // Datos del dueño.
  dueno: string
  propietario: string
  correo: string
  telefono: string

  // Datos de la mascota.
  mascota: string
  tipoMascota: string
  otraEspecie?: string
  edadMascota: number

  // Veterinario seleccionado.
  veterinarioId?: number | null
  veterinarioNombre?: string

  // Información de la atención.
  servicio: string
  fecha: string
  hora: string
  motivo: string
  // Duración de la reserva en minutos.
  duracionMinutos?: number
  // Indica si la clínica debe confirmar
  // el profesional que realizará el servicio.
  profesionalPorConfirmar?: boolean
  // Estado y fecha de registro.
  estado: EstadoCita
  fechaRegistro: string
}
/* =========================================================
   3. TIPO PARA CREAR UNA CITA

   Al crear una cita:
   - El formulario envía sus datos.
   - El servicio genera automáticamente el ID.
   - El estado inicial es Pendiente.
   - Se registra la fecha de creación.
   - Se calcula la duración de la atención.
========================================================= */
export type NuevaCita = Omit<
  Cita,
  | 'id'
  | 'estado'
  | 'fechaRegistro'
  | 'veterinarioId'
  | 'veterinarioNombre'
  | 'duracionMinutos'
  | 'profesionalPorConfirmar'
> & {
  veterinarioId: number
  veterinarioNombre: string
}
/* =========================================================
   4. TIPO PARA MODIFICAR UNA CITA
========================================================= */
export type CambiosCita = Partial<Pick<
  Cita,
  | 'fecha'
  | 'hora'
  | 'servicio'
  | 'motivo'
  | 'estado'
  | 'veterinarioId'
>>
/* =========================================================
   5. HORARIOS DISPONIBLES
========================================================= */
export const HORARIOS_CITAS = [

  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00'

] as const
/* =========================================================
   6. SERVICIOS DISPONIBLES
========================================================= */
export const SERVICIOS_CITAS: Record<
  string,
  string[]
> = CATALOGO_CITAS.reduce<Record<string, string[]>>(

  (grupos, servicio) => {

    // Si todavía no existe el grupo, lo creamos.
    if (!grupos[servicio.grupo]) {

      grupos[servicio.grupo] = []
    }

    // Agregamos el servicio al grupo.
    grupos[servicio.grupo].push(
      servicio.nombre
    )

    return grupos
  },

  {}
)
/* =========================================================
   7. CONVERTIR HORAS A MINUTOS
========================================================= */
function horaAMinutos(
  hora: string
): number | null {

  // Comprobar formato HH:mm.
  if (!/^\d{2}:\d{2}$/.test(hora)) {

    return null
  }

  const [horas, minutos] = hora
    .split(':')
    .map(Number)

  // Comprobar valores válidos.
  if (horas > 23 || minutos > 59) {

    return null
  }

  return horas * 60 + minutos
}
/* =========================================================
   8. COMPROBAR SI DOS CITAS SE SUPERPONEN
========================================================= */
function seSuperponen(

  inicioA: number,
  finA: number,

  inicioB: number,
  finB: number

): boolean {

  return (
    inicioA < finB &&
    inicioB < finA
  )
}
/* =========================================================
   9. OBTENER LA DURACIÓN DEL SERVICIO
========================================================= */
function duracionParaAgenda(
  nombreServicio: string
): number {

  const servicio = obtenerServicioCita(
    nombreServicio
  )

  // Compatibilidad con servicios antiguos.
  if (!servicio) {

    return 60
  }

  // Hospitalización: evaluación inicial.
  if (servicio.codigo === 'OT004') {

    return 60
  }

  return servicio.duracionMinutos
}
/* =========================================================
   10. OBTENER DURACIÓN DE UNA CITA GUARDADA
========================================================= */
function duracionDeCita(
  cita: Cita
): number {

  if (

    typeof cita.duracionMinutos === 'number' &&

    Number.isFinite(cita.duracionMinutos) &&

    cita.duracionMinutos > 0

  ) {

    return cita.duracionMinutos
  }

  return duracionParaAgenda(
    cita.servicio
  )
}
/* =========================================================
   11. CONVERTIR FECHA A OBJETO DATE
========================================================= */
function fechaAObjeto(
  fecha: string
): Date | null {

  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {

    return null
  }

  const [anio, mes, dia] = fecha
    .split('-')
    .map(Number)

  const objeto = new Date(
    anio,
    mes - 1,
    dia
  )

  if (

    objeto.getFullYear() !== anio ||

    objeto.getMonth() !== mes - 1 ||

    objeto.getDate() !== dia

  ) {

    return null
  }

  return objeto
}
/* =========================================================
   12. REVISAR LA JORNADA DEL VETERINARIO

   Validamos:
   - Que el veterinario exista.
   - Que sea médico veterinario.
   - Que atienda el día seleccionado.
   - Que la hora corresponda a su jornada.
   - Que la atención alcance a terminar
     antes del horario de salida del médico.
========================================================= */
function errorJornada(

  fecha: string,
  hora: string,
  veterinarioId: number,
  servicio: string

): string | null {

  const medico = obtenerVeterinarioPorId(
    veterinarioId
  )

  if (
    !medico ||
    medico.cargo !== 'Médico veterinario'
  ) {

    return 'Selecciona un médico veterinario válido.'
  }
  /* -----------------------------------------
     Comprobar día de atención.
  ----------------------------------------- */
  const fechaElegida = fechaAObjeto(
    fecha
  )

  if (!fechaElegida) {

    return 'Selecciona una fecha válida.'
  }

  const dias = [

    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado'

  ]

  const nombreDia = dias[
    fechaElegida.getDay()
  ]

  if (!medico.dias.includes(nombreDia)) {

    return `${medico.nombre} no atiende ese día.`
  }
  /* -----------------------------------------
     Obtener la hora de entrada y salida.
     medico.horario tiene este formato:
     "10:00 - 19:00"
  ----------------------------------------- */
  const rango = medico.horario.match(
    /^(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})$/
  )

  const inicio = horaAMinutos(
    hora
  )

  const entrada = rango
    ? horaAMinutos(rango[1])
    : null

  const salida = rango
    ? horaAMinutos(rango[2])
    : null


  if (

    inicio === null ||

    entrada === null ||

    salida === null

  ) {

    return 'No fue posible validar el horario del veterinario.'
  }
  /* -----------------------------------------
     Comprobar duración de la atención.
     ----------------------------------------- */
  const duracion = duracionParaAgenda(
    servicio
  )

  const fin = inicio + duracion

  if (
    inicio < entrada ||
    fin > salida
  ) {

    return `La atención no alcanza a realizarse dentro del horario de ${medico.nombre}.`
  }

  return null
}
/* =========================================================
   13. BUSCAR CONFLICTOS DE HORARIOS
========================================================= */
function hayConflicto(

  fecha: string,
  hora: string,
  duracionNueva: number,

  veterinarioId?: number | null,

  idExcluir?: string | number

): boolean {

  const inicioNuevo = horaAMinutos(
    hora
  )

  if (inicioNuevo === null) {

    return false
  }

  const finNuevo = inicioNuevo + duracionNueva

  /* Recorremos las citas guardadas. */
  return listarCitas().some((cita) => {
    // Solo revisamos la fecha seleccionada.
    if (cita.fecha !== fecha) {

      return false
    }
    // Las canceladas liberan el horario.
    if (
      cita.estado?.toLowerCase() === 'cancelada'
    ) {

      return false
    }
    // Al editar, ignoramos la misma cita.
    if (

      idExcluir !== undefined &&

      String(cita.id) === String(idExcluir)

    ) {

      return false
    }
    /* -----------------------------------------
       Comparar veterinarios.
    ----------------------------------------- */
    if (

      veterinarioId != null &&

      cita.veterinarioId != null &&

      cita.veterinarioId !== veterinarioId

    ) {

      return false
    }
    /* -----------------------------------------
       Obtener los minutos de la cita existente.
    ----------------------------------------- */
    const inicioExistente = horaAMinutos(
      cita.hora
    )

    if (inicioExistente === null) {

      return false
    }

    const finExistente =
      inicioExistente +
      duracionDeCita(cita)


    /* -----------------------------------------
       Comparar ambos intervalos.
    ----------------------------------------- */

    return seSuperponen(

      inicioNuevo,
      finNuevo,

      inicioExistente,
      finExistente

    )

  })
}

/* =========================================================
   14. LISTAR TODAS LAS CITAS
========================================================= */

export function listarCitas(): Cita[] {

  return leerColeccion<Cita>(
    CLAVES.citas
  )
}


/* =========================================================
   15. LISTAR CITAS DEL USUARIO
========================================================= */

export function listarCitasUsuario(
  correo: string
): Cita[] {

  const correoBuscado = correo
    .trim()
    .toLowerCase()

  return listarCitas().filter((cita) => {

    const correoCita = (
      cita.correoUsuario ||
      cita.correo ||
      ''
    )
      .trim()
      .toLowerCase()

    return correoCita === correoBuscado

  })
}


/* =========================================================
   16. FILTRAR CITAS
   Permite buscar por:
   - Mascota.
   - Dueño.
   - Correo.
   - Servicio.
   - Fecha.
   - Nombre del veterinario.
========================================================= */
export function filtrarCitas(

  citas: Cita[],
  texto: string,
  estado: string

): Cita[] {

  const buscar = texto
    .trim()
    .toLowerCase()

  return citas.filter((cita) => {
    // Comprobar estado.
    const coincideEstado =

      !estado ||

      cita.estado?.toLowerCase() ===
      estado.toLowerCase()
    // Comprobar texto buscado.
    const coincideTexto =

      !buscar ||

      [

        cita.mascota,
        cita.dueno,
        cita.correo,
        cita.servicio,
        cita.fecha,
        cita.veterinarioNombre

      ].some((dato) =>

        (dato || '')
          .toLowerCase()
          .includes(buscar)

      )

    return (
      coincideEstado &&
      coincideTexto
    )

  })
}

/* =========================================================
   17. HORAS NO DISPONIBLES
========================================================= */
export function horasOcupadas(

  fecha: string,

  idExcluir?: string | number,

  veterinarioId?: number | null,

  servicio?: string

): string[] {

  const duracion = duracionParaAgenda(
    servicio ?? ''
  )
  /* Revisamos cada hora del selector. */
  return HORARIOS_CITAS.filter((hora) => {
    /* -----------------------------------------
       Comprobar conflicto con otras citas.
    ----------------------------------------- */
    const choca = hayConflicto(

      fecha,
      hora,
      duracion,

      veterinarioId,
      idExcluir

    )
    /* -----------------------------------------
       Comprobar jornada y duración.
    ----------------------------------------- */
    const fueraDeJornada =

      veterinarioId != null &&
      Boolean(servicio)

        ? Boolean(

            errorJornada(

              fecha,
              hora,
              veterinarioId,
              servicio!

            )

          )

        : false


    return (
      choca ||
      fueraDeJornada
    )

  })
}

/* =========================================================
   18. OBTENER FECHA LOCAL DE HOY
========================================================= */
export function fechaLocalHoy(): string {

  const hoy = new Date()

  const mes = String(
    hoy.getMonth() + 1
  ).padStart(2, '0')

  const dia = String(
    hoy.getDate()
  ).padStart(2, '0')

  return `${hoy.getFullYear()}-${mes}-${dia}`
}

/* =========================================================
   19. VALIDAR DISPONIBILIDAD ANTES DE GUARDAR
========================================================= */
function validarDisponibilidad(

  fecha: string,
  hora: string,
  servicio: string,

  veterinarioId?: number | null,

  idExcluir?: string | number

): string | null {
  /* -----------------------------------------
     Validar fecha.
  ----------------------------------------- */
  const fechaElegida = fechaAObjeto(
    fecha
  )

  if (!fechaElegida) {

    return 'Selecciona una fecha válida.'
  }

  if (fecha < fechaLocalHoy()) {

    return 'La fecha no puede ser anterior a hoy.'
  }
  /* -----------------------------------------
     No permitimos sábados ni domingos.
  ----------------------------------------- */
  if (
    [0, 6].includes(
      fechaElegida.getDay()
    )
  ) {

    return 'Selecciona un día de lunes a viernes.'
  }
  /* -----------------------------------------
     La hora debe estar en nuestro selector.
  ----------------------------------------- */
  if (

    !HORARIOS_CITAS.some(
      (opcion) => opcion === hora
    )

  ) {

    return 'Selecciona un horario válido.'
  }
  /* -----------------------------------------
     Si la cita es hoy, la hora debe ser futura.
  ----------------------------------------- */
  if (fecha === fechaLocalHoy()) {

    const ahora = new Date()

    const inicio = horaAMinutos(
      hora
    )!

    const minutoActual =

      ahora.getHours() * 60 +

      ahora.getMinutes()

    if (inicio <= minutoActual) {

      return 'El horario seleccionado ya pasó.'
    }

  }
  /* -----------------------------------------
     Comprobar jornada del veterinario.
  ----------------------------------------- */
  if (veterinarioId != null) {

    const error = errorJornada(

      fecha,
      hora,
      veterinarioId,
      servicio

    )

    if (error) {

      return error
    }

  }
  /* -----------------------------------------
     Comprobar superposición según duración.
  ----------------------------------------- */
  const duracion = duracionParaAgenda(
    servicio
  )

  if (

    hayConflicto(

      fecha,
      hora,
      duracion,

      veterinarioId,
      idExcluir

    )

  ) {

    return 'Ese horario se superpone con otra cita de este veterinario.'
  }

  return null
}
/* =========================================================
   20. VALIDAR ESPECIE, SERVICIO Y MÉDICO
======================================================== */
function validarCompatibilidad(

  cita: Pick<

    Cita,

    | 'tipoMascota'
    | 'otraEspecie'
    | 'servicio'
    | 'veterinarioId'

  >

): string | null {
  /* -----------------------------------------
     Identificar especie.
  ---------------------------------------- */
  const especie = obtenerEspecieCita(

    cita.tipoMascota,

    cita.otraEspecie ?? ''

  )

  if (!especie) {

    return 'Selecciona una especie válida.'
  }
  /* -----------------------------------------
     Identificar servicio y comprobar especie.
  ----------------------------------------- */
  const servicio = obtenerServicioCita(
    cita.servicio
  )

  if (

    !servicio ||

    !servicio.especies.includes(especie)

  ) {

    return 'El servicio seleccionado no corresponde a la especie.'
  }
  /* -----------------------------------------
     Comprobar veterinario.
  ----------------------------------------- */
  if (

    cita.veterinarioId == null ||

    !citaCompatibleConCatalogo(

      especie,
      cita.servicio,
      cita.veterinarioId

    )

  ) {

    return 'El veterinario no realiza ese servicio para esta especie.'
  }

  return null
}
/* =========================================================
   21. CREAR UNA CITA
========================================================= */
export function crearCita(

  datos: NuevaCita

): ResultadoOperacion<Cita> {
  /* -----------------------------------------
     Validar datos obligatorios.
  ----------------------------------------- */
  if (

    !datos.correoUsuario?.trim() ||

    !datos.dueno?.trim() ||

    !datos.mascota?.trim() ||

    !datos.motivo?.trim()

  ) {

    return {

      ok: false,

      campo: 'mascota',

      mensaje: 'Completa los datos obligatorios de la solicitud.'

    }

  }
  /* -----------------------------------------
     Validar edad de la mascota.
  ----------------------------------------- */
  if (

    !Number.isFinite(datos.edadMascota) ||

    datos.edadMascota <= 0 ||

    datos.edadMascota > 30

  ) {

    return {

      ok: false,

      campo: 'edadMascota',

      mensaje: 'Ingresa una edad válida para la mascota.'

    }

  }


  /* -----------------------------------------
     Validar especie, servicio y médico.
  ----------------------------------------- */

  const errorCatalogo = validarCompatibilidad(
    datos
  )

  if (errorCatalogo) {

    return {

      ok: false,

      campo: 'servicio',

      mensaje: errorCatalogo

    }

  }
  /* -----------------------------------------
     Comprobar disponibilidad nuevamente.
  ----------------------------------------- */
  const errorAgenda = validarDisponibilidad(

    datos.fecha,
    datos.hora,
    datos.servicio,

    datos.veterinarioId

  )

  if (errorAgenda) {

    return {

      ok: false,

      campo: 'hora',

      mensaje: errorAgenda

    }

  }
  /* -----------------------------------------
     Obtener el nombre desde los datos originales.
  ----------------------------------------- */
  const medico = obtenerVeterinarioPorId(
    datos.veterinarioId
  )!
  /* -----------------------------------------
     Construir la nueva cita.
  ----------------------------------------- */
  const cita: Cita = {

    ...datos,

    veterinarioNombre: medico.nombre,

    // Guardamos la duración del procedimiento.
    duracionMinutos: duracionParaAgenda(
      datos.servicio
    ),

    // Para servicios sin profesional asignado
    // registramos que la clínica debe confirmarlo.
    profesionalPorConfirmar: profesionalPorConfirmar(
      datos.servicio
    ),

    // Generamos un identificador.
    id: `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,

    // Las citas nuevas comienzan Pendientes.
    estado: 'Pendiente',

    // Fecha en que se ingresó la solicitud.
    fechaRegistro: new Date().toISOString()

  }
  /* -----------------------------------------
     Guardar en localStorage.
  ----------------------------------------- */
  try {

    guardarColeccion(

      CLAVES.citas,

      [
        ...listarCitas(),
        cita
      ]

    )

    return {

      ok: true,

      dato: cita

    }

  } catch {

    return {

      ok: false,

      campo: 'general',

      mensaje: 'No fue posible guardar la cita en este navegador.'

    }

  }

}
/* =========================================================
   22. MODIFICAR UNA CITA
========================================================= */
export function actualizarCita(

  id: string | number,

  cambios: CambiosCita

): ResultadoOperacion<Cita> {
  /* -----------------------------------------
     Buscar la cita.
  ----------------------------------------- */
  const citas = listarCitas()

  const indice = citas.findIndex(

    (cita) => String(cita.id) === String(id)

  )

  if (indice < 0) {

    return {

      ok: false,

      campo: 'id',

      mensaje: 'La cita no existe.'

    }

  }
  /* -----------------------------------------
     Preparar la cita actualizada.
  ----------------------------------------- */
  const anterior = citas[indice]

  const actualizada: Cita = {

    ...anterior,

    ...cambios

  }
  /* -----------------------------------------
     Validar estado.
  ----------------------------------------- */
  const estados: EstadoCita[] = [

    'Pendiente',
    'Confirmada',
    'Completada',
    'Cancelada'

  ]

  if (!estados.includes(actualizada.estado)) {

    return {

      ok: false,

      campo: 'estado',

      mensaje: 'Estado de cita inválido.'

    }

  }
  /* -----------------------------------------
     Si se cambia el médico,
     actualizar su nombre automáticamente.
  ----------------------------------------- */
  if (cambios.veterinarioId !== undefined) {

    const medico =

      cambios.veterinarioId == null

        ? null

        : obtenerVeterinarioPorId(
            cambios.veterinarioId
          )

    actualizada.veterinarioNombre =
      medico?.nombre ?? ''

  }
  /* -----------------------------------------
     Si se cambia el servicio, actualizar
     la duración y la confirmación del médico.
  ----------------------------------------- */
  if (cambios.servicio !== undefined) {

    actualizada.duracionMinutos =
      duracionParaAgenda(
        actualizada.servicio
      )

    actualizada.profesionalPorConfirmar =
      profesionalPorConfirmar(
        actualizada.servicio
      )

  }
  /* -----------------------------------------
     Detectar cambios relacionados con la reserva.
  ----------------------------------------- */
  const cambiaReserva =

    cambios.fecha !== undefined ||

    cambios.hora !== undefined ||

    cambios.servicio !== undefined ||

    cambios.veterinarioId !== undefined ||

    (
      anterior.estado === 'Cancelada' &&

      actualizada.estado !== 'Cancelada'
    )
  if (cambiaReserva) {

    /* ---------------------------------------
       Revisar compatibilidad.
    --------------------------------------- */
    if (

      actualizada.veterinarioId != null ||

      cambios.servicio !== undefined

    ) {

      const errorCatalogo = validarCompatibilidad(
        actualizada
      )

      if (errorCatalogo) {

        return {

          ok: false,

          campo: 'servicio',

          mensaje: errorCatalogo

        }

      }

    }

    /* ---------------------------------------
       Revisar disponibilidad.
    --------------------------------------- */
    if (actualizada.estado !== 'Cancelada') {

      const error = validarDisponibilidad(

        actualizada.fecha,
        actualizada.hora,
        actualizada.servicio,

        actualizada.veterinarioId,

        id

      )

      if (error) {

        return {

          ok: false,

          campo: 'hora',

          mensaje: error

        }

      }

    }

  }
  /* -----------------------------------------
     Guardar la cita modificada.
  ----------------------------------------- */
  citas[indice] = actualizada

  try {

    guardarColeccion(
      CLAVES.citas,
      citas
    )

    return {

      ok: true,

      dato: actualizada

    }

  } catch {

    return {

      ok: false,

      campo: 'general',

      mensaje: 'No fue posible actualizar la cita.'

    }

  }

}
/* =========================================================
   23. ELIMINAR UNA CITA
========================================================= */
export function eliminarCita(

  id: string | number

): boolean {

  const citas = listarCitas()

  const restantes = citas.filter(

    (cita) => String(cita.id) !== String(id)

  )
  /* Si no encontramos el ID, devolvemos false. */
  if (restantes.length === citas.length) {

    return false
  }
  /* Guardar el listado sin la cita eliminada. */
  try {

    guardarColeccion(

      CLAVES.citas,

      restantes

    )

    return true

  } catch {

    return false

  }

}