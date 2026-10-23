
/* =========================================================
   CONTACTO

   Esta página reúne:
   1. HeroContacto
   2. InformacionContacto
   3. FormularioContacto
   4. UbicacionContacto
   5. SeccionCta
========================================================= */

//  Organismos desarrollados para Contacto.
import HeroContacto from '../componentes/organismos/HeroContacto'
import InformacionContacto from '../componentes/organismos/InformacionContacto'
import FormularioContacto from '../componentes/organismos/FormularioContacto'
import UbicacionContacto from '../componentes/organismos/UbicacionContacto'

//  Se reutiliza sin modificarlo.
import { SeccionCta } from '../componentes/organismos/SeccionCta'

//  Estilos propios de Contacto.
import '../styles/estilo-contacto.css'

/* =========================================================
    DATOS DE CONTACTO
========================================================= */

const DATOS_CONTACTO = {
  correo: 'contacto@patitasfelices.cl',
  telefono: '+56 9 1234 5678',
  direccion: "Rancagua, Región de O'Higgins",
  ciudad: 'Rancagua',
  horario: 'Lunes a viernes · 09:00 - 19:00 hrs',

  // Mantén aquí el enlace de Google Maps que ya configuramos.
  mapaUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d52823.838848390165!2d-70.7798986215906!3d-34.15938959332133!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x96634367bdef13d3%3A0xd973fc8366ad54f7!2sRancagua%2C%20O'Higgins!5e0!3m2!1ses-419!2scl!4v1792734178302!5m2!1ses-419!2scl"
}

export default function ContactoPage() {
  return (
    <main>

      {/* 1. Presentación de Contacto */}
      <HeroContacto />

      {/* 2. Tarjetas con información de contacto */}
      <InformacionContacto
        correo={DATOS_CONTACTO.correo}
        telefono={DATOS_CONTACTO.telefono}
        direccion={DATOS_CONTACTO.direccion}
        horario={DATOS_CONTACTO.horario}
      />

      {/* 3. Formulario con validaciones */}
      <FormularioContacto />

      {/* 4. Dirección y mapa */}
      <UbicacionContacto
        direccion={DATOS_CONTACTO.direccion}
        ciudad={DATOS_CONTACTO.ciudad}
        mapaUrl={DATOS_CONTACTO.mapaUrl}
      />

      {/* 5. Invitación para solicitar cita */}
      <SeccionCta />

    </main>
  )
}
