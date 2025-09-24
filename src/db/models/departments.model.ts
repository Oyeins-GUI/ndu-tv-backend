import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from './base.model';
import { Faculty } from './faculties.model';

@Table({
  tableName: 'departments',
})
export class Department extends BaseModel {
  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare department: string;

  @AllowNull(true)
  @Column(DataType.ARRAY(DataType.STRING(100)))
  declare options: string[] | null;

  @ForeignKey(() => Faculty)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare faculty_id: string;

  @BelongsTo(() => Faculty, 'faculty_id')
  declare faculty: Faculty;
}
