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

@Table({
  tableName: 'nans_executives',
  indexes: [
    {
      name: 'unique_position_year',
      unique: true,
      fields: ['year', 'position_id'],
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

  @ForeignKey(() => NansPosition)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare position_id: string;

  @BelongsTo(() => NansPosition, 'position_id')
  declare position: NansPosition;
}
