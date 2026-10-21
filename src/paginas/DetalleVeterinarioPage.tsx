/* PÁGINA (contenedor) — Perfil de un integrante del equipo.  Ruta con parámetro: /equipo/:id
   useParams lee el id de la URL y se busca en el servicio. */
import { useParams } from 'react-router-dom'
import { obtenerVeterinarioPorId } from '../services/veterinariosService'
import { EnlaceBoton } from '../componentes/atomos/EnlaceBoton'
import { Etiqueta } from '../componentes/atomos/Etiqueta'

export default function DetalleVeterinarioPage() {
  const { id } = useParams<{ id: string }>()
  const veterinario = obtenerVeterinarioPorId(Number(id))

  if (!veterinario) {
    return (
      <main className="equipo-pagina">
        <div className="contenedor text-center">
          <h1>Profesional no encontrado</h1>
          <p>No existe un integrante del equipo con el identificador "{id}".</p>
          <EnlaceBoton to="/equipo" variante="secundario">
            ← Volver al equipo
          </EnlaceBoton>
        </div>
      </main>
    )
  }

  const { nombre, cargo, titulo, area, especies, experiencia, descripcion, dias, horario, imagen, correo } = veterinario

  return (
    <main className="equipo-pagina">
      <div className="contenedor">
        <article className="equipo-detalle row g-4 align-items-center">
          <div className="col-12 col-md-5">
            <img src={imagen} alt="" className="equipo-detalle-imagen" />
          </div>
          <div className="col-12 col-md-7">
            <Etiqueta>{titulo}</Etiqueta>
            <h1>{nombre}</h1>
            <p>{descripcion}</p>
            <ul className="equipo-detalle-datos">
              <li>
                <strong>Área:</strong> {area}
              </li>
              <li>
                <strong>Experiencia:</strong> {experiencia} años
              </li>
              {especies.length > 0 && (
                <li>
                  <strong>Atiende a:</strong> {especies.join(', ')}
                </li>
              )}
              <li>
                <strong>Días:</strong> {dias.join(', ')}
              </li>
              <li>
                <strong>Horario:</strong> {horario} hrs
              </li>
              <li>
                <strong>Correo:</strong> {correo}
              </li>
            </ul>
            <div className="d-flex flex-wrap gap-3 mt-4">
              {/* Solo los médicos veterinarios atienden citas (renderizado condicional) */}
              {cargo === 'Médico veterinario' && <EnlaceBoton to="/solicitar-cita">Agendar una hora</EnlaceBoton>}
              <EnlaceBoton to="/equipo" variante="secundario">
                ← Volver al equipo
              </EnlaceBoton>
            </div>
          </div>
        </article>
      </div>
    </main>
  )
}
