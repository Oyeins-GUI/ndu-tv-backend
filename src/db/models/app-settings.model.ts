import {
  AllowNull,
  Column,
  DataType,
  Default,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from './base.model';

@Table({
  tableName: 'app_settings',
})
export class AppSettings extends BaseModel {
  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  declare is_app_enabled: boolean;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare is_ad_enabled: boolean;

  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  declare is_publishing_enabled: boolean;

  @AllowNull(false)
  @Default('NDU-TV')
  @Column(DataType.STRING(100))
  declare platform_name: string;

  @AllowNull(false)
  @Default('Your Source for NANS ZONE B NEWS')
  @Column(DataType.STRING(300))
  declare platform_tagline: string;
}
