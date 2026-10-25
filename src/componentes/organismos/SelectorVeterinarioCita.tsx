
/* =========================================================
   VETERINARIA PATITAS FELICES

   FUNCIONALIDADES:

   1. Obtiene los veterinarios del equipo.
   2. Identifica la especie de la mascota.
   3. Filtra por el servicio solicitado.
   4. Muestra solamente médicos compatibles.
   5. Muestra fotografías originales.
   6. Muestra nombre, especialidad y experiencia.
   7. Permite seleccionar un veterinario.
   8. Informa cuando la clínica debe confirmar
      quién realizará un procedimiento.
========================================================= */

/* =========================================================
   1. IMPORTACIONES

   El catálogo se encarga de comprobar:
   - Servicio.
   - Especie.
   - Especialidad del veterinario.
========================================================= */

import {
  obtenerEspecieCita,
  obtenerServicioCita,
  profesionalPorConfirmar,
  veterinariosPorServicio
} from '../../services/catalogoCitasService'


/* =========================================================
   2. PROPIEDADES DEL COMPONENTE

   Props significa propiedades.

   El formulario principal envía:
   - tipoMascota: Perro, Gato u Otro.
   - otraEspecie: Ave o Conejo.
   - servicio: atención solicitada.
   - veterinarioId: médico elegido.
   - onSeleccionar: función para guardar la elección.
   - error: mensaje si hay un problema.
========================================================= */

interface Props {

  tipoMascota: string

  otraEspecie: string

  servicio: string

  veterinarioId: number | null

  onSeleccionar: (id: number) => void

  error?: string
}


/* =========================================================
   3. COMPONENTE PRINCIPAL

   El componente se actualiza automáticamente
   cuando el formulario cambia de:
   - Mascota.
   - Servicio.
   - Veterinario seleccionado.
========================================================= */

export default function SelectorVeterinarioCita({

  tipoMascota,
  otraEspecie,
  servicio,
  veterinarioId,
  onSeleccionar,
  error

}: Props) {


  /* =====================================================
     4. IDENTIFICAR LA ESPECIE

     Ejemplos:
     Perro -> Perro
     Gato -> Gato
     Otro + Ave -> Ave
     Otro + Conejo -> Conejo

     Si no ha seleccionado una especie,
     el resultado será null.
  ===================================================== */

  const especie = obtenerEspecieCita(
    tipoMascota,
    otraEspecie
  )


  /* =====================================================
     5. OBTENER INFORMACIÓN DEL SERVICIO

     Consultamos el catálogo para conocer:
     - Nombre del servicio.
     - Especies que pueden recibirlo.
     - Si requiere confirmación de profesional.
  ===================================================== */

  const servicioElegido = obtenerServicioCita(
    servicio
  )


  /* =====================================================
     6. FILTRAR VETERINARIOS

     Esta función busca médicos que cumplan
     las condiciones:

     1. Ser médico veterinario.
     2. Atender la especie seleccionada.
     3. Tener la especialidad correspondiente,
        cuando el catálogo la identifica.
  ===================================================== */

  const veterinarios = veterinariosPorServicio(
    especie,
    servicio
  )


  /* =====================================================
     7. COMPROBAR SI DEBE CONFIRMARSE EL PROFESIONAL
  ===================================================== */

  const requiereConfirmacion =
    profesionalPorConfirmar(servicio)


  /* =====================================================
     8. COMPROBAR QUE EL SERVICIO CORRESPONDA
        A LA ESPECIE
  ===================================================== */

  const servicioCompatible = Boolean(

    especie &&

    servicioElegido &&

    servicioElegido.especies.includes(especie)

  )


  /* =====================================================
     9. INTERFAZ VISUAL
  ===================================================== */

  return (

    <section className="selector-veterinario-cita">


      {/* =========================================
          ENCABEZADO DEL SELECTOR
      ========================================= */}

      <div className="encabezado-veterinarios-cita">

        <span className="etiqueta-veterinarios-cita">
          Atención personalizada
        </span>

        <h4>
          Elige a tu veterinario
        </h4>

        <p>
          Te mostraremos los profesionales que
          pueden atender a tu mascota según
          el servicio seleccionado.
        </p>

      </div>


      {/* =========================================
          CASO 1: NO HA SELECCIONADO MASCOTA

          Primero debe elegir Perro, Gato
          o indicar si tiene un Ave o Conejo.
      ========================================= */}

      {!especie && (

        <div className="aviso-veterinarios-cita">

          {tipoMascota === 'Otro'

            ? 'Primero indica si tu mascota es un ave o un conejo.'

            : 'Primero selecciona el tipo de mascota.'}

        </div>

      )}


      {/* =========================================
          CASO 2: NO HA SELECCIONADO SERVICIO

          Los veterinarios se filtrarán
          después de elegir una atención.
      ========================================= */}

      {especie && !servicio && (

        <div className="aviso-veterinarios-cita">

          Selecciona el servicio veterinario
          que necesita tu mascota para conocer
          a los profesionales disponibles.

        </div>

      )}


      {/* =========================================
          CASO 3: SERVICIO INCOMPATIBLE

          Impide mostrar médicos para una atención
          que no corresponde a la especie.

          Ejemplo:
          Gato + vacuna exclusiva para perros.
      ========================================= */}

      {especie && servicio && !servicioCompatible && (

        <div
          className="aviso-veterinarios-cita"
          role="alert"
        >

          El servicio seleccionado no corresponde
          a esta especie.

          Selecciona otra atención veterinaria.

        </div>

      )}


      {/* =========================================
          CASO 4: SERVICIO CORRECTO

          Mostramos la atención que se eligió.
      ========================================= */}

      {servicioCompatible && servicioElegido && (

        <div className="resumen-veterinario-elegido">

          <strong>
            Servicio seleccionado:
          </strong>

          {' '}

          {servicioElegido.nombre}

        </div>

      )}


      {/* =========================================
          AVISO DE CONFIRMACIÓN

          Si el catálogo no asigna un especialista
          específico para ese procedimiento,
          lo indicamos claramente.

          Esto evita presentar como confirmada
          una asignación que todavía no lo está.
      ========================================= */}

      {servicioCompatible && requiereConfirmacion && (

        <div
          className="aviso-horario-veterinario"
          role="note"
        >

          <strong>
            Profesional sujeto a confirmación
          </strong>

          <p>
            Este servicio requiere confirmar
            qué profesional realizará la atención.

            Puedes seleccionar una preferencia,
            pero la clínica deberá confirmar
            la asignación al revisar tu solicitud.
          </p>

        </div>

      )}


      {/* =========================================
          CASO 5: TARJETAS DE VETERINARIOS

          map() recorre la lista filtrada.

          Por cada médico se crea una tarjeta
          con su información original.
      ========================================= */}

      {servicioCompatible && veterinarios.length > 0 && (

        <div
          className="grid-veterinarios-cita"
          role="radiogroup"
          aria-label="Selecciona tu veterinario"
        >

          {veterinarios.map((veterinario) => {


            /* =====================================
               COMPROBAR SI ESTA TARJETA
               ES LA SELECCIONADA

               Si coincide el ID, se aplica
               la clase veterinario-seleccionado.
            ===================================== */

            const seleccionado =
              veterinarioId === veterinario.id


            return (

              <label

                key={veterinario.id}

                className={
                  `tarjeta-veterinario-cita ${
                    seleccionado
                      ? 'veterinario-seleccionado'
                      : ''
                  }`
                }

              >


                {/* =================================
                    RADIO BUTTON

                    Permite elegir solamente
                    un veterinario a la vez.

                    Cuando cambia, ejecutamos
                    onSeleccionar con el ID.
                ================================= */}

                <input

                  type="radio"

                  name="veterinarioCita"

                  value={veterinario.id}

                  checked={seleccionado}

                  onChange={() => {
                    onSeleccionar(veterinario.id)
                  }}

                  aria-label={
                    `Seleccionar a ${veterinario.nombre}`
                  }

                />


                {/* =================================
                    FOTOGRAFÍA ORIGINAL DEL VETERINARIO
                ================================= */}

                <div className="foto-veterinario-cita">

                  <img

                    src={veterinario.imagen}

                    alt={
                      `Fotografía de ${veterinario.nombre}`
                    }

                    loading="lazy"

                  />

                </div>


                {/* =================================
                    NOMBRE DEL MÉDICO
                ================================= */}

                <h5>
                  {veterinario.nombre}
                </h5>


                {/* =================================
                    ESPECIALIDAD

                    Ejemplos:
                    Consulta general.
                    Cirugía menor.
                    Vacunación y animales exóticos.
                ================================= */}

                <p className="especialidad-veterinario-cita">

                  {veterinario.area}

                </p>


                {/* =================================
                    EXPERIENCIA PROFESIONAL
                ================================= */}

                <span className="experiencia-veterinario-cita">

                  {veterinario.experiencia}
                  {' '}
                  años de experiencia

                </span>


                {/* =================================
                    DÍAS Y HORARIOS DE ATENCIÓN
                ================================= */}

                <div className="horario-veterinario-cita">

                  <strong>
                    Días de atención
                  </strong>

                  <small>
                    {veterinario.dias.join(', ')}
                  </small>

                  <strong>
                    Horario
                  </strong>

                  <small>
                    {veterinario.horario} hrs
                  </small>

                </div>


                {/* =================================
                    BOTÓN VISUAL DE SELECCIÓN

                    Si el usuario elige al médico:
                    - La tarjeta cambia a rosado.
                    - El texto indica seleccionado.
                ================================= */}

                <span className="boton-elegir-veterinario">

                  {seleccionado

                    ? '✓ Veterinario seleccionado'

                    : 'Seleccionar veterinario'}

                </span>

              </label>

            )

          })}

        </div>

      )}


      {/* =========================================
          CASO 6: SIN VETERINARIOS COMPATIBLES

          Si el catálogo no encuentra un médico
          que reúna los requisitos, mostramos
          un mensaje claro al usuario.
      ========================================= */}

      {servicioCompatible && veterinarios.length === 0 && (

        <div
          className="aviso-veterinarios-cita"
          role="status"
        >

          No hay veterinarios registrados
          para realizar este servicio
          a la especie seleccionada.

          Puedes elegir otra atención
          o comunicarte con la clínica.

        </div>

      )}


      {/* =========================================
          MENSAJES DE VALIDACIÓN
      ========================================= */}

      {error && (

        <small
          className="mensaje-error"
          role="alert"
        >

          {error}

        </small>

      )}

    </section>

  )
}