/* =========================================================
   PATITAS FELICES — usuarios.js
   Validaciones de login, registro y perfil, según las reglas
   del caso (correo con dominio permitido, RUN con dígito
   verificador, contraseña 4-10 caract., región/comuna
   dependientes) + persistencia con localStorage.
========================================================= */

// Dominios de correo aceptados en registro/edición de perfil
const DOMINIOS_PERMITIDOS = ['duoc.cl', 'profesor.duoc.cl', 'gmail.com'];

// Claves usadas en localStorage para persistir usuarios y la sesión activa
const CLAVE_USUARIOS = 'patitasFelices_usuarios';
const CLAVE_SESION = 'patitasFelices_sesion';

// Catálogo completo de regiones y comunas de Chile, usado para poblar
// los <select> dependientes de región/comuna en registro, perfil y admin
const REGIONES = [
    { nombre: "Arica y Parinacota", comunas: ["Arica", "Camarones", "Putre", "General Lagos"] },
    { nombre: "Tarapacá", comunas: ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"] },
    { nombre: "Antofagasta", comunas: ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"] },
    { nombre: "Atacama", comunas: ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Alto del Carmen", "Freirina", "Huasco"] },
    { nombre: "Coquimbo", comunas: ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paiguano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"] },
    { nombre: "Valparaíso", comunas: ["Valparaíso", "Casablanca", "Concón", "Juan Fernández", "Puchuncaví", "Quintero", "Viña del Mar", "Isla de Pascua", "Los Andes", "Calle Larga", "Rinconada", "San Esteban", "La Ligua", "Cabildo", "Papudo", "Petorca", "Zapallar", "Quillota", "La Calera", "Hijuelas", "La Cruz", "Nogales", "San Antonio", "Algarrobo", "Cartagena", "El Quisco", "El Tabo", "Santo Domingo", "San Felipe", "Catemu", "Llaillay", "Panquehue", "Putaendo", "Santa María", "Quilpué", "Limache", "Olmué", "Villa Alemana"] },
    { nombre: "Región Metropolitana de Santiago", comunas: ["Santiago", "Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "San Joaquín", "San Miguel", "San Ramón", "Vitacura", "Puente Alto", "Pirque", "San José de Maipo", "Colina", "Lampa", "Til Til", "San Bernardo", "Buin", "Calera de Tango", "Paine", "Melipilla", "Alhué", "Curacaví", "María Pinto", "San Pedro", "Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor"] },
    { nombre: "Región del Libertador General Bernardo O'Higgins", comunas: ["Rancagua", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Peumo", "Pichidegua", "Quinta de Tilcoco", "Rengo", "Requínoa", "San Vicente", "Pichilemu", "La Estrella", "Litueche", "Marchihue", "Navidad", "Paredones", "San Fernando", "Chépica", "Chimbarongo", "Lolol", "Nancagua", "Palmilla", "Peralillo", "Placilla", "Pumanque", "Santa Cruz"] },
    { nombre: "Maule", comunas: ["Talca", "Constitución", "Curepto", "Empedrado", "Maule", "Pelarco", "Pencahue", "Río Claro", "San Clemente", "San Rafael", "Cauquenes", "Chanco", "Pelluhue", "Curicó", "Hualañé", "Licantén", "Molina", "Rauco", "Romeral", "Sagrada Familia", "Teno", "Vichuquén", "Linares", "Colbún", "Longaví", "Parral", "Retiro", "San Javier", "Villa Alegre", "Yerbas Buenas"] },
    { nombre: "Región de Ñuble", comunas: ["Chillán", "Bulnes", "Chillán Viejo", "El Carmen", "Pemuco", "Pinto", "Quillón", "San Ignacio", "Yungay", "Cobquecura", "Coelemu", "Ninhue", "Portezuelo", "Quirihue", "Ránquil", "Treguaco", "San Carlos", "Coihueco", "Ñiquén", "San Fabián", "San Nicolás"] },
    { nombre: "Biobío", comunas: ["Concepción", "Coronel", "Chiguayante", "Florida", "Hualqui", "Lota", "Penco", "San Pedro de la Paz", "Santa Juana", "Talcahuano", "Tomé", "Hualpén", "Lebu", "Arauco", "Cañete", "Contulmo", "Curanilahue", "Los Álamos", "Tirúa", "Los Ángeles", "Antuco", "Cabrero", "Laja", "Mulchén", "Nacimiento", "Negrete", "Quilaco", "Quilleco", "San Rosendo", "Santa Bárbara", "Tucapel", "Yumbel", "Alto Biobío"] },
    { nombre: "La Araucanía", comunas: ["Temuco", "Carahue", "Cunco", "Curarrehue", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial", "Padre las Casas", "Perquenco", "Pitrufquén", "Pucón", "Saavedra", "Teodoro Schmidt", "Toltén", "Vilcún", "Villarrica", "Cholchol", "Angol", "Collipulli", "Curacautín", "Ercilla", "Lonquimay", "Los Sauces", "Lumaco", "Purén", "Renaico", "Traiguén", "Victoria"] },
    { nombre: "Los Ríos", comunas: ["Valdivia", "Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "La Unión", "Futrono", "Lago Ranco", "Río Bueno"] },
    { nombre: "Los Lagos", comunas: ["Puerto Montt", "Calbuco", "Cochamó", "Fresia", "Frutillar", "Los Muermos", "Llanquihue", "Maullín", "Puerto Varas", "Castro", "Ancud", "Chonchi", "Curaco de Vélez", "Dalcahue", "Puqueldón", "Queilén", "Quellón", "Quemchi", "Quinchao", "Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro", "San Juan de la Costa", "San Pablo", "Chaitén", "Futaleufú", "Hualaihué", "Palena"] },
    { nombre: "Aysén del General Carlos Ibáñez del Campo", comunas: ["Coyhaique", "Lago Verde", "Aysén", "Cisnes", "Guaitecas", "Cochrane", "O'Higgins", "Tortel", "Chile Chico", "Río Ibáñez"] },
    { nombre: "Magallanes y de la Antártica Chilena", comunas: ["Punta Arenas", "Laguna Blanca", "Río Verde", "San Gregorio", "Cabo de Hornos", "Antártica", "Porvenir", "Primavera", "Timaukel", "Natales", "Torres del Paine"] }
];

/* =========================================================
   ALMACENAMIENTO (localStorage)
========================================================= */

/**
 * Lee y parsea el array completo de usuarios desde localStorage.
 * Si la clave no existe o el JSON está corrupto, devuelve [] en vez
 * de romper cualquier página que dependa de esta función.
 */
function obtenerUsuarios() {
    try {
        return JSON.parse(localStorage.getItem(CLAVE_USUARIOS)) || [];
    } catch {
        return [];
    }
}

function guardarUsuarios(usuarios) {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

/**
 * Busca un usuario por correo, sin distinguir mayúsculas/minúsculas
 * (para que "Juan@Gmail.com" y "juan@gmail.com" se traten como el mismo).
 */
function obtenerUsuarioPorCorreo(correo) {
    const usuarios = obtenerUsuarios();
    return usuarios.find((u) => u.correo.toLowerCase() === correo.toLowerCase()) || null;
}

/**
 * Guarda la sesión activa en localStorage, EXCLUYENDO la contraseña
 * (desestructuración con rest: se descarta password y se guarda el resto).
 * Es una medida mínima de seguridad para no dejar la contraseña en texto
 * plano flotando en la clave de sesión también.
 */
function guardarSesion(usuario) {
    // no guardamos la contraseña en la sesión activa
    const { password, ...usuarioSinPassword } = usuario;
    localStorage.setItem(CLAVE_SESION, JSON.stringify(usuarioSinPassword));
}

function obtenerSesion() {
    try {
        return JSON.parse(localStorage.getItem(CLAVE_SESION));
    } catch {
        return null;
    }
}

function cerrarSesion() {
    localStorage.removeItem(CLAVE_SESION);
}

/* --- Validadores --- */
// Todos devuelven null cuando el valor es válido, o un string con el mensaje
// de error cuando no lo es. Este contrato es el que espera marcarCampo().

function validarCorreo(correo) {
    if (!correo) return 'El correo es obligatorio.';
    if (correo.length > 100) return 'El correo no puede superar los 100 caracteres.';
    const partes = correo.split('@');
    if (partes.length !== 2) return 'Ingresa un correo válido.'; // cubre "sin @" y "más de un @"
    if (!DOMINIOS_PERMITIDOS.includes(partes[1].toLowerCase())) {
        return 'Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.';
    }
    return null;
}

function validarPassword(password) {
    if (!password) return 'La contraseña es obligatoria.';
    if (password.length < 4 || password.length > 10) {
        return 'La contraseña debe tener entre 4 y 10 caracteres.';
    }
    return null;
}

/**
 * Calcula el dígito verificador esperado de un RUN chileno (algoritmo módulo 11)
 * y lo compara contra el dígito que trae el RUN ingresado.
 * runLimpio debe venir SIN puntos ni guion (ver validarRun, que hace esa limpieza antes).
 */
function validarDigitoVerificador(runLimpio) {
    const cuerpo = runLimpio.slice(0, -1); // todo menos el último caracter (el dígito verificador)
    const dv = runLimpio.slice(-1).toUpperCase(); // el dígito verificador tal cual viene
    if (!/^\d+$/.test(cuerpo)) return false; // el cuerpo debe ser solo números

    // Algoritmo estándar módulo 11: multiplica cada dígito (de derecha a izquierda)
    // por una secuencia cíclica 2,3,4,5,6,7,2,3,4... y suma los resultados
    let suma = 0;
    let multiplo = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo[i], 10) * multiplo;
        multiplo = multiplo === 7 ? 2 : multiplo + 1; // reinicia el ciclo al llegar a 7
    }
    const resto = 11 - (suma % 11);
    // Casos especiales: resto 11 → dígito '0', resto 10 → dígito 'K'
    let dvEsperado = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto);
    return dv === dvEsperado;
}

/**
 * Valida el formato y el dígito verificador de un RUN.
 * Acepta el RUN con o sin puntos/guion (los quita antes de validar el largo y el DV).
 */
function validarRun(run) {
    if (!run) return 'El RUN es obligatorio.';
    const limpio = run.replace(/\./g, '').replace(/-/g, '').toUpperCase();
    if (limpio.length < 7 || limpio.length > 9) {
        return 'El RUN debe tener entre 7 y 9 caracteres, sin puntos ni guion.';
    }
    if (!validarDigitoVerificador(limpio)) return 'El RUN ingresado no es válido.';
    return null;
}

/**
 * Validador genérico para campos de texto obligatorios (nombre, apellidos,
 * dirección, región, comuna). maxLength es opcional: si no se pasa, no se
 * valida largo máximo (útil para selects como región/comuna).
 */
function validarRequerido(valor, maxLength, nombreCampo) {
    if (!valor || valor.trim().length === 0) return `${nombreCampo} es obligatorio.`;
    if (maxLength && valor.length > maxLength) return `${nombreCampo} no puede superar los ${maxLength} caracteres.`;
    return null;
}

/* --- UI --- */

/**
 * Marca visualmente un campo como válido o inválido, agregando/quitando
 * las clases .campo--invalido / .campo--valido (definidas en estilo-usuarios.css)
 * y actualizando el texto del mensaje de error si corresponde.
 * Se usa en TODOS los formularios del sitio (login, registro, perfil, admin).
 */
function marcarCampo(id, mensajeError) {
    const campo = document.getElementById(id);
    if (!campo) return;
    const errorEl = campo.querySelector('.campo__error');
    campo.classList.remove('campo--invalido', 'campo--valido');
    if (mensajeError) {
        campo.classList.add('campo--invalido');
        if (errorEl) errorEl.textContent = mensajeError;
    } else {
        campo.classList.add('campo--valido');
    }
}

/* --- LOGIN --- */

/**
 * Configura el submit de login.html: valida formato de correo/contraseña,
 * busca el usuario, compara la contraseña en texto plano (comparación directa
 * porque no hay backend/hashing en este proyecto académico), guarda la sesión
 * y redirige según el rol.
 */
function initFormLogin() {
    const form = document.getElementById('form-login');
    if (!form) return; // esta función se llama en TODAS las páginas; si no existe el form, no hace nada

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const correo = form.correo.value.trim();
        const password = form.password.value;

        const errorCorreo = validarCorreo(correo);
        const errorPassword = validarPassword(password);

        marcarCampo('campo-correo', errorCorreo);
        marcarCampo('campo-password', errorPassword);

        if (errorCorreo || errorPassword) return;

        const usuario = obtenerUsuarioPorCorreo(correo);

        if (!usuario) {
            marcarCampo('campo-correo', 'No existe una cuenta registrada con este correo.');
            return;
        }

        if (usuario.password !== password) {
            marcarCampo('campo-password', 'Contraseña incorrecta.');
            return;
        }

        guardarSesion(usuario);
        // Redirección según rol: admin va al panel, cliente va a su perfil
        if (usuario.rol === 'admin') {
            window.location.href = '../admin/dashboard.html';
        } else {
            window.location.href = 'perfil.html';
        }
    });
}

/* --- REGISTRO --- */

/**
 * Configura el submit de registro.html: valida todos los campos del formulario,
 * verifica que correo y RUN no estén duplicados, crea el nuevo usuario con
 * rol 'cliente' por defecto, lo guarda, inicia sesión automáticamente y
 * redirige a perfil.html.
 */
function initFormRegistro() {
    const form = document.getElementById('form-registro');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const correo = form.correo.value.trim();

        // Se validan TODOS los campos de una vez (no se corta en el primer error),
        // así el usuario ve de un solo intento todo lo que falta corregir
        const errores = {
            'campo-nombre': validarRequerido(form.nombre.value, 50, 'El nombre'),
            'campo-apellidos': validarRequerido(form.apellidos.value, 100, 'Los apellidos'),
            'campo-run': validarRun(form.run.value),
            'campo-correo': validarCorreo(correo),
            'campo-password': validarPassword(form.password.value),
            'campo-password2': form.password.value !== form.password2.value ? 'Las contraseñas no coinciden.' : null,
            'campo-region': validarRequerido(form.region.value, null, 'La región'),
            'campo-comuna': validarRequerido(form.comuna.value, null, 'La comuna'),
            'campo-direccion': validarRequerido(form.direccion.value, 300, 'La dirección'),
        };

        Object.entries(errores).forEach(([id, msg]) => marcarCampo(id, msg));

        const hayErrores = Object.values(errores).some((e) => e !== null);
        if (hayErrores) return;

        // Validaciones de unicidad: correo y RUN no pueden repetirse entre usuarios
        if (obtenerUsuarioPorCorreo(correo)) {
            marcarCampo('campo-correo', 'Ya existe una cuenta registrada con este correo.');
            return;
        }

        const runLimpio = form.run.value.replace(/\./g, '').replace(/-/g, '').toUpperCase();
        const runDuplicado = obtenerUsuarios().some(
            (u) => u.run.replace(/\./g, '').replace(/-/g, '').toUpperCase() === runLimpio
        );
        if (runDuplicado) {
            marcarCampo('campo-run', 'Ya existe una cuenta registrada con este RUN.');
            return;
        }

        const nuevoUsuario = {
            nombre: form.nombre.value.trim(),
            apellidos: form.apellidos.value.trim(),
            run: form.run.value.trim(),
            correo: correo,
            password: form.password.value,
            telefono: form.telefono.value.trim(),
            region: form.region.value,
            comuna: form.comuna.value,
            direccion: form.direccion.value.trim(),
            rol: 'cliente',
        };

        const usuarios = obtenerUsuarios();
        usuarios.push(nuevoUsuario);
        guardarUsuarios(usuarios);

        // Registro exitoso = inicio de sesión automático, evitando que el usuario
        // tenga que volver a escribir su correo/contraseña en login.html
        guardarSesion(nuevoUsuario);
        window.location.href = 'perfil.html';
    });
}

/* --- REGIÓN / COMUNA --- */

/**
 * Puebla el <select id="region"> con las 16 regiones de REGIONES, y engancha
 * el evento 'change' para que, al elegir una región, se repueble el
 * <select id="comuna"> con las comunas correspondientes.
 * Usada en registro.html y perfil.html (los selects con id genérico "region"/"comuna",
 * a diferencia de los modales admin que usan poblarRegionComuna() con prefijo).
 */
function initRegionComuna() {
    const selectRegion = document.getElementById('region');
    const selectComuna = document.getElementById('comuna');
    if (!selectRegion || !selectComuna) return;

    REGIONES.forEach((r) => {
        const opt = document.createElement('option');
        opt.value = r.nombre;
        opt.textContent = r.nombre;
        selectRegion.appendChild(opt);
    });

    selectRegion.addEventListener('change', () => {
        const region = REGIONES.find((r) => r.nombre === selectRegion.value);
        selectComuna.innerHTML = '<option value="">Selecciona la comuna</option>';
        if (region) {
            region.comunas.forEach((c) => {
                const opt = document.createElement('option');
                opt.value = c;
                opt.textContent = c;
                selectComuna.appendChild(opt);
            });
        }
    });
}

/* --- PERFIL --- */

/**
 * Inicializa perfil.html: protege la ruta (redirige a login si no hay sesión),
 * pinta la cabecera, el avatar, las mascotas y las citas, precarga el
 * formulario de edición con los datos actuales, y configura el submit
 * que guarda los cambios.
 */
function initFormPerfil() {
    const form = document.getElementById('form-perfil');
    if (!form) return;

    const sesion = obtenerSesion();

    if (!sesion) {
        window.location.href = 'login.html'; // sin sesión no se puede ver el perfil
        return;
    }

    actualizarCabeceraPerfil(sesion);
    initAvatarUpload(sesion);
    renderMascotas(sesion);
    initAccionesMascotasPerfil(sesion);
    renderCitas(sesion);

    // precarga los datos del usuario logueado
    if (form.nombre) form.nombre.value = sesion.nombre || '';
    if (form.apellidos) form.apellidos.value = sesion.apellidos || '';
    if (form.correo) form.correo.value = sesion.correo || '';
    if (form.telefono) form.telefono.value = sesion.telefono || '';
    if (form.direccion) form.direccion.value = sesion.direccion || '';
    const inputPasswordVista = document.getElementById('password-actual-vista');
    if (inputPasswordVista) inputPasswordVista.value = sesion.password || '';

    if (form.region) {
        form.region.value = sesion.region || '';
        // dispara el evento 'change' para que se generen las opciones de comuna
        // (initRegionComuna() debe haberse ejecutado ANTES para que el select ya tenga las regiones cargadas)
        form.region.dispatchEvent(new Event('change'));
    }
    if (form.comuna) {
        form.comuna.value = sesion.comuna || '';
    }

    // ahora que el formulario ya tiene los datos precargados, refleja la vista
    actualizarVistaPerfil();

    const btnEditar = document.getElementById('btn-editar-perfil');
    if (btnEditar) {
        btnEditar.addEventListener('click', activarModoEdicionPerfil);
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nuevaPassword = document.getElementById('password-actual-vista').value;

        // Igual que en el editar de admin: la contraseña solo se valida si cambió
        const errores = {
            'campo-nombre': validarRequerido(form.nombre.value, 50, 'El nombre'),
            'campo-apellidos': validarRequerido(form.apellidos.value, 100, 'Los apellidos'),
            'campo-correo': validarCorreo(form.correo.value.trim()),
            'campo-direccion': validarRequerido(form.direccion.value, 300, 'La dirección'),
            'campo-password-vista': nuevaPassword.length > 0 ? validarPassword(nuevaPassword) : null,
        };

        Object.entries(errores).forEach(([id, msg]) => marcarCampo(id, msg));

        const hayErrores = Object.values(errores).some((e) => e !== null);
        if (hayErrores) return;

        // El correo puede cambiar, así que hay que verificar que el NUEVO correo
        // no esté siendo usado por OTRO usuario (se excluye a sí mismo comparando con sesion.correo)
        const nuevoCorreo = form.correo.value.trim();
        const correoOcupadoPorOtro = obtenerUsuarios().some(
            (u) => u.correo && u.correo.toLowerCase() === nuevoCorreo.toLowerCase() && u.correo.toLowerCase() !== sesion.correo.toLowerCase()
        );
        if (correoOcupadoPorOtro) {
            marcarCampo('campo-correo', 'Ese correo ya está en uso por otra cuenta.');
            return;
        }

        const usuarios = obtenerUsuarios();
        const indice = usuarios.findIndex((u) => u.correo.toLowerCase() === sesion.correo.toLowerCase());

        if (indice !== -1) {
            usuarios[indice] = {
                ...usuarios[indice], // conserva campos no editables aquí (run, rol, avatar, fechaRegistro)
                nombre: form.nombre.value.trim(),
                apellidos: form.apellidos.value.trim(),
                correo: form.correo.value.trim(),
                telefono: form.telefono.value.trim(),
                direccion: form.direccion.value.trim(),
                region: form.region ? form.region.value : usuarios[indice].region,
                comuna: form.comuna ? form.comuna.value : usuarios[indice].comuna,
                password: nuevaPassword.length > 0 ? nuevaPassword : usuarios[indice].password,
            };
            guardarUsuarios(usuarios);
            guardarSesion(usuarios[indice]); // la sesión debe reflejar los datos recién guardados
            actualizarCabeceraPerfil(usuarios[indice]);
        }

        actualizarVistaPerfil();
        desactivarModoEdicionPerfil(); // vuelve a la vista de solo lectura tras guardar
    });
}

/**
 * Conecta el botón "Cerrar sesión" de perfil.html (distinto del de admin.js,
 * que redirige a login.html en vez de index.html).
 */
function initBotonCerrarSesion() {
    const btn = document.getElementById('btn-cerrar-sesion');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        cerrarSesion();
        window.location.href = 'index.html';
    });
}

/**
 * Actualiza el nombre, correo y comuna mostrados en la cabecera de perfil.html.
 * Se llama tanto al cargar la página como después de guardar cambios en el formulario.
 */
function actualizarCabeceraPerfil(usuario) {
    const nombreDisplay = document.getElementById('perfil-nombre-display');
    const correoDisplay = document.getElementById('perfil-correo-display');
    const comunaDisplay = document.getElementById('perfil-comuna-display');

    if (nombreDisplay) nombreDisplay.textContent = `${usuario.nombre || ''} ${usuario.apellidos || ''}`.trim();
    if (correoDisplay) correoDisplay.textContent = usuario.correo || '';
    if (comunaDisplay) comunaDisplay.textContent = usuario.comuna || 'Sin comuna registrada';
}

const TAMANO_MAX_AVATAR = 5 * 1024 * 1024; // 5 MB del archivo ORIGINAL (antes de comprimir)
const AVATAR_LADO_PX = 200; // tamaño final del avatar guardado

/**
 * Configura la subida de avatar en perfil.html: hacer clic en el círculo de
 * avatar abre el selector de archivo oculto; al elegir una imagen, se valida
 * tipo y peso, se redimensiona/comprime, y se guarda como base64 en el usuario.
 */
function initAvatarUpload(sesion) {
    const contenedor = document.getElementById('perfil-avatar-contenedor');
    const input = document.getElementById('input-avatar');
    if (!contenedor || !input) return;

    mostrarAvatar(sesion.avatar); // muestra la foto ya guardada (o el emoji, si no tiene)

    contenedor.addEventListener('click', () => input.click()); // el círculo hace de botón visual para el input real

    input.addEventListener('change', () => {
        const archivo = input.files[0];
        if (!archivo) return;

        if (!archivo.type.startsWith('image/')) {
            alert('Por favor selecciona un archivo de imagen.');
            return;
        }

        if (archivo.size > TAMANO_MAX_AVATAR) {
            alert('La imagen es muy pesada. Usa una de menos de 5 MB.');
            return;
        }

        redimensionarImagen(archivo, AVATAR_LADO_PX)
            .then((base64Comprimido) => {
                try {
                    guardarAvatar(base64Comprimido);
                    mostrarAvatar(base64Comprimido);
                } catch (error) {
                    // localStorage tiene un límite de espacio (~5-10MB según navegador);
                    // si se llena, setItem lanza QuotaExceededError
                    alert('No se pudo guardar la imagen: el almacenamiento está lleno. Prueba con otra foto.');
                    console.error(error);
                }
            })
            .catch(() => {
                alert('No se pudo procesar la imagen. Intenta con otro archivo.');
            });
    });
}

/**
 * Recorta la imagen al cuadrado central, la escala a ladoMaximo×ladoMaximo px
 * y la comprime a JPEG calidad 0.8, devolviendo un string base64 (data URL).
 * Este proceso es clave para poder guardar avatares en localStorage sin
 * chocar contra su límite de espacio (fotos de cámara sin comprimir pueden
 * pesar varios MB cada una).
 */
function redimensionarImagen(archivo, ladoMaximo) {
    return new Promise((resolve, reject) => {
        const lector = new FileReader();

        lector.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                let ancho = img.width;
                let alto = img.height;

                // recorta al cuadrado central antes de escalar
                // (evita que la imagen se vea "aplastada" si el original no es cuadrado)
                const lado = Math.min(ancho, alto);
                const offsetX = (ancho - lado) / 2;
                const offsetY = (alto - lado) / 2;

                const canvas = document.createElement('canvas');
                canvas.width = ladoMaximo;
                canvas.height = ladoMaximo;

                const ctx = canvas.getContext('2d');
                // dibuja solo el recorte cuadrado (offsetX/offsetY/lado/lado) escalado
                // al tamaño final (0/0/ladoMaximo/ladoMaximo)
                ctx.drawImage(img, offsetX, offsetY, lado, lado, 0, 0, ladoMaximo, ladoMaximo);

                // calidad 0.8 = buen balance entre peso y nitidez
                const base64Comprimido = canvas.toDataURL('image/jpeg', 0.8);
                resolve(base64Comprimido);
            };

            img.onerror = reject;
            img.src = e.target.result; // dispara la carga de la imagen desde el data URL leído por FileReader
        };

        lector.onerror = reject;
        lector.readAsDataURL(archivo);
    });
}

/**
 * Alterna entre mostrar la <img> del avatar (si hay foto guardada) o el
 * <span> con emoji de respaldo (si no hay foto).
 */
function mostrarAvatar(base64) {
    const img = document.getElementById('perfil-avatar-imagen');
    const emoji = document.getElementById('perfil-avatar-emoji');
    if (!img || !emoji) return;

    if (base64) {
        img.src = base64;
        img.style.display = 'block';
        emoji.style.display = 'none';
    } else {
        img.style.display = 'none';
        emoji.style.display = 'block';
    }
}

/**
 * Guarda el avatar (ya comprimido) en el registro del usuario y actualiza
 * también la sesión, para que el avatar se refleje inmediatamente sin
 * necesidad de recargar la página.
 */
function guardarAvatar(base64) {
    const sesion = obtenerSesion();
    if (!sesion) return;

    const usuarios = obtenerUsuarios();
    const indice = usuarios.findIndex((u) => u.correo.toLowerCase() === sesion.correo.toLowerCase());

    if (indice !== -1) {
        usuarios[indice].avatar = base64;
        guardarUsuarios(usuarios);
        guardarSesion(usuarios[indice]);
    }
}


/* --- MASCOTAS --- */

/**
 * Pinta la lista de mascotas del usuario en sesión dentro de perfil.html.
 * Lee directamente la clave patitasFelices_mascotas de localStorage (el módulo
 * de mascotas del compañero es quien la llena) y filtra solo las que le
 * pertenecen a este usuario (m.correoDueño).
 * Si no tiene mascotas, NO hace nada: se deja el estado vacío por defecto
 * que ya trae el HTML (perfil.html "Aún no tienes mascotas registradas").
 */
function renderMascotas(sesion) {
    const contenedor = document.getElementById('perfil-mascotas-lista');
    if (!contenedor) return;

    let mascotasGuardadas = [];
    try {
        mascotasGuardadas = JSON.parse(localStorage.getItem('patitasFelices_mascotas')) || [];
    } catch {
        mascotasGuardadas = [];
    }

    const propias = mascotasGuardadas.filter((m) => m.correoDueño === sesion.correo);
    if (propias.length === 0) return;

    contenedor.classList.remove('perfil-lista-vacia');

    contenedor.innerHTML = propias.map((m) => `
        <div class="perfil-mascota-item">
            <span>🐾</span>
            <div style="flex:1;">
                <strong>${m.nombre || 'Mascota'}</strong><br>
                <small>${m.especie || ''}${m.raza ? ' · ' + m.raza : ''}</small>
                ${renderBloqueCompletarMascota(m)}
            </div>
        </div>
    `).join('');
}

/**
 * Conecta las acciones (editar/completar datos, etc.) sobre las mascotas
 * listadas en perfil.html. La lógica real vive en initAccionesFormularioMascota,
 * que debe estar definida en mascotas.js (cargado antes que este script en el HTML).
 * Al terminar una acción, vuelve a renderizar la lista (callback renderMascotas(sesion)).
 */
function initAccionesMascotasPerfil(sesion) {
    const contenedor = document.getElementById('perfil-mascotas-lista');
    if (!contenedor) return;

    initAccionesFormularioMascota(contenedor, sesion, () => renderMascotas(sesion));
}

/* --- CITAS (placeholder: se conecta cuando el equipo tenga esa página lista) --- */

/**
 * Pinta la lista de citas del usuario en sesión. Al igual que renderMascotas,
 * lee la clave patitasFelices_citas directamente (llenada por el módulo de citas
 * del otro compañero) y filtra por correoUsuario. Si no hay citas propias,
 * se deja el estado vacío por defecto del HTML.
 */
function renderCitas(sesion) {
    const contenedor = document.getElementById('perfil-citas-lista');
    if (!contenedor) return;

    let citas = [];
    try {
        citas = JSON.parse(localStorage.getItem('patitasFelices_citas')) || [];
    } catch {
        citas = [];
    }

    const propias = citas.filter((c) => c.correoUsuario === sesion.correo);
    if (propias.length === 0) return;

    contenedor.innerHTML = propias.map((c) => `
        <div class="perfil-cita-item">
            <span>📅</span>
            <div>
                <strong>${c.fecha || 'Fecha por confirmar'}</strong> — ${c.motivo || 'Consulta'}<br>
                <small>${c.estado || 'Pendiente'}</small>
            </div>
        </div>
    `).join('');
}

/** Activa el modo edición de la tarjeta "Sobre" (muestra el formulario, oculta la vista) */
function activarModoEdicionPerfil() {
    document.getElementById('tarjeta-sobre').classList.add('perfil-card--editando');
}

/** Desactiva el modo edición (vuelve a mostrar la vista de solo lectura) */
function desactivarModoEdicionPerfil() {
    document.getElementById('tarjeta-sobre').classList.remove('perfil-card--editando');
}

/**
 * Copia los valores actuales del formulario de edición hacia los <span>
 * de la vista de solo lectura. Se llama al cargar la página (con los datos
 * recién precargados) y después de guardar cambios exitosamente.
 * Para región/comuna usa selectedOptions[0]?.text para mostrar el NOMBRE
 * legible (ej. "Rancagua") en vez del value crudo del <option>.
 */
function actualizarVistaPerfil() {
    document.getElementById('vista-nombre').textContent = document.getElementById('nombre').value || '—';
    document.getElementById('vista-apellidos').textContent = document.getElementById('apellidos').value || '—';
    document.getElementById('vista-correo').textContent = document.getElementById('correo').value || '—';
    document.getElementById('vista-telefono').textContent = document.getElementById('telefono').value || 'No registrado';
    document.getElementById('vista-region').textContent = document.getElementById('region').selectedOptions[0]?.text || '—';
    document.getElementById('vista-comuna').textContent = document.getElementById('comuna').selectedOptions[0]?.text || '—';
    document.getElementById('vista-direccion').textContent = document.getElementById('direccion').value || '—';
}

/* =========================================================
   CUENTAS ADMIN FIJAS (para demo/entrega)
   Se aseguran de existir cada vez que carga cualquier página,
   sin duplicar ni pisar otros datos si ya existen.
========================================================= */

// Credenciales de administrador fijas para la demo/entrega de la EP1:
// así el profesor/evaluador puede entrar al panel admin sin tener que registrarse
const ADMINS_FIJOS = [
    {
        nombre: 'Maria',
        apellidos: 'Calfileo Ceballos',
        run: '11111111-1',
        correo: 'ma.calfileo@duoc.cl',
        password: '1234',
    },
    {
        nombre: 'Rocio',
        apellidos: 'Cruces',
        run: '22222222-2',
        correo: 'ro.cruces@duoc.cl',
        password: '1234',
    },
];

/**
 * Garantiza que las 2 cuentas admin fijas existan en localStorage en cada
 * carga de página. Si ya existen (por ejemplo, si el evaluador cambió sus
 * datos personales sin querer), se les fuerza de vuelta el rol admin y la
 * contraseña fija, sin tocar el resto de sus datos. Si no existen, se crean
 * completas desde cero.
 */
function asegurarAdminsFijos() {
    const usuarios = obtenerUsuarios();

    ADMINS_FIJOS.forEach((datosAdmin) => {
        const existente = usuarios.find(
            (u) => u.correo.toLowerCase() === datosAdmin.correo.toLowerCase()
        );

        if (existente) {
            // ya existe: solo aseguramos que tenga rol admin y la password fija
            existente.rol = 'admin';
            existente.password = datosAdmin.password;
        } else {
            // no existe: la creamos completa
            usuarios.push({
                nombre: datosAdmin.nombre,
                apellidos: datosAdmin.apellidos,
                run: datosAdmin.run,
                correo: datosAdmin.correo,
                password: datosAdmin.password,
                telefono: '',
                region: '',
                comuna: '',
                direccion: '',
                rol: 'admin',
            });
        }
    });

    guardarUsuarios(usuarios);
}

// Punto de entrada: se ejecuta en TODAS las páginas que incluyan usuarios.js.
// Cada init revisa internamente si sus elementos existen en el DOM actual,
// así que es seguro llamarlas todas juntas sin importar en qué página estemos.
document.addEventListener('DOMContentLoaded', () => {
    asegurarAdminsFijos();
    initFormLogin();
    initFormRegistro();
    initRegionComuna();
    initFormPerfil();
    initBotonCerrarSesion();
});