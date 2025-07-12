import env from './env.config';

export const API_PREFIX = env.API_VERSION || 'v1';

export const DEFAULT_RATE_LIMIT_TTL = 1000 * 60 * 60 * 15; //15 MINS, throtller TTL is in milliseconds

export const DEFAULT_RATE_LIMIT_REQUESTS = 1000; //15 MINS, throtller TTL is in milliseconds
