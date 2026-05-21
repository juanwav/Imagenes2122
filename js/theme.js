// Configuración de Tema (Claro / Oscuro)
(function () {
    const themeToggle = document.getElementById('theme-toggle');
    const root = document.documentElement;

    // Obtener tema inicial
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    // Aplicar tema inicial
    root.setAttribute('data-theme', currentTheme);

    // Escuchar el clic en el botón de cambio de tema
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const newTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // Lógica para el Overlay de "Datos"
    const openDatosBtn = document.getElementById('open-datos');
    const closeDatosBtn = document.getElementById('close-datos');
    const datosOverlay = document.getElementById('datos-overlay');

    if (openDatosBtn && datosOverlay) {
        openDatosBtn.addEventListener('click', (e) => {
            e.preventDefault();
            datosOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevenir scroll del fondo
        });
    }

    if (closeDatosBtn && datosOverlay) {
        closeDatosBtn.addEventListener('click', (e) => {
            e.preventDefault();
            datosOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Restaurar scroll
        });
    }

    // Cerrar overlay al hacer clic fuera del contenido (en el fondo borroso)
    if (datosOverlay) {
        datosOverlay.addEventListener('click', (e) => {
            if (e.target === datosOverlay) {
                datosOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Cerrar overlay con la tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && datosOverlay && datosOverlay.classList.contains('active')) {
            datosOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
})();
