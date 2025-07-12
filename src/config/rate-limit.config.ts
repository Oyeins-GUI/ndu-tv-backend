import rateLimit from 'express-rate-limit';
import { DEFAULT_RATE_LIMIT_REQUESTS, DEFAULT_RATE_LIMIT_TTL } from '.';
import { INestApplication } from '@nestjs/common';
import { RESPONSE_MESSAGES } from '../shared/responses/response-messages';

export function setUpRateLimiting(app: INestApplication) {
  app.use(
    rateLimit({
      windowMs: DEFAULT_RATE_LIMIT_TTL,
      limit: DEFAULT_RATE_LIMIT_REQUESTS,
      message: RESPONSE_MESSAGES.RateLimit,
    }),
  );
}
