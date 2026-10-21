/* =========================================================
   Exportación a Excel con SheetJS (librería xlsx).
========================================================= */
import * as XLSX from 'xlsx'
import type { Usuario } from '../types/usuario'

/** Convierte usuarios a filas con encabezados "bonitos" (sin contraseña). */
export function usuariosAFilas(usuarios: Usuario[]) {
  return usuarios.map((u) => ({
    RUN: u.run,
    Nombre: u.nombre,
    Apellidos: u.apellidos,
    Correo: u.correo,
    Telefono: u.telefono,
    Region: u.region,
    Comuna: u.comuna,
    Direccion: u.direccion,
    Rol: u.rol,
    Estado: u.activo ? 'Activo' : 'Inactivo',
  }))
}

/**
 * Crea un libro con una hoja por cada entrada de `hojas` y lo descarga.
 * Ej: exportarLibro({ Usuarios: [...], Mascotas: [...] }, 'reporte')
 */
export function exportarLibro(hojas: Record<string, object[]>, nombreArchivo: string): void {
  const libro = XLSX.utils.book_new()
  Object.entries(hojas).forEach(([nombre, filas]) => {
    // Una hoja vacía igual se crea, con un aviso, para que el archivo no quede incompleto
    const datos = filas.length > 0 ? filas : [{ Aviso: 'Sin registros' }]
    XLSX.utils.book_append_sheet(libro, XLSX.utils.json_to_sheet(datos), nombre)
  })
  XLSX.writeFile(libro, `${nombreArchivo}.xlsx`)
}

export function exportarUsuarios(usuarios: Usuario[], nombreArchivo: string): void {
  exportarLibro({ Usuarios: usuariosAFilas(usuarios) }, nombreArchivo)
}
