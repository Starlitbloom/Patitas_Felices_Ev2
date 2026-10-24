
/* =========================================================
   SOLICITAR CITA
   FORMULARIO SOLICITAR CITA

   - Nombre, correo y teléfono chileno.
   - Nombre, especie y edad de mascota.
   - Servicio veterinario obligatorio.
   - Fecha y horario.
   - Comprobación de horarios ocupados.
   - Motivo con máximo 500 caracteres.
   - Confirmación obligatoria.
   - Errores en tiempo real.
========================================================= */

import { useState, useRef } from 'react'
import type { ChangeEvent, FormEvent } from 'react'

/* =========================================================
   1. TIPOS DE DATOS
========================================================= */

interface DatosCita {
  nombreDueno: string
  correo: string
  telefono: string
  nombreMascota: string
  tipoMascota: string
  edadMascota: string
  servicio: string
  fecha: string
  hora: string
  motivo: string
  confirmarDatos: boolean
}

type CampoCita = keyof DatosCita

type ErroresCita = Partial<Record<CampoCita, string>>

interface CitaGuardada {
  fecha?: string
  hora?: string
  estado?: string
}

const datosIniciales: DatosCita = {
  nombreDueno: '',
  correo: '',
  telefono: '',
  nombreMascota: '',
  tipoMascota: '',
  edadMascota: '',
  servicio: '',
  fecha: '',
  hora: '',
  motivo: '',
  confirmarDatos: false
}

/* =========================================================
   2. OPCIONES DE CITA
========================================================= */

const horarios = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00'
]

const servicios = [
  'Consulta general',
  'Vacunación',
  'Control preventivo',
  'Desparasitación',
  'Otro'
]

/* =========================================================
   3. EXPRESIONES REGULARES
========================================================= */

// Permite nombres con letras, tildes, ñ, apóstrofes y guiones.
const expresionNombre =
  /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+$/

const expresionCorreo =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Teléfono celular chileno.
const expresionTelefono =
  /^(?:\+?56)?9\d{8}$/

/* =========================================================
   4. FECHA ACTUAL LOCAL
========================================================= */

function obtenerFechaActual(): string {
  const hoy = new Date()

  const anio = hoy.getFullYear()
  const mes = String(hoy.getMonth() + 1).padStart(2, '0')
  const dia = String(hoy.getDate()).padStart(2, '0')

  return `${anio}-${mes}-${dia}`
}

/* =========================================================
   5. OBTENER HORARIOS OCUPADOS 
========================================================= */

function obtenerHorasOcupadas(fecha: string): string[] {
  if (!fecha) return []

  try {
    const contenido = localStorage.getItem('patitasFelices_citas')

    if (!contenido) return []

    const citas: unknown = JSON.parse(contenido)

    if (!Array.isArray(citas)) return []

    return citas
      .filter((cita: CitaGuardada) =>
        cita.fecha === fecha &&
        String(cita.estado || '').toLowerCase() !== 'cancelada'
      )
      .map((cita: CitaGuardada) => cita.hora || '')
      .filter(Boolean)

  } catch {
    return []
  }
}

/* =========================================================
   6. VALIDACIONES POR CAMPO
========================================================= */

export function validarCampoCita(
  campo: CampoCita,
  datos: DatosCita,
  horasOcupadas: string[]
): string {

  const valor = datos[campo]

  // Nombre del dueño.
  if (campo === 'nombreDueno') {
    const nombre = datos.nombreDueno.trim()

    if (!nombre) return 'Ingresa tu nombre completo.'

    if (nombre.length < 3) {
      return 'El nombre debe tener al menos 3 caracteres.'
    }

    if (nombre.length > 60) {
      return 'El nombre no puede superar los 60 caracteres.'
    }

    if (!expresionNombre.test(nombre)) {
      return 'El nombre solo puede contener letras.'
    }

    return ''
  }

  // Correo electrónico.
  if (campo === 'correo') {
    const correo = datos.correo.trim()

    if (!correo) return 'Ingresa tu correo electrónico.'

    if (!expresionCorreo.test(correo)) {
      return 'Ingresa un correo válido.'
    }

    return ''
  }

  // Teléfono chileno.
  if (campo === 'telefono') {
    const telefono = datos.telefono.replace(/[\s-]/g, '')

    if (!telefono) return 'Ingresa tu número de teléfono.'

    if (!expresionTelefono.test(telefono)) {
      return 'Usa un teléfono chileno válido. Ej: +56 9 1234 5678.'
    }

    return ''
  }

  // Nombre de la mascota.
  if (campo === 'nombreMascota') {
    const nombre = datos.nombreMascota.trim()

    if (!nombre) return 'Ingresa el nombre de tu mascota.'

    if (nombre.length < 2) {
      return 'Ingresa un nombre válido.'
    }

    if (!expresionNombre.test(nombre)) {
      return 'El nombre solo puede contener letras.'
    }

    return ''
  }

  // Tipo de mascota.
  if (campo === 'tipoMascota') {
    if (!['Perro', 'Gato', 'Otro'].includes(datos.tipoMascota)) {
      return 'Selecciona el tipo de mascota.'
    }

    return ''
  }

  // Edad de la mascota.
  if (campo === 'edadMascota') {
    const edadTexto = datos.edadMascota.trim()
    const edad = Number(edadTexto)

    if (!edadTexto) {
      return 'Ingresa la edad aproximada.'
    }

    if (
      !Number.isFinite(edad) ||
      edad < 0 ||
      edad > 30
    ) {
      return 'Ingresa una edad entre 0 y 30 años.'
    }

    return ''
  }

  // Servicio veterinario.
  if (campo === 'servicio') {
    if (!servicios.includes(datos.servicio)) {
      return 'Selecciona el tipo de atención.'
    }

    return ''
  }

  // Fecha.
  if (campo === 'fecha') {
    if (!datos.fecha) return 'Selecciona una fecha.'

    if (datos.fecha < obtenerFechaActual()) {
      return 'La fecha no puede ser anterior a hoy.'
    }

    const partes = datos.fecha.split('-').map(Number)
    const [anio, mes, dia] = partes
    const seleccionada = new Date(anio, mes - 1, dia)

    if (
      partes.length !== 3 ||
      seleccionada.getFullYear() !== anio ||
      seleccionada.getMonth() !== mes - 1 ||
      seleccionada.getDate() !== dia
    ) {
      return 'Selecciona una fecha válida.'
    }

    if (
      seleccionada.getDay() === 0 ||
      seleccionada.getDay() === 6
    ) {
      return 'Selecciona un día de lunes a viernes.'
    }

    return ''
  }

  // Horario.
  if (campo === 'hora') {
    if (!datos.hora) return 'Selecciona un horario.'

    if (!horarios.includes(datos.hora)) {
      return 'Selecciona un horario válido.'
    }

    if (horasOcupadas.includes(datos.hora)) {
      return 'Ese horario ya está reservado. Elige otro horario u otra fecha.'
    }

    // Evita seleccionar una hora que ya pasó hoy.
    if (datos.fecha === obtenerFechaActual()) {
      const ahora = new Date()
      const [hora, minutos] = datos.hora.split(':').map(Number)

      if (
        hora * 60 + minutos <=
        ahora.getHours() * 60 + ahora.getMinutes()
      ) {
        return 'Selecciona un horario futuro.'
      }
    }

    return ''
  }

  // Motivo de consulta.
  if (campo === 'motivo') {
    if (datos.motivo.trim().length > 500) {
      return 'El motivo no puede superar los 500 caracteres.'
    }

    return ''
  }

  // Confirmación.
  if (campo === 'confirmarDatos') {
    if (!datos.confirmarDatos) {
      return 'Debes confirmar que los datos son correctos.'
    }

    return ''
  }

  return String(valor) ? '' : ''
}

/* =========================================================
   7. COMPONENTE PRINCIPAL
========================================================= */

export default function FormularioSolicitarCita() {

  const [datos, setDatos] = useState<DatosCita>(datosIniciales)
  const [errores, setErrores] = useState<ErroresCita>({})
  const [visitados, setVisitados] = useState<CampoCita[]>([])
  const [mostrarResumen, setMostrarResumen] = useState(false)

  // Se actualiza al cambiar fecha y antes de revisar.
  const [horasOcupadas, setHorasOcupadas] = useState<string[]>([])

  // Referencia al formulario para enfocar el primer error.
  const formularioRef = useRef<HTMLFormElement>(null)

  /* =====================================================
     8. VALIDAR UN CAMPO AL SALIR DE ÉL
  ===================================================== */

  function manejarSalida(campo: CampoCita) {
    const ocupadas = obtenerHorasOcupadas(datos.fecha)

    setVisitados((anterior) =>
      anterior.includes(campo)
        ? anterior
        : [...anterior, campo]
    )

    setErrores((anterior) => ({
      ...anterior,
      [campo]: validarCampoCita(campo, datos, ocupadas)
    }))
  }

  /* =====================================================
     9. ACTUALIZAR CAMPOS EN TIEMPO REAL
  ===================================================== */

  function manejarCambio(
    evento: ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement |
      HTMLTextAreaElement
    >
  ) {
    const campo = evento.target.name as CampoCita

    const valor =
      evento.target instanceof HTMLInputElement &&
      evento.target.type === 'checkbox'
        ? evento.target.checked
        : evento.target.value

    const nuevosDatos = {
      ...datos,
      [campo]: valor
    } as DatosCita

    // Al cambiar fecha, reiniciamos la hora seleccionada.
    if (campo === 'fecha') {
      nuevosDatos.hora = ''
    }

    const ocupadas = obtenerHorasOcupadas(nuevosDatos.fecha)

    setDatos(nuevosDatos)
    setHorasOcupadas(ocupadas)
    setMostrarResumen(false)

    // Validamos mientras escribe si ya utilizó el campo.
    if (visitados.includes(campo)) {
      setErrores((anterior) => ({
        ...anterior,
        [campo]: validarCampoCita(campo, nuevosDatos, ocupadas),
        ...(campo === 'fecha' ? { hora: '' } : {})
      }))
    }
  }

  /* =====================================================
     10. VALIDAR TODOS LOS CAMPOS
  ===================================================== */

  function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()

    // Reconsultamos los horarios ocupados.
    const ocupadas = obtenerHorasOcupadas(datos.fecha)
    setHorasOcupadas(ocupadas)

    const campos: CampoCita[] = [
      'nombreDueno',
      'correo',
      'telefono',
      'nombreMascota',
      'tipoMascota',
      'edadMascota',
      'servicio',
      'fecha',
      'hora',
      'motivo',
      'confirmarDatos'
    ]

    const nuevosErrores: ErroresCita = {}

    campos.forEach((campo) => {
      const error = validarCampoCita(campo, datos, ocupadas)

      if (error) nuevosErrores[campo] = error
    })

    setErrores(nuevosErrores)
    setVisitados(campos)

    const primerError = campos.find(
      (campo) => Boolean(nuevosErrores[campo])
    )

    if (primerError) {
      setMostrarResumen(false)

      // Enfocamos el primer campo incorrecto.
      const elemento = formularioRef.current?.elements.namedItem(
        primerError
      )

      if (elemento instanceof HTMLElement) {
        elemento.focus()
      }

      return
    }

    // Se muestra el resumen, pero todavía no se guarda.
    setMostrarResumen(true)
  }

  /* =====================================================
     11. MOSTRAR ERRORES
  ===================================================== */

  function mostrarError(campo: CampoCita) {
    const error = errores[campo]

    if (!error) return null

    return (
      <small className="error-cita" role="alert">
        {error}
      </small>
    )
  }

  /* =====================================================
     12. FORMULARIO
  ===================================================== */

  return (
    <section className="seccion-formulario-cita">
      <div className="contenedor">

        <div className="titulo-seccion">
          <span className="seccion-etiqueta">
            Agenda tu atención
          </span>

          <h2>Completa los datos de tu cita</h2>

          <p>
            Ingresa la información necesaria para preparar
            tu solicitud de atención veterinaria.
          </p>
        </div>

        <form
          ref={formularioRef}
          className="formulario-cita"
          onSubmit={manejarEnvio}
          noValidate
        >

          {/* =====================================
              BLOQUE 1 — DATOS DEL DUEÑO
          ===================================== */}

          <fieldset className="bloque-formulario-cita">
            <legend>1. Tus datos</legend>

            <div className="grid-campos-cita">

              <div className="campo-cita">
                <label htmlFor="cita-dueno">
                  Nombre completo *
                </label>

                <input
                  id="cita-dueno"
                  name="nombreDueno"
                  type="text"
                  value={datos.nombreDueno}
                  maxLength={61}
                  onChange={manejarCambio}
                  onBlur={() => manejarSalida('nombreDueno')}
                  placeholder="Ingresa tu nombre completo"
                  aria-invalid={Boolean(errores.nombreDueno)}
                  autoComplete="name"
                />

                {mostrarError('nombreDueno')}
              </div>

              <div className="campo-cita">
                <label htmlFor="cita-correo">
                  Correo electrónico *
                </label>

                <input
                  id="cita-correo"
                  name="correo"
                  type="email"
                  value={datos.correo}
                  onChange={manejarCambio}
                  onBlur={() => manejarSalida('correo')}
                  placeholder="ejemplo@correo.cl"
                  aria-invalid={Boolean(errores.correo)}
                  autoComplete="email"
                />

                {mostrarError('correo')}
              </div>

              <div className="campo-cita">
                <label htmlFor="cita-telefono">
                  Teléfono *
                </label>

                <input
                  id="cita-telefono"
                  name="telefono"
                  type="tel"
                  value={datos.telefono}
                  onChange={manejarCambio}
                  onBlur={() => manejarSalida('telefono')}
                  placeholder="+56 9 1234 5678"
                  aria-invalid={Boolean(errores.telefono)}
                  autoComplete="tel"
                />

                {mostrarError('telefono')}
              </div>

            </div>
          </fieldset>

          {/* =====================================
              BLOQUE 2 — DATOS DE LA MASCOTA
          ===================================== */}

          <fieldset className="bloque-formulario-cita">
            <legend>2. Tu mascota</legend>

            <div className="grid-campos-cita">

              <div className="campo-cita">
                <label htmlFor="cita-mascota">
                  Nombre de la mascota *
                </label>

                <input
                  id="cita-mascota"
                  name="nombreMascota"
                  type="text"
                  value={datos.nombreMascota}
                  onChange={manejarCambio}
                  onBlur={() => manejarSalida('nombreMascota')}
                  placeholder="Ej. Luna"
                  aria-invalid={Boolean(errores.nombreMascota)}
                />

                {mostrarError('nombreMascota')}
              </div>

              <div className="campo-cita">
                <label htmlFor="cita-tipo">
                  Tipo de mascota *
                </label>

                <select
                  id="cita-tipo"
                  name="tipoMascota"
                  value={datos.tipoMascota}
                  onChange={manejarCambio}
                  onBlur={() => manejarSalida('tipoMascota')}
                  aria-invalid={Boolean(errores.tipoMascota)}
                >
                  <option value="">Selecciona una opción</option>
                  <option value="Perro">Perro</option>
                  <option value="Gato">Gato</option>
                  <option value="Otro">Otro</option>
                </select>

                {mostrarError('tipoMascota')}
              </div>

              <div className="campo-cita">
                <label htmlFor="cita-edad">
                  Edad aproximada (años) *
                </label>

                <input
                  id="cita-edad"
                  name="edadMascota"
                  type="number"
                  min="0"
                  max="30"
                  step="any"
                  value={datos.edadMascota}
                  onChange={manejarCambio}
                  onBlur={() => manejarSalida('edadMascota')}
                  placeholder="Ej. 3"
                  aria-invalid={Boolean(errores.edadMascota)}
                />

                {mostrarError('edadMascota')}
              </div>

            </div>
          </fieldset>

          {/* =====================================
              BLOQUE 3 — DATOS DE LA CITA
          ===================================== */}

          <fieldset className="bloque-formulario-cita">
            <legend>3. La cita</legend>

            <div className="grid-campos-cita">

              <div className="campo-cita">
                <label htmlFor="cita-servicio">
                  Tipo de atención *
                </label>

                <select
                  id="cita-servicio"
                  name="servicio"
                  value={datos.servicio}
                  onChange={manejarCambio}
                  onBlur={() => manejarSalida('servicio')}
                  aria-invalid={Boolean(errores.servicio)}
                >
                  <option value="">Selecciona un servicio</option>

                  {servicios.map((servicio) => (
                    <option key={servicio} value={servicio}>
                      {servicio}
                    </option>
                  ))}
                </select>

                {mostrarError('servicio')}
              </div>

              <div className="campo-cita">
                <label htmlFor="cita-fecha">
                  Fecha *
                </label>

                <input
                  id="cita-fecha"
                  name="fecha"
                  type="date"
                  min={obtenerFechaActual()}
                  value={datos.fecha}
                  onChange={manejarCambio}
                  onBlur={() => manejarSalida('fecha')}
                  aria-invalid={Boolean(errores.fecha)}
                />

                {mostrarError('fecha')}
              </div>

              <div className="campo-cita">
                <label htmlFor="cita-hora">
                  Horario *
                </label>

                <select
                  id="cita-hora"
                  name="hora"
                  value={datos.hora}
                  onChange={manejarCambio}
                  onBlur={() => manejarSalida('hora')}
                  aria-invalid={Boolean(errores.hora)}
                >
                  <option value="">Selecciona un horario</option>

                  {horarios.map((hora) => {
                    const ocupada = horasOcupadas.includes(hora)

                    return (
                      <option
                        key={hora}
                        value={hora}
                        disabled={ocupada}
                      >
                        {hora} hrs
                        {ocupada ? ' (reservado)' : ''}
                      </option>
                    )
                  })}
                </select>

                {mostrarError('hora')}
              </div>

              <div className="campo-cita campo-cita-completo">
                <label htmlFor="cita-motivo">
                  Motivo de la consulta (opcional)
                </label>

                <textarea
                  id="cita-motivo"
                  name="motivo"
                  rows={4}
                  maxLength={500}
                  value={datos.motivo}
                  onChange={manejarCambio}
                  onBlur={() => manejarSalida('motivo')}
                  placeholder="Cuéntanos por qué necesitas la atención..."
                  aria-invalid={Boolean(errores.motivo)}
                />

                {mostrarError('motivo')}

                <small className="contador-cita">
                  {datos.motivo.length} / 500 caracteres
                </small>
              </div>

              {/* Confirmación obligatoria */}
              <div className="campo-cita campo-cita-completo">

                <label className="confirmacion-cita">
                  <input
                    type="checkbox"
                    name="confirmarDatos"
                    checked={datos.confirmarDatos}
                    onChange={manejarCambio}
                    onBlur={() => manejarSalida('confirmarDatos')}
                    aria-invalid={Boolean(errores.confirmarDatos)}
                  />

                  <span>
                    Confirmo que los datos ingresados son correctos.
                  </span>
                </label>

                {mostrarError('confirmarDatos')}
              </div>

            </div>
          </fieldset>

          {/* =====================================
              BOTÓN REVISAR
          ===================================== */}

          <div className="acciones-formulario-cita">
            <button
              type="submit"
              className="boton-solicitar-cita"
            >
              Revisar solicitud →
            </button>
          </div>

        </form>

        {/* =====================================
            RESUMEN
        ===================================== */}

        {mostrarResumen && (
          <div className="resumen-solicitud-cita" role="status">

            <h3>Revisa los datos de tu cita</h3>

            <p><strong>Dueño:</strong> {datos.nombreDueno}</p>
            <p><strong>Correo:</strong> {datos.correo}</p>
            <p><strong>Teléfono:</strong> {datos.telefono}</p>
            <p><strong>Mascota:</strong> {datos.nombreMascota}</p>
            <p><strong>Tipo:</strong> {datos.tipoMascota}</p>
            <p><strong>Edad:</strong> {datos.edadMascota} años</p>
            <p><strong>Servicio:</strong> {datos.servicio}</p>
            <p><strong>Fecha:</strong> {datos.fecha}</p>
            <p><strong>Hora:</strong> {datos.hora} hrs</p>

            {datos.motivo.trim() && (
              <p>
                <strong>Motivo:</strong> {datos.motivo}
              </p>
            )}

            <p className="aviso-cita">
              Los datos son válidos.
              La cita todavía no ha sido registrada.
            </p>

          </div>
        )}

      </div>
    </section>
  )
}
