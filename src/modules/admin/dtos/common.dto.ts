import { SugExecutive } from '../../../db/models/sug-executives.model';

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
}
