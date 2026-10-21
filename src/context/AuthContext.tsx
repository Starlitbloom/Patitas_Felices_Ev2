/* =========================================================
   AuthContext — estado global de la sesión.
   Guarda en un useState al usuario conectado y lo comparte
   con toda la app (header, rutas protegidas, perfil, admin)
   sin tener que pasarlo por props de componente en componente.
========================================================= */
import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Usuario, UsuarioSesion } from '../types/usuario'
import * as sesionService from '../services/sesionService'

interface AuthContextValor {
  usuario: UsuarioSesion | null
  esAdmin: boolean
  /** Personal de la clínica (admin o recepcionista): puede entrar al panel. */
  esPersonal: boolean
  iniciarSesion: (correo: string, password: string) => ReturnType<typeof sesionService.autenticar>
  cerrarSesion: () => void
  /** Refresca la sesión después de editar los datos del usuario conectado. */
  refrescarSesion: (usuarioActualizado: Usuario) => void
}

const AuthContext = createContext<AuthContextValor | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  // Valor inicial: la sesión guardada (si el usuario recarga la página, sigue conectado)
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(() => sesionService.obtenerSesion())

  const iniciarSesion: AuthContextValor['iniciarSesion'] = (correo, password) => {
    const resultado = sesionService.autenticar(correo, password)
    if (resultado.ok) setUsuario(resultado.dato)
    return resultado
  }

  const cerrarSesion = () => {
    sesionService.cerrarSesion()
    setUsuario(null)
  }

  const refrescarSesion = (usuarioActualizado: Usuario) => {
    setUsuario(sesionService.guardarSesion(usuarioActualizado))
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        esAdmin: usuario?.rol === 'admin',
        esPersonal: usuario?.rol === 'admin' || usuario?.rol === 'recepcionista',
        iniciarSesion,
        cerrarSesion,
        refrescarSesion,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValor {
  const contexto = useContext(AuthContext)
  if (!contexto) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return contexto
}
