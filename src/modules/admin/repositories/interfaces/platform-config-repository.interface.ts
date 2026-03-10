import { AppSettings } from '../../../../db/models/app-settings.model';
import { IBaseRepository } from '../../../../shared/interfaces/base-repository.interface';
import { AtLeastOne } from '../../../../shared/types/repositories.types';

export interface IPlatformConfigRepository
  extends IBaseRepository<
    AppSettings,
    CreatePlatformConfigInput,
    UpdatePlatformConfigInput
  > {}

export type CreatePlatformConfigInput = {
  is_ad_enabled: boolean;

  is_app_enabled: boolean;

  is_publishing_enabled: boolean;

  platform_name: string;

  platform_tagline: string;
};

export type UpdatePlatformConfigInput = AtLeastOne<CreatePlatformConfigInput>;
