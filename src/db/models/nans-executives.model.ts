/**
 * Original plan was for the website to server as NDU-Tv
 * but it was changed to nans zone b website which reduced the requirements, hence why some files are left unused
 * incase you get to this file this is the reason
 */

import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Index,
  Table,
  Unique,
} from 'sequelize-typescript';
import { BaseModel } from './base.model';
import { NansPosition } from './nans-positions.model';
import { ExecType } from '../../shared/enums/execs.enum';

@Table({
  tableName: 'nans_executives',
  indexes: [
    {
      name: 'unique_position_year_exec_type',
      unique: true,
      fields: ['year', 'position_id', 'exec_type'],
    },
  ],
})
export class NansExecutive extends BaseModel {
  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare name: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(100))
  declare image_url: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare year: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(ExecType)))
  declare exec_type: ExecType;

  @ForeignKey(() => NansPosition)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare position_id: string;

  @BelongsTo(() => NansPosition, 'position_id')
  declare position: NansPosition;
}
