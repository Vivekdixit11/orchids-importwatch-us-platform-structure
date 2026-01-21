'use client';

import { useEffect, useRef, useState } from 'react';
import createGlobe from 'cobe';
import { countryHotspots } from '@/lib/mock-data';
import { useTheme } from 'next-themes';

export function InteractiveGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const [rotation, setRotation] = useState(0);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const markers = countryHotspots.map(hotspot => ({
    location: [hotspot.coordinates[1], hotspot.coordinates[0]] as [number, number],
    size: Math.min(hotspot.count / 150, 0.6),
  }));

  useEffect(() => {
    if (!canvasRef.current || !mounted) return;

    let phi = 0;
    let width = 0;
    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };
    window.addEventListener('resize', onResize);
    onResize();

    const isDark = resolvedTheme === 'dark';

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.25,
      dark: isDark ? 1 : 0,
      diffuse: isDark ? 2 : 1.2,
      mapSamples: 20000,
      mapBrightness: isDark ? 6 : 1.5,
      baseColor: isDark ? [0.15, 0.15, 0.18] : [0.95, 0.95, 0.98],
      markerColor: [0.95, 0.6, 0.2],
      glowColor: isDark ? [0.08, 0.08, 0.12] : [0.9, 0.9, 0.95],
      markers,
      onRender: (state) => {
        if (!pointerInteracting.current) {
          phi += 0.004;
        }
        state.phi = phi + rotation;
        state.width = width * 2;
        state.height = width * 2;
      },
    });

    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = '1';
      }
    }, 100);

    return () => {
      globe.destroy();
      window.removeEventListener('resize', onResize);
    };
  }, [rotation, resolvedTheme, mounted, markers]);

  if (!mounted) {
    return (
      <div className="relative aspect-square w-full flex items-center justify-center bg-slate-100 dark:bg-zinc-900 rounded-xl">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative aspect-square w-full">
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
          if (canvasRef.current) {
            canvasRef.current.style.cursor = 'grabbing';
          }
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) {
            canvasRef.current.style.cursor = 'grab';
          }
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) {
            canvasRef.current.style.cursor = 'grab';
          }
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
            setRotation(delta / 200);
          }
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
            setRotation(delta / 100);
          }
        }}
        className="h-full w-full cursor-grab opacity-0 transition-opacity duration-500"
        style={{ contain: 'layout paint size' }}
      />
      
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
        {countryHotspots.slice(0, 4).map(hotspot => (
          <div
            key={hotspot.code}
            className="flex items-center gap-1.5 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm px-2.5 py-1 text-xs border border-slate-200 dark:border-zinc-700 shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-slate-600 dark:text-zinc-400">{hotspot.country}</span>
            <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{hotspot.count}</span>
          </div>
        ))}
      </div>

      <div className="absolute right-3 top-3 rounded-lg bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm px-3 py-2 shadow-sm border border-slate-200 dark:border-zinc-700">
        <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Global Risk Map</p>
        <p className="text-[10px] text-slate-500 dark:text-zinc-500">Drag to rotate • Live data</p>
      </div>
    </div>
  );
}
