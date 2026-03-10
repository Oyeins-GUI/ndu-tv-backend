import { Admin } from '../../../db/models/admins.model';

export class AdminDto {
  public name: string;

  public email: string;

  public role: string;

  public is_admin_enabled: boolean;

  public last_login_at: string | Date | null;

  constructor(model: Admin) {
    this.name = model.name;
    this.email = model.email;

    this.last_login_at = model.last_login_at;

    this.is_admin_enabled = model.is_admin_enabled;

    this.role = model.role?.role.toString();
  }

  static fromEntities(models: Admin[]): AdminDto[] {
    return models.map((model) => new AdminDto(model));
  }
}
