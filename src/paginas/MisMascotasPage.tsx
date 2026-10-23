/* Muestra solo las mascotas del dueño/a que inició sesión.
   Debe ir protegida con RutaProtegida: sin sesión no sabemos
   de quién son las mascotas que hay que mostrar.*/
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import type { FiltrosMascotas as Filtros } from '../types/mascota'
import { alternarFavorita, filtrarMascotas, listarMascotasPorDueno, obtenerFavoritos } from '../services/mascotasService'
import { FiltrosMascotas } from '../componentes/organismos/FiltrosMascotas'
import { GrillaMascotas } from '../componentes/organismos/GrillaMascotas'
import { TituloSeccion } from '../componentes/moleculas/TituloSeccion'

const SIN_FILTROS: Filtros = { texto: '', especie: '', soloFavoritas: false }

export default function MisMascotasPage() {
  const { usuario } = useAuth()
  const [filtros, setFiltros] = useState<Filtros>(SIN_FILTROS)
  // "favoritos" se guarda en estado aparte para que, al tocar el corazón,
  // la grilla se vuelva a pintar (alternarFavorita() escribe en localStorage,
  // pero React no sabe que localStorage cambió si no actualizamos el estado).
  const [favoritos, setFavoritos] = useState<string[]>(() => obtenerFavoritos())

  const mascotasDelDueno = usuario ? listarMascotasPorDueno(usuario.correo) : []
  const visibles = filtrarMascotas(mascotasDelDueno, filtros)

  const manejarFavorita = (id: string) => {
    alternarFavorita(id)
    setFavoritos(obtenerFavoritos())
  }

  return (
    <main className="seccion-mascotas">
      <div className="contenedor">
        <TituloSeccion
          etiqueta="Mis pacientes"
          titulo="Mis mascotas"
          descripcion="Revisa el estado de salud, la ficha clínica y las vacunas de tus mascotas registradas en Patitas Felices."
        />

        <FiltrosMascotas filtros={filtros} onCambio={setFiltros} onLimpiar={() => setFiltros(SIN_FILTROS)} />

        <p className="mascotas-resumen" aria-live="polite">
          {visibles.length} {visibles.length === 1 ? 'mascota encontrada' : 'mascotas encontradas'}
        </p>

        <GrillaMascotas mascotas={visibles} favoritos={favoritos} onAlternarFavorita={manejarFavorita} />
      </div>
    </main>
  )
}