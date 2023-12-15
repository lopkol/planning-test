import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TreatEventCommand } from '../impl/treat-event.command';
import { CalendarService } from '../../calendar/calendar.service';
import { ReservationCreatedEvent } from '../../calendar/reservation-events.dto';
import { MikroORM } from '@mikro-orm/core';

@CommandHandler(TreatEventCommand)
export class TreatEventHandler implements ICommandHandler<TreatEventCommand> {
  constructor(
    private readonly orm: MikroORM,
    private readonly calendarService: CalendarService,
  ) {}

  async execute(command: TreatEventCommand): Promise<void> {
    //console.log('treating event');
    const connection = this.orm.em.getConnection();
    const transaction = await connection.begin();
    try {
      const dto = command.eventDto.payload as ReservationCreatedEvent;
      await this.calendarService.createReservation(dto, transaction);

      await connection.execute(
        'UPDATE event SET treated_at = ? WHERE id = ?',
        [new Date(), command.eventDto.id],
        transaction,
      );
      await connection.commit(transaction);
      console.log('event treated');
    } catch (e) {
      await connection.rollback(transaction);
      console.error(e);
    }
    // console.log('event treated with id', event.id);
  }
}
