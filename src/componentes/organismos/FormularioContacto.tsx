
/* =========================================================
    CONTACTO
    FORMULARIO DE CONTACTO
   
   Funcionalidades:
   - Nombre entre 3 y 60 caracteres.
   - Correo electrónico válido.
   - Teléfono celular chileno válido.
   - Asunto obligatorio.
   - Mensaje de 10 a 1000 caracteres.
   - Validaciones en tiempo real.
   - Mensajes de error.
   - Enfoque en el primer campo incorrecto.
   - Confirmación local.
========================================================= */

import { useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'


/* =========================================================
   1. INTERFACES Y TIPOS
========================================================= */

//Datos que contiene el formulario.
interface DatosContacto {
  nombre: string
  correo: string
  telefono: string
  asunto: string
  mensaje: string
}

//  Tipos de campos.
type CampoContacto = keyof DatosContacto

//  Mensajes de error.
type ErroresContacto = Partial<
  Record<CampoContacto, string>
>

// Registro de campos visitados.
type CamposVisitados = Partial<
  Record<CampoContacto, boolean>
>


/* =========================================================
   2. VALORES INICIALES
========================================================= */

const datosIniciales: DatosContacto = {
  nombre: '',
  correo: '',
  telefono: '',
  asunto: '',
  mensaje: ''
}


/* =========================================================
   3. EXPRESIONES REGULARES
========================================================= */

// Permite letras, tildes, ñ, ü y espacios.
const expresionNombre =
  /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/

// Comprueba el formato general del correo.
const expresionCorreo =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Celular chileno:
// +56 9 1234 5678
// 56912345678
// 912345678
const expresionTelefono =
  /^(?:\+?56)?9\d{8}$/


/* =========================================================
   4. FUNCIÓN PARA VALIDAR CADA CAMPO

   Retorna un mensaje de error cuando el dato
   es incorrecto y una cadena vacía cuando es válido.
========================================================= */

export function validarCampoContacto(
  campo: CampoContacto,
  valor: string
): string {

  const texto = valor.trim()

  //Validar nombre.
  if (campo === 'nombre') {

    if (!texto) {
      return 'Por favor, ingresa tu nombre.'
    }

    if (texto.length < 3) {
      return 'El nombre debe tener al menos 3 caracteres.'
    }

    if (texto.length > 60) {
      return 'El nombre no puede superar los 60 caracteres.'
    }

    if (!expresionNombre.test(texto)) {
      return 'El nombre solo puede contener letras y espacios.'
    }

    return ''
  }

  // Validar correo.
  if (campo === 'correo') {

    if (!texto) {
      return 'Por favor, ingresa tu correo electrónico.'
    }

    if (!expresionCorreo.test(texto)) {
      return 'Ingresa un correo electrónico válido.'
    }

    return ''
  }

  //  Validar teléfono chileno.
  if (campo === 'telefono') {

    if (!texto) {
      return 'Por favor, ingresa tu teléfono.'
    }

    // Quitamos espacios y guiones para validar.
    const telefonoLimpio = texto.replace(/[\s-]/g, '')

    if (!expresionTelefono.test(telefonoLimpio)) {
      return 'Ingresa un celular chileno válido. Ejemplo: +56 9 1234 5678.'
    }

    return ''
  }

  // Validar asunto.
  if (campo === 'asunto') {

    const asuntosPermitidos = [
      'Consulta general',
      'Servicios veterinarios',
      'Información sobre citas',
      'Otro'
    ]

    if (!texto) {
      return 'Selecciona el motivo de tu consulta.'
    }

    if (!asuntosPermitidos.includes(texto)) {
      return 'Selecciona una opción válida.'
    }

    return ''
  }

  //  Validar mensaje.
  if (campo === 'mensaje') {

    if (!texto) {
      return 'Por favor, escribe tu mensaje.'
    }

    if (texto.length < 10) {
      return 'Tu mensaje debe tener al menos 10 caracteres.'
    }

    if (texto.length > 1000) {
      return 'Tu mensaje no puede superar los 1000 caracteres.'
    }

    return ''
  }

  return ''
}


/* =========================================================
   5. COMPONENTE FORMULARIO CONTACTO
========================================================= */

export default function FormularioContacto() {

  // Estado de los datos.
  const [datos, setDatos] =
    useState<DatosContacto>(datosIniciales)

  //  Estado de los errores.
  const [errores, setErrores] =
    useState<ErroresContacto>({})

  //  Campos que el usuario ya utilizó.
  const [visitados, setVisitados] =
    useState<CamposVisitados>({})

  // Mensaje de confirmación local.
  const [enviado, setEnviado] = useState(false)

  //Referencia a cada campo.
  const referencias = useRef<
    Partial<
      Record<
        CampoContacto,
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null
      >
    >
  >({})


  /* =========================================================
     6. ACTUALIZAR Y VALIDAR EN TIEMPO REAL
  ========================================================= */

  function manejarCambio(
    evento: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {

    const campo = evento.target.name as CampoContacto
    const valor = evento.target.value

    // Actualizamos el dato.
    setDatos((anterior) => ({
      ...anterior,
      [campo]: valor
    }))

    // Si ya interactuó con el campo,
    // actualizamos su error mientras escribe.
    if (visitados[campo]) {
      setErrores((anterior) => ({
        ...anterior,
        [campo]: validarCampoContacto(campo, valor)
      }))
    }

    // Ocultamos la confirmación anterior.
    setEnviado(false)
  }


  /* =========================================================
     7. VALIDAR AL SALIR DE UN CAMPO

     Cuando el usuario termina de escribir,
     comprobamos el valor.
  ========================================================= */

  function manejarSalida(campo: CampoContacto) {

    setVisitados((anterior) => ({
      ...anterior,
      [campo]: true
    }))

    setErrores((anterior) => ({
      ...anterior,
      [campo]: validarCampoContacto(campo, datos[campo])
    }))
  }


  /* =========================================================
     8. VALIDAR EL FORMULARIO COMPLETO
  ========================================================= */

  function validarFormulario(): ErroresContacto {

    const nuevosErrores: ErroresContacto = {}

    const campos: CampoContacto[] = [
      'nombre',
      'correo',
      'telefono',
      'asunto',
      'mensaje'
    ]

    // Recorremos todos los campos.
    campos.forEach((campo) => {

      const error = validarCampoContacto(
        campo,
        datos[campo]
      )

      if (error) {
        nuevosErrores[campo] = error
      }

    })

    return nuevosErrores
  }


  /* =========================================================
     9. ENVIAR FORMULARIO
  ========================================================= */

  function manejarEnvio(
    evento: FormEvent<HTMLFormElement>
  ) {

    // Evitamos que la página se recargue.
    evento.preventDefault()

    setEnviado(false)

    // Ejecutamos todas las validaciones.
    const nuevosErrores = validarFormulario()

    setErrores(nuevosErrores)

    // Marcamos todos los campos como visitados.
    setVisitados({
      nombre: true,
      correo: true,
      telefono: true,
      asunto: true,
      mensaje: true
    })

    const campos: CampoContacto[] = [
      'nombre',
      'correo',
      'telefono',
      'asunto',
      'mensaje'
    ]

    // Encontramos el primer campo con error.
    const primerCampoError = campos.find(
      (campo) => Boolean(nuevosErrores[campo])
    )

    // Si existe un error, enfocamos ese campo.
    if (primerCampoError) {

      referencias.current[primerCampoError]?.focus()

      return
    }

    /* =====================================================
       FORMULARIO
    ===================================================== */

    setEnviado(true)

    // Limpiamos el formulario.
    setDatos(datosIniciales)

    // Limpiamos los errores.
    setErrores({})

    // Reiniciamos los campos visitados.
    setVisitados({})
  }


  /* =========================================================
     10. DISEÑO DEL FORMULARIO
  ========================================================= */

  return (
    <section className="seccion-formulario-contacto">
      <div className="contenedor">

        <div className="contacto-formulario-layout">

          {/* =========================================
              INFORMACIÓN DE LA IZQUIERDA
          ========================================= */}

          <div className="contacto-formulario-intro">

            <span className="contacto-etiqueta-intro">
              Cuéntanos
            </span>

            <h2>
              ¿En qué podemos ayudarte?
            </h2>

            <p>
              Completa el formulario con tus datos
              y tu mensaje. Revisaremos tu consulta
              para poder orientarte.
            </p>

            {/* Tarjeta informativa */}
            <div className="contacto-aviso-mascota">

              <span
                className="contacto-aviso-icono"
                aria-hidden="true"
              >
                ♡
              </span>

              <div>
                <h3>Tu mascota nos importa</h3>

                <p>
                  Intentaremos responder tu consulta
                  lo antes posible.
                </p>
              </div>

            </div>

          </div>


          {/* =========================================
              FORMULARIO DE LA DERECHA
          ========================================= */}

          <form
            id="formularioContacto"
            className="formulario-contacto"
            onSubmit={manejarEnvio}
            noValidate
          >

            {/* =====================================
                NOMBRE COMPLETO
            ===================================== */}

            <div className="campo-contacto">

              <label htmlFor="contacto-nombre">
                Nombre completo *
              </label>

              <input
                id="contacto-nombre"
                name="nombre"
                type="text"
                placeholder="Ingresa tu nombre"
                value={datos.nombre}
                maxLength={61}
                autoComplete="name"
                onChange={manejarCambio}
                onBlur={() => manejarSalida('nombre')}
                aria-invalid={Boolean(errores.nombre)}
                aria-describedby={
                  errores.nombre
                    ? 'error-contacto-nombre'
                    : undefined
                }
                ref={(elemento) => {
                  referencias.current.nombre = elemento
                }}
              />

              {errores.nombre && (
                <small
                  id="error-contacto-nombre"
                  className="error-contacto"
                  role="alert"
                >
                  {errores.nombre}
                </small>
              )}

            </div>


            {/* =====================================
                CORREO ELECTRÓNICO
            ===================================== */}

            <div className="campo-contacto">

              <label htmlFor="contacto-correo">
                Correo electrónico *
              </label>

              <input
                id="contacto-correo"
                name="correo"
                type="email"
                placeholder="ejemplo@correo.cl"
                value={datos.correo}
                autoComplete="email"
                onChange={manejarCambio}
                onBlur={() => manejarSalida('correo')}
                aria-invalid={Boolean(errores.correo)}
                aria-describedby={
                  errores.correo
                    ? 'error-contacto-correo'
                    : undefined
                }
                ref={(elemento) => {
                  referencias.current.correo = elemento
                }}
              />

              {errores.correo && (
                <small
                  id="error-contacto-correo"
                  className="error-contacto"
                  role="alert"
                >
                  {errores.correo}
                </small>
              )}

            </div>


            {/* =====================================
                TELÉFONO CHILENO
            ===================================== */}

            <div className="campo-contacto">

              <label htmlFor="contacto-telefono">
                Teléfono *
              </label>

              <input
                id="contacto-telefono"
                name="telefono"
                type="tel"
                placeholder="+56 9 1234 5678"
                value={datos.telefono}
                autoComplete="tel"
                onChange={manejarCambio}
                onBlur={() => manejarSalida('telefono')}
                aria-invalid={Boolean(errores.telefono)}
                aria-describedby={
                  errores.telefono
                    ? 'error-contacto-telefono'
                    : undefined
                }
                ref={(elemento) => {
                  referencias.current.telefono = elemento
                }}
              />

              {errores.telefono && (
                <small
                  id="error-contacto-telefono"
                  className="error-contacto"
                  role="alert"
                >
                  {errores.telefono}
                </small>
              )}

            </div>


            {/* =====================================
                ASUNTO
            ===================================== */}

            <div className="campo-contacto">

              <label htmlFor="contacto-asunto">
                Asunto *
              </label>

              <select
                id="contacto-asunto"
                name="asunto"
                value={datos.asunto}
                onChange={manejarCambio}
                onBlur={() => manejarSalida('asunto')}
                aria-invalid={Boolean(errores.asunto)}
                aria-describedby={
                  errores.asunto
                    ? 'error-contacto-asunto'
                    : undefined
                }
                ref={(elemento) => {
                  referencias.current.asunto = elemento
                }}
              >

                <option value="">
                  Selecciona una opción
                </option>

                <option value="Consulta general">
                  Consulta general
                </option>

                <option value="Servicios veterinarios">
                  Servicios veterinarios
                </option>

                <option value="Información sobre citas">
                  Información sobre citas
                </option>

                <option value="Otro">
                  Otro
                </option>

              </select>

              {errores.asunto && (
                <small
                  id="error-contacto-asunto"
                  className="error-contacto"
                  role="alert"
                >
                  {errores.asunto}
                </small>
              )}

            </div>


            {/* =====================================
                MENSAJE
            ===================================== */}

            <div className="campo-contacto campo-mensaje">

              <label htmlFor="contacto-mensaje">
                Mensaje *
              </label>

              <textarea
                id="contacto-mensaje"
                name="mensaje"
                placeholder="Escribe aquí tu consulta..."
                value={datos.mensaje}
                rows={5}
                maxLength={1001}
                onChange={manejarCambio}
                onBlur={() => manejarSalida('mensaje')}
                aria-invalid={Boolean(errores.mensaje)}
                aria-describedby={
                  errores.mensaje
                    ? 'error-contacto-mensaje'
                    : undefined
                }
                ref={(elemento) => {
                  referencias.current.mensaje = elemento
                }}
              />

              {errores.mensaje && (
                <small
                  id="error-contacto-mensaje"
                  className="error-contacto"
                  role="alert"
                >
                  {errores.mensaje}
                </small>
              )}

              {/* Contador de caracteres */}
              <small className="contador-contacto">
                {datos.mensaje.length} / 1000 caracteres
              </small>

            </div>


            {/* =====================================
                BOTÓN ENVIAR
            ===================================== */}

            <div className="acciones-contacto">

              <button
                type="submit"
                className="boton-enviar-contacto"
              >
                Enviar mensaje →
              </button>

            </div>


            {/* =====================================
                MENSAJE DE CONFIRMACIÓN
            ===================================== */}

            {enviado && (
              <p
                className="mensaje-exito-contacto"
                role="status"
              >
                ✓ Formulario validado correctamente.
                Esta es una demostración: el mensaje
                todavía no se ha enviado a la veterinaria.
              </p>
            )}

          </form>

        </div>

      </div>
    </section>
  )
}
