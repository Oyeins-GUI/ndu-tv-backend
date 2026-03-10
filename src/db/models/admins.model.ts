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

  @AllowNull(true)
  @Column(DataType.DATE)
  declare last_password_change: Date | null;
}
