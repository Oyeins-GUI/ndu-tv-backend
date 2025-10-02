import { AdminDto } from '../../modules/admin/dtos/admin.dto';
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

  /**
   * Initiate set-password flow for a new admin.
   * Sends email with token or code.
   * @param email - email of the admin
   * @param matric_no - mattric number of the admin
   * @returns {void}
   */
  initiateSetPassword(email: string, matric_no: string): Promise<void>;

  /**
   * Completes a set password, and logs in the admin
   * @param token - token to validate
   * @param password - new password to set
   * @returns {LoginDto}- returns authenticated admin
   */
  setPassword(token: string, password: string): Promise<LoginDto>;

  getUser(user_id: string): Promise<AdminDto>;
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
  user_id: string;
  access_token: string;
  refresh_token: string;
};
