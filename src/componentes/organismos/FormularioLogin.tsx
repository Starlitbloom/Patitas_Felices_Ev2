/* ORGANISMO — Formulario de inicio de sesión.
   Formulario CONTROLADO: correo y contraseña viven en useState.
   Valida formato antes de llamar a onSubmit; si el padre responde
   con un error (ej. "Contraseña incorrecta"), lo muestra en su campo. */
import { useState, type FormEvent } from 'react'
import { validarCorreo, validarPassword } from '../../utils/validaciones'
import { CampoFormulario } from '../moleculas/CampoFormulario'
import { Boton } from '../atomos/Boton'

export interface DatosLogin {
  correo: string
  password: string
}

type CampoLogin = keyof DatosLogin
export type ErrorLogin = { campo: CampoLogin; mensaje: string }

export interface FormularioLoginProps {
  /** Devuelve un error si las credenciales no son válidas, o nada si todo salió bien. */
  onSubmit: (datos: DatosLogin) => ErrorLogin | void
}

export function FormularioLogin({ onSubmit }: FormularioLoginProps) {
  const [datos, setDatos] = useState<DatosLogin>({ correo: '', password: '' })
  const [errores, setErrores] = useState<Partial<Record<CampoLogin, string | null>>>({})

  const cambiar = (campo: CampoLogin) => (valor: string) => {
    setDatos((prev) => ({ ...prev, [campo]: valor }))
    setErrores((prev) => ({ ...prev, [campo]: null })) // al escribir se limpia el error del campo
  }

  const enviar = (e: FormEvent) => {
    e.preventDefault()
    const nuevosErrores = {
      correo: validarCorreo(datos.correo),
      password: validarPassword(datos.password),
    }
    setErrores(nuevosErrores)
    if (nuevosErrores.correo || nuevosErrores.password) return

    const error = onSubmit({ correo: datos.correo.trim(), password: datos.password })
    if (error) setErrores({ [error.campo]: error.mensaje })
  }

  return (
    <form className="tarjeta-formulario tarjeta-formulario--plana" onSubmit={enviar} noValidate aria-label="Inicio de sesión">
      <div className="formulario-cabecera formulario-cabecera--izq">
        <h1>Inicia sesión</h1>
        <p>Accede para agendar citas y revisar el historial de tu mascota.</p>
      </div>

      <CampoFormulario
        id="correo"
        etiqueta="Correo"
        tipo="email"
        icono="✉"
        valor={datos.correo}
        onCambio={cambiar('correo')}
        error={errores.correo}
        placeholder="tu-correo@duoc.cl"
        maxLength={100}
        autoComplete="email"
      />
      <CampoFormulario
        id="password"
        etiqueta="Contraseña"
        tipo="password"
        icono="🔒"
        valor={datos.password}
        onCambio={cambiar('password')}
        error={errores.password}
        placeholder="Ingresa tu contraseña"
        autoComplete="current-password"
      />

      <Boton type="submit" variante="degradado" flecha>
        Iniciar sesión
      </Boton>
    </form>
  )
}
