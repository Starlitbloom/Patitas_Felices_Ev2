/* =========================================================
   Datos simulados del equipo de la clínica, según el caso:
   3 médicos veterinarios, 1 técnico veterinario y 1 recepcionista.
   Servicios del caso: consulta general, vacunación, cirugía menor,
   desparasitación y control de peso. (Nombres ficticios.)
========================================================= */
import type { Cargo, Especie, Veterinario } from '../types/veterinario'

export const CARGOS: Cargo[] = ['Médico veterinario', 'Técnico veterinario', 'Recepcionista']

export const ESPECIES: Especie[] = ['Perros', 'Gatos', 'Conejos', 'Aves']

export const VETERINARIOS: Veterinario[] = [
  {
    id: 1,
    nombre: 'Dra. Fernanda Ríos',
    cargo: 'Médico veterinario',
    titulo: 'Médica veterinaria',
    area: 'Consulta general y control de peso',
    especies: ['Perros', 'Gatos'],
    experiencia: 15,
    descripcion:
      'Fundadora de la clínica en 2009. Realiza consultas generales, controles de peso y acompaña a las familias en el cuidado diario de sus mascotas.',
    dias: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
    horario: '09:00 - 14:00',
    imagen: '/img/Dra-Fernanda.webp',
    correo: 'f.rios@patitasfelices.cl',
  },
  {
    id: 2,
    nombre: 'Dr. Matías Contreras',
    cargo: 'Médico veterinario',
    titulo: 'Médico veterinario',
    area: 'Cirugía menor',
    especies: ['Perros', 'Gatos'],
    experiencia: 9,
    descripcion: 'A cargo de las cirugías menores, como esterilizaciones y suturas, y de los controles postoperatorios.',
    dias: ['Martes', 'Jueves'],
    horario: '10:00 - 19:00',
    imagen: '/img/Dr-Matias.jpg',
    correo: 'm.contreras@patitasfelices.cl',
  },
  {
    id: 3,
    nombre: 'Dr. Ignacio Pavez',
    cargo: 'Médico veterinario',
    titulo: 'Médico veterinario',
    area: 'Vacunación, desparasitación y animales exóticos',
    especies: ['Perros', 'Gatos', 'Conejos', 'Aves'],
    experiencia: 8,
    descripcion:
      'Responsable del calendario de vacunas y desparasitaciones. Es quien atiende a conejos y aves en la clínica.',
    dias: ['Lunes', 'Miércoles', 'Viernes'],
    horario: '14:00 - 19:00',
    imagen: '/img/Dr-Ignacio.jpg',
    correo: 'i.pavez@patitasfelices.cl',
  },
  {
    id: 4,
    nombre: 'Catalina Bravo',
    cargo: 'Técnico veterinario',
    titulo: 'Técnica veterinaria',
    area: 'Apoyo clínico y procedimientos',
    especies: ['Perros', 'Gatos', 'Conejos', 'Aves'],
    experiencia: 5,
    descripcion: 'Apoya a los médicos en consultas y procedimientos, prepara a los pacientes y aplica tratamientos indicados.',
    dias: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
    horario: '09:00 - 18:00',
    imagen: '/img/Catalina-Bravo.jpg',
    correo: 'c.bravo@patitasfelices.cl',
  },
  {
    id: 5,
    nombre: 'Josefa Medina',
    cargo: 'Recepcionista',
    titulo: 'Recepcionista',
    area: 'Atención a clientes y agenda de citas',
    especies: [],
    experiencia: 4,
    descripcion: 'Recibe a las familias, atiende los llamados y gestiona la agenda de citas de la clínica.',
    dias: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
    horario: '09:00 - 19:00',
    imagen: '/img/Josefa-Medina.png',
    correo: 'recepcion@patitasfelices.cl',
  },
]
