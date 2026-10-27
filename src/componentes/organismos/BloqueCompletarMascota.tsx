/* ORGANISMO — Bloque "Editar" de una mascota.
   Se usa en el perfil del cliente y en el detalle de la mascota.
   Todo cambio requiere aprobación del personal desde el panel admin. */
import { useRef, useState, type FormEvent, type MouseEvent } from 'react'
import type { CambiosSolicitud, Mascota, Sexo } from '../../types/mascota'
import { enviarCambiosMascota, listarSolicitudes, obtenerSolicitudPendiente } from '../../services/mascotasService'
import { redimensionarImagen, validarArchivoAvatar } from '../../utils/imagen'
import { Boton } from '../atomos/Boton'
import { MensajeError } from '../atomos/MensajeError'

export interface BloqueCompletarMascotaProps {
  mascota: Mascota
  /** Correo de quien envía los cambios (el dueño/a con sesión iniciada). */
  correoSolicitante: string
  /** Se avisa al guardar para que la página vuelva a leer los datos. */
  onGuardado: () => void
}

/* Campos que el dueño/a puede completar o cambiar */
const datosDe = (m: Mascota): CambiosSolicitud => ({
  raza: m.raza ?? '',
  sexo: m.sexo ?? '',
  peso: m.peso ?? '',
  imagen: m.imagen ?? '',
  descripcion: m.descripcion ?? '',
})

export function BloqueCompletarMascota({ mascota, correoSolicitante, onGuardado }: BloqueCompletarMascotaProps) {
  const { id } = mascota

  /* Si el formulario está desplegado o escondido */
  const [abierto, setAbierto] = useState(false)

  /* Valores que se van escribiendo en el formulario (parten con los datos actuales) */
  const [datos, setDatos] = useState<CambiosSolicitud>(() => datosDe(mascota))

  /* Error de la raza (campo obligatorio) y error de otras cosas (foto, mascota inexistente) */
  const [errorRaza, setErrorRaza] = useState<string | null>(null)
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null)

  /* Referencia al input de archivo oculto, para abrirlo desde el botón "Subir foto" */
  const inputArchivo = useRef<HTMLInputElement>(null)

  /* Si ya envió cambios y aún no se resuelven, no puede enviar otros */
  const pendiente = obtenerSolicitudPendiente(id)

  /* Última respuesta de administración para esta mascota y este dueño.
     Se consulta de nuevo al volver a Mi perfil tras iniciar sesión. */
  const ultimaRespuesta = listarSolicitudes()
    .filter((solicitud) =>
      solicitud.mascotaId === id &&
      solicitud.correoSolicitante.trim().toLowerCase() === correoSolicitante.trim().toLowerCase() &&
      solicitud.estado !== 'pendiente'
    )
    .sort((a, b) =>
      (b.fechaResolucion ?? '').localeCompare(a.fechaResolucion ?? '')
    )[0]

  /* Abre o cierra el formulario; al abrir parte con los datos actuales */
  const alternar = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (!abierto) {
      setDatos(datosDe(mascota))
      setErrorRaza(null)
      setErrorGeneral(null)
    }
    setAbierto(!abierto)
  }
    /* Cierra el formulario sin guardar nada */
  const cancelar = () => {
    setAbierto(false)
    setErrorRaza(null)
    setErrorGeneral(null)
  }

  /* Foto elegida: se recorta y reduce a texto (base64) para guardarla */
  const subirFoto = async (archivo: File | undefined) => {
    if (!archivo) return
    const error = validarArchivoAvatar(archivo)
    if (error) return setErrorGeneral(error)
    try {
      const imagen = await redimensionarImagen(archivo, 300)
      setDatos((prev) => ({ ...prev, imagen }))
      setErrorGeneral(null)
    } catch {
      setErrorGeneral('No se pudo procesar la imagen.')
    }
  }

  /* Al guardar: se genera una solicitud que debe revisar administración. */
  const enviar = (e: FormEvent) => {
    e.preventDefault()
    const resultado = enviarCambiosMascota(id, correoSolicitante, {
      ...datos,
      raza: datos.raza.trim(),
      peso: datos.peso.trim(),
      descripcion: datos.descripcion.trim(),
    })

    /* Si el servicio rechaza los datos, se muestra el error junto al campo que corresponde */
    if (!resultado.ok) {
      if (resultado.campo === 'raza') setErrorRaza(resultado.mensaje)
      else setErrorGeneral(resultado.mensaje)
      return
    }

    /* Todo bien: se cierra el formulario y se avisa a la página para que recargue la lista */
    setAbierto(false)
    onGuardado()
  }

  return (
    <>
      {/* Aviso de guardado y respuesta del administrador, solo al dueño. */}
      {!pendiente && ultimaRespuesta && (
        <p
          className={`alerta-mascota ${ultimaRespuesta.estado === 'aprobada' ? 'alerta-mascota--info' : ''}`}
          role="status"
        >
          {ultimaRespuesta.estado === 'aprobada'
            ? `✅ Administración aprobó los cambios de ${mascota.nombre}. La ficha ya está actualizada.`
            : `❌ Administración rechazó los cambios de ${mascota.nombre}. Puedes volver a editarlos.`}
        </p>
      )}

      {/* Aviso y botones según el estado de la ficha */}
      <div className="mascota-acciones">
        {pendiente ? (
          <p className="alerta-mascota alerta-mascota--info" role="status">
            🕒 Solicitud enviada para {mascota.nombre}, pendiente de aprobación.
          </p>
        ) : (
          <>
            {!mascota.completo && <p className="alerta-mascota">⚠️ Datos incompletos.</p>}
            <a href="#" className="enlace-completar" onClick={alternar}>
              Editar
            </a>
            {/* Cancelar solo aparece con el formulario abierto */}
            {abierto && (
              <button type="button" className="boton-cancelar-mascota" onClick={cancelar}>
                Cancelar
              </button>
            )}
          </>
        )}
      </div>

      {/* Formulario desplegable (no se muestra mientras haya una solicitud pendiente) */}
      {abierto && !pendiente && (
        <form className="formulario-mascota" onSubmit={enviar} noValidate>
          {/* Raza (obligatoria) */}
          <div className={`campo ${errorRaza ? 'campo--invalido' : ''}`.trim()}>
            <label htmlFor={`raza-${id}`}>Raza</label>
            <input
              id={`raza-${id}`}
              type="text"
              maxLength={40}
              value={datos.raza}
              onChange={(e) => {
                setDatos((prev) => ({ ...prev, raza: e.target.value }))
                setErrorRaza(null)
              }}
            />
            <MensajeError mensaje={errorRaza} id={`raza-${id}-error`} />
          </div>

          {/* Sexo y peso */}
          <div className="fila-campos">
            <div className="campo">
              <label htmlFor={`sexo-${id}`}>Sexo</label>
              <select
                id={`sexo-${id}`}
                value={datos.sexo}
                onChange={(e) => setDatos((prev) => ({ ...prev, sexo: e.target.value as Sexo }))}
              >
                <option value="">Selecciona</option>
                <option value="Macho">Macho</option>
                <option value="Hembra">Hembra</option>
              </select>
            </div>
            <div className="campo">
              <label htmlFor={`peso-${id}`}>Peso</label>
              <input
                id={`peso-${id}`}
                type="text"
                maxLength={20}
                placeholder="Ej: 4 kg"
                value={datos.peso}
                onChange={(e) => setDatos((prev) => ({ ...prev, peso: e.target.value }))}
              />
            </div>
          </div>

          {/* Foto: el botón abre el selector de archivos (el input va oculto) */}
          <div className="campo">
            <label>Foto de la mascota (opcional)</label>
            <div className="mascota-foto-upload">
              {/* Vista previa: solo aparece si ya hay foto */}
              {datos.imagen && <img src={datos.imagen} alt={`Foto de ${mascota.nombre}`} className="mascota-foto-preview" />}
              <button type="button" className="boton-subir-foto" onClick={() => inputArchivo.current?.click()}>
                Subir foto
              </button>
              <input
                ref={inputArchivo}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => subirFoto(e.target.files?.[0])}
              />
            </div>
          </div>

          {/* Descripción (opcional) */}
          <div className="campo">
            <label htmlFor={`descripcion-${id}`}>Descripción (opcional)</label>
            <input
              id={`descripcion-${id}`}
              type="text"
              maxLength={300}
              value={datos.descripcion}
              onChange={(e) => setDatos((prev) => ({ ...prev, descripcion: e.target.value }))}
            />
          </div>

          {/* Error general (foto muy pesada, mascota inexistente, etc.) */}
          <div className={errorGeneral ? 'campo campo--invalido' : undefined}>
            <MensajeError mensaje={errorGeneral} id={`mascota-${id}-error`} />
          </div>

          {/* Guardar los cambios */}
          <Boton type="submit">
            Guardar
          </Boton>
        </form>
      )}
    </>
  )
}