# Patitas Felices — EP2 (React + Vite + TypeScript)

Sistema web de la **Veterinaria San Marcos** (Rancagua), migrado desde HTML/CSS/JS de la EP1 a **React 19 + Vite + TypeScript**.

## Cómo ejecutar el proyecto

Requisitos: tener instalado **Node.js 18 o superior** (recomendado 20+). Se puede revisar con `node -v`.

1. Descargar o clonar el repositorio y abrir la carpeta del proyecto en VS Code.
2. Abrir una terminal en la carpeta del proyecto (en VS Code: **Terminal → New Terminal**).
3. Instalar las dependencias (solo la primera vez):
```bash
   npm install
```
4. Levantar el sitio:
```bash
   npm run dev
```
5. Abrir en el navegador la dirección que aparece en la terminal: **http://localhost:5173**
6. Para detener el sitio, presionar **Ctrl + C** en la terminal.

### Otros comandos

```bash
npm run test:run     # ejecuta todas las pruebas unitarias una vez
npm test             # pruebas en modo "watch" (se repiten al guardar)
npm run coverage     # pruebas + reporte de cobertura (carpeta coverage/)
npm run build        # compila para producción (carpeta dist/)
```

## Cuentas de prueba (los 3 roles del caso)

| Rol | Correo | Clave | Qué puede hacer |
|---|---|---|---|
| Administrador | `ma.calfileo@duoc.cl` (o `ro.cruces@duoc.cl`) | `1234` | Todo el panel: usuarios, reportes, mascotas, citas y agenda |
| Recepcionista | `jo.medina@duoc.cl` | `1234` | Panel sin usuarios ni reportes: mascotas, citas y agenda |
| Dueño de mascota | `camila.rojas@gmail.com` | `gato123` | Perfil, mis mascotas, solicitar cita y mis citas |

## Tecnologías y requisitos de la pauta

| Requisito | Cómo se cumple |
|---|---|
| React + Vite + TypeScript | Proyecto creado con `create-vite` (plantilla `react-ts`) |
| Atomic Design | `src/componentes/atomos`, `moleculas`, `organismos`, `plantillas` + `src/paginas` |
| Patrón de diseño | Contenedor / Presentacional + capa de servicios: las páginas tienen el estado y llaman a los servicios; los componentes reciben datos por props |
| Estado y formularios controlados | `useState` en formularios y páginas; inputs con `value` + `onChange` y validación antes de guardar |
| Fuente de datos simulada con CRUD | Servicios sobre localStorage: `usuariosService`, `mascotasService`, `citasService` |
| Navegación | React Router 7 (`src/routes/AppRoutes.tsx`), rutas protegidas por rol y detalles con parámetro (`/equipo/:id`, `/mascotas/:id`, `/admin/usuarios/:id`) |
| Responsividad | Bootstrap 5 + react-bootstrap (Navbar colapsable, Offcanvas, grilla `col-12 col-md-6 col-lg-4`, `table-responsive`) |
| Pruebas unitarias | Vitest + React Testing Library + jsdom, en `src/tests` |

## Estructura

```
src/
├── componentes/
│   ├── atomos/       Piezas mínimas: Boton, EnlaceBoton, Insignia, MensajeError, Avatar, Etiqueta
│   ├── moleculas/    Combinan átomos: CampoFormulario, TarjetaVeterinario, TarjetaMascota, TarjetaKpi…
│   ├── organismos/   Secciones completas: Encabezado, TablaUsuarios, FormularioSolicitarCita, AgendaVeterinario…
│   └── plantillas/   Esqueletos de página: PlantillaPublica, PlantillaAdmin
├── paginas/          Páginas (contenedores) del sitio público y del panel (admin/)
├── services/         Fuente de datos y lógica: usuarios, mascotas, citas, veterinarios, agenda, sesión
├── context/          AuthContext: la sesión compartida por toda la app
├── routes/           Mapa de rutas y guardia de rutas protegidas por rol
├── data/             Datos iniciales: usuarios, mascotas, veterinarios, servicios, novedades, regiones
├── types/            Tipos TypeScript (Usuario, Rol, Mascota, Veterinario…)
├── utils/            Funciones puras: validaciones, fechas, vacunas, exportar a Excel
├── styles/           CSS de la EP1 + ajustes-react.css
└── tests/            Pruebas unitarias
public/img/           Imágenes (se usan como /img/archivo.png)
```

## Rutas

| Ruta | Página | Acceso |
|---|---|---|
| `/` | Inicio | público |
| `/login`, `/registro` | Inicio de sesión / Registro | público |
| `/nosotros` | Quiénes somos | público |
| `/novedades`, `/detalle-novedad` | Novedades y detalle de una novedad | público |
| `/contacto` | Contacto | público |
| `/equipo` | Nuestro equipo: 3 médicos veterinarios, 1 técnico y 1 recepcionista (vista nueva, con filtros) | público |
| `/equipo/:id` | Perfil del integrante + agenda semanal de disponibilidad (médicos) | público |
| `/perfil` | Mi perfil | con sesión |
| `/mascotas`, `/mascotas/:id` | Mis mascotas y detalle (ficha clínica, historial, vacunas) | con sesión |
| `/solicitar-cita` | Solicitar cita (recibe médico, fecha y hora desde la agenda) | con sesión |
| `/mis-citas` | Mis citas: estado, reprogramar o cancelar | con sesión |
| `/admin` | Dashboard (distinto según el rol) | admin y recepcionista |
| `/admin/mascotas` | Gestión de mascotas y pacientes | admin y recepcionista |
| `/admin/citas` | Administración de citas: confirmar, completar, cancelar, reagendar | admin y recepcionista |
| `/admin/agenda` | Agenda del día por médico (solo lectura) | admin y recepcionista |
| `/admin/usuarios`, `/admin/usuarios/:id` | Gestión de usuarios (CRUD + filtros) y detalle | solo admin |
| `/admin/reportes` | Reportes con gráficos | solo admin |

## Pruebas unitarias

Se ejecutan con `npm run test:run`. Cada integrante probó su propio módulo.
Los datos de entrada de cada prueba están al comienzo, bajo el comentario `// Datos de prueba`:
se pueden cambiar para comprobar que la prueba falla.

| Archivo | Prueba | Qué verifica |
|---|---|---|
| `usuarios.test.tsx` | P01 CREATE | `crearUsuario` agrega un usuario y la lista pasa de 8 a 9 |
| `usuarios-eliminar.test.tsx` | P02 DELETE | Eliminar un usuario con confirmación lo quita de la tabla y de los datos |
| `equipo.test.tsx` | P03 Filtro + responsivo *(obligatoria)* | Las tarjetas del equipo tienen `col-12`, `col-md-6` y `col-lg-4`; filtrar por cargo deja 3 médicos y sin resultados muestra un mensaje |
| `login.test.tsx` | P04 Validación + espía | El login con datos inválidos muestra errores y no envía (`vi.fn()`) |
| `agenda.test.ts` | P05 Agenda | Una hora con cita aparece ocupada y los días sin atención no tienen horas |
| `mascotas.test.tsx` | P06 Filtro | En Mis mascotas, elegir una especie o buscar por nombre reduce la lista; sin resultados muestra "0 mascotas encontradas" |
| `detalle-mascota.test.tsx` | P07 READ | El detalle de una mascota muestra su ficha y, si el id no existe, el aviso "Mascota no encontrada" |
| `admin-editar-mascota.test.tsx` | P08 UPDATE | Editar la raza de una mascota en el panel actualiza la tabla y los datos guardados |
| `admin-eliminar-mascota.test.tsx` | P09 DELETE | Eliminar una mascota con confirmación la quita de la tabla y de los datos |
| `ficha-clinica.test.tsx` | P10 CREATE + espía | El formulario de atención no guarda con datos vacíos y, al completarlo, llama una vez a `onSubmit` (`vi.fn()`) |
| `solicitar-cita-registro.test.tsx` | P11 CREATE | `crearCita` registra una cita Pendiente de 30 minutos, la lista del usuario tiene 1 y la consulta general cuesta $15.000 |
| `solicitar-cita-veterinario.test.tsx` | P12 Validación | Un veterinario que no atiende el servicio es rechazado y no se guarda ninguna cita |
| `solicitar-cita-horarios.test.tsx` | P13 Horarios | Una cirugía de 10:00 deja ocupadas las 11:00 y una segunda cita a esa hora es rechazada |
| `solicitar-cita-cancelacion.test.tsx` | P14 UPDATE | Cancelar una cita libera el horario y permite reservarlo de nuevo |
| `solicitar-cita-mascota-registrada.test.tsx` | P15 Sin duplicados | Registrar la misma mascota dos veces (aunque cambie mayúsculas o espacios) deja una sola ficha |


## Integrantes

| Integrante | Módulo |
|---|---|
| Maria Calfileo 1
| Stephanie Chamorro
| Rocio Cruces