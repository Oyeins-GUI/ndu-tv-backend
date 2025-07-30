import { AuthenticatedRequest } from '../../auth/interfaces/auth.interface';

declare global {
  namespace Express {
    interface Request extends AuthenticatedRequest {}
  }
}
