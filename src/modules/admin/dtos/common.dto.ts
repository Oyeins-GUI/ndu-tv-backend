import { AppSettings } from '../../../db/models/app-settings.model';
import { NansExecutive } from '../../../db/models/nans-executives.model';
import { NansPosition } from '../../../db/models/nans-positions.model';
import { Role } from '../../../db/models/roles.model';
import { Role as RoleEnum } from '../../../shared/enums';

export class NansExecutiveDto {
  public id: string;

  public name: string;

  public image_url: string;

  public position: string;

  public year: string;

  constructor(model: NansExecutive) {
    this.id = model.id;
    this.name = model.name;
    this.image_url = model.image_url;
    this.position = model.position.position;
    this.year = model.year;
  }

  static fromEntities(models: NansExecutive[]): NansExecutiveDto[] {
    return models.map((model) => new NansExecutiveDto(model));
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

export class NansPostionDto {
  public id: string;
  public position: string;
  public title: string;
  public description: string;

  constructor(model: NansPosition) {
    if (model.position != 'SUPER') {
      this.id = model.id;
      this.position = model.position;
      this.title = model.title;
      this.description = model.description;
    }
  }

  static fromEntities(models: NansPosition[]): NansPostionDto[] {
    return models.map((model) => new NansPostionDto(model));
  }
}

export class PlatformConfigDto {
  // @Exclude()
  // public is_app_enabled: boolean;

  // @Exclude()
  // public is_ad_enabled: boolean;

  public is_publishing_enabled: boolean;

  public platform_name: string;

  public platform_tagline: string;

  constructor(model: AppSettings) {
    // this.is_ad_enabled = model.is_ad_enabled;

    // this.is_app_enabled = model.is_app_enabled;

    this.is_publishing_enabled = model.is_publishing_enabled;

    this.platform_name = model.platform_name;

    this.platform_tagline = model.platform_tagline;
  }

  static fromEntities(model: AppSettings[]): PlatformConfigDto[] {
    return model.map((model) => new PlatformConfigDto(model));
  }
}
