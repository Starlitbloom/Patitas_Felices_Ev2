/* ORGANISMO — Formulario de mascota (crear/editar), mismo
   componente para los dos modos del panel admin. */
import { useRef, useState, type FormEvent } from 'react'
import type { Especie, Mascota, Sexo } from '../../types/mascota'
import { ESPECIES_MASCOTA, ESTADOS_MASCOTA, TEXTO_ESTADO_MASCOTA } from '../../types/mascota'
import { hayErrores, validarRequerido } from '../../utils/validaciones'
import { redimensionarImagen, validarArchivoAvatar } from '../../utils/imagen'
import { MensajeError } from '../atomos/MensajeError'
import { CampoFormulario } from '../moleculas/CampoFormulario'
import { CampoSelector } from '../moleculas/CampoSelector'
import { Boton } from '../atomos/Boton'

export type ModoFormularioMascota = 'crear' | 'editar'

/* Datos que entrega el formulario a la página cuando todo es válido */
export interface DatosFormularioMascota {
  nombre: string
  especie: Especie | ''
  raza: string
  edad: string
  sexo: Sexo
  peso: string
  dueño: string
  correoDueño: string
  imagen: string
  estado: Mascota['estado']
  descripcion: string
}

/* Mientras se escribe, el estado puede estar sin elegir ('') */
type DatosEdicion = Omit<DatosFormularioMascota, 'estado'> & { estado: Mascota['estado'] | '' }

/* Un mensaje de error (o null) por cada campo */
type Errores = Partial<Record<keyof DatosFormularioMascota, string | null>>

/* Error que devuelve la página si el servicio rechaza los datos */
export type ErrorFormularioMascota = { campo: string; mensaje: string }

/* Foto que se usa cuando no se sube ni se pega ninguna */
const IMAGEN_GENERICA = '/img/vision.png'

export interface FormularioMascotaProps {
  modo: ModoFormularioMascota
  /* Datos de la mascota a editar (en modo crear no se pasa nada) */
  valoresIniciales?: Partial<Mascota>
  onSubmit: (datos: DatosFormularioMascota) => ErrorFormularioMascota | void
  onCancelar?: () => void
}

/* Formulario en blanco: así empieza el modo "crear" */
const VALORES_VACIOS: DatosEdicion = {
  nombre: '',
  especie: '',
  raza: '',
  edad: '',
  sexo: '',
  peso: '',
  dueño: '',
  correoDueño: '',
  imagen: '',
  estado: '',
  descripcion: '',
}

/* Campos obligatorios: devuelve el error de cada uno (null si está bien) */
export function validarFormularioMascota(d: DatosEdicion): Errores {
  return {
    nombre: validarRequerido(d.nombre, 'El nombre', 40),
    especie: d.especie ? null : 'Selecciona una especie.',
    raza: validarRequerido(d.raza, 'La raza', 40),
    edad: validarRequerido(d.edad, 'La edad', 20),
    dueño: validarRequerido(d.dueño, 'El nombre del dueño/a', 60),
    estado: d.estado ? null : 'Selecciona un estado.',
  }
}

export function FormularioMascota({ modo, valoresIniciales = {}, onSubmit, onCancelar }: FormularioMascotaProps) {
  /* Valores de los campos: vacíos al crear, con los datos de la mascota al editar */
  const [datos, setDatos] = useState<DatosEdicion>({
    ...VALORES_VACIOS,
    ...valoresIniciales,
  })
  const [errores, setErrores] = useState<Errores>({})

  /* Referencia al input de archivo, para poder vaciarlo desde el código */
  const inputArchivo = useRef<HTMLInputElement>(null)

  /* Actualiza un campo de texto y borra su error */
  const cambiar =
    (campo: keyof DatosFormularioMascota) =>
    (valor: string): void => {
      setDatos((prev) => ({ ...prev, [campo]: valor }))
      setErrores((prev) => ({ ...prev, [campo]: null }))
    }

  /* Al enviar: valida, y si todo está bien entrega los datos a la página */
  const enviar = (e: FormEvent) => {
    e.preventDefault()
    const nuevosErrores = validarFormularioMascota(datos)
    setErrores(nuevosErrores)
    if (hayErrores(nuevosErrores)) return

    const { estado } = datos
    if (estado === '') return

    /* Sin foto elegida se guarda la genérica */
    const errorServicio = onSubmit({ ...datos, estado, imagen: datos.imagen.trim() || IMAGEN_GENERICA })
    if (errorServicio) setErrores({ [errorServicio.campo]: errorServicio.mensaje })
  }

  /* Foto subida desde el equipo: se reduce y se guarda como texto (base64) */
  const subirFoto = async (archivo: File | undefined) => {
    if (!archivo) return
    const errorArchivo = validarArchivoAvatar(archivo)
    if (errorArchivo) {
      setErrores((prev) => ({ ...prev, imagen: errorArchivo }))
      return
    }
    try {
      const dataUrl = await redimensionarImagen(archivo, 400)
      setDatos((prev) => ({ ...prev, imagen: dataUrl }))
      setErrores((prev) => ({ ...prev, imagen: null }))
    } catch {
      setErrores((prev) => ({ ...prev, imagen: 'No se pudo leer la imagen seleccionada.' }))
    }
  }

  /* Foto por enlace: se limpia el archivo elegido para que no queden dos fuentes */
  const escribirUrl = (url: string) => {
    if (inputArchivo.current) inputArchivo.current.value = ''
    cambiar('imagen')(url)
  }

  return (
    <form onSubmit={enviar} noValidate className="admin-modal-form" aria-label="Datos de la mascota">
      {/* Datos generales: nombre y especie */}
      <h4 className="admin-modal-seccion">Datos generales</h4>
      <div className="row">
        <div className="col-md-6">
          <CampoFormulario id={`${modo}-nombre`} etiqueta="Nombre" valor={datos.nombre} onCambio={cambiar('nombre')} error={errores.nombre} maxLength={40} />
        </div>
        <div className="col-md-6">
          <CampoSelector
            id={`${modo}-especie`}
            etiqueta="Especie"
            valor={datos.especie}
            onCambio={(v) => {
              setDatos((prev) => ({ ...prev, especie: v as Especie }))
              setErrores((prev) => ({ ...prev, especie: null }))
            }}
            opciones={ESPECIES_MASCOTA.map((e) => ({ valor: e, texto: e }))}
            textoVacio="Selecciona la especie"
            error={errores.especie}
          />
        </div>
      </div>

      {/* Raza y edad */}
      <div className="row">
        <div className="col-md-6">
          <CampoFormulario id={`${modo}-raza`} etiqueta="Raza" valor={datos.raza} onCambio={cambiar('raza')} error={errores.raza} maxLength={40} />
        </div>
        <div className="col-md-6">
          <CampoFormulario id={`${modo}-edad`} etiqueta="Edad" valor={datos.edad} onCambio={cambiar('edad')} error={errores.edad} placeholder="Ej: 2 años" maxLength={20} />
        </div>
      </div>

      {/* Sexo y peso (opcionales) */}
      <div className="row">
        <div className="col-md-6">
          <CampoSelector
            id={`${modo}-sexo`}
            etiqueta="Sexo"
            valor={datos.sexo}
            onCambio={(v) => setDatos((prev) => ({ ...prev, sexo: v as Sexo }))}
            opciones={[
              { valor: 'Macho', texto: 'Macho' },
              { valor: 'Hembra', texto: 'Hembra' },
            ]}
            textoVacio="Selecciona"
          />
        </div>
        <div className="col-md-6">
          <CampoFormulario id={`${modo}-peso`} etiqueta="Peso" valor={datos.peso} onCambio={cambiar('peso')} placeholder="Ej: 4 kg" maxLength={20} />
        </div>
      </div>

      {/* Dueño/a: el correo es lo que vincula la mascota con su cuenta */}
      <h4 className="admin-modal-seccion">Dueño/a</h4>
      <div className="row">
        <div className="col-md-6">
          <CampoFormulario id={`${modo}-dueno`} etiqueta="Nombre del dueño/a" valor={datos.dueño} onCambio={cambiar('dueño')} error={errores.dueño} maxLength={60} />
        </div>
        <div className="col-md-6">
          <CampoFormulario
            id={`${modo}-correoDueno`}
            etiqueta="Correo del dueño/a"
            tipo="email"
            valor={datos.correoDueño}
            onCambio={cambiar('correoDueño')}
            error={errores.correoDueño}
            maxLength={100}
          />
        </div>
      </div>

      {/* Estado clínico (obligatorio) */}
      <h4 className="admin-modal-seccion">Estado clínico y foto</h4>
      <CampoSelector
        id={`${modo}-estado`}
        etiqueta="Estado"
        valor={datos.estado}
        onCambio={cambiar('estado')}
        opciones={ESTADOS_MASCOTA.map((e) => ({ valor: e, texto: TEXTO_ESTADO_MASCOTA[e] }))}
        textoVacio="Selecciona un estado"
        error={errores.estado}
      />

      {/* Foto: vista previa + subir archivo o pegar una URL */}
      <div className={`campo ${errores.imagen ? 'campo--invalido' : ''}`.trim()}>
        <label htmlFor={`${modo}-imagen-archivo`}>Foto de la mascota</label>
        <div className="admin-imagen-campo">
          {/* Vista previa: si la imagen falla o no hay, muestra la genérica */}
          <img
            className="admin-imagen-vista-previa"
            src={datos.imagen || IMAGEN_GENERICA}
            alt="Vista previa"
            onError={(e) => {
              if (!e.currentTarget.src.endsWith(IMAGEN_GENERICA)) e.currentTarget.src = IMAGEN_GENERICA
            }}
          />
          <div className="admin-imagen-campo-controles">
            {/* Opción 1: subir un archivo desde el equipo */}
            <input
              ref={inputArchivo}
              id={`${modo}-imagen-archivo`}
              type="file"
              accept="image/*"
              onChange={(e) => subirFoto(e.target.files?.[0])}
            />
            {/* Opción 2: pegar el enlace de una imagen (vacío si la foto fue subida) */}
            <input
              type="text"
              value={datos.imagen.startsWith('data:') ? '' : datos.imagen}
              onChange={(e) => escribirUrl(e.target.value)}
              placeholder="O pega una URL: /img/nombre-mascota.jpg"
              aria-label="URL de la foto"
              autoComplete="off"
            />
          </div>
        </div>
        <p className="campo__ayuda">
          Sube una foto desde tu equipo o pega el enlace de una imagen. Si la dejas vacía, se usará una foto genérica.
        </p>
        <MensajeError mensaje={errores.imagen} id={`${modo}-imagen-error`} />
      </div>

      {/* Descripción (opcional) */}
      <CampoFormulario
        id={`${modo}-descripcion`}
        etiqueta="Descripción (opcional)"
        valor={datos.descripcion}
        onCambio={cambiar('descripcion')}
        maxLength={300}
      />

      {/* Botones: guardar y cancelar */}
      <div className="admin-panel-editar-botones admin-botones-compactos">
        <Boton type="submit">
          {modo === 'crear' ? 'Crear mascota' : 'Guardar cambios'}
        </Boton>
        {onCancelar && (
          <Boton variante="limpiar" onClick={onCancelar}>
            Cancelar
          </Boton>
        )}
      </div>
    </form>
  )
}