export const RESPONSE_MESSAGES = {
  UserRateLimit: 'Too many requests for this user, please try again later',
  RateLimit: 'Too many requests, please try again later',
  Default: 'OK',
  Error: 'An error occurred',

  Auth: {
    Success: {
      LoggedIn: 'User session is active',
      Login: 'User Loggged in successfully',
      Logout: 'User Logged out successfully',
      SentPasswordSetLink:
        'If this email and matric number combination exists in our system, a password setup link has been sent to your email.',
      PasswordSet:
        'Password successfully set! Your admin account is now activated and ready to use.',
    },
    Failure: {
      InvalidCredential: 'Invalid credentials',
      EmptyOrInvalidToken: 'Empty, Invalid or Expired token',
      PasswordSet: 'Admin account already activated',
    },
  },

  Admin: {
    Success: {
      Created: 'Admin created successfully',
      Updated: 'Admin updated successfully',
      Deleted: 'Admin deleted successfully',
    },
    Failiure: { NotFound: ' Admin not found' },
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
      NotFound: 'SUG Executive not found',
      AlreadyExisting: 'Sug Executive Already Exists',
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
