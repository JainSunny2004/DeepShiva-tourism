export const translations = {
  en: {
    // Navigation
    home: 'Home',
    chat: 'Chat',
    travel: 'Travel',
    wellness: 'Wellness',
    eco: 'Eco Tourism',
    crowd: 'Crowd Forecast',
    personas: 'Personas',
    login: 'Login',
    logout: 'Logout',
    
    // Chat
    newChat: 'New Chat',
    typeMessage: 'Type your message...',
    send: 'Send',
    selectPersona: 'Select Persona',
    autoPersona: 'Auto-select',
    confidence: 'Confidence',
    sources: 'Sources',
    
    // Travel
    spiritualSites: 'Spiritual Sites',
    treks: 'Treks',
    homestays: 'Homestays',
    festivals: 'Festivals',
    search: 'Search',
    filter: 'Filter',
    state: 'State',
    difficulty: 'Difficulty',
    category: 'Category',
    
    // Wellness
    yogaRoutines: 'Yoga Routines',
    meditation: 'Meditation',
    poseDetection: 'Pose Detection',
    startSession: 'Start Session',
    duration: 'Duration',
    minutes: 'minutes',
    
    // Eco
    carbonFootprint: 'Carbon Footprint',
    calculate: 'Calculate',
    ecoTips: 'Eco Tips',
    sustainableTravel: 'Sustainable Travel',
    transport: 'Transport',
    accommodation: 'Accommodation',
    
    // Crowd
    checkCrowds: 'Check Crowds',
    bestTimeToVisit: 'Best Time to Visit',
    selectLocation: 'Select Location',
    selectDate: 'Select Date',
    predict: 'Predict',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
  },
  
  hi: {
    // Navigation
    home: 'होम',
    chat: 'चैट',
    travel: 'यात्रा',
    wellness: 'कल्याण',
    eco: 'इको पर्यटन',
    crowd: 'भीड़ पूर्वानुमान',
    personas: 'व्यक्तित्व',
    login: 'लॉगिन',
    logout: 'लॉगआउट',
    
    // Chat
    newChat: 'नई चैट',
    typeMessage: 'अपना संदेश टाइप करें...',
    send: 'भेजें',
    selectPersona: 'व्यक्तित्व चुनें',
    autoPersona: 'ऑटो-चयन',
    confidence: 'विश्वास',
    sources: 'स्रोत',
    
    // Travel
    spiritualSites: 'आध्यात्मिक स्थल',
    treks: 'ट्रेक',
    homestays: 'होमस्टे',
    festivals: 'त्यौहार',
    search: 'खोजें',
    filter: 'फ़िल्टर',
    state: 'राज्य',
    difficulty: 'कठिनाई',
    category: 'श्रेणी',
    
    // Wellness
    yogaRoutines: 'योग रूटीन',
    meditation: 'ध्यान',
    poseDetection: 'मुद्रा पहचान',
    startSession: 'सत्र शुरू करें',
    duration: 'अवधि',
    minutes: 'मिनट',
    
    // Eco
    carbonFootprint: 'कार्बन फुटप्रिंट',
    calculate: 'गणना करें',
    ecoTips: 'इको टिप्स',
    sustainableTravel: 'टिकाऊ यात्रा',
    transport: 'परिवहन',
    accommodation: 'आवास',
    
    // Crowd
    checkCrowds: 'भीड़ जांचें',
    bestTimeToVisit: 'यात्रा का सर्वोत्तम समय',
    selectLocation: 'स्थान चुनें',
    selectDate: 'तारीख चुनें',
    predict: 'पूर्वानुमान',
    
    // Common
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफलता',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    close: 'बंद करें',
  },
}

export function t(key, lang = 'en') {
  return translations[lang][key] || translations.en[key] || key
}
