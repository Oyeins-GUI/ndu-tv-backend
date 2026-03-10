import { IncludeOptions } from 'sequelize';
import { AppSettings } from '../../../db/models/app-settings.model';
import { BaseRepository } from '../../../shared/repositories/base.repository';
import {
  CreatePlatformConfigInput,
  IPlatformConfigRepository,
  UpdatePlatformConfigInput,
} from './interfaces/platform-config-repository.interface';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class PlatformConfigRepository
  extends BaseRepository<
    AppSettings,
    CreatePlatformConfigInput,
    UpdatePlatformConfigInput
  >
  implements IPlatformConfigRepository
{
  constructor(@InjectModel(AppSettings) model: typeof AppSettings) {
    super(model);
  }

  protected computeRelations(relations: ''[]): IncludeOptions[] {
    const include: IncludeOptions[] = [];

    return include;
  }
}
