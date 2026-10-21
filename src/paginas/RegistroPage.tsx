/* PÁGINA (contenedor) — Registro (antes registro.html).
   Crea el usuario con el servicio, inicia sesión y lleva al perfil. */
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { crearUsuario } from '../services/usuariosService'
import { FormularioUsuario, type DatosFormularioUsuario } from '../componentes/organismos/FormularioUsuario'
import { Etiqueta } from '../componentes/atomos/Etiqueta'

export default function RegistroPage() {
  const { iniciarSesion } = useAuth()
  const navigate = useNavigate()

  const registrar = (datos: DatosFormularioUsuario) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password2, ...resto } = datos
    const resultado = crearUsuario({ ...resto, rol: 'cliente', activo: true })
    if (!resultado.ok) return { campo: resultado.campo, mensaje: resultado.mensaje }

    iniciarSesion(datos.correo, datos.password) // registro exitoso = sesión iniciada
    navigate('/perfil')
  }

  return (
    <main className="seccion-formulario">
      <div className="contenedor">
        <div className="formulario-cabecera">
          <Etiqueta>Únete a Patitas Felices</Etiqueta>
          <h1>Crea tu cuenta</h1>
          <p>Regístrate para agendar citas y llevar el historial de tu mascota.</p>
        </div>
        <div className="tarjeta-formulario tarjeta-formulario--ancha tarjeta-formulario--plana">
          <FormularioUsuario modo="registro" onSubmit={registrar} />
        </div>
        <p className="formulario-pie">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </main>
  )
}
