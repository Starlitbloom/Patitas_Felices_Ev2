/* =========================================================
   PATITAS FELICES — admin-citas.js
   Gestión administrativa de citas.
========================================================= */

const CLAVE_CITAS_ADMIN = 'patitasFelices_citas';

let filtroTextoCitas = '';
let filtroEstadoCitas = '';
let filtroFechaCitas = '';
let ordenCitas = 'proximas';

let citaSeleccionadaId = null;
let accionPendienteCita = null;


/* =========================================================
   UTILIDADES DE DATOS
========================================================= */

function obtenerCitasAdmin() {
    try {
        const citas = JSON.parse(
            localStorage.getItem(CLAVE_CITAS_ADMIN)
        );

        return Array.isArray(citas) ? citas : [];

    } catch (error) {
        return [];
    }
}


function guardarCitasAdmin(citas) {
    localStorage.setItem(
        CLAVE_CITAS_ADMIN,
        JSON.stringify(citas)
    );
}


function normalizarEstadoCita(estado) {

    const valor = String(
        estado || 'Pendiente'
    ).trim().toLowerCase();

    if (
        valor === 'confirmada' ||
        valor === 'confirmado'
    ) {
        return 'confirmada';
    }

    if (
        valor === 'cancelada' ||
        valor === 'cancelado'
    ) {
        return 'cancelada';
    }

    return 'pendiente';
}


function etiquetaEstadoCita(estado) {

    const estadoNormalizado =
        normalizarEstadoCita(estado);

    if (estadoNormalizado === 'confirmada') {
        return 'Confirmada';
    }

    if (estadoNormalizado === 'cancelada') {
        return 'Cancelada';
    }

    return 'Pendiente';
}


function claseEstadoCita(estado) {

    return `admin-cita-badge--${normalizarEstadoCita(estado)}`;
}


function obtenerIdCita(cita, indice) {

    if (
        cita.id !== undefined &&
        cita.id !== null
    ) {
        return String(cita.id);
    }

    return `legacy-${indice}`;
}


/* =========================================================
   SEGURIDAD PARA MOSTRAR TEXTO
========================================================= */

function escaparHTML(valor) {

    return String(valor ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}


/* =========================================================
   OBTENER DATOS DE LA CITA
========================================================= */

function obtenerNombreCliente(cita) {

    return (
        cita.dueno ||
        cita.propietario ||
        cita.nombreUsuario ||
        cita.nombre ||
        'Cliente'
    );
}


function obtenerCorreoCliente(cita) {

    return (
        cita.correo ||
        cita.correoUsuario ||
        'Sin correo'
    );
}


function obtenerMascota(cita) {

    return (
        cita.mascota ||
        cita.nombreMascota ||
        'Sin nombre'
    );
}


function obtenerTipoMascota(cita) {

    return (
        cita.tipoMascota ||
        cita.tipo ||
        'Mascota'
    );
}


function obtenerServicio(cita) {

    return (
        cita.servicio ||
        cita.tipoServicio ||
        'Consulta veterinaria'
    );
}


/* =========================================================
   FORMATEAR FECHA
========================================================= */

function formatearFechaCita(fecha) {

    if (!fecha) {
        return 'Sin fecha';
    }

    const partes = String(fecha).split('-');

    if (partes.length !== 3) {
        return fecha;
    }

    const [anio, mes, dia] = partes;

    const fechaLocal = new Date(
        Number(anio),
        Number(mes) - 1,
        Number(dia)
    );

    if (Number.isNaN(fechaLocal.getTime())) {
        return fecha;
    }

    return new Intl.DateTimeFormat(
        'es-CL',
        {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }
    ).format(fechaLocal);
}


function fechaHoraComparable(cita) {

    if (!cita.fecha) {
        return Number.MAX_SAFE_INTEGER;
    }

    const hora = cita.hora || '23:59';

    const fecha = new Date(
        `${cita.fecha}T${hora}`
    );

    return Number.isNaN(fecha.getTime())
        ? Number.MAX_SAFE_INTEGER
        : fecha.getTime();
}


/* =========================================================
   FILTRADO Y ORDEN
========================================================= */

function obtenerCitasFiltradas() {

    let citas = obtenerCitasAdmin().map(
        (cita, indice) => ({
            ...cita,

            __idAdmin:
                obtenerIdCita(cita, indice),

            __indiceOriginal:
                indice
        })
    );


    /* ================= BUSCADOR ================= */

    if (filtroTextoCitas) {

        citas = citas.filter((cita) => {

            const texto = [

                obtenerNombreCliente(cita),

                obtenerCorreoCliente(cita),

                cita.telefono || '',

                obtenerMascota(cita),

                obtenerTipoMascota(cita),

                obtenerServicio(cita),

                cita.motivo || ''

            ].join(' ').toLowerCase();


            return texto.includes(
                filtroTextoCitas
            );

        });
    }


    /* ================= ESTADO ================= */

    if (filtroEstadoCitas) {

        citas = citas.filter(
            (cita) =>
                normalizarEstadoCita(
                    cita.estado
                ) === filtroEstadoCitas
        );
    }


    /* ================= FECHA ================= */

    if (filtroFechaCitas) {

        citas = citas.filter(
            (cita) =>
                String(cita.fecha || '') ===
                filtroFechaCitas
        );
    }


    /* ================= ORDEN ================= */

    if (ordenCitas === 'recientes') {

        citas.sort((a, b) => {

            const fechaA =
                a.fechaRegistro
                    ? new Date(
                        a.fechaRegistro
                    ).getTime()
                    : fechaHoraComparable(a);


            const fechaB =
                b.fechaRegistro
                    ? new Date(
                        b.fechaRegistro
                    ).getTime()
                    : fechaHoraComparable(b);


            return fechaB - fechaA;
        });

    } else if (ordenCitas === 'antiguas') {

        citas.sort(
            (a, b) =>
                fechaHoraComparable(a) -
                fechaHoraComparable(b)
        );

    } else {

        citas.sort(
            (a, b) =>
                fechaHoraComparable(a) -
                fechaHoraComparable(b)
        );
    }


    return citas;
}


/* =========================================================
   KPIs
========================================================= */

function renderKpisCitas() {

    const citas = obtenerCitasAdmin();

    const total = citas.length;


    const pendientes = citas.filter(
        (cita) =>
            normalizarEstadoCita(
                cita.estado
            ) === 'pendiente'
    ).length;


    const confirmadas = citas.filter(
        (cita) =>
            normalizarEstadoCita(
                cita.estado
            ) === 'confirmada'
    ).length;


    const canceladas = citas.filter(
        (cita) =>
            normalizarEstadoCita(
                cita.estado
            ) === 'cancelada'
    ).length;


    const kpiTotal =
        document.getElementById(
            'citas-kpi-total'
        );


    const kpiPendientes =
        document.getElementById(
            'citas-kpi-pendientes'
        );


    const kpiConfirmadas =
        document.getElementById(
            'citas-kpi-confirmadas'
        );


    const kpiCanceladas =
        document.getElementById(
            'citas-kpi-canceladas'
        );


    if (kpiTotal) {
        kpiTotal.textContent = total;
    }


    if (kpiPendientes) {
        kpiPendientes.textContent =
            pendientes;
    }


    if (kpiConfirmadas) {
        kpiConfirmadas.textContent =
            confirmadas;
    }


    if (kpiCanceladas) {
        kpiCanceladas.textContent =
            canceladas;
    }
}


/* =========================================================
   TABLA DE CITAS
========================================================= */

function renderTablaCitas() {

    const tbody =
        document.getElementById(
            'admin-citas-tabla-body'
        );


    const estadoVacio =
        document.getElementById(
            'admin-citas-vacio'
        );


    const textoVacio =
        document.getElementById(
            'admin-citas-vacio-texto'
        );


    const contador =
        document.getElementById(
            'citas-contador-resultados'
        );


    if (!tbody) {
        return;
    }


    const citas =
        obtenerCitasFiltradas();


    /* ================= CONTADOR ================= */

    if (contador) {

        contador.textContent =
            `${citas.length} ${
                citas.length === 1
                    ? 'cita'
                    : 'citas'
            }`;
    }


    /* ================= SIN RESULTADOS ================= */

    if (citas.length === 0) {

        tbody.innerHTML = '';


        if (estadoVacio) {
            estadoVacio.hidden = false;
        }


        if (textoVacio) {

            const hayFiltros =
                filtroTextoCitas ||
                filtroEstadoCitas ||
                filtroFechaCitas;


            textoVacio.textContent =
                hayFiltros

                    ? 'No hay solicitudes que coincidan con los filtros seleccionados.'

                    : 'Aún no hay solicitudes de citas registradas.';
        }


        return;
    }


    if (estadoVacio) {
        estadoVacio.hidden = true;
    }


    /* ================= CREAR FILAS ================= */

    tbody.innerHTML = citas.map(
        (cita) => {

            const estado =
                normalizarEstadoCita(
                    cita.estado
                );


            const pendiente =
                estado === 'pendiente';


            return `

                <tr>

                    <td>

                        <div class="admin-citas-cliente">

                            <strong>
                                ${escaparHTML(
                                    obtenerNombreCliente(
                                        cita
                                    )
                                )}
                            </strong>

                            <span>
                                ${escaparHTML(
                                    obtenerCorreoCliente(
                                        cita
                                    )
                                )}
                            </span>

                        </div>

                    </td>


                    <td>

                        <div class="admin-citas-mascota">

                            <strong>
                                ${escaparHTML(
                                    obtenerMascota(
                                        cita
                                    )
                                )}
                            </strong>

                            <span>
                                ${escaparHTML(
                                    obtenerTipoMascota(
                                        cita
                                    )
                                )}
                            </span>

                        </div>

                    </td>


                    <td class="admin-citas-servicio">

                        ${escaparHTML(
                            obtenerServicio(cita)
                        )}

                    </td>


                    <td class="admin-citas-fecha">

                        ${escaparHTML(
                            formatearFechaCita(
                                cita.fecha
                            )
                        )}

                    </td>


                    <td class="admin-citas-hora">

                        ${escaparHTML(
                            cita.hora || '—'
                        )}

                    </td>


                    <td>

                        <span
                            class="admin-cita-badge ${claseEstadoCita(
                                cita.estado
                            )}"
                        >

                            ${etiquetaEstadoCita(
                                cita.estado
                            )}

                        </span>

                    </td>


                    <td>

                        <div class="admin-citas-acciones">


                            <button
                                type="button"
                                class="
                                    admin-citas-btn
                                    admin-citas-btn--ver
                                "
                                data-cita-id="${escaparHTML(
                                    cita.__idAdmin
                                )}"
                                data-accion="ver"
                            >
                                Ver
                            </button>


                            <button
                                type="button"
                                class="
                                    admin-citas-btn
                                    admin-citas-btn--confirmar
                                "
                                data-cita-id="${escaparHTML(
                                    cita.__idAdmin
                                )}"
                                data-accion="confirmar"

                                ${
                                    pendiente
                                        ? ''
                                        : 'disabled'
                                }
                            >
                                Confirmar
                            </button>


                            <button
                                type="button"
                                class="
                                    admin-citas-btn
                                    admin-citas-btn--cancelar
                                "
                                data-cita-id="${escaparHTML(
                                    cita.__idAdmin
                                )}"
                                data-accion="cancelar"

                                ${
                                    pendiente
                                        ? ''
                                        : 'disabled'
                                }
                            >
                                Cancelar
                            </button>


                        </div>

                    </td>

                </tr>

            `;
        }
    ).join('');
}


/* =========================================================
   BUSCAR CITA POR ID
========================================================= */

function buscarCitaPorId(id) {

    const citas =
        obtenerCitasAdmin();


    const indice = citas.findIndex(
        (cita, posicion) =>

            obtenerIdCita(
                cita,
                posicion
            ) === String(id)
    );


    if (indice === -1) {
        return null;
    }


    return {

        cita: citas[indice],

        indice,

        id: obtenerIdCita(
            citas[indice],
            indice
        )
    };
}


/* =========================================================
   MODAL DETALLE DE CITA
========================================================= */

function abrirDetalleCita(id) {

    const resultado =
        buscarCitaPorId(id);


    if (!resultado) {
        return;
    }


    const { cita } = resultado;


    citaSeleccionadaId = id;


    const fondo =
        document.getElementById(
            'modal-cita-fondo'
        );


    const contenido =
        document.getElementById(
            'modal-cita-contenido'
        );


    const badge =
        document.getElementById(
            'modal-cita-estado'
        );


    const acciones =
        document.getElementById(
            'modal-cita-acciones'
        );


    if (
        !fondo ||
        !contenido ||
        !badge ||
        !acciones
    ) {
        return;
    }


    /* ================= ESTADO ================= */

    badge.textContent =
        etiquetaEstadoCita(
            cita.estado
        );


    badge.className =
        `admin-cita-badge ${
            claseEstadoCita(
                cita.estado
            )
        }`;


    /* ================= INFORMACIÓN ================= */

    contenido.innerHTML = `

        <div class="admin-citas-detalle-bloque">

            <span>Cliente</span>

            <strong>
                ${escaparHTML(
                    obtenerNombreCliente(cita)
                )}
            </strong>

        </div>


        <div class="admin-citas-detalle-bloque">

            <span>Correo</span>

            <strong>
                ${escaparHTML(
                    obtenerCorreoCliente(cita)
                )}
            </strong>

        </div>


        <div class="admin-citas-detalle-bloque">

            <span>Teléfono</span>

            <strong>
                ${escaparHTML(
                    cita.telefono ||
                    'No registrado'
                )}
            </strong>

        </div>


        <div class="admin-citas-detalle-bloque">

            <span>Mascota</span>

            <strong>
                ${escaparHTML(
                    obtenerMascota(cita)
                )}
            </strong>

        </div>


        <div class="admin-citas-detalle-bloque">

            <span>Tipo de mascota</span>

            <strong>
                ${escaparHTML(
                    obtenerTipoMascota(cita)
                )}
            </strong>

        </div>


        <div class="admin-citas-detalle-bloque">

            <span>Edad</span>

            <strong>

                ${escaparHTML(

                    cita.edadMascota !== undefined &&
                    cita.edadMascota !== null &&
                    cita.edadMascota !== ''

                        ? `${cita.edadMascota} años`

                        : 'No registrada'
                )}

            </strong>

        </div>


        <div class="admin-citas-detalle-bloque">

            <span>Servicio</span>

            <strong>
                ${escaparHTML(
                    obtenerServicio(cita)
                )}
            </strong>

        </div>


        <div class="admin-citas-detalle-bloque">

            <span>Fecha y hora</span>

            <strong>

                ${escaparHTML(
                    formatearFechaCita(
                        cita.fecha
                    )
                )}

                ·

                ${escaparHTML(
                    cita.hora || '—'
                )}

            </strong>

        </div>


        <div
            class="
                admin-citas-detalle-bloque
                admin-citas-detalle-bloque--ancho
            "
        >

            <span>
                Motivo de consulta
            </span>

            <p>
                ${escaparHTML(
                    cita.motivo ||
                    'Sin motivo registrado.'
                )}
            </p>

        </div>

    `;


    /* ================= BOTONES ================= */

    if (
        normalizarEstadoCita(
            cita.estado
        ) === 'pendiente'
    ) {

        acciones.innerHTML = `

            <button
                type="button"
                class="
                    admin-citas-btn
                    admin-citas-btn--cancelar
                "
                data-modal-accion="cancelar"
            >
                ✕ Cancelar cita
            </button>


            <button
                type="button"
                class="
                    admin-citas-btn
                    admin-citas-btn--confirmar
                "
                data-modal-accion="confirmar"
            >
                ✓ Confirmar cita
            </button>

        `;

    } else {

        acciones.innerHTML = `

            <span
                class="
                    admin-cita-badge
                    ${claseEstadoCita(
                        cita.estado
                    )}
                "
            >

                Esta cita se encuentra
                ${etiquetaEstadoCita(
                    cita.estado
                ).toLowerCase()}.

            </span>

        `;
    }


    fondo.hidden = false;

    document.body.style.overflow =
        'hidden';
}


/* =========================================================
   CERRAR DETALLE
========================================================= */

function cerrarDetalleCita() {

    const fondo =
        document.getElementById(
            'modal-cita-fondo'
        );


    if (fondo) {
        fondo.hidden = true;
    }


    citaSeleccionadaId = null;


    const confirmacion =
        document.getElementById(
            'modal-confirmacion-fondo'
        );


    if (
        !confirmacion ||
        confirmacion.hidden
    ) {
        document.body.style.overflow = '';
    }
}


/* =========================================================
   MODAL CONFIRMACIÓN
========================================================= */

function abrirConfirmacionCita(
    id,
    accion
) {

    const resultado =
        buscarCitaPorId(id);


    if (!resultado) {
        return;
    }


    citaSeleccionadaId = id;

    accionPendienteCita = accion;


    const fondo =
        document.getElementById(
            'modal-confirmacion-fondo'
        );


    const titulo =
        document.getElementById(
            'modal-confirmacion-titulo'
        );


    const texto =
        document.getElementById(
            'modal-confirmacion-texto'
        );


    const icono =
        document.getElementById(
            'modal-confirmacion-icono'
        );


    const aceptar =
        document.getElementById(
            'modal-confirmacion-aceptar'
        );


    if (
        !fondo ||
        !titulo ||
        !texto ||
        !icono ||
        !aceptar
    ) {
        return;
    }


    const nombreMascota =
        obtenerMascota(
            resultado.cita
        );


    /* ================= CANCELAR ================= */

    if (accion === 'cancelar') {

        icono.textContent = '✕';

        titulo.textContent =
            'Cancelar cita';


        texto.textContent =
            `¿Deseas cancelar la cita de ${nombreMascota}? ` +
            'El cliente verá el nuevo estado en Mis citas.';


        aceptar.textContent =
            'Sí, cancelar';


        aceptar.classList.add(
            'admin-citas-btn-confirmar--cancelar'
        );


    /* ================= CONFIRMAR ================= */

    } else {

        icono.textContent = '✓';

        titulo.textContent =
            'Confirmar cita';


        texto.textContent =
            `¿Deseas confirmar la cita de ${nombreMascota}? ` +
            'El cliente verá el nuevo estado en Mis citas.';


        aceptar.textContent =
            'Sí, confirmar';


        aceptar.classList.remove(
            'admin-citas-btn-confirmar--cancelar'
        );
    }


    fondo.hidden = false;

    document.body.style.overflow =
        'hidden';
}


/* =========================================================
   CERRAR CONFIRMACIÓN
========================================================= */

function cerrarConfirmacionCita() {

    const fondo =
        document.getElementById(
            'modal-confirmacion-fondo'
        );


    if (fondo) {
        fondo.hidden = true;
    }


    accionPendienteCita = null;


    const modalDetalle =
        document.getElementById(
            'modal-cita-fondo'
        );


    if (
        !modalDetalle ||
        modalDetalle.hidden
    ) {
        document.body.style.overflow = '';
    }
}


/* =========================================================
   CAMBIAR ESTADO DE CITA
========================================================= */

function ejecutarCambioEstadoCita() {

    if (
        !citaSeleccionadaId ||
        !accionPendienteCita
    ) {
        return;
    }


    const citas =
        obtenerCitasAdmin();


    const indice = citas.findIndex(
        (cita, posicion) =>

            obtenerIdCita(
                cita,
                posicion
            ) === String(
                citaSeleccionadaId
            )
    );


    if (indice === -1) {

        cerrarConfirmacionCita();

        return;
    }


    const estadoActual =
        normalizarEstadoCita(
            citas[indice].estado
        );


    /*
        Solo las citas pendientes pueden
        ser confirmadas o canceladas.
    */

    if (estadoActual !== 'pendiente') {

        cerrarConfirmacionCita();

        renderPaginaCitas();

        return;
    }


    /* ================= ACTUALIZAR ================= */

    citas[indice] = {

        ...citas[indice],

        estado:
            accionPendienteCita ===
            'cancelar'

                ? 'Cancelada'

                : 'Confirmada',

        fechaActualizacion:
            new Date().toISOString()
    };


    guardarCitasAdmin(citas);


    const idActual =
        citaSeleccionadaId;


    cerrarConfirmacionCita();


    renderPaginaCitas();


    /*
        Si el modal de detalle estaba abierto,
        actualizamos su contenido.
    */

    const detalleAbierto =
        document.getElementById(
            'modal-cita-fondo'
        )?.hidden === false;


    if (detalleAbierto) {

        abrirDetalleCita(
            idActual
        );
    }
}


/* =========================================================
   FILTROS
========================================================= */

function initFiltrosCitas() {

    const buscador =
        document.getElementById(
            'citas-buscador'
        );


    const filtroEstado =
        document.getElementById(
            'citas-filtro-estado'
        );


    const filtroFecha =
        document.getElementById(
            'citas-filtro-fecha'
        );


    const orden =
        document.getElementById(
            'citas-orden'
        );


    const btnLimpiar =
        document.getElementById(
            'citas-btn-limpiar'
        );


    /* ================= BUSCAR ================= */

    if (buscador) {

        buscador.addEventListener(
            'input',
            () => {

                filtroTextoCitas =
                    buscador.value
                        .trim()
                        .toLowerCase();


                renderTablaCitas();
            }
        );
    }


    /* ================= ESTADO ================= */

    if (filtroEstado) {

        filtroEstado.addEventListener(
            'change',
            () => {

                filtroEstadoCitas =
                    filtroEstado.value;


                renderTablaCitas();
            }
        );
    }


    /* ================= FECHA ================= */

    if (filtroFecha) {

        filtroFecha.addEventListener(
            'change',
            () => {

                filtroFechaCitas =
                    filtroFecha.value;


                renderTablaCitas();
            }
        );
    }


    /* ================= ORDEN ================= */

    if (orden) {

        orden.addEventListener(
            'change',
            () => {

                ordenCitas =
                    orden.value;


                renderTablaCitas();
            }
        );
    }


    /* ================= LIMPIAR ================= */

    if (btnLimpiar) {

        btnLimpiar.addEventListener(
            'click',
            () => {

                filtroTextoCitas = '';

                filtroEstadoCitas = '';

                filtroFechaCitas = '';

                ordenCitas =
                    'proximas';


                if (buscador) {
                    buscador.value = '';
                }


                if (filtroEstado) {
                    filtroEstado.value = '';
                }


                if (filtroFecha) {
                    filtroFecha.value = '';
                }


                if (orden) {
                    orden.value =
                        'proximas';
                }


                renderTablaCitas();
            }
        );
    }
}


/* =========================================================
   ACCIONES DE LA TABLA
========================================================= */

function initAccionesTablaCitas() {

    const tbody =
        document.getElementById(
            'admin-citas-tabla-body'
        );


    if (!tbody) {
        return;
    }


    tbody.addEventListener(
        'click',
        (evento) => {

            const boton =
                evento.target.closest(
                    'button[data-accion]'
                );


            if (
                !boton ||
                boton.disabled
            ) {
                return;
            }


            const id =
                boton.dataset.citaId;


            const accion =
                boton.dataset.accion;


            /* ================= VER ================= */

            if (accion === 'ver') {

                abrirDetalleCita(id);

                return;
            }


            /* ================= CAMBIAR ESTADO ================= */

            if (
                accion === 'confirmar' ||
                accion === 'cancelar'
            ) {

                abrirConfirmacionCita(
                    id,
                    accion
                );
            }
        }
    );
}


/* =========================================================
   EVENTOS MODAL DETALLE
========================================================= */

function initModalDetalleCita() {

    const fondo =
        document.getElementById(
            'modal-cita-fondo'
        );


    const cerrar =
        document.getElementById(
            'modal-cita-cerrar'
        );


    const acciones =
        document.getElementById(
            'modal-cita-acciones'
        );


    if (cerrar) {

        cerrar.addEventListener(
            'click',
            cerrarDetalleCita
        );
    }


    if (fondo) {

        fondo.addEventListener(
            'click',
            (evento) => {

                if (
                    evento.target === fondo
                ) {

                    cerrarDetalleCita();
                }
            }
        );
    }


    if (acciones) {

        acciones.addEventListener(
            'click',
            (evento) => {

                const boton =
                    evento.target.closest(
                        '[data-modal-accion]'
                    );


                if (
                    !boton ||
                    !citaSeleccionadaId
                ) {
                    return;
                }


                abrirConfirmacionCita(

                    citaSeleccionadaId,

                    boton.dataset.modalAccion
                );
            }
        );
    }
}


/* =========================================================
   EVENTOS MODAL CONFIRMACIÓN
========================================================= */

function initModalConfirmacionCita() {

    const fondo =
        document.getElementById(
            'modal-confirmacion-fondo'
        );


    const volver =
        document.getElementById(
            'modal-confirmacion-volver'
        );


    const aceptar =
        document.getElementById(
            'modal-confirmacion-aceptar'
        );


    if (volver) {

        volver.addEventListener(
            'click',
            cerrarConfirmacionCita
        );
    }


    if (aceptar) {

        aceptar.addEventListener(
            'click',
            ejecutarCambioEstadoCita
        );
    }


    if (fondo) {

        fondo.addEventListener(
            'click',
            (evento) => {

                if (
                    evento.target === fondo
                ) {

                    cerrarConfirmacionCita();
                }
            }
        );
    }


    /* ================= ESC ================= */

    document.addEventListener(
        'keydown',
        (evento) => {

            if (evento.key !== 'Escape') {
                return;
            }


            if (
                fondo &&
                !fondo.hidden
            ) {

                cerrarConfirmacionCita();

                return;
            }


            const modalDetalle =
                document.getElementById(
                    'modal-cita-fondo'
                );


            if (
                modalDetalle &&
                !modalDetalle.hidden
            ) {

                cerrarDetalleCita();
            }
        }
    );
}


/* =========================================================
   RENDER GENERAL
========================================================= */

function renderPaginaCitas() {

    renderKpisCitas();

    renderTablaCitas();
}


/* =========================================================
   INICIALIZACIÓN ADMIN CITAS
========================================================= */

function initPaginaAdminCitas() {

    /*
        admin.js ya contiene protegerRutaAdmin().

        Volvemos a comprobarlo aquí para asegurarnos
        de que solamente un administrador pueda
        ingresar a esta página.
    */

    if (
        typeof protegerRutaAdmin ===
        'function'
    ) {

        const sesionAdmin =
            protegerRutaAdmin();


        if (!sesionAdmin) {
            return;
        }
    }


    /* ================= INICIAR FUNCIONES ================= */

    initFiltrosCitas();

    initAccionesTablaCitas();

    initModalDetalleCita();

    initModalConfirmacionCita();


    renderPaginaCitas();


    /*
        Si las citas cambian desde otra pestaña,
        actualizamos automáticamente el panel.
    */

    window.addEventListener(
        'storage',
        (evento) => {

            if (
                evento.key ===
                CLAVE_CITAS_ADMIN
            ) {

                renderPaginaCitas();
            }
        }
    );
}


/* =========================================================
   INICIO
========================================================= */

document.addEventListener(
    'DOMContentLoaded',
    initPaginaAdminCitas
);