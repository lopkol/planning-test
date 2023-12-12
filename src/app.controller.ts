import {Controller, Get, Inject} from '@nestjs/common';
import {ClientProxy, Ctx, MessagePattern, NatsContext, Payload} from "@nestjs/microservices";

@Controller()
export class AppController {
  constructor(@Inject('EVENT_SERVICE') private readonly client: ClientProxy) {}

  @MessagePattern('events')
  onEvents(@Payload() data: unknown, @Ctx() context: NatsContext) {
    console.log(`onEvents Subject: ${context.getSubject()}`, data);
    this.client.emit<number>('events.processed', { message: 'wahouuuu '+JSON.stringify(data) });
  }

  @MessagePattern('events.>')
  onEventsProcessed(@Payload() data: unknown, @Ctx() context: NatsContext) {
    console.log(`onEventsProcessed Subject: ${context.getSubject()}`, data);
  }
}
