/* MOLÉCULA — Selectores dependientes región → comuna.
   Reemplaza a initRegionComuna() y poblarRegionComuna() de la EP1:
   las comunas se calculan a partir de la región elegida, sin tocar el DOM. */
import { REGIONES, comunasDeRegion } from '../../data/regiones'
import { CampoSelector } from './CampoSelector'

export interface SelectorRegionComunaProps {
  idPrefijo: string
  region: string
  comuna: string
  onCambio: (valores: { region: string; comuna: string }) => void
  errorRegion?: string | null
  errorComuna?: string | null
}

const OPCIONES_REGION = REGIONES.map((r) => ({ valor: r.nombre, texto: r.nombre }))

export function SelectorRegionComuna({
  idPrefijo,
  region,
  comuna,
  onCambio,
  errorRegion,
  errorComuna,
}: SelectorRegionComunaProps) {
  const comunas = comunasDeRegion(region).map((c) => ({ valor: c, texto: c }))

  return (
    <div className="row">
      <div className="col-md-6">
        <CampoSelector
          id={`${idPrefijo}-region`}
          etiqueta="Región"
          valor={region}
          // al cambiar de región, la comuna anterior deja de ser válida
          onCambio={(nuevaRegion) => onCambio({ region: nuevaRegion, comuna: '' })}
          opciones={OPCIONES_REGION}
          textoVacio="Selecciona la región"
          error={errorRegion}
        />
      </div>
      <div className="col-md-6">
        <CampoSelector
          id={`${idPrefijo}-comuna`}
          etiqueta="Comuna"
          valor={comuna}
          onCambio={(nuevaComuna) => onCambio({ region, comuna: nuevaComuna })}
          opciones={comunas}
          textoVacio={region ? 'Selecciona la comuna' : 'Primero elige una región'}
          error={errorComuna}
          disabled={!region}
        />
      </div>
    </div>
  )
}
