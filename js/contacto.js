/* =========================================================
   PATITAS FELICES
   VALIDACIÓN FORMULARIO DE CONTACTO
========================================================= */


/* =========================================================
   ELEMENTOS DEL FORMULARIO
========================================================= */

const formulario =
    document.getElementById("formularioContacto");

const nombre =
    document.getElementById("nombre");

const correo =
    document.getElementById("correo");

const telefono =
    document.getElementById("telefono");

const asunto =
    document.getElementById("asunto");

const mensaje =
    document.getElementById("mensaje");


/* MENSAJES DE ERROR */

const errorNombre =
    document.getElementById("errorNombre");

const errorCorreo =
    document.getElementById("errorCorreo");

const errorTelefono =
    document.getElementById("errorTelefono");

const errorAsunto =
    document.getElementById("errorAsunto");

const errorMensaje =
    document.getElementById("errorMensaje");


/* MENSAJE DE ÉXITO */

const mensajeExito =
    document.getElementById("mensajeExito");



/* =========================================================
   EXPRESIONES REGULARES
========================================================= */


/* NOMBRE
   Solo permite letras, espacios, tildes, ñ y ü
*/

const expresionNombre =
    /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;


/* CORREO */

const expresionCorreo =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


/* TELÉFONO CHILENO
   ACEPTA:
   +56 9 1234 5678
   56912345678
   912345678
*/

const expresionTelefono =
    /^(\+?56)?\s?9\s?\d{4}\s?\d{4}$/;



/* =========================================================
   FUNCIONES DE ERROR
========================================================= */

function mostrarError(campo, elementoError, mensajeError) {

    campo.classList.add("campo-error");

    elementoError.textContent =
        mensajeError;

}


function limpiarError(campo, elementoError) {

    campo.classList.remove("campo-error");

    elementoError.textContent = "";

}



/* =========================================================
   VALIDAR NOMBRE
========================================================= */

function validarNombre() {

    const valorNombre =
        nombre.value.trim();


    /* CAMPO VACÍO */

    if (valorNombre === "") {

        mostrarError(
            nombre,
            errorNombre,
            "Por favor, ingresa tu nombre."
        );

        return false;
    }


    /* MÍNIMO DE CARACTERES */

    if (valorNombre.length < 3) {

        mostrarError(
            nombre,
            errorNombre,
            "El nombre debe tener al menos 3 caracteres."
        );

        return false;
    }


    /* MÁXIMO DE CARACTERES */

    if (valorNombre.length > 60) {

        mostrarError(
            nombre,
            errorNombre,
            "El nombre no puede superar los 60 caracteres."
        );

        return false;
    }


    /* SOLO LETRAS */

    if (!expresionNombre.test(valorNombre)) {

        mostrarError(
            nombre,
            errorNombre,
            "El nombre solo puede contener letras y espacios."
        );

        return false;
    }


    /* NOMBRE CORRECTO */

    limpiarError(
        nombre,
        errorNombre
    );

    return true;

}



/* =========================================================
   VALIDAR CORREO
========================================================= */

function validarCorreo() {

    const valorCorreo =
        correo.value.trim();


    /* CAMPO VACÍO */

    if (valorCorreo === "") {

        mostrarError(
            correo,
            errorCorreo,
            "Por favor, ingresa tu correo electrónico."
        );

        return false;
    }


    /* FORMATO DE CORREO */

    if (!expresionCorreo.test(valorCorreo)) {

        mostrarError(
            correo,
            errorCorreo,
            "Ingresa un correo electrónico válido."
        );

        return false;
    }


    /* CORREO CORRECTO */

    limpiarError(
        correo,
        errorCorreo
    );

    return true;

}



/* =========================================================
   VALIDAR TELÉFONO
========================================================= */

function validarTelefono() {

    const valorTelefono =
        telefono.value.trim();


    /* CAMPO VACÍO */

    if (valorTelefono === "") {

        mostrarError(
            telefono,
            errorTelefono,
            "Por favor, ingresa tu teléfono."
        );

        return false;
    }


    /* FORMATO DE TELÉFONO */

    if (!expresionTelefono.test(valorTelefono)) {

        mostrarError(
            telefono,
            errorTelefono,
            "Ingresa un teléfono chileno válido."
        );

        return false;
    }


    /* TELÉFONO CORRECTO */

    limpiarError(
        telefono,
        errorTelefono
    );

    return true;

}



/* =========================================================
   VALIDAR ASUNTO
========================================================= */

function validarAsunto() {

    if (asunto.value === "") {

        mostrarError(
            asunto,
            errorAsunto,
            "Selecciona el motivo de tu consulta."
        );

        return false;
    }


    limpiarError(
        asunto,
        errorAsunto
    );

    return true;

}



/* =========================================================
   VALIDAR MENSAJE
========================================================= */

function validarMensaje() {

    const valorMensaje =
        mensaje.value.trim();


    /* CAMPO VACÍO */

    if (valorMensaje === "") {

        mostrarError(
            mensaje,
            errorMensaje,
            "Por favor, escribe tu mensaje."
        );

        return false;
    }


    /* MÍNIMO DE CARACTERES */

    if (valorMensaje.length < 10) {

        mostrarError(
            mensaje,
            errorMensaje,
            "Tu mensaje debe tener al menos 10 caracteres."
        );

        return false;
    }


    /* MENSAJE CORRECTO */

    limpiarError(
        mensaje,
        errorMensaje
    );

    return true;

}



/* =========================================================
   VALIDACIÓN EN TIEMPO REAL
========================================================= */


/* NOMBRE */

nombre.addEventListener(
    "input",
    validarNombre
);


/* CORREO */

correo.addEventListener(
    "input",
    validarCorreo
);


/* TELÉFONO */

telefono.addEventListener(
    "input",
    validarTelefono
);


/* ASUNTO */

asunto.addEventListener(
    "change",
    validarAsunto
);


/* MENSAJE */

mensaje.addEventListener(
    "input",
    validarMensaje
);



/* =========================================================
   ENVIAR FORMULARIO
========================================================= */

formulario.addEventListener(
    "submit",
    function (evento) {


        /* Evita que la página se recargue */

        evento.preventDefault();


        /* Ocultar mensaje anterior */

        mensajeExito.classList.remove("mostrar");


        /* Ejecutar todas las validaciones */

        const nombreValido =
            validarNombre();

        const correoValido =
            validarCorreo();

        const telefonoValido =
            validarTelefono();

        const asuntoValido =
            validarAsunto();

        const mensajeValido =
            validarMensaje();



        /* =================================================
           SI EXISTE ALGÚN ERROR
        ================================================= */

        if (
            !nombreValido ||
            !correoValido ||
            !telefonoValido ||
            !asuntoValido ||
            !mensajeValido
        ) {

            const primerCampoError =
                formulario.querySelector(".campo-error");


            if (primerCampoError) {

                primerCampoError.focus();

            }


            return;

        }



        /* =================================================
           FORMULARIO CORRECTO
        ================================================= */

        mensajeExito.classList.add("mostrar");


        /* Limpiar formulario */

        formulario.reset();



        /* =================================================
           LIMPIAR ESTILOS DE ERROR
        ================================================= */

        limpiarError(
            nombre,
            errorNombre
        );


        limpiarError(
            correo,
            errorCorreo
        );


        limpiarError(
            telefono,
            errorTelefono
        );


        limpiarError(
            asunto,
            errorAsunto
        );


        limpiarError(
            mensaje,
            errorMensaje
        );



        /* =================================================
           OCULTAR MENSAJE DESPUÉS DE 5 SEGUNDOS
        ================================================= */

        setTimeout(
            function () {

                mensajeExito.classList.remove("mostrar");

            },
            5000
        );

    }
);