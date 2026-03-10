export const RESPONSE_MESSAGES = {
  UserRateLimit: 'Too many requests for this user, please try again later',
  RateLimit: 'Too many requests, please try again later',
  Default: 'OK',
  Error: 'An error occurred',

  PlatformConfig: {
    Success: {
      Retrieved: 'Platform config (info) retrieved successfully',
      Updated: 'Platform config (info) updated successfully',
    },
    Failure: {
      UnableToRetrieve: 'Could not retrieve platform config',
      UnableToUpdate: 'Could not updatd platform config',
    },
  },

  Auth: {
    Success: {
      TokenRefreshed: 'Token refreshed successfully',
      LoggedIn: 'User session is active',
      Login: 'User Loggged in successfully',
      Logout: 'User Logged out successfully',
      SentPasswordSetLink:
        'If this email and matric number combination exists in our system, a password setup link has been sent to your email.',
      PasswordSet:
        'Password successfully set! Your admin account is now activated and ready to use.',
      PasswordReset: 'Password reset sucessfull!, Please login to continue',
      PasswordChange: 'Password change sucessfull!, Please login to continue',
      OtpSent: 'Otp has been sent to your email',
    },
    Failure: {
      InvalidCredential: 'Invalid credentials',
      EmptyOrInvalidToken: 'Empty, Invalid or Expired token',
      InvalidOrExpired: 'Otp invalid or has expired',
      PasswordSet: 'Admin account already activated',
      NotAuthorized: 'You are not authorized to perform this action',
      Forbidden: 'You are not allowed to acces this resource',
    },
  },

  Admin: {
    Success: {
      Created: 'Admin created successfully',
      Updated: 'Admin updated successfully',
      Deleted: 'Admin deleted successfully',
      Retrieved: 'Admin(s) retrieved successfully',
    },
    Failiure: {
      NotFound: ' Admin not found',
      AlreadyExists: 'Admin already exists',
    },
  },

  NansPosition: {
    Success: {
      Retrieved: 'NANS Postion(s) retrieved successfully',
      Created: 'NANS Postion(s) created successfully',
      Updated: 'NANS Postion(s) updated successfully',
    },
    Failure: { NotFound: 'NANS  Position not found' },
  },

  NansExecutive: {
    Success: {
      Created: 'NANS Executive(s) created successfully',
      Updated: 'NANS Executive(s) updated successfully',
      Retrieved: 'NANS Executive(s) retrieved succesfully',
      Deleted: 'NANS Executive sucessfully deleteted',
    },
    Failure: {
      NotFound: 'NANS Executive not found',
      AlreadyExisting:
        'NANS Executive for said postion and year Already Exists',
    },
  },
  Role: {
    Success: {
      Retrieved: 'Role(s) retrieved successfully',
    },
    Failure: {
      NotFound: 'Role not found',
    },
  },
} as const;
