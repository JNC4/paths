import { Point } from './voronoi';

export type PhysicsMode = 'static' | 'drift' | 'repel' | 'attract';

export class PhysicsSimulation {
  mode: PhysicsMode = 'static';
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  update(points: Point[]): Point[] {
    switch (this.mode) {
      case 'drift':
        return this.applyDrift(points);
      case 'repel':
        return this.applyRepulsion(points);
      case 'attract':
        return this.applyAttraction(points);
      default:
        return points;
    }
  }

  private applyDrift(points: Point[]): Point[] {
    return points.map(p => {
      const vx = (p.vx || 0) + (Math.random() - 0.5) * 0.5;
      const vy = (p.vy || 0) + (Math.random() - 0.5) * 0.5;

      const damping = 0.95;
      const dampedVx = vx * damping;
      const dampedVy = vy * damping;

      let x = p.x + dampedVx;
      let y = p.y + dampedVy;

      const margin = 20;
      if (x < margin || x > this.width - margin) {
        x = Math.max(margin, Math.min(this.width - margin, x));
      }
      if (y < margin || y > this.height - margin) {
        y = Math.max(margin, Math.min(this.height - margin, y));
      }

      return { ...p, x, y, vx: dampedVx, vy: dampedVy };
    });
  }

  private applyRepulsion(points: Point[]): Point[] {
    const repulsionStrength = 500;
    const minDistance = 50;

    return points.map(p => {
      let fx = 0;
      let fy = 0;

      points.forEach(other => {
        if (other.id === p.id) return;

        const dx = p.x - other.x;
        const dy = p.y - other.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        if (dist < minDistance) {
          const force = repulsionStrength / (dist * dist);
          fx += (dx / dist) * force;
          fy += (dy / dist) * force;
        }
      });

      const vx = (p.vx || 0) + fx * 0.01;
      const vy = (p.vy || 0) + fy * 0.01;

      const damping = 0.9;
      const dampedVx = vx * damping;
      const dampedVy = vy * damping;

      let x = p.x + dampedVx;
      let y = p.y + dampedVy;

      const margin = 20;
      x = Math.max(margin, Math.min(this.width - margin, x));
      y = Math.max(margin, Math.min(this.height - margin, y));

      return { ...p, x, y, vx: dampedVx, vy: dampedVy };
    });
  }

  private applyAttraction(points: Point[]): Point[] {
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const attractionStrength = 0.002;

    return points.map(p => {
      const dx = centerX - p.x;
      const dy = centerY - p.y;

      const vx = (p.vx || 0) + dx * attractionStrength;
      const vy = (p.vy || 0) + dy * attractionStrength;

      const damping = 0.95;
      const dampedVx = vx * damping;
      const dampedVy = vy * damping;

      const x = p.x + dampedVx;
      const y = p.y + dampedVy;

      return { ...p, x, y, vx: dampedVx, vy: dampedVy };
    });
  }
}
