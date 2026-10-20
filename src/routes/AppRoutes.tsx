/* =========================================================
   Mapa de rutas de la aplicación (React Router).
   Cada <Route> reemplaza a un archivo .html de la EP1.
   Las páginas de mascotas, citas y contenido usan
   PaginaPendiente hasta que cada integrante migre la suya.
========================================================= */
import { Route, Routes } from 'react-router-dom'
import { PlantillaPublica } from '../componentes/plantillas/PlantillaPublica'
import { PlantillaAdmin } from '../componentes/plantillas/PlantillaAdmin'
import { RutaProtegida } from './RutaProtegida'
import InicioPage from '../paginas/InicioPage'
import LoginPage from '../paginas/LoginPage'
import RegistroPage from '../paginas/RegistroPage'
import PerfilPage from '../paginas/PerfilPage'
import PaginaPendiente from '../paginas/PaginaPendiente'
import NoEncontradoPage from '../paginas/NoEncontradoPage'
import EquipoPage from '../paginas/EquipoPage'
import DetalleVeterinarioPage from '../paginas/DetalleVeterinarioPage'
import DashboardPage from '../paginas/admin/DashboardPage'
import UsuariosPage from '../paginas/admin/UsuariosPage'
import DetalleUsuarioPage from '../paginas/admin/DetalleUsuarioPage'
import ReportesPage from '../paginas/admin/ReportesPage'

export function AppRoutes() {
  return (
    <Routes>
      {/* ---------- Sitio público ---------- */}
      <Route element={<PlantillaPublica />}>
        <Route path="/" element={<InicioPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegistroPage />} />
        {/* Vista nueva EP2: equipo veterinario con filtros y detalle con parámetro */}
        <Route path="/equipo" element={<EquipoPage />} />
        <Route path="/equipo/:id" element={<DetalleVeterinarioPage />} />
        <Route
          path="/perfil"
          element={
            <RutaProtegida>
              <PerfilPage />
            </RutaProtegida>
          }
        />

        {/* Pendientes de migrar (contenido) */}
        <Route path="/nosotros" element={<PaginaPendiente titulo="Nosotros" modulo="contenido" />} />
        <Route path="/novedades" element={<PaginaPendiente titulo="Novedades" modulo="contenido" />} />
        <Route path="/contacto" element={<PaginaPendiente titulo="Contacto" modulo="contenido" />} />

        {/* Pendientes de migrar (mascotas) */}
        <Route path="/mascotas" element={<PaginaPendiente titulo="Mis mascotas" modulo="mascotas" />} />

        {/* Pendientes de migrar (citas) */}
        <Route path="/solicitar-cita" element={<PaginaPendiente titulo="Solicitar cita" modulo="citas" />} />
        <Route path="/mis-citas" element={<PaginaPendiente titulo="Mis citas" modulo="citas" />} />

        <Route path="*" element={<NoEncontradoPage />} />
      </Route>

      {/* ---------- Panel admin (solo rol admin) ---------- */}
      <Route
        path="/admin"
        element={
          <RutaProtegida soloAdmin>
            <PlantillaAdmin />
          </RutaProtegida>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="usuarios" element={<UsuariosPage />} />
        <Route path="usuarios/:id" element={<DetalleUsuarioPage />} />
        <Route path="reportes" element={<ReportesPage />} />
        <Route path="mascotas" element={<PaginaPendiente titulo="Mascotas" modulo="mascotas" admin />} />
        <Route path="citas" element={<PaginaPendiente titulo="Citas" modulo="citas" admin />} />
      </Route>
    </Routes>
  )
}
