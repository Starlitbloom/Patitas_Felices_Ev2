/* ORGANISMO — "Patitas Felices en números" (contadores animados). */
import { ESTADISTICAS } from '../../data/contenidoInicio'
import { Estadistica } from '../moleculas/Estadistica'
import { TituloSeccion } from '../moleculas/TituloSeccion'

export function SeccionEstadisticas() {
  return (
    <section className="estadisticas">
      <div className="contenedor">
        <TituloSeccion etiqueta="Confianza que se nota" titulo="Patitas Felices en números" />
        <div className="grid-estadisticas">
          {ESTADISTICAS.map((e) => (
            <Estadistica key={e.etiqueta} {...e} />
          ))}
        </div>
      </div>
    </section>
  )
}
