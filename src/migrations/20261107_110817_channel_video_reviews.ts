import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_channel_video_reviews_status" AS ENUM('pending', 'registered', 'ignored');
  CREATE TABLE "channel_video_reviews" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"youtube_title" varchar NOT NULL,
  	"youtube_url" varchar NOT NULL,
  	"reason" varchar,
  	"artist_id" integer,
  	"song_title" varchar,
  	"status" "enum_channel_video_reviews_status" DEFAULT 'pending' NOT NULL,
  	"published_at" timestamp(3) with time zone,
  	"youtube_id" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "channel_video_reviews_id" integer;
  ALTER TABLE "channel_video_reviews" ADD CONSTRAINT "channel_video_reviews_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "channel_video_reviews_artist_idx" ON "channel_video_reviews" USING btree ("artist_id");
  CREATE UNIQUE INDEX "channel_video_reviews_youtube_id_idx" ON "channel_video_reviews" USING btree ("youtube_id");
  CREATE INDEX "channel_video_reviews_updated_at_idx" ON "channel_video_reviews" USING btree ("updated_at");
  CREATE INDEX "channel_video_reviews_created_at_idx" ON "channel_video_reviews" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_channel_video_reviews_fk" FOREIGN KEY ("channel_video_reviews_id") REFERENCES "public"."channel_video_reviews"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_channel_video_reviews_id_idx" ON "payload_locked_documents_rels" USING btree ("channel_video_reviews_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "channel_video_reviews" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "channel_video_reviews" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_channel_video_reviews_fk";
  
  DROP INDEX "payload_locked_documents_rels_channel_video_reviews_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "channel_video_reviews_id";
  DROP TYPE "public"."enum_channel_video_reviews_status";`)
}
