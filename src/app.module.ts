import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientsModule, Transport } from "@nestjs/microservices";
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from './mikro-orm.config';
import { Event } from './event/event.entity';
import { EventRepository } from './event/event.repository';
import { EventService } from './event/event.service';
import { CalendarDay } from './calendar/calendar-day.entity';
import { CalendarEntry } from './calendar/calendar-entry.entity';
import { CalendarDayRepository } from './calendar/calendar-day.repository';
import { CalendarEntryRepository } from './calendar/calendar-entry.repository';
import { CalendarService } from './calendar/calendar.service';
import { CqrsModule } from '@nestjs/cqrs';
import { SaveEventHandler } from './commands/handlers/save-event.handler';
import { TreatEventHandler } from './commands/handlers/treat-event.handler';

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
    MikroOrmModule.forFeature([Event, CalendarDay, CalendarEntry]),
    CqrsModule,
  ],
  controllers: [AppController],
  providers: [
    EventRepository,
    CalendarDayRepository,
    CalendarEntryRepository,
    EventService,
    CalendarService,
    SaveEventHandler,
    TreatEventHandler,
  ],
})
export class AppModule {}
