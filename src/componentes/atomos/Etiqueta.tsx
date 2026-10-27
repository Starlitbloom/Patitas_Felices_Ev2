/* ÁTOMO — Etiqueta de sección (texto pequeño sobre los títulos). */
import type { ReactNode } from 'react'

/** Pastilla de texto pequeña que va sobre los títulos (ej: "Médica veterinaria"). */
export function Etiqueta({ children }: { children: ReactNode }) {
  return <span className="seccion-etiqueta">{children}</span>
}
