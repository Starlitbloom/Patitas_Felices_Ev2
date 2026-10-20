/* =========================================================
   PATITAS FELICES
   SOLICITAR CITA
   CONECTADO CON USUARIO / SESIÓN
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CLAVES LOCALSTORAGE
    ===================================================== */

    const CLAVE_SESION = "patitasFelices_sesion";
    const CLAVE_CITAS = "patitasFelices_citas";


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


    const sesion = obtenerSesion();


    /* =====================================================
       PROTEGER PÁGINA
    ===================================================== */

    if (!sesion) {

        window.location.href = "login.html";
        return;
    }


    /* =====================================================
       FORMULARIO
    ===================================================== */

    const formulario =
        document.getElementById("formularioCita");

    if (!formulario) {
        return;
    }


    /* =====================================================
       CAMPOS
    ===================================================== */

    const nombreDueno =
        document.getElementById("nombreDueno");

    const correoCita =
        document.getElementById("correoCita");

    const telefonoCita =
        document.getElementById("telefonoCita");

    const nombreMascota =
        document.getElementById("nombreMascota");

    const edadMascota =
        document.getElementById("edadMascota");

    const servicioCita =
        document.getElementById("servicioCita");

    const fechaCita =
        document.getElementById("fechaCita");

    const horaCita =
        document.getElementById("horaCita");

    const motivoCita =
        document.getElementById("motivoCita");

    const confirmarDatos =
        document.getElementById("confirmarDatos");

    const mensajeExitoCita =
        document.getElementById("mensajeExitoCita");

    const contadorMotivo =
        document.getElementById("contadorMotivo");


    /* =====================================================
       MENSAJES DE ERROR
    ===================================================== */

    const errorNombreDueno =
        document.getElementById("errorNombreDueno");

    const errorCorreoCita =
        document.getElementById("errorCorreoCita");

    const errorTelefonoCita =
        document.getElementById("errorTelefonoCita");

    const errorNombreMascota =
        document.getElementById("errorNombreMascota");

    const errorTipoMascota =
        document.getElementById("errorTipoMascota");

    const errorEdadMascota =
        document.getElementById("errorEdadMascota");

    const errorServicioCita =
        document.getElementById("errorServicioCita");

    const errorFechaCita =
        document.getElementById("errorFechaCita");

    const errorHoraCita =
        document.getElementById("errorHoraCita");

    const errorConfirmarDatos =
        document.getElementById("errorConfirmarDatos");


    /* =====================================================
       EXPRESIONES REGULARES
    ===================================================== */

    const expresionNombre =
        /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+$/;

    const expresionCorreo =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const expresionTelefono =
        /^(\+?56)?\s?9\s?\d{4}\s?\d{4}$/;


    /* =====================================================
       CARGAR DATOS DEL USUARIO
    ===================================================== */

    function cargarDatosUsuario() {

        const nombreCompleto =
            `${sesion.nombre || ""} ${sesion.apellidos || ""}`
                .trim();


        if (nombreDueno) {
            nombreDueno.value = nombreCompleto;
        }


        if (correoCita) {
            correoCita.value = sesion.correo || "";
        }


        if (telefonoCita) {
            telefonoCita.value = sesion.telefono || "";
        }
    }


    cargarDatosUsuario();


    /* =====================================================
       FECHA MÍNIMA
    ===================================================== */

    const hoy = new Date();

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


    const fechaMinima =
        `${anio}-${mes}-${dia}`;


    if (fechaCita) {
        fechaCita.min = fechaMinima;
    }


    /* =====================================================
       FUNCIONES DE ERROR
    ===================================================== */

    function mostrarError(
        campo,
        elementoError,
        mensaje
    ) {

        if (campo) {

            campo.classList.add(
                "campo-error"
            );
        }


        if (elementoError) {

            elementoError.textContent =
                mensaje;
        }


        return false;
    }


    function limpiarError(
        campo,
        elementoError
    ) {

        if (campo) {

            campo.classList.remove(
                "campo-error"
            );
        }


        if (elementoError) {

            elementoError.textContent = "";
        }


        return true;
    }


    /* =====================================================
       LIMPIAR TODOS LOS ERRORES
    ===================================================== */

    function limpiarTodosLosErrores() {

        formulario
            .querySelectorAll(".campo-error")
            .forEach((campo) => {

                campo.classList.remove(
                    "campo-error"
                );
            });


        formulario
            .querySelectorAll(".mensaje-error")
            .forEach((mensaje) => {

                mensaje.textContent = "";
            });


        if (errorTipoMascota) {
            errorTipoMascota.textContent = "";
        }


        if (errorServicioCita) {
            errorServicioCita.textContent = "";
        }


        if (errorConfirmarDatos) {
            errorConfirmarDatos.textContent = "";
        }
    }


    /* =====================================================
       OBTENER TIPO DE MASCOTA
    ===================================================== */

    function obtenerTipoMascota() {

        return document.querySelector(
            'input[name="tipoMascota"]:checked'
        );
    }


    /* =====================================================
       OBTENER SERVICIO
    ===================================================== */

    function obtenerServicio() {

        if (
            servicioCita &&
            servicioCita.tagName === "SELECT"
        ) {

            return servicioCita;
        }


        return document.querySelector(
            'input[name="servicioCita"]:checked'
        );
    }


    /* =====================================================
       VALIDAR NOMBRE DEL DUEÑO
    ===================================================== */

    function validarNombreDueno() {

        const valor =
            nombreDueno.value.trim();


        if (valor === "") {

            return mostrarError(
                nombreDueno,
                errorNombreDueno,
                "Ingresa tu nombre completo."
            );
        }


        if (valor.length < 3) {

            return mostrarError(
                nombreDueno,
                errorNombreDueno,
                "El nombre debe tener al menos 3 caracteres."
            );
        }


        if (!expresionNombre.test(valor)) {

            return mostrarError(
                nombreDueno,
                errorNombreDueno,
                "El nombre solo puede contener letras."
            );
        }


        return limpiarError(
            nombreDueno,
            errorNombreDueno
        );
    }


    /* =====================================================
       VALIDAR CORREO
    ===================================================== */

    function validarCorreo() {

        const valor =
            correoCita.value.trim();


        if (valor === "") {

            return mostrarError(
                correoCita,
                errorCorreoCita,
                "Ingresa tu correo electrónico."
            );
        }


        if (!expresionCorreo.test(valor)) {

            return mostrarError(
                correoCita,
                errorCorreoCita,
                "Ingresa un correo válido."
            );
        }


        return limpiarError(
            correoCita,
            errorCorreoCita
        );
    }


    /* =====================================================
       VALIDAR TELÉFONO
    ===================================================== */

    function validarTelefono() {

        const valor =
            telefonoCita.value.trim();


        if (valor === "") {

            return mostrarError(
                telefonoCita,
                errorTelefonoCita,
                "Ingresa tu número de teléfono."
            );
        }


        if (!expresionTelefono.test(valor)) {

            return mostrarError(
                telefonoCita,
                errorTelefonoCita,
                "Usa un teléfono chileno válido. Ej: +56 9 1234 5678."
            );
        }


        return limpiarError(
            telefonoCita,
            errorTelefonoCita
        );
    }


    /* =====================================================
       VALIDAR NOMBRE MASCOTA
    ===================================================== */

    function validarNombreMascota() {

        const valor =
            nombreMascota.value.trim();


        if (valor === "") {

            return mostrarError(
                nombreMascota,
                errorNombreMascota,
                "Ingresa el nombre de tu mascota."
            );
        }


        if (valor.length < 2) {

            return mostrarError(
                nombreMascota,
                errorNombreMascota,
                "Ingresa un nombre válido."
            );
        }


        if (!expresionNombre.test(valor)) {

            return mostrarError(
                nombreMascota,
                errorNombreMascota,
                "El nombre solo puede contener letras."
            );
        }


        return limpiarError(
            nombreMascota,
            errorNombreMascota
        );
    }


    /* =====================================================
       VALIDAR TIPO MASCOTA
    ===================================================== */

    function validarTipoMascota() {

        const tipoMascota =
            obtenerTipoMascota();


        if (!tipoMascota) {

            if (errorTipoMascota) {

                errorTipoMascota.textContent =
                    "Selecciona el tipo de mascota.";
            }


            return false;
        }


        if (errorTipoMascota) {
            errorTipoMascota.textContent = "";
        }


        return true;
    }


    /* =====================================================
       VALIDAR EDAD
    ===================================================== */

    function validarEdadMascota() {

        const valor =
            edadMascota.value.trim();

        const edad =
            Number(valor);


        if (valor === "") {

            return mostrarError(
                edadMascota,
                errorEdadMascota,
                "Ingresa la edad aproximada."
            );
        }


        if (
            Number.isNaN(edad) ||
            edad < 0 ||
            edad > 30
        ) {

            return mostrarError(
                edadMascota,
                errorEdadMascota,
                "Ingresa una edad entre 0 y 30 años."
            );
        }


        return limpiarError(
            edadMascota,
            errorEdadMascota
        );
    }


    /* =====================================================
       VALIDAR SERVICIO
    ===================================================== */

    function validarServicio() {

        const servicio =
            obtenerServicio();


        if (
            !servicio ||
            servicio.value === ""
        ) {

            if (errorServicioCita) {

                errorServicioCita.textContent =
                    "Selecciona el tipo de atención.";
            }


            if (servicioCita) {

                servicioCita.classList.add(
                    "campo-error"
                );
            }


            return false;
        }


        if (errorServicioCita) {
            errorServicioCita.textContent = "";
        }


        if (servicioCita) {

            servicioCita.classList.remove(
                "campo-error"
            );
        }


        return true;
    }


    /* =====================================================
       VALIDAR FECHA
    ===================================================== */

    function validarFecha() {

        const valor =
            fechaCita.value;


        if (valor === "") {

            return mostrarError(
                fechaCita,
                errorFechaCita,
                "Selecciona una fecha."
            );
        }


        if (valor < fechaMinima) {

            return mostrarError(
                fechaCita,
                errorFechaCita,
                "La fecha no puede ser anterior a hoy."
            );
        }


        return limpiarError(
            fechaCita,
            errorFechaCita
        );
    }


    /* =====================================================
       VALIDAR HORA
    ===================================================== */

    function validarHora() {

        if (horaCita.value === "") {

            return mostrarError(
                horaCita,
                errorHoraCita,
                "Selecciona un horario."
            );
        }


        return limpiarError(
            horaCita,
            errorHoraCita
        );
    }


    /* =====================================================
       DESHABILITAR HORARIOS YA RESERVADOS
       Se ejecuta al elegir la fecha, para que el horario
       ocupado no se pueda ni seleccionar.
    ===================================================== */

    function actualizarHorariosDisponibles() {

        if (!horaCita) return;

        const citasExistentes = obtenerCitas();
        const horaSeleccionada = horaCita.value;

        const horasOcupadas = citasExistentes
            .filter(
                (c) =>
                    c.fecha === fechaCita.value &&
                    (c.estado || "").toLowerCase() !== "cancelada"
            )
            .map((c) => c.hora);

        Array.from(horaCita.options).forEach((opcion) => {
            if (opcion.value === "") return;

            const ocupada = horasOcupadas.includes(opcion.value);
            opcion.disabled = ocupada;
            opcion.textContent = ocupada ? `${opcion.value} (reservado)` : opcion.value;
        });

        if (horasOcupadas.includes(horaSeleccionada)) {
            horaCita.value = "";
        }
    }


    /* =====================================================
       VALIDAR DISPONIBILIDAD DEL HORARIO
       Un mismo día + hora no puede reservarse dos veces.
    ===================================================== */

    function validarDisponibilidadHorario() {

        if (fechaCita.value === "" || horaCita.value === "") {
            return true;
        }

        const citasExistentes = obtenerCitas();

        const ocupado = citasExistentes.some(
            (c) =>
                c.fecha === fechaCita.value &&
                c.hora === horaCita.value &&
                (c.estado || "").toLowerCase() !== "cancelada"
        );

        if (ocupado) {

            return mostrarError(
                horaCita,
                errorHoraCita,
                "Ese horario ya está reservado. Elige otro horario u otra fecha."
            );
        }

        return limpiarError(
            horaCita,
            errorHoraCita
        );
    }


    /* =====================================================
       VALIDAR CONFIRMACIÓN
    ===================================================== */

    function validarConfirmacion() {

        if (!confirmarDatos.checked) {

            if (errorConfirmarDatos) {

                errorConfirmarDatos.textContent =
                    "Debes confirmar que los datos son correctos.";
            }


            return false;
        }


        if (errorConfirmarDatos) {
            errorConfirmarDatos.textContent = "";
        }


        return true;
    }


    /* =====================================================
       CONTADOR MOTIVO
    ===================================================== */

    if (
        motivoCita &&
        contadorMotivo
    ) {

        motivoCita.addEventListener(
            "input",
            () => {

                contadorMotivo.textContent =
                    `${motivoCita.value.length} / 500`;
            }
        );
    }


    /* =====================================================
       VALIDACIONES EN TIEMPO REAL
    ===================================================== */

    if (nombreDueno) {

        nombreDueno.addEventListener(
            "input",
            validarNombreDueno
        );
    }


    if (correoCita) {

        correoCita.addEventListener(
            "input",
            validarCorreo
        );
    }


    if (telefonoCita) {

        telefonoCita.addEventListener(
            "input",
            validarTelefono
        );
    }


    if (nombreMascota) {

        nombreMascota.addEventListener(
            "input",
            validarNombreMascota
        );
    }


    if (edadMascota) {

        edadMascota.addEventListener(
            "input",
            validarEdadMascota
        );
    }


    if (fechaCita) {

        fechaCita.addEventListener(
            "change",
            () => {
                validarFecha();
                actualizarHorariosDisponibles();
                validarDisponibilidadHorario();
            }
        );
    }


    if (horaCita) {

        horaCita.addEventListener(
            "change",
            () => {
                validarHora();
                validarDisponibilidadHorario();
            }
        );
    }


    if (confirmarDatos) {

        confirmarDatos.addEventListener(
            "change",
            validarConfirmacion
        );
    }


    document
        .querySelectorAll(
            'input[name="tipoMascota"]'
        )
        .forEach((radio) => {

            radio.addEventListener(
                "change",
                validarTipoMascota
            );
        });


    if (servicioCita) {

        servicioCita.addEventListener(
            "change",
            validarServicio
        );
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
       GUARDAR CITA
    ===================================================== */

    function guardarCita() {

        const citasGuardadas =
            obtenerCitas();


        const tipoMascota =
            obtenerTipoMascota();

        const servicio =
            obtenerServicio();


        const nombreCompletoUsuario =
            `${sesion.nombre || ""} ${sesion.apellidos || ""}`
                .trim();


        const nuevaCita = {

            id:
                Date.now(),

            correoUsuario:
                sesion.correo,

            nombreUsuario:
                nombreCompletoUsuario,

            dueno:
                nombreDueno.value.trim(),

            propietario:
                nombreDueno.value.trim(),

            correo:
                correoCita.value.trim(),

            telefono:
                telefonoCita.value.trim(),

            mascota:
                nombreMascota.value.trim(),

            tipoMascota:
                tipoMascota.value,

            edadMascota:
                Number(
                    edadMascota.value
                ),

            servicio:
                servicio.value,

            fecha:
                fechaCita.value,

            hora:
                horaCita.value,

            motivo:
                motivoCita.value.trim(),

            estado:
                "Pendiente",

            fechaRegistro:
                new Date().toISOString()
        };


        citasGuardadas.push(
            nuevaCita
        );


        localStorage.setItem(
            CLAVE_CITAS,
            JSON.stringify(
                citasGuardadas
            )
        );


        asegurarMascotaDeLaCita(
            nuevaCita,
            nombreCompletoUsuario
        );
    }


    /* =====================================================
       CREAR/VINCULAR MASCOTA A PARTIR DE LA CITA
       Si el dueño ya tiene una mascota con ese nombre, no la
       toca. Si no existe, crea una ficha mínima marcada como
       incompleta, para que la termine de llenar desde su perfil.
    ===================================================== */

    const CLAVE_MASCOTAS = "patitasFelices_mascotas";

    function generarIdMascota(nombre) {
        const base = nombre
            .toLowerCase()
            .normalize("NFD")
            .replace(/[̀-ͯ]/g, "")
            .replace(/[^a-z0-9]/g, "-");
        return `${base}-${Date.now()}`;
    }

    function asegurarMascotaDeLaCita(cita, nombreDuenoCompleto) {

        let mascotasGuardadas = [];
        try {
            mascotasGuardadas = JSON.parse(
                localStorage.getItem(CLAVE_MASCOTAS)
            ) || [];
        } catch (error) {
            console.error("No se pudieron leer las mascotas guardadas.", error);
            mascotasGuardadas = [];
        }

        const yaExiste = mascotasGuardadas.some(
            (m) =>
                m.correoDueño === sesion.correo &&
                m.nombre.toLowerCase() === cita.mascota.toLowerCase()
        );

        if (yaExiste) return;

        mascotasGuardadas.push({
            id: generarIdMascota(cita.mascota),
            nombre: cita.mascota,
            especie: cita.tipoMascota,
            raza: "",
            edad: String(cita.edadMascota || ""),
            sexo: "",
            peso: "",
            dueno: nombreDuenoCompleto,
            correoDueño: sesion.correo,
            imagen: "../img/cuidado.png",
            estado: "pendiente",
            estadoTexto: "Vacunas pendientes",
            descripcion: "",
            completo: false,
        });

        localStorage.setItem(
            CLAVE_MASCOTAS,
            JSON.stringify(mascotasGuardadas)
        );
    }


    /* =====================================================
       ENVIAR FORMULARIO
    ===================================================== */

    formulario.addEventListener(
        "submit",
        (evento) => {

            evento.preventDefault();


            /* =================================================
               COMPROBAR SESIÓN
            ================================================= */

            const sesionActual =
                obtenerSesion();


            if (!sesionActual) {

                window.location.href =
                    "login.html";

                return;
            }


            /* =================================================
               VALIDAR CAMPOS
            ================================================= */

            const validaciones = [

                validarNombreDueno(),

                validarCorreo(),

                validarTelefono(),

                validarNombreMascota(),

                validarTipoMascota(),

                validarEdadMascota(),

                validarServicio(),

                validarFecha(),

                validarHora(),

                validarDisponibilidadHorario(),

                validarConfirmacion()
            ];


            const formularioValido =
                validaciones.every(
                    resultado =>
                        resultado === true
                );


            /* =================================================
               SI HAY ERRORES
            ================================================= */

            if (!formularioValido) {

                return;
            }


            /* =================================================
               GUARDAR CITA
            ================================================= */

            guardarCita();


            /* =================================================
               LIMPIAR CUALQUIER ERROR
            ================================================= */

            limpiarTodosLosErrores();


            /* =================================================
               MOSTRAR MENSAJE DE ÉXITO
            ================================================= */

            if (mensajeExitoCita) {

                mensajeExitoCita.classList.add(
                    "mostrar"
                );
            }


            /* =================================================
               DESACTIVAR BOTÓN
            ================================================= */

            const botonEnviar =
                formulario.querySelector(
                    ".boton-solicitar-cita"
                );


            if (botonEnviar) {

                botonEnviar.disabled = true;

                botonEnviar.innerHTML =
                    `
                        Solicitud enviada
                        <span>✓</span>
                    `;
            }
        }
    );

});