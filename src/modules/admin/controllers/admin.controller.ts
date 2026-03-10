import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { IExecutiveService } from '../services/interfaces/executive.interface';
import { IAdminManagementService } from '../services/interfaces/admin-management.interface';
import {
  CreateAdminRequestBody,
  CreateNansExecutiveRequestBody,
  UpdateAdminRequestBody,
  UpdateNansExecutiveRequestBody,
} from '../dtos/admin.request.dto';

import {
  AdminApiResponse,
  AdminsApiResponse,
  PaginatedNansExecutivesApiResponse,
  NansExecutiveApiResponse,
  NansExecutivesApiResponse,
} from '../dtos/admin.reponse.dto';
import {
  CreateAdminEndpoint,
  CreateNansExecutiveEndpoint,
  CreateNansPositionEndpoint,
  DeleteNansExecutiveEndpoint,
  GetAdminsEndpoint,
  GetPlatformConfigEndpoint,
  GetRolesEndpoint,
  GetNansPositionsEndpoint,
  RemoveAdminEndpoint,
  UpdateAdminEndpoint,
  UpdatePlatformConfigEndpoint,
  UpdateNansExecutiveEndpoint,
  GetNansExecutiveEndpoint,
  GetNansExecutivesEndpoint,
} from '../decorators/admin.decorator';
import { ApiTags } from '@nestjs/swagger';
import { RESPONSE_MESSAGES } from '../../../shared/responses/response-messages';
import { SuccessResponseBody } from '../../../shared/responses/success-response';
import {
  CreateNansPositionRequestBody,
  UpdatePlatformConfigRequestBody,
} from '../dtos/common.request.dto';
import { PlatformConfigApiResponse } from '../dtos/common.response.dto';
import { NansExecutiveDto, NansPostionDto, RoleDto } from '../dtos/common.dto';

import { IPlatformConfigService } from '../services/interfaces/platform-config.interface';
import { SuperAdminGuard } from '../../../shared/guards/super-admin.guard';
import { ExecType } from '../../../shared/enums/execs.enum';

@Controller('admin')
@ApiTags('Admin')
export class AdminController {
  constructor(
    @Inject('IExecutiveService')
    private readonly executiveService: IExecutiveService,

    @Inject('IAdminManagementService')
    private readonly adminManagementService: IAdminManagementService,

    @Inject('IPlatformConfigService')
    private readonly platformConfigService: IPlatformConfigService,
  ) {}

  @Get('executives')
  @GetNansExecutivesEndpoint()
  public async getExecutives(
    @Query('q') search_term?: string,
    @Query('year') year?: string,
    @Query('type') exec_type?: ExecType,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<PaginatedNansExecutivesApiResponse> {
    const result = await this.executiveService.getExecutives({
      search_term,
      year,
      exec_type,
      page: page,
      limit: limit,
    });

    return new PaginatedNansExecutivesApiResponse({
      data: result,
      page,
      limit,
    });
  }

  @Get('executives/:id')
  @GetNansExecutiveEndpoint()
  public async getExecutive(
    @Param('id') executive_id: string,
  ): Promise<NansExecutiveApiResponse> {
    const result = await this.executiveService.getExecutive(executive_id);
    return new NansExecutiveApiResponse(result);
  }

  @Post('executives')
  @CreateNansExecutiveEndpoint()
  public async createExecutive(
    @Body() body: CreateNansExecutiveRequestBody,
  ): Promise<NansExecutiveApiResponse> {
    const result = await this.executiveService.addExecutive(body);
    return new NansExecutiveApiResponse(result);
  }

  @Delete('executives/:id')
  @DeleteNansExecutiveEndpoint()
  public async deleteExecutive(
    @Param('id') executive_id: string,
  ): Promise<SuccessResponseBody> {
    await this.executiveService.deleteExecutive(executive_id);
    return new SuccessResponseBody({
      message: RESPONSE_MESSAGES.NansExecutive.Success.Deleted,
    });
  }

  @Patch('executives/:id')
  @UpdateNansExecutiveEndpoint()
  public async updateExecutive(
    @Param('id') executive_id: string,
    @Body() body: UpdateNansExecutiveRequestBody,
  ): Promise<NansExecutiveApiResponse> {
    const result = await this.executiveService.updateExecutive(
      executive_id,
      body,
    );
    return new NansExecutiveApiResponse(result);
  }

  @Get('')
  @UseGuards(SuperAdminGuard)
  @GetAdminsEndpoint()
  public async getAdmins(): Promise<AdminsApiResponse> {
    const result = await this.adminManagementService.getAdmins();
    return new AdminsApiResponse(result);
  }

  @Post('')
  @UseGuards(SuperAdminGuard)
  @CreateAdminEndpoint()
  public async createAdmin(
    @Body() body: CreateAdminRequestBody,
  ): Promise<AdminApiResponse> {
    const result = await this.adminManagementService.addAdmin(body);
    return new AdminApiResponse(result);
  }

  @Patch(':id')
  @UseGuards(SuperAdminGuard)
  @UpdateAdminEndpoint()
  public async update(
    @Param('id') admin_id: string,
    @Body() body: UpdateAdminRequestBody,
  ): Promise<AdminApiResponse> {
    const result = await this.adminManagementService.updateAdmin(
      admin_id,
      body,
    );
    return new AdminApiResponse(result);
  }

  @Delete(':id')
  @UseGuards(SuperAdminGuard)
  @RemoveAdminEndpoint()
  public async removeAdmin(
    @Param('id') admin_id: string,
  ): Promise<SuccessResponseBody> {
    await this.adminManagementService.removeAdmin(admin_id);
    return new SuccessResponseBody({
      message: RESPONSE_MESSAGES.Admin.Success.Deleted,
    });
  }

  @Get('roles')
  @UseGuards(SuperAdminGuard)
  @GetRolesEndpoint()
  public async getRoles(): Promise<SuccessResponseBody<RoleDto[]>> {
    const roles = await this.adminManagementService.getRoles();
    return new SuccessResponseBody({
      message: RESPONSE_MESSAGES.Role.Success.Retrieved,
      data: roles,
    });
  }

  @Get('nans-positions')
  @GetNansPositionsEndpoint()
  public async getNansPositions(): Promise<
    SuccessResponseBody<NansPostionDto[]>
  > {
    const positions = await this.executiveService.getNansPostions();
    return new SuccessResponseBody({
      message: RESPONSE_MESSAGES.NansPosition.Success.Retrieved,
      data: positions,
    });
  }

  @Post('nans-positions')
  @CreateNansPositionEndpoint()
  public async createNansPosition(
    @Body() body: CreateNansPositionRequestBody,
  ): Promise<SuccessResponseBody<NansPostionDto>> {
    const position = await this.executiveService.addNansPostion(body);
    return new SuccessResponseBody({
      message: RESPONSE_MESSAGES.NansPosition.Success.Retrieved,
      data: position,
    });
  }

  @Patch('platform-config')
  @UseGuards(SuperAdminGuard)
  @UpdatePlatformConfigEndpoint()
  public async updatePlatformConfig(
    @Body() body: UpdatePlatformConfigRequestBody,
  ): Promise<PlatformConfigApiResponse> {
    const platformConfig =
      await this.platformConfigService.updateSettings(body);

    return new PlatformConfigApiResponse(platformConfig);
  }

  @Get('platform-config')
  @GetPlatformConfigEndpoint()
  public async getPlatformConfig(): Promise<PlatformConfigApiResponse> {
    const platformConfig = await this.platformConfigService.getSettings();

    return new PlatformConfigApiResponse(platformConfig);
  }
}
