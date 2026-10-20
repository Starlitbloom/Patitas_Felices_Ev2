/* =========================================================
   PATITAS FELICES — clinico.js
   Lógica compartida de ficha-clinica.html, historial-clinico.html
   y vacunas.html. Depende de los datos definidos en mascotas.js
   (mascotas, historiales, vacunasPorMascota, obtenerMascotaPorId),
   por lo que debe cargarse DESPUÉS de mascotas.js.
========================================================= */

function obtenerIdDesdeUrl() {
    const parametros = new URLSearchParams(window.location.search);
    return parametros.get("id");
}

function initEnlaceVolverDetalle(id) {
    const enlace = document.getElementById("enlace-volver-detalle");
    if (enlace) enlace.href = `detalle-mascota.html?id=${id || ""}`;
}

function pintarCabeceraClinica(mascota) {
    const cabecera = document.getElementById("clinica-cabecera");
    if (!cabecera || !mascota) return;

    cabecera.innerHTML = `
        <img src="${mascota.imagen}" alt="${mascota.nombre}">
        <div>
            <h1>${mascota.nombre}</h1>
            <p>${mascota.especie} · ${mascota.raza} · Dueño/a: ${mascota.dueno}</p>
        </div>
    `;
}

function mostrarMascotaNoEncontrada(seccionId) {
    const seccion = document.getElementById(seccionId);
    if (!seccion) return;
    seccion.innerHTML = `
        <div class="registros-vacio">
            <h2>No encontramos esta mascota</h2>
            <p>Vuelve al listado para elegir un paciente registrado.</p>
            <br>
            <a href="mascotas.html" class="volver-listado">← Volver al listado de mascotas</a>
        </div>
    `;
}

function puedeVerMascota(mascota, sesion) {
    if (!sesion || !mascota) return false;
    return sesion.rol === "admin" || mascota.correoDueño === sesion.correo;
}

function ocultarFormularioSiNoEsAdmin(idFormulario, sesion) {
    const form = document.getElementById(idFormulario);
    if (!form) return;
    const tarjeta = form.closest(".tarjeta-formulario-clinica") || form;
    tarjeta.style.display = sesion && sesion.rol === "admin" ? "" : "none";
}


/* =========================================================
   VALIDADORES (reglas propias de los formularios clínicos)
========================================================= */

function validarRequerido(valor, maxLength, nombreCampo) {
    if (!valor || valor.trim().length === 0) return `${nombreCampo} es obligatorio.`;
    if (maxLength && valor.length > maxLength) return `${nombreCampo} no puede superar los ${maxLength} caracteres.`;
    return null;
}

function validarFecha(valor, nombreCampo) {
    if (!valor) return `${nombreCampo} es obligatoria.`;
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
   FICHA CLÍNICA (ficha-clinica.html)
========================================================= */

function crearRegistroHtml(registro) {
    return `
        <article class="registro-clinico">
            <div class="registro-fecha">${registro.fecha}</div>
            <div>
                <h3>${registro.motivo}</h3>
                <p><strong>Diagnóstico:</strong> ${registro.diagnostico}</p>
                <p><strong>Tratamiento:</strong> ${registro.tratamiento}</p>
                <p><strong>Atendido por:</strong> ${registro.veterinario}</p>
            </div>
        </article>
    `;
}

function renderizarAtencionesRecientes(id) {
    const contenedor = document.getElementById("lista-atenciones");
    if (!contenedor) return;

    const registros = historiales[id] || [];
    const recientes = registros.slice(0, 2);

    contenedor.innerHTML = recientes.length > 0
        ? recientes.map(crearRegistroHtml).join("")
        : `<p class="registros-vacio">Esta mascota aún no tiene atenciones registradas.</p>`;
}

function initFormularioFicha(id) {
    const form = document.getElementById("form-ficha-clinica");
    if (!form) return;

    form.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const errores = {
            "campo-motivo": validarRequerido(form.motivo.value, 100, "El motivo de consulta"),
            "campo-diagnostico": validarRequerido(form.diagnostico.value, 300, "El diagnóstico"),
            "campo-tratamiento": validarRequerido(form.tratamiento.value, 300, "El tratamiento"),
            "campo-veterinario": validarRequerido(form.veterinario.value, 80, "El nombre del veterinario/a"),
        };

        Object.entries(errores).forEach(([campoId, mensaje]) => marcarCampo(campoId, mensaje));

        const hayErrores = Object.values(errores).some((mensaje) => mensaje !== null);
        if (hayErrores) return;

        const hoy = new Date();
        const nuevoRegistro = {
            fecha: hoy.toLocaleDateString("es-CL", { day: "2-digit", month: "long", year: "numeric" }),
            motivo: form.motivo.value.trim(),
            diagnostico: form.diagnostico.value.trim(),
            tratamiento: form.tratamiento.value.trim(),
            veterinario: form.veterinario.value.trim(),
        };

        if (!historiales[id]) historiales[id] = [];
        historiales[id].unshift(nuevoRegistro);
        guardarHistoriales();

        renderizarAtencionesRecientes(id);
        form.reset();

        const mensajeOk = document.getElementById("mensaje-confirmacion-ficha");
        if (mensajeOk) {
            mensajeOk.classList.add("visible");
            mensajeOk.textContent = "Atención registrada correctamente en la ficha de la mascota.";
            setTimeout(() => mensajeOk.classList.remove("visible"), 4000);
        }
    });
}

function initFichaClinica() {
    const seccion = document.getElementById("seccion-ficha-clinica");
    if (!seccion) return;

    const id = obtenerIdDesdeUrl();
    const mascota = obtenerMascotaPorId(id);
    const sesion = obtenerSesionMascotas();

    if (!mascota || !puedeVerMascota(mascota, sesion)) {
        mostrarMascotaNoEncontrada("seccion-ficha-clinica");
        return;
    }

    document.title = `Ficha clínica de ${mascota.nombre} | Patitas Felices`;
    pintarCabeceraClinica(mascota);
    renderizarAtencionesRecientes(id);
    initFormularioFicha(id);
    ocultarFormularioSiNoEsAdmin("form-ficha-clinica", sesion);
}


/* =========================================================
   HISTORIAL CLÍNICO (historial-clinico.html)
========================================================= */

function initHistorialClinico() {
    const seccion = document.getElementById("seccion-historial");
    if (!seccion) return;

    const id = obtenerIdDesdeUrl();
    const mascota = obtenerMascotaPorId(id);
    const sesion = obtenerSesionMascotas();

    if (!mascota || !puedeVerMascota(mascota, sesion)) {
        mostrarMascotaNoEncontrada("seccion-historial");
        return;
    }

    document.title = `Historial clínico de ${mascota.nombre} | Patitas Felices`;
    pintarCabeceraClinica(mascota);

    const contenedor = document.getElementById("lista-historial");
    const registros = historiales[id] || [];

    contenedor.innerHTML = registros.length > 0
        ? registros.map(crearRegistroHtml).join("")
        : `<p class="registros-vacio">Esta mascota aún no tiene historial clínico registrado.</p>`;
}


/* =========================================================
   VACUNAS (vacunas.html)
========================================================= */

function textoEstadoVacuna(estado) {
    if (estado === "al-dia") return "Al día";
    if (estado === "proxima") return "Próxima a vencer";
    return "Atrasada";
}

function claseEstadoVacuna(estado) {
    if (estado === "al-dia") return "estado-al-dia";
    if (estado === "proxima") return "estado-proxima";
    return "estado-atrasada";
}

function crearRegistroVacunaHtml(registro) {
    return `
        <article class="registro-clinico">
            <div class="registro-fecha">${registro.fecha}</div>
            <div>
                <h3>${registro.vacuna} <span class="estado-badge ${claseEstadoVacuna(registro.estado)}">${textoEstadoVacuna(registro.estado)}</span></h3>
                <p><strong>Próximo refuerzo:</strong> ${registro.proximoRefuerzo}</p>
            </div>
        </article>
    `;
}

function renderizarVacunas(id) {
    const contenedor = document.getElementById("lista-vacunas");
    if (!contenedor) return;

    const registros = vacunasPorMascota[id] || [];

    contenedor.innerHTML = registros.length > 0
        ? registros.map(crearRegistroVacunaHtml).join("")
        : `<p class="registros-vacio">Esta mascota aún no tiene vacunas registradas.</p>`;
}

function initFormularioVacuna(id) {
    const form = document.getElementById("form-vacuna");
    if (!form) return;

    form.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const errores = {
            "campo-vacuna": validarRequerido(form.vacuna.value, 80, "El nombre de la vacuna"),
            "campo-fecha-vacuna": validarFecha(form.fechaVacuna.value, "La fecha de aplicación"),
            "campo-proximo-refuerzo": validarFecha(form.proximoRefuerzo.value, "La fecha del próximo refuerzo"),
        };

        Object.entries(errores).forEach(([campoId, mensaje]) => marcarCampo(campoId, mensaje));

        const hayErrores = Object.values(errores).some((mensaje) => mensaje !== null);
        if (hayErrores) return;

        const formatearFecha = (valorInput) => {
            const [anio, mes, dia] = valorInput.split("-");
            const fecha = new Date(anio, mes - 1, dia);
            return fecha.toLocaleDateString("es-CL", { day: "2-digit", month: "long", year: "numeric" });
        };

        const nuevoRegistro = {
            vacuna: form.vacuna.value.trim(),
            fecha: formatearFecha(form.fechaVacuna.value),
            proximoRefuerzo: formatearFecha(form.proximoRefuerzo.value),
            estado: "al-dia",
        };

        if (!vacunasPorMascota[id]) vacunasPorMascota[id] = [];
        vacunasPorMascota[id].unshift(nuevoRegistro);
        guardarVacunasPorMascota();

        renderizarVacunas(id);
        form.reset();

        const mensajeOk = document.getElementById("mensaje-confirmacion-vacuna");
        if (mensajeOk) {
            mensajeOk.classList.add("visible");
            mensajeOk.textContent = "Vacuna registrada correctamente en el calendario de la mascota.";
            setTimeout(() => mensajeOk.classList.remove("visible"), 4000);
        }
    });
}

function initVacunas() {
    const seccion = document.getElementById("seccion-vacunas");
    if (!seccion) return;

    const id = obtenerIdDesdeUrl();
    const mascota = obtenerMascotaPorId(id);
    const sesion = obtenerSesionMascotas();

    if (!mascota || !puedeVerMascota(mascota, sesion)) {
        mostrarMascotaNoEncontrada("seccion-vacunas");
        return;
    }

    document.title = `Vacunas de ${mascota.nombre} | Patitas Felices`;
    pintarCabeceraClinica(mascota);
    renderizarVacunas(id);
    initFormularioVacuna(id);
    ocultarFormularioSiNoEsAdmin("form-vacuna", sesion);
}


/* =========================================================
   INICIALIZACIÓN
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const id = obtenerIdDesdeUrl();
    initEnlaceVolverDetalle(id);
    initFichaClinica();
    initHistorialClinico();
    initVacunas();
});