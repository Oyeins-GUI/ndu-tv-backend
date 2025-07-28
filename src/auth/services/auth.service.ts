import { CustomLogger } from '../../lib/logger/logger.service';
import { IAuthService } from '../interfaces/auth.interface';

export class AuthService implements IAuthService {
  constructor(private readonly logger: CustomLogger) {}
}
