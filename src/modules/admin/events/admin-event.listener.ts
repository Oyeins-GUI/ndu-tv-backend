import { Inject, Injectable } from '@nestjs/common';
import { CustomLogger } from '../../../lib/logger/logger.service';
import { IPlatformConfigService } from '../services/interfaces/platform-config.interface';
import { OnEvent } from '@nestjs/event-emitter';
import { ADMIN_EVENT_NAMES } from './event.names';

@Injectable()
export class AdminEventListener {
  constructor(
    @Inject() private readonly logger: CustomLogger,
    @Inject('IPlatformConfigService')
    private readonly platformCongiService: IPlatformConfigService,
  ) {
    this.logger.setContext(AdminEventListener.name);
  }

  @OnEvent(ADMIN_EVENT_NAMES.SessionUpdated)
  public async handleSessionUpdated() {
    this.platformCongiService.getSettings();
  }
}
