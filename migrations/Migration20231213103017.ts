import { Migration } from '@mikro-orm/migrations';

export class Migration20231213103017 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "calendar_day" ("owner_urn" varchar(255) not null, "day" varchar(255) not null, constraint "calendar_day_pkey" primary key ("owner_urn", "day"));');

    this.addSql('create table "calendar_entry" ("id" serial primary key, "owner_urn" varchar(255) not null, "reservation_urn" varchar(255) not null, "activity" varchar(255) not null, "start" timestamptz(0) not null, "end" timestamptz(0) not null, "notes" varchar(255) null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now());');
    this.addSql('create index "calendar_entry_owner_urn_start_end_index" on "calendar_entry" ("owner_urn", "start", "end");');
    this.addSql('alter table "calendar_entry" add constraint "calendar_entry_owner_urn_reservation_urn_unique" unique ("owner_urn", "reservation_urn");');

    this.addSql('create table "calendar_day_entries" ("calendar_day_owner_urn" varchar(255) not null, "calendar_day_day" varchar(255) not null, "calendar_entry_id" int not null, constraint "calendar_day_entries_pkey" primary key ("calendar_day_owner_urn", "calendar_day_day", "calendar_entry_id"));');

    this.addSql('alter table "calendar_day_entries" add constraint "calendar_day_entries_calendar_day_owner_urn_calen_62351_foreign" foreign key ("calendar_day_owner_urn", "calendar_day_day") references "calendar_day" ("owner_urn", "day") on update cascade on delete cascade;');
    this.addSql('alter table "calendar_day_entries" add constraint "calendar_day_entries_calendar_entry_id_foreign" foreign key ("calendar_entry_id") references "calendar_entry" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "event" add column "treated_at" timestamptz null;');
    this.addSql('alter table "event" alter column "created_at" type timestamptz using ("created_at"::timestamptz);');
    this.addSql('alter table "event" alter column "created_at" set default now();');
  }

  async down(): Promise<void> {
    this.addSql('alter table "calendar_day_entries" drop constraint "calendar_day_entries_calendar_day_owner_urn_calen_62351_foreign";');

    this.addSql('alter table "calendar_day_entries" drop constraint "calendar_day_entries_calendar_entry_id_foreign";');

    this.addSql('drop table if exists "calendar_day" cascade;');

    this.addSql('drop table if exists "calendar_entry" cascade;');

    this.addSql('drop table if exists "calendar_day_entries" cascade;');

    this.addSql('alter table "event" alter column "created_at" drop default;');
    this.addSql('alter table "event" alter column "created_at" type timestamptz using ("created_at"::timestamptz);');
    this.addSql('alter table "event" drop column "treated_at";');
  }

}
