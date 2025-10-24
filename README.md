# Paths

An interactive web application that visualizes Voronoi diagrams and Delaunay triangulations as mathematical duals. Explore the elegant relationship between these fundamental geometric structures through real-time interaction and multiple contextual framings.

## Features

### Core Functionality
- **Interactive Point Manipulation**: Click to add, drag to move, right-click to delete
- **Real-time Computation**: Instant updates using the d3-delaunay library
- **Smooth Animations**: 60fps rendering with physics simulation

### Visualization Modes
- **Voronoi Only**: Colored regions showing spatial partitioning
- **Delaunay Only**: Triangulation network connecting points
- **Both**: Overlay showing 90° perpendicular intersections
- **MST**: Minimum Spanning Tree highlighting optimal connections
- **Gabriel Graph**: Subset of Delaunay edges with special properties

### Context Modes
- **Abstract Mode**: Pure mathematical visualization
- **City Planning Mode**: Urban infrastructure and service areas
- **Biology Mode**: Organic cellular territories with pulsing animation

### Physics Simulation
- **Static**: Points remain fixed
- **Drift**: Brownian motion wandering
- **Repel**: Points push each other away
- **Attract**: Points gravitate toward center

### Additional Features
- **Preset Patterns**: Grid, Spiral, Circle, Random
- **Keyboard Shortcuts**: V (Voronoi), D (Delaunay), B (Both), M (MST), G (Gabriel)
- **URL Sharing**: Point positions encoded in URL hash
- **PNG Export**: Save visualizations as images
- **Educational Sidebar**: Real-time statistics and contextual information

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **d3-delaunay** - Fast Voronoi/Delaunay computation
- **Framer Motion** - Smooth UI animations
- **Tailwind CSS** - Utility-first styling
- **Canvas API** - High-performance rendering

## Getting Started

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Usage

1. **Add Points**: Click anywhere on the canvas
2. **Move Points**: Click and drag existing points
3. **Delete Points**: Right-click on a point
4. **Change Views**: Use buttons in the top control panel
5. **Try Physics**: Enable Drift, Repel, or Attract modes
6. **Use Presets**: Quick-start with Grid, Spiral, or Circle patterns

## Mathematical Background

**Voronoi Diagrams** partition space into regions, where each region contains all points closer to a specific generator point than to any other.

**Delaunay Triangulations** connect points such that no point lies inside the circumcircle of any triangle.

These structures are **mathematical duals**: every edge in the Voronoi diagram corresponds to an edge in the Delaunay triangulation, and they always intersect at 90°.

## Real-World Applications

- **City Planning**: Emergency service coverage, school districts
- **Biology**: Cell territories, neural networks, leaf venation
- **Computer Graphics**: Mesh generation, terrain modeling
- **Computational Geometry**: Nearest neighbor search
- **Nature**: Giraffe patterns, dragonfly wings, foam bubbles

## License

MIT

---

🤖 Built with [Claude Code](https://claude.com/claude-code)
