/* ORGANISMO — Formulario para registrar una atención (ficha clínica) de una mascota.
   Lo usa el personal de la clínica desde el panel admin.
   Además de los datos de la consulta, permite marcar los servicios realizados
   (vacunas, cirugía, exámenes...). Las vacunas marcadas se guardan también en el
   calendario de vacunas del paciente.
   Es un formulario controlado: los valores viven en el estado y se validan al guardar. */
import { useState, type FormEvent } from 'react'
import type { Especie, EstadoMascota, RegistroClinico, RegistroVacuna } from '../../types/mascota'
import { ESTADOS_MASCOTA, TEXTO_ESTADO_MASCOTA } from '../../types/mascota'
import { VETERINARIOS } from '../../data/veterinarios'
import { hayErrores, validarRequerido } from '../../utils/validaciones'
import { fechaDeHoyInput, formatearFechaInput } from '../../utils/fechas'
import { buscarVacuna, calcularEstadoVacuna, estadoActualVacuna } from '../../utils/vacunas'
import { MensajeError } from '../atomos/MensajeError'
import { CampoFormulario } from '../moleculas/CampoFormulario'
import { CampoSelector } from '../moleculas/CampoSelector'
import { SelectorServicios } from './SelectorServicios'
import { Boton } from '../atomos/Boton'
import { CampoFecha } from '../moleculas/CampoFecha'

export interface FormularioAtencionProps {
  /** Especie de la mascota: decide qué veterinarios y qué vacunas se ofrecen. */
  especie: Especie
  /** Estado que tiene hoy el paciente: es el que aparece elegido de entrada. */
  estadoActual: EstadoMascota
  /** Vacunas que el paciente ya tiene registradas. */
  aplicadas: RegistroVacuna[]
  /** Se llama con la atención lista, el estado elegido y las vacunas nuevas que se marcaron. */
  onSubmit: (registro: RegistroClinico, estado: EstadoMascota, vacunasNuevas: RegistroVacuna[]) => void
  onCancelar: () => void
}

/* Campos que escribe el usuario */
interface Datos {
  fecha: string
  motivo: string
  diagnostico: string
  tratamiento: string
  veterinario: string
}

type Errores = Partial<Record<keyof Datos, string | null>>

/* Cómo se escribe cada especie en los datos del equipo (en plural) */
const ESPECIE_EN_EQUIPO = {
  Perro: 'Perros',
  Gato: 'Gatos',
  Conejo: 'Conejos',
  Ave: 'Aves',
} as const

/* Reglas de cada campo (todos obligatorios, con largo máximo) */
function validar(d: Datos): Errores {
  return {
    fecha: validarRequerido(d.fecha, 'La fecha'),
    motivo: validarRequerido(d.motivo, 'El motivo de consulta', 100),
    diagnostico: validarRequerido(d.diagnostico, 'El diagnóstico', 300),
    tratamiento: validarRequerido(d.tratamiento, 'El tratamiento', 300),
    veterinario: validarRequerido(d.veterinario, 'El veterinario/a a cargo', 80),
  }
}

export function FormularioAtencion({ especie, estadoActual, aplicadas, onSubmit, onCancelar }: FormularioAtencionProps) {
  /* Veterinarios que atienden esta especie (la recepcionista no atiende ninguna, por eso no sale) */
  const opcionesVeterinario = VETERINARIOS.filter((v) => v.especies.includes(ESPECIE_EN_EQUIPO[especie])).map((v) => ({
    valor: v.nombre,
    texto: v.nombre,
  }))

  /* Valores del formulario: la fecha parte en el día de hoy */
  const [datos, setDatos] = useState<Datos>({
    fecha: fechaDeHoyInput(),
    motivo: '',
    diagnostico: '',
    tratamiento: '',
    veterinario: '',
  })
  const [errores, setErrores] = useState<Errores>({})

  /* Estado del paciente después de la atención (parte igual al que ya tenía) */
  const [estado, setEstado] = useState<EstadoMascota>(estadoActual)

  /* Servicios marcados que no son vacunas */
  const [servicios, setServicios] = useState<string[]>([])

  /* Vacunas nuevas marcadas: nombre → fecha de su próximo refuerzo ("2027-10-24") */
  const [vacunasNuevas, setVacunasNuevas] = useState<Record<string, string>>({})
  const [erroresVacunas, setErroresVacunas] = useState<Record<string, string>>({})

  /* Actualiza un campo y borra su error mientras se escribe */
  const cambiar =
    (campo: keyof Datos) =>
    (valor: string): void => {
      setDatos((prev) => ({ ...prev, [campo]: valor }))
      setErrores((prev) => ({ ...prev, [campo]: null }))
    }
  /* Al marcar vacunas: guarda la selección y, si el paciente estaba en "Vacunas pendientes"
     y no le queda ninguna vacuna atrasada sin renovar, el estado pasa solo a "Control al día".
     El personal puede volver a cambiarlo en el selector. */
  const cambiarVacunas = (vacunas: Record<string, string>) => {
    setVacunasNuevas(vacunas)
    setErroresVacunas({})

    const marcadas = Object.keys(vacunas)
    if (estado !== 'pendiente' || marcadas.length === 0) return

    /* Vacunas atrasadas del paciente que no se están renovando en esta atención */
    const renovadas = marcadas.map((nombre) => buscarVacuna(aplicadas, nombre))
    const quedanAtrasadas = aplicadas.some((v) => estadoActualVacuna(v) === 'atrasada' && !renovadas.includes(v))

    if (!quedanAtrasadas) setEstado('al-dia')
  }

  /* Al guardar: valida y, si todo está bien, entrega la atención y las vacunas nuevas */
  const enviar = (e: FormEvent) => {
    e.preventDefault()
    const nuevosErrores = validar(datos)
    setErrores(nuevosErrores)

    /* Cada vacuna marcada necesita su fecha de refuerzo, posterior a la atención */
    const nuevosErroresVacunas: Record<string, string> = {}
    for (const [nombre, refuerzo] of Object.entries(vacunasNuevas)) {
      if (!refuerzo) nuevosErroresVacunas[nombre] = 'La fecha del próximo refuerzo es obligatoria.'
      else if (datos.fecha && refuerzo <= datos.fecha) {
        nuevosErroresVacunas[nombre] = 'El refuerzo debe ser posterior a la fecha de la atención.'
      }
    }
    setErroresVacunas(nuevosErroresVacunas)

    if (hayErrores(nuevosErrores) || Object.keys(nuevosErroresVacunas).length > 0) return

    /* Registro de cada vacuna marcada (se aplicó el mismo día de la atención) */
    const vacunas: RegistroVacuna[] = Object.entries(vacunasNuevas).map(([nombre, refuerzo]) => ({
      vacuna: nombre,
      fecha: formatearFechaInput(datos.fecha),
      proximoRefuerzo: formatearFechaInput(refuerzo),
      estado: calcularEstadoVacuna(refuerzo),
    }))

    onSubmit(
      {
        fecha: formatearFechaInput(datos.fecha), // "2026-01-10" → "10 enero 2026"
        motivo: datos.motivo.trim(),
        diagnostico: datos.diagnostico.trim(),
        tratamiento: datos.tratamiento.trim(),
        veterinario: datos.veterinario.trim(),
        servicios: [...Object.keys(vacunasNuevas), ...servicios], // vacunas primero y luego el resto
      },
      estado,
      vacunas,
    )
  }

  return (
    <form onSubmit={enviar} noValidate className="admin-modal-form" aria-label="Registrar atención">
      <div className="row">
        <div className="col-md-6">
          {/* Fecha de la atención (calendario redondo) */}
          <CampoFecha
            id="atencion-fecha"
            etiqueta="Fecha de la atención"
            valor={datos.fecha}
            onCambio={cambiar('fecha')}
            error={errores.fecha ?? undefined}
          />
        </div>
        <div className="col-md-6">
          <CampoSelector
            id="atencion-veterinario"
            etiqueta="Veterinario/a a cargo"
            valor={datos.veterinario}
            onCambio={cambiar('veterinario')}
            opciones={opcionesVeterinario}
            textoVacio="Selecciona quién atendió"
            error={errores.veterinario}
          />
        </div>
      </div>

      <CampoFormulario
        id="atencion-motivo"
        etiqueta="Motivo de consulta"
        valor={datos.motivo}
        onCambio={cambiar('motivo')}
        error={errores.motivo}
        placeholder="Ej: Control general"
        maxLength={100}
      />

      {/* Estado del paciente: se actualiza al guardar la atención */}
      <CampoSelector
        id="atencion-estado"
        etiqueta="Estado del paciente"
        valor={estado}
        onCambio={(v) => setEstado(v as EstadoMascota)}
        opciones={ESTADOS_MASCOTA.map((e) => ({ valor: e, texto: TEXTO_ESTADO_MASCOTA[e] }))}
      />

      {/* Servicios realizados: vacunas, cirugía, desparasitación, exámenes y otros */}
      <SelectorServicios
        especie={especie}
        aplicadas={aplicadas}
        servicios={servicios}
        onCambiarServicios={setServicios}
        vacunasNuevas={vacunasNuevas}
        onCambiarVacunas={cambiarVacunas}
        erroresVacunas={erroresVacunas}
      />

      {/* Diagnóstico: caja de texto grande (CampoFormulario solo sirve para una línea) */}
      <div className={`campo ${errores.diagnostico ? 'campo--invalido' : ''}`.trim()}>
        <label htmlFor="atencion-diagnostico">Diagnóstico</label>
        <textarea
          id="atencion-diagnostico"
          rows={3}
          maxLength={300}
          value={datos.diagnostico}
          onChange={(e) => cambiar('diagnostico')(e.target.value)}
          placeholder="Describe el diagnóstico realizado..."
        />
        <MensajeError mensaje={errores.diagnostico} id="atencion-diagnostico-error" />
      </div>

      {/* Tratamiento indicado */}
      <div className={`campo ${errores.tratamiento ? 'campo--invalido' : ''}`.trim()}>
        <label htmlFor="atencion-tratamiento">Tratamiento indicado</label>
        <textarea
          id="atencion-tratamiento"
          rows={3}
          maxLength={300}
          value={datos.tratamiento}
          onChange={(e) => cambiar('tratamiento')(e.target.value)}
          placeholder="Indica medicamentos, recomendaciones o controles..."
        />
        <MensajeError mensaje={errores.tratamiento} id="atencion-tratamiento-error" />
      </div>

      {/* Botones */}
      <div className="admin-panel-editar-botones">
        <Boton type="submit">
          Guardar atención
        </Boton>
        <Boton variante="limpiar" onClick={onCancelar}>
          Cancelar
        </Boton>
      </div>
    </form>
  )
}