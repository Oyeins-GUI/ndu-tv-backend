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
  public department: string;

  @AllowNull(true)
  @Column(DataType.ARRAY(DataType.STRING(100)))
  public options: string[] | null;

  @ForeignKey(() => Faculty)
  @AllowNull(false)
  @Column(DataType.UUID)
  public faculty_id: string;

  @BelongsTo(() => Faculty, 'faculty_id')
  public faculty: Faculty;
}
