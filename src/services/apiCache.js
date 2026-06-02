// apiCache.js - Transparent client-side API caching and request deduplication
const cache = new Map();
const inflightRequests = new Map();

// Default Cache TTL: 2 minutes (120,000 ms)
const DEFAULT_TTL = 120000;

export const invalidateCache = () => {
  cache.clear();
  inflightRequests.clear();
};

export const prefetchUrl = (url, options = {}) => {
  const fullUrl = url.startsWith('/') ? url : `/api/${url}`;
  window.fetch(fullUrl, options).catch(err => 
    console.warn(`[ApiCache] Prefetch background fetch failed for ${fullUrl}:`, err)
  );
};

export const initializeFetchCache = () => {
  const originalFetch = window.fetch;

  window.fetch = async function (url, options = {}) {
    const urlString = typeof url === 'string' ? url : (url.href || url.url || '');
    const method = (options.method || 'GET').toUpperCase();

    // Intercept only local API endpoints
    const isLocalApi = urlString.includes('/api/') || urlString.startsWith('/api/');

    if (!isLocalApi) {
      return originalFetch(url, options);
    }

    // Auto-invalidate entire cache on state-changing requests (POST, PUT, DELETE)
    if (['POST', 'PUT', 'DELETE'].includes(method)) {
      invalidateCache();
      return originalFetch(url, options);
    }

    // Cache key incorporates URL, headers, and body for exact matching
    const cacheKey = `${urlString}_${options.headers ? JSON.stringify(options.headers) : ''}_${options.body || ''}`;

    // 1. Check completed cache
    const cachedEntry = cache.get(cacheKey);
    if (cachedEntry) {
      const isExpired = Date.now() - cachedEntry.timestamp > DEFAULT_TTL;
      if (!isExpired) {
        return cachedEntry.response.clone();
      }
    }

    // 2. Check if identical request is already in-flight
    if (inflightRequests.has(cacheKey)) {
      const inflightPromise = inflightRequests.get(cacheKey);
      const clonedResponse = await inflightPromise;
      return clonedResponse.clone();
    }

    // 3. Otherwise, create a new request and register it as in-flight
    const fetchPromise = (async () => {
      try {
        const response = await originalFetch(url, options);
        if (response.ok) {
          cache.set(cacheKey, {
            response: response.clone(),
            timestamp: Date.now()
          });
        }
        return response;
      } finally {
        inflightRequests.delete(cacheKey);
      }
    })();

    inflightRequests.set(cacheKey, fetchPromise);
    const finalResponse = await fetchPromise;
    return finalResponse.clone();
  };
};
