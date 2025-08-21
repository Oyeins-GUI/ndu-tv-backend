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
  @Column(DataType.STRING(100))
  public current_session_id: string;

  @BelongsTo(() => AcademicSession, 'current_session_id')
  public current_session: AcademicSession;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  @Default(false)
  public is_app_disabled: boolean;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  @Default(false)
  public is_ad_disabled: boolean;
}
