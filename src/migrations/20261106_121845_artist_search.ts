import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "artists" ADD COLUMN "search_names" varchar;
  ALTER TABLE "_artists_v" ADD COLUMN "version_search_names" varchar;
  ALTER TABLE "ui_labels_artist_locales" ADD COLUMN "search_placeholder" varchar DEFAULT 'Search all genres by name' NOT NULL;
  ALTER TABLE "ui_labels_artist_locales" ADD COLUMN "search_no_results" varchar DEFAULT 'No results found' NOT NULL;
  ALTER TABLE "ui_labels_artist_locales" ADD COLUMN "search_failed" varchar DEFAULT 'Search could not load. Please try again.' NOT NULL;
  UPDATE "ui_labels_artist_locales" SET "search_placeholder" = '전체 장르에서 이름 검색', "search_no_results" = '검색 결과가 없습니다', "search_failed" = '검색을 불러오지 못했습니다. 다시 시도해 주세요.' WHERE "_locale" = 'ko';
  UPDATE "ui_labels_artist_locales" SET "search_placeholder" = '按姓名搜索所有流派', "search_no_results" = '未找到结果', "search_failed" = '无法加载搜索，请重试。' WHERE "_locale" = 'zh';
  UPDATE "ui_labels_artist_locales" SET "search_placeholder" = '全ジャンルから名前で検索', "search_no_results" = '結果が見つかりません', "search_failed" = '検索を読み込めませんでした。もう一度お試しください。' WHERE "_locale" = 'ja';
  UPDATE "ui_labels_artist_locales" SET "search_placeholder" = 'Buscar por nombre en todos los géneros', "search_no_results" = 'No se encontraron resultados', "search_failed" = 'No se pudo cargar la búsqueda. Inténtalo de nuevo.' WHERE "_locale" = 'es';
  UPDATE "ui_labels_artist_locales" SET "search_placeholder" = 'Rechercher par nom dans tous les genres', "search_no_results" = 'Aucun résultat', "search_failed" = 'Impossible de charger la recherche. Veuillez réessayer.' WHERE "_locale" = 'fr';
  UPDATE "ui_labels_artist_locales" SET "search_placeholder" = 'Pesquisar por nome em todos os gêneros', "search_no_results" = 'Nenhum resultado encontrado', "search_failed" = 'Não foi possível carregar a pesquisa. Tente novamente.' WHERE "_locale" = 'pt';
  UPDATE "ui_labels_artist_locales" SET "search_placeholder" = 'Поиск по имени во всех жанрах', "search_no_results" = 'Ничего не найдено', "search_failed" = 'Не удалось загрузить поиск. Повторите попытку.' WHERE "_locale" = 'ru';
  UPDATE "ui_labels_artist_locales" SET "search_placeholder" = 'البحث بالاسم في جميع الأنواع', "search_no_results" = 'لا توجد نتائج', "search_failed" = 'تعذّر تحميل البحث. يُرجى المحاولة مرة أخرى.' WHERE "_locale" = 'ar';
  UPDATE "ui_labels_artist_locales" SET "search_placeholder" = 'सभी शैलियों में नाम से खोजें', "search_no_results" = 'कोई परिणाम नहीं मिला', "search_failed" = 'खोज लोड नहीं हो सकी। कृपया फिर से प्रयास करें।' WHERE "_locale" = 'hi';
  UPDATE "ui_labels_artist_locales" SET "search_placeholder" = 'সব ধারায় নাম দিয়ে খুঁজুন', "search_no_results" = 'কোনো ফলাফল পাওয়া যায়নি', "search_failed" = 'অনুসন্ধান লোড করা যায়নি। আবার চেষ্টা করুন।' WHERE "_locale" = 'bn';
  UPDATE "ui_labels_artist_locales" SET "search_placeholder" = 'Cari nama di semua genre', "search_no_results" = 'Tidak ada hasil', "search_failed" = 'Pencarian gagal dimuat. Silakan coba lagi.' WHERE "_locale" = 'id';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "artists" DROP COLUMN "search_names";
  ALTER TABLE "_artists_v" DROP COLUMN "version_search_names";
  ALTER TABLE "ui_labels_artist_locales" DROP COLUMN "search_placeholder";
  ALTER TABLE "ui_labels_artist_locales" DROP COLUMN "search_no_results";
  ALTER TABLE "ui_labels_artist_locales" DROP COLUMN "search_failed";`)
}
