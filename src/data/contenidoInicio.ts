/* Contenido de la página de inicio. Separarlo del componente permite
   agregar o cambiar servicios/preguntas sin tocar el JSX. */

export const BENEFICIOS = [
  { imagen: '/img/agenda-tu-cita.png', titulo: 'Agenda tu cita', descripcion: 'Reserva en línea sin llamadas ni esperas.' },
  { imagen: '/img/atencion-cercana.png', titulo: 'Atención cercana', descripcion: 'Un equipo que trata a tu mascota como familia.' },
  { imagen: '/img/historial-digital.png', titulo: 'Historial digital', descripcion: 'Vacunas y controles siempre a la mano.' },
]

export const SERVICIOS = [
  { imagen: '/img/veterinario.png', titulo: 'Consulta general', descripcion: 'Atención médica para cuidar la salud de tu mascota.' },
  { imagen: '/img/vacuna.png', titulo: 'Vacunación', descripcion: 'Control y seguimiento del calendario de vacunación.' },
  { imagen: '/img/cuidado.png', titulo: 'Control médico', descripcion: 'Seguimiento de la salud y antecedentes de tu mascota.' },
  { imagen: '/img/bienestar.png', titulo: 'Seguimiento y bienestar', descripcion: 'Registro y seguimiento de tratamientos veterinarios.' },
]

export const ESTADISTICAS = [
  { icono: '/img/icono-experiencia.png', hasta: 15, sufijo: '+', etiqueta: 'Años de experiencia' },
  { icono: '/img/icono-pacientes.png', hasta: 25, sufijo: '', etiqueta: 'Pacientes atendidos al día' },
  { icono: '/img/icono-veterinarios.png', hasta: 3, sufijo: '', etiqueta: 'Médicos veterinarios' },
  { icono: '/img/icono-atencion-carino.png', hasta: 100, sufijo: '%', etiqueta: 'Atención con cariño' },
]

export const NOVEDADES_DESTACADAS = [
  { icono: '💉', titulo: 'Campaña de vacunación de invierno', fecha: '15 de junio' },
  { icono: '☀️', titulo: '5 consejos para el calor en verano', fecha: '2 de enero' },
]

export const PREGUNTAS_FRECUENTES = [
  {
    icono: '/img/agenda-tu-cita.png',
    pregunta: '¿Cómo agendo una hora para mi mascota?',
    respuesta:
      'Puedes solicitar tu cita en línea desde el botón "Solicitar cita", eligiendo el servicio, la fecha y la hora que más te acomoden. Nuestro equipo confirma la solicitud a la brevedad.',
  },
  {
    icono: '/img/icono-actitud-tranquila.png',
    pregunta: '¿Qué especies atienden además de perros y gatos?',
    respuesta:
      'Además de perros y gatos, atendemos conejos y aves. Puedes ver el detalle de servicios disponibles por especie en la sección de servicios.',
  },
  {
    icono: '/img/icono-ficha-clinica.png',
    pregunta: '¿Puedo ver el historial clínico de mi mascota en línea?',
    respuesta:
      'Sí. Una vez que creas tu cuenta, puedes revisar el historial de consultas, vacunas y tratamientos de tu mascota desde tu perfil, sin necesidad de llamar a la clínica.',
  },
  {
    icono: '/img/icono-reprogramar-cita.png',
    pregunta: '¿Qué pasa si no puedo asistir a mi hora?',
    respuesta:
      'Puedes reagendar o cancelar tu cita desde "Mis citas" con anticipación, para que ese horario quede disponible para otra mascota que lo necesite.',
  },
]
