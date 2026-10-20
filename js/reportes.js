/* =========================================================
   PATITAS FELICES — reportes.js
   Estadísticas de usuarios para admin/reportes.html.
   Depende de usuarios.js (obtenerUsuarios, REGIONES) y de
   admin.js (protegerRutaAdmin, exportarUsuariosComoExcel).
========================================================= */

/**
 * Punto de entrada de reportes.html: protege la ruta, obtiene todos los
 * datos necesarios (usuarios, mascotas, solicitudes, citas) y dispara
 * el render de los 3 bloques de reporte (usuarios, mascotas, citas).
 */
function initReportes() {
    const sesion = protegerRutaAdmin();
    if (!sesion) return;

    const usuarios = obtenerUsuarios();

    // ---- Reporte de usuarios ----
    renderKpisReporte(usuarios);
    renderGraficoRoles(usuarios);
    renderGraficoRegiones(usuarios);
    renderTablaComunas(usuarios);
    initExportarReporte(usuarios);

    // Mascotas y citas no tienen una función helper propia en usuarios.js,
    // así que se leen directamente desde sus claves de localStorage
    const mascotas = leerLocalStorage('patitasFelices_mascotas');
    const solicitudesMascotas = leerLocalStorage('patitasFelices_solicitudesMascotas');
    const citas = leerLocalStorage('patitasFelices_citas');

    // ---- Reporte de mascotas ----
    renderKpisMascotas(mascotas, solicitudesMascotas);
    renderGraficoMascotasEspecie(mascotas);
    renderGraficoMascotasEstado(mascotas);

    // ---- Reporte de citas ----
    renderKpisCitas(citas);
    renderGraficoCitasEstado(citas);
    renderGraficoCitasServicio(citas);
}

/**
 * Helper genérico para leer y parsear cualquier clave de localStorage
 * que guarde un array JSON. Si la clave no existe o el JSON está corrupto,
 * devuelve un array vacío en vez de romper el resto del reporte.
 */
function leerLocalStorage(clave) {
    try {
        return JSON.parse(localStorage.getItem(clave)) || [];
    } catch {
        return [];
    }
}

/* ================= KPIs Y GRÁFICOS — USUARIOS ================= */

/**
 * Llena los 4 KPIs generales del reporte de usuarios.
 */
function renderKpisReporte(usuarios) {
    const totalUsuarios = document.getElementById('rep-total-usuarios');
    if (totalUsuarios) totalUsuarios.textContent = usuarios.length;

    const totalAdmins = document.getElementById('rep-total-admins');
    if (totalAdmins) {
        totalAdmins.textContent = usuarios.filter((u) => u.rol === 'admin').length;
    }

    const totalRegiones = document.getElementById('rep-total-regiones');
    if (totalRegiones) {
        // Set elimina duplicados: cuenta regiones DISTINTAS que tengan al menos un usuario
        const regionesUnicas = new Set(usuarios.filter((u) => u.region).map((u) => u.region));
        totalRegiones.textContent = regionesUnicas.size;
    }

    const conAvatar = document.getElementById('rep-con-avatar');
    if (conAvatar) {
        conAvatar.textContent = usuarios.filter((u) => u.avatar).length;
    }
}

/**
 * Gráfico de dona: proporción de clientes vs administradores.
 * Se corta temprano si el canvas no existe o Chart.js no cargó (CDN caído, por ejemplo).
 */
function renderGraficoRoles(usuarios) {
    const canvas = document.getElementById('grafico-roles');
    if (!canvas || typeof Chart === 'undefined') return;

    const cantClientes = usuarios.filter((u) => (u.rol || 'cliente') === 'cliente').length;
    const cantAdmins = usuarios.filter((u) => u.rol === 'admin').length;

    new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: ['Clientes', 'Administradores'],
            datasets: [{
                data: [cantClientes, cantAdmins],
                backgroundColor: ['#D6ECFA', '#FFD6E7'], // celeste = clientes, rosa = admins
                borderColor: '#2A2440', // mismo color de fondo de las tarjetas admin, para que el borde "se funda"
                borderWidth: 3,
            }],
        },
        options: {
            plugins: {
                // Colores de texto claros porque el gráfico vive sobre el tema oscuro del panel admin
                legend: {
                    labels: { color: 'rgba(255,255,255,0.75)', font: { size: 12.5 } },
                },
            },
        },
    });
}

/**
 * Gráfico de barras horizontales: cantidad de usuarios por región,
 * ordenado de mayor a menor.
 */
function renderGraficoRegiones(usuarios) {
    const canvas = document.getElementById('grafico-regiones');
    if (!canvas || typeof Chart === 'undefined') return;

    const conteoPorRegion = {};
    usuarios.forEach((u) => {
        const region = u.region || 'Sin región';
        conteoPorRegion[region] = (conteoPorRegion[region] || 0) + 1;
    });

    // Ordena de mayor a menor cantidad antes de graficar
    const entradas = Object.entries(conteoPorRegion).sort((a, b) => b[1] - a[1]);
    // Trunca nombres de región muy largos para que no rompan el layout del eje Y
    const etiquetas = entradas.map(([region]) => region.length > 22 ? region.slice(0, 22) + '…' : region);
    const valores = entradas.map(([, cantidad]) => cantidad);

    new Chart(canvas, {
        type: 'bar',
        data: {
            labels: etiquetas,
            datasets: [{
                label: 'Usuarios',
                data: valores,
                backgroundColor: '#E6D6F7',
                borderRadius: 8,
            }],
        },
        options: {
            indexAxis: 'y', // convierte el bar chart vertical en horizontal (mejor para nombres largos)
            plugins: {
                legend: { display: false }, // una sola serie: la leyenda no aporta nada
            },
            scales: {
                x: {
                    ticks: { color: 'rgba(255,255,255,0.6)', precision: 0 }, // precision: 0 evita decimales en el eje de cantidades
                    grid: { color: 'rgba(255,255,255,0.06)' },
                },
                y: {
                    ticks: { color: 'rgba(255,255,255,0.75)', font: { size: 12 } },
                    grid: { display: false }, // sin líneas de grilla horizontales, para no saturar visualmente
                },
            },
        },
    });
}

/**
 * Tabla con el top 10 de comunas con más usuarios registrados.
 * Agrupa por comuna+región (con "||" como separador) para no mezclar
 * comunas con el mismo nombre que pertenezcan a regiones distintas.
 */
function renderTablaComunas(usuarios) {
    const tbody = document.getElementById('rep-tabla-comunas');
    const vacia = document.getElementById('rep-comunas-vacia');
    if (!tbody) return;

    const conteo = {};
    usuarios.forEach((u) => {
        if (!u.comuna) return; // usuarios sin comuna registrada no entran en el ranking
        const clave = `${u.comuna}||${u.region || 'Sin región'}`;
        conteo[clave] = (conteo[clave] || 0) + 1;
    });

    const filas = Object.entries(conteo)
        .map(([clave, cantidad]) => {
            const [comuna, region] = clave.split('||'); // deshace la clave compuesta para volver a tener comuna/región separadas
            return { comuna, region, cantidad };
        })
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 10); // solo el top 10, para no saturar la tabla

    if (filas.length === 0) {
        tbody.innerHTML = '';
        if (vacia) vacia.style.display = 'block';
        return;
    }

    if (vacia) vacia.style.display = 'none';

    tbody.innerHTML = filas.map((f) => `
        <tr>
            <td>${f.comuna}</td>
            <td>${f.region}</td>
            <td>${f.cantidad}</td>
        </tr>
    `).join('');
}

/* =========================================================
   REPORTE DE MASCOTAS
========================================================= */

/**
 * Llena los 4 KPIs del bloque "Reporte de mascotas".
 * Depende de que cada mascota tenga los campos m.completo (boolean)
 * y m.estado ('al-dia' | 'tratamiento' | 'pendiente'), definidos
 * por el módulo de mascotas del compañero de equipo.
 */
function renderKpisMascotas(mascotas, solicitudesMascotas) {
    const total = document.getElementById('rep-total-mascotas');
    if (total) total.textContent = mascotas.length;

    const incompletas = document.getElementById('rep-mascotas-incompletas');
    if (incompletas) incompletas.textContent = mascotas.filter((m) => !m.completo).length;

    const pendientesSolicitudes = document.getElementById('rep-solicitudes-pendientes');
    if (pendientesSolicitudes) {
        pendientesSolicitudes.textContent = solicitudesMascotas.filter((s) => s.estado === 'pendiente').length;
    }

    const enTratamiento = document.getElementById('rep-mascotas-tratamiento');
    if (enTratamiento) enTratamiento.textContent = mascotas.filter((m) => m.estado === 'tratamiento').length;
}

/**
 * Gráfico de dona: distribución de mascotas por especie.
 * Se corta si no hay mascotas (return temprano), a diferencia de los
 * gráficos de usuarios que se dibujan igual con datos en 0.
 */
function renderGraficoMascotasEspecie(mascotas) {
    const canvas = document.getElementById('grafico-mascotas-especie');
    if (!canvas || typeof Chart === 'undefined') return;

    if (mascotas.length === 0) return;

    const conteoPorEspecie = {};
    mascotas.forEach((m) => {
        const especie = m.especie || 'Sin especificar';
        conteoPorEspecie[especie] = (conteoPorEspecie[especie] || 0) + 1;
    });

    const entradas = Object.entries(conteoPorEspecie).sort((a, b) => b[1] - a[1]);

    new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: entradas.map(([especie]) => especie),
            datasets: [{
                data: entradas.map(([, cantidad]) => cantidad),
                // Paleta de 6 colores fijos: si hay más de 6 especies distintas, Chart.js
                // reutiliza los colores desde el principio (podrían repetirse)
                backgroundColor: ['#D6ECFA', '#FFD6E7', '#E6D6F7', '#FFD6A5', '#C8F0D8', '#F7E6A1'],
                borderColor: '#2A2440',
                borderWidth: 3,
            }],
        },
        options: {
            plugins: {
                legend: {
                    labels: { color: 'rgba(255,255,255,0.75)', font: { size: 12.5 } },
                },
            },
        },
    });
}

/**
 * Gráfico de barras: mascotas agrupadas en 3 estados clínicos fijos.
 * A diferencia de renderKpisMascotas, aquí "pendientes" usa el estado
 * por defecto ('pendiente') cuando m.estado no está definido.
 */
function renderGraficoMascotasEstado(mascotas) {
    const canvas = document.getElementById('grafico-mascotas-estado');
    if (!canvas || typeof Chart === 'undefined') return;

    if (mascotas.length === 0) return;

    const alDia = mascotas.filter((m) => m.estado === 'al-dia').length;
    const tratamiento = mascotas.filter((m) => m.estado === 'tratamiento').length;
    const pendientes = mascotas.filter((m) => (m.estado || 'pendiente') === 'pendiente').length;

    new Chart(canvas, {
        type: 'bar',
        data: {
            labels: ['Control al día', 'En tratamiento', 'Vacunas pendientes'],
            datasets: [{
                label: 'Mascotas',
                data: [alDia, tratamiento, pendientes],
                backgroundColor: ['#C8F0D8', '#E6D6F7', '#FFD6A5'], // verde / morado / naranja, un color fijo por barra
                borderRadius: 8,
            }],
        },
        options: {
            plugins: {
                legend: { display: false },
            },
            scales: {
                x: {
                    ticks: { color: 'rgba(255,255,255,0.6)', precision: 0 },
                    grid: { color: 'rgba(255,255,255,0.06)' },
                },
                y: {
                    ticks: { color: 'rgba(255,255,255,0.75)', font: { size: 12 } },
                    grid: { display: false },
                },
            },
        },
    });
}


/* =========================================================
   REPORTE DE CITAS
========================================================= */

/**
 * Normaliza el campo estado de una cita a minúsculas, con "pendiente"
 * como valor por defecto si la cita no trae estado definido.
 * Centraliza esta lógica para no repetirla en cada función de citas.
 */
function estadoCitaNormalizado(cita) {
    return (cita.estado || 'pendiente').toLowerCase();
}

/**
 * Llena los 4 KPIs del bloque "Reporte de citas".
 * Usa startsWith() en vez de comparación exacta para "confirmada"/"cancelada",
 * así cubre variantes como "confirmado" o "cancelada por el cliente" sin
 * necesitar una lista exhaustiva de todos los estados posibles.
 */
function renderKpisCitas(citas) {
    const total = document.getElementById('rep-total-citas');
    if (total) total.textContent = citas.length;

    const pendientes = document.getElementById('rep-citas-pendientes');
    if (pendientes) pendientes.textContent = citas.filter((c) => estadoCitaNormalizado(c) === 'pendiente').length;

    const confirmadas = document.getElementById('rep-citas-confirmadas');
    if (confirmadas) confirmadas.textContent = citas.filter((c) => estadoCitaNormalizado(c).startsWith('confirmad')).length;

    const canceladas = document.getElementById('rep-citas-canceladas');
    if (canceladas) canceladas.textContent = citas.filter((c) => estadoCitaNormalizado(c).startsWith('cancelad')).length;
}

/**
 * Gráfico de dona: distribución de citas por estado (mismo cálculo
 * que renderKpisCitas, pero recalculado aquí en vez de reutilizar valores).
 */
function renderGraficoCitasEstado(citas) {
    const canvas = document.getElementById('grafico-citas-estado');
    if (!canvas || typeof Chart === 'undefined') return;

    if (citas.length === 0) return;

    const pendientes = citas.filter((c) => estadoCitaNormalizado(c) === 'pendiente').length;
    const confirmadas = citas.filter((c) => estadoCitaNormalizado(c).startsWith('confirmad')).length;
    const canceladas = citas.filter((c) => estadoCitaNormalizado(c).startsWith('cancelad')).length;

    new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: ['Pendientes', 'Confirmadas', 'Canceladas'],
            datasets: [{
                data: [pendientes, confirmadas, canceladas],
                backgroundColor: ['#FFD6A5', '#C8F0D8', '#F0A0A0'], // naranja / verde / rojo, siguiendo la semántica de cada estado
                borderColor: '#2A2440',
                borderWidth: 3,
            }],
        },
        options: {
            plugins: {
                legend: {
                    labels: { color: 'rgba(255,255,255,0.75)', font: { size: 12.5 } },
                },
            },
        },
    });
}

/**
 * Gráfico de barras horizontales: top 6 servicios/tipos de atención
 * más solicitados en las citas.
 */
function renderGraficoCitasServicio(citas) {
    const canvas = document.getElementById('grafico-citas-servicio');
    if (!canvas || typeof Chart === 'undefined') return;

    if (citas.length === 0) return;

    const conteoPorServicio = {};
    citas.forEach((c) => {
        const servicio = c.servicio || 'Sin especificar';
        conteoPorServicio[servicio] = (conteoPorServicio[servicio] || 0) + 1;
    });

    // Solo se grafican los 6 servicios más pedidos, para que el gráfico no quede sobrecargado
    const entradas = Object.entries(conteoPorServicio).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const etiquetas = entradas.map(([servicio]) => servicio.length > 24 ? servicio.slice(0, 24) + '…' : servicio);

    new Chart(canvas, {
        type: 'bar',
        data: {
            labels: etiquetas,
            datasets: [{
                label: 'Citas',
                data: entradas.map(([, cantidad]) => cantidad),
                backgroundColor: '#D6ECFA',
                borderRadius: 8,
            }],
        },
        options: {
            indexAxis: 'y',
            plugins: {
                legend: { display: false },
            },
            scales: {
                x: {
                    ticks: { color: 'rgba(255,255,255,0.6)', precision: 0 },
                    grid: { color: 'rgba(255,255,255,0.06)' },
                },
                y: {
                    ticks: { color: 'rgba(255,255,255,0.75)', font: { size: 12 } },
                    grid: { display: false },
                },
            },
        },
    });
}

/**
 * Conecta el botón "Exportar reporte completo (Excel)".
 * Reutiliza exportarUsuariosComoExcel() de admin.js.
 */
function initExportarReporte(usuarios) {
    const btn = document.getElementById('btn-exportar-reporte');
    if (!btn || typeof XLSX === 'undefined') return;

    btn.addEventListener('click', () => {
        exportarUsuariosComoExcel(usuarios, 'reporte-usuarios-patitas-felices');
    });
}

// Se agregan las dos inicializaciones necesarias en reportes.html:
// initReportes() arma todo el contenido de la página, e
// initBotonCerrarSesionAdmin() (definida en admin.js) conecta el botón del sidebar
document.addEventListener('DOMContentLoaded', () => {
    initReportes();
    initBotonCerrarSesionAdmin();
});