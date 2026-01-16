# AGENTS.md

Instructions for AI coding agents working with this codebase.

## Development Environment

This project uses **Nix** for reproducible development environments. Use `nix develop` to enter the development shell with all dependencies pre-configured.

See `flake.nix` for the development environment setup.

## Commands

```bash
nix develop       # Enter development shell (if using Nix)
pnpm dev          # Start dev server
pnpm build        # Type-check + production build
pnpm check-types  # TypeScript only
pnpm lint         # Biome lint + auto-fix
```

## Documentation

| Doc                        | Content                                       |
| -------------------------- | --------------------------------------------- |
| `docs/ARCHITECTURE.md`     | Tech stack, project structure, state, routing |
| `docs/DESIGN.md`           | Design system, fluid design, tokens           |
| `docs/SIMULATION_SPECS.md` | Orbital mechanics, position calculations      |
| `docs/TODO.md`             | Task tracking                                 |

## Domain Context

Satellite visualization for a **nano satellite thermal imaging company**. Focus: **Dawn-Dusk Sun-Synchronous Orbits (SSO)**.

- **LTAN**: Local Time of Ascending Node
- **Terminator**: Day/night boundary
- **Dawn-dusk orbit**: LTAN ~06:00/18:00, flies along terminator

<!-- opensrc:start -->

## Source Code Reference

Dependency source code available in `opensrc/`. See `opensrc/sources.json` for packages.

```bash
pnpm opensrc <package>           # npm package
pnpm opensrc <owner>/<repo>      # GitHub repo
```

<!-- opensrc:end -->

## Conventions

**Files**: `snake_case` for all filenames in `src/`

**TypeScript**: No `as T`, no `any`. Fix all type errors before committing.

**Styling**: Use tokens from `src/styles/tokens.css`. See `docs/DESIGN.md` for reference.

**Patterns**: Follow existing code in each directory. See `docs/ARCHITECTURE.md` for structure.

## Skills

- **write-commits**: Generates git commit messages following repository conventions. See `.cursor/skills/write-commits/SKILL.md` for full details.

## Common Tasks

**Add orbit type**:

1. `src/physics/orbits.ts` — add parameters
2. `src/components/ui/orbit_selector.tsx` — add to selector

**Add UI control**:

1. Create in `src/components/ui/` with `.css` file
2. Add to `control_panel.tsx`

**Add scene element**:

1. Create in `src/components/scene/`
2. Add to `scene.tsx`

## Task Tracking

Update `docs/TODO.md` as you complete work.
