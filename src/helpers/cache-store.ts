const cache = new Map<string, any>();

export function getFromCache(key: string): any {
  return cache.get(key);
}

export function saveToCache(key: string, value: any, ttl = 60_000): void {
  cache.set(key, value);

  // Optional: Set TTL
  setTimeout(() => {
    cache.delete(key);
  }, ttl);
}
