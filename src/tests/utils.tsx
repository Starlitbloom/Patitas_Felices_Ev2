/* Ayudante para las pruebas: renderiza un componente dentro de
   las mismas "envolturas" que usa la app (sesión + enrutador). */
import type { ReactElement } from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'

export function renderConApp(ui: ReactElement, rutaInicial = '/') {
  return render(
    <MemoryRouter initialEntries={[rutaInicial]}>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>,
  )
}
