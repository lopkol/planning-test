import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { LoadStrategy } from '@mikro-orm/core';
import { Event } from './event/event.entity';


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
  ],
  migrations: {
    tableName: 'migration_history',
    snapshot: false,
  },
});
