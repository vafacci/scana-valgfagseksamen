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
    actionScan: 'Scan',
    actionPriceList: 'Prisliste',
    actionBuy: 'Køb',
    searchPlaceholder: 'Søg produkt, mærke eller model',
    searchHint: 'Søg på produkt, og sammenlign priser fra danske butikker',
    popular: 'Populære lige nu',
    noSearchResults: 'Ingen produkter matcher. Prøv AirPods, iPhone eller Sony.',
    cameraPermission: 'Vi skal bruge kameraet for at scanne — eller upload et billede.',
    grantPermission: 'Tillad kamera',
    uploadInstead: 'Upload billede i stedet',
    cameraUnavailable: 'Kameraet er ikke tilgængeligt her. Vælg et billede, eller fortsæt demo-scannet.',
    pickFromAlbum: 'Vælg fra album',
    continueDemo: 'Fortsæt demo-scan',
    flipCamera: 'Skift kamera',
    capturePhoto: 'Tag billede',
    // Carousel titles
    carouselTitle1: 'Scan Produkter',
    carouselSubtitle1: 'Find priser hurtigt',
    carouselTitle2: 'Sammenlign Priser',
    carouselSubtitle2: 'Bedste tilbud',
    carouselTitle3: 'Køb Smart',
    carouselSubtitle3: 'Spar penge',
    carouselTitle4: 'Bedste Vurderinger',
    carouselSubtitle4: 'Kvalitetsprodukter',
    carouselTitle5: 'Find Produkter',
    carouselSubtitle5: 'Smart søgning',
    carouselTitle6: 'Premium Kvalitet',
    carouselSubtitle6: 'Top mærker',
    
    // Profile Screen
    memberSince: 'Medlem siden',
    scans: 'Scans',
    favorites: 'Favoritter',
    elo: 'Elo',
    recentScans: 'Seneste scans',
    noScansYet: 'Ingen scans endnu. Start med at scanne for at se din historik her!',
    loading: 'Indlæser...',
    yourFavorites: 'Dine favoritter',
    noFavorites: 'Ingen favoritter',
    noFavoritesHint: 'Tryk på hjertet i prislisten for at tilføje favoritter',
    addedOn: 'Tilføjet',
    shareFailed: 'Kunne ikke dele.',
    error: 'Fejl',
    
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
    haveAccount: 'Har du en bruger? Log ind',
    signupSubtitle: 'Opret en konto, så dine scans følger med.',
    continueWithGoogle: 'Fortsæt med Google',
    continueWithFacebook: 'Fortsæt med Facebook',
    continueWithApple: 'Fortsæt med Apple',
    confirmPassword: 'Bekræft kodeord',
    agreePrefix: 'Jeg accepterer',
    invalidCredentials: 'Forkert email eller kodeord.',
    emailInUse: 'Der findes allerede en konto med den email.',
    fillAllFields: 'Udfyld alle felter.',
    passwordsDontMatch: 'Kodeordene matcher ikke.',
    agreeToTerms: 'Acceptér vilkårene for at oprette konto.',
    socialLoginHint: 'Google og Facebook logger dig ind med din rigtige konto.',
    loginFailed: 'Login lykkedes ikke. Prøv igen.',
    invalidEmail: 'Skriv en gyldig email.',
    passwordTooShort: 'Kodeordet skal være mindst 6 tegn.',
    lastScan: 'Seneste scan',
    scanToSeeLatest: 'Scan en vare, så vises den her — indtil vi finder ud af, hvad forsiden skal være.',
    newPassword: 'Nyt kodeord',
    resetPassword: 'Nulstil kodeord',
    resetPasswordHint: 'Indtast din email og et nyt kodeord. Vi sender ikke mails endnu — det sker lokalt på enheden.',
    passwordReset: 'Kodeordet er opdateret',
    passwordResetHintDone: 'Log ind med dit nye kodeord.',
    accountNotFound: 'Ingen konto med den email.',
    logoutHint: 'Du kan logge ind igen på denne enhed.',
    appleUnavailable: 'Apple Sign In er ikke klar endnu',
    appleUnavailableHint: 'Apple kræver et betalt Apple Developer-program og en server-nøgle. Google, Facebook og email virker nu.',
    
    // Camera Screen
    processing: 'Behandler...',
    analyzing: 'Analyserer...',
    identifying: 'Identificerer...',
    searching: 'Søger priser...',
    success: 'Fundet',
    cameraInstruction: 'Hold produktet i rammen',
    openingAlbum: 'Åbner album...',
    
    // Results Screen
    bestOffers: 'Bedste tilbud',
    addToFavorites: 'Tilføj til favoritter',
    removeFromFavorites: 'Fjern fra favoritter',
    shipping: 'Fragt',
    deliveryTime: 'Leveringstid',
    rating: 'Bedømmelse',
    reviews: 'anmeldelser',
    filterCheapest: 'Billigste',
    filterFastest: 'Hurtigste',
    filterRecommended: 'Anbefalet',
    fromPrice: 'Fra',
    goToStore: 'Gå til butik',
    noOffers: 'Ingen tilbud fundet',
    noOffersHint: 'Vi har ikke priser på dette produkt endnu. Prøv at søge efter et andet produkt.',
    offers: 'tilbud',
    days: 'dage',
    cheapestBadge: 'Laveste pris',
    fastestBadge: 'Hurtigst',
    recommendedBadge: 'Anbefalet',
    unknownProduct: 'Ukendt produkt',
    sortByPrice: 'Laveste pris først',
    sortByDelivery: 'Hurtigste levering først',
    sortByRecommended: 'Bedste mix af pris, rating og levering',
    barcode: 'Stregkode',
    priceDisclaimer: 'Vejledende priser. Tjek altid den aktuelle pris i butikken før du køber.',
    pricesChecked: 'Priser sidst tjekket',
    searchAtStore: 'Søg hos',
    opensSearchHint: 'Åbner butikkens søgning på produktet',
    beta: 'Beta',
    browseCatalog: 'Vores katalog',
    guest: 'Gæst',
    editProfile: 'Rediger profil',
    displayName: 'Navn',
    namePlaceholder: 'Dit navn',
    emailPlaceholder: 'din@email.dk',
    privacy: 'Privatliv',
    terms: 'Vilkår',
    aboutPrices: 'Om priserne',
    language: 'Sprog',
    clearLocalData: 'Slet data på denne enhed',
    clearLocalDataHint: 'Fjerner favoritter, historik og profil på denne enhed.',
    dataCleared: 'Data slettet',
    identifyTitle: 'Hvilken vare er det?',
    identifyHint: 'Vi genkender ikke automatisk. Vælg varen, så viser vi priser.',
    identifySearch: 'Søg i kataloget',
    pickFromCatalog: 'Vælg vare i kataloget',
    cameraInstruction: 'Tag et billede, og vælg varen bagefter',
    cameraUnavailable: 'Kameraet er ikke tilgængeligt her. Vælg et billede, eller find varen i kataloget.',
    continueDemo: 'Vælg vare i kataloget',
    noScansYet: 'Ingen billeder endnu. Tag et billede eller søg for at starte.',
    legalPrivacyTitle: 'Privatliv',
    legalPrivacyBody: 'Scana gemmer din konto, sprog, favoritter, scanhistorik og dit profilnavn lokalt på din enhed. Vi sender ikke dine data til en server. Billeder du tager, bliver kun brugt til at hjælpe dig med at vælge den rigtige vare og gemmes lokalt, hvis du beholder dem i historikken.',
    legalTermsTitle: 'Vilkår',
    legalTermsBody: 'Scana er et prisværktøj i beta. Vi sammenligner vejledende priser på et udvalg af elektronik og sender dig videre til butikkens egen søgning. Scana sælger ikke varerne. Køb, levering, retur og garanti sker hos den butik, du handler i.',
    legalPricesTitle: 'Om priserne',
    legalPricesBody: 'Priser, fragt og leveringstid er vejledende og kan være ændret, siden vi sidst tjekkede. Rating er butikkens omdømme i vores katalog — ikke en live-score. Tryk på «Søg hos» for at se den aktuelle pris i butikken, før du køber.',
    
    // Common
    cancel: 'Annuller',
    confirm: 'Bekræft',
    save: 'Gem',
    delete: 'Slet',
    share: 'Del',
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
    actionScan: 'Scan',
    actionPriceList: 'Price List',
    actionBuy: 'Buy',
    searchPlaceholder: 'Search product, brand or model',
    searchHint: 'Search a product and compare prices from Danish stores',
    popular: 'Popular right now',
    noSearchResults: 'No products match. Try AirPods, iPhone or Sony.',
    cameraPermission: 'Camera access is needed to scan — or upload a photo.',
    grantPermission: 'Allow camera',
    uploadInstead: 'Upload a photo instead',
    cameraUnavailable: 'Camera is not available here. Pick a photo, or continue the demo scan.',
    pickFromAlbum: 'Choose from album',
    continueDemo: 'Continue demo scan',
    flipCamera: 'Flip camera',
    capturePhoto: 'Capture',
    // Carousel titles
    carouselTitle1: 'Scan Products',
    carouselSubtitle1: 'Find prices fast',
    carouselTitle2: 'Compare Prices',
    carouselSubtitle2: 'Best deals',
    carouselTitle3: 'Buy Smart',
    carouselSubtitle3: 'Save money',
    carouselTitle4: 'Top Ratings',
    carouselSubtitle4: 'Quality products',
    carouselTitle5: 'Find Products',
    carouselSubtitle5: 'Smart search',
    carouselTitle6: 'Premium Quality',
    carouselSubtitle6: 'Top brands',
    
    // Profile Screen
    memberSince: 'Member since',
    scans: 'Scans',
    favorites: 'Favorites',
    elo: 'Elo',
    recentScans: 'Recent scans',
    noScansYet: 'No scans yet. Start scanning to see your history here!',
    loading: 'Loading...',
    yourFavorites: 'Your favorites',
    noFavorites: 'No favorites',
    noFavoritesHint: 'Tap the heart on a price to save it',
    addedOn: 'Added',
    shareFailed: 'Could not share.',
    error: 'Error',
    
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
    haveAccount: 'Have an account? Log in',
    signupSubtitle: 'Create an account so your scans stay with you.',
    continueWithGoogle: 'Continue with Google',
    continueWithFacebook: 'Continue with Facebook',
    continueWithApple: 'Continue with Apple',
    confirmPassword: 'Confirm password',
    agreePrefix: 'I agree to the',
    invalidCredentials: 'Wrong email or password.',
    emailInUse: 'An account with this email already exists.',
    fillAllFields: 'Please fill in all fields.',
    passwordsDontMatch: 'Passwords do not match.',
    agreeToTerms: 'Please agree to the terms to create an account.',
    socialLoginHint: 'Google and Facebook sign you in with your real account.',
    loginFailed: 'Login failed. Please try again.',
    invalidEmail: 'Enter a valid email.',
    passwordTooShort: 'Password must be at least 6 characters.',
    lastScan: 'Latest scan',
    scanToSeeLatest: 'Scan an item and it will show up here — until we decide what the home screen should be.',
    newPassword: 'New password',
    resetPassword: 'Reset password',
    resetPasswordHint: 'Enter your email and a new password. We do not send emails yet — this happens locally on the device.',
    passwordReset: 'Password updated',
    passwordResetHintDone: 'Log in with your new password.',
    accountNotFound: 'No account with that email.',
    logoutHint: 'You can log in again on this device.',
    appleUnavailable: 'Apple Sign In is not ready yet',
    appleUnavailableHint: 'Apple requires a paid Apple Developer program and a server key. Google, Facebook and email work now.',
    
    // Camera Screen
    processing: 'Processing...',
    analyzing: 'Analyzing...',
    identifying: 'Identifying...',
    searching: 'Searching prices...',
    success: 'Found',
    cameraInstruction: 'Keep the product in the frame',
    openingAlbum: 'Opening album...',
    
    // Results Screen
    bestOffers: 'Best offers',
    addToFavorites: 'Add to favorites',
    removeFromFavorites: 'Remove from favorites',
    shipping: 'Shipping',
    deliveryTime: 'Delivery time',
    rating: 'Rating',
    reviews: 'reviews',
    filterCheapest: 'Cheapest',
    filterFastest: 'Fastest',
    filterRecommended: 'Recommended',
    fromPrice: 'From',
    goToStore: 'Go to store',
    noOffers: 'No offers found',
    noOffersHint: 'We do not have prices for this product yet. Try searching for another product.',
    offers: 'offers',
    days: 'days',
    cheapestBadge: 'Lowest price',
    fastestBadge: 'Fastest',
    recommendedBadge: 'Recommended',
    unknownProduct: 'Unknown product',
    sortByPrice: 'Lowest price first',
    sortByDelivery: 'Fastest delivery first',
    sortByRecommended: 'Best mix of price, rating and delivery',
    barcode: 'Barcode',
    priceDisclaimer: 'Guide prices only. Always check the live price in the store before you buy.',
    pricesChecked: 'Prices last checked',
    searchAtStore: 'Search at',
    opensSearchHint: 'Opens the store search for this product',
    beta: 'Beta',
    browseCatalog: 'Our catalog',
    guest: 'Guest',
    editProfile: 'Edit profile',
    displayName: 'Name',
    namePlaceholder: 'Your name',
    emailPlaceholder: 'you@email.com',
    privacy: 'Privacy',
    terms: 'Terms',
    aboutPrices: 'About prices',
    clearLocalData: 'Delete data on this device',
    clearLocalDataHint: 'Removes favorites, history and profile on this device.',
    dataCleared: 'Data deleted',
    identifyTitle: 'Which product is it?',
    identifyHint: 'We do not recognise products automatically. Pick the item to see prices.',
    identifySearch: 'Search the catalog',
    pickFromCatalog: 'Pick from catalog',
    cameraInstruction: 'Take a photo, then pick the product',
    cameraUnavailable: 'Camera is not available here. Pick a photo, or find the item in the catalog.',
    continueDemo: 'Pick from catalog',
    noScansYet: 'No photos yet. Take a picture or search to get started.',
    legalPrivacyTitle: 'Privacy',
    legalPrivacyBody: 'Scana stores your account, language, favorites, scan history and profile name locally on your device. We do not send your data to a server. Photos you take are only used to help you pick the right product and stay on your device if you keep them in history.',
    legalTermsTitle: 'Terms',
    legalTermsBody: 'Scana is a price tool in beta. We compare guide prices on a selection of electronics and send you to the store’s own search. Scana does not sell the products. Purchase, delivery, returns and warranty are handled by the store you buy from.',
    legalPricesTitle: 'About prices',
    legalPricesBody: 'Prices, shipping and delivery times are indicative and may have changed since we last checked. Ratings are the store reputation in our catalog — not a live score. Tap «Search at» to see the current price in the store before you buy.',
    
    // Common
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    delete: 'Delete',
    share: 'Share',
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
