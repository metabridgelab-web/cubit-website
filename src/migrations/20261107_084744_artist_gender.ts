import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_artists_gender" AS ENUM('female', 'male', 'all-female', 'all-male', 'mixed');
  CREATE TYPE "public"."enum__artists_v_version_gender" AS ENUM('female', 'male', 'all-female', 'all-male', 'mixed');
  ALTER TABLE "artists" ADD COLUMN "gender" "enum_artists_gender";
  ALTER TABLE "_artists_v" ADD COLUMN "version_gender" "enum__artists_v_version_gender";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "artists" DROP COLUMN "gender";
  ALTER TABLE "_artists_v" DROP COLUMN "version_gender";
  DROP TYPE "public"."enum_artists_gender";
  DROP TYPE "public"."enum__artists_v_version_gender";`)
}
