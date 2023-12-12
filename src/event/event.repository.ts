import { EntityRepository } from '@mikro-orm/postgresql';
import { Event } from './event.entity';

export class EventRepository extends EntityRepository<Event> {}
