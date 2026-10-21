/* PÁGINA — Sección que todavía no se migra a React.
   Deja las rutas listas para que cada integrante reemplace este
   componente por su página real (ver docs/GUIA-EQUIPO.md). */
import { Link } from 'react-router-dom'
import { Etiqueta } from '../componentes/atomos/Etiqueta'
import { EncabezadoAdmin } from '../componentes/organismos/EncabezadoAdmin'

export interface PaginaPendienteProps {
  titulo: string
  modulo: string
  admin?: boolean
}

export default function PaginaPendiente({ titulo, modulo, admin = false }: PaginaPendienteProps) {
  if (admin) {
    return (
      <>
        <EncabezadoAdmin>{titulo} 🐾</EncabezadoAdmin>
        <p className="admin-tabla-vacia">Esta vista es parte del módulo de {modulo} y se está migrando a React.</p>
      </>
    )
  }
  return (
    <main className="seccion-formulario pagina-pendiente">
      <div className="contenedor text-center">
        <Etiqueta>Módulo de {modulo}</Etiqueta>
        <h1>{titulo}</h1>
        <p>Esta sección se está migrando a React. ¡Vuelve pronto!</p>
        <Link to="/" className="boton-principal mt-3">
          Volver al inicio
        </Link>
      </div>
    </main>
  )
}
