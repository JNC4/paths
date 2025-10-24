import { Point } from './voronoi';

export function generatePresetPoints(preset: string, width: number, height: number): Point[] {
  const points: Point[] = [];

  switch (preset) {
    case 'grid':
      const gridSize = 5;
      const cellWidth = width / (gridSize + 1);
      const cellHeight = height / (gridSize + 1);
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          points.push({
            id: `grid-${i}-${j}`,
            x: cellWidth * (i + 1),
            y: cellHeight * (j + 1),
          });
        }
      }
      break;

    case 'spiral':
      const count = 30;
      const goldenAngle = Math.PI * (3 - Math.sqrt(5));
      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.min(width, height) * 0.4;

      for (let i = 0; i < count; i++) {
        const angle = i * goldenAngle;
        const radius = maxRadius * Math.sqrt(i / count);
        points.push({
          id: `spiral-${i}`,
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
        });
      }
      break;

    case 'random':
      const randomCount = 20;
      const margin = 50;
      for (let i = 0; i < randomCount; i++) {
        points.push({
          id: `random-${i}`,
          x: margin + Math.random() * (width - margin * 2),
          y: margin + Math.random() * (height - margin * 2),
        });
      }
      break;

    case 'circle':
      const circleCount = 12;
      const circleCenterX = width / 2;
      const circleCenterY = height / 2;
      const circleRadius = Math.min(width, height) * 0.35;

      for (let i = 0; i < circleCount; i++) {
        const angle = (i / circleCount) * Math.PI * 2;
        points.push({
          id: `circle-${i}`,
          x: circleCenterX + circleRadius * Math.cos(angle),
          y: circleCenterY + circleRadius * Math.sin(angle),
        });
      }
      break;
  }

  return points;
}
