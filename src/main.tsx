/* Punto de entrada: carga estilos, prepara los datos y monta la app. */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// 1) Bootstrap primero, 2) estilos de la EP1 encima, 3) ajustes para React
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/styles.css'
import './styles/estilo-index.css'
import './styles/estilo-usuarios.css'
import './styles/estilo-admin.css'
import './styles/estilo-equipo.css'
import './styles/ajustes-react.css'

import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
