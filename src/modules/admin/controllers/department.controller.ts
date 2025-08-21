import { Controller, Inject, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetDepartmentsEndpoint } from '../decorators/admin.decorator';
import { DepartmentsApiResponse } from '../dtos/common.response.dto';
import { IAcademicService } from '../services/interfaces/academic.interface';

@ApiTags('Department')
@Controller('department')
export class DepartmentController {
  constructor(
    @Inject('IAcademicService')
    private readonly academicService: IAcademicService,
  ) {}

  @Get('')
  @GetDepartmentsEndpoint()
  public async getDepartments(
    @Query('faculty_id') faculty_id?: string,
  ): Promise<DepartmentsApiResponse> {
    const result = await this.academicService.getDepartments(faculty_id);
    return new DepartmentsApiResponse(result);
  }
}
