/* PÁGINA (contenedor) — Agenda del día para recepción (ruta /admin/agenda).
   Admin y recepcionista ven, en una sola pantalla, las citas de los
   3 médicos veterinarios por hora. Es SOLO DE LECTURA: para confirmar,
   reprogramar o cancelar se usa la página de Citas (módulo de citas).
   Estado: semana y día elegidos, filtro de estado y cita abierta en el modal. */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HORARIOS_CITAS, listarCitas, type Cita } from '../../services/citasService'
import { listarVeterinarios } from '../../services/veterinariosService'
import { aTextoFecha, diasHabiles, generarAgendaDia, lunesDeLaSemana } from '../../services/agendaService'
import { EncabezadoAdmin } from '../../componentes/organismos/EncabezadoAdmin'
import { GrillaAgendaDia, iconoMascota } from '../../componentes/organismos/GrillaAgendaDia'
import { Modal } from '../../componentes/organismos/Modal'
import { TarjetaKpi } from '../../componentes/moleculas/TarjetaKpi'
import { Boton } from '../../componentes/atomos/Boton'

/** Día hábil inicial: hoy, o el lunes siguiente si es fin de semana. */
function diaInicial(hoy: Date): Date {
  const d = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
  if (d.getDay() === 6) d.setDate(d.getDate() + 2)
  if (d.getDay() === 0) d.setDate(d.getDate() + 1)
  return d
}

const ESTADOS = ['Todas', 'Pendiente', 'Confirmada', 'Completada'] as const
type FiltroEstado = (typeof ESTADOS)[number]

export default function AgendaPage() {
  const navigate = useNavigate()
  const inicio = diaInicial(new Date())

  const [lunes, setLunes] = useState<Date>(() => lunesDeLaSemana(inicio))
  const [fecha, setFecha] = useState<string>(() => aTextoFecha(inicio))
  const [estado, setEstado] = useState<FiltroEstado>('Todas')
  const [citaAbierta, setCitaAbierta] = useState<Cita | null>(null)

  const medicos = listarVeterinarios().filter((v) => v.cargo === 'Médico veterinario')
  const citas = listarCitas().filter((c) => estado === 'Todas' || c.estado === estado)
  const agenda = generarAgendaDia(fecha, medicos, citas)
  const dias = diasHabiles(lunes)
  const hoy = aTextoFecha(new Date())

  const cambiarSemana = (semanas: number) => {
    const nuevoLunes = new Date(lunes.getFullYear(), lunes.getMonth(), lunes.getDate() + semanas * 7)
    setLunes(nuevoLunes)
    setFecha(aTextoFecha(nuevoLunes)) // al cambiar de semana se selecciona el lunes
  }

  return (
    <>
      <EncabezadoAdmin>Agenda de la clínica 📅</EncabezadoAdmin>

      <section className="admin-kpis agenda-kpis">
        <TarjetaKpi icono="📋" numero={agenda.resumen.citas} etiqueta="Citas del día" />
        <TarjetaKpi icono="⏳" numero={agenda.resumen.pendientes} etiqueta="Pendientes por confirmar" to="/admin/citas" />
        <TarjetaKpi icono="🟢" numero={agenda.resumen.libres} etiqueta="Horas libres" />
      </section>

      {/* Selector de semana y día */}
      <section className="agenda-selector" aria-label="Elegir día">
        <button type="button" className="agenda-selector-flecha" onClick={() => cambiarSemana(-1)} aria-label="Semana anterior">
          ‹
        </button>
        <div className="agenda-selector-dias">
          {dias.map((d) => (
            <button
              key={d.fecha}
              type="button"
              className={`agenda-selector-dia ${d.fecha === fecha ? 'agenda-selector-dia--activo' : ''}`}
              onClick={() => setFecha(d.fecha)}
              aria-pressed={d.fecha === fecha}
            >
              <strong>{d.nombre}</strong>
              <span>
                {d.etiqueta}
                {d.fecha === hoy ? ' · hoy' : ''}
              </span>
            </button>
          ))}
        </div>
        <button type="button" className="agenda-selector-flecha" onClick={() => cambiarSemana(1)} aria-label="Semana siguiente">
          ›
        </button>

        <label className="agenda-selector-filtro">
          <span>Estado</span>
          <select className="admin-select" value={estado} onChange={(e) => setEstado(e.target.value as FiltroEstado)}>
            {ESTADOS.map((e) => (
              <option key={e}>{e}</option>
            ))}
          </select>
        </label>
      </section>

      <section className="admin-tabla-seccion">
        <GrillaAgendaDia horas={HORARIOS_CITAS} columnas={agenda.columnas} onVerCita={setCitaAbierta} />

        <ul className="agenda-leyenda agenda-leyenda--admin">
          <li><span className="agenda-punto agenda-estado--pendiente" /> Pendiente</li>
          <li><span className="agenda-punto agenda-estado--confirmada" /> Confirmada</li>
          <li><span className="agenda-punto agenda-estado--completada" /> Completada</li>
          <li><span className="agenda-punto agenda-punto--fuera" /> Fuera de horario</li>
        </ul>
      </section>

      {/* Citas sin médico asignado (servicios donde la clínica define el profesional) */}
      {agenda.sinAsignar.length > 0 && (
        <section className="admin-tabla-seccion">
          <h2>⚠️ Citas sin médico asignado ({agenda.sinAsignar.length})</h2>
          <div className="agenda-sin-asignar">
            {agenda.sinAsignar.map((c) => (
              <button key={c.id} type="button" className="agenda-celda agenda-celda--cita" onClick={() => setCitaAbierta(c)}>
                <span className="agenda-celda-mascota">
                  {c.hora} · {iconoMascota(c)} {c.mascota}
                </span>
                <span className="agenda-celda-detalle">{c.servicio}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Detalle de la cita (solo lectura) */}
      <Modal abierto={citaAbierta !== null} titulo="Detalle de la cita" onCerrar={() => setCitaAbierta(null)}>
        {citaAbierta && (
          <div className="agenda-modal">
            <p className="agenda-modal-mascota">
              {iconoMascota(citaAbierta)} <strong>{citaAbierta.mascota}</strong>
              <span className={`agenda-modal-estado agenda-estado--${citaAbierta.estado.toLowerCase()}`}>{citaAbierta.estado}</span>
            </p>
            <ul>
              <li><strong>Fecha y hora:</strong> {citaAbierta.fecha} · {citaAbierta.hora} hrs</li>
              <li><strong>Servicio:</strong> {citaAbierta.servicio}</li>
              <li><strong>Médico:</strong> {citaAbierta.veterinarioNombre || 'Por asignar'}</li>
              <li><strong>Dueño:</strong> {citaAbierta.dueno || citaAbierta.nombreUsuario}</li>
              <li><strong>Contacto:</strong> {citaAbierta.correo}{citaAbierta.telefono ? ` · ${citaAbierta.telefono}` : ''}</li>
              <li><strong>Motivo:</strong> {citaAbierta.motivo}</li>
            </ul>
            <div className="d-flex flex-wrap gap-2 mt-3">
              <Boton variante="accion" onClick={() => navigate('/admin/citas')}>
                Gestionar en Citas →
              </Boton>
              <Boton variante="limpiar" onClick={() => setCitaAbierta(null)}>
                Cerrar
              </Boton>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
