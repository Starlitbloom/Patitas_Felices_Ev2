/* PÁGINA (contenedor) — Nuestro equipo veterinario.  Ruta: /equipo
   Vista nueva de la EP2 (requerimiento del cliente: que los tutores
   conozcan a los profesionales y elijan según la especie de su mascota).
   Estado: los filtros (useState). La lista visible se calcula en cada render. */
import { useState } from 'react'
import type { FiltrosEquipo as Filtros } from '../types/veterinario'
import { filtrarVeterinarios, listarVeterinarios } from '../services/veterinariosService'
import { FiltrosEquipo } from '../componentes/organismos/FiltrosEquipo'
import { GrillaEquipo } from '../componentes/organismos/GrillaEquipo'
import { TituloSeccion } from '../componentes/moleculas/TituloSeccion'

const SIN_FILTROS: Filtros = { texto: '', especialidad: '', especie: '' }

export default function EquipoPage() {
  const [filtros, setFiltros] = useState<Filtros>(SIN_FILTROS)
  const visibles = filtrarVeterinarios(listarVeterinarios(), filtros)

  return (
    <main className="equipo-pagina">
      <div className="contenedor">
        <TituloSeccion
          etiqueta="Conoce a quienes cuidan a tu mascota"
          titulo="Nuestro equipo veterinario"
          descripcion="Filtra por especialidad o por la especie de tu mascota para encontrar al profesional indicado."
        />
        <FiltrosEquipo filtros={filtros} onCambio={setFiltros} onLimpiar={() => setFiltros(SIN_FILTROS)} />
        <p className="equipo-resumen" aria-live="polite">
          {visibles.length} {visibles.length === 1 ? 'profesional encontrado' : 'profesionales encontrados'}
        </p>
        <GrillaEquipo veterinarios={visibles} />
      </div>
    </main>
  )
}
