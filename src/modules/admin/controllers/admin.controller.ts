import { Body, Controller, Inject, Post, Req } from '@nestjs/common';
import { IAdminService } from '../interfaces/admin.interface';
import { CreateSugExecutiveRequestBody } from '../dtos/admin.request.dto';
import { Request } from 'express';
import { SugExecutiveApiResponse } from '../dtos/admin.reponse.dto';
import { CreateSugExecutiveEndpoint } from '../decorators/admin.decorator';

@Controller('admin')
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
}
