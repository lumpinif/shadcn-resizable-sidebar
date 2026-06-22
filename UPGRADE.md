# Upgrade Roadmap

This project is a Bun-managed Next.js 16 + React 19 + Tailwind v4 shadcn/ui app
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

- [x] Fix the sidebar token alias in `app/globals.css`.
- [x] Fix `transition-[margin,opa]` to use `opacity`.
- [x] Remove invalid `hsl()` wrapping around sidebar OKLCH tokens.
- [x] Add `tw-animate-css` and import it after `@import "tailwindcss";`.
- [x] Remove unused `@radix-ui/react-icons`.
- [x] Re-run build and Agent Browser smoke checks.
  - `bun run build` still exits 0 with the known baseline ESLint rule-load
    warning and `metadataBase` warning.
  - `bun run lint` still fails with the known baseline
    `@typescript-eslint/no-unused-expressions` rule-load error.
  - Dropdown, tooltip, and mobile Sheet animations now compute real `enter`
    animations instead of `none` / `0s`.
  - Desktop collapse, keyboard shortcut, drag resize, and width cookie behavior
    still pass.
  - Mobile Sheet still reports missing title/description warnings; this remains
    scheduled for phase 3.
- [x] Commit with `fix: repair sidebar tokens and animations`.

## Phase 2: Low-Risk Dependency Alignment

- [x] Keep Next.js on the 15.3.x line.
- [x] Align `next` and `eslint-config-next` to the same 15.3.x patch.
  - Updated both to `15.3.9`.
- [x] Update Tailwind v4 packages within the v4 line.
  - Updated `tailwindcss` and `@tailwindcss/postcss` to `^4.3.1`.
- [x] Update `tailwind-merge` within the v3 line.
  - Updated to `^3.6.0`.
- [x] Update `next-themes` within the v0 line.
  - Updated to `^0.4.6`.
- [x] Refresh React 19 lockfile resolution without moving to a React major.
  - Updated `react` and `react-dom` to `^19.2.7`.
- [x] Re-run build and Agent Browser smoke checks.
  - `bun run build` passes on Next.js 15.3.9 with the known baseline ESLint
    rule-load warning and `metadataBase` warning.
  - `bun run lint` still fails with the known baseline
    `@typescript-eslint/no-unused-expressions` rule-load error.
  - Desktop render, persisted width, dropdown animation, drag resize, and
    mobile Sheet animation pass.
  - Mobile Sheet title/description warnings remain scheduled for phase 3.
- [x] Commit with `chore: align low-risk dependencies`.

## Phase 3: Port Official Sidebar Fixes Without Resize Changes

- [x] Add accessible mobile Sheet title and description.
- [x] Add upstream `data-slot` attributes while preserving existing
  `data-sidebar` attributes.
- [x] Change the sidebar trigger to `size-7` and `PanelLeftIcon`.
- [x] Port the upstream `SidebarMenuSubItem` wrapper.
- [x] Simplify `SidebarInset` to the upstream `w-full flex-1` shape after
  validating layout.
- [x] Keep current tooltip colors.
- [x] Only remove the custom `SidebarInput` focus ring if the current Input
  primitive provides an equivalent focus-visible ring.
  - Verified `components/ui/input.tsx` provides `focus-visible:border-ring`,
    `focus-visible:ring-ring/50`, and `focus-visible:ring-[3px]`.
- [x] Re-run build and Agent Browser smoke checks.
  - `bun run build` passes with the known baseline ESLint rule-load warning and
    `metadataBase` warning.
  - `bun run lint` still fails with the known baseline
    `@typescript-eslint/no-unused-expressions` rule-load error.
  - Desktop `data-slot` attributes were added while core `data-sidebar`
    selectors remained present.
  - Mobile Sheet now includes an sr-only title and description, and Radix
    Dialog title/description console warnings are gone.
  - Desktop keyboard toggle, drag resize, width cookie, and page console/errors
    pass.
- [x] Commit with `refactor: align sidebar primitive fixes`.

## Phase 4: Radix Single-Package Migration

- [x] Migrate Radix imports to the unified `radix-ui` package.
- [x] Manually review any diff touching `components/ui/sidebar.tsx`.
  - The sidebar diff only changes primitive imports and `asChild` slot plumbing.
    Resize state, cookies, drag rail behavior, and width constants are preserved.
- [x] Convert `Slot` usage after the unified package lands.
  - The shadcn migration uses `SlotPrimitive.Slot` from `radix-ui`.
- [x] Remove scattered `@radix-ui/react-*` dependencies only after imports are
  migrated.
- [x] Re-run build and Agent Browser smoke checks.
  - `bun run build` passes with the known baseline ESLint rule-load warning and
    `metadataBase` warning.
  - `bun run lint` still fails with the known baseline
    `@typescript-eslint/no-unused-expressions` rule-load error.
  - Desktop render, dropdown animation, keyboard toggle, drag resize, mobile
    Sheet animation, and mobile Sheet accessibility all pass.
  - Page console and page errors are empty after smoke.
- [x] Commit with `chore: migrate radix primitives`.

## Phase 5: Next.js 16

- [x] Re-check current Next.js 16 documentation before changing code.
  - Official upgrade docs list `bunx @next/codemod@canary upgrade latest`.
  - `next lint` is removed in Next.js 16 and should be migrated to the ESLint
    CLI.
  - `unstable_cache` is replaced by `use cache` in Next.js 16 documentation, but
    it is still documented as an API. This upgrade keeps the existing
    `unstable_cache` call for GitHub stars rather than enabling
    `cacheComponents`.
- [x] Run the official upgrade codemod.
  - Upgraded to Next.js `16.2.9`.
  - Migrated `lint` from `next lint` to `eslint .`.
  - Updated `eslint.config.mjs` to direct `eslint-config-next` flat config
    imports.
  - Updated React type packages to the codemod-selected React 19 versions.
- [x] Fix lint issues exposed by the Next.js 16 ESLint migration.
  - Replaced render-time `Math.random()` in `SidebarMenuSkeleton` with a
    deterministic `useId()`-based width.
  - Replaced `useIsMobile` effect state synchronization with
    `useSyncExternalStore`.
- [x] Set `turbopack.root` in `next.config.ts`.
  - This removes the Next.js 16 workspace-root warning caused by an unrelated
    `/Users/felix/package-lock.json` above the project.
- [x] Re-run validation.
  - `bun run lint` passes.
  - `bun run build` passes on Next.js `16.2.9`; only the existing
    `metadataBase` warning remains.
  - Agent Browser smoke passes for desktop render, dropdown animation, drag
    resize, width cookie, mobile Sheet animation, and mobile Sheet
    accessibility.
- [x] Commit with `chore: upgrade to next 16`.

## Phase 6: Resize Hook Modernization

- [x] Keep the existing public resize behavior.
  - `defaultWidth`, `width`, `setWidth`, `isDraggingRail`,
    `setIsDraggingRail`, `SidebarRail`, `enableDrag`, `useSidebarResize`,
    `sidebar:state`, `sidebar:width`, `data-dragging`, `duration-0`,
    `MIN_SIDEBAR_WIDTH`, and `MAX_SIDEBAR_WIDTH` remain in place.
- [x] Move the drag hot path out of React context state.
  - During drag, `useSidebarResize` writes `--sidebar-width` directly to the
    sidebar wrapper element.
  - React state and `sidebar:width` cookie are committed on pointerup instead
    of every pointermove.
  - The hook keeps a backward-compatible `handleMouseDown` return value for
    external consumers, while `SidebarRail` now uses `onPointerDown`.
- [x] Switch the project path to Pointer Events.
  - `SidebarRail` uses `onPointerDown`.
  - The hook uses pointer id tracking, `setPointerCapture`, pointer cancel
    handling, and temporary `body.style.userSelect = "none"` during drag.
- [x] Use modern ref composition.
  - Replaced `mergeButtonRefs` with Radix `useComposedRefs`.
  - Deleted `lib/merge-button-refs.ts`.
- [x] Remove dead resize refs.
  - Removed the unused `lastWidth`, `lastLoggedWidth`, `dragOffset`,
    `lastToggleWidth`, and `dragStartPoint` bookkeeping.
- [x] Clamp seeded widths before storing them in React state.
  - Cookie-provided `defaultWidth` is clamped to the 14rem-22rem sidebar
    bounds before it becomes provider state.
- [x] Re-run validation.
  - `bun run lint` passes.
  - `bun run build` passes on Next.js `16.2.9`; only the existing
    `metadataBase` warning remains.
  - Agent Browser smoke passes for desktop drag resize, drag-time DOM width
    updates, pointerup cookie commit, max-width clamp, reload persistence,
    click collapse, keyboard expand, drag-to-collapse, drag-to-expand, mobile
    Sheet animation, and mobile Sheet accessibility.
  - Focused React render recording across a continuous drag showed
    `SidebarProvider` re-rendered twice rather than once per pointer move.
  - Screenshots were captured under
    `/tmp/shadcn-resizable-sidebar-upgrade/phase6/`.
- [x] Commit with `refactor: modernize sidebar resize handling`.

## Deferred Phases

- Phase 7: TypeScript 6, ESLint 10, and `lucide-react` 1.x after the main
  upgrade is stable.
