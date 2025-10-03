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
import { Role } from './roles.model';
import { SugExecutive } from './sug-executives.model';
import { SugPosition } from './sug-positions.model';
import { Faculty } from './faculties.model';
import { Department } from './departments.model';
import { SCOPE } from '../../shared/enums';

@Table({
  tableName: 'admins',
})
export class Admin extends BaseModel {
  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare name: string;

  @AllowNull(false)
  @Unique
  @Index
  @Column(DataType.STRING(100))
  declare matric_number: string;

  @AllowNull(false)
  @Unique
  @Index
  @Column(DataType.STRING(100))
  declare email: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare password: string | null;

  @ForeignKey(() => Role)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare role_id: string;

  @BelongsTo(() => Role, 'role_id')
  declare role: Role;

  @ForeignKey(() => SugExecutive)
  @AllowNull(false)
  @Unique
  @Column(DataType.UUID)
  declare executive_id: string;

  @BelongsTo(() => SugExecutive, 'executive_id')
  declare executive: SugExecutive;

  @ForeignKey(() => SugPosition)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare position_id: string;

  @BelongsTo(() => SugPosition, 'position_id')
  declare position: SugPosition;

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

  @AllowNull(false)
  @Default(SCOPE.DEPARTMENT)
  @Column(DataType.ENUM(...Object.values(SCOPE)))
  declare scope: SCOPE;

  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  declare must_set_password: boolean;

  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  declare is_admin_enabled: boolean;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare last_login_at: Date | null;
}
