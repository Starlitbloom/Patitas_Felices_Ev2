/* ORGANISMO — Cabecera del perfil: fondo, avatar (con subida de foto),
   nombre y datos rápidos. Al elegir una foto avisa con onCambiarAvatar. */
import { useRef } from 'react'
import type { UsuarioSesion } from '../../types/usuario'

export interface CabeceraPerfilProps {
  usuario: UsuarioSesion
  onCambiarAvatar: (archivo: File) => void
  errorAvatar?: string | null
}

export function CabeceraPerfil({ usuario, onCambiarAvatar, errorAvatar }: CabeceraPerfilProps) {
  const refInput = useRef<HTMLInputElement>(null)

  return (
    <>
      <div className="perfil-header-imagen">
        <img src="/img/fondo-perfil.png" alt="" />
      </div>
      <div className="perfil-header">
        <div className="perfil-header-tarjeta">
          {/* El círculo funciona como botón del input de archivo oculto */}
          <button
            type="button"
            className="perfil-avatar"
            onClick={() => refInput.current?.click()}
            aria-label="Cambiar foto de perfil"
          >
            {usuario.avatar ? <img src={usuario.avatar} alt="Foto de perfil" /> : <span>🐾</span>}
            <div className="perfil-avatar-overlay">
              <span>📷</span>
            </div>
          </button>
          <input
            ref={refInput}
            type="file"
            accept="image/*"
            hidden
            data-testid="input-avatar"
            onChange={(e) => {
              const archivo = e.target.files?.[0]
              if (archivo) onCambiarAvatar(archivo)
              e.target.value = '' // permite volver a elegir la misma foto
            }}
          />
          {errorAvatar && (
            <p className="perfil-avatar-error" role="alert">
              {errorAvatar}
            </p>
          )}

          <h1>
            {usuario.nombre} {usuario.apellidos}
          </h1>
          <div className="perfil-header-franja">
            <span className="perfil-dato">
              <span className="perfil-dato-icono">✉</span>
              <span>{usuario.correo}</span>
            </span>
            <span className="perfil-dato">
              <span className="perfil-dato-icono">📍</span>
              <span>{usuario.comuna || 'Sin comuna registrada'}</span>
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
