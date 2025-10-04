import { Role } from '../enums';

export function mapRoles(role: Role): string {
  const roleMap: Record<Role, string> = {
    central_exec: 'Central Executive',
    faculty_exec: 'Faculty Executive',
    department_exec: 'Department Executive',
    super_admin: '',
  };

  return roleMap[role] || role;
}
