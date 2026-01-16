# Satellite Orbital Simulation Specifications

## Purpose

Visualization tool for nano satellite thermal imaging missions. Demonstrates orbital mechanics and Sun-satellite geometry for different orbit types.

---

## Coordinate System

- **Origin**: Earth center
- **X-axis**: Points toward Sun (positive)
- **Y-axis**: North pole (positive)
- **Z-axis**: Completes right-hand system

---

## Scene Scale (Demo, Not Real)

| Element            | Scene Units | Real World  | Scale Factor    |
| ------------------ | ----------- | ----------- | --------------- |
| Earth radius       | 1.0         | 6,371 km    | 1:6371          |
| Satellite altitude | 0.42–0.66   | ~400–600 km | Exaggerated 10x |
| Sun distance       | 15.0        | 150M km     | Compressed      |
| Sun radius         | 1.5         | 696,000 km  | Compressed      |

Altitude is exaggerated for visibility. Sun distance compressed for framing.

---

## Orbital Parameters

### Inclination (i)

Angle between orbital plane and equatorial plane.

- 0° = Equatorial (orbits above equator)
- 90° = Polar (passes over poles)
- 98° = Sun-synchronous (precesses to match Earth's orbit around Sun)

### Orbital Period (T)

Time for one complete orbit. At ~500 km altitude: ~94.5 minutes (5,667 seconds).

Formula: `T = 2π × sqrt(a³/μ)` where a = semi-major axis, μ = Earth's gravitational parameter.

### LTAN (Local Time of Ascending Node)

For sun-synchronous orbits, defines when satellite crosses equator going northbound in local solar time.

- **06:00** = Dawn crossing → orbit plane perpendicular to Sun
- **12:00** = Noon crossing → orbit plane aligned with Sun

### RAAN (Right Ascension of Ascending Node)

Angle from reference direction to ascending node, measured in equatorial plane.

Conversion from LTAN: `RAAN = (LTAN_hours - 12) × 15°`

- LTAN 06:00 → RAAN = -90°
- LTAN 12:00 → RAAN = 0°

---

## Orbit Types

### 1. Dawn-Dusk SSO (Primary)

| Parameter   | Value              |
| ----------- | ------------------ |
| Inclination | 98°                |
| LTAN        | 06:00              |
| RAAN        | -90°               |
| Period      | 5,667s             |
| Altitude    | 500 km (1.0x base) |

**Characteristics**: Satellite flies along terminator (day/night boundary). Constant twilight illumination. Solar panels always lit. Optimal for thermal imaging—minimal thermal variation on target.

### 2. Mid-Morning SSO

| Parameter   | Value              |
| ----------- | ------------------ |
| Inclination | 98°                |
| LTAN        | 10:30              |
| RAAN        | -22.5°             |
| Period      | 5,667s             |
| Altitude    | 500 km (1.0x base) |

**Characteristics**: Standard Earth observation orbit (Landsat, Sentinel-2). Good solar illumination for optical sensors with usable thermal contrast.

### 3. Noon-Midnight SSO

| Parameter   | Value              |
| ----------- | ------------------ |
| Inclination | 98°                |
| LTAN        | 12:00              |
| RAAN        | 0°                 |
| Period      | 5,667s             |
| Altitude    | 500 km (1.0x base) |

**Characteristics**: Passes over subsolar and antisolar points. Maximum illumination contrast. High thermal gradients between passes.

### 4. Polar Orbit

| Parameter   | Value              |
| ----------- | ------------------ |
| Inclination | 90°                |
| LTAN        | N/A                |
| Period      | 5,740s             |
| Altitude    | 550 km (1.1x base) |

**Characteristics**: Exact polar passage. Full Earth coverage over time. Not sun-synchronous—lighting conditions vary.

### 5. ISS Orbit

| Parameter   | Value               |
| ----------- | ------------------- |
| Inclination | 51.6°               |
| LTAN        | N/A                 |
| Period      | 5,490s              |
| Altitude    | 420 km (0.84x base) |

**Characteristics**: Matches International Space Station. Common for CubeSat deployments. Covers latitudes ±51.6°.

### 6. Low Earth Orbit (LEO)

| Parameter   | Value              |
| ----------- | ------------------ |
| Inclination | 45°                |
| LTAN        | N/A                |
| Period      | 5,550s             |
| Altitude    | 450 km (0.9x base) |

**Characteristics**: General purpose mid-inclination orbit. Good for technology demos and communications at mid-latitudes.

### 7. Equatorial Orbit

| Parameter   | Value              |
| ----------- | ------------------ |
| Inclination | 0°                 |
| LTAN        | N/A                |
| Period      | 5,667s             |
| Altitude    | 500 km (1.0x base) |

**Characteristics**: Zero inclination. Only covers equatorial regions. Useful for tropical monitoring or GEO transfer staging.

---

## Sun-Synchronous Orbit (SSO) Geometry

SSO maintains constant Sun angle by precessing at the same rate as Earth orbits the Sun (~1°/day).

Required inclination depends on altitude:

```
i ≈ 96° + (altitude_km / 250)°
```

At 500 km: i ≈ 98°

### LTAN Visual Effect

```
        Sun [+X]
           ↓
    ┌──────●──────┐
    │      │      │
    │   ┌──┴──┐   │
    │   │Earth│   │
    │   └──┬──┘   │
    │      │      │
    └──────┴──────┘

LTAN 12:00         LTAN 06:00
Orbit aligned      Orbit perpendicular
with Sun           to Sun (terminator)
```

---

## Position Calculation

Satellite position on inclined, rotated orbital plane:

```typescript
// Inputs
orbitalAngle  // θ: 0 to 2π, current position in orbit
inclination   // i: orbital plane tilt from equator
raan          // Ω: rotation of orbital plane around Y-axis
radius        // r: Earth radius + altitude

// Position in orbital plane (before RAAN rotation)
x' = cos(θ) × r
y' = sin(θ) × sin(i) × r
z' = sin(θ) × cos(i) × r

// Apply RAAN rotation around Y-axis
x = x' × cos(Ω) + z' × sin(Ω)
y = y'
z = -x' × sin(Ω) + z' × cos(Ω)
```

---

## Earth Rotation

### Physical Parameters

| Parameter          | Value                 | Notes                               |
| ------------------ | --------------------- | ----------------------------------- |
| Sidereal day       | 86,164 s (23h 56m 4s) | One full rotation relative to stars |
| Solar day          | 86,400 s (24h)        | Noon to noon                        |
| Rotation rate      | 7.292 × 10⁻⁵ rad/s    | 360° / sidereal day                 |
| Axial tilt         | 23.44°                | Angle from orbital plane normal     |
| Rotation direction | Counter-clockwise     | Viewed from north pole              |

### Simulation Model

Use **sidereal day** for rotation (more accurate for satellite observations).

**Rotation formula:**

```
earth_rotation = (elapsed_time / SIDEREAL_DAY) × 2π
```

**Simplified** (no axial tilt):

```typescript
// Apply as Y-axis rotation
<mesh rotation={[0, earthRotation, 0]}>
```

**With axial tilt** (optional):

```typescript
// Tilt Earth's axis, then rotate
<group rotation={[0, 0, AXIAL_TILT]}>
  <mesh rotation={[0, earthRotation, 0]}>
</group>
```

### Initial Orientation

At `elapsed_time = 0`:

- Prime Meridian (0° longitude) faces +X (toward Sun)
- This means GMT noon at simulation start

### Rotation vs Orbital Period Comparison

| Time Scale | Earth Rotation (per real second) | Orbit Period (real time) |
| ---------- | -------------------------------- | ------------------------ |
| 1x         | 0.004°/s                         | 94 min                   |
| 500x       | 2.1°/s                           | 11 s                     |
| 1500x      | 6.3°/s                           | 3.8 s                    |

At 500x, Earth completes one rotation in ~172 real seconds.
Satellite completes ~15 orbits per Earth day.

---

## Earth-Sun Geometry

### Real World Parameters

| Parameter            | Value            | Notes              |
| -------------------- | ---------------- | ------------------ |
| Earth orbital period | 365.25 days      | One year           |
| Orbital rate         | 0.986°/day       | 360° / 365.25 days |
| Earth-Sun distance   | 149.6M km (1 AU) | Average            |
| Axial tilt           | 23.44°           | Causes seasons     |

### Sun-Synchronous Precession

SSO satellites maintain constant Sun angle through **nodal precession** caused by Earth's equatorial bulge (J2 perturbation).

```
Precession rate ≈ -1.5 × J2 × (R_earth/a)² × n × cos(i)

Where:
  J2 = 1.083 × 10⁻³ (Earth's oblateness coefficient)
  a = semi-major axis
  n = mean motion (orbital angular velocity)
  i = inclination
```

At 500 km altitude, inclination ~98° produces precession of ~0.986°/day eastward—matching Earth's orbital rate around the Sun.

### Seasonal Effects (Real World)

| Season          | Sun Declination | Effect on SSO                     |
| --------------- | --------------- | --------------------------------- |
| Summer solstice | +23.44°         | Sun higher in northern hemisphere |
| Winter solstice | -23.44°         | Sun higher in southern hemisphere |
| Equinoxes       | 0°              | Sun directly over equator         |

Dawn-dusk SSO satellites experience varying twilight angle through the year but maintain consistent local solar time.

### Simulation Simplification

The simulation **fixes the Sun at +X axis** because:

1. **Visual clarity** — Earth's yearly orbit adds complexity without benefit for demonstrating satellite mechanics
2. **SSO behavior implicit** — Orbit plane stays fixed relative to Sun, which is the effect SSO achieves
3. **Focus on mission geometry** — Thermal imaging relevance depends on satellite-Earth-Sun angle, not seasonal variation
4. **Performance** — No need to calculate yearly position updates

To add seasonal simulation, would require:

- Earth position: `[cos(day/365.25 × 2π) × AU, 0, sin(day/365.25 × 2π) × AU]`
- Or equivalently: Sun position rotating around Earth
- Axial tilt affecting illumination angle

---

## Earth Texture

### Required Assets

| Texture  | Purpose        | Resolution | Source           |
| -------- | -------------- | ---------- | ---------------- |
| Day map  | Surface color  | 4K–8K      | NASA Blue Marble |
| Bump map | Terrain relief | 4K         | NASA/USGS        |

### NASA Blue Marble

Free, public domain imagery from NASA Visible Earth.

**Recommended files:**

- `earth_daymap.jpg` — Color texture
- `earth_bump.jpg` — Grayscale height map

**UV Mapping:**

- Standard equirectangular projection
- 0° longitude at horizontal center
- North pole at top

### Texture Application

```typescript
// Load textures
const dayMap = useTexture('/textures/earth_daymap.jpg')
const bumpMap = useTexture('/textures/earth_bump.jpg')

// Apply to sphere
<meshStandardMaterial
  map={dayMap}
  bumpMap={bumpMap}
  bumpScale={0.05}
/>
```

### Coordinate Alignment

Texture longitude 0° (center of image) aligns with:

- Mesh local +Z axis (Three.js default for spheres)
- Rotate mesh -90° on Y to align with +X (toward Sun at start)

```typescript
// Initial rotation offset to align Prime Meridian with Sun
const INITIAL_ROTATION_OFFSET = -Math.PI / 2
earthRotation = INITIAL_ROTATION_OFFSET + (elapsedTime / SIDEREAL_DAY) * 2 * Math.PI
```

---

## Time Simulation

| Parameter           | Default | Range          |
| ------------------- | ------- | -------------- |
| Time scale          | 500x    | 1x – 1500x     |
| Base orbital period | 5,667s  | Per orbit type |
| Sidereal day        | 86,164s | Earth rotation |

At 500x: One orbit ≈ 11 real seconds, one Earth day ≈ 172 real seconds.
At 1500x: One orbit ≈ 3.8 real seconds, one Earth day ≈ 57 real seconds.

---

## Thermal Imaging Relevance

| Orbit             | Thermal Advantage                      | Use Case                  |
| ----------------- | -------------------------------------- | ------------------------- |
| Dawn-Dusk SSO     | Minimal variation, consistent twilight | Primary thermal imaging   |
| Mid-Morning SSO   | Moderate thermal contrast              | Combined optical/thermal  |
| Noon-Midnight SSO | Maximum thermal gradient               | Thermal anomaly detection |
| Polar             | Variable, full coverage                | Global mapping priority   |
| ISS               | Variable, limited latitude             | CubeSat deployments       |
| LEO               | Variable, mid-latitude                 | Technology demos          |
| Equatorial        | Tropical only                          | Equatorial monitoring     |

---

## Simplifications

1. **Sun position fixed** at [+X] — no yearly Earth orbit or seasonal variation
2. **No axial tilt** — Earth's rotation axis aligned with Y (no 23.44° tilt)
3. **Altitude exaggerated** — real LEO barely visible at true scale
4. **Circular orbits only** — no eccentricity
5. **No orbital decay** — perfect Keplerian motion
6. **No Earth oblateness** — simplified gravity model (J2 effects implicit in SSO inclination)
