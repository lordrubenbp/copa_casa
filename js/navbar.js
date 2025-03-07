// Funcionalidad para el menú hamburguesa en dispositivos móviles
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const overlay = document.querySelector('.overlay');
    const navItems = document.querySelectorAll('.nav-links li a');
    
    // Función para alternar el menú
    function toggleMenu() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        overlay.classList.toggle('active');
        
        // Bloquear/desbloquear el scroll del body cuando el menú está abierto
        if (navLinks.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    // Evento para el botón hamburguesa
    hamburger.addEventListener('click', toggleMenu);
    
    // Evento para el overlay (para cerrar el menú al hacer clic fuera)
    overlay.addEventListener('click', toggleMenu);
    
    // Cerrar el menú al hacer clic en un enlace
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
    
    // Cerrar el menú al redimensionar la ventana a un tamaño mayor
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            toggleMenu();
        }
    });
}); 