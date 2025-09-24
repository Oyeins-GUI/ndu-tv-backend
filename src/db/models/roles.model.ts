import { AllowNull, Column, DataType, Table } from 'sequelize-typescript';
import { BaseModel } from './base.model';
import { Role as RoleEnum } from '../../shared/enums';

@Table({
  tableName: 'roles',
})
export class Role extends BaseModel {
  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(RoleEnum)))
  declare role: RoleEnum;

  @AllowNull(false)
  @Column(DataType.STRING(500))
  declare description: string;
}
