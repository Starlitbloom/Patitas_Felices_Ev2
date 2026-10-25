
/* =========================================================
   SERVICIO DE CITAS
   VETERINARIA PATITAS FELICES

   Incluye:
   - Crear citas.
   - Listar citas.
   - Consultar citas por usuario.
   - Filtrar citas.
   - Modificar citas.
   - Eliminar citas.
   - Seleccionar veterinario.
   - Validar especie, fecha y horario.
   - Evitar reservas duplicadas por veterinario.
========================================================= */

import {
  CLAVES,
  guardarColeccion,
  leerColeccion
} from './almacenamiento'

import {
  obtenerVeterinarioPorId
} from './veterinariosService'

import type {
  ResultadoOperacion
} from '../types/usuario'

import type {
  Especie
} from '../types/veterinario'


/* =========================================================
   1. TIPOS DE DATOS
========================================================= */

export type EstadoCita =
  | 'Pendiente'
  | 'Confirmada'
  | 'Completada'
  | 'Cancelada'


export interface Cita {
  id: string | number

  correoUsuario: string
  nombreUsuario: string

  dueno: string
  propietario: string
  correo: string
  telefono: string

  mascota: string
  tipoMascota: string
  otraEspecie?: string
  edadMascota: number

  // Opcionales para poder leer citas antiguas.
  veterinarioId?: number | null
  veterinarioNombre?: string

  servicio: string
  fecha: string
  hora: string
  motivo: string

  estado: EstadoCita
  fechaRegistro: string
}


// Las nuevas citas requieren un veterinario.
export type NuevaCita = Omit<
  Cita,
  | 'id'
  | 'estado'
  | 'fechaRegistro'
  | 'veterinarioId'
  | 'veterinarioNombre'
> & {
  veterinarioId: number
  veterinarioNombre: string
}


// Campos que pueden modificarse posteriormente.
export type CambiosCita = Partial<
  Pick<
    Cita,
    | 'fecha'
    | 'hora'
    | 'servicio'
    | 'motivo'
    | 'estado'
    | 'veterinarioId'
  >
>


type ErrorCita = {
  campo: string
  mensaje: string
}


/* =========================================================
   2. HORARIOS DE ATENCIÓN
========================================================= */

export const HORARIOS_CITAS = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00'
] as const


/* =========================================================
   3. SERVICIOS VETERINARIOS DE LA EP1
========================================================= */

export const SERVICIOS_CITAS: Record<string, string[]> = {

  Consultas: [
    'Consulta general',
    'Consulta urgencia',
    'Control postoperatorio',
    'Consulta ave / conejo',
    'Segunda opinión médica'
  ],

  Vacunación: [
    'Vacuna antirrábica canina',
    'Vacuna séxtuple canina',
    'Vacuna bivalente felina',
    'Vacuna triple felina',
    'Vacuna Bordetella canina',
    'Vacuna antirrábica felina'
  ],

  Cirugía: [
    'Esterilización hembra canina',
    'Esterilización macho canino',
    'Esterilización hembra felina',
    'Esterilización macho felino',
    'Extirpación de tumor cutáneo',
    'Cesárea de urgencia'
  ],

  Desparasitación: [
    'Desparasitación interna pequeños',
    'Desparasitación interna medianos',
    'Desparasitación interna grandes',
    'Desparasitación interna felina',
    'Desparasitación externa'
  ],

  Exámenes: [
    'Hemograma completo',
    'Perfil bioquímico completo',
    'Radiografía',
    'Ecografía abdominal',
    'Test de leishmaniasis'
  ],

  Otros: [
    'Corte de uñas',
    'Limpieza dental',
    'Microchip identificación',
    'Hospitalización'
  ]
}


/* =========================================================
   4. LISTAR TODAS LAS CITAS

========================================================= */

export function listarCitas(): Cita[] {
  return leerColeccion<Cita>(CLAVES.citas)
}


/* =========================================================
   5. READ - CITAS DEL USUARIO CONECTADO
========================================================= */

export function listarCitasUsuario(
  correo: string
): Cita[] {

  const buscado = correo.trim().toLowerCase()

  return listarCitas().filter((cita) =>
    (cita.correoUsuario || cita.correo || '')
      .trim()
      .toLowerCase() === buscado
  )
}


/* =========================================================
   6. FILTROS PARA MIS CITAS Y ADMINISTRAR CITAS
========================================================= */

export function filtrarCitas(
  citas: Cita[],
  texto: string,
  estado: string
): Cita[] {

  const buscado = texto.trim().toLowerCase()

  return citas.filter((cita) => {

    const mismoEstado =
      !estado ||
      (cita.estado || '').toLowerCase() ===
        estado.toLowerCase()

    const valores = [
      cita.mascota,
      cita.dueno,
      cita.correo,
      cita.servicio,
      cita.fecha,
      cita.veterinarioNombre || ''
    ]

    const coincideTexto =
      !buscado ||
      valores.some((valor) =>
        (valor || '').toLowerCase().includes(buscado)
      )

    return mismoEstado && coincideTexto
  })
}


/* =========================================================
   7. COMPROBAR HORARIOS OCUPADOS

   Cada veterinario tiene su propia agenda.

   Parámetros:
   - fecha
   - idExcluir: para editar una cita
   - veterinarioId: médico cuya agenda revisamos
========================================================= */

export function horasOcupadas(
  fecha: string,
  idExcluir?: string | number,
  veterinarioId?: number | null
): string[] {

  return listarCitas()
    .filter((cita) => {

      // Solo citas del mismo día.
      if (cita.fecha !== fecha) {
        return false
      }

      // Excluir la cita que estamos modificando.
      if (cita.id === idExcluir) {
        return false
      }

      // Las citas canceladas no ocupan horario.
      if (
        (cita.estado || '').toLowerCase() ===
        'cancelada'
      ) {
        return false
      }

      // Sin médico indicado: consultar todos.
      if (veterinarioId == null) {
        return true
      }

      // Las citas antiguas sin médico siguen ocupadas.
      return (
        cita.veterinarioId == null ||
        cita.veterinarioId === veterinarioId
      )
    })
    .map((cita) => cita.hora)
}


/* =========================================================
   8. OBTENER FECHA LOCAL
========================================================= */

export function fechaLocalHoy(): string {

  const hoy = new Date()

  const anio = hoy.getFullYear()

  const mes = String(
    hoy.getMonth() + 1
  ).padStart(2, '0')

  const dia = String(
    hoy.getDate()
  ).padStart(2, '0')

  return `${anio}-${mes}-${dia}`
}


/* =========================================================
   9. VALIDAR FECHA Y HORA
========================================================= */

function validarFechaYHora(
  fecha: string,
  hora: string,
  veterinarioId?: number | null,
  idExcluir?: string | number
): ErrorCita | null {

  // Formato AAAA-MM-DD.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return {
      campo: 'fecha',
      mensaje: 'Selecciona una fecha válida.'
    }
  }

  const [anio, mes, dia] = fecha
    .split('-')
    .map(Number)

  const elegida = new Date(anio, mes - 1, dia)

  // Comprobar que la fecha exista.
  if (
    elegida.getFullYear() !== anio ||
    elegida.getMonth() !== mes - 1 ||
    elegida.getDate() !== dia
  ) {
    return {
      campo: 'fecha',
      mensaje: 'Selecciona una fecha válida.'
    }
  }

  // No permitir fechas anteriores.
  if (fecha < fechaLocalHoy()) {
    return {
      campo: 'fecha',
      mensaje: 'La fecha no puede ser anterior a hoy.'
    }
  }

  // No permitir sábados ni domingos.
  if ([0, 6].includes(elegida.getDay())) {
    return {
      campo: 'fecha',
      mensaje: 'Selecciona un día de lunes a viernes.'
    }
  }

  // Comprobar horario permitido.
  if (!HORARIOS_CITAS.some(
    (opcion) => opcion === hora
  )) {
    return {
      campo: 'hora',
      mensaje: 'Selecciona un horario válido.'
    }
  }

  // Si es hoy, no permitir horas pasadas.
  if (fecha === fechaLocalHoy()) {

    const ahora = new Date()

    const [h, m] = hora.split(':').map(Number)

    const minutosCita = h * 60 + m

    const minutosActuales =
      ahora.getHours() * 60 +
      ahora.getMinutes()

    if (minutosCita <= minutosActuales) {
      return {
        campo: 'hora',
        mensaje: 'El horario seleccionado ya pasó.'
      }
    }
  }

  // Verificar la agenda del médico seleccionado.
  const ocupadas = horasOcupadas(
    fecha,
    idExcluir,
    veterinarioId
  )

  if (ocupadas.includes(hora)) {
    return {
      campo: 'hora',
      mensaje:
        'Ese horario ya está reservado para el veterinario. Elige otro.'
    }
  }

  return null
}


/* =========================================================
   10. IDENTIFICAR ESPECIE

   Convertimos la selección del formulario al
   formato utilizado en el módulo de Equipo.
========================================================= */

function especieDeCita(
  tipoMascota: string,
  otraEspecie?: string
): Especie | null {

  if (tipoMascota === 'Perro') {
    return 'Perros'
  }

  if (tipoMascota === 'Gato') {
    return 'Gatos'
  }

  if (
    tipoMascota === 'Otro' &&
    otraEspecie === 'Ave'
  ) {
    return 'Aves'
  }

  if (
    tipoMascota === 'Otro' &&
    otraEspecie === 'Conejo'
  ) {
    return 'Conejos'
  }

  return null
}


/* =========================================================
   11. VALIDAR VETERINARIO

   Comprobar:
   - Que exista.
   - Que sea médico veterinario.
   - Que atienda la especie.
   - Que trabaje el día elegido.
   - Que atienda a la hora seleccionada.
========================================================= */

function validarMedico(
  cita: Pick<
    Cita,
    | 'veterinarioId'
    | 'tipoMascota'
    | 'otraEspecie'
    | 'fecha'
    | 'hora'
  >
): ErrorCita | null {

  const id = cita.veterinarioId

  if (id == null || !Number.isInteger(id)) {
    return {
      campo: 'veterinarioId',
      mensaje: 'Selecciona un veterinario.'
    }
  }

  // Utilizamos el servicio existente del equipo.
  const medico = obtenerVeterinarioPorId(id)

  if (
    !medico ||
    medico.cargo !== 'Médico veterinario'
  ) {
    return {
      campo: 'veterinarioId',
      mensaje:
        'El profesional seleccionado no es un médico veterinario válido.'
    }
  }

  // Validar que atienda la especie.
  const especie = especieDeCita(
    cita.tipoMascota,
    cita.otraEspecie
  )

  if (
    !especie ||
    !medico.especies.includes(especie)
  ) {
    return {
      campo: 'veterinarioId',
      mensaje:
        'Ese veterinario no atiende la especie seleccionada.'
    }
  }

  // Comprobar su día de atención.
  const [anio, mes, dia] = cita.fecha
    .split('-')
    .map(Number)

  const elegida = new Date(anio, mes - 1, dia)

  const dias = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado'
  ]

  const nombreDia = dias[elegida.getDay()]

  if (!medico.dias.includes(nombreDia)) {
    return {
      campo: 'fecha',
      mensaje:
        `${medico.nombre} no atiende ese día de la semana.`
    }
  }

  // Comprobar el horario del médico.
  const horas = medico.horario.match(
    /^(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})$/
  )

  if (
    !horas ||
    cita.hora < horas[1] ||
    cita.hora >= horas[2]
  ) {
    return {
      campo: 'hora',
      mensaje:
        `El horario de ${medico.nombre} es ${medico.horario}.`
    }
  }

  return null
}


/* =========================================================
   12. VALIDAR SERVICIO VETERINARIO
========================================================= */

function servicioValido(
  servicio: string
): boolean {

  return Object.values(SERVICIOS_CITAS)
    .some((lista) => lista.includes(servicio))
}


/* =========================================================
   13. CREATE - REGISTRAR CITA

   Se vuelve a validar todo antes de guardar.
   Las citas nuevas quedan en estado Pendiente.
========================================================= */

export function crearCita(
  datos: NuevaCita
): ResultadoOperacion<Cita> {

  // Comprobar datos principales.
  if (
    !datos.correoUsuario?.trim() ||
    !datos.dueno?.trim() ||
    !datos.mascota?.trim()
  ) {
    return {
      ok: false,
      campo: 'mascota',
      mensaje: 'Completa los datos de la solicitud.'
    }
  }

  // Servicio válido.
  if (!servicioValido(datos.servicio)) {
    return {
      ok: false,
      campo: 'servicio',
      mensaje: 'Selecciona un servicio válido.'
    }
  }

  // Fecha, hora y disponibilidad.
  const errorFecha = validarFechaYHora(
    datos.fecha,
    datos.hora,
    datos.veterinarioId
  )

  if (errorFecha) {
    return {
      ok: false,
      ...errorFecha
    }
  }

  // Comprobar médico y especie.
  const errorMedico = validarMedico(datos)

  if (errorMedico) {
    return {
      ok: false,
      ...errorMedico
    }
  }

  // Obtener el nombre oficial del veterinario.
  const medico = obtenerVeterinarioPorId(
    datos.veterinarioId
  )!

  // Crear la cita.
  const nueva: Cita = {
    ...datos,

    veterinarioNombre: medico.nombre,

    id:
      `c-${Date.now().toString(36)}-` +
      Math.random().toString(36).slice(2, 8),

    estado: 'Pendiente',

    fechaRegistro: new Date().toISOString()
  }

  // Guardar en el almacenamiento del equipo.
  try {
    guardarColeccion(
      CLAVES.citas,
      [...listarCitas(), nueva]
    )

    return {
      ok: true,
      dato: nueva
    }

  } catch {

    return {
      ok: false,
      campo: 'general',
      mensaje:
        'No se pudo guardar la cita. Inténtalo nuevamente.'
    }
  }
}


/* =========================================================
   14. UPDATE - MODIFICAR CITA

   Permite:
   - Cambiar fecha.
   - Cambiar hora.
   - Cambiar servicio.
   - Cambiar motivo.
   - Cambiar veterinario.
   - Cambiar estado.

   Se usará desde Mis Citas y Administrar Citas.
========================================================= */

export function actualizarCita(
  id: string | number,
  cambios: CambiosCita
): ResultadoOperacion<Cita> {

  const citas = listarCitas()

  const indice = citas.findIndex(
    (cita) => cita.id === id
  )

  if (indice === -1) {
    return {
      ok: false,
      campo: 'id',
      mensaje: 'La cita no existe.'
    }
  }

  const anterior = citas[indice]

  const actualizada: Cita = {
    ...anterior,
    ...cambios
  }

  // Validar estados.
  const estadosValidos: EstadoCita[] = [
    'Pendiente',
    'Confirmada',
    'Completada',
    'Cancelada'
  ]

  if (!estadosValidos.includes(actualizada.estado)) {
    return {
      ok: false,
      campo: 'estado',
      mensaje: 'El estado de la cita no es válido.'
    }
  }

  // Validar servicio si fue modificado.
  if (
    cambios.servicio !== undefined &&
    !servicioValido(actualizada.servicio)
  ) {
    return {
      ok: false,
      campo: 'servicio',
      mensaje: 'Selecciona un servicio válido.'
    }
  }

  // Comprobar si necesitamos revisar la agenda.
  const cambioAgenda =
    cambios.fecha !== undefined ||
    cambios.hora !== undefined ||
    cambios.veterinarioId !== undefined ||
    (
      String(anterior.estado).toLowerCase() ===
        'cancelada' &&
      String(actualizada.estado).toLowerCase() !==
        'cancelada'
    )

  if (
    cambioAgenda &&
    actualizada.estado !== 'Cancelada'
  ) {

    const errorFecha = validarFechaYHora(
      actualizada.fecha,
      actualizada.hora,
      actualizada.veterinarioId,
      id
    )

    if (errorFecha) {
      return {
        ok: false,
        ...errorFecha
      }
    }

    // Las citas antiguas no tenían veterinario.
    if (actualizada.veterinarioId != null) {

      const errorMedico = validarMedico(actualizada)

      if (errorMedico) {
        return {
          ok: false,
          ...errorMedico
        }
      }
    }
  }

  // Actualizar el nombre del médico si corresponde.
  if (actualizada.veterinarioId != null) {

    const medico = obtenerVeterinarioPorId(
      actualizada.veterinarioId
    )

    if (medico) {
      actualizada.veterinarioNombre = medico.nombre
    }
  }

  // Guardar solamente la cita actualizada.
  try {

    citas[indice] = actualizada

    guardarColeccion(CLAVES.citas, citas)

    return {
      ok: true,
      dato: actualizada
    }

  } catch {

    return {
      ok: false,
      campo: 'general',
      mensaje: 'No se pudo actualizar la cita.'
    }
  }
}


/* =========================================================
   15. DELETE - ELIMINAR CITA

   Eliminar borra el registro.
   Cancelar conserva la cita con estado Cancelada.
========================================================= */

export function eliminarCita(
  id: string | number
): boolean {

  const citas = listarCitas()

  const restantes = citas.filter(
    (cita) => cita.id !== id
  )

  if (restantes.length === citas.length) {
    return false
  }

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
