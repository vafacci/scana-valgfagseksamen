# FINAL LØSNING - Sådan får du det til at virke

Jeg har identificeret problemet: iOS simulator'en har ofte problemer med at forbinde til localhost fra Expo Go.

## LØSNING 1: Brug Tunnel Mode (Anbefalet)

```bash
npm run start:tunnel
```

Derefter tryk `i` når serveren starter. Tunnel mode løser netværksproblemer.

## LØSNING 2: Brug din fysiske iPhone/iPad (100% sikker)

Dette virker ALTID:

1. **Installer Expo Go** på din iPhone/iPad fra App Store
2. **Kør:**
```bash
npm start
```
3. **Scan QR-koden** fra terminalen med Expo Go appen
4. **Appen åbnes automatisk!**

## LØSNING 3: Byg native app (hvis intet andet virker)

Dette bygger en rigtig iOS app der kører direkte i simulator'en:

```bash
npx expo prebuild
npx expo run:ios
```

Dette tager lidt tid første gang, men virker altid.

## Hvorfor virker localhost ikke?

iOS simulator'en kan have problemer med at nå localhost fra Expo Go. Dette er et kendt problem. Tunnel mode eller fysisk enhed løser det.

## Hvad jeg anbefaler:

**Prøv først:** `npm run start:tunnel` + tryk `i`

**Hvis det ikke virker:** Brug din fysiske iPhone/iPad (løsning 2)

**Hvis du vil have det permanent:** Byg native app (løsning 3)

