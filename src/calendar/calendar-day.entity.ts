import {
  Collection,
  Entity,
  EntityRepositoryType,
  ManyToMany,
  PrimaryKey,
  PrimaryKeyType,
} from '@mikro-orm/core';
import { CalendarDayRepository } from './calendar-day.repository';
import { CalendarEntry } from './calendar-entry.entity';

@Entity({ customRepository: () => CalendarDayRepository })
export class CalendarDay {
  [EntityRepositoryType]?: CalendarDayRepository;

  @PrimaryKey()
  ownerUrn: string;

  @PrimaryKey()
  day: string; // date of format YYYY-MM-DD

  [PrimaryKeyType]?: [string, string];

  @ManyToMany(() => CalendarEntry, 'calendarDays', { owner: true })
  entries: Collection<CalendarEntry> = new Collection<CalendarEntry>(this, [], true);
}
