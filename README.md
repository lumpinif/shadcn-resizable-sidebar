# A shadcn/ui Resizeable Sidebar

An extended shadcn-ui drag-to-resize `<Sidebar>` component for Next.js applications with persisted state, advanced resizing functionality, and VS Code-like behavior.

Demo: [shadcn-resize-sidebar.vercel.app](https://shadcn-resize-sidebar.vercel.app/)

## Features

- 🕶️ Extended everything from shadcn-ui `<Sidebar>`
- 🖱️ Drag to resize sidebar width
- 🔄 Collapsible sidebar with smooth transitions
- 🎨 Theme support (light/dark mode)
- ⌨️ Keyboard shortcuts
- 🍪 Persistent state with cookies
- ✨ Advanced resizing capabilities:
  - 🔍 VS Code-like continuous drag to collapse/expand
  - 📏 Customizable auto-collapse threshold when resizing
  - 🔄 Auto-expand when dragging in opposite direction
  - 🎛️ Configurable minimum and maximum resize widths
  - 🧭 Direction-aware resizing (left/right sidebar support)

## Demo Stack

- Next.js 15
- React 19
- Tailwind v4
- TypeScript
- shadcn/ui

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/lumpinif/shadcn-resizable-sidebar.git
cd shadcn-resizable-sidebar
```

2. Install dependencies:

```bash
bun install
```

3. Run the development server:

```bash
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Contributing

Pull requests are welcome.

## Advanced Resizing Features

The sidebar component includes VS Code-like resizing behavior with the following capabilities:

### Direction-Aware Resizing

The sidebar component supports both left and right-positioned sidebars with appropriate resizing behavior. The resize handle automatically adjusts its behavior based on the sidebar's position.

```typescript
// For a left-positioned sidebar (default)
const { dragRef, handleMouseDown } = useSidebarResize({
  direction: "right", // Resize handle on right side
  // other options...
});

// For a right-positioned sidebar
const { dragRef, handleMouseDown } = useSidebarResize({
  direction: "left", // Resize handle on left side
  // other options...
});
```

### Auto-Collapse and Auto-Expand

The sidebar can automatically collapse when dragged below a certain threshold and expand when dragged in the opposite direction.

```tsx
// Example usage with custom thresholds
<SidebarRail
  enableDrag={true} // Enable drag functionality
/>

// In your SidebarProvider
<SidebarProvider
  defaultWidth="16rem" // Initial width
  defaultOpen={true} // Initially expanded
/>
```

### Customization Options

The `useSidebarResize` hook accepts several configuration options:

```typescript
const { dragRef, handleMouseDown } = useSidebarResize({
  // Direction of resizing ("left" or "right")
  direction: "right",

  // Current width of the sidebar
  currentWidth: width,

  // Callback when width changes
  onResize: setWidth,

  // Callback when sidebar toggles between collapsed/expanded
  onToggle: toggleSidebar,

  // Whether sidebar is currently collapsed
  isCollapsed: state === "collapsed",

  // Minimum resize width (default: "14rem")
  minResizeWidth: "14rem",

  // Maximum resize width (default: "24rem")
  maxResizeWidth: "22rem",

  // Enable auto-collapse functionality (default: true)
  enableAutoCollapse: true,

  // Threshold for auto-collapse (default: 1.5)
  // Values > 1.0: Collapse when dragged beyond minWidth by threshold amount
  // Values <= 1.0: Collapse when width is below minWidth * threshold
  autoCollapseThreshold: 1.5,

  // Threshold for auto-expand when dragging in opposite direction (default: 0.2)
  // Percentage of minWidth needed to drag to trigger expand
  expandThreshold: 0.2,

  // Enable drag functionality (default: true)
  enableDrag: true,

  // Callback to update dragging rail state
  setIsDraggingRail: setIsDraggingRail,

  // Cookie name for persisting width (default: undefined)
  widthCookieName: "sidebar:width",

  // Cookie max age in seconds (default: 1 week)
  widthCookieMaxAge: 60 * 60 * 24 * 7,
});
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
