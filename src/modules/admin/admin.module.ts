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
import { AdminService } from './services/admin.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
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

    SugPositionRepository,
    { provide: 'ISugPositionRepository', useExisting: SugPositionRepository },

    EmailService,
    { provide: 'IEmailService', useExisting: EmailService },

    AdminService,
    { provide: 'IAdminService', useExisting: AdminService },
  ],

  controllers: [AdminController],

  exports: [
    SequelizeModule,
    { provide: 'IAdminRepository', useExisting: AdminRepository },
  ],
})
export class AdminModule {}
