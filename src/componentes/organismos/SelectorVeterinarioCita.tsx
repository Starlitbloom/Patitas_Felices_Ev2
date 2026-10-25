
/* =========================================================
   SELECTOR DE VETERINARIOS
   VETERINARIA PATITAS FELICES

   Funcionalidades:
   - Reutilizar el servicio veterinariosService del equipo.
   - Filtrar médicos según la especie de mascota.
   - Mostrar fotografías, nombres y especialidades.
   - Permitir seleccionar un médico veterinario.
   - Mostrar los días y horarios de atención.
========================================================= */

import {
  listarVeterinarios,
  filtrarVeterinarios
} from '../../services/veterinariosService'

import type {
  Especie
} from '../../types/veterinario'

/* =========================================================
   1. PROPIEDADES DEL COMPONENTE
========================================================= */

interface Props {
  tipoMascota: string
  otraEspecie: string
  veterinarioId: number | null
  onSeleccionar: (id: number) => void
  error?: string
}

/* =========================================================
   2. CONVERTIR TIPO DE MASCOTA A ESPECIE DEL EQUIPO
========================================================= */

function obtenerEspecie(
  tipoMascota: string,
  otraEspecie: string
): Especie | '' {

  if (tipoMascota === 'Perro') {
    return 'Perros'
  }

  if (tipoMascota === 'Gato') {
    return 'Gatos'
  }

  if (tipoMascota === 'Otro') {
    if (otraEspecie === 'Ave') {
      return 'Aves'
    }

    if (otraEspecie === 'Conejo') {
      return 'Conejos'
    }
  }

  return ''
}

/* =========================================================
   3. SELECTOR DE VETERINARIOS
========================================================= */

export default function SelectorVeterinarioCita({
  tipoMascota,
  otraEspecie,
  veterinarioId,
  onSeleccionar,
  error
}: Props) {

  //  Identificamos la especie seleccionada.
  const especie = obtenerEspecie(
    tipoMascota,
    otraEspecie
  )

  //  Reutilizamos los datos del equipo.
  const veterinarios = especie
    ? filtrarVeterinarios(listarVeterinarios(), {
        texto: '',
        cargo: 'Médico veterinario',
        especie
      })
    : []

  return (
    <section className="selector-veterinario-cita">

      {/* =========================================
          ENCABEZADO
      ========================================= */}

      <div className="encabezado-veterinarios-cita">

        <span className="etiqueta-veterinarios-cita">
          Atención personalizada
        </span>

        <h4>Elige a tu veterinario</h4>

        <p>
          Selecciona al profesional que atenderá
          a tu mascota.
        </p>

      </div>

      {/* =========================================
          SI NO SE HA SELECCIONADO ESPECIE
      ========================================= */}

      {!especie && (
        <div className="aviso-veterinarios-cita">
          {tipoMascota === 'Otro'
            ? 'Indica si tu mascota es un ave o un conejo para mostrar los veterinarios.'
            : 'Selecciona primero el tipo de mascota para conocer a los veterinarios.'}
        </div>
      )}

      {/* =========================================
          TARJETAS DE VETERINARIOS
      ========================================= */}

      {especie && veterinarios.length > 0 && (

        <div
          className="grid-veterinarios-cita"
          role="radiogroup"
          aria-label="Selecciona tu veterinario"
        >

          {veterinarios.map((veterinario) => {

            const seleccionado =
              veterinarioId === veterinario.id

            return (
              <label
                key={veterinario.id}
                className={`tarjeta-veterinario-cita ${
                  seleccionado
                    ? 'veterinario-seleccionado'
                    : ''
                }`}
              >

                {/* Selección con radio */}
                <input
                  type="radio"
                  name="veterinarioCita"
                  value={veterinario.id}
                  checked={seleccionado}
                  onChange={() =>
                    onSeleccionar(veterinario.id)
                  }
                />

                {/* Fotografía original */}
                <div className="foto-veterinario-cita">

                  <img
                    src={veterinario.imagen}
                    alt={`Fotografía de ${veterinario.nombre}`}
                    loading="lazy"
                  />

                </div>

                {/* Nombre */}
                <h5>{veterinario.nombre}</h5>

                {/* Especialidad */}
                <p className="especialidad-veterinario-cita">
                  {veterinario.area}
                </p>

                {/* Experiencia */}
                <span className="experiencia-veterinario-cita">
                  {veterinario.experiencia} años de experiencia
                </span>

                {/* Horario habitual */}
                <div className="horario-veterinario-cita">

                  <strong>Días de atención</strong>

                  <small>
                    {veterinario.dias.join(', ')}
                  </small>

                  <strong>Horario</strong>

                  <small>
                    {veterinario.horario} hrs
                  </small>

                </div>

                {/* Indicador visual de selección */}
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
          SIN VETERINARIOS COMPATIBLES
      ========================================= */}

      {especie && veterinarios.length === 0 && (
        <div className="aviso-veterinarios-cita">
          No hay médicos veterinarios registrados
          para esta especie.
        </div>
      )}

      {/* =========================================
          MENSAJE DE VALIDACIÓN
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
