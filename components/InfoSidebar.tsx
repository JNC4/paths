'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ViewMode, ContextMode } from './Canvas';
import { Point } from '@/lib/voronoi';

interface InfoSidebarProps {
  contextMode: ContextMode;
  viewMode: ViewMode;
  points: Point[];
}

export default function InfoSidebar({ contextMode, viewMode, points }: InfoSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  const getContextInfo = () => {
    switch (contextMode) {
      case 'abstract':
        return {
          title: 'Abstract Mathematics',
          description: 'Pure geometric visualization of spatial relationships between points.',
          applications: [
            'Computational geometry',
            'Mesh generation',
            'Pattern recognition',
            'Data visualization',
            'Computer graphics',
          ],
        };
      case 'city':
        return {
          title: 'City Planning',
          description: 'Analyze service areas and infrastructure networks for urban development.',
          applications: [
            'Emergency service coverage (hospitals, fire stations)',
            'School district planning',
            'Utility network optimization',
            'Transportation route planning',
            'Retail market analysis',
          ],
        };
      case 'biology':
        return {
          title: 'Biological Systems',
          description: 'Model cellular territories and organic network formation.',
          applications: [
            'Cell territory analysis',
            'Neural network mapping',
            'Leaf vein structure',
            'Slime mold growth patterns',
            'Animal habitat boundaries',
          ],
        };
    }
  };

  const getViewInfo = () => {
    switch (viewMode) {
      case 'voronoi':
        return 'Voronoi regions: Each cell contains all points closer to its center than to any other center.';
      case 'delaunay':
        return 'Delaunay triangulation: Connects points such that no point is inside the circumcircle of any triangle.';
      case 'both':
        return '⚡ Mathematical duality: Voronoi edges cross Delaunay edges at exactly 90°. Two perspectives of the same structure.';
      case 'mst':
        return 'Minimum Spanning Tree: The shortest network connecting all points. Found in nature: leaf veins, river deltas, slime molds.';
      case 'gabriel':
        return 'Gabriel Graph: A subset of Delaunay edges where the circle through endpoints contains no other points.';
    }
  };

  const info = getContextInfo();

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            className="fixed right-0 top-24 bottom-4 w-80 bg-navy-light/95 backdrop-blur-sm border-l border-gray-800 overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-2">{info.title}</h2>
                <p className="text-sm text-gray-400">{info.description}</p>
              </div>

              {/* Current View Info */}
              <div className="mb-6 p-4 bg-navy/50 border border-gray-700 rounded">
                <h3 className="text-xs font-mono uppercase tracking-wider text-blue-400 mb-2">Current View</h3>
                <p className="text-sm text-gray-300">{getViewInfo()}</p>
              </div>

              {/* Statistics */}
              <div className="mb-6">
                <h3 className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-3">Statistics</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Points:</span>
                    <span className="text-white font-mono">{points.length}</span>
                  </div>
                  {points.length >= 3 && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Triangles:</span>
                        <span className="text-white font-mono">{Math.max(0, (points.length - 2) * 2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Edges:</span>
                        <span className="text-white font-mono">{Math.max(0, points.length * 3 - 6)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Applications */}
              <div className="mb-6">
                <h3 className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-3">Applications</h3>
                <ul className="space-y-2">
                  {info.applications.map((app, i) => (
                    <li key={i} className="text-sm text-gray-300 flex items-start">
                      <span className="text-blue-400 mr-2">▸</span>
                      <span>{app}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Controls Help */}
              <div className="p-4 bg-navy/50 border border-gray-700 rounded">
                <h3 className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-3">Controls</h3>
                <div className="space-y-2 text-xs text-gray-300">
                  <div><span className="text-blue-400">Click:</span> Add point</div>
                  <div><span className="text-blue-400">Drag:</span> Move point</div>
                  <div><span className="text-blue-400">Right-click:</span> Delete point</div>
                  <div><span className="text-blue-400">V/D/B:</span> Toggle views</div>
                  <div><span className="text-blue-400">M:</span> MST mode</div>
                  <div><span className="text-blue-400">G:</span> Gabriel mode</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-4 top-32 z-20 bg-navy-light border border-gray-700 p-2 rounded hover:bg-gray-800 transition-colors"
      >
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? '' : 'rotate-180'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </motion.button>
    </>
  );
}
