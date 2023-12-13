import { EntityRepository } from '@mikro-orm/postgresql';
import { CalendarDay } from './calendar-day.entity';

export class CalendarDayRepository extends EntityRepository<CalendarDay> {}
