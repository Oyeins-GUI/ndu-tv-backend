import { AdminDto } from '../../modules/admin/dtos/admin.dto';
import { LoginDto } from '../dtos/auth.dto';

export interface IAuthService {
  /**
   * Authenticate an admin
   * @param identifier - admin identifier (email or matric number)
   * @param password - admin password
   * @returns {LoginDto}- returns authenticated admin
   */
  login(
    identifier: string,
    password: string,
    remember_me?: boolean,
  ): Promise<LoginDto>;

  /**
   * Refresh the authentication tokens for an admin user.
   *
   * @param admin_id - The unique identifier of the admin whose tokens are being refreshed.
   * @param session_id - The current Redis session ID associated with the admin.
   * @returns {Promise<LoginDto>} A promise resolving to a LoginDto containing the new tokens and session details.
   *
   * @throws {UnauthorizedException} If the admin is not found or the session is invalid.
   * @throws {InternalServerErrorException} If a token generation or Redis update error occurs.
   */
  refreshToken(admin_id: string, session_id: string): Promise<LoginDto>;

  /**
   * Logsout an admin
   * @param session_id - session id to logout by
   * @returns {void}
   */
  logout(session_id: string): Promise<void>;

  /**
   * initiate password change process
   * @param admin_id - ID of the current logged in user
   * @param old_password - Old password of current logged in user
   */
  initChangePassword(admin_id: string, old_password: string): Promise<void>;

  changePassword(
    admin_id: string,
    code: string,
    new_password: string,
  ): Promise<void>;

  /**
   * Initiate set-password flow for a new admin.
   * Sends email with token or code.
   * @param email - email of the admin
   * @param matric_no - mattric number of the admin
   * @returns {void}
   */
  initiateSetPassword(email: string, matric_number: string): Promise<void>;

  /**
   * Initiate password reset flow for an existing admin
   * @param email - Email of the admin
   * @param matric_number Matric number of the admin
   */
  initiateResetPassword(email: string, matric_number: string): Promise<void>;

  /**
   * Complete reset password flow
   * @param token - Token to reset password
   * @param password  - New password
   */
  resetPassword(token: string, password: string): Promise<void>;

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
