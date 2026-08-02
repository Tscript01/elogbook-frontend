# SIWES E-Logbook Frontend

Nuxt 4 + TypeScript + Tailwind CSS frontend for the SIWES (Student Industrial Work Experience Scheme) electronic logbook. It pairs with the Node.js/PostgreSQL API in `Tscript01/elogbookserver2`.

## Stack

- Nuxt (Vue 3, `<script setup>`)
- TypeScript
- Tailwind CSS with custom `primary` / `secondary` palettes and class-based dark mode
- Pinia for state
- Lucide icons (`@lucide/vue`)

## Requirements

Node.js 22 (see `.nvmrc`).

## Commands

```bash
npm install
npm run dev
npm run build
npm run lint
npm run typecheck
```

## Structure

```
app/
  assets/css/tailwind.css   Tailwind entry and shared form/paper component classes
  components/layout         Sidebar, header, breadcrumbs, theme toggle, user menu
  components/student        Logbook week selector, day navigator, entry editor, media uploader
  components/ui             Generic badge, button, card, progress bar, stat card, empty state
  data/mock-student.ts      Relational mock data mirroring the Prisma schema
  layouts/student.vue       Role-specific shell for the student flow
  pages/student             Dashboard, logbook, submissions, feedback, placement, clearance, profile
  stores                    Pinia stores (session, logbook)
  types                     Domain and UI types
```

## Data model

`app/types/models.ts` mirrors the backend Prisma schema (`users`, `placements`, `weekly_submissions`, `daily_logs`, `logbook_approvals`, `final_clearances`), including the `Role`, `Status` and `ClearanceStatus` enums, so mock data can be swapped for API responses without reshaping components.

## Roles

Student flow is implemented. Industry supervisor and institution coordinator flows reuse the same layout and UI primitives.
