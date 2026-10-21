/* PÁGINA (contenedor) — Inicio de sesión (antes login.html).
   El formulario solo valida y avisa; esta página decide qué hacer:
   autenticar con el contexto y redirigir según el rol. */
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FormularioLogin, type DatosLogin, type ErrorLogin } from '../componentes/organismos/FormularioLogin'
import { Etiqueta } from '../componentes/atomos/Etiqueta'

export default function LoginPage() {
  const { iniciarSesion } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const desde = (location.state as { desde?: string } | null)?.desde

  const manejarLogin = ({ correo, password }: DatosLogin): ErrorLogin | void => {
    const resultado = iniciarSesion(correo, password)
    if (!resultado.ok) return { campo: resultado.campo as ErrorLogin['campo'], mensaje: resultado.mensaje }
    // Admin va al panel; cliente vuelve a la página que quería ver o a su perfil
    navigate(resultado.dato.rol === 'admin' ? '/admin' : (desde ?? '/perfil'), { replace: true })
  }

  return (
    <main className="login-split">
      <div className="login-split-imagen">
        <img src="/img/gato-saltando.jpg" alt="Gato saltando" />
        <div className="login-split-overlay" />
        <div className="login-split-texto">
          <span className="hero-etiqueta">Veterinaria Patitas Felices</span>
          <h2>Bienvenido de vuelta</h2>
          <p>Porque tu mascota también es familia, aquí puedes cuidar cada detalle de su bienestar sin salir de casa.</p>
        </div>
      </div>

      <div className="login-split-formulario">
        <FormularioLogin onSubmit={manejarLogin} />
        <p className="formulario-pie">
          ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>
        <p className="formulario-pie formulario-pie--demo">
          <Etiqueta>Cuenta demo admin</Etiqueta> ma.calfileo@duoc.cl · 1234
        </p>
      </div>
    </main>
  )
}
