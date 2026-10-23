/* PÁGINA (contenedor) — Mi perfil (antes perfil.html).
   Estado de la página:
     - editando: alterna entre vista de solo lectura y formulario
     - errorAvatar: mensaje si la foto no se pudo guardar */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { actualizarUsuario } from '../services/usuariosService'
import { listarCitasDe, listarMascotasDe } from '../services/datosEquipoService'
import { redimensionarImagen, validarArchivoAvatar } from '../utils/imagen'
import { CabeceraPerfil } from '../componentes/organismos/CabeceraPerfil'
import { FormularioUsuario, type DatosFormularioUsuario } from '../componentes/organismos/FormularioUsuario'
import { ListaPerfil } from '../componentes/organismos/ListaPerfil'
import { DatoPerfil } from '../componentes/moleculas/DatoPerfil'
import { Boton } from '../componentes/atomos/Boton'

export default function PerfilPage() {
  const { usuario, refrescarSesion, cerrarSesion } = useAuth()
  const navigate = useNavigate()
  const [editando, setEditando] = useState(false)
  const [errorAvatar, setErrorAvatar] = useState<string | null>(null)

  if (!usuario) return null // la ruta ya está protegida; esto solo satisface a TypeScript

  const mascotas = listarMascotasDe(usuario.correo).map((m, i) => ({
    id: m.id ?? String(i),
    titulo: m.nombre || 'Mascota',
    detalle: [m.especie, m.raza].filter(Boolean).join(' · '),
  }))
  const citas = listarCitasDe(usuario.correo).map((c, i) => ({
    id: c.id ?? String(i),
    titulo: `${c.fecha || 'Fecha por confirmar'} — ${c.motivo || c.servicio || 'Consulta'}`,
    detalle: c.estado || 'Pendiente',
  }))

  const guardar = (datos: DatosFormularioUsuario) => {
    const resultado = actualizarUsuario(usuario.id, {
      nombre: datos.nombre.trim(),
      apellidos: datos.apellidos.trim(),
      correo: datos.correo,
      telefono: datos.telefono.trim(),
      region: datos.region,
      comuna: datos.comuna,
      direccion: datos.direccion.trim(),
      password: datos.password, // vacío = se mantiene la actual
    })
    if (!resultado.ok) return { campo: resultado.campo, mensaje: resultado.mensaje }
    refrescarSesion(resultado.dato)
    setEditando(false)
  }

  const cambiarAvatar = async (archivo: File) => {
    const error = validarArchivoAvatar(archivo)
    if (error) return setErrorAvatar(error)
    try {
      const base64 = await redimensionarImagen(archivo)
      const resultado = actualizarUsuario(usuario.id, { avatar: base64 })
      if (resultado.ok) refrescarSesion(resultado.dato)
      setErrorAvatar(null)
    } catch {
      setErrorAvatar('No se pudo guardar la imagen. Prueba con otra foto.')
    }
  }

  return (
    <main className="perfil-pagina">
      <div className="contenedor">
        <CabeceraPerfil usuario={usuario} onCambiarAvatar={cambiarAvatar} errorAvatar={errorAvatar} />

        <div className="perfil-grid">
          <div className={`perfil-card perfil-card--editable ${editando ? 'perfil-card--editando' : ''}`.trim()}>
            {!editando && (
              <button type="button" className="perfil-card-editar" onClick={() => setEditando(true)}>
                <span>✏️</span> Editar
              </button>
            )}
            <h2>
              <span>👤</span> Sobre
            </h2>

            {editando ? (
              <FormularioUsuario
                modo="perfil"
                valoresIniciales={usuario}
                onSubmit={guardar}
                onCancelar={() => setEditando(false)}
              />
            ) : (
              <div className="perfil-sobre-vista">
                <DatoPerfil etiqueta="Nombre" valor={usuario.nombre} />
                <DatoPerfil etiqueta="Apellidos" valor={usuario.apellidos} />
                <DatoPerfil etiqueta="Correo" valor={usuario.correo} />
                <DatoPerfil etiqueta="Teléfono" valor={usuario.telefono} vacio="No registrado" />
                <DatoPerfil etiqueta="Región" valor={usuario.region} />
                <DatoPerfil etiqueta="Comuna" valor={usuario.comuna} />
                <DatoPerfil etiqueta="Dirección" valor={usuario.direccion} />
              </div>
            )}
          </div>

          <ListaPerfil
            titulo="Mis mascotas"
            icono="🐾"
            iconoItem="🐾"
            items={mascotas}
            textoVacio="Aún no tienes mascotas registradas."
            enlace={{ to: '/solicitar-cita', texto: 'Agregar mascota' }}
          />
        </div>

        <ListaPerfil
          titulo="Mis citas"
          icono="📅"
          iconoItem="📅"
          items={citas}
          textoVacio="Aún no tienes citas agendadas."
          enlace={{ to: '/solicitar-cita', texto: 'Solicitar una cita' }}
          ancha
        />

        <p className="perfil-cerrar-sesion-wrap">
          <Boton
            flecha
            onClick={() => {
              cerrarSesion()
              navigate('/')
            }}
          >
            Cerrar sesión
          </Boton>
        </p>
      </div>
    </main>
  )
}
