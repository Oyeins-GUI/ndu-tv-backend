import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Admin } from '../../db/models/admins.model';
import { Department } from '../../db/models/departments.model';
import { Faculty } from '../../db/models/faculties.model';
import { SugExecutive } from '../../db/models/sug-executives.model';
import { SugPosition } from '../../db/models/sug-positions.model';
import { AcademicSession } from '../../db/models/academic-sessions.model';
import { EmailService } from '../../lib/email/email.service';
import { AcademicSessionRepository } from './repositories/academic-session.repository';
import { AdminRepository } from './repositories/admin.repository';
import { DepartmentRepository } from './repositories/department.repository';
import { FacultyRepository } from './repositories/faculty.repository';
import { SugPositionRepository } from './repositories/position.repository';
import { RoleRepository } from './repositories/role.repository';
import { SugExecutiveRepository } from './repositories/sug-executive.repository';
import { AdminController } from './controllers/admin.controller';
import { Role } from '../../db/models/roles.model';
import { DepartmentController } from './controllers/department.controller';
import { FacultyController } from './controllers/faculty.controller';
import { AcademicService } from './services/academic.service';
import { ExecutiveService } from './services/executive.service';
import { AdminManagementService } from './services/admin-management.service';
import { AppSettings } from '../../db/models/app-settings.model';
import { PlatformConfigService } from './services/platform-config.service';
import { PlatformConfigRepository } from './repositories/platform-config.repository';
import { CentralAdminGuard } from './guards/central-admin.guard';

//Module appears too large did not think it will grow like this [makes me look like i don tnow what am doing i know :) ]

@Module({
  imports: [
    SequelizeModule.forFeature([
      AppSettings,
      Admin,
      Department,
      Faculty,
      SugExecutive,
      SugPosition,
      AcademicSession,
      Role,
    ]),
  ],

  providers: [
    PlatformConfigRepository,
    {
      provide: 'IPlatformConfigRepository',
      useExisting: PlatformConfigRepository,
    },

    PlatformConfigService,

    { provide: 'IPlatformConfigService', useExisting: PlatformConfigService },

    AdminRepository,
    { provide: 'IAdminRepository', useExisting: AdminRepository },

    DepartmentRepository,
    { provide: 'IDepartmentRepository', useExisting: DepartmentRepository },

    FacultyRepository,
    { provide: 'IFacultyRepository', useExisting: FacultyRepository },

    SugExecutiveRepository,
    { provide: 'ISugExecutiveRepository', useExisting: SugExecutiveRepository },

    RoleRepository,
    { provide: 'IRoleRepository', useExisting: RoleRepository },

    AcademicSessionRepository,
    {
      provide: 'IAcademicSessionRepository',
      useExisting: AcademicSessionRepository,
    },

    AcademicService,
    {
      provide: 'IAcademicService',
      useExisting: AcademicService,
    },

    ExecutiveService,
    { provide: 'IExecutiveService', useExisting: ExecutiveService },

    AdminManagementService,
    {
      provide: 'IAdminManagementService',
      useExisting: AdminManagementService,
    },

    SugPositionRepository,
    { provide: 'ISugPositionRepository', useExisting: SugPositionRepository },

    EmailService,
    { provide: 'IEmailService', useExisting: EmailService },

    CentralAdminGuard,
  ],

  controllers: [AdminController, DepartmentController, FacultyController],

  exports: [
    SequelizeModule,
    { provide: 'IAdminRepository', useExisting: AdminRepository },
  ],
})
export class AdminModule {}
