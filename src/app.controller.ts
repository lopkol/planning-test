import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload } from '@nestjs/microservices';
import { EventDto } from './event/event.dto';
import { CreateRequestContext, MikroORM } from '@mikro-orm/core';
import { CommandBus } from '@nestjs/cqrs';
import { TreatEventCommand } from './commands/impl/treat-event.command';
import { SaveEventCommand } from './commands/impl/save-event.command';
import {
  NatsJetStreamClientProxy,
  NatsJetStreamContext,
} from '@nestjs-plugins/nestjs-nats-jetstream-transport';

@Controller()
export class AppController {
  constructor(
    private readonly orm: MikroORM, // needed for @CreateRequestContext()
    private readonly client: NatsJetStreamClientProxy,
    private readonly commandBus: CommandBus,
  ) {}

  @MessagePattern('event.>')
  @CreateRequestContext()
  async saveEvent(
    @Payload() data: unknown,
    @Ctx() context: NatsJetStreamContext,
  ) {
    try {
      const savedEvent = await this.commandBus.execute(
        new SaveEventCommand(context.message.subject, data),
      );
      this.client.emit<number>('event-saved', savedEvent);
      // await context.message.ackAck();
      // context.message.ack();
    } catch (e) {
      console.error(e);
      throw e;
      // context.message.nak();
    }
  }

  @MessagePattern('event-saved')
  @CreateRequestContext()
  async treatEvent(
    @Payload() eventDto: EventDto,
    @Ctx() context: NatsJetStreamContext,
  ) {
    try {
      await this.commandBus.execute(new TreatEventCommand(eventDto));
      // context.message.ack();
    } catch (e) {
      console.error(e);
      throw e;
      // context.message.nak();
    }
  }
}
