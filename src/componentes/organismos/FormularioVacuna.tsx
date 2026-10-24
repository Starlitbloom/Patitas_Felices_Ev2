/* ORGANISMO — Formulario para registrar una vacuna aplicada a una mascota.
   Lo usa el personal de la clínica desde el panel admin.
   - La vacuna se elige de un catálogo según la especie (conejos y aves: texto libre).
   - Cada vacuna se registra una sola vez: mientras esté al día no se puede repetir.
     Se desbloquea cuando falta 1 mes o menos para el refuerzo (o si ya está atrasado);
     al registrarla de nuevo, reemplaza al registro anterior.
   - El estado se calcula siempre con la fecha de hoy, a partir del próximo refuerzo. */
import { useState, type FormEvent } from 'react'
import type { Especie, EstadoVacuna, RegistroVacuna } from '../../types/mascota'
import { hayErrores, validarRequerido } from '../../utils/validaciones'
import { fechaDeHoyInput, fechaTextoAIso, formatearFechaInput } from '../../utils/fechas'
import { CampoFormulario } from '../moleculas/CampoFormulario'
import { CampoSelector } from '../moleculas/CampoSelector'
import { Boton } from '../atomos/Boton'
import { CampoFecha } from '../moleculas/CampoFecha'

export interface FormularioVacunaProps {
  /** Especie de la mascota: decide qué vacunas se ofrecen. */
  especie: Especie
  /** Vacunas que la mascota ya tiene registradas (vacío = aún no se ha vacunado). */
  aplicadas: RegistroVacuna[]
  /** Se llama con la vacuna lista para guardar. */
  onSubmit: (registro: RegistroVacuna) => void
  /** Quita un registro de la lista de vacunas aplicadas (por su posición). */
  onEliminar: (indice: number) => void
  onCancelar: () => void
}

/* Catálogo de vacunas de la clínica por especie (el mismo de la EP1).
   Conejos y aves no tienen catálogo: ahí el nombre se escribe a mano. */
const CATALOGO_VACUNAS: Partial<Record<Especie, string[]>> = {
  Perro: ['Vacuna antirrábica canina (VA001)', 'Vacuna sextuple canina (VA002)', 'Vacuna Bordetella canina (VA005)'],
  Gato: ['Vacuna bivalente felina (VA003)', 'Vacuna triple felina (VA004)', 'Vacuna antirrábica felina (VA006)'],
}

/* Campos que escribe el usuario (las fechas vienen como "2026-01-10") */
interface Datos {
  vacuna: string
  fecha: string
  proximoRefuerzo: string
}

type Errores = Partial<Record<keyof Datos, string | null>>

/* Estado según el próximo refuerzo ("2026-11-24"):
   ya pasó → atrasada; falta 1 mes o menos → próxima; más que eso → al día */
function calcularEstado(proximoRefuerzo: string): EstadoVacuna {
  const hoy = fechaDeHoyInput()
  if (proximoRefuerzo < hoy) return 'atrasada'

  const limite = new Date()
  limite.setMonth(limite.getMonth() + 1)
  const mes = String(limite.getMonth() + 1).padStart(2, '0')
  const dia = String(limite.getDate()).padStart(2, '0')
  const dentroDeUnMes = `${limite.getFullYear()}-${mes}-${dia}`

  return proximoRefuerzo <= dentroDeUnMes ? 'proxima' : 'al-dia'
}

/* Estado de una vacuna ya guardada, calculado con la fecha de hoy.
   Si su fecha no se puede leer, se usa el estado que tenía guardado. */
function estadoActual(registro: RegistroVacuna): EstadoVacuna {
  const iso = fechaTextoAIso(registro.proximoRefuerzo)
  return iso ? calcularEstado(iso) : registro.estado
}

/* Busca si la mascota ya tiene registrada esa vacuna (sin importar mayúsculas) */
function buscarRegistro(aplicadas: RegistroVacuna[], nombre: string): RegistroVacuna | undefined {
  const buscado = nombre.trim().toLowerCase()
  return aplicadas.find((v) => v.vacuna.trim().toLowerCase() === buscado)
}

/* Reglas: todo obligatorio, no repetir una vacuna que sigue al día y el refuerzo después de la aplicación */
function validar(d: Datos, aplicadas: RegistroVacuna[]): Errores {
  let errorVacuna = validarRequerido(d.vacuna, 'El nombre de la vacuna', 80)
  const existente = buscarRegistro(aplicadas, d.vacuna)
  if (!errorVacuna && existente && estadoActual(existente) === 'al-dia') {
    errorVacuna = 'Esta vacuna ya está al día. Se podrá registrar de nuevo cuando falte 1 mes o menos para el refuerzo.'
  }

  let errorRefuerzo = validarRequerido(d.proximoRefuerzo, 'La fecha del próximo refuerzo')
  if (!errorRefuerzo && d.fecha && d.proximoRefuerzo <= d.fecha) {
    errorRefuerzo = 'El próximo refuerzo debe ser posterior a la fecha de aplicación.'
  }

  return {
    vacuna: errorVacuna,
    fecha: validarRequerido(d.fecha, 'La fecha de aplicación'),
    proximoRefuerzo: errorRefuerzo,
  }
}

export function FormularioVacuna({ especie, aplicadas, onSubmit, onEliminar, onCancelar }: FormularioVacunaProps) {
  /* Vacunas disponibles para esta especie (vacío si no hay catálogo) */
  const catalogo = CATALOGO_VACUNAS[especie] ?? []

  /* Cada registro con su posición original (para quitarlo) y su estado de hoy */
  const registros = aplicadas.map((v, indice) => ({ v, indice, estado: estadoActual(v) }))
  const vigentes = registros.filter((r) => r.estado !== 'atrasada')
  const atrasadas = registros.filter((r) => r.estado === 'atrasada')

  /* Opciones del desplegable: solo se bloquean las que siguen al día.
     Las próximas o atrasadas se pueden elegir de nuevo (reemplazan al registro anterior). */
  const opciones = catalogo.map((nombre) => {
    const existente = buscarRegistro(aplicadas, nombre)
    if (!existente) return { valor: nombre, texto: nombre }

    const estado = estadoActual(existente)
    if (estado === 'atrasada') return { valor: nombre, texto: `${nombre} — refuerzo atrasado` }
    if (estado === 'proxima') return { valor: nombre, texto: `${nombre} — refuerzo próximo` }
    return { valor: nombre, texto: `${nombre} — ya aplicada (al día)`, deshabilitada: true }
  })

  /* Valores del formulario: la fecha de aplicación parte en el día de hoy */
  const [datos, setDatos] = useState<Datos>({
    vacuna: '',
    fecha: fechaDeHoyInput(),
    proximoRefuerzo: '',
  })
  const [errores, setErrores] = useState<Errores>({})

  /* Actualiza un campo y borra su error mientras se escribe */
  const cambiar =
    (campo: keyof Datos) =>
    (valor: string): void => {
      setDatos((prev) => ({ ...prev, [campo]: valor }))
      setErrores((prev) => ({ ...prev, [campo]: null }))
    }

  /* Al guardar: valida y, si todo está bien, entrega el registro */
  const enviar = (e: FormEvent) => {
    e.preventDefault()
    const nuevosErrores = validar(datos, aplicadas)
    setErrores(nuevosErrores)
    if (hayErrores(nuevosErrores)) return

    onSubmit({
      vacuna: datos.vacuna.trim(),
      fecha: formatearFechaInput(datos.fecha), // "2026-01-10" → "10 enero 2026"
      proximoRefuerzo: formatearFechaInput(datos.proximoRefuerzo),
      estado: calcularEstado(datos.proximoRefuerzo),
    })
  }

  return (
    <form onSubmit={enviar} noValidate className="admin-modal-form" aria-label="Registrar vacuna">
      {/* Aviso verde: solo si tiene vacunas vigentes (cada una con su ✕ para quitarla) */}
      {vigentes.length > 0 && (
        <div className="aviso-vacunado" role="status">
          <p>
            <strong>✅ El paciente ya está vacunado con:</strong>
          </p>
          <ul>
            {vigentes.map(({ v, indice, estado }) => (
              <li key={indice}>
                <span>
                  {v.vacuna} · {v.fecha}
                  {estado === 'proxima' && ` · refuerzo ${v.proximoRefuerzo}`}
                </span>
                <button type="button" className="aviso-vacunado-quitar" onClick={() => onEliminar(indice)} aria-label={`Quitar ${v.vacuna}`} title="Quitar este registro">
                  ✕
                </button>
              </li>
            ))}
          </ul>
          <p>Ahora selecciona su próxima vacuna.</p>
        </div>
      )}

      {/* Aviso amarillo: solo si tiene refuerzos vencidos */}
      {atrasadas.length > 0 && (
        <div className="aviso-vacunado aviso-vacunado--atrasado" role="status">
          <p>
            <strong>⚠️ Tiene refuerzos atrasados:</strong>
          </p>
          <ul>
            {atrasadas.map(({ v, indice }) => (
              <li key={indice}>
                <span>
                  {v.vacuna} · el refuerzo venció el {v.proximoRefuerzo}
                </span>
                <button type="button" className="aviso-vacunado-quitar" onClick={() => onEliminar(indice)} aria-label={`Quitar ${v.vacuna}`} title="Quitar este registro">
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Con catálogo: lista desplegable. Sin catálogo (conejo, ave): texto libre */}
      {catalogo.length > 0 ? (
        <CampoSelector
          id="vacuna-nombre"
          etiqueta="Vacuna"
          valor={datos.vacuna}
          onCambio={cambiar('vacuna')}
          opciones={opciones}
          textoVacio="Selecciona una vacuna"
          error={errores.vacuna}
        />
      ) : (
        <CampoFormulario
          id="vacuna-nombre"
          etiqueta="Vacuna"
          valor={datos.vacuna}
          onCambio={cambiar('vacuna')}
          error={errores.vacuna}
          ayuda={`La clínica aún no tiene un catálogo de vacunas para ${especie.toLowerCase()}s: escribe el nombre.`}
          placeholder="Nombre de la vacuna"
          maxLength={80}
        />
      )}

      <div className="row">
        <div className="col-md-6">
          {/* Fecha en que se aplicó la vacuna */}
          <CampoFecha
            id="vacuna-fecha"
            etiqueta="Fecha de aplicación"
            valor={datos.fecha}
            onCambio={cambiar('fecha')}
            error={errores.fecha ?? undefined}
          />
        </div>
        <div className="col-md-6">
          {/* Próximo refuerzo: no deja elegir un día anterior a la aplicación */}
          <CampoFecha
            id="vacuna-refuerzo"
            etiqueta="Próximo refuerzo"
            valor={datos.proximoRefuerzo}
            onCambio={cambiar('proximoRefuerzo')}
            error={errores.proximoRefuerzo ?? undefined}
            minimo={datos.fecha}
          />
        </div>
      </div>

      <div className="admin-panel-editar-botones admin-botones-compactos">
        <Boton type="submit">Guardar vacuna</Boton>
        <Boton variante="limpiar" onClick={onCancelar}>
          Cancelar
        </Boton>
      </div>
    </form>
  )
}