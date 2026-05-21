// Lógica de Lightbox interactivo para la galería de imágenes
(function () {
    // Crear el elemento Lightbox dinámicamente si no existe
    let lightbox = document.getElementById('lightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-header">
                <div class="lightbox-date"></div>
                <span class="lightbox-close">&times;</span>
            </div>
            <img src="" alt="Imagen ampliada">
        `;
        document.body.appendChild(lightbox);
    }

    const lightboxImg = lightbox.querySelector('img');
    const lightboxDate = lightbox.querySelector('.lightbox-date');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    
    let images = [];
    let currentIndex = -1;

    // Actualizar la lista de imágenes activas en la página actual
    function updateImagesList() {
        images = Array.from(document.querySelectorAll('.category-item img, .gallery-row img'));
    }

    // Mostrar una imagen específica en el lightbox por su índice
    function showImage(index) {
        if (index < 0 || index >= images.length) return;
        
        currentIndex = index;
        const img = images[currentIndex];
        
        // Cargar imagen
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || 'Imagen de la galería';
        
        // Cargar fecha (si existe el atributo data-date)
        const date = img.getAttribute('data-date');
        if (date) {
            lightboxDate.textContent = date;
            lightboxDate.style.display = 'block';
        } else {
            lightboxDate.textContent = '';
            lightboxDate.style.display = 'none';
        }

        // Activar el lightbox
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Evita scroll de fondo
    }

    // Cerrar el lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.classList.add('closing');
        document.body.style.overflow = ''; // Restaura scroll
        
        // Restaurar estilos en línea usados por el swipe
        lightboxImg.style.transform = '';
        lightbox.style.backgroundColor = '';

        // Limpiamos el src al cerrar para evitar el flash de la imagen anterior la próxima vez que se abra
        setTimeout(() => {
            lightbox.classList.remove('closing');
            if (!lightbox.classList.contains('active')) {
                lightboxImg.src = '';
            }
        }, 400);
    }

    // Configurar event listeners en las imágenes de la página
    function setupGalleryListeners() {
        updateImagesList();
        
        // Delegación de eventos para manejar clics en imágenes de la galería
        document.addEventListener('click', (e) => {
            if (e.target.matches('.category-item img, .gallery-row img')) {
                const clickedIndex = images.indexOf(e.target);
                if (clickedIndex !== -1) {
                    showImage(clickedIndex);
                }
            }
        });
    }

    // Eventos de cierre
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    // Cerrar al hacer clic en el fondo oscuro (fuera de la imagen)
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.closest('.lightbox-header') === null && e.target !== lightboxImg) {
            closeLightbox();
        }
    });

    // Navegación por teclado (Escape y flechas de dirección)
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            // Siguiente imagen (cíclico)
            const nextIndex = (currentIndex + 1) % images.length;
            showImage(nextIndex);
        } else if (e.key === 'ArrowLeft') {
            // Imagen anterior (cíclico)
            const prevIndex = (currentIndex - 1 + images.length) % images.length;
            showImage(prevIndex);
        }
    });

    // Lógica de deslizar hacia abajo (Swipe down) para cerrar
    let touchStartY = 0;
    let touchMoveY = 0;
    let isDragging = false;

    lightbox.addEventListener('touchstart', (e) => {
        // No iniciar el arrastre si se toca la cabecera (incluyendo la X)
        if (e.target.closest('.lightbox-header')) return;
        
        touchStartY = e.touches[0].clientY;
        touchMoveY = touchStartY;
        isDragging = true;
        // Desactivar transiciones durante el arrastre
        lightboxImg.style.transition = 'none';
        lightbox.style.transition = 'none';
    }, { passive: true });

    lightbox.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        touchMoveY = e.touches[0].clientY;
        const deltaY = touchMoveY - touchStartY;
        
        // Solo aplicar efecto si se desliza hacia abajo
        if (deltaY > 0) {
            // Mover la imagen y hacer un poco más transparente el fondo
            lightboxImg.style.transform = `translateY(${deltaY}px) scale(0.95)`;
            const opacity = Math.max(0.95 - (deltaY / window.innerHeight), 0.2);
            lightbox.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
        }
    }, { passive: true });

    lightbox.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        
        const deltaY = touchMoveY - touchStartY;
        
        // Restaurar transiciones
        lightboxImg.style.transition = '';
        lightbox.style.transition = '';
        
        // Forzar un reflow para que el navegador registre la transición restaurada antes de cambiar clases
        void lightboxImg.offsetWidth;
        
        if (deltaY > 100) {
            closeLightbox();
        } else {
            // Volver a la posición original si no se deslizó lo suficiente
            lightboxImg.style.transform = '';
            lightbox.style.backgroundColor = '';
        }
    });

    // Inicializar cuando el DOM esté cargado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupGalleryListeners);
    } else {
        setupGalleryListeners();
    }
})();
