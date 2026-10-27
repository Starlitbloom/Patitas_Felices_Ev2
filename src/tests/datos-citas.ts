
import type { NuevaCita } from '../services/citasService'

export function siguienteDiaSemana(diaSemana: number): string {
  const fecha = new Date()
  const diasHasta = (diaSemana - fecha.getDay() + 7) % 7 || 7

  fecha.setDate(fecha.getDate() + diasHasta)

  return [
    fecha.getFullYear(),
    String(fecha.getMonth() + 1).padStart(2, '0'),
    String(fecha.getDate()).padStart(2, '0')
  ].join('-')
}

export function datosCitaPrueba(
  cambios: Partial<NuevaCita> = {}
): NuevaCita {
  return {
    correoUsuario: 'cliente@ejemplo.cl',
    nombreUsuario: 'Camila González',
    dueno: 'Camila González',
    propietario: 'Camila González',
    correo: 'cliente@ejemplo.cl',
    telefono: '+56912345678',
    mascota: 'Oso',
    tipoMascota: 'Perro',
    otraEspecie: '',
    edadMascota: 3,
    veterinarioId: 1,
    veterinarioNombre: 'Dra. Fernanda Ríos',
    servicio: 'Consulta general',
    fecha: siguienteDiaSemana(1),
    hora: '10:00',
    motivo: 'Consulta preventiva de mi mascota Oso.',
    ...cambios
  }
}
