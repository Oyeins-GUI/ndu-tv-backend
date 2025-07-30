import { Controller, Inject, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetFacultiesEndpoint } from '../decorators/admin.decorator';
import { FacultiesApiResponse } from '../dtos/common.response.dto';
import { IAdminService } from '../interfaces/admin.interface';

@ApiTags('Faculty')
@Controller('faculty')
export class FacultyController {
  constructor(
    @Inject('IAdminService') private readonly adminService: IAdminService,
  ) {}

  @Get('')
  @GetFacultiesEndpoint()
  public async getFaculties(): Promise<FacultiesApiResponse> {
    const result = await this.adminService.getFaculties();
    return new FacultiesApiResponse(result);
  }
}
