/* PÁGINA (contenedor) — Perfil de un integrante del equipo.  Ruta con parámetro: /equipo/:id
   useParams lee el id de la URL y se busca en el servicio.
   Si es médico veterinario, muestra su agenda semanal: la página guarda en el
   estado qué semana se está viendo y, al elegir un bloque libre, navega a
   Solicitar cita con el médico, la fecha y la hora en la URL. */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { obtenerVeterinarioPorId } from '../services/veterinariosService'
import { contarLibres, generarAgendaSemanal, lunesDeLaSemana } from '../services/agendaService'
import { Boton } from '../componentes/atomos/Boton'
import { EnlaceBoton } from '../componentes/atomos/EnlaceBoton'
import { Etiqueta } from '../componentes/atomos/Etiqueta'
import { AgendaVeterinario } from '../componentes/organismos/AgendaVeterinario'

/** Cuántas semanas hacia adelante se pueden revisar (la actual + 3). */
const SEMANAS_MAXIMAS = 3

export default function DetalleVeterinarioPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const veterinario = obtenerVeterinarioPorId(Number(id))

  // 0 = semana actual, 1 = la siguiente…
  const [semana, setSemana] = useState(0)

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
  const esMedico = cargo === 'Médico veterinario'

  // Agenda de la semana elegida (se recalcula en cada render con las citas guardadas)
  const ahora = new Date()
  const lunes = lunesDeLaSemana(ahora)
  lunes.setDate(lunes.getDate() + semana * 7)
  const agenda = esMedico ? generarAgendaSemanal(veterinario, lunes, ahora) : []
  const tituloSemana = agenda.length ? `${agenda[0].etiqueta} – ${agenda[agenda.length - 1].etiqueta}` : ''

  const elegirBloque = (fecha: string, hora: string) => {
    navigate(`/solicitar-cita?veterinario=${veterinario.id}&fecha=${fecha}&hora=${hora}`)
  }

  const irAAgenda = () => {
    document.getElementById('agenda-titulo')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

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
              {esMedico && <Boton onClick={irAAgenda}>Ver horas disponibles</Boton>}
              <EnlaceBoton to="/equipo" variante="secundario">
                ← Volver al equipo
              </EnlaceBoton>
            </div>
          </div>
        </article>

        {esMedico && (
          <AgendaVeterinario
            nombreMedico={nombre}
            dias={agenda}
            tituloSemana={tituloSemana}
            totalLibres={contarLibres(agenda)}
            puedeRetroceder={semana > 0}
            puedeAvanzar={semana < SEMANAS_MAXIMAS}
            onAnterior={() => setSemana((s) => Math.max(0, s - 1))}
            onSiguiente={() => setSemana((s) => Math.min(SEMANAS_MAXIMAS, s + 1))}
            onElegir={elegirBloque}
          />
        )}
      </div>
    </main>
  )
}
