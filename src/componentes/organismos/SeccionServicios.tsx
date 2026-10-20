/* ORGANISMO — "Nuestros servicios": una TarjetaServicio por cada servicio. */
import { SERVICIOS } from '../../data/contenidoInicio'
import { TarjetaServicio } from '../moleculas/TarjetaServicio'
import { TituloSeccion } from '../moleculas/TituloSeccion'

export function SeccionServicios() {
  return (
    <section className="valores" id="servicios">
      <div className="contenedor">
        <TituloSeccion
          etiqueta="Lo que ofrecemos"
          titulo="Nuestros servicios"
          descripcion="Atención veterinaria pensada en la salud y el bienestar de tu mascota."
        />
        <div className="grid-valores">
          {SERVICIOS.map((s) => (
            <TarjetaServicio key={s.titulo} {...s} />
          ))}
        </div>
      </div>
    </section>
  )
}
