import {
  Collection,
  DateTimeType,
  Entity,
  EntityRepositoryType,
  Index,
  ManyToMany,
  PrimaryKey,
  PrimaryKeyType,
  Property,
  Unique
} from '@mikro-orm/core';
import { CalendarEntryRepository } from './calendar-entry.repository';
import { CalendarDay } from './calendar-day.entity';

@Entity({ customRepository: () => CalendarEntryRepository })
@Unique({ properties: ['ownerUrn', 'reservationUrn'] })
@Index({ properties: ['ownerUrn', 'start', 'end'] })
export class CalendarEntry {
  [EntityRepositoryType]?: CalendarEntryRepository;

  @PrimaryKey()
  id: number;

  [PrimaryKeyType]?: number;

  @Property()
  ownerUrn: string;

  @Property()
  reservationUrn: string;

  @Property()
  activity: string;

  @Property({ type: DateTimeType })
  start: Date;

  @Property({ type: DateTimeType })
  end: Date;

  @Property({ nullable: true })
  notes?: string;

  @Property({ type: DateTimeType, columnType: 'timestamptz', defaultRaw: 'now()' })
  createdAt: Date;

  @Property({ type: DateTimeType, columnType: 'timestamptz', defaultRaw: 'now()', onUpdate: () => new Date() })
  updatedAt: Date;

  @ManyToMany(() => CalendarDay, 'entries')
  calendarDays: Collection<CalendarDay> = new Collection<CalendarDay>(this, [], true);
}
