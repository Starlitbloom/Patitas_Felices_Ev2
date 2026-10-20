/* PÁGINA — Inicio (antes index.html).
   Solo compone organismos -> toda la lógica vive dentro de cada sección. */
import { HeroInicio } from '../componentes/organismos/HeroInicio'
import { SeccionServicios } from '../componentes/organismos/SeccionServicios'
import { SeccionEstadisticas } from '../componentes/organismos/SeccionEstadisticas'
import { SeccionNovedades } from '../componentes/organismos/SeccionNovedades'
import { SeccionFaq } from '../componentes/organismos/SeccionFaq'
import { SeccionCta } from '../componentes/organismos/SeccionCta'

export default function InicioPage() {
  return (
    <main>
      <HeroInicio />
      <SeccionServicios />
      <SeccionEstadisticas />
      <SeccionNovedades />
      <SeccionFaq />
      <SeccionCta />
    </main>
  )
}
