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
import { Faculty } from './faculties.model';
import { Department } from './departments.model';
import { SugPosition } from './sug-positions.model';
import { AcademicSession } from './academic-sessions.model';
import { SCOPE } from '../../shared/enums';

@Table({
  tableName: 'sug_executives',
  indexes: [
    {
      name: 'unique_session_scope_position',
      unique: true,
      fields: ['session_id', 'scope', 'position_id'],
    },
  ],
})
export class SugExecutive extends BaseModel {
  @AllowNull(false)
  @Column(DataType.STRING(100))
  public name: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  public matric_number: string;

  @ForeignKey(() => SugPosition)
  @AllowNull(false)
  @Column(DataType.UUID)
  public position_id: string;

  @BelongsTo(() => SugPosition, 'position_id')
  public position: SugPosition;

  @ForeignKey(() => AcademicSession)
  @AllowNull(false)
  @Column(DataType.UUID)
  public session_id: string;

  @BelongsTo(() => AcademicSession, 'session_id')
  public session: AcademicSession;

  @AllowNull(false)
  @Default(SCOPE.DEPARTMENT)
  @Column(DataType.ENUM(...Object.keys(SCOPE)))
  public scope: SCOPE;

  @ForeignKey(() => Faculty)
  @AllowNull(false)
  @Column(DataType.UUID)
  public faculty_id: string;

  @BelongsTo(() => Faculty, 'faculty_id')
  public faculty: Faculty;

  @ForeignKey(() => Department)
  @AllowNull(false)
  @Column(DataType.UUID)
  public department_id: string;

  @BelongsTo(() => Department, 'department_id')
  public department: Department;
}
