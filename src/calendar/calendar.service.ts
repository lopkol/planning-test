import { Injectable } from '@nestjs/common';
import { ReservationCreatedEvent } from './reservation-events.dto';
import { getIntersectingDates, stringToDate } from '../helpers/date.helper';
import { MikroORM, Transaction } from '@mikro-orm/core';

@Injectable()
export class CalendarService {
  constructor(private readonly orm: MikroORM) {}

  async createReservation(dto: ReservationCreatedEvent, transaction: Transaction): Promise<void> {
    const connection = this.orm.em.getConnection();
    const startDate = stringToDate(dto.start, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    const endDate = stringToDate(dto.end, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

    const { row: { id: entryId } } = await connection.execute(
      'INSERT INTO calendar_entry (owner_urn, reservation_urn, activity, "start", "end", notes) VALUES (?, ?, ?, ?, ?, ?) RETURNING id',
      [dto.ownerUrn, dto.reservationUrn, dto.activity, startDate, endDate, dto.notes],
      transaction,
    );

    const days = getIntersectingDates(startDate, endDate);
    for (const day of days) {
      // we need to upsert because the em identity map cannot handle conflicts
      await connection.execute(
        'INSERT INTO calendar_day (owner_urn, "day") VALUES (?, ?) ON CONFLICT (owner_urn, day) DO NOTHING',
        [dto.ownerUrn, day],
        transaction,
      );
      await connection.execute(
        'INSERT INTO calendar_day_entries (calendar_day_owner_urn, calendar_day_day, calendar_entry_id) VALUES (?, ?, ?)',
        [dto.ownerUrn, day, entryId],
        transaction,
      );
    }
  }
}
