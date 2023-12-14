import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NatsJetStreamTransport } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { NatsJetStreamClientConfigFactory } from './nats-config/nats-jet-stream-client-config.factory';
import { NatsConfigModule } from './nats-config/nats-config.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.local'],
      isGlobal: true,
    }),
    NatsConfigModule,
    MikroOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          ...mikroOrmConfig,
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
        };
      },
      inject: [ConfigService],
    }),
    MikroOrmModule.forFeature([Event, CalendarDay, CalendarEntry]),
    NatsJetStreamTransport.registerAsync({
      imports: [NatsConfigModule],
      useFactory: async (factory: NatsJetStreamClientConfigFactory) => {
        return factory.create();
      },
      inject: [NatsJetStreamClientConfigFactory],
    }),
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
