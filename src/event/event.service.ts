import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { EventDto } from './event.dto';

@Injectable()
export class EventService {
  constructor(private readonly entityManager: EntityManager) {}

  async saveEvent(event: EventDto): Promise<EventDto> {
    const newEvent = event.createEntity();
    await this.entityManager.persistAndFlush(newEvent);
    return EventDto.createFromEntity(newEvent);
  }
}
