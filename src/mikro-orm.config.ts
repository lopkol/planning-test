import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { LoadStrategy } from '@mikro-orm/core';
import { Event } from './event/event.entity';
import { CalendarDay } from './calendar/calendar-day.entity';
import { CalendarEntry } from './calendar/calendar-entry.entity';


export default defineConfig({
  driver: PostgreSqlDriver,
  dbName: 'planning-test',
  host: 'localhost',
  port: 5442,
  user: 'dbadmin',
  password: 'UltimateDevPassword',
  debug: true,
  loadStrategy: LoadStrategy.JOINED,
  entities: [
    Event,
    CalendarDay,
    CalendarEntry,
  ],
  migrations: {
    tableName: 'migration_history',
    snapshot: false,
  },
});
