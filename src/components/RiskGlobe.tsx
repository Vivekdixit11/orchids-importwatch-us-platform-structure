'use client';

import { useEffect, useRef, useMemo } from 'react';
import createGlobe from 'cobe';
import { countryHotspots } from '@/lib/mock-data';

export function RiskGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const markers = useMemo(() => {
    return countryHotspots.map(hotspot => ({
      location: [hotspot.coordinates[1], hotspot.coordinates[0]] as [number, number],
      size: Math.min(hotspot.count / 100, 0.8),
    }));
  }, []);

  useEffect(() => {
    let phi = 0;
    let width = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onResize = () => {
      if (canvas) {
        width = canvas.offsetWidth;
      }
    };
    window.addEventListener('resize', onResize);
    onResize();

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 3,
      mapSamples: 16000,
      mapBrightness: 1.2,
      baseColor: [0.15, 0.15, 0.15],
      markerColor: [1, 0.6, 0.2],
      glowColor: [0.1, 0.1, 0.1],
      markers,
      onRender: (state) => {
        state.phi = phi;
        phi += 0.003;
        state.width = width * 2;
        state.height = width * 2;
      },
    });

    return () => {
      globe.destroy();
      window.removeEventListener('resize', onResize);
    };
  }, [markers]);

  return (
    <div className="relative aspect-square w-full">
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        style={{ contain: 'layout paint size' }}
      />
      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex flex-wrap gap-2">
          {countryHotspots.slice(0, 4).map(hotspot => (
            <div
              key={hotspot.code}
              className="flex items-center gap-1.5 rounded-full bg-zinc-900/80 px-2.5 py-1 text-xs backdrop-blur"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              <span className="text-zinc-400">{hotspot.country}</span>
              <span className="font-mono text-amber-500">{hotspot.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
