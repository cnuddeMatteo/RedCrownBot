// Gestionnaire de traductions multilingues
let translations = {};
let currentLanguage = localStorage.getItem('language') || 'fr';

// Charge les traductions
async function loadTranslations() {
    try {
        const response = await fetch('translations.json');
        translations = await response.json();
        applyLanguage(currentLanguage);
    } catch (error) {
        console.error('Erreur lors du chargement des traductions:', error);
    }
}

// Applique la langue à toute la page
function applyLanguage(lang) {
    if (!translations[lang]) return;
    
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    // Met à jour tous les éléments avec data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const text = getTranslation(key);
        
        if (element.tagName === 'INPUT' && element.type === 'placeholder') {
            element.placeholder = text;
        } else if (element.tagName === 'INPUT') {
            element.placeholder = text;
        } else {
            element.textContent = text;
        }
    });
    
    // Mets à jour le bouton de langue
    updateLanguageButton();
    
    // Mets à jour le titre de la page
    document.title = getTranslation(`${getPageType()}.title`) || 'CULT BOT';
}

// Récupère une traduction
function getTranslation(key) {
    const keys = key.split('.');
    let value = translations[currentLanguage];
    
    for (const k of keys) {
        value = value[k];
        if (!value) return key;
    }
    
    return value;
}

// Rend accessible globalement
window.getTranslation = getTranslation;

// Change la langue
function toggleLanguage() {
    const newLang = currentLanguage === 'fr' ? 'en' : 'fr';
    applyLanguage(newLang);
    location.reload(); // Recharge la page pour appliquer toutes les traductions
}

// Met à jour le bouton de langue
function updateLanguageButton() {
    const btn = document.getElementById('language-toggle');
    if (btn) {
        btn.textContent = currentLanguage === 'fr' ? '🇬🇧 EN' : '🇫🇷 FR';
    }
}

// Détermine le type de page
function getPageType() {
    const path = window.location.pathname;
    if (path.includes('commands')) return 'commands';
    if (path.includes('leaderboard')) return 'leaderboard';
    if (path.includes('updates')) return 'updates';
    return 'index';
}

// Initialise les traductions au chargement
document.addEventListener('DOMContentLoaded', () => {
    loadTranslations();
});
