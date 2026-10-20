/* =========================================================
   PATITAS FELICES
   MIS CITAS
   CONECTADO CON USUARIO / SESIÓN
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CLAVES LOCALSTORAGE
    ===================================================== */

    const CLAVE_SESION = "patitasFelices_sesion";
    const CLAVE_CITAS = "patitasFelices_citas";


    /* =====================================================
       ELEMENTOS
    ===================================================== */

    const contenedorCitas =
        document.getElementById("contenedorCitas");

    const sinCitas =
        document.getElementById("sinCitas");

    const totalCitas =
        document.getElementById("totalCitas");


    /* =====================================================
       OBTENER SESIÓN
    ===================================================== */

    function obtenerSesion() {

        try {

            return JSON.parse(
                localStorage.getItem(CLAVE_SESION)
            );

        } catch (error) {

            console.error(
                "No se pudo leer la sesión.",
                error
            );

            return null;
        }
    }


    const sesion =
        obtenerSesion();


    /* =====================================================
       PROTEGER PÁGINA
    ===================================================== */

    if (!sesion) {

        window.location.href =
            "login.html";

        return;
    }


    /* =====================================================
       OBTENER CITAS
    ===================================================== */

    function obtenerCitas() {

        try {

            return JSON.parse(
                localStorage.getItem(CLAVE_CITAS)
            ) || [];

        } catch (error) {

            console.error(
                "No se pudieron cargar las citas.",
                error
            );

            return [];
        }
    }


    /* =====================================================
       GUARDAR CITAS
    ===================================================== */

    function guardarCitas(citas) {

        localStorage.setItem(
            CLAVE_CITAS,
            JSON.stringify(citas)
        );
    }


    /* =====================================================
       OBTENER CITAS DEL USUARIO
    ===================================================== */

    function obtenerCitasUsuario() {

        const citas =
            obtenerCitas();


        return citas.filter(
            cita =>
                cita.correoUsuario &&
                cita.correoUsuario.toLowerCase() ===
                sesion.correo.toLowerCase()
        );
    }


    /* =====================================================
       FORMATEAR FECHA
    ===================================================== */

    function formatearFecha(fecha) {

        if (!fecha) {
            return "Sin fecha";
        }


        const partes =
            fecha.split("-");


        if (partes.length !== 3) {
            return fecha;
        }


        const nuevaFecha =
            new Date(
                Number(partes[0]),
                Number(partes[1]) - 1,
                Number(partes[2])
            );


        return nuevaFecha.toLocaleDateString(
            "es-CL",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );
    }


    /* =====================================================
       FECHA DE HOY
    ===================================================== */

    function obtenerFechaHoy() {

        const hoy =
            new Date();


        const anio =
            hoy.getFullYear();

        const mes =
            String(
                hoy.getMonth() + 1
            ).padStart(2, "0");

        const dia =
            String(
                hoy.getDate()
            ).padStart(2, "0");


        return `${anio}-${mes}-${dia}`;
    }


    /* =====================================================
       CLASE DEL ESTADO
    ===================================================== */

    function obtenerClaseEstado(estado) {

        const valor =
            String(
                estado || "Pendiente"
            )
                .trim()
                .toLowerCase();


        if (valor === "confirmada") {
            return "estado-confirmada";
        }


        if (valor === "cancelada") {
            return "estado-cancelada";
        }


        return "estado-pendiente";
    }


    /* =====================================================
       IMAGEN SEGÚN TIPO DE MASCOTA
    ===================================================== */

    function obtenerImagenMascota(tipo) {

        const tipoNormalizado =
            String(
                tipo || ""
            )
                .trim()
                .toLowerCase();


        /* PERRO */

        if (
            tipoNormalizado === "perro" ||
            tipoNormalizado === "perra" ||
            tipoNormalizado === "canino" ||
            tipoNormalizado === "canina"
        ) {

            return "../img/icono-perro.png";
        }


        /* GATO */

        if (
            tipoNormalizado === "gato" ||
            tipoNormalizado === "gata" ||
            tipoNormalizado === "felino" ||
            tipoNormalizado === "felina"
        ) {

            return "../img/icono-gato.png";
        }


        /* OTRO */

        return "../img/icono-otro.png";
    }


    /* =====================================================
       NOMBRE TIPO MASCOTA
    ===================================================== */

    function obtenerNombreTipoMascota(tipo) {

        const tipoNormalizado =
            String(
                tipo || ""
            )
                .trim()
                .toLowerCase();


        if (
            tipoNormalizado === "perro" ||
            tipoNormalizado === "perra" ||
            tipoNormalizado === "canino" ||
            tipoNormalizado === "canina"
        ) {

            return "Perro";
        }


        if (
            tipoNormalizado === "gato" ||
            tipoNormalizado === "gata" ||
            tipoNormalizado === "felino" ||
            tipoNormalizado === "felina"
        ) {

            return "Gato";
        }


        return "Otro";
    }


    /* =====================================================
       MOSTRAR CITAS
    ===================================================== */

    function mostrarCitas() {

        const citas =
            obtenerCitasUsuario();


        contenedorCitas.innerHTML =
            "";


        totalCitas.textContent =
            citas.length;


        /* =================================================
           SIN CITAS
        ================================================= */

        if (citas.length === 0) {

            sinCitas.style.display =
                "block";

            contenedorCitas.style.display =
                "none";

            return;
        }


        /* =================================================
           CON CITAS
        ================================================= */

        sinCitas.style.display =
            "none";

        contenedorCitas.style.display =
            "grid";


        const citasOrdenadas =
            [...citas].sort(
                (a, b) =>
                    Number(b.id || 0) -
                    Number(a.id || 0)
            );


        citasOrdenadas.forEach(
            cita => {

                /* =================================================
                   CREAR TARJETA
                ================================================= */

                const tarjeta =
                    document.createElement(
                        "article"
                    );


                tarjeta.classList.add(
                    "tarjeta-cita"
                );


                /* =================================================
                   DATOS DE LA CITA
                ================================================= */

                const estado =
                    cita.estado || "Pendiente";


                const claseEstado =
                    obtenerClaseEstado(
                        estado
                    );


                const imagenMascota =
                    obtenerImagenMascota(
                        cita.tipoMascota
                    );


                const nombreTipoMascota =
                    obtenerNombreTipoMascota(
                        cita.tipoMascota
                    );


                /* =================================================
                   IMAGEN DE FONDO DE LA TARJETA
                ================================================= */

                tarjeta.style.setProperty(
                    "--imagen-mascota",
                    `url("${imagenMascota}")`
                );


                const motivo =
                    cita.motivo &&
                    cita.motivo.trim() !== ""

                        ? cita.motivo

                        : "Sin información adicional.";


                const nombreDueno =
                    cita.dueno ||
                    cita.propietario ||
                    sesion.nombre ||
                    "Usuario";


                /* =================================================
                   CONTENIDO DE LA TARJETA
                ================================================= */

                tarjeta.innerHTML = `

                    <div class="cita-superior">

                        <div class="cita-mascota">

                            <div class="icono-mascota-cita">

                                <img
                                    src="${imagenMascota}"
                                    alt="Ilustración de ${nombreTipoMascota}"
                                    class="imagen-icono-mascota"
                                >

                            </div>


                            <div class="informacion-mascota-cita">

                                <h3>
                                    ${cita.mascota || "Mascota"}
                                </h3>

                                <span>
                                    ${nombreTipoMascota}
                                </span>

                            </div>

                        </div>


                        <span class="estado-cita ${claseEstado}">
                            ${estado}
                        </span>

                    </div>


                    <div class="datos-cita">

                        <div class="dato-cita">

                            <span>
                                Servicio
                            </span>

                            <strong>
                                ${cita.servicio || "Sin servicio"}
                            </strong>

                        </div>


                        <div class="dato-cita">

                            <span>
                                Fecha
                            </span>

                            <strong>
                                ${formatearFecha(cita.fecha)}
                            </strong>

                        </div>


                        <div class="dato-cita">

                            <span>
                                Hora
                            </span>

                            <strong>
                                ${cita.hora || "Por confirmar"}
                            </strong>

                        </div>


                        <div class="dato-cita">

                            <span>
                                Propietario
                            </span>

                            <strong>
                                ${nombreDueno}
                            </strong>

                        </div>

                    </div>


                    <div class="motivo-cita">

                        <span>
                            Motivo o información adicional
                        </span>

                        <p>
                            ${motivo}
                        </p>

                    </div>


                    ${
                        String(estado).toLowerCase() === "pendiente"

                            ? `

                                <div
                                    class="formulario-editar-cita"
                                    id="editar-cita-${cita.id}"
                                    style="display: none;"
                                >

                                    <div class="campo-editar-cita">

                                        <label
                                            for="nuevaFecha-${cita.id}"
                                        >
                                            Nueva fecha
                                        </label>

                                        <input
                                            type="date"
                                            id="nuevaFecha-${cita.id}"
                                            value="${cita.fecha || ""}"
                                            min="${obtenerFechaHoy()}"
                                        >

                                    </div>


                                    <div class="campo-editar-cita">

                                        <label
                                            for="nuevaHora-${cita.id}"
                                        >
                                            Nueva hora
                                        </label>

                                        <input
                                            type="time"
                                            id="nuevaHora-${cita.id}"
                                            value="${cita.hora || ""}"
                                        >

                                    </div>


                                    <p
                                        class="mensaje-error-edicion"
                                        id="errorEdicion-${cita.id}"
                                    ></p>


                                    <div class="acciones-edicion-cita">

                                        <button
                                            type="button"
                                            class="boton-guardar-cambios"
                                            data-id="${cita.id}"
                                        >
                                            Guardar cambios
                                        </button>


                                        <button
                                            type="button"
                                            class="boton-cerrar-edicion"
                                            data-id="${cita.id}"
                                        >
                                            Volver
                                        </button>

                                    </div>

                                </div>


                                <div class="acciones-cita">

                                    <button
                                        type="button"
                                        class="boton-modificar-cita"
                                        data-id="${cita.id}"
                                    >
                                        Modificar fecha y hora
                                    </button>


                                    <button
                                        type="button"
                                        class="boton-cancelar-cita"
                                        data-id="${cita.id}"
                                    >
                                        Cancelar cita
                                    </button>

                                </div>

                            `

                            : ""
                    }

                `;


                contenedorCitas.appendChild(
                    tarjeta
                );
            }
        );


        /* =================================================
           ACTIVAR BOTONES
        ================================================= */

        agregarEventosModificar();
        agregarEventosGuardarCambios();
        agregarEventosCerrarEdicion();
        agregarEventosCancelar();
    }


    /* =====================================================
       ABRIR EDICIÓN
    ===================================================== */

    function abrirEdicion(id) {

        const formularioEdicion =
            document.getElementById(
                `editar-cita-${id}`
            );


        if (!formularioEdicion) {
            return;
        }


        formularioEdicion.style.display =
            "grid";
    }


    /* =====================================================
       CERRAR EDICIÓN
    ===================================================== */

    function cerrarEdicion(id) {

        const formularioEdicion =
            document.getElementById(
                `editar-cita-${id}`
            );


        const mensajeError =
            document.getElementById(
                `errorEdicion-${id}`
            );


        if (formularioEdicion) {

            formularioEdicion.style.display =
                "none";
        }


        if (mensajeError) {

            mensajeError.textContent =
                "";
        }
    }


    /* =====================================================
       MODIFICAR CITA
    ===================================================== */

    function modificarCita(id) {

        const inputFecha =
            document.getElementById(
                `nuevaFecha-${id}`
            );


        const inputHora =
            document.getElementById(
                `nuevaHora-${id}`
            );


        const mensajeError =
            document.getElementById(
                `errorEdicion-${id}`
            );


        if (
            !inputFecha ||
            !inputHora
        ) {

            return;
        }


        const nuevaFecha =
            inputFecha.value;


        const nuevaHora =
            inputHora.value;


        /* =================================================
           VALIDAR FECHA
        ================================================= */

        if (nuevaFecha === "") {

            if (mensajeError) {

                mensajeError.textContent =
                    "Selecciona una nueva fecha.";
            }

            return;
        }


        if (
            nuevaFecha <
            obtenerFechaHoy()
        ) {

            if (mensajeError) {

                mensajeError.textContent =
                    "La fecha no puede ser anterior a hoy.";
            }

            return;
        }


        /* =================================================
           VALIDAR HORA
        ================================================= */

        if (nuevaHora === "") {

            if (mensajeError) {

                mensajeError.textContent =
                    "Selecciona una nueva hora.";
            }

            return;
        }


        if (mensajeError) {

            mensajeError.textContent =
                "";
        }


        const citas =
            obtenerCitas();


        const citasActualizadas =
            citas.map(
                cita => {

                    if (
                        Number(cita.id) ===
                        Number(id)
                    ) {

                        const perteneceUsuario =
                            cita.correoUsuario &&
                            cita.correoUsuario.toLowerCase() ===
                            sesion.correo.toLowerCase();


                        const estaPendiente =
                            String(
                                cita.estado || "Pendiente"
                            )
                                .toLowerCase() ===
                            "pendiente";


                        if (
                            perteneceUsuario &&
                            estaPendiente
                        ) {

                            return {

                                ...cita,

                                fecha:
                                    nuevaFecha,

                                hora:
                                    nuevaHora,

                                fechaModificacion:
                                    new Date().toISOString()

                            };
                        }
                    }


                    return cita;
                }
            );


        guardarCitas(
            citasActualizadas
        );


        mostrarCitas();
    }


    /* =====================================================
       CANCELAR CITA
    ===================================================== */

    function cancelarCita(id) {

        const citas =
            obtenerCitas();


        const citasActualizadas =
            citas.map(
                cita => {

                    if (
                        Number(cita.id) ===
                        Number(id)
                    ) {

                        const perteneceUsuario =
                            cita.correoUsuario &&
                            cita.correoUsuario.toLowerCase() ===
                            sesion.correo.toLowerCase();


                        const estaPendiente =
                            String(
                                cita.estado || "Pendiente"
                            )
                                .toLowerCase() ===
                            "pendiente";


                        if (
                            perteneceUsuario &&
                            estaPendiente
                        ) {

                            return {

                                ...cita,

                                estado:
                                    "Cancelada",

                                fechaModificacion:
                                    new Date().toISOString()

                            };
                        }
                    }


                    return cita;
                }
            );


        guardarCitas(
            citasActualizadas
        );


        mostrarCitas();
    }


    /* =====================================================
       EVENTOS MODIFICAR
    ===================================================== */

    function agregarEventosModificar() {

        const botones =
            document.querySelectorAll(
                ".boton-modificar-cita"
            );


        botones.forEach(
            boton => {

                boton.addEventListener(
                    "click",
                    () => {

                        const id =
                            boton.dataset.id;


                        abrirEdicion(id);
                    }
                );
            }
        );
    }


    /* =====================================================
       EVENTOS GUARDAR CAMBIOS
    ===================================================== */

    function agregarEventosGuardarCambios() {

        const botones =
            document.querySelectorAll(
                ".boton-guardar-cambios"
            );


        botones.forEach(
            boton => {

                boton.addEventListener(
                    "click",
                    () => {

                        const id =
                            boton.dataset.id;


                        modificarCita(id);
                    }
                );
            }
        );
    }


    /* =====================================================
       EVENTOS CERRAR EDICIÓN
    ===================================================== */

    function agregarEventosCerrarEdicion() {

        const botones =
            document.querySelectorAll(
                ".boton-cerrar-edicion"
            );


        botones.forEach(
            boton => {

                boton.addEventListener(
                    "click",
                    () => {

                        const id =
                            boton.dataset.id;


                        cerrarEdicion(id);
                    }
                );
            }
        );
    }


    /* =====================================================
       EVENTOS CANCELAR
    ===================================================== */

    function agregarEventosCancelar() {

        const botones =
            document.querySelectorAll(
                ".boton-cancelar-cita"
            );


        botones.forEach(
            boton => {

                boton.addEventListener(
                    "click",
                    () => {

                        const id =
                            boton.dataset.id;


                        const confirmar =
                            window.confirm(
                                "¿Seguro que deseas cancelar esta cita?"
                            );


                        if (!confirmar) {
                            return;
                        }


                        cancelarCita(id);
                    }
                );
            }
        );
    }


    /* =====================================================
       CARGAR CITAS
    ===================================================== */

    mostrarCitas();

});