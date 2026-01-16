# Satellite Orbital Visualization

Interactive 3D visualization of satellites orbiting Earth. Built for a satellite thermal imaging company to demonstrate orbital mechanics to clients and stakeholders.

![Satellite visualization](docs/assets/screenshot.png)

## What It Does

- Visualize a satellite orbiting Earth in real-time 3D
- Switch between orbit types (Dawn-Dusk SSO, Polar, ISS, and more)
- Control satellite attitude (roll, pitch, yaw)
- Adjust time scale to speed up or slow down the simulation
- Interactive camera to explore from any angle

## Why Dawn-Dusk Orbits?

Thermal imaging satellites often use **Sun-Synchronous Orbits (SSO)** with a dawn-dusk configuration. This keeps the satellite flying along the terminator (day/night boundary), providing:

- Consistent twilight lighting conditions
- Solar panels always illuminated
- Minimal thermal variation on imaging targets

## Getting Started

### Using Nix (Recommended)

For a reproducible development environment:

1. Install Nix using the [Determinate Systems Nix Installer](https://zero-to-nix.com/start/install/)
2. Enter the development shell:

```bash
nix develop
```

1. Install dependencies and start the dev server:

```bash
pnpm install
pnpm dev
```

Open <http://localhost:4000> in your browser.

## Controls

| Control            | Description                                     |
| ------------------ | ----------------------------------------------- |
| **Play/Pause**     | Start or stop the orbital simulation            |
| **Time Scale**     | Speed up time (1x to 100x)                      |
| **Orbit Type**     | Switch between different orbital configurations |
| **Roll/Pitch/Yaw** | Rotate the satellite's orientation              |
| **Mouse drag**     | Rotate camera view                              |
| **Scroll**         | Zoom in/out                                     |

## Orbit Types

| Orbit             | Inclination | Use Case                  |
| ----------------- | ----------- | ------------------------- |
| Dawn-Dusk SSO     | 98°         | Primary thermal imaging   |
| Mid-Morning SSO   | 98°         | Combined optical/thermal  |
| Noon-Midnight SSO | 98°         | Thermal anomaly detection |
| Polar             | 90°         | Global mapping            |
| ISS               | 51.6°       | CubeSat deployments       |
| LEO               | 45°         | Technology demos          |
| Equatorial        | 0°          | Tropical monitoring       |

## Tech Stack

React, Three.js (via React Three Fiber), TypeScript, Vite

See `docs/ARCHITECTURE.md` for full details.
