import {
  AllowNull,
  Column,
  DataType,
  Default,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from './base.model';

@Table({
  tableName: 'academic_sessions',
})
export class AcademicSession extends BaseModel {
  @AllowNull(false)
  @Column(DataType.STRING(50))
  declare session: string;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare is_current_session: boolean;
}
