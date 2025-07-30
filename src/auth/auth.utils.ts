export function getSessionKey(session_id: string): string {
  return `session:${session_id}`;
}

export function getUserSessionSetKey(user_id: string): string {
  return `admin-sessions:${user_id}`;
}

type TokenOperation = 'activate-account' | 'change-password' | 'reset-password';

export function getTokenKey(operation: TokenOperation, token: string): string {
  return `${operation}:${token}`;
}
