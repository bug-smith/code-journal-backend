set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

create table "public"."entries" (
  "entryId"    serial,
  "title"      text    not null,
  "notes"      text    not null,
  "photoUrl"   text    not null,
  primary key ("entryId")
);
