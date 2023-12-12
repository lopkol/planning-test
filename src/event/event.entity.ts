import {
  DateTimeType,
  Entity,
  EntityRepositoryType,
  JsonType,
  PrimaryKey,
  PrimaryKeyType,
  Property
} from '@mikro-orm/core';
import { EventRepository } from './event.repository';

@Entity({ customRepository: () => EventRepository })
export class Event {
  [EntityRepositoryType]?: EventRepository;

  @PrimaryKey()
  id: number;

  [PrimaryKeyType]?: number;

  @Property()
  subject: string;

  @Property({ type: DateTimeType })
  createdAt: Date;

  @Property({ type: JsonType })
  payload: unknown;
}
