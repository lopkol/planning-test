import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { ReservationCreatedEvent } from './reservation-events.dto';
import { CalendarEntry } from './calendar-entry.entity';
import { getIntersectingDates, stringToDate } from '../helpers/date.helper';
import { CalendarDay } from './calendar-day.entity';

@Injectable()
export class CalendarService {
  constructor(private readonly entityManager: EntityManager) {}

  async createReservation(dto: ReservationCreatedEvent): Promise<void> {
    const entry = new CalendarEntry();
    entry.ownerUrn = dto.ownerUrn;
    entry.reservationUrn = dto.reservationUrn;
    entry.activity = dto.activity;
    entry.start = stringToDate(dto.start, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    entry.end = stringToDate(dto.start, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    entry.notes = dto.notes;

    const days = getIntersectingDates(entry.start, entry.end);
    for (const day of days) {
      // we need to upsert because the em identity map cannot handle conflicts
      await this.entityManager.upsert(CalendarDay, { ownerUrn: dto.ownerUrn, day });
      let calendarDay = this.entityManager.getReference(CalendarDay, [dto.ownerUrn, day]);
      entry.calendarDays.add(calendarDay);
    }

    this.entityManager.persist(entry);
  }
}
