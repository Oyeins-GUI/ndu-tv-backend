import { Request } from 'express';

export interface ITokenValidationService {
  /**
   * Validates jwt access token
   * @param req - Takes in the reqeest object
   * @returns - a boolean promise, true if valid and false if invalid
   */
  validateAccessToken(req: Request): Promise<boolean>;

  /**
   * Validates jwt refresh token
   * @param req - Takes in the reqeest object
   * @returns - a boolean promise, true if valid and false if invalid
   */
  validateRefreshToken(req: Request): Promise<boolean>;
}
