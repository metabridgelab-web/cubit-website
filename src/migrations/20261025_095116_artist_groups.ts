import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_artists_kind" AS ENUM('solo', 'group');
  CREATE TYPE "public"."enum__artists_v_version_kind" AS ENUM('solo', 'group');
  ALTER TABLE "artists" ADD COLUMN "kind" "enum_artists_kind" DEFAULT 'solo';
  ALTER TABLE "artists" ADD COLUMN "list_alone" boolean DEFAULT false;
  ALTER TABLE "artists_rels" ADD COLUMN "artists_id" integer;
  ALTER TABLE "_artists_v" ADD COLUMN "version_kind" "enum__artists_v_version_kind" DEFAULT 'solo';
  ALTER TABLE "_artists_v" ADD COLUMN "version_list_alone" boolean DEFAULT false;
  ALTER TABLE "_artists_v_rels" ADD COLUMN "artists_id" integer;
  ALTER TABLE "ui_labels_artist_locales" ADD COLUMN "group" varchar DEFAULT 'Group' NOT NULL;
  ALTER TABLE "ui_labels_artist_locales" ADD COLUMN "members" varchar DEFAULT 'Members' NOT NULL;
  ALTER TABLE "ui_labels_artist_locales" ADD COLUMN "member_of" varchar DEFAULT 'Member of' NOT NULL;
  ALTER TABLE "ui_labels_artist_locales" ADD COLUMN "other_members" varchar DEFAULT 'Other members' NOT NULL;
  ALTER TABLE "artists_rels" ADD CONSTRAINT "artists_rels_artists_fk" FOREIGN KEY ("artists_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_artists_v_rels" ADD CONSTRAINT "_artists_v_rels_artists_fk" FOREIGN KEY ("artists_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "artists_rels_artists_id_idx" ON "artists_rels" USING btree ("artists_id");
  CREATE INDEX "_artists_v_rels_artists_id_idx" ON "_artists_v_rels" USING btree ("artists_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "artists_rels" DROP CONSTRAINT "artists_rels_artists_fk";
  
  ALTER TABLE "_artists_v_rels" DROP CONSTRAINT "_artists_v_rels_artists_fk";
  
  DROP INDEX "artists_rels_artists_id_idx";
  DROP INDEX "_artists_v_rels_artists_id_idx";
  ALTER TABLE "artists" DROP COLUMN "kind";
  ALTER TABLE "artists" DROP COLUMN "list_alone";
  ALTER TABLE "artists_rels" DROP COLUMN "artists_id";
  ALTER TABLE "_artists_v" DROP COLUMN "version_kind";
  ALTER TABLE "_artists_v" DROP COLUMN "version_list_alone";
  ALTER TABLE "_artists_v_rels" DROP COLUMN "artists_id";
  ALTER TABLE "ui_labels_artist_locales" DROP COLUMN "group";
  ALTER TABLE "ui_labels_artist_locales" DROP COLUMN "members";
  ALTER TABLE "ui_labels_artist_locales" DROP COLUMN "member_of";
  ALTER TABLE "ui_labels_artist_locales" DROP COLUMN "other_members";
  DROP TYPE "public"."enum_artists_kind";
  DROP TYPE "public"."enum__artists_v_version_kind";`)
}
