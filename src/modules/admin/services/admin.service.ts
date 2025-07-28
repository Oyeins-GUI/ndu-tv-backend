import { Inject } from '@nestjs/common';
import { CustomLogger } from '../../../lib/logger/logger.service';
import {
  CreateAdminInput,
  IAdminRepository,
} from '../interfaces/admin-repository.interface';
import { IAdminService } from '../interfaces/admin.interface';
import { AdminDto } from '../dtos/admin.dto';
import { IDepartmentRepository } from '../interfaces/department-repository.interface';
import { IFacultyRepository } from '../interfaces/faculty-repository.interface';

export class AdminService implements IAdminService {
  constructor(
    private readonly logger: CustomLogger,
    @Inject('IAdminRepository')
    private readonly adminRepository: IAdminRepository,

    @Inject('IDepartmentRepository')
    private readonly departmentRepository: IDepartmentRepository,

    @Inject('IFacultyRepository')
    private readonly facultyRepository: IFacultyRepository,
  ) {}

  public async addAdmin(data: CreateAdminInput): Promise<AdminDto> {
    try {
    } catch (error) {
      this.logger.logServiceError(this.addAdmin.name, error, { data });
    }
  }
}
