import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, Ctx, MessagePattern, NatsContext, Payload } from "@nestjs/microservices";
import { EventDto } from './event/event.dto';
import { CreateRequestContext, MikroORM } from '@mikro-orm/core';
import { CommandBus } from '@nestjs/cqrs';
import { TreatEventCommand } from './commands/impl/treat-event.command';
import { SaveEventCommand } from './commands/impl/save-event.command';

@Controller()
export class AppController {
  constructor(
    private readonly orm: MikroORM, // needed for @CreateRequestContext()
    @Inject('EVENT_SERVICE') private readonly client: ClientProxy,
    private readonly commandBus: CommandBus,
  ) {}

  @MessagePattern('event.>')
  @CreateRequestContext()
  async saveEvent(@Payload() data: unknown, @Ctx() context: NatsContext) {
    const savedEvent = await this.commandBus.execute(new SaveEventCommand(context.getSubject(), data));
    this.client.emit<number>('event-saved', savedEvent);
  }

  @MessagePattern('event-saved')
  @CreateRequestContext()
  async treatEvent(@Payload() eventDto: EventDto, @Ctx() context: NatsContext) {
    await this.commandBus.execute(new TreatEventCommand(eventDto));
  }
}
