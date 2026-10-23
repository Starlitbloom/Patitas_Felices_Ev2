/* MOLÉCULA — Pestañas del detalle de mascota (ficha / historial / vacunas). */
export type PestanaClinica = 'ficha' | 'historial' | 'vacunas'

const PESTANAS: { valor: PestanaClinica; texto: string }[] = [
  { valor: 'ficha', texto: 'Ficha clínica' },
  { valor: 'historial', texto: 'Historial clínico' },
  { valor: 'vacunas', texto: 'Vacunas' },
]

export interface PestanasClinicasProps {
  activa: PestanaClinica
  onCambio: (pestana: PestanaClinica) => void
}

export function PestanasClinicas({ activa, onCambio }: PestanasClinicasProps) {
  return (
    <div className="clinica-tabs" role="tablist">
      {PESTANAS.map((p) => (
        <button
          key={p.valor}
          type="button"
          role="tab"
          aria-selected={activa === p.valor}
          className={`clinica-tab ${activa === p.valor ? 'activo' : ''}`}
          onClick={() => onCambio(p.valor)}
        >
          {p.texto}
        </button>
      ))}
    </div>
  )
}