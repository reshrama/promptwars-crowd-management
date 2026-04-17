/**
 * Offline Resiliency Service
 * Implements a Cache-Aside pattern for stadium crowd data.
 * Ensures fans in low-signal sectors have access to the last known metrics.
 */

const CACHE_NAME = 'crowdsync-metrics-v1';

export const cacheCrowdData = async (data: any) => {
    if ('caches' in window) {
        try {
            const cache = await caches.open(CACHE_NAME);
            const response = new Response(JSON.stringify(data), {
                headers: { 'Content-Type': 'application/json' }
            });
            await cache.put('/api/crowd-data', response);
        } catch (e) {
            console.warn('Cache API unavailable');
        }
    }
};

export const getCachedCrowdData = async () => {
    if ('caches' in window) {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match('/api/crowd-data');
        if (cachedResponse) {
            return await cachedResponse.json();
        }
    }
    return null;
};
