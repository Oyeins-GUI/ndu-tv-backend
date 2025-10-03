import { PlatformConfigDto } from '../../dtos/common.dto';
import { UpdatePlatformConfigRequestBody } from '../../dtos/common.request.dto';
import { UpdatePlatformConfigInput } from '../../repositories/interfaces/platform-config-repository.interface';

export interface IPlatformConfigService {
  /**
   * Initialized platform config on startup
   * Adds default row if there is no none and add its to redis
   */
  initSettings(): Promise<void>;

  /**Get Platform Settings */
  getSettings(): Promise<PlatformConfigDto>;

  updateSettings(
    data: UpdatePlatformConfigRequestBody,
  ): Promise<PlatformConfigDto>;

  updateSettingsInternal(
    data: UpdatePlatformConfigInput,
  ): Promise<PlatformConfigDto>;
}
