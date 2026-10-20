/* =========================================================
   PATITAS FELICES — index-interactivo.js
   Contador animado de estadísticas + acordeón de FAQ.
   Solo para index.html.
========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* --- Sombra del header al hacer scroll --- */
    // Muestra/oculta la franja oscura (.header-sombra) detrás del header transparente,
    // según qué tan abajo se ha hecho scroll
    const headerSombra = document.getElementById('header-sombra');

    if (headerSombra) {
        function actualizarSombraHeader() {
            if (window.scrollY > 40) {
                headerSombra.classList.add('visible');
            } else {
                headerSombra.classList.remove('visible');
            }
        }

        // { passive: true }: le avisa al navegador que este listener no va a llamar
        // preventDefault(), permitiendo que el scroll se procese de forma más fluida
        window.addEventListener('scroll', actualizarSombraHeader, { passive: true });

        // Se ejecuta una vez al cargar, por si la página ya arranca con scroll
        // (ej. el usuario recarga estando más abajo, o vuelve con el botón "atrás")
        actualizarSombraHeader();
    }

    /* --- Contadores animados al entrar en pantalla --- */
    const numeros = document.querySelectorAll('.estadistica-numero');

    if (numeros.length) {
        // IntersectionObserver detecta cuándo cada número entra en el viewport
        // (threshold: 0.5 = cuando al menos el 50% del elemento es visible)
        const observador = new IntersectionObserver((entradas) => {
            entradas.forEach((entrada) => {
                if (entrada.isIntersecting) {
                    // agrega la clase que dispara el fade-in + translateY en CSS (.estadistica--visible)
                    entrada.target.closest('.estadistica').classList.add('estadistica--visible');
                    animarNumero(entrada.target);
                    // deja de observar este elemento: la animación de conteo solo debe correr una vez
                    observador.unobserve(entrada.target);
                }
            });
        }, { threshold: 0.5 });

        numeros.forEach((el) => observador.observe(el));
    }

    

    /**
     * Anima un <span> numérico desde 0 hasta el valor de data-hasta,
     * en 1200ms, usando requestAnimationFrame para que la animación
     * sea suave y sincronizada con el refresco de pantalla.
     * data-sufijo permite agregar "+" o "%" al final del número final.
     */
    function animarNumero(el) {
        const hasta = parseInt(el.dataset.hasta, 10);
        const sufijo = el.dataset.sufijo || '';
        const duracion = 1200;
        const inicio = performance.now();

        function paso(ahora) {
            const progreso = Math.min((ahora - inicio) / duracion, 1);
            const valor = Math.floor(progreso * hasta);
            el.textContent = valor + sufijo;
            if (progreso < 1) requestAnimationFrame(paso); // sigue animando hasta llegar a progreso = 1
        }

        requestAnimationFrame(paso);
    }

    /* --- Acordeón FAQ --- */
    const preguntas = document.querySelectorAll('.faq-pregunta');

    preguntas.forEach((boton) => {
        boton.addEventListener('click', () => {
            const item = boton.closest('.faq-item');
            const respuesta = item.querySelector('.faq-respuesta');
            const yaAbierto = item.classList.contains('faq-item--abierto');

            // cierra los demás (acordeón exclusivo)
            // Antes de abrir/cerrar el ítem clickeado, se cierran todos los OTROS ítems
            // abiertos, para que solo una respuesta esté visible a la vez
            document.querySelectorAll('.faq-item--abierto').forEach((abierto) => {
                if (abierto !== item) {
                    abierto.classList.remove('faq-item--abierto');
                    abierto.querySelector('.faq-respuesta').style.maxHeight = null; // vuelve a max-height: 0 (definido en CSS)
                }
            });

            if (yaAbierto) {
                // El usuario volvió a hacer clic sobre la pregunta ya abierta: la cierra
                item.classList.remove('faq-item--abierto');
                respuesta.style.maxHeight = null;
            } else {
                // Abre la respuesta: scrollHeight da el alto real del contenido (que varía
                // según el largo del texto), así la animación CSS de max-height funciona
                // sin tener que hardcodear una altura fija por pregunta
                item.classList.add('faq-item--abierto');
                respuesta.style.maxHeight = respuesta.scrollHeight + 'px';
            }
        });
    });

});