import { describe, it, expect } from 'vitest';
import { getCrowdData } from './crowdSimulator';

describe('crowdSimulator', () => {
    it('should return high gate density in PRE_GAME phase', () => {
        const data = getCrowdData('PRE_GAME');
        expect(data.zones.gates).toBeGreaterThanOrEqual(80);
        expect(data.stats.totalAttendance).toBeGreaterThan(0);
    });

    it('should return high seating density in LIVE phase', () => {
        const data = getCrowdData('LIVE');
        expect(data.zones.seating).toBeGreaterThanOrEqual(90);
        expect(data.bottlenecks.length).toBeGreaterThan(0);
    });

    it('should return high concourse density in HALFTIME phase', () => {
        const data = getCrowdData('HALFTIME');
        expect(data.zones.concourse).toBeGreaterThanOrEqual(80);
    });

    it('should return high exit density in POST_GAME phase', () => {
        const data = getCrowdData('POST_GAME');
        expect(data.zones.exits).toBeGreaterThanOrEqual(90);
    });
});
