
/* =========================================================
   PÁGINA NOVEDADES
   DATOS DE LAS PUBLICACIONES

   Separamos la información del diseño para
   reutilizarla en las tarjetas y sus detalles.
========================================================= */

export interface Novedad {
  id: string
  categoria: 'Salud' | 'Prevención' | 'Bienestar' | 'Consejos'
  fecha: string
  titulo: string
  descripcion: string
  imagen: string
  alt: string
}

// Publicaciones originales de Patitas Felices.
export const NOVEDADES: Novedad[] = [
  {
    id: 'vacunas',
    categoria: 'Salud',
    fecha: '05 septiembre 2026',
    titulo: 'La importancia de mantener las vacunas al día',
    descripcion:
      'Mantener actualizado el calendario de vacunación ayuda a proteger a nuestras mascotas frente a distintas enfermedades y contribuye a cuidar su salud durante todas las etapas de su vida.',
    imagen: '/img/perrito-inyecion.png',
    alt: 'Perro recibiendo atención veterinaria'
  },
  {
    id: 'controles',
    categoria: 'Prevención',
    fecha: '02 septiembre 2026',
    titulo: '¿Por qué son importantes los controles preventivos?',
    descripcion:
      'Las revisiones periódicas ayudan a observar cambios en la salud de tu mascota y permiten mantener un seguimiento de su bienestar.',
    imagen: '/img/control-gatito.png',
    alt: 'Gato durante un control veterinario'
  },
  {
    id: 'alimentacion',
    categoria: 'Bienestar',
    fecha: '28 agosto 2026',
    titulo: 'Consejos para una alimentación equilibrada',
    descripcion:
      'Una alimentación adecuada es una parte fundamental del cuidado diario y puede contribuir al bienestar de nuestras mascotas.',
    imagen: '/img/alimentacion.png',
    alt: 'Perro y gato alimentándose'
  },
  {
    id: 'consulta',
    categoria: 'Consejos',
    fecha: '22 agosto 2026',
    titulo: 'Cómo preparar a tu mascota para su consulta',
    descripcion:
      'Algunas acciones sencillas pueden ayudar a que la visita al veterinario sea una experiencia más tranquila para tu mascota.',
    imagen: '/img/consulta.png',
    alt: 'Perro durante una consulta veterinaria'
  }
]
