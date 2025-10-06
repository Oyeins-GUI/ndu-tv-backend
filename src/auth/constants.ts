import { env } from '../config';

export const JWT_CONSTANTS = {
  accessSecret: env.ACCESS_TOKEN_SECRET,
  refreshSecret: env.REFRESH_TOKEN_SECRET,
  accessExpiry: env.ACCESS_TOKEN_EXPIRY,
  refreshExpiry: env.REFRESH_TOKEN_EXPIRY,
} as const;

const ONE_DAY = 1000 * 60 * 60 * 24;

//ttl for cookies are in milliseconds
export const COOKIE_CONSTANTS = {
  accessToken: 'access_token',
  refreshToken: 'refresh_token',
  sessionId: 'session_id',

  defaultMaxAge: {
    accessToken: ONE_DAY,
    refreshToken: ONE_DAY * 7,
    sessionId: ONE_DAY * 7,
  },

  rememberMaxAge: {
    accessToken: ONE_DAY * 7,
    refreshToken: ONE_DAY * 14,
    sessionId: ONE_DAY * 14,
  },

  trustedMaxAge: {
    accessToken: ONE_DAY * 14,
    refreshToken: ONE_DAY * 30,
    sessionId: ONE_DAY * 30,
  },
} as const;

// Same durations but in seconds for Redis TTL
export const REDIS_TOKEN_TTL = {
  defaultTtl: {
    accessToken: ONE_DAY / 1000, // 1 day in seconds
    refreshToken: (ONE_DAY * 7) / 1000, // 7 days in seconds
  },
  rememberTtl: {
    accessToken: (ONE_DAY * 7) / 1000,
    refreshToken: (ONE_DAY * 14) / 1000,
  },
} as const;

// Same durations but in seconds for jwt TTL
export const JWT_TOKEN_TTL = {
  defaultTtl: {
    accessToken: ONE_DAY / 1000, // 1 day in seconds
    refreshToken: (ONE_DAY * 7) / 1000, // 7 days in seconds
  },
  rememberTtl: {
    accessToken: (ONE_DAY * 7) / 1000,
    refreshToken: (ONE_DAY * 14) / 1000,
  },
} as const;

export const CODE_ATTEMPTS_TTL = 60 * 10; // 10 minutes

export const MAX_CODE_ATTEMPTS_IN_TTL = 5; // 5 attempts in 10 minutes

export const SESSION_CONSTANTS = {
  rememberTTL: (ONE_DAY * 14) / 1000,
  defaultTTL: (ONE_DAY * 7) / 1000, // 7 days in seconds
} as const;
