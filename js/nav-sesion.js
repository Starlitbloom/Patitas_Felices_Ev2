/* =========================================================
   PATITAS FELICES — nav-sesion.js
   Ajusta la barra de navegación pública según si hay una
   sesión activa: muestra "Mis citas" / "Mi perfil" / "Mascotas"
   en vez de "Iniciar sesión", y viceversa.
========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    let sesion = null;
    try {
        sesion = JSON.parse(localStorage.getItem('patitasFelices_sesion'));
    } catch {
        sesion = null;
    }

    const link = document.getElementById('nav-cuenta');
    if (link) {
        if (sesion) {
            link.textContent = 'Mis citas';
            link.setAttribute('href', 'mis-citas.html');
        } else {
            link.textContent = 'Iniciar sesión';
            link.setAttribute('href', 'login.html');
        }
    }

    document.querySelectorAll('.nav-solo-sesion').forEach((item) => {
        item.classList.toggle('nav-solo-sesion--visible', !!sesion);
    });
});
