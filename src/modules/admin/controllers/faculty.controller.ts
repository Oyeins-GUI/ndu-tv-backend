import { Controller, Inject, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetFacultiesEndpoint } from '../decorators/admin.decorator';
import { FacultiesApiResponse } from '../dtos/common.response.dto';
import { IAcademicService } from '../services/interfaces/academic.interface';

@ApiTags('Faculty')
@Controller('faculty')
export class FacultyController {
  constructor(
    @Inject('IAcademicService')
    private readonly academicService: IAcademicService,
  ) {}

  @Get('')
  @GetFacultiesEndpoint()
  public async getFaculties(): Promise<FacultiesApiResponse> {
    const result = await this.academicService.getFaculties();
    return new FacultiesApiResponse(result);
  }
}
