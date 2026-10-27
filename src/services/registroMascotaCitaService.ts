/* =========================================================
   PATITAS FELICES
   REGISTRAR MASCOTA DESDE SOLICITAR CITA

   - Guarda la mascota al registrar una cita.
   - Utiliza el almacenamiento de Mis mascotas.
   - Evita crear mascotas duplicadas.
   - Asigna una imagen según la especie.
   - Permite completar sus datos posteriormente.
========================================================= */

import type { Mascota } from '../types/mascota'

import {
  generarIdMascota,
  listarMascotas
} from './mascotasService'

import {
  CLAVES,
  guardarColeccion
} from './almacenamiento'

/* =========================================================
   DATOS RECIBIDOS DESDE SOLICITAR CITA
========================================================= */

interface MascotaDeCita {
  nombre: string
  especie: Mascota['especie']
  edad: string
  dueño: string
  correoDueño: string
}

/* =========================================================
   OBTENER IMAGEN SEGÚN ESPECIE
   Usa las mismas imágenes que aparecen al seleccionar
   el tipo de mascota en Solicitar Cita.
========================================================= */

function obtenerImagenMascota(
  especie: Mascota['especie']
): string {

  switch (especie) {

    case 'Perro':
      return '/img/icono-perro.png'

    case 'Gato':
      return '/img/icono-gato.png'

    case 'Conejo':
    case 'Ave':
      return '/img/icono-otro.png'

    default:
      return '/img/icono-otro.png'
  }
}

/* =========================================================
   REGISTRAR MASCOTA
========================================================= */

export function registrarMascotaDesdeCita(
  datos: MascotaDeCita
): Mascota {
  /* Obtener todas las mascotas registradas */
  const lista = listarMascotas()

  const nombre = datos.nombre.trim()
  const correoDueño = datos.correoDueño.trim()

  /* Normalizar textos para compararlos */
  const normalizar = (texto: string) =>
    texto.trim().toLocaleLowerCase('es-CL')

  /* Comprobar si la mascota ya está registrada */
  const existente = lista.find(
    (mascota) =>
      normalizar(mascota.correoDueño) === normalizar(correoDueño) &&
      normalizar(mascota.nombre) === normalizar(nombre) &&
      mascota.especie === datos.especie
  )

  /* Si existe, se conserva su ficha original */
  if (existente) {
    return existente
  }

  /* Crear nueva mascota */
  const nueva: Mascota = {
    id: generarIdMascota(),
    nombre,
    especie: datos.especie,
    edad: datos.edad,
    raza: '',
    sexo: '',
    peso: '',
    dueño: datos.dueño.trim(),
    correoDueño,
    completo: false,
    imagen: obtenerImagenMascota(datos.especie),
    estado: 'pendiente',
    descripcion: ''
  }

  /* Guardar la mascota */
  guardarColeccion(
    CLAVES.mascotas,
    [...lista, nueva]
  )

  return nueva
}