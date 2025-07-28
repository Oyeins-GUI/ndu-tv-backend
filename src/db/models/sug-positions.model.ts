import { Table, AllowNull, Column, DataType } from 'sequelize-typescript';
import { BaseModel } from './base.model';

@Table({ tableName: 'sug_positions' })
export class SugPosition extends BaseModel {
  @AllowNull(false)
  @Column(DataType.STRING(20))
  public position: string; // e.g., 'PRO', 'PRES', 'VP'

  @AllowNull(false)
  @Column(DataType.STRING(100))
  public title: string; // Full name of the position

  @AllowNull(false)
  @Column(DataType.STRING(500))
  public description: string; // Role explanation
}
