/* =========================================================
   PATITAS FELICES — admin-mascotas.js
========================================================= */

let idEnEdicion = null;

const IMAGEN_GENERICA = "../img/cuidado.png";

/* Redimensiona la imagen elegida a un ancho máximo antes de convertirla a base64, */
/* para no llenar el localStorage con fotos pesadas sin comprimir */
function redimensionarImagen(archivo, anchoMaximo) {
    return new Promise((resolve, reject) => {
        const lector = new FileReader();
        lector.onerror = reject;
        lector.onload = () => {
            const img = new Image();
            img.onerror = reject;
            img.onload = () => {
                const escala = Math.min(1, anchoMaximo / img.width);
                const canvas = document.createElement("canvas");
                canvas.width = img.width * escala;
                canvas.height = img.height * escala;
                canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL("image/jpeg", 0.82));
            };
            img.src = lector.result;
        };
        lector.readAsDataURL(archivo);
    });
}

function validarRequerido(valor, maxLength, nombreCampo) {
    if (!valor || valor.trim().length === 0) return `${nombreCampo} es obligatorio.`;
    if (maxLength && valor.length > maxLength) return `${nombreCampo} no puede superar los ${maxLength} caracteres.`;
    return null;
}

function marcarCampo(id, mensajeError) {
    const campo = document.getElementById(id);
    if (!campo) return;
    const errorEl = campo.querySelector(".campo__error");
    campo.classList.remove("campo--invalido", "campo--valido");
    if (mensajeError) {
        campo.classList.add("campo--invalido");
        if (errorEl) errorEl.textContent = mensajeError;
    } else {
        campo.classList.add("campo--valido");
    }
}


/* =========================================================
   TABLA
========================================================= */

function claseEstado(estado) {
    if (estado === "al-dia") return "admin-badge--activo";
    if (estado === "tratamiento") return "admin-badge--tratamiento";
    return "admin-badge--pendiente";
}

function crearFilaMascota(mascota) {
    return `
        <tr data-id="${mascota.id}">
            <td><img src="${mascota.imagen}" alt="${mascota.nombre}">${mascota.nombre}</td>
            <td>${mascota.especie}</td>
            <td>${mascota.raza}</td>
            <td>${mascota.dueno}</td>
            <td><span class="admin-badge ${claseEstado(mascota.estado)}">${mascota.estadoTexto}</span></td>
            <td>
                <div class="admin-acciones-fila">
                    <button type="button" class="admin-btn-accion admin-btn-accion--editar" data-accion="editar" data-id="${mascota.id}">Editar</button>
                    <button type="button" class="admin-btn-accion admin-btn-accion--eliminar" data-accion="eliminar" data-id="${mascota.id}">Eliminar</button>
                </div>
            </td>
        </tr>
    `;
}

function renderizarTablaMascotas() {
    const cuerpoTabla = document.getElementById("cuerpo-tabla-mascotas");
    if (!cuerpoTabla) return;

    if (mascotas.length === 0) {
        cuerpoTabla.innerHTML = `<tr><td colspan="6" style="text-align:center; color:rgba(255,255,255,0.5);">No hay mascotas registradas.</td></tr>`;
        return;
    }

    cuerpoTabla.innerHTML = mascotas.map(crearFilaMascota).join("");
}


/* =========================================================
   FORMULARIO (crear / editar)
========================================================= */

function mostrarFormulario(mascota) {
    const modalFondo = document.getElementById("modal-mascota-fondo");
    const titulo = document.getElementById("titulo-formulario-mascota");
    const form = document.getElementById("form-mascota");
    const vistaPrevia = document.getElementById("imagen-vista-previa");
    if (!modalFondo || !form) return;

    form.reset();
    ["campo-nombre-m", "campo-especie-m", "campo-raza-m", "campo-edad-m", "campo-dueno-m", "campo-estado-m"]
        .forEach((id) => marcarCampo(id, null));

    if (mascota) {
        idEnEdicion = mascota.id;
        titulo.textContent = `Editar a ${mascota.nombre}`;
        form.nombre.value = mascota.nombre;
        form.especie.value = mascota.especie;
        form.raza.value = mascota.raza;
        form.edad.value = mascota.edad;
        form.dueno.value = mascota.dueno;
        form.estado.value = mascota.estado;
        form.imagen.value = mascota.imagen || "";
        // Si la foto es un archivo subido (data URL), no tiene sentido mostrar ese texto
        // enorme en el campo de URL: se deja vacío y la vista previa basta para confirmarla
        form.querySelector("#imagen-url").value = (mascota.imagen || "").startsWith("data:") ? "" : (mascota.imagen || "");
    } else {
        idEnEdicion = null;
        titulo.textContent = "Registrar nueva mascota";
    }

    if (vistaPrevia) vistaPrevia.src = form.imagen.value || IMAGEN_GENERICA;

    modalFondo.style.display = "flex";
}

function ocultarFormulario() {
    const modalFondo = document.getElementById("modal-mascota-fondo");
    if (modalFondo) modalFondo.style.display = "none";
    idEnEdicion = null;
}

function textoEstado(valor) {
    if (valor === "al-dia") return "Control al día";
    if (valor === "tratamiento") return "En tratamiento";
    return "Vacunas pendientes";
}

function initFormularioMascota() {
    const form = document.getElementById("form-mascota");
    if (!form) return;

    form.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const errores = {
            "campo-nombre-m": validarRequerido(form.nombre.value, 40, "El nombre"),
            "campo-especie-m": validarRequerido(form.especie.value, 30, "La especie"),
            "campo-raza-m": validarRequerido(form.raza.value, 40, "La raza"),
            "campo-edad-m": validarRequerido(form.edad.value, 20, "La edad"),
            "campo-dueno-m": validarRequerido(form.dueno.value, 60, "El nombre del dueño/a"),
            "campo-estado-m": validarRequerido(form.estado.value, null, "El estado"),
        };

        Object.entries(errores).forEach(([campoId, mensaje]) => marcarCampo(campoId, mensaje));

        const hayErrores = Object.values(errores).some((mensaje) => mensaje !== null);
        if (hayErrores) return;

        if (idEnEdicion) {
            const mascota = obtenerMascotaPorId(idEnEdicion);
            if (mascota) {
                mascota.nombre = form.nombre.value.trim();
                mascota.especie = form.especie.value.trim();
                mascota.raza = form.raza.value.trim();
                mascota.edad = form.edad.value.trim();
                mascota.dueno = form.dueno.value.trim();
                mascota.estado = form.estado.value;
                mascota.estadoTexto = textoEstado(form.estado.value);
                mascota.imagen = form.imagen.value.trim() || IMAGEN_GENERICA;
            }
        } else {
            const nuevoId = form.nombre.value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "-") + "-" + Date.now();
            mascotas.push({
                id: nuevoId,
                nombre: form.nombre.value.trim(),
                especie: form.especie.value.trim(),
                raza: form.raza.value.trim(),
                edad: form.edad.value.trim(),
                sexo: "No especificado",
                peso: "No especificado",
                dueno: form.dueno.value.trim(),
                imagen: form.imagen.value.trim() || IMAGEN_GENERICA,
                estado: form.estado.value,
                estadoTexto: textoEstado(form.estado.value),
                descripcion: "Ficha creada desde el mantenedor administrativo.",
                completo: true
            });
        }

        guardarMascotas();
        renderizarTablaMascotas();
        ocultarFormulario();
    });

    const inputArchivo = document.getElementById("imagen-archivo");
    const inputUrl = document.getElementById("imagen-url");
    const vistaPrevia = document.getElementById("imagen-vista-previa");

    if (inputArchivo) {
        inputArchivo.addEventListener("change", async () => {
            const archivo = inputArchivo.files[0];
            if (!archivo) return;

            try {
                const dataUrl = await redimensionarImagen(archivo, 500);
                form.imagen.value = dataUrl;
                if (inputUrl) inputUrl.value = "";
                if (vistaPrevia) vistaPrevia.src = dataUrl;
            } catch {
                window.alert("No se pudo leer la imagen seleccionada.");
            }
        });
    }

    if (inputUrl && vistaPrevia) {
        inputUrl.addEventListener("input", () => {
            inputArchivo.value = "";
            form.imagen.value = inputUrl.value.trim();
            vistaPrevia.src = form.imagen.value || IMAGEN_GENERICA;
        });
        vistaPrevia.addEventListener("error", () => {
            vistaPrevia.src = IMAGEN_GENERICA;
        });
    }

    const botonCancelar = document.getElementById("boton-cancelar-mascota");
    if (botonCancelar) botonCancelar.addEventListener("click", ocultarFormulario);

    const botonCerrar = document.getElementById("modal-mascota-cerrar");
    if (botonCerrar) botonCerrar.addEventListener("click", ocultarFormulario);

    const modalFondo = document.getElementById("modal-mascota-fondo");
    if (modalFondo) {
        modalFondo.addEventListener("click", (evento) => {
            if (evento.target === modalFondo) ocultarFormulario();
        });
    }
}


/* =========================================================
   SOLICITUDES DE CAMBIO PENDIENTES
========================================================= */

function formatearCambios(cambios) {
    return Object.entries(cambios)
        .filter(([, valor]) => valor)
        .map(([campo, valor]) => `<strong>${campo}:</strong> ${valor}`)
        .join('<br>');
}

function crearFilaSolicitud(solicitud) {
    const mascota = obtenerMascotaPorId(solicitud.mascotaId);
    return `
        <tr data-id="${solicitud.id}">
            <td>${mascota ? mascota.nombre : solicitud.mascotaId}</td>
            <td>${solicitud.correoSolicitante}</td>
            <td>${formatearCambios(solicitud.cambios)}</td>
            <td>${new Date(solicitud.fechaSolicitud).toLocaleDateString('es-CL')}</td>
            <td>
                <div class="admin-acciones-fila">
                    <button type="button" class="admin-btn-accion admin-btn-accion--editar" data-accion="aprobar-solicitud" data-id="${solicitud.id}">Aprobar</button>
                    <button type="button" class="admin-btn-accion admin-btn-accion--eliminar" data-accion="rechazar-solicitud" data-id="${solicitud.id}">Rechazar</button>
                </div>
            </td>
        </tr>
    `;
}

function renderizarTablaSolicitudes() {
    const cuerpoTabla = document.getElementById("cuerpo-tabla-solicitudes-mascotas");
    if (!cuerpoTabla) return;

    const pendientes = obtenerSolicitudesMascotas().filter((s) => s.estado === "pendiente");

    if (pendientes.length === 0) {
        cuerpoTabla.innerHTML = `<tr><td colspan="5" style="text-align:center; color:rgba(255,255,255,0.5);">No hay solicitudes pendientes.</td></tr>`;
        return;
    }

    cuerpoTabla.innerHTML = pendientes.map(crearFilaSolicitud).join("");
}

function initAccionesTablaSolicitudes() {
    const cuerpoTabla = document.getElementById("cuerpo-tabla-solicitudes-mascotas");
    if (!cuerpoTabla) return;

    cuerpoTabla.addEventListener("click", (evento) => {
        const boton = evento.target.closest("button[data-accion]");
        if (!boton) return;

        const id = boton.dataset.id;

        if (boton.dataset.accion === "aprobar-solicitud") {
            aprobarSolicitud(id);
            renderizarTablaMascotas();
            renderizarTablaSolicitudes();
        }

        if (boton.dataset.accion === "rechazar-solicitud") {
            const confirmar = window.confirm("¿Rechazar esta solicitud de cambio?");
            if (!confirmar) return;
            rechazarSolicitud(id);
            renderizarTablaSolicitudes();
        }
    });
}


/* =========================================================
   ACCIONES DE TABLA (editar / eliminar)
========================================================= */

function initAccionesTabla() {
    const cuerpoTabla = document.getElementById("cuerpo-tabla-mascotas");
    if (!cuerpoTabla) return;

    cuerpoTabla.addEventListener("click", (evento) => {
        const boton = evento.target.closest("button[data-accion]");
        if (!boton) return;

        const id = boton.dataset.id;

        if (boton.dataset.accion === "editar") {
            mostrarFormulario(obtenerMascotaPorId(id));
        }

        if (boton.dataset.accion === "eliminar") {
            const mascota = obtenerMascotaPorId(id);
            const confirmar = window.confirm(`¿Eliminar a ${mascota ? mascota.nombre : "esta mascota"} del listado?`);
            if (!confirmar) return;

            const indice = mascotas.findIndex((m) => m.id === id);
            if (indice !== -1) mascotas.splice(indice, 1);
            guardarMascotas();
            renderizarTablaMascotas();
        }
    });
}


/* =========================================================
   INICIALIZACIÓN
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const tabla = document.getElementById("cuerpo-tabla-mascotas");
    if (!tabla) return;

    renderizarTablaMascotas();
    initFormularioMascota();
    initAccionesTabla();

    renderizarTablaSolicitudes();
    initAccionesTablaSolicitudes();

    const botonNuevo = document.getElementById("boton-nueva-mascota");
    if (botonNuevo) botonNuevo.addEventListener("click", () => mostrarFormulario(null));
});