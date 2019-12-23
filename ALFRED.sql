CREATE TABLE "show" (
  "id" SERIAL PRIMARY KEY,
  "title" varchar,
  "codename" varchar,
  "trigger" varchar NOT NULL,
  "url" varchar NOT NULL
);

CREATE TABLE "season" (
  "id" SERIAL PRIMARY KEY,
  "number" varchar NOT NULL,
  "quality" varchar DEFAULT '720p',
  "source" varchar DEFAULT 'WEB',
  "show_id" int
);

CREATE TABLE "episode" (
  "id" SERIAL PRIMARY KEY,
  "number" varchar NOT NULL,
  "url" varchar,
  "downloaded" boolean DEFAULT false,
  "season_id" int,
  "updated_at" timestamp
);

ALTER TABLE "season" ADD FOREIGN KEY ("show_id") REFERENCES "show" ("id");

ALTER TABLE "episode" ADD FOREIGN KEY ("season_id") REFERENCES "season" ("id");
