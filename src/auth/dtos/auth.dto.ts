import { AdminDto } from '../../modules/admin/dtos/admin.dto';
import { AuthTokens } from '../interfaces/auth.interface';

export class LoginDto {
  public tokens: AuthTokens;

  public session_id: string;

  public admin: AdminDto;

  constructor(admin: AdminDto, tokens: AuthTokens, session_id: string) {
    this.admin = admin;
    this.tokens = tokens;
    this.session_id = session_id;
  }
}
