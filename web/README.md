# Scana Web (Next.js PWA)

Premium web-first rewrite of Scana.

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

Copy `.env.example` to `.env.local` and set:

```bash
SEARCHAPI_API_KEY=your_key
```

Without a key, scan upload still works for demo filenames that match catalog products (e.g. `airpods.jpg`). Google Lens requires a publicly reachable image URL, so full Lens matching works best on a deployed preview.

## Scripts

- `npm run dev` — local development
- `npm run build` — production build
- `npm run start` — serve production build
