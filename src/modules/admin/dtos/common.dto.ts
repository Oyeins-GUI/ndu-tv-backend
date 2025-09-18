import { Department } from '../../../db/models/departments.model';
import { Faculty } from '../../../db/models/faculties.model';
import { Role } from '../../../db/models/roles.model';
import { SugExecutive } from '../../../db/models/sug-executives.model';
import { Role as RoleEnum } from '../../../shared/enums';

export class SugExecutiveDto {
  public name: string;

  public email: string;

  public matric_number: string;

  public phone_number: string;

  public session: string;

  public position: string;

  public faculty: string;

  public deparment: string;

  public scope: string;

  public image_url: string;

  constructor(model: SugExecutive) {
    this.name = model.name;
    this.email = model.email;
    this.matric_number = model.matric_number;
    this.phone_number = model.phone_number;
    this.image_url = model.image_url;

    this.scope = model.scope.toString();

    if (model.department) this.deparment = model.department.department;

    if (model.faculty) this.faculty = model.faculty.faculty;

    if (model.position) this.position = model.position.position;

    if (model.session) this.session = model.session.session;
  }

  static fromEntities(models: SugExecutive[]): SugExecutiveDto[] {
    return models.map((model) => new SugExecutiveDto(model));
  }
}

export class DepartmentDto {
  public id: string;
  public department: string;
  public faculty: string;
  public options: string[] | null;

  constructor(model: Department) {
    this.id = model.id;
    this.department = model.department;

    if (model.options) this.options = model.options;

    if (model.faculty) this.faculty = model.faculty.faculty;
  }

  static fromEntities(models: Department[]): DepartmentDto[] {
    return models.map((model) => new DepartmentDto(model));
  }
}

export class FacultyDto {
  public id: string;
  public faculty: string;
  public departments?: string[];

  constructor(model: Faculty) {
    this.id = model.id;
    this.faculty = model.faculty;

    if (model.departments) {
      this.departments = model.departments.map((dept) => dept.department);
    }
  }

  static fromEntities(models: Faculty[]): FacultyDto[] {
    return models.map((model) => new FacultyDto(model));
  }
}

export class RoleDto {
  public id: string;
  public role: RoleEnum | string;
  public description: string;

  constructor(model: Role) {
    this.id = model.id;
    this.role = model.role;
    this.description = model.description;
  }

  static fromEntities(models: Role[]): RoleDto[] {
    return models.map((model) => new RoleDto(model));
  }
}
