import { Controller, Inject, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetFacultiesEndpoint } from '../decorators/admin.decorator';
import {
  FacultiesApiResponse,
  FacultyApiResponse,
} from '../dtos/common.response.dto';
import { IAcademicService } from '../services/interfaces/academic.interface';

@ApiTags('Faculty')
@Controller('faculties')
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

  @Get(':id')
  @GetFacultiesEndpoint()
  public async getFaculty(
    @Param('id') faculty_id: string,
  ): Promise<FacultyApiResponse> {
    const result = await this.academicService.getFaculty(faculty_id);
    return new FacultyApiResponse(result);
  }
}
