import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AdminManagementGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
