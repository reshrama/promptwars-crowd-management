export type EventPhase = 'PRE_GAME' | 'LIVE' | 'HALFTIME' | 'POST_GAME';

export interface CrowdData {
    zones: {
        gates: number;      // 0-100 density
        concourse: number;
        seating: number;
        exits: number;
    };
    sectorDensities: {
        north: number;
        south: number;
        east: number;
        west: number;
        gates: number;
        exits: number;
    };
    bottlenecks: {
        id: string;
        area: string;
        waitMinutes: number;
        level: 'high' | 'med' | 'low';
    }[];
    stats: {
        totalAttendance: number;
        peakFlow: number;
        staffEfficiency: number;
    };
}

export const getCrowdData = (phase: EventPhase): CrowdData => {
    switch (phase) {
        case 'PRE_GAME':
            return {
                zones: { gates: 85, concourse: 40, seating: 20, exits: 5 },
                sectorDensities: { north: 70, south: 40, east: 50, west: 30, gates: 85, exits: 5 },
                bottlenecks: [
                    { id: '1', area: 'Gate G (Main)', waitMinutes: 24, level: 'high' },
                    { id: '2', area: 'Security Line North', waitMinutes: 12, level: 'med' },
                    { id: '3', area: 'Ticket App Check', waitMinutes: 4, level: 'low' },
                ],
                stats: { totalAttendance: 32400, peakFlow: 850, staffEfficiency: 92 },
            };
        case 'LIVE':
            return {
                zones: { gates: 5, concourse: 15, seating: 95, exits: 2 },
                sectorDensities: { north: 95, south: 92, east: 98, west: 90, gates: 5, exits: 2 },
                bottlenecks: [
                    { id: '1', area: 'Concourse A (Beer)', waitMinutes: 6, level: 'low' },
                    { id: '2', area: 'Restroom East', waitMinutes: 4, level: 'low' },
                ],
                stats: { totalAttendance: 48200, peakFlow: 120, staffEfficiency: 98 },
            };
        case 'HALFTIME':
            return {
                zones: { gates: 5, concourse: 90, seating: 30, exits: 5 },
                sectorDensities: { north: 40, south: 30, east: 35, west: 25, gates: 5, exits: 5 },
                bottlenecks: [
                    { id: '1', area: 'Concourse C (Food)', waitMinutes: 18, level: 'high' },
                    { id: '2', area: 'Restroom B (North)', waitMinutes: 14, level: 'high' },
                    { id: '3', area: 'Merch Stand', waitMinutes: 8, level: 'med' },
                ],
                stats: { totalAttendance: 48500, peakFlow: 940, staffEfficiency: 82 },
            };
        case 'POST_GAME':
            return {
                zones: { gates: 5, concourse: 60, seating: 10, exits: 92 },
                sectorDensities: { north: 10, south: 5, east: 15, west: 8, gates: 5, exits: 95 },
                bottlenecks: [
                    { id: '1', area: 'Stairwell South', waitMinutes: 15, level: 'high' },
                    { id: '2', area: 'Exit Gate B', waitMinutes: 8, level: 'med' },
                    { id: '3', area: 'Parking Shuttle', waitMinutes: 20, level: 'high' },
                ],
                stats: { totalAttendance: 47100, peakFlow: 1200, staffEfficiency: 78 },
            };
        default:
            return getCrowdData('PRE_GAME');
    }
};
