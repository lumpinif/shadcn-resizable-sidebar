# shadcn/ui Resizable Sidebar

A drop-in enhancement for the shadcn/ui `Sidebar`.

It keeps the original Sidebar API, composition model, variants, and styling
surface, then adds the product behavior most dashboards need: drag resize, rail
click collapse, auto collapse, persisted width, and smooth pointer-driven drag.

Demo: [shadcn-resize-sidebar.vercel.app](https://shadcn-resize-sidebar.vercel.app/)

## Features

- Drag the rail to resize the sidebar.
- Click the same rail to collapse or expand.
- Use <kbd>Cmd</kbd>/<kbd>Ctrl</kbd> + <kbd>B</kbd> to toggle.
- Auto-collapse when the rail is dragged past the threshold.
- Persist width and collapse state across reloads.
- Restore state on the server with `sidebar:state` and `sidebar:width` cookies.
- Keep the normal shadcn/ui Sidebar composition and customization model.
- Use Pointer Events and pointer capture for mouse, pen, and touch input.
- Write live width to `--sidebar-width` during drag, then commit React state and
  cookies on release.
- Keep the mobile Sidebar as an accessible Sheet with title and description.

## Stack

- Next.js `16.2.9`
- React `19.2.7`
- Tailwind CSS `4.3.1`
- shadcn/ui `new-york` style
- Radix UI single package `1.6.0`
- Bun
- TypeScript

## Getting Started

```bash
git clone https://github.com/lumpinif/shadcn-resizable-sidebar.git
cd shadcn-resizable-sidebar
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Steal the Code

This is not a separate component system. Treat it as an enhanced shadcn/ui
Sidebar fork.

The core files are:

- `components/ui/sidebar.tsx`
- `hooks/use-sidebar-resize.ts`
- `components/providers/index.tsx`

Use `components/providers/index.tsx` if you want the demo's server-side cookie
restore behavior. Copy `app/globals.css` if you also want the same shadcn/ui
neutral theme tokens.

## Basic Usage

```tsx
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  return (
    <SidebarProvider defaultWidth="16rem">
      <Sidebar collapsible="icon">
        <SidebarContent>{/* Your existing sidebar content */}</SidebarContent>
        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  )
}
```

`SidebarRail` is the only new interaction surface users need to discover:

- Drag it to resize.
- Click it to collapse or expand.
- Release after dragging to persist the new width.

## Server-Side Restore

The demo reads cookies in a server provider and passes the values into
`SidebarProvider`.

```tsx
import { cookies } from "next/headers"
import { SidebarProvider } from "@/components/ui/sidebar"

const SIDEBAR_COOKIE_KEY = "sidebar"

export async function Providers({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()

  const sidebarState = cookieStore.get(`${SIDEBAR_COOKIE_KEY}:state`)?.value
  const sidebarWidth = cookieStore.get(`${SIDEBAR_COOKIE_KEY}:width`)?.value

  return (
    <SidebarProvider
      cookieKey={SIDEBAR_COOKIE_KEY}
      defaultOpen={sidebarState ? sidebarState === "true" : true}
      defaultWidth={sidebarWidth}
    >
      {children}
    </SidebarProvider>
  )
}
```

By default, the provider writes:

- `sidebar:state`
- `sidebar:width`

Use a different `cookieKey` when a page needs multiple independent sidebars.

## Resizing API

`SidebarProvider` adds:

| Prop | Purpose |
| --- | --- |
| `defaultWidth` | Initial sidebar width. The demo default is `16rem`. |
| `cookieKey` | Prefix for persisted `state` and `width` cookies. |

`SidebarRail` adds:

| Prop | Purpose |
| --- | --- |
| `enableDrag` | Enables or disables drag resize. Defaults to `true`. |
| `direction` | Set to `"right"` for a left sidebar, or `"left"` for a right sidebar. |

The demo sidebar clamps width between `14rem` and `22rem`.

```tsx
<Sidebar side="left">
  <SidebarRail direction="right" />
</Sidebar>

<Sidebar side="right">
  <SidebarRail direction="left" />
</Sidebar>
```

`useSidebarResize` is available if you want to wire the resize behavior to a
different panel, but most apps should use `SidebarProvider` and `SidebarRail`
directly.

## Philosophy

Use the shadcn/ui Sidebar as the base. Keep its structure, slots, variants,
tokens, and customization habits. Add resize as a thin product layer instead of
replacing the component with a different sidebar system.

That means existing Sidebar customizations still work: menu groups, actions,
variants, inset layout, floating layout, icon collapse, keyboard toggle, mobile
Sheet behavior, and semantic Tailwind tokens.

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Star History

<a href="https://www.star-history.com/#lumpinif/shadcn-resizable-sidebar&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=lumpinif/shadcn-resizable-sidebar&type=date&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=lumpinif/shadcn-resizable-sidebar&type=date&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=lumpinif/shadcn-resizable-sidebar&type=date&legend=top-left" />
 </picture>
</a>
