'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Point, VoronoiDiagram } from '@/lib/voronoi';
import { PhysicsSimulation, PhysicsMode } from '@/lib/physics';

export type ViewMode = 'voronoi' | 'delaunay' | 'both' | 'mst' | 'gabriel';
export type ContextMode = 'abstract' | 'city' | 'biology';

interface CanvasProps {
  viewMode: ViewMode;
  contextMode: ContextMode;
  physicsMode: PhysicsMode;
  points: Point[];
  onPointsChange: (points: Point[]) => void;
}

export default function Canvas({ viewMode, contextMode, physicsMode, points, onPointsChange }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const [draggingPoint, setDraggingPoint] = useState<Point | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<Point | null>(null);
  const physicsRef = useRef<PhysicsSimulation>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 100;

    physicsRef.current = new PhysicsSimulation(canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    if (physicsRef.current) {
      physicsRef.current.mode = physicsMode;
    }
  }, [physicsMode]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update physics
    let currentPoints = points;
    if (physicsMode !== 'static' && !draggingPoint && physicsRef.current) {
      currentPoints = physicsRef.current.update(points);
      onPointsChange(currentPoints);
    }

    if (currentPoints.length === 0) return;

    const diagram = new VoronoiDiagram(currentPoints, canvas.width, canvas.height);

    // Draw based on view mode
    if (viewMode === 'voronoi' || viewMode === 'both') {
      drawVoronoi(ctx, diagram);
    }

    if (viewMode === 'delaunay' || viewMode === 'both') {
      drawDelaunay(ctx, diagram);
    }

    if (viewMode === 'mst') {
      drawMST(ctx, diagram);
    }

    if (viewMode === 'gabriel') {
      drawGabriel(ctx, diagram);
    }

    // Draw points
    drawPoints(ctx, currentPoints, contextMode);

    // Continue animation
    if (physicsMode !== 'static' || contextMode === 'biology') {
      animationFrameRef.current = requestAnimationFrame(render);
    }
  }, [points, viewMode, contextMode, physicsMode, draggingPoint, onPointsChange]);

  useEffect(() => {
    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [render]);

  const drawVoronoi = (ctx: CanvasRenderingContext2D, diagram: VoronoiDiagram) => {
    const cells = diagram.getVoronoiCells();

    cells.forEach(cell => {
      const path = new Path2D(cell.path);

      // Fill
      ctx.fillStyle = cell.color + '66'; // 40% opacity
      ctx.fill(path);

      // Stroke
      ctx.strokeStyle = '#64B5F6';
      ctx.lineWidth = 1.5;
      ctx.stroke(path);
    });
  };

  const drawDelaunay = (ctx: CanvasRenderingContext2D, diagram: VoronoiDiagram) => {
    const edges = diagram.getDelaunayEdges();

    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 1;
    ctx.beginPath();

    edges.forEach(edge => {
      ctx.moveTo(edge.source.x, edge.source.y);
      ctx.lineTo(edge.target.x, edge.target.y);
    });

    ctx.stroke();
  };

  const drawMST = (ctx: CanvasRenderingContext2D, diagram: VoronoiDiagram) => {
    const edges = diagram.getMST();

    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 3;
    ctx.beginPath();

    edges.forEach(edge => {
      ctx.moveTo(edge.source.x, edge.source.y);
      ctx.lineTo(edge.target.x, edge.target.y);
    });

    ctx.stroke();
  };

  const drawGabriel = (ctx: CanvasRenderingContext2D, diagram: VoronoiDiagram) => {
    const edges = diagram.getGabrielGraph();

    ctx.strokeStyle = '#9C27B0';
    ctx.lineWidth = 2;
    ctx.beginPath();

    edges.forEach(edge => {
      ctx.moveTo(edge.source.x, edge.source.y);
      ctx.lineTo(edge.target.x, edge.target.y);
    });

    ctx.stroke();
  };

  const drawPoints = (ctx: CanvasRenderingContext2D, points: Point[], mode: ContextMode) => {
    points.forEach(point => {
      const isHovered = hoveredPoint?.id === point.id;
      const isDragging = draggingPoint?.id === point.id;

      if (mode === 'abstract') {
        // Simple dot
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#64B5F6';
        ctx.shadowBlur = isHovered || isDragging ? 15 : 8;

        ctx.beginPath();
        ctx.arc(point.x, point.y, isHovered || isDragging ? 8 : 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
      } else if (mode === 'city') {
        // Building icons
        const icons = ['🏥', '🏫', '🏪', '🏛️'];
        const icon = icons[Math.abs(point.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % icons.length];

        ctx.font = isHovered || isDragging ? '32px Arial' : '24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(icon, point.x, point.y);
      } else if (mode === 'biology') {
        // Pulsing cells
        const time = Date.now() / 1000;
        const pulse = Math.sin(time * 2 + point.x + point.y) * 0.3 + 1;
        const radius = (isHovered || isDragging ? 10 : 8) * pulse;

        const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius);
        gradient.addColorStop(0, '#7FFF00');
        gradient.addColorStop(0.5, '#00CED1');
        gradient.addColorStop(1, '#9370DB');

        ctx.fillStyle = gradient;
        ctx.shadowColor = '#00CED1';
        ctx.shadowBlur = 15;

        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
      }
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const diagram = new VoronoiDiagram(points, canvas.width, canvas.height);
    const nearest = diagram.findNearestPoint(x, y, 20);

    if (nearest) {
      setDraggingPoint(nearest);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (draggingPoint) {
      const updatedPoints = points.map(p =>
        p.id === draggingPoint.id ? { ...p, x, y, vx: 0, vy: 0 } : p
      );
      onPointsChange(updatedPoints);
      render();
    } else {
      const diagram = new VoronoiDiagram(points, canvas.width, canvas.height);
      const nearest = diagram.findNearestPoint(x, y, 20);
      setHoveredPoint(nearest);
      render();
    }
  };

  const handleMouseUp = () => {
    setDraggingPoint(null);
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (draggingPoint) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const diagram = new VoronoiDiagram(points, canvas.width, canvas.height);
    const nearest = diagram.findNearestPoint(x, y, 20);

    if (!nearest) {
      const newPoint: Point = {
        id: `point-${Date.now()}-${Math.random()}`,
        x,
        y,
        vx: 0,
        vy: 0,
      };
      onPointsChange([...points, newPoint]);
    }
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const diagram = new VoronoiDiagram(points, canvas.width, canvas.height);
    const nearest = diagram.findNearestPoint(x, y, 20);

    if (nearest) {
      onPointsChange(points.filter(p => p.id !== nearest.id));
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className="cursor-crosshair"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      style={{ display: 'block' }}
    />
  );
}
