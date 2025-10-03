import {
  Inject,
  Injectable,
  IntrinsicException,
  OnApplicationBootstrap,
  OnModuleInit,
} from '@nestjs/common';
import { IPlatformConfigService } from './interfaces/platform-config.interface';
import { CustomLogger } from '../../../lib/logger/logger.service';
import {
  IPlatformConfigRepository,
  UpdatePlatformConfigInput,
} from '../repositories/interfaces/platform-config-repository.interface';
import { IRedisCacheService } from '../../../lib/redis/redis.interface';
import { PlatformConfigDto } from '../dtos/common.dto';
import { AppSettings } from '../../../db/models/app-settings.model';
import {
  APP_SETTINGS_REDIS_KEY,
  APP_SETTINGS_REDIS_TTL,
  DEFAULT_PLATFORM_CONFIG,
} from '../../../config/constants';
import { IAcademicSessionRepository } from '../repositories/interfaces/academic-session-repository.interface';
import { UpdatePlatformConfigRequestBody } from '../dtos/common.request.dto';
import { BadRequestException } from '../../../shared/exceptions';
import { RESPONSE_MESSAGES } from '../../../shared/responses/response-messages';
import { instanceToPlain, plainToInstance } from 'class-transformer';

@Injectable()
export class PlatformConfigService
  implements IPlatformConfigService, OnModuleInit
{
  constructor(
    @Inject() private readonly logger: CustomLogger,
    @Inject('IPlatformConfigRepository')
    private readonly platformConfigRepository: IPlatformConfigRepository,
    @Inject('IRedisCacheService')
    private readonly redisCacheService: IRedisCacheService,

    @Inject('IAcademicSessionRepository')
    private readonly academicSessionRepository: IAcademicSessionRepository,
  ) {
    this.logger.setContext(PlatformConfigService.name);
  }

  async onModuleInit() {
    await this.initSettings();
  }

  private async cachePlatformConfig(data: AppSettings) {
    const parsedPlatformConfig = new PlatformConfigDto(data);
    await this.redisCacheService.setString(
      APP_SETTINGS_REDIS_KEY,
      JSON.stringify(parsedPlatformConfig),
      APP_SETTINGS_REDIS_TTL,
    );
  }

  public async initSettings(): Promise<void> {
    try {
      let platformConfig: string | AppSettings | null =
        await this.redisCacheService.getStringValue(APP_SETTINGS_REDIS_KEY);

      // if (platformConfig) {
      //   const parsedPlatformConfig = JSON.parse(
      //     platformConfig,
      //   ) as PlatformConfigDto;

      //   // return plainToInstance(PlatformConfigDto, parsedPlatformConfig);
      // }

      if (!platformConfig) {
        platformConfig = await this.platformConfigRepository.findBy(
          {},
          {
            relations: ['current_session'],
          },
        );

        if (!platformConfig) {
          const current_session = await this.academicSessionRepository.findBy({
            is_current_session: true,
          });
          if (!current_session)
            throw new IntrinsicException(
              'Unable to initialize settings, could not get current session',
              { cause: 'Could not get current session' },
            );
          platformConfig = await this.platformConfigRepository.create({
            ...DEFAULT_PLATFORM_CONFIG,
            current_session_id: current_session.id,
          });
        }
        await this.cachePlatformConfig(platformConfig);
      }
    } catch (error) {
      this.logger.logServiceError(this.initSettings.name, error);
      throw error;
    }
  }

  public async getSettings(): Promise<PlatformConfigDto> {
    try {
      let platformConfig: string | AppSettings | null =
        await this.redisCacheService.getStringValue(APP_SETTINGS_REDIS_KEY);

      if (platformConfig) {
        const parsedPlatformConfig = JSON.parse(platformConfig);

        return new PlatformConfigDto(parsedPlatformConfig as AppSettings);
      }

      if (!platformConfig) {
        platformConfig = await this.platformConfigRepository.findBy(
          {},
          {
            relations: ['current_session'],
          },
        );
        await this.cachePlatformConfig(platformConfig!);
      }

      return new PlatformConfigDto(platformConfig as AppSettings);
    } catch (error) {
      this.logger.logServiceError(this.initSettings.name, error);
      throw error;
    }
  }

  public async updateSettings(
    data: UpdatePlatformConfigRequestBody,
  ): Promise<PlatformConfigDto> {
    try {
      const platformConfig = await this.platformConfigRepository.findBy({});

      if (!platformConfig)
        throw new BadRequestException({
          reason: RESPONSE_MESSAGES.PlatformConfig.Failure.UnableToRetrieve,
        });

      const updatedPlatformConfig =
        await this.platformConfigRepository.updateByModel(
          platformConfig,
          data as UpdatePlatformConfigInput,
        );

      await this.cachePlatformConfig(updatedPlatformConfig);

      return new PlatformConfigDto(updatedPlatformConfig);
    } catch (error) {
      this.logger.logServiceError(this.updateSettings.name, error);
      throw error;
    }
  }

  public async updateSettingsInternal(
    data: UpdatePlatformConfigInput,
  ): Promise<PlatformConfigDto> {
    try {
      const platformConfig = await this.platformConfigRepository.findBy({});

      if (!platformConfig)
        throw new BadRequestException({
          reason: RESPONSE_MESSAGES.PlatformConfig.Failure.UnableToRetrieve,
        });

      const updatedPlatformConfig =
        await this.platformConfigRepository.updateByModel(platformConfig, data);

      await this.cachePlatformConfig(updatedPlatformConfig);

      return new PlatformConfigDto(updatedPlatformConfig);
    } catch (error) {
      this.logger.logServiceError(this.updateSettings.name, error);
      throw error;
    }
  }
}
