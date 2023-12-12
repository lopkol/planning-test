import { Migration } from '@mikro-orm/migrations';

export class Migration20231212160747 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "event" ("id" serial primary key, "subject" varchar(255) not null, "created_at" timestamptz(0) not null, "payload" jsonb not null);');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "event" cascade;');
  }

}
