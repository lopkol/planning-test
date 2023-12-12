import { Event } from './event.entity';

export class EventDto {
  id?: number;
  subject: string;
  createdAt?: Date;
  payload: unknown;

  constructor(subject: string, payload: unknown) {
    this.subject = subject;
    this.payload = payload;
  }

  public static createFromEntity(entity: Event): EventDto {
    const dto = new EventDto(entity.subject, entity.payload);
    dto.id = entity.id;
    dto.createdAt = entity.createdAt;

    return dto;
  }

  public createEntity(): Event {
    const entity = new Event();
    entity.subject = this.subject;
    entity.payload = this.payload;
    entity.createdAt = new Date();

    return entity;
  }
}
