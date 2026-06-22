# Upgrade Roadmap

This project is a Bun-managed Next.js 15 + React 19 + Tailwind v4 shadcn/ui app
with a local fork of the official sidebar. The fork adds drag-to-resize behavior,
so sidebar changes must be reviewed manually and kept separate from broad
dependency or codemod work.

## Guardrails

- Use Bun only: `bun install`, `bun add`, `bun remove`, `bun update`, and `bunx`.
- Do not create `package-lock.json`, `pnpm-lock.yaml`, or `yarn.lock`.
- Keep each phase independently revertible.
- Commit messages must be English Conventional Commits.
- Do not run `bunx shadcn@latest add sidebar` against this repository.
- Treat `components/ui/sidebar.tsx` and `hooks/use-sidebar-resize.ts` as the core
  fork. Any codemod touching them requires manual diff review.
- Preserve the existing sidebar cookies: `sidebar:state` and `sidebar:width`.
- Preserve server-side cookie seeding in `components/providers/index.tsx`.

## Approved Decisions

- Keep the current tooltip colors for this upgrade. Do not adopt the upstream
  `bg-foreground text-background` tooltip colors in phase 3.
- Defer Next.js 16 until phase 5. If phase 5 runs, keep `unstable_cache` by
  default unless current Next.js 16 docs or validation require a migration.
- Defer the resize hook rewrite until phases 0-4 have been completed and
  reviewed.
- Defer TypeScript 6, ESLint 10, and `lucide-react` 1.x until after the main
  upgrade path is stable.
- Phase 2 may align Next.js 15 patch versions when keeping `next` and
  `eslint-config-next` on the same 15.3.x line.

## Phase 0 Baseline

- [x] Created branch: `codex/upgrade-2026-06`.
- [x] Confirmed package manager state: Bun 1.3.1, Node v24.14.0, and only
  `bun.lockb` exists.
- [x] Ran `bun install`.
  - Result: succeeded and installed 364 packages.
  - Note: Bun rewrote `bun.lockb`; this will be carried with dependency changes
    in a later phase rather than committed as a standalone baseline change.
- [x] Ran `bun run build`.
  - Result: exited 0 and generated the production build.
  - Baseline warning: Next.js reported an ESLint rule-load failure while building:
    `@typescript-eslint/no-unused-expressions` could not read
    `allowShortCircuit`.
  - Baseline warning: `metadataBase` is not set for Open Graph/Twitter image
    resolution.
- [x] Ran `bun run lint`.
  - Result: failed with the same `@typescript-eslint/no-unused-expressions`
    rule-load error in `app/actions/github.ts`.
- [x] Started dev server at `http://localhost:3000`.
- [x] Ran Agent Browser smoke checks.
  - Page identity: title `shadcn-resizable-sidebar`, URL
    `http://localhost:3000/`.
  - Initial desktop render: sidebar and sample content were visible.
  - Click collapse: passed; `data-state` changed to `collapsed` and
    `sidebar:state=false` was written.
  - Keyboard shortcut: passed with `Control+b`; sidebar returned to `expanded`
    and `sidebar:state=true` was written.
  - Drag resize: passed; width changed from `16rem` to `20.6rem`, and
    `sidebar:width=20.6rem` was written.
  - Reload persistence: passed; server-rendered width restored to `20.6rem`.
  - Theme state: passed; `next-themes` persisted and restored `light` and `dark`.
  - Dropdown animation: failed as expected; computed animation was `none` / `0s`
    despite `animate-in` and related classes being present.
  - Tooltip animation: failed as expected; computed animation was `none` / `0s`.
  - Mobile Sheet: opened at 390px width, but computed animation was `none` / `0s`.
  - Mobile Sheet accessibility: failed as expected; Radix reported missing
    `DialogTitle` and missing description warnings.
- [x] Captured baseline screenshots under
  `/tmp/shadcn-resizable-sidebar-upgrade/phase0/`.

## Phase 1: Minimal Real Fixes

- [ ] Fix the sidebar token alias in `app/globals.css`.
- [ ] Fix `transition-[margin,opa]` to use `opacity`.
- [ ] Remove invalid `hsl()` wrapping around sidebar OKLCH tokens.
- [ ] Add `tw-animate-css` and import it after `@import "tailwindcss";`.
- [ ] Remove unused `@radix-ui/react-icons`.
- [ ] Re-run build and Agent Browser smoke checks.
- [ ] Commit with `fix: repair sidebar tokens and animations`.

## Phase 2: Low-Risk Dependency Alignment

- [ ] Keep Next.js on the 15.3.x line.
- [ ] Align `next` and `eslint-config-next` to the same 15.3.x patch.
- [ ] Update Tailwind v4 packages within the v4 line.
- [ ] Update `tailwind-merge` within the v3 line.
- [ ] Update `next-themes` within the v0 line.
- [ ] Refresh React 19 lockfile resolution without moving to a React major.
- [ ] Re-run build and Agent Browser smoke checks.
- [ ] Commit with `chore: align low-risk dependencies`.

## Phase 3: Port Official Sidebar Fixes Without Resize Changes

- [ ] Add accessible mobile Sheet title and description.
- [ ] Add upstream `data-slot` attributes while preserving existing
  `data-sidebar` attributes.
- [ ] Change the sidebar trigger to `size-7` and `PanelLeftIcon`.
- [ ] Port the upstream `SidebarMenuSubItem` wrapper.
- [ ] Simplify `SidebarInset` to the upstream `w-full flex-1` shape after
  validating layout.
- [ ] Keep current tooltip colors.
- [ ] Only remove the custom `SidebarInput` focus ring if the current Input
  primitive provides an equivalent focus-visible ring.
- [ ] Re-run build and Agent Browser smoke checks.
- [ ] Commit with `refactor: align sidebar primitive fixes`.

## Phase 4: Radix Single-Package Migration

- [ ] Migrate Radix imports to the unified `radix-ui` package.
- [ ] Manually review any diff touching `components/ui/sidebar.tsx`.
- [ ] Convert `Slot` usage to `Slot.Root` after the unified package lands.
- [ ] Remove scattered `@radix-ui/react-*` dependencies only after imports are
  migrated.
- [ ] Re-run build and Agent Browser smoke checks.
- [ ] Commit with `chore: migrate radix primitives`.

## Deferred Phases

- Phase 5: Next.js 16, including the lint script migration and a fresh
  documentation check for `unstable_cache`.
- Phase 6: resize hook modernization after separate review.
- Phase 7: TypeScript 6, ESLint 10, and `lucide-react` 1.x after the main
  upgrade is stable.
