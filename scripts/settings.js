document.addEventListener('DOMContentLoaded', function() {
    // Initialize everything
    initSettings();
});

/////// Settings Manager for all pages /////
const SettingsManager = {
    getSettings() {
        return {
            theme: localStorage.getItem('routerTheme') || 'default',
            fontSize: localStorage.getItem('routerFontSize') || '16',
            fontFamily: localStorage.getItem('routerFontFamily') || 'Arial, sans-serif'
        };
    },

    saveSettings(settings) {
        localStorage.setItem('routerTheme', settings.theme);
        localStorage.setItem('routerFontSize', settings.fontSize);
        localStorage.setItem('routerFontFamily', settings.fontFamily);
    },

    applySettings(settings = this.getSettings()) {
        // Apply to document
        document.documentElement.setAttribute('data-theme', settings.theme);
        document.documentElement.style.setProperty('--font-size', `${settings.fontSize}px`);
        document.documentElement.style.setProperty('--font-family', settings.fontFamily);

        // Update form controls to reflect current settings
        this.updateFormControls(settings);
    },

    updateFormControls(settings) {
        const themeRadio = document.querySelector(`input[name="theme"][value="${settings.theme}"]`);
        if (themeRadio) themeRadio.checked = true;

        const fontSizeInput = document.getElementById('font-size');
        if (fontSizeInput) fontSizeInput.value = settings.fontSize;

        const fontFamilySelect = document.getElementById('font-family');
        if (fontFamilySelect) fontFamilySelect.value = settings.fontFamily;
    }
};

function initSettings() {
    // Apply saved settings immediately
    const currentSettings = SettingsManager.getSettings();
    SettingsManager.applySettings(currentSettings);

    // Set up event listeners for instant updates
    initEventListeners();
}

function initEventListeners() {
    // Theme change - instant update
    document.querySelectorAll('input[name="theme"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const settings = SettingsManager.getSettings();
            settings.theme = this.value;
            SettingsManager.saveSettings(settings);
            SettingsManager.applySettings(settings); // Instant visual update
        });
    });

    // Font size - instant update
    document.getElementById('font-size')?.addEventListener('input', function() {
        const settings = SettingsManager.getSettings();
        settings.fontSize = this.value;
        SettingsManager.saveSettings(settings);
        SettingsManager.applySettings(settings); // Instant visual update
    });

    // Font family - instant update
    document.getElementById('font-family')?.addEventListener('change', function() {
        const settings = SettingsManager.getSettings();
        settings.fontFamily = this.value;
        SettingsManager.saveSettings(settings);
        SettingsManager.applySettings(settings); // Instant visual update
    });
}