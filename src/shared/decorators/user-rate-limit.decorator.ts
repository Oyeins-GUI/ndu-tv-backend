import { applyDecorators, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { UserThrottlerGuard } from '../guards/user-throttler.guard';

/**
 * Applies user specific rate limit for an endpoint, uses id if authenticated and ip if not
 * @param ttl - rate limit ttl in seconds
 * @param limit - number or request in ttl
 * @returns
 */

export function RateLimit(ttl: number, limit: number) {
  return applyDecorators(
    UseGuards(UserThrottlerGuard),
    Throttle({
      default: {
        ttl: ttl * 1000,
        limit,
      },
    }),
  );
}
