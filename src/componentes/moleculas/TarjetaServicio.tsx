/* MOLÉCULA — Tarjeta de servicio / beneficio (imagen + título + texto).
   Se reutiliza en "Nuestros servicios" y en las tarjetas flotantes del hero. */
export interface TarjetaServicioProps {
  imagen: string
  titulo: string
  descripcion: string
  variante?: 'servicio' | 'flotante'
}

export function TarjetaServicio({ imagen, titulo, descripcion, variante = 'servicio' }: TarjetaServicioProps) {
  if (variante === 'flotante') {
    return (
      <div className="tarjeta-flotante">
        <img src={imagen} alt="" className="tarjeta-flotante-imagen" />
        <h3>{titulo}</h3>
        <p>{descripcion}</p>
      </div>
    )
  }
  return (
    <article className="valor">
      <img src={imagen} alt="" className="icono-valor" />
      <h3>{titulo}</h3>
      <p>{descripcion}</p>
    </article>
  )
}
