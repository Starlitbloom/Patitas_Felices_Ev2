/* =========================================================
   Datos simulados del equipo veterinario de la clínica.
   (Personas ficticias para la entrega académica.)
========================================================= */
import type { Especialidad, Especie, Veterinario } from '../types/veterinario'

export const ESPECIALIDADES: Especialidad[] = [
  'Medicina general',
  'Cirugía',
  'Dermatología',
  'Animales exóticos',
  'Medicina preventiva',
  'Nutrición',
]

export const ESPECIES: Especie[] = ['Perros', 'Gatos', 'Conejos', 'Aves']

export const VETERINARIOS: Veterinario[] = [
  {
    id: 1,
    nombre: 'Dra. Fernanda Ríos',
    especialidad: 'Medicina general',
    especies: ['Perros', 'Gatos'],
    experiencia: 12,
    descripcion:
      'Directora médica de la clínica. Realiza consultas generales, controles anuales y acompaña a las familias en el cuidado diario de sus mascotas.',
    dias: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
    horario: '09:00 - 14:00',
    imagen: '/img/atencion-perrito.jfif',
    correo: 'f.rios@patitasfelices.cl',
  },
  {
    id: 2,
    nombre: 'Dr. Matías Contreras',
    especialidad: 'Cirugía',
    especies: ['Perros', 'Gatos'],
    experiencia: 9,
    descripcion:
      'Cirujano a cargo de esterilizaciones, cirugías de tejidos blandos y seguimiento postoperatorio.',
    dias: ['Martes', 'Jueves'],
    horario: '10:00 - 19:00',
    imagen: '/img/consulta.png',
    correo: 'm.contreras@patitasfelices.cl',
  },
  {
    id: 3,
    nombre: 'Dra. Josefa Medina',
    especialidad: 'Dermatología',
    especies: ['Perros', 'Gatos', 'Conejos'],
    experiencia: 6,
    descripcion: 'Atiende alergias, problemas de piel y pelaje, y otitis recurrentes.',
    dias: ['Lunes', 'Miércoles', 'Viernes'],
    horario: '14:00 - 19:00',
    imagen: '/img/gatopersa.jpg',
    correo: 'j.medina@patitasfelices.cl',
  },
  {
    id: 4,
    nombre: 'Dr. Ignacio Pavez',
    especialidad: 'Animales exóticos',
    especies: ['Conejos', 'Aves'],
    experiencia: 8,
    descripcion: 'Especialista en conejos, aves y pequeños mamíferos: controles, manejo y alimentación.',
    dias: ['Miércoles', 'Sábado'],
    horario: '09:00 - 13:00',
    imagen: '/img/Cacatua.jpg',
    correo: 'i.pavez@patitasfelices.cl',
  },
  {
    id: 5,
    nombre: 'Dra. Catalina Bravo',
    especialidad: 'Medicina preventiva',
    especies: ['Perros', 'Gatos', 'Conejos'],
    experiencia: 4,
    descripcion: 'Responsable del calendario de vacunas, desparasitaciones y campañas de prevención.',
    dias: ['Lunes', 'Martes', 'Jueves'],
    horario: '09:00 - 17:00',
    imagen: '/img/perrito-inyecion.png',
    correo: 'c.bravo@patitasfelices.cl',
  },
  {
    id: 6,
    nombre: 'Dr. Sebastián Lagos',
    especialidad: 'Nutrición',
    especies: ['Perros', 'Gatos', 'Aves'],
    experiencia: 7,
    descripcion: 'Diseña planes de alimentación y control de peso según la edad y condición de cada mascota.',
    dias: ['Viernes', 'Sábado'],
    horario: '10:00 - 15:00',
    imagen: '/img/alimentacion.png',
    correo: 's.lagos@patitasfelices.cl',
  },
]
