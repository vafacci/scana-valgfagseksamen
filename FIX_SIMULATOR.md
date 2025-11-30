# FIX: Sådan får du simulator'en til at virke

## Problem:
- "New update available, downloading..." bliver ved
- "Could not connect to development server" fejl
- Appen bruger ekstern IP i stedet for localhost

## Løsning:

### 1. Installer Expo Go i simulator'en:
Åbn App Store i simulator'en og søg efter "Expo Go", eller brug:
```bash
# Åbn App Store i simulator
open -a Simulator
# Derefter manuelt: Søg efter "Expo Go" og installer
```

### 2. Start Expo serveren korrekt:
```bash
npm start
```

Dette starter nu automatisk med:
- `--localhost` (tvinger localhost i stedet for ekstern IP)
- `--clear` (rydder cache)

### 3. Åbn appen i Expo Go:

**Metode A - Automatisk:**
Når Expo starter, tryk **`i`** i terminalen.

**Metode B - Manuel:**
1. Åbn Expo Go i simulator'en
2. Tryk "Enter URL manually"
3. Indtast: `exp://localhost:8081`
   ELLER: `exp://127.0.0.1:8081`

### 4. Hvis det stadig ikke virker:

**Ryd alt og start forfra:**
```bash
# Stop alle processer
lsof -ti:8081 | xargs kill -9

# Ryd cache
rm -rf .expo node_modules/.cache .metro

# Genstart simulator
xcrun simctl shutdown all
open -a Simulator

# Start Expo
npm start
```

**I Expo Go:**
- Shake simulator (Cmd+Ctrl+Z) eller tryk på menu
- Vælg "Reload" eller "Clear cache"
- Prøv at indtaste URL'en igen: `exp://localhost:8081`

## Hvad jeg har ændret:

1. ✅ Opdateret `package.json` - alle scripts bruger nu `--localhost --clear`
2. ✅ Opdateret `app.json` - deaktiveret auto-updates (`checkAutomatically: "NEVER"`)
3. ✅ Sikret at Expo altid bruger localhost i stedet for ekstern IP

## Vigtigt:
- Brug ALTID `npm start` (ikke `npm start:ios` med --ios flag)
- URL'en skal være `exp://localhost:8081` eller `exp://127.0.0.1:8081`
- Hvis du ser "New update available", tryk "Reload" i Expo Go i stedet for at vente

