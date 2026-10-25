import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_artist_genres_translation_status_locale" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum_artist_genres_translation_status_status" AS ENUM('pending', 'auto', 'reviewed', 'outdated', 'failed');
  CREATE TABLE "artist_genres_translation_status" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"locale" "enum_artist_genres_translation_status_locale" NOT NULL,
  	"status" "enum_artist_genres_translation_status_status" DEFAULT 'pending' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"note" varchar
  );
  
  CREATE TABLE "artist_genres" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"category_id" integer NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"translation_meta" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "artist_genres_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "artists" ADD COLUMN "detail_photo_id" integer;
  ALTER TABLE "artists_rels" ADD COLUMN "artist_genres_id" integer;
  ALTER TABLE "_artists_v" ADD COLUMN "version_detail_photo_id" integer;
  ALTER TABLE "_artists_v_rels" ADD COLUMN "artist_genres_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "artist_genres_id" integer;
  ALTER TABLE "ui_labels_artist_locales" ADD COLUMN "genre" varchar DEFAULT 'Genre' NOT NULL;
  ALTER TABLE "artist_genres_translation_status" ADD CONSTRAINT "artist_genres_translation_status_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."artist_genres"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "artist_genres" ADD CONSTRAINT "artist_genres_category_id_artist_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."artist_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "artist_genres_locales" ADD CONSTRAINT "artist_genres_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."artist_genres"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "artist_genres_translation_status_order_idx" ON "artist_genres_translation_status" USING btree ("_order");
  CREATE INDEX "artist_genres_translation_status_parent_id_idx" ON "artist_genres_translation_status" USING btree ("_parent_id");
  CREATE INDEX "artist_genres__order_idx" ON "artist_genres" USING btree ("_order");
  CREATE INDEX "artist_genres_category_idx" ON "artist_genres" USING btree ("category_id");
  CREATE UNIQUE INDEX "artist_genres_slug_idx" ON "artist_genres" USING btree ("slug");
  CREATE INDEX "artist_genres_updated_at_idx" ON "artist_genres" USING btree ("updated_at");
  CREATE INDEX "artist_genres_created_at_idx" ON "artist_genres" USING btree ("created_at");
  CREATE UNIQUE INDEX "artist_genres_locales_locale_parent_id_unique" ON "artist_genres_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "artist_genres_locales_parent_id_idx" ON "artist_genres_locales" USING btree ("_parent_id");
  ALTER TABLE "artists" ADD CONSTRAINT "artists_detail_photo_id_media_id_fk" FOREIGN KEY ("detail_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "artists_rels" ADD CONSTRAINT "artists_rels_artist_genres_fk" FOREIGN KEY ("artist_genres_id") REFERENCES "public"."artist_genres"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_artists_v" ADD CONSTRAINT "_artists_v_version_detail_photo_id_media_id_fk" FOREIGN KEY ("version_detail_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_artists_v_rels" ADD CONSTRAINT "_artists_v_rels_artist_genres_fk" FOREIGN KEY ("artist_genres_id") REFERENCES "public"."artist_genres"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_artist_genres_fk" FOREIGN KEY ("artist_genres_id") REFERENCES "public"."artist_genres"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "artists_detail_photo_idx" ON "artists" USING btree ("detail_photo_id");
  CREATE INDEX "artists_rels_artist_genres_id_idx" ON "artists_rels" USING btree ("artist_genres_id");
  CREATE INDEX "_artists_v_version_version_detail_photo_idx" ON "_artists_v" USING btree ("version_detail_photo_id");
  CREATE INDEX "_artists_v_rels_artist_genres_id_idx" ON "_artists_v_rels" USING btree ("artist_genres_id");
  CREATE INDEX "payload_locked_documents_rels_artist_genres_id_idx" ON "payload_locked_documents_rels" USING btree ("artist_genres_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "artist_genres_translation_status" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "artist_genres" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "artist_genres_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "artist_genres_translation_status" CASCADE;
  DROP TABLE "artist_genres" CASCADE;
  DROP TABLE "artist_genres_locales" CASCADE;
  ALTER TABLE "artists" DROP CONSTRAINT "artists_detail_photo_id_media_id_fk";
  
  ALTER TABLE "artists_rels" DROP CONSTRAINT "artists_rels_artist_genres_fk";
  
  ALTER TABLE "_artists_v" DROP CONSTRAINT "_artists_v_version_detail_photo_id_media_id_fk";
  
  ALTER TABLE "_artists_v_rels" DROP CONSTRAINT "_artists_v_rels_artist_genres_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_artist_genres_fk";
  
  DROP INDEX "artists_detail_photo_idx";
  DROP INDEX "artists_rels_artist_genres_id_idx";
  DROP INDEX "_artists_v_version_version_detail_photo_idx";
  DROP INDEX "_artists_v_rels_artist_genres_id_idx";
  DROP INDEX "payload_locked_documents_rels_artist_genres_id_idx";
  ALTER TABLE "artists" DROP COLUMN "detail_photo_id";
  ALTER TABLE "artists_rels" DROP COLUMN "artist_genres_id";
  ALTER TABLE "_artists_v" DROP COLUMN "version_detail_photo_id";
  ALTER TABLE "_artists_v_rels" DROP COLUMN "artist_genres_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "artist_genres_id";
  ALTER TABLE "ui_labels_artist_locales" DROP COLUMN "genre";
  DROP TYPE "public"."enum_artist_genres_translation_status_locale";
  DROP TYPE "public"."enum_artist_genres_translation_status_status";`)
}
