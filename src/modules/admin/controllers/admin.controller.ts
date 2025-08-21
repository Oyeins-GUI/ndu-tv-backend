import {
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { IAcademicService } from '../services/interfaces/academic.interface';
import { IExecutiveService } from '../services/interfaces/executive.interface';
import { IAdminManagementService } from '../services/interfaces/admin-management.interface';
import {
  CreateAdminRequestBody,
  CreateSugExecutiveRequestBody,
} from '../dtos/admin.request.dto';
import { Request } from 'express';
import {
  AdminApiResponse,
  SugExecutiveApiResponse,
} from '../dtos/admin.reponse.dto';
import {
  CreateAdminEndpoint,
  CreateDepartmentEndpoint,
  CreateFacultyEndpoint,
  CreateSugExecutiveEndpoint,
  DeleteDepartmentEndpoint,
  DeleteFacultyEndpoint,
  UpdateDepartmentEndpoint,
  UpdateFacultyEndpoint,
} from '../decorators/admin.decorator';
import { ApiTags } from '@nestjs/swagger';
import { RESPONSE_MESSAGES } from '../../../shared/responses/response-messages';
import { SuccessResponseBody } from '../../../shared/responses/success-response';
import {
  CreateDepartmentRequestBody,
  CreateFacultyRequestBody,
  UpdateDepartmentRequestBody,
} from '../dtos/common.request.dto';
import {
  DepartmentApiResponse,
  FacultyApiResponse,
} from '../dtos/common.response.dto';

@Controller('admin')
@ApiTags('Admin')
export class AdminController {
  constructor(
    @Inject('IAcademicService')
    private readonly academicService: IAcademicService,

    @Inject('IExecutiveService')
    private readonly executiveService: IExecutiveService,

    @Inject('IAdminManagementService')
    private readonly adminManagementService: IAdminManagementService,
  ) {}

  @Post('executive')
  @CreateSugExecutiveEndpoint()
  public async createExecutive(
    @Body() body: CreateSugExecutiveRequestBody,
  ): Promise<SugExecutiveApiResponse> {
    const result = await this.executiveService.addExecutive(body);
    return new SugExecutiveApiResponse(result);
  }

  @Post('')
  @CreateAdminEndpoint()
  public async createAdmin(
    @Body() body: CreateAdminRequestBody,
  ): Promise<AdminApiResponse> {
    const result = await this.adminManagementService.addAdmin(body);
    return new AdminApiResponse(result);
  }

  @Post('department')
  @CreateDepartmentEndpoint()
  public async createDepartment(
    @Body() body: CreateDepartmentRequestBody,
  ): Promise<DepartmentApiResponse> {
    const result = await this.academicService.addDepartment(body);
    return new DepartmentApiResponse(result);
  }

  @Patch('department/:id')
  @UpdateDepartmentEndpoint()
  public async updateDepartment(
    @Param('id') id: string,
    @Body() body: UpdateDepartmentRequestBody,
  ): Promise<DepartmentApiResponse> {
    const result = await this.academicService.updateDepartment(id, body);
    return new DepartmentApiResponse(result);
  }

  @Delete('department/:id')
  @DeleteDepartmentEndpoint()
  public async deleteDepartment(
    @Param('id') id: string,
  ): Promise<SuccessResponseBody> {
    await this.academicService.deleteDepartment(id);
    return new SuccessResponseBody({
      message: RESPONSE_MESSAGES.Department.Success.Deleted,
    });
  }

  @Post('faculty')
  @CreateFacultyEndpoint()
  public async createFaculty(
    @Body() body: CreateFacultyRequestBody,
  ): Promise<FacultyApiResponse> {
    const result = await this.academicService.addFaculty(body);
    return new FacultyApiResponse(result);
  }

  @Patch('faculty/:id')
  @UpdateFacultyEndpoint()
  public async updateFaculty(
    @Param('id') id: string,
    @Body() body: CreateFacultyRequestBody,
  ): Promise<FacultyApiResponse> {
    const result = await this.academicService.updateFaculty(id, body);
    return new FacultyApiResponse(result);
  }

  @Delete('faculty/:id')
  @DeleteFacultyEndpoint()
  public async deleteFaculty(
    @Param('id') id: string,
  ): Promise<SuccessResponseBody> {
    await this.academicService.deleteFaculty(id);
    return new SuccessResponseBody({
      message: RESPONSE_MESSAGES.Faculty.Success.Deleted,
    });
  }
}
