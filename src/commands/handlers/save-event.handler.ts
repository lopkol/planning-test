import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SaveEventCommand } from '../impl/save-event.command';
import { EventService } from '../../event/event.service';
import { EventDto } from '../../event/event.dto';

@CommandHandler(SaveEventCommand)
export class SaveEventHandler implements ICommandHandler<SaveEventCommand> {
  constructor(private readonly eventService: EventService) {}

  async execute(command: SaveEventCommand): Promise<EventDto> {
    // console.log('saving event');
    const eventDto = new EventDto(command.subject, command.payload);
    const savedEvent = await this.eventService.saveEvent(eventDto);
    console.log('event saved');

    return savedEvent;
  }
}
