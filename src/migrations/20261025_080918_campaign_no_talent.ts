import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "ui_labels_campaign_locales" ADD COLUMN "no_talent" varchar DEFAULT 'Our talent roster is being prepared. Continue to the next step and describe the talent you need in your brief.' NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "ui_labels_campaign_locales" DROP COLUMN "no_talent";`)
}
