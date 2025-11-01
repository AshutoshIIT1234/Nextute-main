import { useMemo } from 'react';
import axios from 'axios';
import { apiCache } from '../utils/apiCache';
import { sanitizeInput } from '../utils/securityHeaders';

export const useOptimizedAxios = () => {
  const api = useMemo(() => {
    const instance = axios.create({
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // Request interceptor for caching and security
    instance.interceptors.request.use(
      (config) => {
        // Sanitize request data
        if (config.data && typeof config.data === 'object') {
          Object.keys(config.data).forEach(key => {
            if (typeof config.data[key] === 'string') {
              config.data[key] = sanitizeInput(config.data[key]);
            }
          });
        }

        // Check cache for GET requests
        if (config.method === 'get') {
          const cacheKey = `${config.url}${JSON.stringify(config.params || {})}`;
          const cachedData = apiCache.get(cacheKey);
          if (cachedData) {
            return Promise.reject({
              __CACHED_RESPONSE__: cachedData,
              config
            });
          }
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for caching
    instance.interceptors.response.use(
      (response) => {
        // Cache GET responses
        if (response.config.method === 'get') {
          const cacheKey = `${response.config.url}${JSON.stringify(response.config.params || {})}`;
          apiCache.set(cacheKey, response.data);
        }
        return response;
      },
      (error) => {
        // Handle cached responses
        if (error.__CACHED_RESPONSE__) {
          return Promise.resolve({
            data: error.__CACHED_RESPONSE__,
            status: 200,
            statusText: 'OK (Cached)',
            config: error.config
          });
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, []);

  return api;
};

export default useOptimizedAxios;