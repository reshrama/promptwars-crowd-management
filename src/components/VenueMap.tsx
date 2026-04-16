import React from 'react';
import { motion } from 'framer-motion';

interface ZoneProps {
    id: string;
    d: string;
    density: number; // 0-100
    label: string;
}

const Zone = ({ id, d, density, label }: ZoneProps) => {
    // Map density to color (emerald -> amber -> rose)
    const getColor = (val: number) => {
        if (val < 30) return '#10b981'; // Green
        if (val < 70) return '#f59e0b'; // Amber
        return '#f43f5e'; // Rose
    };

    return (
        <g className="group cursor-pointer" role="listitem" aria-label={`${label} density: ${density}%`}>
            <motion.path
                d={d}
                initial={false}
                animate={{
                    fill: getColor(density),
                    fillOpacity: 0.2 + (density / 100) * 0.6,
                }}
                className="transition-colors duration-500 hover:fill-opacity-90 stroke-[#ffffff20] stroke-2"
                transition={{ duration: 1 }}
                tabIndex={0}
                aria-label={`${label} area`}
            />
            <text
                x="50%"
                y="50%"
                textAnchor="middle"
                className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none fill-white text-[8px] font-bold uppercase tracking-tighter"
                transform={id === 'north' ? 'translate(0, -60)' : id === 'south' ? 'translate(0, 60)' : id === 'east' ? 'translate(80, 0)' : 'translate(-80, 0)'}
                aria-hidden="true"
            >
                {label}: {density}%
            </text>
        </g>
    );
};

export default function VenueMap({ densities }: { densities: { [key: string]: number } }) {
    return (
        <div className="w-full h-full relative flex-center p-4">
            <svg viewBox="0 0 400 300" className="w-full h-full max-h-[400px]">
                {/* Stadium Outline */}
                <rect x="50" y="50" width="300" height="200" rx="100" fill="none" stroke="#6366f1" strokeWidth="4" strokeDasharray="8 4" opacity="0.3" />

                {/* Field */}
                <rect x="120" y="100" width="160" height="100" rx="10" fill="#22c55e20" stroke="#22c55e40" strokeWidth="2" />

                {/* Sectors */}
                <Zone id="north" d="M 120 50 Q 200 20 280 50 L 280 90 L 120 90 Z" density={densities.north || 20} label="North Stand" />
                <Zone id="south" d="M 120 250 Q 200 280 280 250 L 280 210 L 120 210 Z" density={densities.south || 20} label="South Stand" />
                <Zone id="east" d="M 290 100 Q 330 150 290 200 L 350 200 Q 390 150 350 100 Z" density={densities.east || 20} label="East Wing" />
                <Zone id="west" d="M 110 100 Q 70 150 110 200 L 50 200 Q 10 150 50 100 Z" density={densities.west || 20} label="West Wing" />

                {/* Gates */}
                <circle cx="200" cy="40" r="5" fill={densities.gates > 70 ? '#f43f5e' : '#10b981'} className="pulse-indicator" />
                <circle cx="200" cy="260" r="5" fill={densities.exits > 70 ? '#f43f5e' : '#10b981'} />
            </svg>

            <div className="absolute bottom-4 left-4 glass p-3 rounded-lg flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Low</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500" /> Moderate</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-500" /> Critical</div>
            </div>
        </div>
    );
}
