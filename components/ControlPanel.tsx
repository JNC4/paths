'use client';

import React from 'react';
import { ViewMode, ContextMode } from './Canvas';
import { PhysicsMode } from '@/lib/physics';
import { motion } from 'framer-motion';

interface ControlPanelProps {
  viewMode: ViewMode;
  contextMode: ContextMode;
  physicsMode: PhysicsMode;
  onViewModeChange: (mode: ViewMode) => void;
  onContextModeChange: (mode: ContextMode) => void;
  onPhysicsModeChange: (mode: PhysicsMode) => void;
  onClearAll: () => void;
  onAddRandom: () => void;
  onPreset: (preset: string) => void;
  onExport: () => void;
}

export default function ControlPanel({
  viewMode,
  contextMode,
  physicsMode,
  onViewModeChange,
  onContextModeChange,
  onPhysicsModeChange,
  onClearAll,
  onAddRandom,
  onPreset,
  onExport,
}: ControlPanelProps) {
  const Button = ({ active, onClick, children, color = 'blue' }: any) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-4 py-2 rounded font-mono text-sm transition-all ${
        active
          ? color === 'blue'
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
            : color === 'green'
            ? 'bg-green-600 text-white shadow-lg shadow-green-500/50'
            : color === 'purple'
            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
            : 'bg-gray-600 text-white shadow-lg shadow-gray-500/50'
          : 'bg-navy-light text-gray-400 hover:text-white border border-gray-700'
      }`}
    >
      {children}
    </motion.button>
  );

  return (
    <div className="fixed top-0 left-0 right-0 bg-navy/95 backdrop-blur-sm border-b border-gray-800 z-10">
      {/* Context Mode Selector */}
      <div className="flex items-center justify-center gap-4 py-3 border-b border-gray-800">
        <Button active={contextMode === 'abstract'} onClick={() => onContextModeChange('abstract')} color="purple">
          ABSTRACT
        </Button>
        <Button active={contextMode === 'city'} onClick={() => onContextModeChange('city')} color="purple">
          CITY PLANNING
        </Button>
        <Button active={contextMode === 'biology'} onClick={() => onContextModeChange('biology')} color="purple">
          BIOLOGY
        </Button>
      </div>

      {/* Main Controls */}
      <div className="px-6 py-3">
        <div className="flex items-center justify-between gap-6">
          {/* View Mode */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400 font-mono text-xs uppercase tracking-wider mr-2">View:</span>
            <Button active={viewMode === 'voronoi'} onClick={() => onViewModeChange('voronoi')}>
              Voronoi
            </Button>
            <Button active={viewMode === 'delaunay'} onClick={() => onViewModeChange('delaunay')}>
              Delaunay
            </Button>
            <Button active={viewMode === 'both'} onClick={() => onViewModeChange('both')}>
              Both
            </Button>
            <Button active={viewMode === 'mst'} onClick={() => onViewModeChange('mst')} color="green">
              MST
            </Button>
            <Button active={viewMode === 'gabriel'} onClick={() => onViewModeChange('gabriel')} color="purple">
              Gabriel
            </Button>
          </div>

          {/* Physics Mode */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400 font-mono text-xs uppercase tracking-wider mr-2">Physics:</span>
            <Button active={physicsMode === 'static'} onClick={() => onPhysicsModeChange('static')}>
              Static
            </Button>
            <Button active={physicsMode === 'drift'} onClick={() => onPhysicsModeChange('drift')}>
              Drift
            </Button>
            <Button active={physicsMode === 'repel'} onClick={() => onPhysicsModeChange('repel')}>
              Repel
            </Button>
            <Button active={physicsMode === 'attract'} onClick={() => onPhysicsModeChange('attract')}>
              Attract
            </Button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button active={false} onClick={onClearAll} color="gray">
              Clear All
            </Button>
            <Button active={false} onClick={onAddRandom} color="gray">
              Random
            </Button>
            <Button active={false} onClick={() => onPreset('grid')} color="gray">
              Grid
            </Button>
            <Button active={false} onClick={() => onPreset('spiral')} color="gray">
              Spiral
            </Button>
            <Button active={false} onClick={() => onPreset('circle')} color="gray">
              Circle
            </Button>
            <Button active={false} onClick={onExport} color="gray">
              Export PNG
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
