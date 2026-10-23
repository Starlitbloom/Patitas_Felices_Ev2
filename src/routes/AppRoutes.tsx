
/* =========================================================
   Mapa de rutas de la aplicación (React Router).
   Cada <Route> reemplaza a un archivo .html de la EP1.
   Las páginas de mascotas, citas y contenido usan
   PaginaPendiente hasta que cada integrante migre la suya.
========================================================= */
import type { ReactNode } from 'react'
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
import MisMascotasPage from '../paginas/MisMascotasPage'
import DetalleMascotaPage from '../paginas/DetalleMascotaPage'
import MascotasAdminPage from '../paginas/admin/MascotasPage'
import DetalleVeterinarioPage from '../paginas/DetalleVeterinarioPage'
import DashboardPage from '../paginas/admin/DashboardPage'
import UsuariosPage from '../paginas/admin/UsuariosPage'
import DetalleUsuarioPage from '../paginas/admin/DetalleUsuarioPage'
import ReportesPage from '../paginas/admin/ReportesPage'

/* =========================================================
   NOSOTROS
   Importamos nuestra página desarrollada en React.
========================================================= */
import NosotrosPage from '../paginas/NosotrosPage'

/* =========================================================
   NOVEDADES
========================================================= */
import NovedadesPage from '../paginas/NovedadesPage'

/* =========================================================
  DETALLE DE NOVEDADES
========================================================= */
import DetalleNovedadPage from '../paginas/DetalleNovedadPage'

/* =========================================================
   CONTACTO
========================================================= */
import ContactoPage from '../paginas/ContactoPage'

/** Atajo: envuelve una página que solo puede ver el administrador. */
function SoloAdmin({ children }: { children: ReactNode }) {
  return <RutaProtegida roles={['admin']}>{children}</RutaProtegida>
}

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

        {/* NOSOTROS: página migrada a React */}
        <Route path="/nosotros" element={<NosotrosPage />} />

        {/* NOVEDADES: página migrada a React */}
        <Route path="/novedades" element={<NovedadesPage />} />

        {/* DETALLE DE NOVEDADES */}
        <Route path="/detalle-novedad" element={<DetalleNovedadPage />} />

        {/* CONTACTO: página migrada a React */}
        <Route path="/contacto" element={<ContactoPage />} />

        {/* MASCOTAS */}
        <Route path="/mascotas" element={<RutaProtegida><MisMascotasPage /></RutaProtegida>} />
        <Route path="/mascotas/:id" element={<RutaProtegida><DetalleMascotaPage /></RutaProtegida>} />

        {/* Pendientes de migrar (citas) */}
        <Route path="/solicitar-cita" element={<PaginaPendiente titulo="Solicitar cita" modulo="citas" />} />
        <Route path="/mis-citas" element={<PaginaPendiente titulo="Mis citas" modulo="citas" />} />

        <Route path="*" element={<NoEncontradoPage />} />
      </Route>

      {/* ---------- Panel de la clínica (administrador y recepcionista) ----------
           Usuarios y reportes: solo administrador.
           Citas y mascotas: administrador y recepcionista (según el caso). */}
      <Route
        path="/admin"
        element={
          <RutaProtegida roles={['admin', 'recepcionista']}>
            <PlantillaAdmin />
          </RutaProtegida>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="usuarios" element={<SoloAdmin><UsuariosPage /></SoloAdmin>} />
        <Route path="usuarios/:id" element={<SoloAdmin><DetalleUsuarioPage /></SoloAdmin>} />
        <Route path="reportes" element={<SoloAdmin><ReportesPage /></SoloAdmin>} />
        <Route path="mascotas" element={<MascotasAdminPage />} />
        <Route path="citas" element={<PaginaPendiente titulo="Citas" modulo="citas" admin />} />
      </Route>
    </Routes>
  )
}
