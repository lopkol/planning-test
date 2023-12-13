import { EntityRepository } from '@mikro-orm/postgresql';
import { CalendarEntry } from './calendar-entry.entity';

export class CalendarEntryRepository extends EntityRepository<CalendarEntry> {}
