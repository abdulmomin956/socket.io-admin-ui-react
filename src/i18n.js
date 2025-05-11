// import i18n from 'i18next';
// import { initReactI18next } from 'react-i18next';

// // Dynamically load all locale files
// const loadLocaleMessages = () => {
//     const messages = {};
//     const modules = import.meta.glob('./locales/*.json', { eager: true });
//     //console.log(modules)
//     for (const path in modules) {
//         const matched = path.match(/\/([A-Za-z0-9-_]+)\.json$/i);
//         if (matched && matched[1]) {
//             const locale = matched[1];
//             messages[locale] = modules[path].default;
//         }
//     }

//     return messages;
// };

// //console.log(loadLocaleMessages())
// // Initialize i18n
// i18n
//     .use(initReactI18next) // passes i18n down to react-i18next
//     .init({
//         resources: loadLocaleMessages(),
//         lng: import.meta.env.VITE_I18N_LOCALE || 'en',
//         fallbackLng: import.meta.env.VITE_I18N_FALLBACK_LOCALE || 'en',
//         interpolation: {
//             escapeValue: false // react already safes from xss
//         }
//     });

// export default i18n;

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Dynamically load locale files
const loadLocaleMessages = () => {
    const messages = {};
    const modules = import.meta.glob('./locales/*.json', { eager: true });

    for (const path in modules) {
        // Extract language code from filename
        const matched = path.match(/\/([a-z-]+)\.json$/i);
        if (matched && matched[1]) {
            const locale = matched[1];
            // Use 'translation' as the default namespace
            messages[locale] = {
                translation: modules[path].default || modules[path]
            };
        }
    }

    return messages;
};

// Initialize i18n
i18n
    .use(initReactI18next)
    .init({
        resources: loadLocaleMessages(),
        lng: localStorage.getItem('language') || 'en',
        fallbackLng: 'en',
        ns: ['translation'], // Default namespace
        defaultNS: 'translation',
        interpolation: {
            escapeValue: false // react already safes from xss
        },
        // debug: true
    });

// export default i18n;

// Helper function to log all available keys
// i18n.logAvailableKeys = () => {
//     const currentLng = i18n.language;
//     const resources = i18n.options.resources;

//     if (resources && resources[currentLng]) {
//         console.log('Available keys in current language:',
//             Object.keys(resources[currentLng]).reduce((acc, ns) => {
//                 acc[ns] = Object.keys(resources[currentLng][ns]);
//                 return acc;
//             }, {})
//         );
//     }
// };

export default i18n;