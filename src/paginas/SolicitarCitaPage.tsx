
/* =========================================================
   SOLICITAR CITA

   Esta página reúne:
   - HeroSolicitarCita
   - FormularioSolicitarCita
========================================================= */

// Organismos de Solicitar Cita.
import HeroSolicitarCita from '../componentes/organismos/HeroSolicitarCita'
import FormularioSolicitarCita from '../componentes/organismos/FormularioSolicitarCita'

//  Estilos exclusivos de Solicitar Cita.
import '../styles/estilo-solicitar-cita.css'

export default function SolicitarCitaPage() {
  return (
    <main>

      {/* Presentación principal */}
      <HeroSolicitarCita />

      {/* Formulario de solicitud */}
      <FormularioSolicitarCita />

    </main>
  )
}
