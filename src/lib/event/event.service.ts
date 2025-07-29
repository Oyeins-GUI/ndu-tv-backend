import { Injectable } from '@nestjs/common';
import { IEventService } from './event.interface';
import { EventEmitter2, EventEmitterReadinessWatcher } from '@nestjs/event-emitter';
import { CustomLogger } from '../logger/logger.service';

@Injectable()
export class EventService implements IEventService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly eventEmitterReadinessWatcher: EventEmitterReadinessWatcher,
    private readonly logger: CustomLogger,
  ) {
    this.logger.setContext(EventService.name);
  }

  public async emitAsync<T>(event_name: string, event_payload: T): Promise<unknown> {
    await this.eventEmitterReadinessWatcher.waitUntilReady();
    return await this.eventEmitter.emitAsync(event_name, event_payload);
  }
  public emit<T>(event_name: string, event_payload: T): boolean {
    this.logger.debug(`emmiting event ${event_name}`);
    return this.eventEmitter.emit(event_name, event_payload);
  }
}
