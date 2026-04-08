# Maia Notes

A minimal, local-first rich-text notes editor built with [TipTap](https://tiptap.dev/), React, and [shadcn/ui](https://ui.shadcn.com/).

> **Status:** Experimental / local-only. No persistence, no sync, no backend — everything lives in your browser tab. Close it and the notes are gone.

## What it is

A clean, distraction-free editor surface with a working toolbar (bold, italic, headings, lists, strikethrough, etc.) and keyboard shortcuts. Built as a starting point for a longer-term notes app, kept small on purpose.

## What it isn't

- Not a notes *app* — there's no sidebar, no note list, no storage.
- Not multi-user, not collaborative, not synced.
- Not a Notion/Obsidian replacement.

If you're looking for a base to fork and bolt persistence onto, this is for you.

## Run it

```bash
git clone https://github.com/oezguercelebi/maia-notes.git
cd maia-notes
bun install   # or: npm install
bun dev       # or: npm run dev
```

Dev server runs on the default Vite port.

## Tech stack

| Layer | Tech |
|-------|------|
| Editor | TipTap 3 (StarterKit, Placeholder, Typography) |
| Framework | React 18 + Vite + TypeScript |
| UI | shadcn/ui (Radix primitives + Tailwind) |
| Routing | React Router |
| State | TanStack Query (wired, unused so far) |
| Tests | Vitest, Playwright |

## Origins

Scaffolded with [Lovable](https://lovable.dev/). The scaffold was kept and the editor surface was built on top.

## License

MIT — see [LICENSE](./LICENSE).
