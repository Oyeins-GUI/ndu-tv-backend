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

  Department: {
    Success: {
      Created: 'Department successfully created',
      Retrieved: 'Department(s) successfully retrieved',
      Updated: 'Department successfully updated',
      Deleted: 'Department successfully deleted',
    },
    Failure: { NotFound: 'Department not found' },
  },

  Faculty: {
    Success: {
      Created: 'Faculty successfully created',
      Retrieved: 'Faculties successfully retrieved',
      Updated: 'Faculty successfully updated',
      Deleted: 'Faculty successfully deleted',
    },
    Failure: {
      NotFound: 'Faculty not found',
    },
  },

  SugPosition: {
    Success: {
      Retrieved: 'SUG Postion(s) retrieved successfully',
      Created: 'SUG Postion(s) created successfully',
      Updated: 'SUG Postion(s) updated successfully',
    },
    Failure: { NotFound: 'SUG  Position not found' },
  },

  SugExecutive: {
    Success: {
      Created: 'SUG Executive(s) created successfully',
      Updated: 'SUG Executive(s) updated successfully',
      Retrieved: 'SUG Executive(s) retrieved succesfully',
      Deleted: 'SUG Executive sucessfully deleteted',
    },
    Failure: {
      DeparmentNotInFaculty:
        'Specified Department must be a department of sepecified Faculty',
      NotFound: 'SUG Executive not found',
      AlreadyExisting: 'Sug Executive Already Exists',
      PostionHeld: 'Postion already held for specifeid scope and session',
      FacultyIdNotProvided:
        'Faculty ID is required to get executives of scope Faculty',
      DepartmentIdNotProvided:
        'Department ID is required to get executives of scope Department',
      IsAnAdmin:
        'SUG Executive is a current admin, remove from admin before removing as executive',
      MustBeCurrentSessionExecutive:
        'Sug exectuive must be current session executive',
    },
  },
  AcademicSession: {
    Success: {
      Created: 'Academic session created successfully',
      Updated: 'Academic session updated successfully',
      Retrieved: 'Academic Session(s) retrieved successfully',
    },
    Failure: {
      NotFound: 'Academic Session not found',
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
