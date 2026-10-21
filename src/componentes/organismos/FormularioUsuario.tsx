/* ORGANISMO — Formulario de datos de usuario (reutilizable).
   UN solo componente sirve para 4 formularios distintos de la EP1:
     - "registro": crear cuenta desde el sitio público
     - "perfil":   el cliente edita sus propios datos
     - "crear":    el admin crea un usuario
     - "editar":   el admin edita un usuario
   El "modo" decide qué campos se muestran y cuáles son obligatorios.
   Todos los inputs son controlados (estado con useState). */
import { useState, type FormEvent } from 'react'
import type { Rol, Usuario } from '../../types/usuario'
import {
  hayErrores,
  validarConfirmacion,
  validarCorreo,
  validarPassword,
  validarRequerido,
  validarRun,
  validarTelefono,
} from '../../utils/validaciones'
import { CampoFormulario } from '../moleculas/CampoFormulario'
import { CampoSelector } from '../moleculas/CampoSelector'
import { SelectorRegionComuna } from '../moleculas/SelectorRegionComuna'
import { Boton } from '../atomos/Boton'

export type ModoFormularioUsuario = 'registro' | 'perfil' | 'crear' | 'editar'

export interface DatosFormularioUsuario {
  run: string
  nombre: string
  apellidos: string
  correo: string
  telefono: string
  region: string
  comuna: string
  direccion: string
  password: string
  password2: string
  rol: Rol
  activo: boolean
}

type CampoTexto = Exclude<keyof DatosFormularioUsuario, 'activo'>
type Errores = Partial<Record<CampoTexto, string | null>>
export type ErrorFormularioUsuario = { campo: string; mensaje: string }

export interface FormularioUsuarioProps {
  modo: ModoFormularioUsuario
  valoresIniciales?: Partial<Usuario>
  /** Devuelve un error (ej. correo duplicado) o nada si se guardó bien. */
  onSubmit: (datos: DatosFormularioUsuario) => ErrorFormularioUsuario | void
  onCancelar?: () => void
  textoBoton?: string
}

const ROLES = [
  { valor: 'cliente', texto: 'Cliente' },
  { valor: 'admin', texto: 'Administrador' },
]

/** Valida según el modo. Es una función pura: se puede probar por separado. */
export function validarFormularioUsuario(d: DatosFormularioUsuario, modo: ModoFormularioUsuario): Errores {
  const esAdmin = modo === 'crear' || modo === 'editar'
  const passwordObligatoria = modo === 'registro' || modo === 'crear'
  const cambiaPassword = d.password.length > 0

  return {
    run: modo === 'registro' || modo === 'crear' ? validarRun(d.run) : null,
    nombre: validarRequerido(d.nombre, 'El nombre', 50),
    apellidos: validarRequerido(d.apellidos, 'Los apellidos', 100),
    correo: validarCorreo(d.correo),
    telefono: validarTelefono(d.telefono),
    region: modo === 'registro' ? validarRequerido(d.region, 'La región') : null,
    comuna: modo === 'registro' ? validarRequerido(d.comuna, 'La comuna') : null,
    direccion: esAdmin ? null : validarRequerido(d.direccion, 'La dirección', 300),
    password: passwordObligatoria || cambiaPassword ? validarPassword(d.password) : null,
    password2:
      modo !== 'perfil' && (passwordObligatoria || cambiaPassword)
        ? validarConfirmacion(d.password, d.password2)
        : null,
  }
}

export function FormularioUsuario({
  modo,
  valoresIniciales = {},
  onSubmit,
  onCancelar,
  textoBoton,
}: FormularioUsuarioProps) {
  const esAdmin = modo === 'crear' || modo === 'editar'
  const [datos, setDatos] = useState<DatosFormularioUsuario>({
    run: valoresIniciales.run ?? '',
    nombre: valoresIniciales.nombre ?? '',
    apellidos: valoresIniciales.apellidos ?? '',
    correo: valoresIniciales.correo ?? '',
    telefono: valoresIniciales.telefono ?? '',
    region: valoresIniciales.region ?? '',
    comuna: valoresIniciales.comuna ?? '',
    direccion: valoresIniciales.direccion ?? '',
    password: '', // nunca se precarga la contraseña
    password2: '',
    rol: valoresIniciales.rol ?? 'cliente',
    activo: valoresIniciales.activo ?? true,
  })
  const [errores, setErrores] = useState<Errores>({})

  // Función "fábrica": devuelve el manejador de cambio de cada campo
  const cambiar = (campo: CampoTexto) => (valor: string) => {
    setDatos((prev) => ({ ...prev, [campo]: valor }))
    setErrores((prev) => ({ ...prev, [campo]: null }))
  }

  const enviar = (e: FormEvent) => {
    e.preventDefault()
    const nuevosErrores = validarFormularioUsuario(datos, modo)
    setErrores(nuevosErrores)
    if (hayErrores(nuevosErrores)) return

    const errorServicio = onSubmit({ ...datos, correo: datos.correo.trim(), run: datos.run.trim() })
    if (errorServicio) setErrores({ [errorServicio.campo]: errorServicio.mensaje })
  }

  // Títulos de sección solo en los formularios del admin (diseño de la EP1)
  const seccion = (titulo: string) => (esAdmin ? <h4 className="admin-modal-seccion">{titulo}</h4> : null)

  return (
    <form onSubmit={enviar} noValidate className={esAdmin ? 'admin-modal-form' : undefined} aria-label="Datos del usuario">
      {modo !== 'perfil' && (
        <>
          {seccion('Identificación')}
          <div className="row">
            <div className="col-md-6">
              <CampoFormulario
                id={`${modo}-run`}
                etiqueta="RUN"
                valor={datos.run}
                onCambio={cambiar('run')}
                error={errores.run}
                placeholder="19011022K"
                maxLength={12}
                disabled={modo === 'editar'} // el RUN identifica al usuario: no se edita
              />
            </div>
            <div className="col-md-6">
              <CampoFormulario
                id={`${modo}-correo`}
                etiqueta="Correo"
                tipo="email"
                valor={datos.correo}
                onCambio={cambiar('correo')}
                error={errores.correo}
                maxLength={100}
              />
            </div>
          </div>
        </>
      )}

      {seccion('Datos personales')}
      <div className="row">
        <div className="col-md-6">
          <CampoFormulario
            id={`${modo}-nombre`}
            etiqueta="Nombre"
            valor={datos.nombre}
            onCambio={cambiar('nombre')}
            error={errores.nombre}
            maxLength={50}
          />
        </div>
        <div className="col-md-6">
          <CampoFormulario
            id={`${modo}-apellidos`}
            etiqueta="Apellidos"
            valor={datos.apellidos}
            onCambio={cambiar('apellidos')}
            error={errores.apellidos}
            maxLength={100}
          />
        </div>
      </div>

      {modo === 'perfil' && (
        <CampoFormulario
          id="perfil-correo"
          etiqueta="Correo"
          tipo="email"
          valor={datos.correo}
          onCambio={cambiar('correo')}
          error={errores.correo}
          ayuda="Solo correos @duoc.cl, @profesor.duoc.cl o @gmail.com."
          maxLength={100}
        />
      )}

      <CampoFormulario
        id={`${modo}-telefono`}
        etiqueta="Teléfono (opcional)"
        tipo="tel"
        valor={datos.telefono}
        onCambio={cambiar('telefono')}
        error={errores.telefono}
      />

      {seccion('Dirección')}
      <SelectorRegionComuna
        idPrefijo={modo}
        region={datos.region}
        comuna={datos.comuna}
        onCambio={({ region, comuna }) => {
          setDatos((prev) => ({ ...prev, region, comuna }))
          setErrores((prev) => ({ ...prev, region: null, comuna: null }))
        }}
        errorRegion={errores.region}
        errorComuna={errores.comuna}
      />
      <CampoFormulario
        id={`${modo}-direccion`}
        etiqueta="Dirección"
        valor={datos.direccion}
        onCambio={cambiar('direccion')}
        error={errores.direccion}
        maxLength={300}
      />

      {seccion('Seguridad')}
      <div className="row">
        <div className={modo === 'perfil' ? 'col-12' : 'col-md-6'}>
          <CampoFormulario
            id={`${modo}-password`}
            etiqueta={modo === 'perfil' || modo === 'editar' ? 'Nueva contraseña (dejar vacío para mantener)' : 'Contraseña'}
            tipo="password"
            valor={datos.password}
            onCambio={cambiar('password')}
            error={errores.password}
            placeholder="4-10 caracteres"
            maxLength={10}
            autoComplete="new-password"
          />
        </div>
        {modo !== 'perfil' && (
          <div className="col-md-6">
            <CampoFormulario
              id={`${modo}-password2`}
              etiqueta="Confirmar contraseña"
              tipo="password"
              valor={datos.password2}
              onCambio={cambiar('password2')}
              error={errores.password2}
              maxLength={10}
              autoComplete="new-password"
            />
          </div>
        )}
      </div>

      {esAdmin && (
        <>
          {seccion('Rol y estado')}
          <div className="row align-items-center">
            <div className="col-md-6">
              <CampoSelector
                id={`${modo}-rol`}
                etiqueta="Rol"
                valor={datos.rol}
                onCambio={(v) => setDatos((prev) => ({ ...prev, rol: v as Rol }))}
                opciones={ROLES}
              />
            </div>
            <div className="col-md-6 admin-modal-checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={datos.activo}
                  onChange={(e) => setDatos((prev) => ({ ...prev, activo: e.target.checked }))}
                />{' '}
                Usuario activo
              </label>
            </div>
          </div>
        </>
      )}

      <div className={esAdmin ? 'admin-panel-editar-botones' : 'd-flex flex-wrap gap-3'}>
        <Boton type="submit" flecha>
          {textoBoton ?? (modo === 'registro' ? 'Registrarme' : modo === 'crear' ? 'Crear usuario' : 'Guardar cambios')}
        </Boton>
        {onCancelar && (
          <Boton variante={esAdmin ? 'limpiar' : 'principal'} onClick={onCancelar} className={esAdmin ? '' : 'boton-secundario'}>
            Cancelar
          </Boton>
        )}
      </div>
    </form>
  )
}
