import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Index,
  Table,
  Unique,
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
  declare name: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(100))
  declare email: string;

  @AllowNull(false)
  @Unique
  @Index
  @Column(DataType.STRING(20))
  declare phone_number: string;

  @AllowNull(false)
  @Unique
  @Index
  @Column(DataType.STRING(100))
  declare matric_number: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(100))
  declare image_url: string;

  @ForeignKey(() => SugPosition)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare position_id: string;

  @BelongsTo(() => SugPosition, 'position_id')
  declare position: SugPosition;

  @ForeignKey(() => AcademicSession)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare session_id: string;

  @BelongsTo(() => AcademicSession, 'session_id')
  declare session: AcademicSession;

  @AllowNull(false)
  @Default(SCOPE.DEPARTMENT)
  @Column(DataType.ENUM(...Object.values(SCOPE)))
  declare scope: SCOPE;

  @ForeignKey(() => Faculty)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare faculty_id: string;

  @BelongsTo(() => Faculty, 'faculty_id')
  declare faculty: Faculty;

  @ForeignKey(() => Department)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare department_id: string;

  @BelongsTo(() => Department, 'department_id')
  declare department: Department;
}
