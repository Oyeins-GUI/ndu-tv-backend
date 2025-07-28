import { Admin } from '../../../db/models/admins.model';
import { Role } from '../../../shared/enums';

export class AdminDto {
  public name: string;

  public email: string;

  public matric_number: string;

  public role: string;

  public position: string;

  public faculty: string;

  public deparment: string;

  public is_active: boolean;

  public last_login_at: string | Date | null;

  constructor(model: Admin) {
    this.name = model.name;
    this.email = model.email;
    this.matric_number = model.matric_number;
    this.is_active = model.is_active;
    this.last_login_at = model.last_login_at;
    this.role = model.role.role.toString();

    if (model.department) this.deparment = model.department.department;

    if (model.faculty) this.faculty = model.faculty.faculty;

    if (model.position) this.position = model.position.position;
  }
}
