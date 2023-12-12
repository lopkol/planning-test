import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, Ctx, MessagePattern, NatsContext, Payload } from "@nestjs/microservices";
import { EventDto } from './event/event.dto';
import { EventService } from './event/event.service';
import { CreateRequestContext, MikroORM } from '@mikro-orm/core';

@Controller()
export class AppController {
  constructor(
    private readonly orm: MikroORM, // needed for @CreateRequestContext()
    @Inject('EVENT_SERVICE') private readonly client: ClientProxy,
    private readonly eventService: EventService
  ) {}

  @MessagePattern('event.>')
  @CreateRequestContext()
  async saveEvent(@Payload() data: unknown, @Ctx() context: NatsContext) {
    console.log('saving event');
    const event = new EventDto(context.getSubject(), data);
    const savedEvent = await this.eventService.saveEvent(event);
    console.log('event saved');

    this.client.emit<number>('event-saved', savedEvent);
  }

  @MessagePattern('event-saved')
  @CreateRequestContext()
  treatEvent(@Payload() data: unknown, @Ctx() context: NatsContext) {
    console.log(`Subject: ${context.getSubject()}`, data);
  }
}
