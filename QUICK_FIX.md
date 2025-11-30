# QUICK FIX - Sådan får du appen til at virke NU

## Problem:
Simulator'en vil ikke åbne appen, selvom Expo serveren kører.

## LØSNING - Prøv denne metode:

### Trin 1: Stop ALT
```bash
# Stop alle Expo processer
lsof -ti:8081 | xargs kill -9

# Luk simulator
xcrun simctl shutdown all
```

### Trin 2: Start forfra med tunnel mode
```bash
npm run start:tunnel
```

**Hvorfor tunnel?** Tunnel mode bruger Expo's servere, så simulator'en altid kan nå serveren, uanset netværksproblemer.

### Trin 3: Når serveren starter
1. Tryk **`i`** i terminalen for at åbne iOS simulator
2. Expo Go åbnes automatisk
3. Appen loader automatisk

## Alternativ metode (hvis tunnel ikke virker):

### Brug din fysiske iPhone/iPad:

1. **Installer Expo Go** på din iPhone/iPad fra App Store

2. **Start Expo:**
```bash
npm start
```

3. **Scan QR-koden** fra terminalen med Expo Go appen på din telefon

4. **Appen åbnes automatisk!**

## Hvis intet virker:

Prøv at bygge en development build i stedet:

```bash
npx expo prebuild
npx expo run:ios
```

Dette bygger en native app der kører direkte i simulator'en uden Expo Go.

