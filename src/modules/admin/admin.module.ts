import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Admin } from '../../db/models/admins.model';
import { EmailService } from '../../lib/email/email.service';
import { AdminRepository } from './repositories/admin.repository';
import { RoleRepository } from './repositories/role.repository';
import { Role } from '../../db/models/roles.model';
import { ExecutiveService } from './services/executive.service';
import { AdminManagementService } from './services/admin-management.service';
import { AppSettings } from '../../db/models/app-settings.model';
import { PlatformConfigService } from './services/platform-config.service';
import { PlatformConfigRepository } from './repositories/platform-config.repository';
import { EventService } from '../../lib/event/event.service';
import { AdminEventListener } from './events/admin-event.listener';
import { NansExecutive } from '../../db/models/nans-executives.model';
import { NansPosition } from '../../db/models/nans-positions.model';
import { AdminController } from './controllers/admin.controller';
import { NansExecutiveRepository } from './repositories/nans-executive.repository';
import { NansPositionRepository } from './repositories/position.repository';

@Module({
  imports: [
    SequelizeModule.forFeature([
      AppSettings,
      Admin,
      NansExecutive,
      NansPosition,
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

    NansExecutiveRepository,
    {
      provide: 'INansExecutiveRepository',
      useExisting: NansExecutiveRepository,
    },

    RoleRepository,
    { provide: 'IRoleRepository', useExisting: RoleRepository },

    ExecutiveService,
    { provide: 'IExecutiveService', useExisting: ExecutiveService },

    AdminManagementService,
    {
      provide: 'IAdminManagementService',
      useExisting: AdminManagementService,
    },

    NansPositionRepository,
    { provide: 'INansPositionRepository', useExisting: NansPositionRepository },

    EmailService,
    { provide: 'IEmailService', useExisting: EmailService },

    AdminEventListener,

    EventService,
    {
      provide: 'IEventService',
      useExisting: EventService,
    },
  ],

  controllers: [AdminController],

  exports: [
    SequelizeModule,
    { provide: 'IAdminRepository', useExisting: AdminRepository },
  ],
})
export class AdminModule {}
