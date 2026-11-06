import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "artists" DROP COLUMN "birthday";
  ALTER TABLE "artists" DROP COLUMN "debut_date";
  ALTER TABLE "_artists_v" DROP COLUMN "version_birthday";
  ALTER TABLE "_artists_v" DROP COLUMN "version_debut_date";
  ALTER TABLE "ui_labels_artist_locales" DROP COLUMN "birthday";
  ALTER TABLE "ui_labels_artist_locales" DROP COLUMN "debut";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "artists" ADD COLUMN "birthday" timestamp(3) with time zone;
  ALTER TABLE "artists" ADD COLUMN "debut_date" timestamp(3) with time zone;
  ALTER TABLE "_artists_v" ADD COLUMN "version_birthday" timestamp(3) with time zone;
  ALTER TABLE "_artists_v" ADD COLUMN "version_debut_date" timestamp(3) with time zone;
  ALTER TABLE "ui_labels_artist_locales" ADD COLUMN "birthday" varchar DEFAULT 'Birthday' NOT NULL;
  ALTER TABLE "ui_labels_artist_locales" ADD COLUMN "debut" varchar DEFAULT 'Debut' NOT NULL;`)
}
