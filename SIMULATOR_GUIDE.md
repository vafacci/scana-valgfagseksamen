# Sådan åbner du simulator'en

## Metode 1: Automatisk (Anbefalet)
```bash
npm start
```
Når Expo starter, tryk **`i`** i terminalen for at åbne iOS simulator.

## Metode 2: Manuelt
1. Start Expo:
```bash
npm start
```

2. Åbn simulator manuelt:
```bash
open -a Simulator
```

3. I Expo Go appen i simulator'en:
   - Tryk "Enter URL manually"
   - Indtast: `exp://localhost:8081`

## Hvis der er problemer:

1. **Stop alle Expo processer:**
```bash
lsof -ti:8081 | xargs kill -9
```

2. **Ryd cache:**
```bash
rm -rf .expo node_modules/.cache
```

3. **Start forfra:**
```bash
npm start
```

## Nyttige tastatur-kommandoer (når Expo kører):
- `i` - Åbn iOS simulator
- `a` - Åbn Android emulator  
- `r` - Reload appen
- `m` - Toggle menu
- `j` - Åbn debugger
- `Ctrl+C` - Stop serveren

