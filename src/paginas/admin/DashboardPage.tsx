/* PÁGINA (contenedor) — Dashboard del panel admin (antes admin/dashboard.html). */
import { useAuth } from '../../context/AuthContext'
import { listarUsuarios } from '../../services/usuariosService'
import { estadoCita, listarCitas, listarMascotas, listarSolicitudesMascotas } from '../../services/datosEquipoService'
import { EncabezadoAdmin } from '../../componentes/organismos/EncabezadoAdmin'
import { TarjetaKpi } from '../../componentes/moleculas/TarjetaKpi'
import { AccesoRapido } from '../../componentes/moleculas/AccesoRapido'
import { Insignia } from '../../componentes/atomos/Insignia'

const UNA_SEMANA_MS = 7 * 24 * 60 * 60 * 1000

export default function DashboardPage() {
  const { usuario } = useAuth()
  const usuarios = listarUsuarios()
  const ahora = Date.now()

  const kpis = [
    { icono: '👥', numero: usuarios.length, etiqueta: 'Usuarios registrados' },
    {
      icono: '✨',
      numero: usuarios.filter((u) => ahora - new Date(u.fechaRegistro).getTime() <= UNA_SEMANA_MS).length,
      etiqueta: 'Nuevos esta semana',
    },
    { icono: '🐾', numero: listarMascotas().length, etiqueta: 'Mascotas registradas' },
    { icono: '📅', numero: listarCitas().filter((c) => estadoCita(c) === 'pendiente').length, etiqueta: 'Citas pendientes' },
    {
      icono: '🔔',
      numero: listarSolicitudesMascotas().filter((s) => s.estado === 'pendiente').length,
      etiqueta: 'Cambios de mascotas por revisar',
      to: '/admin/mascotas',
    },
  ]

  const ultimos = [...usuarios].sort((a, b) => b.fechaRegistro.localeCompare(a.fechaRegistro)).slice(0, 5)

  return (
    <>
      <EncabezadoAdmin>
        Bienvenido, <span>{usuario?.nombre ?? 'Admin'}</span> 🐾
      </EncabezadoAdmin>

      <section className="admin-kpis admin-kpis--dashboard">
        {kpis.map((k) => (
          <TarjetaKpi key={k.etiqueta} {...k} />
        ))}
      </section>

      <section className="admin-accesos">
        <AccesoRapido icono="👥" titulo="Gestión de usuarios" descripcion="Ver, buscar y administrar cuentas registradas." to="/admin/usuarios" />
        <AccesoRapido icono="🌐" titulo="Ver el sitio" descripcion="Abrir Patitas Felices como lo ve un visitante." to="/" />
      </section>

      <section className="admin-tabla-seccion">
        <h2>Últimos usuarios registrados</h2>
        {ultimos.length === 0 ? (
          <p className="admin-tabla-vacia">Aún no hay usuarios registrados.</p>
        ) : (
          <div className="admin-tabla-wrap table-responsive">
            <table className="admin-tabla">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Comuna</th>
                  <th>Rol</th>
                </tr>
              </thead>
              <tbody>
                {ultimos.map((u) => (
                  <tr key={u.id}>
                    <td>
                      {u.nombre} {u.apellidos}
                    </td>
                    <td>{u.correo}</td>
                    <td>{u.comuna || 'Sin comuna'}</td>
                    <td>
                      <Insignia tipo={u.rol} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  )
}
