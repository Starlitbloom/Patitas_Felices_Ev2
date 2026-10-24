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
import { CuidadosPorEspecie } from '../componentes/organismos/CuidadosPorEspecie'
import { VideoCuidados } from '../componentes/organismos/VideoCuidados'
import { HeroMascotas } from '../componentes/organismos/HeroMascotas'

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
    <main className="seccion-mascotas seccion-mascotas--con-hero">
      <HeroMascotas />
      {/* Zona con fondo lila → rosa, a todo el ancho */}
      <section className="fondo-catalogo-mascotas">
        <div className="contenedor catalogo-mascotas" id="catalogo-mascotas">
          <TituloSeccion
            etiqueta="Tus mascotas"
            titulo="Mascotas registradas"
            descripcion="Aquí encontrarás las mascotas asociadas a tu cuenta. Revisa su ficha clínica, historial, vacunas y controles."
          />

          <FiltrosMascotas filtros={filtros} onCambio={setFiltros} onLimpiar={() => setFiltros(SIN_FILTROS)} />

          <p className="mascotas-resumen" aria-live="polite">
            {visibles.length} {visibles.length === 1 ? 'mascota encontrada' : 'mascotas encontradas'}
          </p>

          <GrillaMascotas mascotas={visibles} favoritos={favoritos} onAlternarFavorita={manejarFavorita} />
          </div>
        </section>
        {/* Zona con el mismo fondo del banner de Novedades, a todo el ancho */}
        <div className="fondo-cuidados">
          <CuidadosPorEspecie />
        </div>
        <VideoCuidados />
      </main>
  )
}