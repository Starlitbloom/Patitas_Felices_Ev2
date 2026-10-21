/* MOLÉCULA — Tarjeta de un integrante del equipo.
   Un mismo componente muestra a cualquier integrante:
   los datos llegan por props tipadas (como la CardProducto de clases). */
import type { Veterinario } from '../../types/veterinario'
import { EnlaceBoton } from '../atomos/EnlaceBoton'

export interface TarjetaVeterinarioProps {
  veterinario: Veterinario
}

export function TarjetaVeterinario({ veterinario }: TarjetaVeterinarioProps) {
  const { id, nombre, cargo, area, especies, experiencia, imagen } = veterinario
  return (
    <article className="equipo-tarjeta h-100">
      <img src={imagen} alt="" className="equipo-tarjeta-imagen" />
      <div className="equipo-tarjeta-cuerpo">
        <span className="seccion-etiqueta">{cargo}</span>
        <h3>{nombre}</h3>
        <p className="equipo-tarjeta-dato">{area}</p>
        <p className="equipo-tarjeta-dato">{experiencia} años de experiencia</p>
        {especies.length > 0 && (
          <ul className="equipo-especies" aria-label={`Especies que atiende ${nombre}`}>
            {especies.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        )}
        <div className="mt-auto pt-2">
          <EnlaceBoton to={`/equipo/${id}`}>Ver perfil</EnlaceBoton>
        </div>
      </div>
    </article>
  )
}
