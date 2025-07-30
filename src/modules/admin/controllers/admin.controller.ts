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
import { IAdminService } from '../interfaces/admin.interface';
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
import { UpdateDepartmentInput } from '../interfaces/department-repository.interface';

@Controller('admin')
@ApiTags('Admin')
export class AdminController {
  constructor(
    @Inject('IAdminService') private readonly adminService: IAdminService,
  ) {}

  @Post('executive')
  @CreateSugExecutiveEndpoint()
  public async createExecutive(
    @Body() body: CreateSugExecutiveRequestBody,
  ): Promise<SugExecutiveApiResponse> {
    const result = await this.adminService.addExecutive(body);
    return new SugExecutiveApiResponse(result);
  }

  @Post('')
  @CreateAdminEndpoint()
  public async createAdmin(
    @Body() body: CreateAdminRequestBody,
  ): Promise<AdminApiResponse> {
    const result = await this.adminService.addAdmin(body);
    return new AdminApiResponse(result);
  }

  @Post('department')
  @CreateDepartmentEndpoint()
  public async createDepartment(
    @Body() body: CreateDepartmentRequestBody,
  ): Promise<DepartmentApiResponse> {
    const result = await this.adminService.addDepartment(body);
    return new DepartmentApiResponse(result);
  }

  @Patch('department/:id')
  @UpdateDepartmentEndpoint()
  public async updateDepartment(
    @Param('id') id: string,
    @Body() body: UpdateDepartmentRequestBody,
  ): Promise<DepartmentApiResponse> {
    const result = await this.adminService.updateDepartment(
      id,
      body as UpdateDepartmentInput,
    );
    return new DepartmentApiResponse(result);
  }

  @Delete('department:id')
  @DeleteDepartmentEndpoint()
  public async deleteDepartment(
    @Param('id') id: string,
  ): Promise<SuccessResponseBody> {
    await this.adminService.deleteDepartment(id);
    return new SuccessResponseBody({
      message: RESPONSE_MESSAGES.Department.Success.Deleted,
    });
  }

  @Post('faculty')
  @CreateFacultyEndpoint()
  public async createFaculty(
    @Body() body: CreateFacultyRequestBody,
  ): Promise<FacultyApiResponse> {
    const result = await this.adminService.addFaculty(body);
    return new FacultyApiResponse(result);
  }

  @Patch('faculty/:id')
  @UpdateFacultyEndpoint()
  public async updateFaculty(
    @Param('id') id: string,
    @Body() body: CreateFacultyRequestBody,
  ): Promise<FacultyApiResponse> {
    const result = await this.adminService.updateFaculty(id, body);
    return new FacultyApiResponse(result);
  }

  @Delete('faculty/:id')
  @DeleteFacultyEndpoint()
  public async deleteFaculty(
    @Param('id') id: string,
  ): Promise<SuccessResponseBody> {
    await this.adminService.deleteFaculty(id);
    return new SuccessResponseBody({
      message: RESPONSE_MESSAGES.Faculty.Success.Deleted,
    });
  }
}
