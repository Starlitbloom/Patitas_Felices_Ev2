/* PÁGINA — 404 para rutas que no existen. */
import { Link } from 'react-router-dom'
import { Etiqueta } from '../componentes/atomos/Etiqueta'

export default function NoEncontradoPage() {
  return (
    <main className="seccion-formulario pagina-pendiente">
      <div className="contenedor text-center">
        <Etiqueta>Error 404</Etiqueta>
        <h1>Esta página no existe 🐾</h1>
        <p>Puede que el enlace esté mal escrito o que la página se haya movido.</p>
        <Link to="/" className="boton-principal mt-3">
          Volver al inicio
        </Link>
      </div>
    </main>
  )
}
