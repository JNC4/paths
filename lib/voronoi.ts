import { Delaunay } from 'd3-delaunay';

export interface Point {
  id: string;
  x: number;
  y: number;
  vx?: number;
  vy?: number;
}

export interface Edge {
  source: Point;
  target: Point;
  length: number;
}

export class VoronoiDiagram {
  private delaunay: Delaunay<Point>;
  private voronoi: any;
  points: Point[];
  width: number;
  height: number;

  constructor(points: Point[], width: number, height: number) {
    this.points = points;
    this.width = width;
    this.height = height;

    if (points.length < 3) {
      // Not enough points for triangulation
      this.delaunay = null as any;
      this.voronoi = null as any;
      return;
    }

    const coords = new Float64Array(points.length * 2);
    points.forEach((p, i) => {
      coords[i * 2] = p.x;
      coords[i * 2 + 1] = p.y;
    });

    this.delaunay = new Delaunay(coords);
    this.voronoi = this.delaunay.voronoi([0, 0, width, height]);
  }

  getVoronoiCells(): { point: Point; path: string; color: string }[] {
    if (!this.voronoi || this.points.length < 3) return [];

    const colors = ['#FFB3BA', '#BAFFC9', '#BAE1FF', '#FFFFBA', '#FFD9BA'];

    return this.points.map((point, i) => ({
      point,
      path: this.voronoi.renderCell(i),
      color: colors[i % colors.length],
    }));
  }

  getDelaunayEdges(): Edge[] {
    if (!this.delaunay || this.points.length < 3) return [];

    const edges: Edge[] = [];
    const triangles = this.delaunay.triangles;

    for (let i = 0; i < triangles.length; i += 3) {
      const p1 = this.points[triangles[i]];
      const p2 = this.points[triangles[i + 1]];
      const p3 = this.points[triangles[i + 2]];

      edges.push(
        { source: p1, target: p2, length: this.distance(p1, p2) },
        { source: p2, target: p3, length: this.distance(p2, p3) },
        { source: p3, target: p1, length: this.distance(p3, p1) }
      );
    }

    return this.uniqueEdges(edges);
  }

  getMST(): Edge[] {
    const edges = this.getDelaunayEdges().sort((a, b) => a.length - b.length);
    const mst: Edge[] = [];
    const parent = new Map<string, string>();

    const find = (id: string): string => {
      if (parent.get(id) !== id) {
        parent.set(id, find(parent.get(id)!));
      }
      return parent.get(id)!;
    };

    const union = (id1: string, id2: string): boolean => {
      const root1 = find(id1);
      const root2 = find(id2);
      if (root1 === root2) return false;
      parent.set(root1, root2);
      return true;
    };

    this.points.forEach(p => parent.set(p.id, p.id));

    for (const edge of edges) {
      if (union(edge.source.id, edge.target.id)) {
        mst.push(edge);
      }
    }

    return mst;
  }

  getGabrielGraph(): Edge[] {
    const delaunayEdges = this.getDelaunayEdges();
    const gabrielEdges: Edge[] = [];

    for (const edge of delaunayEdges) {
      const midX = (edge.source.x + edge.target.x) / 2;
      const midY = (edge.source.y + edge.target.y) / 2;
      const radius = edge.length / 2;

      let isGabriel = true;
      for (const point of this.points) {
        if (point.id === edge.source.id || point.id === edge.target.id) continue;
        const dist = Math.sqrt((point.x - midX) ** 2 + (point.y - midY) ** 2);
        if (dist < radius) {
          isGabriel = false;
          break;
        }
      }

      if (isGabriel) {
        gabrielEdges.push(edge);
      }
    }

    return gabrielEdges;
  }

  private distance(p1: Point, p2: Point): number {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
  }

  private uniqueEdges(edges: Edge[]): Edge[] {
    const seen = new Set<string>();
    return edges.filter(edge => {
      const key = [edge.source.id, edge.target.id].sort().join('-');
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  findNearestPoint(x: number, y: number, threshold: number = 20): Point | null {
    if (!this.delaunay) return null;

    const index = this.delaunay.find(x, y);
    if (index === undefined || index < 0 || index >= this.points.length) return null;

    const point = this.points[index];
    const dist = this.distance(point, { id: '', x, y });

    return dist <= threshold ? point : null;
  }
}
