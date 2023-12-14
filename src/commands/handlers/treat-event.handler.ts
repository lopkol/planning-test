import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TreatEventCommand } from '../impl/treat-event.command';
import { EntityManager } from '@mikro-orm/postgresql';
import { CalendarService } from '../../calendar/calendar.service';
import { ReservationCreatedEvent } from '../../calendar/reservation-events.dto';
import { Event } from '../../event/event.entity';

@CommandHandler(TreatEventCommand)
export class TreatEventHandler implements ICommandHandler<TreatEventCommand> {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly calendarService: CalendarService,
  ) {}

  async execute(command: TreatEventCommand): Promise<void> {
    // console.log('treating event');
    await this.entityManager.begin();
    try {
      const dto = command.eventDto.payload as ReservationCreatedEvent;
      await this.calendarService.createReservation(dto);

      const event = await this.entityManager.findOne(Event, {
        id: command.eventDto.id,
      });
      event.treatedAt = new Date();
      await this.entityManager.commit();
      console.log('event treated');
    } catch (e) {
      await this.entityManager.rollback();
      console.error(e);
    }
    // console.log('event treated with id', event.id);
  }
}
