export const RESPONSE_MESSAGES = {
  UserRateLimit: 'Too many requests for this user, please try again later',
  RateLimit: 'Too many requests, please try again later',
  Default: 'OK',
  Error: 'An error occurred',

  Auth: {
    Success: {
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
    Success: {},
    Failure: { NotFound: 'SUG  Position not found' },
  },

  SugExecutive: {
    Success: {
      Created: 'SUG Executive(s) created successfully',
      Updated: 'SUG Executive(s) updated successfully',
    },
    Failure: {
      NotFound: 'SUG Executive not found',
    },
  },
  AcademicSession: {
    Success: {},
    Failure: {
      NotFound: 'Academic Session not found',
    },
  },
  Role: {
    Success: {
      Retrived: 'Role(s) retrieved successfully',
    },
    Failure: {
      NotFound: 'Role not found',
    },
  },
} as const;
