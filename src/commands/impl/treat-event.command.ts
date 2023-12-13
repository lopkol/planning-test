import { EventDto } from '../../event/event.dto';

export class TreatEventCommand {
  constructor(public readonly eventDto: EventDto) {}
}
