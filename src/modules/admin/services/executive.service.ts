import { Inject, NotFoundException } from '@nestjs/common';
import { CustomLogger } from '../../../lib/logger/logger.service';
import { RESPONSE_MESSAGES } from '../../../shared/responses/response-messages';
import { IAdminRepository } from '../repositories/interfaces/admin-repository.interface';
import {
  GetExecutiveFilters,
  IExecutiveService,
} from './interfaces/executive.interface';
import {
  INansExecutiveRepository,
  UpdateNansExecutiveInput,
} from '../repositories/interfaces/nans-executive-repository.interface';
import {
  INansPositionRepository,
  UpdateNansPositionInput,
} from '../repositories/interfaces/position-repository.interface';

import {
  CreateNansExecutiveRequestBody,
  UpdateNansExecutiveRequestBody,
} from '../dtos/admin.request.dto';
import { NansExecutiveDto, NansPostionDto } from '../dtos/common.dto';
import { CreateNansPositionRequestBody } from '../dtos/common.request.dto';
import { ilike, or, search } from '../../../shared/helpers/repository.helper';
import { BadRequestException } from '../../../shared/exceptions';
import { FiltersOrOperators } from '../../../shared/types/repositories.types';
import { NansExecutive } from '../../../db/models/nans-executives.model';
import { ThrottlerStorageOptions } from '@nestjs/throttler/dist/throttler-storage-options.interface';

export class ExecutiveService implements IExecutiveService {
  constructor(
    private readonly logger: CustomLogger,

    @Inject('INansExecutiveRepository')
    private readonly nansExecutiveRepository: INansExecutiveRepository,

    @Inject('IAdminRepository')
    private readonly adminRepository: IAdminRepository,

    @Inject('INansPositionRepository')
    private readonly nansPositionRepository: INansPositionRepository,
  ) {
    this.logger.setContext(ExecutiveService.name);
  }

  public async addExecutive(
    data: CreateNansExecutiveRequestBody,
  ): Promise<NansExecutiveDto> {
    try {
      const exectuiveExits = await this.nansExecutiveRepository.findBy({
        position_id: data.position_id,
        year: data.year,
      });

      if (exectuiveExits)
        throw new BadRequestException({
          reason: RESPONSE_MESSAGES.NansExecutive.Failure.AlreadyExisting,
        });
      const executive = await this.nansExecutiveRepository.create(data);
      return new NansExecutiveDto(executive);
    } catch (error) {
      this.logger.logServiceError(this.addExecutive.name, error, { data });
      throw error;
    }
  }

  public async getExecutives(
    filters: GetExecutiveFilters,
  ): Promise<NansExecutiveDto[]> {
    try {
      const { search_term, year, position_id } = filters;

      const _filters: FiltersOrOperators<NansExecutive> = {
        ...(year && { year }),
        ...(position_id && { position_id }),
        ...(search_term && search<NansExecutive>(['name'], search_term)),
      };

      const exectutives = await this.nansExecutiveRepository.findManyBy(
        _filters,
        {
          page: filters.page,
          limit: filters.limit,
        },
      );

      return NansExecutiveDto.fromEntities(exectutives);
    } catch (error) {
      this.logger.logServiceError(this.getExecutives.name, error);
      throw error;
    }
  }

  public async getExecutive(executive_id: string): Promise<NansExecutiveDto> {
    try {
      const executive = await this.nansExecutiveRepository.findById(
        executive_id,
        {
          relations: ['all'],
        },
      );

      if (!executive)
        throw new NotFoundException({
          reason: RESPONSE_MESSAGES.NansExecutive.Failure.NotFound,
        });

      return new NansExecutiveDto(executive);
    } catch (error) {
      this.logger.logServiceError(this.getExecutive.name, error);
      throw error;
    }
  }

  public async getNansPostions(): Promise<NansPostionDto[]> {
    try {
      const nansPositions = await this.nansPositionRepository.findManyBy({});

      return NansPostionDto.fromEntities(nansPositions);
    } catch (error) {
      this.logger.logServiceError(this.getNansPostions.name, error);
      throw error;
    }
  }

  public async addNansPostion(
    data: CreateNansPositionRequestBody,
  ): Promise<NansPostionDto> {
    try {
      const nansPosition = await this.nansPositionRepository.create(data);
      return new NansPostionDto(nansPosition);
    } catch (error) {
      this.logger.logServiceError(this.addNansPostion.name, error);
      throw error;
    }
  }

  public async updateNansPostion(
    nans_position_id: string,
    data: UpdateNansExecutiveRequestBody,
  ): Promise<NansPostionDto> {
    try {
      const NansPosition =
        await this.nansPositionRepository.findById(nans_position_id);

      if (!NansPosition)
        throw new NotFoundException({
          reason: RESPONSE_MESSAGES.NansPosition.Failure.NotFound,
        });

      const updatedNansPostion =
        await this.nansPositionRepository.updateByModel(
          NansPosition,
          data as unknown as UpdateNansPositionInput,
        );
      return new NansPostionDto(updatedNansPostion);
    } catch (error) {
      this.logger.logServiceError(this.updateNansPostion.name, error);
      throw error;
    }
  }

  public async deleteExecutive(executive_id: string): Promise<void> {
    try {
      const NansExecutive =
        await this.nansExecutiveRepository.findById(executive_id);

      if (!NansExecutive)
        throw new NotFoundException({
          reason: RESPONSE_MESSAGES.NansExecutive.Failure.NotFound,
        });

      await this.nansExecutiveRepository.delete(NansExecutive);
    } catch (error) {
      this.logger.logServiceError(this.deleteExecutive.name, error);
      throw error;
    }
  }

  public async updateExecutive(
    executive_id: string,
    data: UpdateNansExecutiveRequestBody,
  ): Promise<NansExecutiveDto> {
    try {
      const executive =
        await this.nansExecutiveRepository.findById(executive_id);

      if (!executive)
        throw new NotFoundException({
          reason: RESPONSE_MESSAGES.NansExecutive.Failure.NotFound,
          details: {
            id: executive_id,
          },
        });
      const updatedExecutive = await this.nansExecutiveRepository.updateByModel(
        executive,
        data as UpdateNansExecutiveInput,
      );

      return new NansExecutiveDto(updatedExecutive);
    } catch (error) {
      this.logger.logServiceError(this.updateExecutive.name, error, { data });
      throw error;
    }
  }
}
