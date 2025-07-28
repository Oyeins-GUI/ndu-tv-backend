import {
  AllowNull,
  Column,
  DataType,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from './base.model';
import { Department } from './departments.model';

@Table({
  tableName: 'faculties',
})
export class Faculty extends BaseModel {
  @AllowNull(false)
  @Column(DataType.STRING(100))
  public faculty: string;

  @HasMany(() => Department)
  public depatments: Department[];
}
