// Configuración de la navegación y funcionalidades específicas de la página de normas
document.addEventListener('DOMContentLoaded', () => {
    console.log('Página de normas cargada correctamente');
    
    // Añadir efecto de desplazamiento suave a los enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Añadir efecto de resaltado al pasar el ratón sobre las categorías de reglas
    const ruleCategories = document.querySelectorAll('.rule-category');
    ruleCategories.forEach(category => {
        category.addEventListener('mouseenter', () => {
            category.style.transform = 'translateY(-5px)';
            category.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
        });
        
        category.addEventListener('mouseleave', () => {
            category.style.transform = 'translateY(0)';
            category.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        });
    });
    
    // Añadir efecto de brillo al trofeo en el footer
    const trophyIcon = document.querySelector('.rules-footer i');
    if (trophyIcon) {
        setInterval(() => {
            trophyIcon.style.filter = 'brightness(1.5)';
            setTimeout(() => {
                trophyIcon.style.filter = 'brightness(1)';
            }, 500);
        }, 3000);
    }
    
    // Añadir botón para volver arriba
    const body = document.querySelector('body');
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopButton.className = 'back-to-top';
    backToTopButton.style.position = 'fixed';
    backToTopButton.style.bottom = '20px';
    backToTopButton.style.right = '20px';
    backToTopButton.style.backgroundColor = 'var(--color-primary)';
    backToTopButton.style.color = 'white';
    backToTopButton.style.border = 'none';
    backToTopButton.style.borderRadius = '50%';
    backToTopButton.style.width = '50px';
    backToTopButton.style.height = '50px';
    backToTopButton.style.fontSize = '20px';
    backToTopButton.style.cursor = 'pointer';
    backToTopButton.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    backToTopButton.style.opacity = '0';
    backToTopButton.style.transition = 'opacity 0.3s ease';
    backToTopButton.style.zIndex = '999';
    
    body.appendChild(backToTopButton);
    
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.style.opacity = '1';
        } else {
            backToTopButton.style.opacity = '0';
        }
    });
}); 