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
  Req,
  UseGuards,
} from '@nestjs/common';
import { IAcademicService } from '../services/interfaces/academic.interface';
import { IExecutiveService } from '../services/interfaces/executive.interface';
import { IAdminManagementService } from '../services/interfaces/admin-management.interface';
import {
  CreateAdminRequestBody,
  CreateSugExecutiveRequestBody,
  UpdateAdminRequestBody,
  UpdateSugExecutiveRequestBody,
} from '../dtos/admin.request.dto';

import {
  AdminApiResponse,
  AdminsApiResponse,
  PaginatedSugExecutivesApiResponse,
  SugExecutiveApiResponse,
  SugExecutivesApiResponse,
} from '../dtos/admin.reponse.dto';
import {
  AddSessionEndpoint,
  CreateAdminEndpoint,
  CreateDepartmentEndpoint,
  CreateFacultyEndpoint,
  CreateSugExecutiveEndpoint,
  CreateSugPositionEndpoint,
  DeleteDepartmentEndpoint,
  DeleteFacultyEndpoint,
  DeleteSugExecutiveEndpoint,
  GetAdminsEndpoint,
  GetAllSugExecutivesEndpoint,
  GetPlatformConfigEndpoint,
  GetRolesEndpoint,
  GetSessionsEndpoint,
  GetSugExecutivesEndpoint,
  GetSugPositionsEndpoint,
  RemoveAdminEndpoint,
  UpdateAdminEndpoint,
  UpdateDepartmentEndpoint,
  UpdateFacultyEndpoint,
  UpdatePlatformConfigEndpoint,
  UpdateSessionEndpoint,
  UpdateSugExecutiveEndpoint,
  UpdateSugPositionEndpoint,
} from '../decorators/admin.decorator';
import { ApiTags } from '@nestjs/swagger';
import { RESPONSE_MESSAGES } from '../../../shared/responses/response-messages';
import { SuccessResponseBody } from '../../../shared/responses/success-response';
import {
  CreateAcademicSessionRequestBody,
  CreateDepartmentRequestBody,
  CreateFacultyRequestBody,
  CreateSugPositionRequestBody,
  UpdateAcademicSessionRequestBody,
  UpdateDepartmentRequestBody,
  UpdatePlatformConfigRequestBody,
  UpdateSugPositionRequestBody,
} from '../dtos/common.request.dto';
import {
  DepartmentApiResponse,
  FacultyApiResponse,
  PlatformConfigApiResponse,
} from '../dtos/common.response.dto';
import { AcademicSessionDto, RoleDto, SugPostionDto } from '../dtos/common.dto';
import { SCOPE } from '../../../shared/enums';

import { IPlatformConfigService } from '../services/interfaces/platform-config.interface';
import { CentralAdminGuard } from '../guards/central-admin.guard';

@Controller('admin')
@ApiTags('Admin')
@UseGuards(CentralAdminGuard)
export class AdminController {
  constructor(
    @Inject('IAcademicService')
    private readonly academicService: IAcademicService,

    @Inject('IExecutiveService')
    private readonly executiveService: IExecutiveService,

    @Inject('IAdminManagementService')
    private readonly adminManagementService: IAdminManagementService,

    @Inject('IPlatformConfigService')
    private readonly platformConfigService: IPlatformConfigService,
  ) {}

  @Get('executives/central')
  @GetSugExecutivesEndpoint()
  public async getCentralExecutives(
    @Query('session_id') session_id?: string,
  ): Promise<SugExecutivesApiResponse> {
    const result = await this.executiveService.getExecutives({
      scope: SCOPE.CENTRAL,
      session_id,
    });
    return new SugExecutivesApiResponse(result);
  }

  @Get('executives')
  @GetAllSugExecutivesEndpoint()
  public async getAllExecutives(
    @Query('session_id') session_id?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<PaginatedSugExecutivesApiResponse> {
    const result = await this.executiveService.getAllExecutives(
      {
        page: page ?? 1,
        limit: limit ?? 50,
      },
      session_id,
    );
    return new PaginatedSugExecutivesApiResponse({
      data: result,
      page: page ?? 1,
      limit: limit ?? 50,
    });
  }

  @Get('executives/faculty/:id')
  @GetSugExecutivesEndpoint()
  public async getFacultyExecutives(
    @Param('id') faculty_id: string,
    @Query('session_id') session_id?: string,
  ): Promise<SugExecutivesApiResponse> {
    const result = await this.executiveService.getExecutives({
      scope: SCOPE.FACULTY,
      faculty_id,
      session_id,
    });
    return new SugExecutivesApiResponse(result);
  }

  @Get('executives/department/:id')
  @GetSugExecutivesEndpoint()
  public async getDepartmentExecutives(
    @Param('id') department_id: string,
    @Query('session_id') session_id?: string,
  ): Promise<SugExecutivesApiResponse> {
    const result = await this.executiveService.getExecutives({
      scope: SCOPE.FACULTY,
      department_id,
      session_id,
    });
    return new SugExecutivesApiResponse(result);
  }

  @Post('executives')
  @CreateSugExecutiveEndpoint()
  public async createExecutive(
    @Body() body: CreateSugExecutiveRequestBody,
  ): Promise<SugExecutiveApiResponse> {
    const result = await this.executiveService.addExecutive(body);
    return new SugExecutiveApiResponse(result);
  }

  @Delete('executives/:id')
  @DeleteSugExecutiveEndpoint()
  public async deleteExecutive(
    @Param('id') executive_id: string,
  ): Promise<SuccessResponseBody> {
    await this.executiveService.deleteExecutive(executive_id);
    return new SuccessResponseBody({
      message: RESPONSE_MESSAGES.SugExecutive.Success.Deleted,
    });
  }

  @Patch('executives/:id')
  @UpdateSugExecutiveEndpoint()
  public async updateExecutive(
    @Param('id') executive_id: string,
    @Body() body: UpdateSugExecutiveRequestBody,
  ): Promise<SugExecutiveApiResponse> {
    const result = await this.executiveService.updateExecutive(
      executive_id,
      body,
    );
    return new SugExecutiveApiResponse(result);
  }

  @Get('')
  @GetAdminsEndpoint()
  public async getAdmins(): Promise<AdminsApiResponse> {
    const result = await this.adminManagementService.getAdmins();
    return new AdminsApiResponse(result);
  }

  @Post('')
  @CreateAdminEndpoint()
  public async createAdmin(
    @Body() body: CreateAdminRequestBody,
  ): Promise<AdminApiResponse> {
    const result = await this.adminManagementService.addAdmin(body);
    return new AdminApiResponse(result);
  }

  @Patch(':id')
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
  @RemoveAdminEndpoint()
  public async removeAdmin(
    @Param('id') admin_id: string,
  ): Promise<SuccessResponseBody> {
    await this.adminManagementService.removeAdmin(admin_id);
    return new SuccessResponseBody({
      message: RESPONSE_MESSAGES.Admin.Success.Deleted,
    });
  }

  @Post('departments')
  @CreateDepartmentEndpoint()
  public async createDepartment(
    @Body() body: CreateDepartmentRequestBody,
  ): Promise<DepartmentApiResponse> {
    const result = await this.academicService.addDepartment(body);
    return new DepartmentApiResponse(result);
  }

  @Patch('departments/:id')
  @UpdateDepartmentEndpoint()
  public async updateDepartment(
    @Param('id') id: string,
    @Body() body: UpdateDepartmentRequestBody,
  ): Promise<DepartmentApiResponse> {
    const result = await this.academicService.updateDepartment(id, body);
    return new DepartmentApiResponse(result);
  }

  @Delete('departments/:id')
  @DeleteDepartmentEndpoint()
  public async deleteDepartment(
    @Param('id') id: string,
  ): Promise<SuccessResponseBody> {
    await this.academicService.deleteDepartment(id);
    return new SuccessResponseBody({
      message: RESPONSE_MESSAGES.Department.Success.Deleted,
    });
  }

  @Post('faculties')
  @CreateFacultyEndpoint()
  public async createFaculty(
    @Body() body: CreateFacultyRequestBody,
  ): Promise<FacultyApiResponse> {
    const result = await this.academicService.addFaculty(body);
    return new FacultyApiResponse(result);
  }

  @Patch('faculties/:id')
  @UpdateFacultyEndpoint()
  public async updateFaculty(
    @Param('id') id: string,
    @Body() body: CreateFacultyRequestBody,
  ): Promise<FacultyApiResponse> {
    const result = await this.academicService.updateFaculty(id, body);
    return new FacultyApiResponse(result);
  }

  @Delete('faculties/:id')
  @DeleteFacultyEndpoint()
  public async deleteFaculty(
    @Param('id') id: string,
  ): Promise<SuccessResponseBody> {
    await this.academicService.deleteFaculty(id);
    return new SuccessResponseBody({
      message: RESPONSE_MESSAGES.Faculty.Success.Deleted,
    });
  }

  @Get('roles')
  @GetRolesEndpoint()
  public async getRoles(): Promise<SuccessResponseBody<RoleDto[]>> {
    const roles = await this.adminManagementService.getRoles();
    return new SuccessResponseBody({
      message: RESPONSE_MESSAGES.Role.Success.Retrieved,
      data: roles,
    });
  }

  @Get('acadmic-sessions')
  @GetSessionsEndpoint()
  public async getAcademicSessions(): Promise<
    SuccessResponseBody<AcademicSessionDto[]>
  > {
    const sessions = await this.academicService.getAcademicSessions();
    return new SuccessResponseBody({
      message: RESPONSE_MESSAGES.AcademicSession.Success.Retrieved,
      data: sessions,
    });
  }

  @Post('acadmic-sessions')
  @AddSessionEndpoint()
  public async addAcademicSessions(
    @Body() body: CreateAcademicSessionRequestBody,
  ): Promise<SuccessResponseBody<AcademicSessionDto>> {
    const session = await this.academicService.addAcademicSession(body);
    return new SuccessResponseBody({
      message: RESPONSE_MESSAGES.AcademicSession.Success.Created,
      data: session,
    });
  }

  @Patch('acadmic-sessions/:id')
  @UpdateSessionEndpoint()
  public async updateAcademicSessions(
    @Param('id') session_id: string,
    @Body() body: UpdateAcademicSessionRequestBody,
  ): Promise<SuccessResponseBody<AcademicSessionDto>> {
    const session = await this.academicService.updateAcademicSession(
      session_id,
      body,
    );
    return new SuccessResponseBody({
      message: RESPONSE_MESSAGES.AcademicSession.Success.Updated,
      data: session,
    });
  }

  @Get('sug-positions')
  @GetSugPositionsEndpoint()
  public async getSugPositions(): Promise<
    SuccessResponseBody<SugPostionDto[]>
  > {
    const positions = await this.executiveService.getSugPostions();
    return new SuccessResponseBody({
      message: RESPONSE_MESSAGES.SugPosition.Success.Retrieved,
      data: positions,
    });
  }

  @Post('sug-positions')
  @CreateSugPositionEndpoint()
  public async createSugPosition(
    @Body() body: CreateSugPositionRequestBody,
  ): Promise<SuccessResponseBody<SugPostionDto>> {
    const position = await this.executiveService.addSugPostion(body);
    return new SuccessResponseBody({
      message: RESPONSE_MESSAGES.SugPosition.Success.Retrieved,
      data: position,
    });
  }

  @Patch('platform-config')
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

  @Patch('sug-positions/:id')
  @UpdateSugPositionEndpoint()
  public async updateSugPosition(
    @Param('id') sug_position_id: string,
    @Body() body: UpdateSugPositionRequestBody,
  ): Promise<SuccessResponseBody<SugPostionDto>> {
    const position = await this.executiveService.updateSugPostion(
      sug_position_id,
      body,
    );
    return new SuccessResponseBody({
      message: RESPONSE_MESSAGES.SugPosition.Success.Updated,
      data: position,
    });
  }
}
