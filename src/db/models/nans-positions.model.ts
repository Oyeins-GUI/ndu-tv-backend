import { Table, AllowNull, Column, DataType } from 'sequelize-typescript';
import { BaseModel } from './base.model';

@Table({ tableName: 'nans_positions' })
export class NansPosition extends BaseModel {
  @AllowNull(false)
  @Column(DataType.STRING(20))
  declare position: string; // e.g., 'PRO', 'PRES', 'VP'

  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare title: string; // Full name of the position

  @AllowNull(false)
  @Column(DataType.STRING(500))
  declare description: string; // Role explanation
}
