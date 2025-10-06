import {
  AllowNull,
  Column,
  DataType,
  Default,
  Table,
  Unique,
} from 'sequelize-typescript';
import { BaseModel } from './base.model';

@Table({
  tableName: 'academic_sessions',
})
export class AcademicSession extends BaseModel {
  @AllowNull(false)
  @Unique(true)
  @Column(DataType.STRING(50))
  declare session: string;

  @AllowNull(false)
  @Default(false)
  @Unique(true)
  @Column(DataType.BOOLEAN)
  declare is_current_session: boolean;

  @AllowNull(false)
  @Default(false)
  @Unique(true)
  @Column(DataType.BOOLEAN)
  declare is_next_session: boolean;
}
