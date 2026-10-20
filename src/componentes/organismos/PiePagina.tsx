/* ORGANISMO — Pie de página (igual en todo el sitio público).
   En la EP1 estaba copiado en cada HTML; ahora existe una sola vez. */
import { Link } from 'react-router-dom'

const REDES = [
  { nombre: 'Facebook', icono: '/img/logo-facebook.png' },
  { nombre: 'Instagram', icono: '/img/logo-instagram.png' },
  { nombre: 'WhatsApp', icono: '/img/logo-whatsapp.png' },
]

export function PiePagina() {
  return (
    <footer className="footer-principal">
      <div className="footer-linea" />
      <div className="footer-decoracion footer-decoracion-1" />
      <div className="footer-decoracion footer-decoracion-2" />

      <div className="footer-contenido footer-contenido--index">
        <div className="footer-marca">
          <Link to="/">
            <img src="/img/logo-patitas.png" alt="Logo Veterinaria Patitas Felices" className="footer-logo" />
          </Link>
          <p>Cuidamos la salud y bienestar de tu mascota con cariño, compromiso y atención cercana.</p>
          <div className="footer-social">
            {REDES.map((red) => (
              <a key={red.nombre} href="#" aria-label={red.nombre} className="footer-social-icono">
                <img src={red.icono} alt={red.nombre} />
              </a>
            ))}
          </div>
        </div>

        <div className="footer-info">
          <h3>Contacto</h3>
          <p>
            <span className="footer-icono">✉</span> contacto@patitasfelices.cl
          </p>
          <p>
            <span className="footer-icono">📍</span> Rancagua, Región de O'Higgins
          </p>
        </div>

        <div className="footer-info">
          <h3>Horario</h3>
          <p>
            <span className="footer-icono">🕘</span> Lunes a viernes
          </p>
          <p>
            <span className="footer-icono">♡</span> 09:00 - 19:00 hrs
          </p>
        </div>
      </div>

      <div className="footer-inferior">
        <p>© 2026 Veterinaria Patitas Felices</p>
        <p className="footer-frase">Cuidando cada huellita con cariño 🐾</p>
      </div>
    </footer>
  )
}
