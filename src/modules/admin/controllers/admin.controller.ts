import { Body, Controller, Inject, Post, Req } from '@nestjs/common';
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
  CreateSugExecutiveEndpoint,
} from '../decorators/admin.decorator';
import { ApiTags } from '@nestjs/swagger';

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
}
