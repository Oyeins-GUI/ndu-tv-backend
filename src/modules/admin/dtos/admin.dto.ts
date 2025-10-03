import { Admin } from '../../../db/models/admins.model';

export class AdminDto {
  public name: string;

  public email: string;

  public matric_number: string;

  public role: string;

  public position: string;

  public faculty: string;

  public deparment: string;

  public scope: string;

  public is_admin_enabled: boolean;

  public last_login_at: string | Date | null;

  constructor(model: Admin) {
    this.name = model.name;
    this.email = model.email;
    this.matric_number = model.matric_number;
    this.last_login_at = model.last_login_at;
    this.role = model.role.role.toString();
    this.scope = model.scope.toString();
    this.is_admin_enabled = model.is_admin_enabled;

    if (model.department) this.deparment = model.department.department;

    if (model.faculty) this.faculty = model.faculty.faculty;

    if (model.position) this.position = model.position.position;
  }

  static fromEntities(models: Admin[]): AdminDto[] {
    return models.map((model) => new AdminDto(model));
  }
}
