import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "ui_labels_campaign_locales" ADD COLUMN "slot_hint" varchar DEFAULT 'Tap an empty slot to choose talent. Use + to add more.' NOT NULL;
  ALTER TABLE "ui_labels_campaign_locales" ADD COLUMN "slot_empty" varchar DEFAULT 'Choose talent' NOT NULL;
  ALTER TABLE "ui_labels_campaign_locales" ADD COLUMN "add_slot" varchar DEFAULT 'Add talent' NOT NULL;
  ALTER TABLE "ui_labels_campaign_locales" ADD COLUMN "change_talent" varchar DEFAULT 'Change' NOT NULL;
  ALTER TABLE "ui_labels_campaign_locales" ADD COLUMN "remove_talent" varchar DEFAULT 'Remove' NOT NULL;
  UPDATE "ui_labels_campaign_locales" SET "slot_hint" = '빈 칸을 눌러 아티스트를 고르세요. + 로 더 추가할 수 있습니다.', "slot_empty" = '아티스트 선택', "add_slot" = '아티스트 추가', "change_talent" = '변경', "remove_talent" = '빼기' WHERE "_locale" = 'ko';
  UPDATE "ui_labels_campaign_locales" SET "slot_hint" = '点击空位选择艺人，点击 + 可添加更多。', "slot_empty" = '选择艺人', "add_slot" = '添加艺人', "change_talent" = '更换', "remove_talent" = '移除' WHERE "_locale" = 'zh';
  UPDATE "ui_labels_campaign_locales" SET "slot_hint" = '空欄をタップしてアーティストを選んでください。+ で追加できます。', "slot_empty" = 'アーティストを選ぶ', "add_slot" = 'アーティストを追加', "change_talent" = '変更', "remove_talent" = '外す' WHERE "_locale" = 'ja';
  UPDATE "ui_labels_campaign_locales" SET "slot_hint" = 'Toca un espacio vacío para elegir talento. Usa + para añadir más.', "slot_empty" = 'Elegir talento', "add_slot" = 'Añadir talento', "change_talent" = 'Cambiar', "remove_talent" = 'Quitar' WHERE "_locale" = 'es';
  UPDATE "ui_labels_campaign_locales" SET "slot_hint" = 'Touchez un emplacement vide pour choisir un talent. Utilisez + pour en ajouter.', "slot_empty" = 'Choisir un talent', "add_slot" = 'Ajouter un talent', "change_talent" = 'Changer', "remove_talent" = 'Retirer' WHERE "_locale" = 'fr';
  UPDATE "ui_labels_campaign_locales" SET "slot_hint" = 'Toque em um espaço vazio para escolher o talento. Use + para adicionar mais.', "slot_empty" = 'Escolher talento', "add_slot" = 'Adicionar talento', "change_talent" = 'Trocar', "remove_talent" = 'Remover' WHERE "_locale" = 'pt';
  UPDATE "ui_labels_campaign_locales" SET "slot_hint" = 'Нажмите на пустое место, чтобы выбрать артиста. Нажмите +, чтобы добавить ещё.', "slot_empty" = 'Выбрать артиста', "add_slot" = 'Добавить артиста', "change_talent" = 'Изменить', "remove_talent" = 'Убрать' WHERE "_locale" = 'ru';
  UPDATE "ui_labels_campaign_locales" SET "slot_hint" = 'اضغط على خانة فارغة لاختيار الموهبة. استخدم + لإضافة المزيد.', "slot_empty" = 'اختر الموهبة', "add_slot" = 'إضافة موهبة', "change_talent" = 'تغيير', "remove_talent" = 'إزالة' WHERE "_locale" = 'ar';
  UPDATE "ui_labels_campaign_locales" SET "slot_hint" = 'प्रतिभा चुनने के लिए खाली जगह पर टैप करें। और जोड़ने के लिए + का उपयोग करें।', "slot_empty" = 'प्रतिभा चुनें', "add_slot" = 'प्रतिभा जोड़ें', "change_talent" = 'बदलें', "remove_talent" = 'हटाएँ' WHERE "_locale" = 'hi';
  UPDATE "ui_labels_campaign_locales" SET "slot_hint" = 'শিল্পী বেছে নিতে খালি ঘরে চাপুন। আরও যোগ করতে + ব্যবহার করুন।', "slot_empty" = 'শিল্পী বেছে নিন', "add_slot" = 'শিল্পী যোগ করুন', "change_talent" = 'পরিবর্তন', "remove_talent" = 'সরান' WHERE "_locale" = 'bn';
  UPDATE "ui_labels_campaign_locales" SET "slot_hint" = 'Ketuk slot kosong untuk memilih talenta. Gunakan + untuk menambah.', "slot_empty" = 'Pilih talenta', "add_slot" = 'Tambah talenta', "change_talent" = 'Ganti', "remove_talent" = 'Hapus' WHERE "_locale" = 'id';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "ui_labels_campaign_locales" DROP COLUMN "slot_hint";
  ALTER TABLE "ui_labels_campaign_locales" DROP COLUMN "slot_empty";
  ALTER TABLE "ui_labels_campaign_locales" DROP COLUMN "add_slot";
  ALTER TABLE "ui_labels_campaign_locales" DROP COLUMN "change_talent";
  ALTER TABLE "ui_labels_campaign_locales" DROP COLUMN "remove_talent";`)
}
