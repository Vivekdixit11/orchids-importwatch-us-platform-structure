'use client';

import { countryHotspots } from '@/lib/mock-data';

export function WorldMap() {
  const maxCount = Math.max(...countryHotspots.map(h => h.count));

  return (
    <div className="relative aspect-[2/1] w-full overflow-hidden rounded-xl bg-gradient-to-b from-slate-100 to-slate-50 dark:from-zinc-900 dark:to-zinc-950">
      <svg
        viewBox="0 0 1000 500"
        className="h-full w-full"
        style={{ background: 'transparent' }}
      >
        <defs>
          <radialGradient id="hotspot-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgb(245, 158, 11)" stopOpacity="0.8" />
            <stop offset="50%" stopColor="rgb(239, 68, 68)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="rgb(239, 68, 68)" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <path
          d="M150,120 L200,100 L250,110 L300,95 L350,100 L380,120 L400,140 L420,130 L450,150 L470,145 L500,160 L550,150 L600,155 L650,145 L700,155 L750,140 L800,150 L850,130 L880,145 L900,160 L920,200 L900,250 L880,300 L850,350 L800,380 L750,400 L700,390 L650,410 L600,400 L550,420 L500,410 L450,430 L400,420 L350,440 L300,430 L250,450 L200,440 L150,460 L100,450 L80,400 L60,350 L50,300 L60,250 L80,200 L100,150 Z"
          fill="none"
          className="stroke-slate-300 dark:stroke-zinc-700"
          strokeWidth="1"
          opacity="0.3"
        />

        <g className="fill-slate-200 dark:fill-zinc-800 stroke-slate-300 dark:stroke-zinc-700" strokeWidth="0.5">
          <path d="M100,180 L180,150 L220,170 L200,220 L140,230 Z" />
          <path d="M220,180 L320,140 L380,160 L420,200 L380,260 L300,280 L240,250 Z" />
          <path d="M200,280 L280,260 L340,290 L320,350 L250,380 L180,340 Z" />
          <path d="M430,100 L520,80 L580,100 L560,160 L490,180 L440,150 Z" />
          <path d="M560,90 L650,70 L720,100 L700,160 L620,180 L570,140 Z" />
          <path d="M720,80 L820,90 L880,130 L860,200 L780,220 L720,170 Z" />
          <path d="M600,200 L700,180 L780,220 L820,280 L780,340 L700,360 L620,320 L590,260 Z" />
          <path d="M820,250 L900,230 L950,280 L940,350 L880,380 L820,340 Z" />
          <path d="M700,380 L800,360 L860,400 L840,450 L760,470 L700,440 Z" />
        </g>

        {countryHotspots.map((hotspot) => {
          const x = ((hotspot.coordinates[0] + 180) / 360) * 1000;
          const y = ((90 - hotspot.coordinates[1]) / 180) * 500;
          const size = (hotspot.count / maxCount) * 40 + 15;
          
          return (
            <g key={hotspot.code}>
              <circle
                cx={x}
                cy={y}
                r={size}
                fill="url(#hotspot-gradient)"
                className="animate-pulse"
                style={{ animationDuration: `${2 + Math.random() * 2}s` }}
              />
              <circle
                cx={x}
                cy={y}
                r={size * 0.3}
                className="fill-amber-500"
                filter="url(#glow)"
              />
              <circle
                cx={x}
                cy={y}
                r={4}
                className="fill-white"
              />
            </g>
          );
        })}

        <g className="opacity-0 hover:opacity-100 transition-opacity">
          {countryHotspots.map((hotspot) => {
            const x = ((hotspot.coordinates[0] + 180) / 360) * 1000;
            const y = ((90 - hotspot.coordinates[1]) / 180) * 500;
            
            return (
              <g key={`label-${hotspot.code}`} transform={`translate(${x}, ${y - 30})`}>
                <rect
                  x="-40"
                  y="-12"
                  width="80"
                  height="24"
                  rx="4"
                  className="fill-zinc-900 dark:fill-white"
                  opacity="0.9"
                />
                <text
                  textAnchor="middle"
                  className="fill-white dark:fill-zinc-900 text-[10px] font-semibold"
                  y="4"
                >
                  {hotspot.country}: {hotspot.count}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      <div className="absolute bottom-3 left-3 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-xs font-medium text-slate-600 dark:text-zinc-400">High Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-amber-500/50" />
          <span className="text-xs font-medium text-slate-600 dark:text-zinc-400">Medium Risk</span>
        </div>
      </div>

      <div className="absolute right-3 top-3 rounded-lg bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm px-3 py-2 shadow-sm">
        <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Global Hotspots</p>
        <p className="text-[10px] text-slate-500 dark:text-zinc-500">{countryHotspots.length} countries monitored</p>
      </div>
    </div>
  );
}
