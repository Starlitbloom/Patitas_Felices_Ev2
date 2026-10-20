# Patitas Felices — EP2 (React + Vite + TypeScript)

Sistema web de la **Veterinaria San Marcos** (Rancagua), migrado desde HTML/CSS/JS de la EP1 a **React 19 + Vite + TypeScript**.
Curso DSY1104 - Desarrollo Fullstack II

## Cómo ejecutar

Requisitos: **Node.js 18 o superior** (recomendado 20+).

```bash
npm install          # instala dependencias (solo la primera vez)
npm run dev          # levanta el sitio en http://localhost:5173
npm test             # pruebas en modo "watch" (se repiten al guardar)
npm run test:run     # ejecuta todas las pruebas una vez
npm run coverage     # pruebas + reporte de cobertura (carpeta coverage/)
npm run build        # compila para producción (carpeta dist/)
```

Cuentas admin de prueba: `ma.calfileo@duoc.cl` / `1234` y `ro.cruces@duoc.cl` / `1234`.
Cliente de ejemplo: `camila.rojas@gmail.com` / `gato123`.

## Tecnologías

| Requisito de la pauta | Cómo se cumple |
|---|---|
| React + Vite + TypeScript | Proyecto creado con `create-vite` (plantilla `react-ts`) |
| Atomic Design | `src/componentes/atomos`, `moleculas`, `organismos`, `plantillas` + `src/paginas` |
| Estado y formularios controlados | `useState` en formularios y páginas; inputs con `value` + `onChange` |
| Fuente de datos simulada con CRUD | `src/services/usuariosService.ts` (sobre localStorage) |
| Navegación | React Router 7 (`src/routes/AppRoutes.tsx`), detalle con parámetro `/admin/usuarios/:id` |
| Responsividad | Bootstrap 5 + react-bootstrap (Navbar colapsable, Offcanvas, grilla, `table-responsive`) |
| Pruebas | Vitest + React Testing Library + jsdom (16 pruebas en `src/tests`, documentadas en el informe de pruebas) |

## Estructura

```
src/
├── componentes/
│   ├── atomos/       Piezas mínimas: Boton, EnlaceBoton, Insignia, MensajeError, Avatar, Etiqueta
│   ├── moleculas/    Combinan átomos: CampoFormulario, SelectorRegionComuna, FilaUsuario, TarjetaVeterinario…
│   ├── organismos/   Secciones completas: Encabezado, TablaUsuarios, FormularioUsuario, FiltrosEquipo, Modal…
│   └── plantillas/   Esqueletos de página: PlantillaPublica, PlantillaAdmin
├── paginas/          Páginas (contenedores): Inicio, Login, Registro, Perfil, Equipo, admin/*
├── services/         Fuente de datos: usuariosService (CRUD), sesionService, almacenamiento
├── context/          AuthContext: la sesión compartida por toda la app
├── routes/           Mapa de rutas y guardia de rutas protegidas
├── data/             Datos fijos: regiones, usuarios iniciales, contenido de inicio
├── types/            Tipos TypeScript (Usuario, Rol, Filtros…)
├── utils/            Funciones puras: validaciones, exportar a Excel, imágenes
├── styles/           CSS de la EP1 + ajustes-react.css
└── tests/            16 pruebas unitarias (P01–P16)
public/img/           Imágenes (se usan como /img/archivo.png)
```

## Rutas

| Ruta | Página | Acceso |
|---|---|---|
| `/` | Inicio | público |
| `/login`, `/registro` | Inicio de sesión / Registro | público |
| `/equipo` | Nuestro equipo veterinario (vista nueva, con filtros) | público |
| `/equipo/:id` | Perfil de un veterinario | público |
| `/perfil` | Mi perfil | con sesión |
| `/admin` | Dashboard | admin |
| `/admin/usuarios` | Gestión de usuarios (CRUD + filtros) | admin |
| `/admin/usuarios/:id` | Detalle de un usuario | admin |
| `/admin/reportes` | Reportes con gráficos | admin |
| `/nosotros`, `/novedades`, `/contacto`, `/mascotas`, `/solicitar-cita`, `/mis-citas`, `/admin/mascotas`, `/admin/citas` | Pendientes de migrar | — |

Más detalles en [`docs/`](docs): guía del equipo, documento de testing y guía de estudio.
