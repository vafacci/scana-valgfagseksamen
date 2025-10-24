import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGE_KEY = '@scana_language';

// Translation objects
const translations = {
  da: {
    // Navigation
    home: 'Hjem',
    camera: 'Scan',
    results: 'Resultater',
    profile: 'Profil',
    favorites: 'Favoritter',
    settings: 'Indstillinger',
    
    // Home Screen
    readyToScan: 'Er du klar til at scanne?',
    scanDescription: 'Med kamera-scanneren kan du hurtigt finde prisen på en vare - uden at skulle søge manuelt.',
    scanNow: 'Scan nu',
    
    // Profile Screen
    memberSince: 'Medlem siden',
    scans: 'Scans',
    favorites: 'Favoritter',
    elo: 'Elo',
    recentScans: 'Recent Scans',
    noScansYet: 'Ingen scans endnu. Start med at scanne for at se din historik her!',
    loading: 'Indlæser...',
    
    // Settings Screen
    settings: 'Indstillinger',
    back: 'Tilbage',
    logout: 'Log ud',
    addNewUser: 'Tilføj ny bruger',
    deleteProfile: 'Slet profil',
    profileSettings: 'Profilindstillinger',
    notifications: 'Notifikationer',
    languageAndTheme: 'Sprog og tema',
    privacyAndSecurity: 'Privatliv og sikkerhed',
    account: 'Konto',
    addNewUserLink: 'Tilføj en ny bruger',
    logoutLink: 'Log ud',
    deleteProfileLink: 'Slet profil',
    footerText: 'Sammenlign priser fra flere butikker - direkte efter du scanner varen.',
    
    // Language Settings
    language: 'Sprog',
    selectLanguage: 'Vælg sprog',
    danish: 'Dansk',
    english: 'Engelsk',
    
    // Auth Screens
    landingpage: 'Landingpage',
    scana: 'Scana',
    scanOnTheGo: 'Scan på farten!',
    email: 'Email',
    password: 'Kodeord',
    login: 'Log ind',
    signup: 'Tilmeld dig',
    forgotPassword: 'Glemt kodeord?',
    loginHere: 'Login Her',
    welcomeBack: 'Velkommen tilbage til Scana!',
    quickLogin: 'Hurtig login med',
    orContinueWith: 'Eller fortsæt med',
    dontHaveAccount: 'Har du ikke en konto?',
    createAccount: 'Opret konto',
    joinNow: 'Join now',
    haveAccount: 'Har du en bruger? Login',
    
    // Camera Screen
    processing: 'Behandler...',
    analyzing: 'Analyserer produkt...',
    identifying: 'Identificerer produkt...',
    searching: 'Søger priser...',
    success: 'Succes!',
    
    // Results Screen
    bestOffers: 'Bedste tilbud',
    addToFavorites: 'Tilføj til favoritter',
    removeFromFavorites: 'Fjern fra favoritter',
    shipping: 'Fragt',
    deliveryTime: 'Leveringstid',
    rating: 'Bedømmelse',
    reviews: 'anmeldelser',
    
    // Common
    cancel: 'Annuller',
    confirm: 'Bekræft',
    save: 'Gem',
    delete: 'Slet',
    edit: 'Rediger',
    close: 'Luk',
  },
  en: {
    // Navigation
    home: 'Home',
    camera: 'Scan',
    results: 'Results',
    profile: 'Profile',
    favorites: 'Favorites',
    settings: 'Settings',
    
    // Home Screen
    readyToScan: 'Ready to scan?',
    scanDescription: 'With the camera scanner you can quickly find the price of an item - without having to search manually.',
    scanNow: 'Scan Now',
    
    // Profile Screen
    memberSince: 'Member since',
    scans: 'Scans',
    favorites: 'Favorites',
    elo: 'Elo',
    recentScans: 'Recent Scans',
    noScansYet: 'No scans yet. Start scanning to see your history here!',
    loading: 'Loading...',
    
    // Settings Screen
    settings: 'Settings',
    back: 'Back',
    logout: 'Logout',
    addNewUser: 'Add new user',
    deleteProfile: 'Delete profile',
    profileSettings: 'Profile settings',
    notifications: 'Notifications',
    languageAndTheme: 'Language and theme',
    privacyAndSecurity: 'Privacy and security',
    account: 'Account',
    addNewUserLink: 'Add a new user',
    logoutLink: 'Logout',
    deleteProfileLink: 'Delete profile',
    footerText: 'Compare prices from multiple stores - directly after you scan the item.',
    
    // Language Settings
    language: 'Language',
    selectLanguage: 'Select language',
    danish: 'Danish',
    english: 'English',
    
    // Auth Screens
    landingpage: 'Landingpage',
    scana: 'Scana',
    scanOnTheGo: 'Scan on the go!',
    email: 'Email',
    password: 'Password',
    login: 'Login',
    signup: 'Sign up',
    forgotPassword: 'Forgot password?',
    loginHere: 'Login Here',
    welcomeBack: 'Welcome back to Scana!',
    quickLogin: 'Quick login with',
    orContinueWith: 'Or continue with',
    dontHaveAccount: "Don't have an account?",
    createAccount: 'Create account',
    joinNow: 'Join now',
    haveAccount: 'Have an account? Login',
    
    // Camera Screen
    processing: 'Processing...',
    analyzing: 'Analyzing product...',
    identifying: 'Identifying product...',
    searching: 'Searching prices...',
    success: 'Success!',
    
    // Results Screen
    bestOffers: 'Best offers',
    addToFavorites: 'Add to favorites',
    removeFromFavorites: 'Remove from favorites',
    shipping: 'Shipping',
    deliveryTime: 'Delivery time',
    rating: 'Rating',
    reviews: 'reviews',
    
    // Common
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
  }
};

// Create Language Context
const LanguageContext = createContext();

// Language Provider Component
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('da'); // Default to Danish
  const [loading, setLoading] = useState(true);

  // Load language from AsyncStorage on mount
  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const storedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (storedLanguage && translations[storedLanguage]) {
        setLanguage(storedLanguage);
        console.log('Language loaded:', storedLanguage); // Debug log
      }
    } catch (error) {
      console.error('Error loading language:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveLanguage = async (newLanguage) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, newLanguage);
      setLanguage(newLanguage);
      console.log('Language saved:', newLanguage); // Debug log
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const changeLanguage = async (newLanguage) => {
    if (translations[newLanguage]) {
      console.log('Changing language from', language, 'to', newLanguage); // Debug log
      await saveLanguage(newLanguage);
    }
  };

  const t = (key) => {
    const translation = translations[language]?.[key] || key;
    return translation;
  };

  const getAvailableLanguages = () => {
    return [
      { code: 'da', name: 'Dansk', nativeName: 'Dansk' },
      { code: 'en', name: 'English', nativeName: 'English' }
    ];
  };

  const value = {
    language,
    loading,
    changeLanguage,
    t,
    getAvailableLanguages,
    loadLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook to use language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
