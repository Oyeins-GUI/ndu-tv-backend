import { LoginDto } from '../dtos/auth.dto';

export interface IAuthService {
  /**
   * Authenticate an admin
   * @param identifier - admin identifier (email or matric number)
   * @param password - admin password
   * @returns {LoginDto}- returns authenticated admin
   */
  login(identifier: string, password: string): Promise<LoginDto>;

  /**
   * Logsout an admin
   * @param session_id - session id to logout by
   * @returns {void}
   */
  logout(session_id: string): Promise<void>;
}

export type AuthTokens = {
  access_token: string;
  refresh_token: string;
};

export type AuthTokenPayload = {
  id: string;
  email: string;
};

export type AuthenticatedRequest = {
  user: AuthTokenPayload;
  session_id: string;
};

export type SessionData = {
  admin_id: string;
  access_token: string;
  refresh_token: string;
};
