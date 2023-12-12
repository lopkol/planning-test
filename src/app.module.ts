import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientsModule, Transport } from "@nestjs/microservices";
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from './mikro-orm.config';
import { Event } from './event/event.entity';
import { EventRepository } from './event/event.repository';
import { EventService } from './event/event.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EVENT_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: ['nats://localhost:4222'],
        }
      },
    ]),
    MikroOrmModule.forRoot(mikroOrmConfig),
    MikroOrmModule.forFeature([Event]),
  ],
  controllers: [AppController],
  providers: [EventRepository, EventService],
})
export class AppModule {}
