
/* =========================================================
   DETALLE DE NOVEDADES

   Cada artículo contiene:
   - Títulos y párrafos.
   - Consejo destacado.
   - Tres recomendaciones con imágenes.

   Los datos se identifican mediante un ID.
========================================================= */

export interface DetalleNovedad {
  subtitulo: string
  parrafo1: string
  parrafo2: string
  consejo: string
  subtituloDos: string
  parrafo3: string
  recomendaciones: {
    texto: string
    icono: string
  }[]
}

// Artículos originales.
export const DETALLES_NOVEDADES: Record<string, DetalleNovedad> = {

  // Artículo 1: Vacunación
  vacunas: {
    subtitulo: '¿Por qué es importante la vacunación?',
    parrafo1:
      'Las vacunas ayudan a preparar el organismo de nuestras mascotas para protegerse frente a distintas enfermedades. Mantener un calendario de vacunación adecuado permite acompañar su crecimiento y fortalecer el cuidado preventivo.',
    parrafo2:
      'Cada mascota puede tener necesidades diferentes dependiendo de su edad, estado de salud y estilo de vida. Por esta razón, es importante mantener controles veterinarios periódicos y seguir las recomendaciones indicadas por un profesional.',
    consejo:
      'Lleva un registro de las vacunas de tu mascota y revisa periódicamente las fechas de sus próximos controles.',
    subtituloDos: 'Cuidado responsable y prevención',
    parrafo3:
      'La prevención permite detectar posibles problemas de forma temprana y contribuye a mantener una buena calidad de vida. Además de las vacunas, una alimentación equilibrada, actividad física y controles veterinarios forman parte de un cuidado responsable.',
    recomendaciones: [
      {
        texto: 'Mantén el calendario de vacunas actualizado.',
        icono: '/img/icono-vacuna.png'
      },
      {
        texto: 'Realiza controles veterinarios periódicos.',
        icono: '/img/icono-control.png'
      },
      {
        texto: 'Consulta ante cualquier cambio en su salud.',
        icono: '/img/icono-salud.png'
      }
    ]
  },

  // Artículo 2: Controles preventivos
  controles: {
    subtitulo: 'El valor de los controles periódicos',
    parrafo1:
      'Los controles preventivos permiten revisar distintos aspectos de la salud de una mascota, como su peso, estado general, alimentación y comportamiento.',
    parrafo2:
      'Estas visitas también son una oportunidad para resolver dudas y recibir recomendaciones de cuidado según la edad y necesidades de cada animal.',
    consejo:
      'No esperes a que aparezcan molestias para llevar a tu mascota al veterinario. Los controles periódicos también forman parte de la prevención.',
    subtituloDos: 'Un seguimiento durante cada etapa',
    parrafo3:
      'Las necesidades de una mascota pueden cambiar con el tiempo. Mantener un seguimiento veterinario permite adaptar sus cuidados a cada etapa de su vida y observar posibles cambios importantes.',
    recomendaciones: [
      {
        texto: 'Mantén una rutina de controles.',
        icono: '/img/icono-rutina-controles.png'
      },
      {
        texto: 'Observa cambios en su comportamiento.',
        icono: '/img/icono-observar-cambios.png'
      },
      {
        texto: 'Anota tus dudas antes de cada consulta.',
        icono: '/img/icono-anotar-dudas.png'
      }
    ]
  },

  // Artículo 3: Alimentación
  alimentacion: {
    subtitulo: 'Una alimentación adecuada para cada mascota',
    parrafo1:
      'Las necesidades de alimentación pueden variar según la edad, tamaño, actividad y características de cada mascota. Por eso es importante elegir una alimentación apropiada para sus necesidades.',
    parrafo2:
      'También es recomendable mantener horarios de alimentación, ofrecer porciones adecuadas y disponer siempre de agua limpia y fresca.',
    consejo:
      'Evita cambiar bruscamente la alimentación de tu mascota. Si necesitas realizar un cambio, consulta cómo hacerlo de manera progresiva.',
    subtituloDos: 'Hábitos que ayudan a su bienestar',
    parrafo3:
      'Una buena alimentación funciona mejor cuando se acompaña de actividad física, descanso y controles veterinarios. Estos hábitos ayudan a mantener una rutina saludable.',
    recomendaciones: [
      {
        texto: 'Mantén agua fresca disponible.',
        icono: '/img/icono-agua-fresca.png'
      },
      {
        texto: 'Respeta las porciones recomendadas.',
        icono: '/img/icono-porciones.png'
      },
      {
        texto: 'Elige alimentos adecuados para su etapa de vida.',
        icono: '/img/icono-alimento-adecuado.png'
      }
    ]
  },

  // Artículo 4: Preparación para la consulta
  consulta: {
    subtitulo: 'Antes de salir de casa',
    parrafo1:
      'Antes de la consulta puedes preparar información importante sobre tu mascota, como cambios recientes en su comportamiento, alimentación o estado general.',
    parrafo2:
      'También es importante utilizar una correa segura o un transportador adecuado durante el traslado para proteger a tu mascota y mantenerla más tranquila.',
    consejo:
      'Lleva anotadas las preguntas que quieras realizar durante la consulta para no olvidar información importante.',
    subtituloDos: 'Una visita más tranquila',
    parrafo3:
      'Mantener una actitud tranquila y evitar situaciones de estrés innecesario puede ayudar durante el traslado y la espera. Cada mascota responde de forma diferente, por lo que es importante respetar sus tiempos.',
    recomendaciones: [
      {
        texto: 'Utiliza correa o transportador seguro.',
        icono: '/img/icono-transportador-seguro.png'
      },
      {
        texto: 'Lleva información importante sobre su salud.',
        icono: '/img/icono-informacion-salud.png'
      },
      {
        texto: 'Mantén una actitud tranquila durante la visita.',
        icono: '/img/icono-actitud-tranquila.png'
      }
    ]
  }
}
