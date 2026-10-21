/* PÁGINA (contenedor) — Reportes (antes admin/reportes.html).
   Gráficos con Chart.js (react-chartjs-2).
   Corrige el bug de la EP1: "Exportar reporte completo" ahora genera
   un Excel con tres hojas (Usuarios, Mascotas y Citas). */
import type { ReactNode } from 'react'
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'
import { listarUsuarios } from '../../services/usuariosService'
import { estadoCita, listarCitas, listarMascotas, listarSolicitudesMascotas } from '../../services/datosEquipoService'
import { contarPor, recortar } from '../../utils/estadisticas'
import { exportarLibro, usuariosAFilas } from '../../utils/exportarExcel'
import { EncabezadoAdmin } from '../../componentes/organismos/EncabezadoAdmin'
import { TarjetaKpi } from '../../componentes/moleculas/TarjetaKpi'
import { Boton } from '../../componentes/atomos/Boton'

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const COLOR_TEXTO = 'rgba(255,255,255,0.75)'
const opcionesDona = { plugins: { legend: { labels: { color: COLOR_TEXTO } } } }
const opcionesBarras = (horizontal: boolean) => ({
  indexAxis: horizontal ? ('y' as const) : ('x' as const),
  plugins: { legend: { display: false } },
  scales: {
    x: { ticks: { color: 'rgba(255,255,255,0.6)', precision: 0 }, grid: { color: 'rgba(255,255,255,0.06)' } },
    y: { ticks: { color: COLOR_TEXTO }, grid: { display: false } },
  },
})

function Grafico({ titulo, vacio, children }: { titulo: string; vacio: boolean; children: ReactNode }) {
  return (
    <div className="admin-grafico-card">
      <h2>{titulo}</h2>
      {vacio ? <p className="admin-tabla-vacia">Sin datos todavía.</p> : children}
    </div>
  )
}

export default function ReportesPage() {
  const usuarios = listarUsuarios()
  const mascotas = listarMascotas()
  const citas = listarCitas()
  const solicitudes = listarSolicitudesMascotas()

  const porRegion = contarPor(usuarios, (u) => u.region || 'Sin región')
  const topComunas = contarPor(
    usuarios.filter((u) => u.comuna),
    (u) => `${u.comuna}||${u.region || 'Sin región'}`,
  ).slice(0, 10)
  const porEspecie = contarPor(mascotas, (m) => m.especie || 'Sin especificar')
  const porServicio = contarPor(citas, (c) => c.servicio || 'Sin especificar').slice(0, 6)
  const citasPendientes = citas.filter((c) => estadoCita(c) === 'pendiente').length
  const citasConfirmadas = citas.filter((c) => estadoCita(c).startsWith('confirmad')).length
  const citasCanceladas = citas.filter((c) => estadoCita(c).startsWith('cancelad')).length

  const exportarTodo = () =>
    exportarLibro(
      {
        Usuarios: usuariosAFilas(usuarios),
        Mascotas: mascotas.map((m) => ({ Nombre: m.nombre, Especie: m.especie, Raza: m.raza, Estado: m.estado, Dueño: m.correoDueño })),
        Citas: citas.map((c) => ({ Fecha: c.fecha, Servicio: c.servicio, Motivo: c.motivo, Estado: c.estado, Usuario: c.correoUsuario })),
      },
      'reporte-completo-patitas-felices',
    )

  return (
    <>
      <EncabezadoAdmin>Reportes 🐾</EncabezadoAdmin>

      {/* -------- USUARIOS -------- */}
      <section className="admin-kpis">
        <TarjetaKpi icono="👥" numero={usuarios.length} etiqueta="Usuarios totales" />
        <TarjetaKpi icono="🛡️" numero={usuarios.filter((u) => u.rol === 'admin').length} etiqueta="Administradores" />
        <TarjetaKpi icono="📍" numero={new Set(usuarios.filter((u) => u.region).map((u) => u.region)).size} etiqueta="Regiones con usuarios" />
        <TarjetaKpi icono="🖼️" numero={usuarios.filter((u) => u.avatar).length} etiqueta="Con foto de perfil" />
      </section>

      <section className="admin-graficos">
        <Grafico titulo="Usuarios por rol" vacio={usuarios.length === 0}>
          <Doughnut
            options={opcionesDona}
            data={{
              labels: ['Clientes', 'Administradores'],
              datasets: [
                {
                  data: [usuarios.filter((u) => u.rol === 'cliente').length, usuarios.filter((u) => u.rol === 'admin').length],
                  backgroundColor: ['#D6ECFA', '#FFD6E7'],
                  borderColor: '#2A2440',
                  borderWidth: 3,
                },
              ],
            }}
          />
        </Grafico>
        <Grafico titulo="Usuarios por región" vacio={porRegion.length === 0}>
          <Bar
            options={opcionesBarras(true)}
            data={{
              labels: porRegion.map(([r]) => recortar(r, 22)),
              datasets: [{ label: 'Usuarios', data: porRegion.map(([, n]) => n), backgroundColor: '#E6D6F7', borderRadius: 8 }],
            }}
          />
        </Grafico>
      </section>

      <section className="admin-tabla-seccion">
        <h2>Comunas con más usuarios registrados</h2>
        {topComunas.length === 0 ? (
          <p className="admin-tabla-vacia">Aún no hay suficientes datos de comunas.</p>
        ) : (
          <div className="admin-tabla-wrap table-responsive">
            <table className="admin-tabla">
              <thead>
                <tr>
                  <th>Comuna</th>
                  <th>Región</th>
                  <th>Usuarios</th>
                </tr>
              </thead>
              <tbody>
                {topComunas.map(([clave, cantidad]) => {
                  const [comuna, region] = clave.split('||')
                  return (
                    <tr key={clave}>
                      <td>{comuna}</td>
                      <td>{region}</td>
                      <td>{cantidad}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* -------- MASCOTAS -------- */}
      <h2 className="admin-reportes-subtitulo">Reporte de mascotas 🐾</h2>
      <section className="admin-kpis">
        <TarjetaKpi icono="🐾" numero={mascotas.length} etiqueta="Mascotas registradas" />
        <TarjetaKpi icono="⚠️" numero={mascotas.filter((m) => !m.completo).length} etiqueta="Con datos incompletos" />
        <TarjetaKpi icono="🔔" numero={solicitudes.filter((s) => s.estado === 'pendiente').length} etiqueta="Solicitudes de cambio pendientes" />
        <TarjetaKpi icono="🩺" numero={mascotas.filter((m) => m.estado === 'tratamiento').length} etiqueta="En tratamiento" />
      </section>
      <section className="admin-graficos">
        <Grafico titulo="Mascotas por especie" vacio={mascotas.length === 0}>
          <Doughnut
            options={opcionesDona}
            data={{
              labels: porEspecie.map(([e]) => e),
              datasets: [
                {
                  data: porEspecie.map(([, n]) => n),
                  backgroundColor: ['#D6ECFA', '#FFD6E7', '#E6D6F7', '#FFD6A5', '#C8F0D8', '#F7E6A1'],
                  borderColor: '#2A2440',
                  borderWidth: 3,
                },
              ],
            }}
          />
        </Grafico>
        <Grafico titulo="Mascotas por estado clínico" vacio={mascotas.length === 0}>
          <Bar
            options={opcionesBarras(false)}
            data={{
              labels: ['Control al día', 'En tratamiento', 'Vacunas pendientes'],
              datasets: [
                {
                  label: 'Mascotas',
                  data: [
                    mascotas.filter((m) => m.estado === 'al-dia').length,
                    mascotas.filter((m) => m.estado === 'tratamiento').length,
                    mascotas.filter((m) => (m.estado || 'pendiente') === 'pendiente').length,
                  ],
                  backgroundColor: ['#C8F0D8', '#E6D6F7', '#FFD6A5'],
                  borderRadius: 8,
                },
              ],
            }}
          />
        </Grafico>
      </section>

      {/* -------- CITAS -------- */}
      <h2 className="admin-reportes-subtitulo">Reporte de citas 📅</h2>
      <section className="admin-kpis">
        <TarjetaKpi icono="📅" numero={citas.length} etiqueta="Citas totales" />
        <TarjetaKpi icono="⏰" numero={citasPendientes} etiqueta="Pendientes" />
        <TarjetaKpi icono="✅" numero={citasConfirmadas} etiqueta="Confirmadas" />
        <TarjetaKpi icono="❌" numero={citasCanceladas} etiqueta="Canceladas" />
      </section>
      <section className="admin-graficos">
        <Grafico titulo="Citas por estado" vacio={citas.length === 0}>
          <Doughnut
            options={opcionesDona}
            data={{
              labels: ['Pendientes', 'Confirmadas', 'Canceladas'],
              datasets: [
                {
                  data: [citasPendientes, citasConfirmadas, citasCanceladas],
                  backgroundColor: ['#FFD6A5', '#C8F0D8', '#F0A0A0'],
                  borderColor: '#2A2440',
                  borderWidth: 3,
                },
              ],
            }}
          />
        </Grafico>
        <Grafico titulo="Servicios más solicitados" vacio={citas.length === 0}>
          <Bar
            options={opcionesBarras(true)}
            data={{
              labels: porServicio.map(([s]) => recortar(s, 24)),
              datasets: [{ label: 'Citas', data: porServicio.map(([, n]) => n), backgroundColor: '#D6ECFA', borderRadius: 8 }],
            }}
          />
        </Grafico>
      </section>

      <div className="admin-reportes-exportar">
        <Boton variante="exportar" onClick={exportarTodo}>
          📤 Exportar reporte completo (Excel)
        </Boton>
      </div>
    </>
  )
}
