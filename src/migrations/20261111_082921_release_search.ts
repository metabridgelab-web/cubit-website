import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "ui_labels_home_locales" ADD COLUMN "release_search" varchar DEFAULT 'Search by artist or song' NOT NULL;
  UPDATE "ui_labels_home_locales" SET "release_search" = '가수 또는 곡 제목으로 검색' WHERE "_locale" = 'ko';
  UPDATE "ui_labels_home_locales" SET "release_search" = '按艺人或歌曲搜索' WHERE "_locale" = 'zh';
  UPDATE "ui_labels_home_locales" SET "release_search" = 'アーティスト名・曲名で検索' WHERE "_locale" = 'ja';
  UPDATE "ui_labels_home_locales" SET "release_search" = 'Buscar por artista o canción' WHERE "_locale" = 'es';
  UPDATE "ui_labels_home_locales" SET "release_search" = 'Rechercher par artiste ou chanson' WHERE "_locale" = 'fr';
  UPDATE "ui_labels_home_locales" SET "release_search" = 'Pesquisar por artista ou música' WHERE "_locale" = 'pt';
  UPDATE "ui_labels_home_locales" SET "release_search" = 'Поиск по исполнителю или песне' WHERE "_locale" = 'ru';
  UPDATE "ui_labels_home_locales" SET "release_search" = 'ابحث باسم الفنان أو الأغنية' WHERE "_locale" = 'ar';
  UPDATE "ui_labels_home_locales" SET "release_search" = 'कलाकार या गीत से खोजें' WHERE "_locale" = 'hi';
  UPDATE "ui_labels_home_locales" SET "release_search" = 'শিল্পী বা গান দিয়ে খুঁজুন' WHERE "_locale" = 'bn';
  UPDATE "ui_labels_home_locales" SET "release_search" = 'Cari berdasarkan artis atau lagu' WHERE "_locale" = 'id';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "ui_labels_home_locales" DROP COLUMN "release_search";`)
}
