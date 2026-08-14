# StyleVault

*A personal fashion archive for those who collect inspiration like currency.*

StyleVault is a fashion inspiration organizer built for stylists, creative directors, archive collectors, and anyone whose camera roll is 80% outfit screenshots. Organize fits into curated collections, tag them by mood, and reorder your archive exactly how you see it.

This is not a Pinterest clone. It's a personal, editorial-grade workspace — dark, minimal, and built to feel like a fashion publication rather than a productivity app.

---

## Features

- **Collections** — group inspiration into named archives (Dark Streetwear, Opium, Archive Fits, Techwear, and more)
- **Masonry Grid** — Pinterest-style layout with varying image heights for the collection detail view
- **Drag & Drop Reordering** — pick up any inspiration card and reorder it within a collection, with smooth lift, scale, and shadow animations
- **Mood Tagging** — tag each piece (Streetwear, Avant-Garde, Minimalist, Archive, Luxury, Techwear, Opium, Casual) and filter a collection by mood
- **Add Inspiration Modal** — upload an image, write a caption, assign a mood tag
- **Create Collection Modal** — spin up new collections with a custom cover image and name
- **LocalStorage Persistence** — everything survives a page refresh, no backend required
- **Empty States** — clean, on-brand messaging when a collection has no pieces yet

---

## Tech Stack

| Layer | Choice |
|---|---|
| Build tool | [Vite](https://vitejs.dev/) |
| UI library | [React](https://react.dev/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Routing | [React Router](https://reactrouter.com/) |
| Drag & Drop | [@dnd-kit](https://dndkit.com/) |
| Persistence | Browser LocalStorage (custom `useLocalStorage` hook) |
| Typography | Playfair Display (editorial serif) + Inter (clean sans-serif) |

No backend. No database. No authentication. By design.

---

## Project Structure

```
src/
├── components/
│   ├── collections/
│   │   ├── CollectionCard.jsx      # single collection card
│   │   └── CollectionGrid.jsx      # grid layout for collections
│   └── ui/
│       ├── AddInspirationModal.jsx
│       └── NewCollectionModal.jsx
├── hooks/
│   └── useLocalStorage.js          # custom persistence hook
├── pages/
│   ├── HomePage.jsx                # collections overview
│   └── CollectionPage.jsx          # masonry grid + drag & drop
├── App.jsx                         # routing + top-level state
└── main.jsx
```

---

## Getting Started

Clone the repo and install dependencies:

```bash
git clone https://github.com/Rkelly-dot/StyleVault.git
cd StyleVault/stylevault
npm install
```

Run the dev server:

```bash
npm run dev
```

Visit `http://localhost:5173`.

### Build for production

```bash
npm run build
```

Output is generated in `dist/`.

---

## Design Direction

- **Palette** — rich blacks, charcoal, graphite, off-white, subtle silver accents
- **Typography** — large italic serif headlines paired with clean sans-serif body text
- **Interaction** — soft hover states, slow deliberate transitions, premium micro-animations on drag

The goal throughout: every screen should feel like it belongs in a fashion magazine, not a SaaS dashboard.

---

## Roadmap

- [x] Search across collections
- [ ] Favorites
- [ ] Collection cover auto-update from latest inspiration
- [ ] Responsive/mobile polish pass

### Future (v2)
- AI-assisted mood tagging
- AI style analysis
- Personal style profile generation

---

### Future (v2)
- AI-assisted mood tagging
- AI style analysis
- Personal style profile generation
