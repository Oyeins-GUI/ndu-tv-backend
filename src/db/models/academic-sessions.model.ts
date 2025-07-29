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
  public session: string;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  public is_current_session: boolean;
}
