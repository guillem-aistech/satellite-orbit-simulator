# TODO

Project tasks and pending work.

## Setup

- [x] Set up TanStack Router with file-based routing
- [x] Set up TanStack Query provider
- [x] Configure Vite with router plugin
- [x] Add Poppins font

## Design Tokens

- [x] Create `tokens.css` with color tokens
- [x] Add spacing tokens (fluid)
- [x] Add typography tokens (fluid)

## Components

- [x] Implement XStack, YStack layout components
- [x] Implement Slider component (Base UI wrapper)
- [x] Implement Toggle component
- [x] Implement Button component
- [x] Implement Readout component
- [x] Implement Tooltip component
- [x] Create ControlPanel container

## 3D Scene

- [x] Set up R3F Canvas with camera
- [x] Implement Earth mesh
- [x] Implement Satellite (body + solar panels)
- [x] Add Lighting (sun directional light)
- [x] Configure shadows (satellite → Earth, panels → body)
- [x] Add OrbitPath visualization (optional)
- [x] Make satellite bigger for demo visibility
- [x] Increase orbital altitude for realistic demo appearance
- [x] Ensure satellite doesn't touch Earth when rotating
- [x] Add Axis indicator (optional)
- [x] Add star background (optional)

## State

- [x] Implement simulation atoms (play/pause, time scale, orbital angle, elapsed time)
- [x] Implement satellite atoms (roll, pitch, yaw)
- [x] Add animation loop for orbital mechanics

## Integration

- [x] Connect control panel to atoms
- [x] Connect 3D scene to atoms
- [x] Add value formatting (time, angles)

## Improvements

- [x] Move SceneToolbar to floating top-right HUD with responsive positioning
- [x] Sync SceneToolbar rotation with camera
- [x] Add collapsible panel with smooth animation
- [x] Fix overflow/scrollbar issues
- [x] Add Sun to scene with glow effect
- [x] Add orbit type selector (Dawn-Dusk SSO, Noon-Midnight SSO, LEO, Polar, ISS, Equatorial)
- [x] Implement inclined orbital planes based on orbit type

## Completed

All tasks completed!
