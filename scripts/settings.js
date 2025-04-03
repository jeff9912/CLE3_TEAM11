



document.addEventListener('DOMContentLoaded', function () {
    // Load saved settings
    const savedTheme = localStorage.getItem('routerTheme') || 'default';
    const savedFontSize = localStorage.getItem('routerFontSize') || '16';
    const savedFontFamily = localStorage.getItem('routerFontFamily') || 'Arial, sans-serif';


    // Set controls to saved values
    document.querySelector(`input[name="theme"][value="${savedTheme}"]`).checked = true;
    document.getElementById('font-size').value = savedFontSize;
    document.getElementById('font-family').value = savedFontFamily;

    // Event listeners
    initEventListeners();

    // Apply saved settings
    applyTheme(savedTheme);
    applyFontSize(savedFontSize);
    applyFontFamily(savedFontFamily);

});

function initEventListeners() {
    // Theme change
    document.querySelectorAll('input[name="theme"]').forEach(radio => {
        radio.addEventListener('change', function () {
            const theme = this.value;
            applyTheme(theme);
            localStorage.setItem('routerTheme', theme);
        });
    });

    // Font size
    document.getElementById('font-size').addEventListener('input', function () {
        const fontSize = this.value;
        applyFontSize(fontSize);
        localStorage.setItem('routerFontSize', fontSize);
    });

    // Font family
    document.getElementById('font-family').addEventListener('change', function () {
        const fontFamily = this.value;
        applyFontFamily(fontFamily);
        localStorage.setItem('routerFontFamily', fontFamily);
    });
}

function applyTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
}

function applyFontSize(size) {
    document.documentElement.style.setProperty('--font-size', `${size}px`);
}

function applyFontFamily(fontFamily) {
    // Explicitly set font family on both root and body
    document.documentElement.style.setProperty('--font-family', fontFamily);
    document.body.style.fontFamily = fontFamily;
}