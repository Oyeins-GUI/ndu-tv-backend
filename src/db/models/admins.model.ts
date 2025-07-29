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
  public name: string;

  @AllowNull(false)
  @Unique
  @Index
  @Column(DataType.STRING(100))
  public matric_number: string;

  @AllowNull(false)
  @Unique
  @Index
  @Column(DataType.STRING(100))
  public email: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  public password: string | null;

  @ForeignKey(() => Role)
  @AllowNull(false)
  @Column(DataType.UUID)
  public role_id: string;

  @BelongsTo(() => Role, 'role_id')
  public role: Role;

  @ForeignKey(() => SugExecutive)
  @AllowNull(false)
  @Unique
  @Column(DataType.UUID)
  public executive_id: string;

  @BelongsTo(() => SugExecutive, 'executive_id')
  public executive: SugExecutive;

  @ForeignKey(() => SugPosition)
  @AllowNull(false)
  @Column(DataType.UUID)
  public position_id: string;

  @BelongsTo(() => SugPosition, 'position_id')
  public position: SugPosition;

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

  @AllowNull(false)
  @Default(SCOPE.DEPARTMENT)
  @Column(DataType.ENUM(...Object.values(SCOPE)))
  public scope: SCOPE;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  public is_verified: boolean;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  public is_active: boolean;

  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  public must_set_password: boolean;

  @AllowNull(true)
  @Column(DataType.DATE)
  public last_login_at: Date | null;
}
