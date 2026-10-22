
/* =========================================================
   PÁGINA NOVEDADES
 PATITAS FELICES

   Aplicamos Atomic Design mediante:
   - HeroNovedades: presentación principal.
   - ListadoNovedades: publicaciones y filtros.
   - SeccionCta: invitación para solicitar una cita.

========================================================= */

//  Organismos de Novedades.
import HeroNovedades from '../componentes/organismos/HeroNovedades'
import ListadoNovedades from '../componentes/organismos/ListadoNovedades'

// ORGANISMO EXISTENTE — Reutilizado del proyecto.
import { SeccionCta } from '../componentes/organismos/SeccionCta'

// Estilos exclusivos de Novedades.
import '../styles/estilo-novedades.css'

// Página principal de Novedades.
function NovedadesPage() {
  return (
    <main>

      {/* 1. Presentación principal */}
      <HeroNovedades />

      {/* 2. Publicaciones y filtros de categorías */}
      <ListadoNovedades />

      {/* 3. Invitación para solicitar una cita */}
      <SeccionCta />

    </main>
  )
}

export default NovedadesPage
