import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from './base.model';

import { AcademicSession } from './academic-sessions.model';

@Table({
  tableName: 'app_settings',
})
export class AppSettings extends BaseModel {
  @ForeignKey(() => AcademicSession)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare current_session_id: string;

  @BelongsTo(() => AcademicSession)
  declare current_session: AcademicSession;

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
  @Default('Your Source for Campus News and Updates')
  @Column(DataType.STRING(300))
  declare platform_tagline: string;
}
