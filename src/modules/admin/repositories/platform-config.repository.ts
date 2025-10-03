import { IncludeOptions } from 'sequelize';
import { AppSettings } from '../../../db/models/app-settings.model';
import { BaseRepository } from '../../../shared/repositories/base.repository';
import {
  CreatePlatformConfigInput,
  IPlatformConfigRepository,
  PlatformConfigRelations,
  UpdatePlatformConfigInput,
} from './interfaces/platform-config-repository.interface';
import { AcademicSession } from '../../../db/models/academic-sessions.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class PlatformConfigRepository
  extends BaseRepository<
    AppSettings,
    CreatePlatformConfigInput,
    UpdatePlatformConfigInput,
    PlatformConfigRelations
  >
  implements IPlatformConfigRepository
{
  constructor(@InjectModel(AppSettings) model: typeof AppSettings) {
    super(model);
  }

  protected computeRelations(
    relations: PlatformConfigRelations[],
  ): IncludeOptions[] {
    const include: IncludeOptions[] = [];

    include.push({
      model: AcademicSession,
      as: 'current_session',
    });

    return include;
  }
}
