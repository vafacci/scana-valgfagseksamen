# Sådan installerer du Expo Go i iOS Simulator

## Problem:
App Store links virker ikke i simulator'en via Safari.

## Løsning - 3 metoder:

### Metode 1: App Store appen direkte (Anbefalet)

1. **Åbn App Store appen i simulator'en:**
   - I simulator'en, find "App Store" appen (den blå ikon)
   - Eller søg efter "App Store" i Spotlight (Cmd+Space)

2. **Søg efter Expo Go:**
   - I App Store, søg efter "Expo Go"
   - Vælg "Expo Go" fra Expo (den officielle)
   - Tryk "Get" eller "Install"

### Metode 2: Via Terminal (hvis App Store ikke virker)

```bash
# Åbn App Store direkte
xcrun simctl launch booted com.apple.AppStore
```

Derefter søg manuelt efter "Expo Go" i App Store.

### Metode 3: Brug Expo CLI til at åbne direkte

Når Expo serveren kører, kan du prøve:
```bash
npm start
# Når serveren starter, tryk 'i' for iOS
# Expo CLI vil prøve at åbne Expo Go automatisk
```

## Efter installation:

1. **Start Expo serveren:**
```bash
npm start
```

2. **Åbn Expo Go i simulator'en**

3. **Indtast URL manuelt:**
   - Tryk "Enter URL manually"
   - Indtast: `exp://localhost:8081`

## Hvis App Store ikke virker:

Prøv at genstarte simulator'en:
```bash
xcrun simctl shutdown all
open -a Simulator
```

Derefter prøv at åbne App Store igen.

## Alternativ: Brug fysisk iPhone/iPad

Hvis simulator'en giver problemer, kan du også:
1. Installer Expo Go på din fysiske iPhone/iPad
2. Kør `npm start` 
3. Scan QR-koden fra terminalen med Expo Go appen

