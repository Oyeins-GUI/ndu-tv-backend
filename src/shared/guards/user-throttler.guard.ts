import { Request } from 'express';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { getClientIp } from '../../lib/utils';
import { ThrottlerGuard, ThrottlerLimitDetail } from '@nestjs/throttler';
import { RESPONSE_MESSAGES } from '../responses/response-messages';

@Injectable()
export class UserThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Request): Promise<string> {
    return req.user?.id || getClientIp(req);
  }

  // protected async handleRequest(requestProps: ThrottlerRequest): Promise<boolean> {
  //   console.log('handleRequest called!');

  //   try {
  //     return await super.handleRequest(requestProps);
  //   } catch (error) {
  //     if (error instanceof ThrottlerException) {
  //       console.log('exception about to be thrown');
  //       throw new TooManyRequestsException();
  //     }
  //     throw error;
  //   }
  // }

  protected async getErrorMessage(
    context: ExecutionContext,
    throttlerLimitDetail: ThrottlerLimitDetail,
  ): Promise<string> {
    return RESPONSE_MESSAGES.UserRateLimit;
  }
}
