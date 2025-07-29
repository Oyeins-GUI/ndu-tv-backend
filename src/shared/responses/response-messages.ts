export const RESPONSE_MESSAGES = {
  UserRateLimit: 'Too many requests for this user, please try again later',
  RateLimit: 'Too many requests, please try again later',
  Default: 'OK',
  Error: 'An error occurred',

  Admin: {
    Success: {
      Created: 'Admin created successfully',
      Updated: 'Admin updated successfully',
    },
    Failiure: { NotFound: ' Admin not found' },
  },

  Department: {
    Success: {},
    Failure: { NotFound: 'Department not found' },
  },

  Faculty: {
    Success: {},
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
    Success: {},
    Failure: {
      NotFound: 'Role not found',
    },
  },
} as const;
