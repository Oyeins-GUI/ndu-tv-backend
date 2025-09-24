import {
  AllowNull,
  Column,
  DataType,
  HasMany,
  Table,
  Unique,
} from 'sequelize-typescript';
import { BaseModel } from './base.model';
import { Department } from './departments.model';

@Table({
  tableName: 'faculties',
})
export class Faculty extends BaseModel {
  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(100))
  declare faculty: string;

  @HasMany(() => Department)
  declare departments: Department[];
}
