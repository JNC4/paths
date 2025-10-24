'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Canvas, { ViewMode, ContextMode } from '@/components/Canvas';
import ControlPanel from '@/components/ControlPanel';
import InfoSidebar from '@/components/InfoSidebar';
import { Point } from '@/lib/voronoi';
import { PhysicsMode } from '@/lib/physics';
import { generatePresetPoints } from '@/lib/presets';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [points, setPoints] = useState<Point[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('both');
  const [contextMode, setContextMode] = useState<ContextMode>('abstract');
  const [physicsMode, setPhysicsMode] = useState<PhysicsMode>('static');
  const [showTooltip, setShowTooltip] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>();

  // Initialize with a few points
  useEffect(() => {
    const initialPoints: Point[] = [
      { id: 'init-1', x: 400, y: 300, vx: 0, vy: 0 },
      { id: 'init-2', x: 800, y: 300, vx: 0, vy: 0 },
      { id: 'init-3', x: 600, y: 500, vx: 0, vy: 0 },
    ];
    setPoints(initialPoints);

    // Hide tooltip after 5 seconds
    const timer = setTimeout(() => setShowTooltip(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'v':
          setViewMode('voronoi');
          break;
        case 'd':
          setViewMode('delaunay');
          break;
        case 'b':
          setViewMode('both');
          break;
        case 'm':
          setViewMode('mst');
          break;
        case 'g':
          setViewMode('gabriel');
          break;
        case 'c':
          if (e.ctrlKey || e.metaKey) return; // Don't interfere with copy
          setPoints([]);
          break;
        case 'r':
          handleAddRandom();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // URL sharing - encode/decode points
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      try {
        const decoded = JSON.parse(decodeURIComponent(hash));
        if (Array.isArray(decoded) && decoded.length > 0) {
          setPoints(decoded);
        }
      } catch (e) {
        // Invalid hash, ignore
      }
    }
  }, []);

  useEffect(() => {
    // Skip URL updates during physics mode to prevent browser throttling
    if (physicsMode !== 'static') return;

    if (points.length > 0) {
      const encoded = encodeURIComponent(JSON.stringify(points.map(p => ({
        id: p.id,
        x: Math.round(p.x),
        y: Math.round(p.y),
      }))));
      window.history.replaceState(null, '', `#${encoded}`);
    }
  }, [points, physicsMode]);

  const handleClearAll = () => {
    setPoints([]);
  };

  const handleAddRandom = () => {
    const width = window.innerWidth;
    const height = window.innerHeight - 100;
    const newPoints = generatePresetPoints('random', width, height);
    setPoints([...points, ...newPoints]);
  };

  const handlePreset = (preset: string) => {
    const width = window.innerWidth;
    const height = window.innerHeight - 100;
    const newPoints = generatePresetPoints(preset, width, height);
    setPoints(newPoints);
  };

  const handleExport = useCallback(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `paths-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-navy">
      {/* Top Control Panel */}
      <ControlPanel
        viewMode={viewMode}
        contextMode={contextMode}
        physicsMode={physicsMode}
        onViewModeChange={setViewMode}
        onContextModeChange={setContextMode}
        onPhysicsModeChange={setPhysicsMode}
        onClearAll={handleClearAll}
        onAddRandom={handleAddRandom}
        onPreset={handlePreset}
        onExport={handleExport}
      />

      {/* Main Canvas */}
      <div className="pt-24">
        <Canvas
          viewMode={viewMode}
          contextMode={contextMode}
          physicsMode={physicsMode}
          points={points}
          onPointsChange={setPoints}
        />
      </div>

      {/* Info Sidebar */}
      <InfoSidebar contextMode={contextMode} viewMode={viewMode} points={points} />

      {/* Educational Tooltip */}
      <AnimatePresence>
        {showTooltip && viewMode === 'both' && points.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-navy-light/95 backdrop-blur-sm border border-blue-500 rounded-lg p-4 max-w-md shadow-lg shadow-blue-500/20"
          >
            <div className="flex items-start gap-3">
              <div className="text-blue-400 text-2xl">⚡</div>
              <div>
                <h3 className="text-white font-bold mb-1">Mathematical Duality</h3>
                <p className="text-sm text-gray-300">
                  Notice: Voronoi edges cross Delaunay edges at exactly 90°. They're mathematical duals - two perspectives of the same structure.
                </p>
              </div>
              <button
                onClick={() => setShowTooltip(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions overlay for empty state */}
      {points.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="bg-navy-light/80 backdrop-blur-sm border border-gray-700 rounded-lg p-8 max-w-md text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Welcome to Paths</h2>
            <p className="text-gray-300 mb-6">
              Click anywhere to add points and explore the mathematical relationship between Voronoi diagrams and Delaunay triangulations.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div>💡 Try a preset to get started</div>
              <div>🎯 Drag points to see real-time updates</div>
              <div>⚡ Enable physics for organic movement</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Branding */}
      <div className="fixed bottom-4 left-4 text-gray-600 font-mono text-xs">
        PATHS v1.0 | VORONOI × DELAUNAY
      </div>
    </main>
  );
}
