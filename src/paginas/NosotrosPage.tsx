
/* =========================================================
   MI PARTE — PÁGINA NOSOTROS

   Página completa de Veterinaria Patitas Felices.

   Reúne los organismos de la página,
   aplicando Atomic Design.

   Se reutiliza SeccionCta, desarrollada
   previamente por el equipo.
========================================================= */

// MI PARTE — Organismos de Nosotros.
import HeroNosotros from '../componentes/organismos/HeroNosotros'
import SeccionQuienesSomos from '../componentes/organismos/SeccionQuienesSomos'
import SeccionMisionVision from '../componentes/organismos/SeccionMisionVision'
import SeccionCompromiso from '../componentes/organismos/SeccionCompromiso'

// Organismo compartido existente.
import { SeccionCta } from '../componentes/organismos/SeccionCta'

function NosotrosPage() {
  return (
    <main>

      {/* 1. Presentación principal y carrusel */}
      <HeroNosotros />

      {/* 2. Información sobre la veterinaria */}
      <SeccionQuienesSomos />

      {/* 3. Misión y visión */}
      <SeccionMisionVision />

      {/* 4. Nuestro compromiso */}
      <SeccionCompromiso />

      {/* 5. Invitación a solicitar una cita */}
      <SeccionCta />

    </main>
  )
}

export default NosotrosPage
