/* ORGANISMO — Formulario de mascota (crear/editar), mismo
   componente para los dos modos del panel admin. */
import { useState, type FormEvent } from 'react'
import type { Especie, Mascota, Sexo } from '../../types/mascota'
import { ESPECIES_MASCOTA, ESTADOS_MASCOTA, TEXTO_ESTADO_MASCOTA } from '../../types/mascota'
import { hayErrores, validarRequerido } from '../../utils/validaciones'
import { CampoFormulario } from '../moleculas/CampoFormulario'
import { CampoSelector } from '../moleculas/CampoSelector'
import { Boton } from '../atomos/Boton'

export type ModoFormularioMascota = 'crear' | 'editar'

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

type Errores = Partial<Record<keyof DatosFormularioMascota, string | null>>
export type ErrorFormularioMascota = { campo: string; mensaje: string }

export interface FormularioMascotaProps {
  modo: ModoFormularioMascota
  valoresIniciales?: Partial<Mascota>
  onSubmit: (datos: DatosFormularioMascota) => ErrorFormularioMascota | void
  onCancelar?: () => void
}

const VALORES_VACIOS: DatosFormularioMascota = {
  nombre: '',
  especie: '',
  raza: '',
  edad: '',
  sexo: '',
  peso: '',
  dueño: '',
  correoDueño: '',
  imagen: '',
  estado: 'al-dia',
  descripcion: '',
}

export function validarFormularioMascota(d: DatosFormularioMascota): Errores {
  return {
    nombre: validarRequerido(d.nombre, 'El nombre', 40),
    especie: d.especie ? null : 'Selecciona una especie.',
    raza: validarRequerido(d.raza, 'La raza', 40),
    edad: validarRequerido(d.edad, 'La edad', 20),
    dueño: validarRequerido(d.dueño, 'El nombre del dueño/a', 60),
  }
}

export function FormularioMascota({ modo, valoresIniciales = {}, onSubmit, onCancelar }: FormularioMascotaProps) {
  const [datos, setDatos] = useState<DatosFormularioMascota>({
    ...VALORES_VACIOS,
    ...valoresIniciales,
  })
  const [errores, setErrores] = useState<Errores>({})

  const cambiar =
    (campo: keyof DatosFormularioMascota) =>
    (valor: string): void => {
      setDatos((prev) => ({ ...prev, [campo]: valor }))
      setErrores((prev) => ({ ...prev, [campo]: null }))
    }

  const enviar = (e: FormEvent) => {
    e.preventDefault()
    const nuevosErrores = validarFormularioMascota(datos)
    setErrores(nuevosErrores)
    if (hayErrores(nuevosErrores)) return

    const errorServicio = onSubmit(datos)
    if (errorServicio) setErrores({ [errorServicio.campo]: errorServicio.mensaje })
  }

  return (
    <form onSubmit={enviar} noValidate className="admin-modal-form" aria-label="Datos de la mascota">
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

      <div className="row">
        <div className="col-md-6">
          <CampoFormulario id={`${modo}-raza`} etiqueta="Raza" valor={datos.raza} onCambio={cambiar('raza')} error={errores.raza} maxLength={40} />
        </div>
        <div className="col-md-6">
          <CampoFormulario id={`${modo}-edad`} etiqueta="Edad" valor={datos.edad} onCambio={cambiar('edad')} error={errores.edad} placeholder="Ej: 2 años" maxLength={20} />
        </div>
      </div>

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

      <h4 className="admin-modal-seccion">Estado clínico y foto</h4>
      <div className="row">
        <div className="col-md-6">
          <CampoSelector
            id={`${modo}-estado`}
            etiqueta="Estado"
            valor={datos.estado}
            onCambio={(v) => setDatos((prev) => ({ ...prev, estado: v as Mascota['estado'] }))}
            opciones={ESTADOS_MASCOTA.map((e) => ({ valor: e, texto: TEXTO_ESTADO_MASCOTA[e] }))}
          />
        </div>
        <div className="col-md-6">
          <CampoFormulario
            id={`${modo}-imagen`}
            etiqueta="URL de la foto"
            valor={datos.imagen}
            onCambio={cambiar('imagen')}
            placeholder="Ej: /img/nombre-mascota.jpg"
            ayuda="Si la dejas vacía, se usa una foto genérica."
            maxLength={200}
          />
        </div>
      </div>

      <CampoFormulario
        id={`${modo}-descripcion`}
        etiqueta="Descripción (opcional)"
        valor={datos.descripcion}
        onCambio={cambiar('descripcion')}
        maxLength={300}
      />

      <div className="admin-panel-editar-botones">
        <Boton type="submit" flecha>
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