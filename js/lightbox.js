document.addEventListener('DOMContentLoaded', () => {
    console.log('Lightbox initialized');
    
    // Create lightbox if it doesn't exist
    let lightbox = document.getElementById('lightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        document.body.appendChild(lightbox);
        
        const lightboxImg = document.createElement('img');
        lightbox.appendChild(lightboxImg);
        
        // Close on click
        lightbox.addEventListener('click', () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }

    const lightboxImg = lightbox.querySelector('img');

    // Use event delegation for better performance and mobile handling
    document.addEventListener('click', (e) => {
        const img = e.target.closest('.category-item img, .gallery-row img');
        if (img) {
            e.preventDefault();
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });

    // Add pointer cursor via JS as a fallback
    const items = document.querySelectorAll('.category-item img, .gallery-row img');
    items.forEach(img => img.style.cursor = 'pointer');

    // Datos Overlay Toggle
    const openDatos = document.getElementById('open-datos');
    const closeDatos = document.getElementById('close-datos');
    const datosOverlay = document.getElementById('datos-overlay');

    if (openDatos && datosOverlay) {
        openDatos.addEventListener('click', (e) => {
            e.preventDefault();
            datosOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeDatos && datosOverlay) {
        closeDatos.addEventListener('click', (e) => {
            e.preventDefault();
            datosOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }

    // Free will-change memory after animations complete (~1s)
    setTimeout(() => {
        document.querySelectorAll('.category-item, .gallery-row, .site-header, .intro-text')
            .forEach(el => el.style.willChange = 'auto');
    }, 1200);
});