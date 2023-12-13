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
      let calendarDay = await this.entityManager.findOne(CalendarDay, [dto.ownerUrn, day]);
      if (!calendarDay) {
        calendarDay = new CalendarDay();
        calendarDay.ownerUrn = dto.ownerUrn;
        calendarDay.day = day;
      }
      entry.calendarDays.add(calendarDay);
      this.entityManager.persist(calendarDay);
    }

    this.entityManager.persist(entry);
  }
}
