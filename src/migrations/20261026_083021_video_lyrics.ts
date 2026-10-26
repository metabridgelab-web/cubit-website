import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "artists_videos" ADD COLUMN "lyrics" varchar;
  ALTER TABLE "_artists_v_version_videos" ADD COLUMN "lyrics" varchar;
  ALTER TABLE "ui_labels_artist_locales" ADD COLUMN "view_lyrics" varchar DEFAULT 'View lyrics' NOT NULL;
  ALTER TABLE "ui_labels_artist_locales" ADD COLUMN "lyrics" varchar DEFAULT 'Lyrics' NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "artists_videos" DROP COLUMN "lyrics";
  ALTER TABLE "_artists_v_version_videos" DROP COLUMN "lyrics";
  ALTER TABLE "ui_labels_artist_locales" DROP COLUMN "view_lyrics";
  ALTER TABLE "ui_labels_artist_locales" DROP COLUMN "lyrics";`)
}
