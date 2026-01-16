# Satellite Visualization Architecture

## Tech Stack

| Layer   | Library                  | Docs                                                                                            |
| ------- | ------------------------ | ----------------------------------------------------------------------------------------------- |
| Build   | Vite + TypeScript        | [vite.dev](https://vite.dev/)                                                                   |
| Routing | TanStack Router          | [tanstack.com/router](https://tanstack.com/router/latest)                                       |
| Data    | TanStack Query           | [tanstack.com/query](https://tanstack.com/query/latest)                                         |
| 3D      | React Three Fiber + Drei | [r3f.docs.pmnd.rs](https://r3f.docs.pmnd.rs/) / [drei.docs.pmnd.rs](https://drei.docs.pmnd.rs/) |
| State   | Effect Atom              | [github.com/effect-ts/atom](https://github.com/effect-ts/atom)                                  |
| UI      | Base UI                  | [base-ui.com](https://base-ui.com/)                                                             |
| Linting | Biome                    | [biomejs.dev](https://biomejs.dev/)                                                             |

---

## Project Structure

```
src/
├── main.tsx                    # Application entry point,
│                               # initializes React app and renders root route
├── routeTree.gen.ts            # Auto-generated route tree from
│                               # file-based routing (TanStack Router)
├── routes/                     # File-based routing system
│                               # (TanStack Router)
│                               # Each file corresponds to a route,
│                               # with __root.tsx providing the root layout
│                               # containing global providers
│                               # (React Query, router context, etc.)
├── atoms/                      # Global state management
│                               # using Effect Atom
│                               # Contains reactive atoms for camera state,
│                               # satellite attitude (roll/pitch/yaw),
│                               # and simulation state (time, orbital position,
│                               # play/pause, time scale, orbit type)
│                               # Atoms are consumed via hooks and can be
│                               # derived from other atoms
├── components/
│   ├── scene/                  # 3D scene components built with
│   │                           # React Three Fiber
│   │                           # Contains 3D meshes (Earth, satellite,
│   │                           # sun, stars), lighting setup,
│   │                           # camera controls, HUD overlay
│   │                           # (SceneToolbar with axis gizmo and controls),
│   │                           # orbit path visualization, and animation
│   │                           # controllers that update scene state
│   └── ui/                     # 2D UI components built on
│                               # Base UI primitives
│                               # Contains the main control panel,
│                               # form controls (sliders, toggles, buttons),
│                               # readout displays, layout components
│                               # (stacks), and tooltips
│                               # All styled with design tokens
│                               # from tokens.css
├── physics/                    # Orbital mechanics and satellite
│                               # physics calculations
│                               # Defines orbit types (LEO, SSO, Polar,
│                               # ISS, etc.), physical constants
│                               # (Earth radius, orbital periods), and
│                               # position calculation functions that compute
│                               # satellite position based on orbital angle
│                               # and orbit type
├── styles/                     # Global stylesheets and design
│                               # system tokens
│                               # Contains design tokens (colors, spacing,
│                               # typography) defined as CSS custom properties,
│                               # following the design system documented
│                               # in docs/DESIGN.md
└── utils/                      # Shared utility functions and helpers
                                # Contains formatting functions for time,
                                # angles, and other display values,
                                # as well as general-purpose helper functions
                                # used across the application
```

---

## State Architecture

### Client State (Effect Atom)

- **Simulation atoms**: play/pause, time scale, orbital angle, elapsed time, orbit type
- **Satellite atoms**: roll, pitch, yaw, derived attitude
- **Camera atoms**: camera reference for syncing with HUD

---

## Routing (TanStack Router)

- File-based routing in `src/routes/`
- `__root.tsx` provides root layout with providers
- Type-safe navigation and search params
- Route-level code splitting

---

## Component Architecture

### Scene Layer

- **Scene**: R3F Canvas wrapper with camera, OrbitControls, and scene configuration
- **Earth**: Sphere mesh with standard material, receives shadows
- **Satellite**: Group with body and solar panels, position from orbital angle, rotation from attitude
- **Lighting**: Directional light (sun), shadow configuration
- **Sun**: Sun mesh with glow effect
- **Stars**: Random star background
- **SceneToolbar**: HUD overlay with axis gizmo, reset camera button, and controls help
- **AnimationController**: useFrame loop for orbital position updates

### UI Layer

- **ControlPanel**: Collapsible container for all controls
- **OrbitSelector**: Dropdown for orbit type selection
- **PlayPause**: Play/pause toggle button
- **Slider**: Base UI wrapper for time scale and attitude controls
- **Readout**: Formatted value display
- **Stack**: XStack/YStack layout primitives
- Headless components from @base-ui/react styled with design tokens (see `docs/DESIGN.md`)

---

## Animation Loop

Orbital position updates via `useFrame` from R3F:

```
delta_angle = (2 * PI / orbital_period) * delta_time * time_scale
```

---

## Dependencies

```bash
# Core
pnpm add react react-dom
pnpm add @tanstack/react-router @tanstack/react-query
pnpm add three @react-three/fiber @react-three/drei
pnpm add effect @effect-atom/atom @effect-atom/atom-react
pnpm add @base-ui/react

# Dev
pnpm add -D typescript vite @vitejs/plugin-react
pnpm add -D @tanstack/router-plugin @tanstack/router-devtools
pnpm add -D @types/three @types/react @types/react-dom

# Source context (for AI agents)
pnpm opensrc @tanstack/react-router @effect-atom/atom @base-ui/react
```
