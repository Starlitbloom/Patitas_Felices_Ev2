/* =========================================================
   PATITAS FELICES — mascotas.js
   Datos de las mascotas/pacientes y renderizado dinámico
   del catálogo (mascotas.html) y de la vista de detalle
   (detalle-mascota.html), a partir de un arreglo en JS.
========================================================= */

const mascotas = [

    {
        id: "rocky",
        nombre: "Rocky",
        especie: "Perro",
        raza: "Golden Retriever",
        edad: "3 años",
        sexo: "Macho",
        peso: "28 kg",
        dueno: "Maria Calfileo Ceballos",
        correoDueño: "ma.calfileo@duoc.cl",
        completo: true,
        imagen: "../img/golden.jpg",
        estado: "al-dia",
        estadoTexto: "Control al día",
        descripcion: "Rocky es un perro tranquilo y juguetón. Mantiene sus controles y vacunas al día, sin antecedentes de alergias conocidas."
    },

    {
        id: "luna",
        nombre: "Luna",
        especie: "Gato",
        raza: "Común europeo",
        edad: "2 años",
        sexo: "Hembra",
        peso: "4 kg",
        dueno: "Maria Calfileo Ceballos",
        correoDueño: "ma.calfileo@duoc.cl",
        completo: true,
        imagen: "../img/gataeuropea.jpg",
        estado: "pendiente",
        estadoTexto: "Vacunas pendientes",
        descripcion: "Luna es una gata independiente y curiosa. Le falta aplicarse el refuerzo anual de su calendario de vacunación."
    },

    {
        id: "max",
        nombre: "Max",
        especie: "Perro",
        raza: "Labrador",
        edad: "5 años",
        sexo: "Macho",
        peso: "32 kg",
        dueno: "Rocio Cruces",
        correoDueño: "ro.cruces@duoc.cl",
        completo: true,
        imagen: "../img/labrador.jpg",
        estado: "tratamiento",
        estadoTexto: "En tratamiento",
        descripcion: "Max se encuentra en tratamiento por una dermatitis leve. Requiere control de seguimiento en las próximas semanas."
    },

    {
        id: "michi",
        nombre: "Michi",
        especie: "Gato",
        raza: "Persa",
        edad: "1 año",
        sexo: "Hembra",
        peso: "3.2 kg",
        dueno: "Maria Calfileo Ceballos",
        correoDueño: "ma.calfileo@duoc.cl",
        completo: true,
        imagen: "../img/gatopersa.jpg",
        estado: "al-dia",
        estadoTexto: "Control al día",
        descripcion: "Michi es una gatita joven y sana. Al ser de raza persa, se recomienda vigilar su cuidado respiratorio y ocular."
    },

    {
        id: "bella",
        nombre: "Bella",
        especie: "Conejo",
        raza: "Toy enano",
        edad: "3 meses",
        sexo: "Hembra",
        peso: "1.1 kg",
        dueno: "Rocio Cruces",
        correoDueño: "ro.cruces@duoc.cl",
        completo: true,
        imagen: "../img/conejo.jpg",
        estado: "al-dia",
        estadoTexto: "Control al día",
        descripcion: "Bella es una coneja joven y sana. Al ser de raza toy enano, se recomienda vigilar su cuidado dental y digestivo."
    },

    {
        id: "nicanor",
        nombre: "Nicanor",
        especie: "Ave",
        raza: "Cacatua",
        edad: "1 año",
        sexo: "Macho",
        peso: "800 gr",
        dueno: "Rocio Cruces",
        correoDueño: "ro.cruces@duoc.cl",
        completo: true,
        imagen: "../img/Cacatua.jpg",
        estado: "al-dia",
        estadoTexto: "Control al día",
        descripcion: "Nicanor es un loro curioso y activo. No requiere vacunas dentro del protocolo actual de la clínica; se recomienda control veterinario aviar cada 6 meses."
    }

];


/* =========================================================
   HISTORIAL CLÍNICO POR MASCOTA
========================================================= */

const historiales = {

    rocky: [
        {
            fecha: "12 agosto 2026",
            motivo: "Control anual",
            diagnostico: "Paciente sano, sin hallazgos relevantes.",
            tratamiento: "Sin medicación. Se indica Condrovet forte (condroitín + glucosamina) como suplemento articular preventivo.",
            veterinario: "Dra. Paula Vidal"
        },
        {
            fecha: "03 marzo 2026",
            motivo: "Vómitos ocasionales",
            diagnostico: "Gastritis leve, probablemente alimentaria.",
            tratamiento: "Omeprazol 10mg vet cada 24h por 5 días y dieta blanda por 3 días.",
            veterinario: "Dr. Sebastian Jimenez"
        }
    ],

    luna: [
        {
            fecha: "20 julio 2026",
            motivo: "Control de rutina",
            diagnostico: "Paciente sana. Pendiente refuerzo de vacuna anual.",
            tratamiento: "Se agenda vacuna triple felina (Felocell CVR) para el próximo control.",
            veterinario: "Dra. Paula Vidal"
        }
    ],

    max: [
        {
            fecha: "28 agosto 2026",
            motivo: "Picazón y enrojecimiento en la piel",
            diagnostico: "Dermatitis alérgica leve.",
            tratamiento: "Apoquel 16mg (oclacitinib) una vez al día y shampoo Malaseb dos veces por semana durante 10 días.",
            veterinario: "Dr. Ignacio Rojas"
        },
        {
            fecha: "14 agosto 2026",
            motivo: "Chequeo previo a tratamiento",
            diagnostico: "Confirmación de irritación cutánea en zona abdominal.",
            tratamiento: "Se deriva a control dermatológico y se solicita hemograma completo.",
            veterinario: "Dra. Marta López"
        }
    ],

    michi: [
        {
            fecha: "02 junio 2026",
            motivo: "Primer control post adopción",
            diagnostico: "Cachorra sana, buen desarrollo.",
            tratamiento: "Inicio de plan de vacunación con Nobivac Rabies y desparasitación interna felina.",
            veterinario: "Dr. Eduardo Caceres"
        }
    ],

    Bella: [
        {
            fecha: "18 Agosto 2026",
            motivo: "Control dental de rutina",
            diagnostico: "Sin sobrecrecimiento dentario, buen estado general.",
            tratamiento: "Se recomienda dieta rica en fibra (heno) para desgaste natural de dientes.",
            veterinario: "Dra. Marta López"
        }
    ],

    Nicanor: [
        {
            fecha: "05 Agosto 2026",
            motivo: "Chequeo aviar general",
            diagnostico: "Ave activa, plumaje en buen estado, sin signos de enfermedad respiratoria.",
            tratamiento: "Se indica suplemento vitamínico y control en 6 meses.",
            veterinario: "Dr. Sebastian Jimenez"
        }
    ]

};


/* =========================================================
   VACUNAS POR MASCOTA
========================================================= */

const vacunasPorMascota = {

    rocky: [
        {
            vacuna: "Vacuna sextuple canina (VA002)",
            fecha: "10 enero 2026",
            proximoRefuerzo: "10 enero 2027",
            estado: "al-dia"
        },
        {
            vacuna: "Vacuna antirrábica canina (VA001)",
            fecha: "15 enero 2026",
            proximoRefuerzo: "15 enero 2027",
            estado: "al-dia"
        }
    ],

    luna: [
        {
            vacuna: "Vacuna triple felina (VA004)",
            fecha: "05 julio 2025",
            proximoRefuerzo: "05 julio 2026",
            estado: "atrasada"
        }
    ],

    max: [
        {
            vacuna: "Vacuna sextuple canina (VA002)",
            fecha: "20 mayo 2026",
            proximoRefuerzo: "20 mayo 2027",
            estado: "al-dia"
        },
        {
            vacuna: "Vacuna Bordetella canina (VA005)",
            fecha: "18 septiembre 2026",
            proximoRefuerzo: "18 septiembre 2027",
            estado: "proxima"
        }
    ],

    michi: [
        {
            vacuna: "Vacuna bivalente felina (VA003)",
            fecha: "02 junio 2026",
            proximoRefuerzo: "02 diciembre 2026",
            estado: "proxima"
        }
    ]

};


/* =========================================================
   FAVORITOS
========================================================= */

const CLAVE_FAVORITOS = "patitas-favoritos-mascotas";

function obtenerFavoritos() {

    try {

        const guardado =
            localStorage.getItem(CLAVE_FAVORITOS);

        const lista =
            guardado ? JSON.parse(guardado) : [];

        return Array.isArray(lista)
            ? lista
            : [];

    } catch (error) {

        console.error(
            "No se pudo leer los favoritos desde LocalStorage:",
            error
        );

        return [];
    }
}


function guardarFavoritos(idsFavoritos) {

    try {

        localStorage.setItem(
            CLAVE_FAVORITOS,
            JSON.stringify(idsFavoritos)
        );

    } catch (error) {

        console.error(
            "No se pudo guardar los favoritos en LocalStorage:",
            error
        );
    }
}


function esFavorito(id) {

    return obtenerFavoritos().includes(id);

}


function alternarFavorito(id) {

    const favoritos =
        obtenerFavoritos();

    const indice =
        favoritos.indexOf(id);

    if (indice === -1) {

        favoritos.push(id);

    } else {

        favoritos.splice(indice, 1);

    }

    guardarFavoritos(favoritos);

    return favoritos.includes(id);

}


/* =========================================================
   PERSISTENCIA DE MASCOTAS
========================================================= */

const CLAVE_MASCOTAS =
    "patitasFelices_mascotas";


function asegurarMascotasSeed() {

    if (
        localStorage.getItem(CLAVE_MASCOTAS) === null
    ) {

        localStorage.setItem(
            CLAVE_MASCOTAS,
            JSON.stringify(mascotas)
        );

    }

}


function cargarMascotasDesdeStorage() {

    let guardadas = [];

    try {

        guardadas =
            JSON.parse(
                localStorage.getItem(CLAVE_MASCOTAS)
            ) || [];

    } catch (error) {

        console.error(
            "No se pudieron cargar las mascotas desde LocalStorage:",
            error
        );

        guardadas = [];
    }


    if (guardadas.length > 0) {

        mascotas.length = 0;

        mascotas.push(...guardadas);

    }

}


function guardarMascotas() {

    localStorage.setItem(
        CLAVE_MASCOTAS,
        JSON.stringify(mascotas)
    );

}


/* =========================================================
   PERSISTENCIA: HISTORIAL CLÍNICO Y VACUNAS
   `historiales` y `vacunasPorMascota` son objetos { idMascota: [...] }
   definidos más arriba; se sincronizan con localStorage igual
   que `mascotas`, mutando el objeto in-place.
========================================================= */

const CLAVE_HISTORIALES = "patitasFelices_historiales";
const CLAVE_VACUNAS = "patitasFelices_vacunas";

function asegurarClinicoSeed() {
    if (localStorage.getItem(CLAVE_HISTORIALES) === null) {
        localStorage.setItem(CLAVE_HISTORIALES, JSON.stringify(historiales));
    }
    if (localStorage.getItem(CLAVE_VACUNAS) === null) {
        localStorage.setItem(CLAVE_VACUNAS, JSON.stringify(vacunasPorMascota));
    }
}

function cargarClinicoDesdeStorage() {
    try {
        const historialesGuardados = JSON.parse(localStorage.getItem(CLAVE_HISTORIALES));
        if (historialesGuardados) {
            Object.keys(historiales).forEach((k) => delete historiales[k]);
            Object.assign(historiales, historialesGuardados);
        }
    } catch (error) {
        console.error("No se pudieron cargar los historiales:", error);
    }

    try {
        const vacunasGuardadas = JSON.parse(localStorage.getItem(CLAVE_VACUNAS));
        if (vacunasGuardadas) {
            Object.keys(vacunasPorMascota).forEach((k) => delete vacunasPorMascota[k]);
            Object.assign(vacunasPorMascota, vacunasGuardadas);
        }
    } catch (error) {
        console.error("No se pudieron cargar las vacunas:", error);
    }
}

function guardarHistoriales() {
    localStorage.setItem(CLAVE_HISTORIALES, JSON.stringify(historiales));
}

function guardarVacunasPorMascota() {
    localStorage.setItem(CLAVE_VACUNAS, JSON.stringify(vacunasPorMascota));
}


/* =========================================================
   SOLICITUDES DE CAMBIO
========================================================= */

const CLAVE_SOLICITUDES_MASCOTAS =
    "patitasFelices_solicitudesMascotas";


function obtenerSolicitudesMascotas() {

    try {

        return JSON.parse(
            localStorage.getItem(
                CLAVE_SOLICITUDES_MASCOTAS
            )
        ) || [];

    } catch (error) {

        console.error(
            "No se pudieron cargar las solicitudes de mascotas:",
            error
        );

        return [];

    }

}


function guardarSolicitudesMascotas(solicitudes) {

    localStorage.setItem(
        CLAVE_SOLICITUDES_MASCOTAS,
        JSON.stringify(solicitudes)
    );

}


function crearSolicitudCambio(
    mascotaId,
    correoSolicitante,
    cambios
) {

    const solicitudes =
        obtenerSolicitudesMascotas();

    solicitudes.push({

        id: `sol-${Date.now()}`,

        mascotaId,

        correoSolicitante,

        cambios,

        estado: "pendiente",

        fechaSolicitud:
            new Date().toISOString(),

        fechaResolucion: null

    });

    guardarSolicitudesMascotas(
        solicitudes
    );

}


function aprobarSolicitud(id) {

    const solicitudes =
        obtenerSolicitudesMascotas();

    const solicitud =
        solicitudes.find(
            (s) => s.id === id
        );


    if (
        !solicitud ||
        solicitud.estado !== "pendiente"
    ) {
        return;
    }


    const mascota =
        obtenerMascotaPorId(
            solicitud.mascotaId
        );


    if (mascota) {

        Object.assign(
            mascota,
            solicitud.cambios
        );

        mascota.completo = true;

        guardarMascotas();

    }


    solicitud.estado =
        "aprobada";

    solicitud.fechaResolucion =
        new Date().toISOString();


    guardarSolicitudesMascotas(
        solicitudes
    );

}


function rechazarSolicitud(id) {

    const solicitudes =
        obtenerSolicitudesMascotas();

    const solicitud =
        solicitudes.find(
            (s) => s.id === id
        );


    if (
        !solicitud ||
        solicitud.estado !== "pendiente"
    ) {
        return;
    }


    solicitud.estado =
        "rechazada";

    solicitud.fechaResolucion =
        new Date().toISOString();


    guardarSolicitudesMascotas(
        solicitudes
    );

}


/* =========================================================
   BUSCAR MASCOTA POR ID
========================================================= */

function obtenerMascotaPorId(id) {

    return mascotas.find(
        (mascota) =>
            mascota.id === id
    ) || null;

}

function obtenerSesionMascotas() {
    try {
        return JSON.parse(localStorage.getItem("patitasFelices_sesion"));
    } catch {
        return null;
    }
}


/* =========================================================
   FORMULARIO COMPARTIDO: completar / editar mascota
   Lo usan tanto la ficha de detalle (detalle-mascota.html)
   como la tarjeta "Mis mascotas" del perfil del cliente.
========================================================= */

function redimensionarImagenMascota(archivo, ladoMaximo) {
    return new Promise((resolve, reject) => {
        const lector = new FileReader();

        lector.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                const lado = Math.min(img.width, img.height);
                const offsetX = (img.width - lado) / 2;
                const offsetY = (img.height - lado) / 2;

                const canvas = document.createElement("canvas");
                canvas.width = ladoMaximo;
                canvas.height = ladoMaximo;

                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, offsetX, offsetY, lado, lado, 0, 0, ladoMaximo, ladoMaximo);

                resolve(canvas.toDataURL("image/jpeg", 0.8));
            };

            img.onerror = reject;
            img.src = e.target.result;
        };

        lector.onerror = reject;
        lector.readAsDataURL(archivo);
    });
}

function marcarCampoMascota(id, mensajeError) {
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

function construirCamposFormularioMascota(mascota) {
    const id = mascota.id;
    return `
        <div class="campo" id="campo-raza-${id}">
            <label for="raza-${id}">Raza</label>
            <input type="text" id="raza-${id}" maxlength="40" value="${mascota.raza || ""}">
            <p class="campo__error">La raza es obligatoria.</p>
        </div>
        <div class="fila-campos">
            <div class="campo">
                <label for="sexo-${id}">Sexo</label>
                <select id="sexo-${id}">
                    <option value="" ${!mascota.sexo ? "selected" : ""}>Selecciona</option>
                    <option value="Macho" ${mascota.sexo === "Macho" ? "selected" : ""}>Macho</option>
                    <option value="Hembra" ${mascota.sexo === "Hembra" ? "selected" : ""}>Hembra</option>
                </select>
            </div>
            <div class="campo">
                <label for="peso-${id}">Peso</label>
                <input type="text" id="peso-${id}" maxlength="20" value="${mascota.peso || ""}" placeholder="Ej: 4 kg">
            </div>
        </div>
        <div class="campo">
            <label>Foto de la mascota (opcional)</label>
            <input type="hidden" id="imagen-${id}" value="${mascota.imagen || ""}">
            <div class="mascota-foto-upload">
                ${mascota.imagen
                    ? `<img src="${mascota.imagen}" alt="Foto de ${mascota.nombre}" class="mascota-foto-preview" id="preview-${id}">`
                    : `<span id="preview-${id}"></span>`}
                <button type="button" class="boton-subir-foto" data-subir-foto="${id}">Subir foto</button>
                <input type="file" id="archivo-${id}" accept="image/*" style="display:none;">
            </div>
        </div>
        <div class="campo">
            <label for="descripcion-${id}">Descripción (opcional)</label>
            <input type="text" id="descripcion-${id}" maxlength="300" value="${mascota.descripcion || ""}">
        </div>
        <button type="submit" class="boton-principal">
            <span>Guardar</span>
            <span class="flecha-boton" aria-hidden="true">⟶</span>
        </button>
    `;
}

function renderBloqueCompletarMascota(mascota) {
    const solicitudPendiente = obtenerSolicitudesMascotas()
        .find((s) => s.mascotaId === mascota.id && s.estado === "pendiente");

    let aviso = "";
    let boton = "";

    if (solicitudPendiente) {
        aviso = `<p class="alerta-mascota alerta-mascota--info">🕒 Cambios enviados, pendiente de aprobación.</p>`;
    } else if (!mascota.completo) {
        aviso = `<p class="alerta-mascota">⚠️ Datos incompletos.</p>`;
        boton = `<a href="#" class="enlace-completar" data-toggle-mascota="${mascota.id}">Completar datos →</a>`;
    } else {
        boton = `<a href="#" class="enlace-completar" data-toggle-mascota="${mascota.id}">Editar →</a>`;
    }

    return `
        ${aviso}
        ${boton}
        <form class="formulario-mascota" data-mascota-id="${mascota.id}" style="display:none;" novalidate>
            ${construirCamposFormularioMascota(mascota)}
        </form>
    `;
}

function initAccionesFormularioMascota(contenedor, sesion, alGuardar) {
    if (!contenedor) return;

    contenedor.addEventListener("click", (e) => {
        const toggle = e.target.closest("[data-toggle-mascota]");
        if (toggle) {
            e.preventDefault();
            const form = contenedor.querySelector(`form[data-mascota-id="${toggle.dataset.toggleMascota}"]`);
            if (form) form.style.display = form.style.display === "none" ? "block" : "none";
            return;
        }

        const botonSubir = e.target.closest("[data-subir-foto]");
        if (botonSubir) {
            e.preventDefault();
            const archivo = contenedor.querySelector(`#archivo-${botonSubir.dataset.subirFoto}`);
            if (archivo) archivo.click();
        }
    });

    contenedor.addEventListener("change", (e) => {
        const archivoInput = e.target.closest('input[type="file"]');
        if (!archivoInput || !archivoInput.id.startsWith("archivo-")) return;

        const id = archivoInput.id.replace("archivo-", "");
        const archivo = archivoInput.files[0];
        if (!archivo) return;

        if (!archivo.type.startsWith("image/")) {
            alert("Selecciona un archivo de imagen.");
            return;
        }

        redimensionarImagenMascota(archivo, 300).then((base64) => {
            document.getElementById(`imagen-${id}`).value = base64;
            const preview = document.getElementById(`preview-${id}`);
            if (preview) preview.outerHTML = `<img src="${base64}" alt="Foto" class="mascota-foto-preview" id="preview-${id}">`;
        }).catch(() => alert("No se pudo procesar la imagen."));
    });

    contenedor.addEventListener("submit", (e) => {
        const form = e.target.closest("form[data-mascota-id]");
        if (!form) return;
        e.preventDefault();

        const id = form.dataset.mascotaId;
        const raza = document.getElementById(`raza-${id}`).value.trim();
        const sexo = document.getElementById(`sexo-${id}`).value;
        const peso = document.getElementById(`peso-${id}`).value.trim();
        const imagen = document.getElementById(`imagen-${id}`).value;
        const descripcion = document.getElementById(`descripcion-${id}`).value.trim();

        const errorRaza = raza ? null : "La raza es obligatoria.";
        marcarCampoMascota(`campo-raza-${id}`, errorRaza);
        if (errorRaza) return;

        const cambios = { raza, sexo, peso, imagen, descripcion };
        const mascota = obtenerMascotaPorId(id);

        if (mascota && !mascota.completo) {
            Object.assign(mascota, cambios);
            mascota.completo = true;
            guardarMascotas();
        } else if (mascota) {
            crearSolicitudCambio(id, sesion.correo, cambios);
        }

        alGuardar();
    });
}


/* =========================================================
   CREAR TARJETA DE MASCOTA
========================================================= */

function crearTarjetaMascota(mascota) {

    const claseEstado =

        mascota.estado === "al-dia"
            ? "estado-al-dia"

        : mascota.estado === "tratamiento"
            ? "estado-tratamiento"

        : "estado-pendiente";


    const favorita =
        esFavorito(mascota.id);


    return `

        <article class="tarjeta-mascota">

            <div class="tarjeta-mascota-imagen">

                <span class="estado-badge ${claseEstado}">
                    ${mascota.estadoTexto}
                </span>


                <button
                    type="button"

                    class="boton-favorito ${favorita ? "activo" : ""}"

                    data-id="${mascota.id}"

                    aria-pressed="${favorita}"

                    aria-label="${
                        favorita
                            ? "Quitar de favoritos"
                            : "Agregar a favoritos"
                    }"
                >
                    ${favorita ? "♥" : "♡"}
                </button>


                <img
                    src="${mascota.imagen}"
                    alt="${mascota.nombre}, ${mascota.especie.toLowerCase()}"
                >

            </div>
            ${!mascota.completo ? `<div class="alerta-incompleta">⚠️ Datos incompletos — <a href="detalle-mascota.html?id=${mascota.id}">completar ficha →</a></div>` : ""}
            <div class="tarjeta-mascota-contenido">
                <h3>${mascota.nombre}</h3>
                <p class="raza-especie">${mascota.especie}${mascota.raza ? " · " + mascota.raza : ""}</p>
                <p class="dueno">Dueño/a: ${mascota.dueno}</p>
                <a href="detalle-mascota.html?id=${mascota.id}">Ver ficha completa →</a>
            </div>

        </article>

    `;

}


/* =========================================================
   RENDERIZAR CATÁLOGO
========================================================= */

function renderizarCatalogo(especieFiltro) {

    const contenedor =
        document.getElementById(
            "grid-mascotas"
        );


    if (!contenedor) {
        return;
    }


    const sesion =
        obtenerSesionMascotas();

    const mascotasDelUsuario =
        sesion && sesion.correo
            ? mascotas.filter(
                (mascota) =>
                    mascota.correoDueño &&
                    mascota.correoDueño.toLowerCase() ===
                        sesion.correo.toLowerCase()
              )
            : [];


    let lista =
        mascotasDelUsuario;


    if (especieFiltro === "favoritos") {

        const favoritos =
            obtenerFavoritos();


        lista =
            mascotasDelUsuario.filter(
                (mascota) =>
                    favoritos.includes(
                        mascota.id
                    )
            );

    } else if (
        especieFiltro &&
        especieFiltro !== "todas"
    ) {

        lista =
            mascotasDelUsuario.filter(
                (mascota) =>
                    mascota.especie ===
                    especieFiltro
            );

    }


    if (lista.length === 0) {

        const mensaje =

            especieFiltro === "favoritos"

                ? "Aún no has marcado mascotas como favoritas. Usa el corazón ♡ en cada tarjeta."

                : "No hay mascotas registradas para este filtro.";


        contenedor.innerHTML =
            `<p class="grid-mascotas-vacio">${mensaje}</p>`;

        return;

    }


    contenedor.innerHTML =
        lista
            .map(crearTarjetaMascota)
            .join("");

}


/* =========================================================
   FILTROS
========================================================= */

let filtroActivoMascotas =
    "todas";


function initFiltrosMascotas() {

    const filtros =
        document.querySelectorAll(
            ".filtro-especie"
        );


    if (filtros.length === 0) {
        return;
    }


    filtros.forEach(
        (boton) => {

            boton.addEventListener(
                "click",
                () => {

                    filtros.forEach(
                        (filtro) =>
                            filtro.classList.remove(
                                "activo"
                            )
                    );


                    boton.classList.add(
                        "activo"
                    );


                    filtroActivoMascotas =
                        boton.dataset.especie;


                    renderizarCatalogo(
                        filtroActivoMascotas
                    );

                }
            );

        }
    );

}


/* =========================================================
   BOTONES DE FAVORITO EN EL CATÁLOGO
========================================================= */

function initBotonesFavorito() {

    const contenedor =
        document.getElementById(
            "grid-mascotas"
        );


    if (!contenedor) {
        return;
    }


    contenedor.addEventListener(
        "click",
        (evento) => {

            const boton =
                evento.target.closest(
                    ".boton-favorito"
                );


            if (!boton) {
                return;
            }


            const id =
                boton.dataset.id;


            const ahoraEsFavorita =
                alternarFavorito(id);


            boton.classList.toggle(
                "activo",
                ahoraEsFavorita
            );


            boton.textContent =
                ahoraEsFavorita
                    ? "♥"
                    : "♡";


            boton.setAttribute(
                "aria-pressed",
                String(ahoraEsFavorita)
            );


            boton.setAttribute(

                "aria-label",

                ahoraEsFavorita
                    ? "Quitar de favoritos"
                    : "Agregar a favoritos"

            );


            if (
                filtroActivoMascotas ===
                "favoritos"
            ) {

                renderizarCatalogo(
                    "favoritos"
                );

            }

        }
    );

}


/* =========================================================
   RENDERIZAR DETALLE DE MASCOTA
========================================================= */

function renderizarDetalleMascota() {

    const contenedor =
        document.getElementById(
            "detalle-mascota"
        );


    if (!contenedor) {
        return;
    }


    const parametros =
        new URLSearchParams(
            window.location.search
        );


    const id =
        parametros.get("id");


    const mascota =
        obtenerMascotaPorId(id);


    if (!mascota) {

        contenedor.innerHTML = `

            <div class="mascota-no-encontrada">

                <h2>
                    No encontramos esta mascota
                </h2>

                <p>
                    Vuelve al listado para elegir un paciente registrado.
                </p>

                <br>

                <a
                    href="mascotas.html"
                    class="volver-listado"
                >
                    ← Volver al listado de mascotas
                </a>

            </div>

        `;


        document.title =
            "Mascota no encontrada | Patitas Felices";

        return;

    }


    const claseEstado =

        mascota.estado === "al-dia"

            ? "estado-al-dia"

        : mascota.estado === "tratamiento"

            ? "estado-tratamiento"

        : "estado-pendiente";


    document.title =
        `${mascota.nombre} | Patitas Felices`;


    const favorita =
        esFavorito(mascota.id);


    contenedor.innerHTML = `

        <a
            href="mascotas.html"
            class="volver-listado"
        >
            ← Volver al listado de mascotas
        </a>


        <div class="detalle-mascota-cabecera">


            <div class="detalle-mascota-imagen">

                <img
                    src="${mascota.imagen}"
                    alt="${mascota.nombre}, ${mascota.especie.toLowerCase()}"
                >

            </div>


            <div class="detalle-mascota-info">


                <div class="detalle-mascota-titulo-fila">

                    <h1>
                        ${mascota.nombre}
                    </h1>


                    <button
                        type="button"

                        class="
                            boton-favorito
                            boton-favorito-detalle
                            ${favorita ? "activo" : ""}
                        "

                        id="boton-favorito-detalle"

                        data-id="${mascota.id}"

                        aria-pressed="${favorita}"

                        aria-label="${
                            favorita
                                ? "Quitar de favoritos"
                                : "Agregar a favoritos"
                        }"
                    >

                        ${
                            favorita
                                ? "★ En favoritos"
                                : "☆ Agregar a favoritos"
                        }

                    </button>

                </div>
                <p class="raza-especie">${mascota.especie}${mascota.raza ? " · " + mascota.raza : ""}</p>
                <span class="estado-badge ${claseEstado}">${mascota.estadoTexto}</span>

                <ul class="lista-datos">
                    <li><strong>Edad</strong>${mascota.edad}</li>
                    <li><strong>Sexo</strong>${mascota.sexo || "No especificado"}</li>
                    <li><strong>Peso</strong>${mascota.peso || "No especificado"}</li>
                    <li><strong>Dueño/a</strong>${mascota.dueno}</li>
                </ul>

                <p class="detalle-mascota-descripcion">${mascota.descripcion}</p>

                <div id="detalle-mascota-completar">
                    ${renderBloqueCompletarMascota(mascota)}
                </div>
            </div>

        </div>


        <div class="accesos-clinicos">


            <a
                href="ficha-clinica.html?id=${mascota.id}"
                class="acceso-clinico"
            >

                <span class="icono-acceso">

                    <img
                        src="../img/icono-ficha-clinica.png"
                        alt="Ficha clínica"
                    >

                </span>


                <h3>
                    Ficha clínica
                </h3>


                <p>
                    Datos generales y registro de nuevas atenciones.
                </p>


                <span class="flecha">
                    Ir a la ficha →
                </span>

            </a>


            <a
                href="historial-clinico.html?id=${mascota.id}"
                class="acceso-clinico"
            >

                <span class="icono-acceso">

                    <img
                        src="../img/icono-historial-clinico.png"
                        alt="Historial clínico"
                    >

                </span>


                <h3>
                    Historial clínico
                </h3>


                <p>
                    Consultas y tratamientos anteriores.
                </p>


                <span class="flecha">
                    Ver historial →
                </span>

            </a>


            <a
                href="vacunas.html?id=${mascota.id}"
                class="acceso-clinico"
            >

                <span class="icono-acceso">

                    <img
                        src="../img/icono-vacunas.png"
                        alt="Vacunas"
                    >

                </span>


                <h3>
                    Vacunas
                </h3>


                <p>
                    Calendario de vacunación y refuerzos.
                </p>


                <span class="flecha">
                    Ver vacunas →
                </span>

            </a>

        </div>

    `;


/* =========================================================
   FAVORITO EN DETALLE
========================================================= */

    const botonFavoritoDetalle =
        document.getElementById(
            "boton-favorito-detalle"
        );


    if (botonFavoritoDetalle) {

        botonFavoritoDetalle.addEventListener(
            "click",
            () => {

                const ahoraEsFavorita =
                    alternarFavorito(
                        mascota.id
                    );


                botonFavoritoDetalle
                    .classList
                    .toggle(
                        "activo",
                        ahoraEsFavorita
                    );


                botonFavoritoDetalle.textContent =

                    ahoraEsFavorita

                        ? "★ En favoritos"

                        : "☆ Agregar a favoritos";


                botonFavoritoDetalle.setAttribute(
                    "aria-pressed",
                    String(ahoraEsFavorita)
                );


                botonFavoritoDetalle.setAttribute(

                    "aria-label",

                    ahoraEsFavorita

                        ? "Quitar de favoritos"

                        : "Agregar a favoritos"

                );

            }
        );

    }

    const contenedorCompletar = document.getElementById("detalle-mascota-completar");
    initAccionesFormularioMascota(contenedorCompletar, sesion, () => {
        renderizarDetalleMascota();
    });
}


/* =========================================================
   VISOR AMPLIADO DE INFOGRAFÍAS (lightbox)
   Al hacer clic en una imagen de "Cuidados básicos" se muestra
   ampliada; se cierra con el botón, la tecla Escape o clic fuera.
========================================================= */

function initVisorInfografias() {

    const visor =
        document.getElementById("visor-infografia");

    const imagenVisor =
        document.getElementById("visor-infografia-imagen");

    const botonCerrar =
        document.getElementById("visor-infografia-cerrar");

    const imagenes =
        document.querySelectorAll(".img-cuidados");

    if (!visor || !imagenVisor || imagenes.length === 0) {
        return;
    }

    function abrirVisor(imagen) {
        imagenVisor.src = imagen.src;
        imagenVisor.alt = imagen.alt;
        visor.classList.add("visor-infografia--abierto");
    }

    function cerrarVisor() {
        visor.classList.remove("visor-infografia--abierto");
        imagenVisor.src = "";
    }

    imagenes.forEach((imagen) => {
        imagen.addEventListener("click", () => abrirVisor(imagen));
    });

    if (botonCerrar) {
        botonCerrar.addEventListener("click", cerrarVisor);
    }

    visor.addEventListener("click", (evento) => {
        if (evento.target === visor) {
            cerrarVisor();
        }
    });

    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape") {
            cerrarVisor();
        }
    });
}


/* =========================================================
   INICIALIZACIÓN
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    asegurarMascotasSeed();
    cargarMascotasDesdeStorage();

        const requiereSesion =
            document.getElementById("grid-mascotas") ||
            document.getElementById("detalle-mascota");

        if (
            requiereSesion &&
            !obtenerSesionMascotas()
        ) {
            window.location.href = "login.html";
            return;
        }

        renderizarCatalogo(
            "todas"
        );

        initFiltrosMascotas();

        initBotonesFavorito();

        initVisorInfografias();

        renderizarDetalleMascota();

    }
);