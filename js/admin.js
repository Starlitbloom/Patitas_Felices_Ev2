/* =========================================================
   PATITAS FELICES — admin.js
   Lógica del panel de administración: protección de acceso,
   KPIs del dashboard, y gestión de usuarios (tabla, filtros,
   modal Ver, panel inline Editar, exportación a Excel).
   Depende de las funciones ya definidas en usuarios.js
   (obtenerUsuarios, guardarUsuarios, obtenerSesion,
   guardarSesion, cerrarSesion, validarRequerido, validarCorreo,
   validarPassword, marcarCampo, REGIONES).
========================================================= */

/**
 * Guardia de acceso: si no hay sesión o el usuario no es admin,
 * redirige a login.html y corta la ejecución (return null).
 * Se debe llamar SIEMPRE al inicio de cualquier init de una página del panel.
 */
function protegerRutaAdmin() {
    const sesion = obtenerSesion();

    if (!sesion || sesion.rol !== 'admin') {
        window.location.href = '../html/login.html';
        return null;
    }

    return sesion;
}

/* ================= DASHBOARD ================= */

/**
 * Inicializa dashboard.html: nombre del admin, KPIs y tabla de últimos usuarios.
 * Si los elementos del dashboard no existen en el DOM (ej. estamos en otra página
 * del panel), cada getElementById devuelve null y el "if" correspondiente lo salta,
 * por eso es seguro llamar esta función en todas las páginas admin sin romper nada.
 */
function initDashboardAdmin() {
    const sesion = protegerRutaAdmin();
    if (!sesion) return;

    const nombreDisplay = document.getElementById('admin-nombre-display');
    if (nombreDisplay) nombreDisplay.textContent = sesion.nombre || 'Admin';

    const usuarios = obtenerUsuarios();

    // KPI: total de usuarios registrados
    const kpiTotal = document.getElementById('kpi-total-usuarios');
    if (kpiTotal) kpiTotal.textContent = usuarios.length;

    // KPI: usuarios cuyo fechaRegistro cae dentro de los últimos 7 días
    const unaSemanaMs = 7 * 24 * 60 * 60 * 1000;
    const ahora = Date.now();
    const nuevosSemana = usuarios.filter((u) => {
        if (!u.fechaRegistro) return false; // usuarios antiguos sin esa fecha no cuentan como "nuevos"
        return ahora - new Date(u.fechaRegistro).getTime() <= unaSemanaMs;
    }).length;
    const kpiNuevos = document.getElementById('kpi-nuevos-semana');
    if (kpiNuevos) kpiNuevos.textContent = nuevosSemana;

    // Mascotas y citas viven en sus propias claves de localStorage (fuera de usuarios.js),
    // por eso se leen acá directamente en vez de con una función helper
    let mascotas = [];
    let citas = [];
    try {
        mascotas = JSON.parse(localStorage.getItem('patitasFelices_mascotas')) || [];
    } catch { mascotas = []; } // localStorage corrupto o vacío: se asume lista vacía en vez de romper la página
    try {
        citas = JSON.parse(localStorage.getItem('patitasFelices_citas')) || [];
    } catch { citas = []; }

    const kpiMascotas = document.getElementById('kpi-mascotas');
    if (kpiMascotas) kpiMascotas.textContent = mascotas.length;

    const kpiCitas = document.getElementById('kpi-citas');
    if (kpiCitas) {
        const pendientes = citas.filter((c) => (c.estado || '').toLowerCase() === 'pendiente').length;
        kpiCitas.textContent = pendientes;
    }

    // KPI: solicitudes de cambio de mascota pendientes de revisión (clave propia en localStorage)
    const kpiSolicitudesMascotas = document.getElementById('kpi-solicitudes-mascotas');
    if (kpiSolicitudesMascotas) {
        let solicitudesMascotas = [];
        try {
            solicitudesMascotas = JSON.parse(localStorage.getItem('patitasFelices_solicitudesMascotas')) || [];
        } catch { solicitudesMascotas = []; }
        const pendientesMascotas = solicitudesMascotas.filter((s) => s.estado === 'pendiente').length;
        kpiSolicitudesMascotas.textContent = pendientesMascotas;
    }

    // Tabla "Últimos usuarios registrados": toma los 5 más recientes del array
    // (asumiendo que los usuarios nuevos se agregan al final del array) y los invierte
    // para mostrar primero al más reciente
    const tbody = document.getElementById('admin-tabla-recientes');
    const vacia = document.getElementById('admin-tabla-vacia');

    if (tbody) {
        const ultimos = usuarios.slice(-5).reverse();

        if (ultimos.length === 0) {
            if (vacia) vacia.style.display = 'block';
        } else {
            tbody.innerHTML = ultimos.map((u) => {
                const rol = u.rol || 'cliente';
                const badgeClase = rol === 'admin' ? 'admin-badge--admin' : 'admin-badge--cliente';
                return `
                    <tr>
                        <td>${u.nombre || ''} ${u.apellidos || ''}</td>
                        <td>${u.correo || ''}</td>
                        <td>${u.comuna || 'Sin comuna'}</td>
                        <td><span class="admin-badge ${badgeClase}">${rol}</span></td>
                    </tr>
                `;
            }).join('');
        }
    }
}

/**
 * Conecta el botón "Cerrar sesión" del sidebar admin: limpia la sesión (usuarios.js)
 * y redirige a login.html. Se usa preventDefault porque el <a> tiene href="#".
 */
function initBotonCerrarSesionAdmin() {
    const btn = document.getElementById('btn-cerrar-sesion-admin');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        cerrarSesion();
        window.location.href = '../html/login.html';
    });
}

/* ================= GESTIÓN DE USUARIOS ================= */

// Estado del módulo de usuarios.html, en variables de módulo (no en el DOM) para que
// sobrevivan entre renders de la tabla sin tener que releerlos de los inputs cada vez
let filtroTextoUsuarios = '';
let filtroRolUsuarios = '';
let ordenUsuarios = 'recientes';
let correosSeleccionados = new Set(); // usa el correo como identificador único de cada fila marcada

/**
 * Inicializa usuarios.html: primer render de la tabla, listeners de los filtros,
 * exportación de la selección, y los 3 modales (Ver / Editar / Crear).
 */
function initPaginaUsuarios() {
    const sesion = protegerRutaAdmin();
    if (!sesion) return;

    renderTablaUsuarios();

    // Búsqueda libre: se re-renderiza la tabla en cada tecla (sin debounce)
    const buscador = document.getElementById('admin-buscador');
    if (buscador) {
        buscador.addEventListener('input', () => {
            filtroTextoUsuarios = buscador.value.trim().toLowerCase();
            renderTablaUsuarios();
        });
    }

    const filtroRol = document.getElementById('admin-filtro-rol');
    if (filtroRol) {
        filtroRol.addEventListener('change', () => {
            filtroRolUsuarios = filtroRol.value;
            renderTablaUsuarios();
        });
    }

    const selectOrden = document.getElementById('admin-orden');
    if (selectOrden) {
        selectOrden.addEventListener('change', () => {
            ordenUsuarios = selectOrden.value;
            renderTablaUsuarios();
        });
    }

    // "Limpiar": resetea tanto el estado en JS como los controles visuales del HTML
    const btnLimpiar = document.getElementById('admin-btn-limpiar');
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', () => {
            filtroTextoUsuarios = '';
            filtroRolUsuarios = '';
            ordenUsuarios = 'recientes';
            if (buscador) buscador.value = '';
            if (filtroRol) filtroRol.value = '';
            if (selectOrden) selectOrden.value = 'recientes';
            renderTablaUsuarios();
        });
    }

    // Exporta a Excel SOLO los usuarios marcados con checkbox (correosSeleccionados)
    const btnExportarSeleccion = document.getElementById('admin-btn-exportar-seleccion');
    if (btnExportarSeleccion) {
        btnExportarSeleccion.addEventListener('click', () => {
            if (correosSeleccionados.size === 0) {
                alert('Selecciona al menos un usuario para exportar.');
                return;
            }
            const usuarios = obtenerUsuarios().filter((u) => correosSeleccionados.has(u.correo));
            exportarUsuariosComoExcel(usuarios, 'usuarios-seleccionados');
        });
    }

    initModalesUsuarios(sesion);
    initCheckTodos();
}

/**
 * Aplica, en orden, el filtro de texto, el filtro de rol y el orden seleccionado
 * sobre la lista completa de usuarios. No muta el array original de obtenerUsuarios().
 */
function obtenerUsuariosFiltradosYOrdenados() {
    let usuarios = obtenerUsuarios();

    if (filtroTextoUsuarios) {
        usuarios = usuarios.filter((u) => {
            // concatena varios campos en un solo string buscable, así una sola búsqueda
            // cubre RUN, nombre, apellidos y correo a la vez
            const texto = `${u.run || ''} ${u.nombre || ''} ${u.apellidos || ''} ${u.correo || ''}`.toLowerCase();
            return texto.includes(filtroTextoUsuarios);
        });
    }

    if (filtroRolUsuarios) {
        usuarios = usuarios.filter((u) => (u.rol || 'cliente') === filtroRolUsuarios);
    }

    if (ordenUsuarios === 'az') {
        usuarios = [...usuarios].sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));
    } else if (ordenUsuarios === 'za') {
        usuarios = [...usuarios].sort((a, b) => (b.nombre || '').localeCompare(a.nombre || ''));
    } else {
        // "recientes": como los usuarios nuevos se agregan al final del array,
        // invertirlo deja primero a los más recientes
        usuarios = [...usuarios].reverse();
    }

    return usuarios;
}

/**
 * Repinta por completo el <tbody> de la tabla de usuarios según los filtros/orden
 * actuales, y vuelve a conectar los checkboxes de cada fila (porque el innerHTML
 * nuevo borra los listeners anteriores).
 */
function renderTablaUsuarios() {
    const tbody = document.getElementById('admin-tabla-body');
    const vacia = document.getElementById('admin-tabla-vacia');
    if (!tbody) return;

    const sesion = obtenerSesion();
    const usuarios = obtenerUsuariosFiltradosYOrdenados();

    if (usuarios.length === 0) {
        tbody.innerHTML = '';
        if (vacia) vacia.style.display = 'block';
        return;
    }

    if (vacia) vacia.style.display = 'none';

    tbody.innerHTML = usuarios.map((u) => {
        const rol = u.rol || 'cliente';
        const badgeClase = rol === 'admin' ? 'admin-badge--admin' : 'admin-badge--cliente';
        // el admin no puede eliminar su propia cuenta mientras tiene sesión activa:
        // se detecta comparando el correo de la fila con el correo de la sesión
        const esUnoMismo = sesion && u.correo.toLowerCase() === sesion.correo.toLowerCase();
        const marcado = correosSeleccionados.has(u.correo) ? 'checked' : '';

        return `
            <tr>
                <td><input type="checkbox" class="admin-check-fila" data-correo="${u.correo}" ${marcado}></td>
                <td>${u.run || '—'}</td>
                <td>${u.nombre || ''}</td>
                <td>${u.apellidos || ''}</td>
                <td>${u.correo || ''}</td>
                <td>${u.comuna || 'Sin comuna'}</td>
                <td><span class="admin-badge ${badgeClase}">${rol}</span></td>
                <td>
                    <div class="admin-acciones-fila">
                        <button type="button" class="admin-btn-accion admin-btn-accion--ver" data-correo="${u.correo}" data-accion="ver">Ver</button>
                        <button type="button" class="admin-btn-accion admin-btn-accion--editar" data-correo="${u.correo}" data-accion="editar">Editar</button>
                        <button type="button" class="admin-btn-accion admin-btn-accion--eliminar" data-correo="${u.correo}" data-accion="eliminar" ${esUnoMismo ? 'disabled title="No puedes eliminar tu propia cuenta"' : ''}>Eliminar</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    // Los checkboxes se regeneran en cada render, así que hay que re-engancharles el evento
    // y sincronizar el Set de seleccionados según su estado marcado/desmarcado
    tbody.querySelectorAll('.admin-check-fila').forEach((chk) => {
        chk.addEventListener('change', () => {
            if (chk.checked) {
                correosSeleccionados.add(chk.dataset.correo);
            } else {
                correosSeleccionados.delete(chk.dataset.correo);
            }
            actualizarCheckTodos();
        });
    });

    actualizarCheckTodos();
}

/**
 * Sincroniza el checkbox "maestro" del encabezado: queda marcado solo si
 * TODAS las filas visibles están marcadas (y sin filas, queda desmarcado).
 */
function actualizarCheckTodos() {
    const checkTodos = document.getElementById('admin-check-todos');
    if (!checkTodos) return;

    const filas = document.querySelectorAll('.admin-check-fila');
    if (filas.length === 0) {
        checkTodos.checked = false;
        return;
    }
    checkTodos.checked = Array.from(filas).every((f) => f.checked);
}

/**
 * Conecta el checkbox maestro: al hacer clic, marca/desmarca todas las filas
 * visibles en la tabla y actualiza correosSeleccionados en consecuencia.
 * Nota: solo afecta a las filas actualmente renderizadas (según filtros aplicados),
 * no a todos los usuarios del sistema.
 */
function initCheckTodos() {
    const checkTodos = document.getElementById('admin-check-todos');
    if (!checkTodos) return;

    checkTodos.addEventListener('change', () => {
        document.querySelectorAll('.admin-check-fila').forEach((chk) => {
            chk.checked = checkTodos.checked;
            if (checkTodos.checked) {
                correosSeleccionados.add(chk.dataset.correo);
            } else {
                correosSeleccionados.delete(chk.dataset.correo);
            }
        });
    });
}

/* ================= EXPORTAR A EXCEL ================= */

/**
 * Convierte un array de usuarios a una hoja de Excel (vía SheetJS) y dispara la descarga.
 * Los nombres de columna se escriben "bonitos" (con mayúscula, sin camelCase) porque
 * son los que va a ver el admin al abrir el archivo.
 */
function exportarUsuariosComoExcel(usuarios, nombreArchivo) {
    const filas = usuarios.map((u) => ({
        RUN: u.run || '',
        Nombre: u.nombre || '',
        Apellidos: u.apellidos || '',
        Correo: u.correo || '',
        Telefono: u.telefono || '',
        Region: u.region || '',
        Comuna: u.comuna || '',
        Direccion: u.direccion || '',
        Rol: u.rol || 'cliente',
    }));

    const hoja = XLSX.utils.json_to_sheet(filas);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Usuarios');
    XLSX.writeFile(libro, `${nombreArchivo}.xlsx`);
}

/**
 * Atajo para exportar un solo usuario (usado desde el modal "Ver" → botón "Exportar").
 * El nombre del archivo se arma con la parte del correo antes del "@".
 */
function exportarUsuarioComoExcel(usuario) {
    exportarUsuariosComoExcel([usuario], `usuario-${usuario.correo.split('@')[0]}`);
}

/* ================= MODAL VER + PANEL EDITAR ================= */

/**
 * Configura los 3 paneles de usuarios.html (modal "Ver", panel "Editar", panel "Crear"):
 * abrir/cerrar, precarga de datos y el submit de cada formulario.
 * Se llama una sola vez desde initPaginaUsuarios().
 */
function initModalesUsuarios(sesion) {
    const tbody = document.getElementById('admin-tabla-body');

    const modalVerFondo = document.getElementById('modal-ver-fondo');
    const modalVerContenido = document.getElementById('modal-ver-contenido');
    const modalVerCerrar = document.getElementById('modal-ver-cerrar');

    const panelEditar = document.getElementById('panel-editar');
    const btnCerrarEditar = document.getElementById('btn-cerrar-editar');
    const btnCancelarEditar = document.getElementById('btn-cancelar-editar');
    const formEditar = document.getElementById('form-editar-usuario');

    const panelCrear = document.getElementById('panel-crear');
    const btnCerrarCrear = document.getElementById('btn-cerrar-crear');
    const btnCancelarCrear = document.getElementById('btn-cancelar-crear');
    const formCrear = document.getElementById('form-crear-usuario');
    const accesoNuevo = document.getElementById('acceso-nuevo');

    if (!tbody) return; // si no estamos en usuarios.html, no tiene sentido seguir configurando estos paneles

    // Delegación de eventos: un solo listener en el tbody captura los clics de
    // Ver/Editar/Eliminar de TODAS las filas, incluidas las que se regeneran en cada render
    tbody.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-accion]');
        if (!btn) return;
        manejarAccionUsuario(btn.dataset.correo, btn.dataset.accion);
    });

    // Mismo patrón de delegación, pero para los botones de acción DENTRO del modal "Ver"
    // (editar/eliminar/exportar desde ahí mismo)
    modalVerContenido.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-accion]');
        if (!btn) return;
        manejarAccionUsuario(btn.dataset.correo, btn.dataset.accion);
    });

    // Punto único que decide qué hacer según la acción clickeada, sin importar
    // si el clic vino de la tabla o del modal "Ver"
    function manejarAccionUsuario(correo, accion) {
        const usuarios = obtenerUsuarios();
        const usuario = usuarios.find((u) => u.correo === correo);
        if (!usuario) return;

        if (accion === 'ver') {
            abrirModalVer(usuario);
        } else if (accion === 'editar') {
            modalVerFondo.style.display = 'none'; // si veníamos del modal Ver, lo cerramos antes de abrir Editar
            abrirPanelEditar(usuario);
        } else if (accion === 'eliminar') {
            modalVerFondo.style.display = 'none';
            eliminarUsuarioConConfirmacion(usuario, sesion);
        } else if (accion === 'exportar') {
            exportarUsuarioComoExcel(usuario);
        }
    }

    // Arma el HTML de detalle del usuario dentro del modal "Ver"
    function abrirModalVer(usuario) {
        const rol = usuario.rol || 'cliente';
        const badgeRolClase = rol === 'admin' ? 'admin-badge--admin' : 'admin-badge--cliente';
        const avatarSrc = usuario.avatar || '';
        // Fallback de iniciales cuando el usuario no tiene foto: primera letra de nombre + apellido
        const iniciales = `${(usuario.nombre || '?')[0]}${(usuario.apellidos || '')[0] || ''}`.toUpperCase();

        modalVerContenido.innerHTML = `
            <div class="admin-detalle-cabecera">
                <div class="admin-detalle-avatar">
                    ${avatarSrc
                        ? `<img src="${avatarSrc}" alt="Foto de ${usuario.nombre}">`
                        : `<span>${iniciales}</span>`}
                </div>

                <div class="admin-detalle-info">
                    <h3>${usuario.nombre || ''} ${usuario.apellidos || ''}</h3>
                    <p class="admin-detalle-run">RUN: ${usuario.run || '—'}</p>

                    <div class="admin-detalle-linea">
                        <strong>${usuario.correo || '—'}</strong>
                        <span class="admin-badge ${badgeRolClase}">${rol}</span>
                    </div>

                    <p class="admin-detalle-linea admin-detalle-secundaria">
                        Tel: ${usuario.telefono || 'No registrado'} · ${usuario.region || 'Sin región'}${usuario.comuna ? ' / ' + usuario.comuna : ''}
                    </p>

                    <!-- Nota: este badge "Activo" está fijo/hardcodeado, no lee usuario.activo -->
                    <!-- así que siempre se va a mostrar como activo aunque el usuario esté desactivado -->
                    <span class="admin-badge admin-badge--activo">Activo</span>
                </div>
            </div>

            <div class="admin-detalle-acciones">
                <button type="button" class="admin-btn-accion admin-btn-accion--editar" data-correo="${usuario.correo}" data-accion="editar">✏️ Editar</button>
                <button type="button" class="admin-btn-accion admin-btn-accion--eliminar" data-correo="${usuario.correo}" data-accion="eliminar">🗑️ Eliminar</button>
                <button type="button" class="admin-btn-accion" data-correo="${usuario.correo}" data-accion="exportar">📤 Exportar</button>
            </div>
        `;
        modalVerFondo.style.display = 'flex';
    }

    // Precarga el formulario de edición con los datos actuales del usuario.
    // El campo RUN queda con el valor pero el input está "disabled" en el HTML (no editable).
    function abrirPanelEditar(usuario) {
        document.getElementById('editar-correo-original').value = usuario.correo; // clave para ubicar el registro al guardar
        document.getElementById('editar-run').value = usuario.run || '';
        document.getElementById('editar-correo').value = usuario.correo || '';
        document.getElementById('editar-nombre').value = usuario.nombre || '';
        document.getElementById('editar-apellidos').value = usuario.apellidos || '';
        document.getElementById('editar-telefono').value = usuario.telefono || '';
        document.getElementById('editar-direccion').value = usuario.direccion || '';
        document.getElementById('editar-password').value = ''; // siempre vacío: dejarlo así = "mantener la actual"
        document.getElementById('editar-password2').value = '';
        document.getElementById('editar-rol').value = usuario.rol || 'cliente';
        document.getElementById('editar-activo').checked = usuario.activo !== false; // por defecto activo si el campo no existe

        poblarRegionComuna('editar', usuario.region, usuario.comuna);

        panelEditar.style.display = 'flex';
    }

    // Limpia y resetea el formulario de creación (a diferencia de editar, acá no hay
    // datos previos que precargar) y quita cualquier marca de error de un intento anterior
    function abrirPanelCrear() {
        formCrear.reset();
        document.getElementById('crear-activo').checked = true;
        ['crear-run', 'crear-correo', 'crear-nombre', 'crear-apellidos', 'crear-password', 'crear-password2'].forEach((id) => {
            const campo = document.getElementById(id).closest('.campo');
            if (campo) campo.classList.remove('campo--invalido', 'campo--valido');
        });

        poblarRegionComuna('crear', '', '');

        panelCrear.style.display = 'flex';
    }

    /**
     * Llena dinámicamente los <select> de región y comuna de un formulario
     * (usa el prefijo "editar-" o "crear-" para encontrar los ids correctos).
     * Al elegir una región, vuelve a llenar el select de comuna con las comunas
     * de esa región (sin comuna preseleccionada la segunda vez, por eso el
     * onchange pasa `null` como comunaSeleccionada).
     */
    function poblarRegionComuna(prefijo, regionGuardada, comunaGuardada) {
        const selectRegion = document.getElementById(`${prefijo}-region`);
        const selectComuna = document.getElementById(`${prefijo}-comuna`);
        if (!selectRegion || !selectComuna) return;

        selectRegion.innerHTML = '<option value="">Selecciona la región</option>';
        REGIONES.forEach((r) => {
            const opt = document.createElement('option');
            opt.value = r.nombre;
            opt.textContent = r.nombre;
            selectRegion.appendChild(opt);
        });

        function llenarComunas(nombreRegion, comunaSeleccionada) {
            const region = REGIONES.find((r) => r.nombre === nombreRegion);
            selectComuna.innerHTML = '<option value="">Selecciona la comuna</option>';
            if (region) {
                region.comunas.forEach((c) => {
                    const opt = document.createElement('option');
                    opt.value = c;
                    opt.textContent = c;
                    if (c === comunaSeleccionada) opt.selected = true;
                    selectComuna.appendChild(opt);
                });
            }
        }

        selectRegion.value = regionGuardada || '';
        llenarComunas(regionGuardada, comunaGuardada); // primera carga: preselecciona la comuna guardada

        selectRegion.onchange = () => llenarComunas(selectRegion.value, null); // cambios posteriores: sin preselección
    }

    // --- Cierre del modal "Ver": por botón X, o haciendo clic fuera de la tarjeta (en el fondo oscuro) ---
    modalVerCerrar.addEventListener('click', () => modalVerFondo.style.display = 'none');
    modalVerFondo.addEventListener('click', (e) => {
        if (e.target === modalVerFondo) modalVerFondo.style.display = 'none';
    });

    // --- Cierre del panel "Editar": mismo patrón (X, clic afuera, y botón "Cancelar") ---
    btnCerrarEditar.addEventListener('click', () => {
        panelEditar.style.display = 'none';
    });
    panelEditar.addEventListener('click', (e) => {
        if (e.target === panelEditar) panelEditar.style.display = 'none';
    });

    btnCancelarEditar.addEventListener('click', () => {
        panelEditar.style.display = 'none';
    });

    // Guardar cambios del formulario de edición
    formEditar.addEventListener('submit', (e) => {
        e.preventDefault();

        const correoOriginal = document.getElementById('editar-correo-original').value;
        const nuevoNombre = document.getElementById('editar-nombre').value.trim();
        const nuevosApellidos = document.getElementById('editar-apellidos').value.trim();
        const nuevoCorreo = document.getElementById('editar-correo').value.trim();
        const nuevoTelefono = document.getElementById('editar-telefono').value.trim();
        const nuevaRegion = document.getElementById('editar-region').value;
        const nuevaComuna = document.getElementById('editar-comuna').value;
        const nuevaDireccion = document.getElementById('editar-direccion').value.trim();
        const nuevaPassword = document.getElementById('editar-password').value;
        const nuevaPassword2 = document.getElementById('editar-password2').value;
        const nuevoRol = document.getElementById('editar-rol').value;
        const nuevoActivo = document.getElementById('editar-activo').checked;

        // La contraseña solo se valida si el admin escribió algo (campo vacío = "no cambiar")
        const errores = {
            'campo-editar-nombre': validarRequerido(nuevoNombre, 50, 'El nombre'),
            'campo-editar-correo': validarCorreo(nuevoCorreo),
            'campo-editar-password': nuevaPassword.length > 0 ? validarPassword(nuevaPassword) : null,
            'campo-editar-password2': nuevaPassword.length > 0 && nuevaPassword !== nuevaPassword2 ? 'Las contraseñas no coinciden.' : null,
        };

        Object.entries(errores).forEach(([id, msg]) => marcarCampo(id, msg));
        const hayErrores = Object.values(errores).some((e) => e !== null);
        if (hayErrores) return;

        const usuarios = obtenerUsuarios();

        // Verifica que el nuevo correo no choque con OTRO usuario (se excluye a sí mismo comparando con correoOriginal)
        const correoDuplicado = usuarios.some(
            (u) => u.correo.toLowerCase() === nuevoCorreo.toLowerCase() && u.correo.toLowerCase() !== correoOriginal.toLowerCase()
        );
        if (correoDuplicado) {
            marcarCampo('campo-editar-correo', 'Ese correo ya está en uso por otra cuenta.');
            return;
        }

        const indice = usuarios.findIndex((u) => u.correo === correoOriginal);
        if (indice !== -1) {
            usuarios[indice] = {
                ...usuarios[indice], // conserva campos no editados aquí (ej. run, fechaRegistro, avatar)
                nombre: nuevoNombre,
                apellidos: nuevosApellidos,
                correo: nuevoCorreo,
                telefono: nuevoTelefono,
                region: nuevaRegion,
                comuna: nuevaComuna,
                direccion: nuevaDireccion,
                rol: nuevoRol,
                activo: nuevoActivo,
                // si el admin no escribió contraseña nueva, se mantiene la que ya tenía el usuario
                password: nuevaPassword.length > 0 ? nuevaPassword : usuarios[indice].password,
            };
            guardarUsuarios(usuarios);

            // Si el admin se está editando a sí mismo, también hay que actualizar la sesión activa,
            // o quedaría desincronizada (ej. mostrando el nombre viejo en el sidebar)
            const sesionActual = obtenerSesion();
            if (sesionActual && sesionActual.correo.toLowerCase() === correoOriginal.toLowerCase()) {
                guardarSesion(usuarios[indice]);
            }
        }

        panelEditar.style.display = 'none';
        renderTablaUsuarios();
    });

    // El acceso rápido "Nuevo usuario" del HTML abre el panel de creación (en vez de navegar)
    accesoNuevo.addEventListener('click', (e) => {
        e.preventDefault();
        abrirPanelCrear();
    });

    // --- Cierre del panel "Crear": mismo patrón que "Editar" ---
    btnCerrarCrear.addEventListener('click', () => {
        panelCrear.style.display = 'none';
    });
    panelCrear.addEventListener('click', (e) => {
        if (e.target === panelCrear) panelCrear.style.display = 'none';
    });

    btnCancelarCrear.addEventListener('click', () => {
        panelCrear.style.display = 'none';
    });

    // Crear usuario nuevo desde el panel
    formCrear.addEventListener('submit', (e) => {
        e.preventDefault();

        const nuevoRun = document.getElementById('crear-run').value.trim();
        const nuevoCorreo = document.getElementById('crear-correo').value.trim();
        const nuevoNombre = document.getElementById('crear-nombre').value.trim();
        const nuevosApellidos = document.getElementById('crear-apellidos').value.trim();
        const nuevoTelefono = document.getElementById('crear-telefono').value.trim();
        const nuevaRegion = document.getElementById('crear-region').value;
        const nuevaComuna = document.getElementById('crear-comuna').value;
        const nuevaDireccion = document.getElementById('crear-direccion').value.trim();
        const nuevaPassword = document.getElementById('crear-password').value;
        const nuevaPassword2 = document.getElementById('crear-password2').value;
        const nuevoRol = document.getElementById('crear-rol').value;
        const nuevoActivo = document.getElementById('crear-activo').checked;

        // A diferencia de "editar", aquí RUN y contraseña son SIEMPRE obligatorios (usuario nuevo, sin valores previos)
        const errores = {
            'campo-crear-run': validarRun(nuevoRun),
            'campo-crear-correo': validarCorreo(nuevoCorreo),
            'campo-crear-nombre': validarRequerido(nuevoNombre, 50, 'El nombre'),
            'campo-crear-apellidos': validarRequerido(nuevosApellidos, 100, 'Los apellidos'),
            'campo-crear-password': validarPassword(nuevaPassword),
            'campo-crear-password2': nuevaPassword !== nuevaPassword2 ? 'Las contraseñas no coinciden.' : null,
        };

        Object.entries(errores).forEach(([id, msg]) => marcarCampo(id, msg));
        const hayErrores = Object.values(errores).some((e) => e !== null);
        if (hayErrores) return;

        const usuarios = obtenerUsuarios();

        const correoDuplicado = usuarios.some((u) => u.correo.toLowerCase() === nuevoCorreo.toLowerCase());
        if (correoDuplicado) {
            marcarCampo('campo-crear-correo', 'Ese correo ya está en uso por otra cuenta.');
            return;
        }

        // Normaliza el RUN quitando puntos/guion antes de comparar, así "19.011.022-K"
        // y "19011022K" se detectan como el mismo RUN aunque estén escritos distinto
        const runLimpio = nuevoRun.replace(/\./g, '').replace(/-/g, '').toUpperCase();
        const runDuplicado = usuarios.some(
            (u) => (u.run || '').replace(/\./g, '').replace(/-/g, '').toUpperCase() === runLimpio
        );
        if (runDuplicado) {
            marcarCampo('campo-crear-run', 'Ese RUN ya está en uso por otra cuenta.');
            return;
        }

        usuarios.push({
            run: nuevoRun,
            correo: nuevoCorreo,
            nombre: nuevoNombre,
            apellidos: nuevosApellidos,
            telefono: nuevoTelefono,
            region: nuevaRegion,
            comuna: nuevaComuna,
            direccion: nuevaDireccion,
            rol: nuevoRol,
            activo: nuevoActivo,
            password: nuevaPassword,
            fechaRegistro: new Date().toISOString(), // usado luego por el KPI "Nuevos esta semana" del dashboard
        });
        guardarUsuarios(usuarios);

        panelCrear.style.display = 'none';
        renderTablaUsuarios();
    });
}

/**
 * Pide confirmación antes de eliminar un usuario. Bloquea la auto-eliminación
 * (un admin no puede borrar su propia cuenta mientras tiene sesión activa),
 * ya que eso dejaría al admin con una sesión "fantasma" apuntando a un usuario inexistente.
 */
function eliminarUsuarioConConfirmacion(usuario, sesion) {
    if (sesion && usuario.correo.toLowerCase() === sesion.correo.toLowerCase()) {
        alert('No puedes eliminar tu propia cuenta mientras tienes la sesión activa.');
        return;
    }

    const confirmado = confirm(`¿Eliminar la cuenta de ${usuario.nombre} ${usuario.apellidos}? Esta acción no se puede deshacer.`);
    if (!confirmado) return;

    const usuarios = obtenerUsuarios().filter((u) => u.correo !== usuario.correo);
    guardarUsuarios(usuarios);
    renderTablaUsuarios();
}

// Punto de entrada: se llaman las 3 funciones de inicialización en cada carga de página.
// Cada una revisa internamente (con los "if (!elemento) return") si sus elementos existen
// en el DOM actual, así que es seguro incluir admin.js en dashboard.html, usuarios.html
// y reportes.html sin que una función "pise" a la otra.
document.addEventListener('DOMContentLoaded', () => {
    initDashboardAdmin();
    initPaginaUsuarios();
    initBotonCerrarSesionAdmin();
});