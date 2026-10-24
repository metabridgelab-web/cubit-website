import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum_home_slides_translation_status_locale" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum_home_slides_translation_status_status" AS ENUM('pending', 'auto', 'reviewed', 'outdated', 'failed');
  CREATE TYPE "public"."enum_home_slides_video_source" AS ENUM('file', 'youtube', 'stream');
  CREATE TYPE "public"."enum_artist_categories_translation_status_locale" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum_artist_categories_translation_status_status" AS ENUM('pending', 'auto', 'reviewed', 'outdated', 'failed');
  CREATE TYPE "public"."enum_artists_socials_platform" AS ENUM('YouTube', 'Instagram', 'TikTok', 'X', 'Weibo', 'Facebook', 'Spotify', 'Apple Music', 'Melon', '기타');
  CREATE TYPE "public"."enum_artists_translation_status_locale" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum_artists_translation_status_status" AS ENUM('pending', 'auto', 'reviewed', 'outdated', 'failed');
  CREATE TYPE "public"."enum_artists_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__artists_v_version_socials_platform" AS ENUM('YouTube', 'Instagram', 'TikTok', 'X', 'Weibo', 'Facebook', 'Spotify', 'Apple Music', 'Melon', '기타');
  CREATE TYPE "public"."enum__artists_v_version_translation_status_locale" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum__artists_v_version_translation_status_status" AS ENUM('pending', 'auto', 'reviewed', 'outdated', 'failed');
  CREATE TYPE "public"."enum__artists_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__artists_v_published_locale" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum_boards_translation_status_locale" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum_boards_translation_status_status" AS ENUM('pending', 'auto', 'reviewed', 'outdated', 'failed');
  CREATE TYPE "public"."enum_post_categories_translation_status_locale" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum_post_categories_translation_status_status" AS ENUM('pending', 'auto', 'reviewed', 'outdated', 'failed');
  CREATE TYPE "public"."enum_posts_translation_status_locale" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum_posts_translation_status_status" AS ENUM('pending', 'auto', 'reviewed', 'outdated', 'failed');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_translation_status_locale" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum__posts_v_version_translation_status_status" AS ENUM('pending', 'auto', 'reviewed', 'outdated', 'failed');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_published_locale" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum_case_studies_translation_status_locale" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum_case_studies_translation_status_status" AS ENUM('pending', 'auto', 'reviewed', 'outdated', 'failed');
  CREATE TYPE "public"."enum_case_studies_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__case_studies_v_version_translation_status_locale" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum__case_studies_v_version_translation_status_status" AS ENUM('pending', 'auto', 'reviewed', 'outdated', 'failed');
  CREATE TYPE "public"."enum__case_studies_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__case_studies_v_published_locale" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum_pages_translation_status_locale" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum_pages_translation_status_status" AS ENUM('pending', 'auto', 'reviewed', 'outdated', 'failed');
  CREATE TYPE "public"."enum_pages_section" AS ENUM('company', 'business', 'studio', 'trust', 'join', 'investors', 'legal');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_translation_status_locale" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum__pages_v_version_translation_status_status" AS ENUM('pending', 'auto', 'reviewed', 'outdated', 'failed');
  CREATE TYPE "public"."enum__pages_v_version_section" AS ENUM('company', 'business', 'studio', 'trust', 'join', 'investors', 'legal');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum_family_translation_status_locale" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum_family_translation_status_status" AS ENUM('pending', 'auto', 'reviewed', 'outdated', 'failed');
  CREATE TYPE "public"."enum_family_kind" AS ENUM('label', 'brand', 'affiliate');
  CREATE TYPE "public"."enum_studio_items_translation_status_locale" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum_studio_items_translation_status_status" AS ENUM('pending', 'auto', 'reviewed', 'outdated', 'failed');
  CREATE TYPE "public"."enum_studio_items_kind" AS ENUM('process', 'comparison', 'technology');
  CREATE TYPE "public"."enum_openings_translation_status_locale" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum_openings_translation_status_status" AS ENUM('pending', 'auto', 'reviewed', 'outdated', 'failed');
  CREATE TYPE "public"."enum_openings_kind" AS ENUM('creator', 'career');
  CREATE TYPE "public"."enum_openings_status" AS ENUM('open', 'closed');
  CREATE TYPE "public"."enum_disclosures_translation_status_locale" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum_disclosures_translation_status_status" AS ENUM('pending', 'auto', 'reviewed', 'outdated', 'failed');
  CREATE TYPE "public"."enum_disclosures_category" AS ENUM('issuance', 'allocation', 'unlock', 'partnership', 'other');
  CREATE TYPE "public"."enum_disclosures_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__disclosures_v_version_translation_status_locale" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum__disclosures_v_version_translation_status_status" AS ENUM('pending', 'auto', 'reviewed', 'outdated', 'failed');
  CREATE TYPE "public"."enum__disclosures_v_version_category" AS ENUM('issuance', 'allocation', 'unlock', 'partnership', 'other');
  CREATE TYPE "public"."enum__disclosures_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__disclosures_v_published_locale" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum_quote_requests_usage" AS ENUM('digital', 'video', 'social', 'ooh');
  CREATE TYPE "public"."enum_quote_requests_regions" AS ENUM('worldwide', 'kr', 'north-america', 'europe', 'asia-pacific');
  CREATE TYPE "public"."enum_quote_requests_languages" AS ENUM('en', 'ko', 'ja', 'zh', 'es', 'fr', 'de', 'pt', 'ru', 'ar', 'hi', 'bn', 'id', 'th', 'vi');
  CREATE TYPE "public"."enum_quote_requests_submitted_locale" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum_quote_requests_status" AS ENUM('received', 'quoted', 'negotiating', 'contracted', 'done', 'cancelled');
  CREATE TYPE "public"."enum_inquiries_type" AS ENUM('partnership', 'press', 'investment', 'other', 'report', 'application');
  CREATE TYPE "public"."enum_inquiries_submitted_locale" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum_inquiries_status" AS ENUM('received', 'in-progress', 'done');
  CREATE TYPE "public"."enum_media_translation_status_locale" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum_media_translation_status_status" AS ENUM('pending', 'auto', 'reviewed', 'outdated', 'failed');
  CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'editor', 'translator', 'sales', 'disclosure');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'notifySubmission', 'translateDocument', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'notifySubmission', 'translateDocument', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_folders_folder_type" AS ENUM('media');
  CREATE TYPE "public"."enum_site_settings_enabled_locales" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum_site_settings_socials_platform" AS ENUM('YouTube', 'Instagram', 'TikTok', 'X', 'Weibo', 'Facebook', 'LinkedIn', '기타');
  CREATE TYPE "public"."enum_site_settings_translation_status_locale" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum_site_settings_translation_status_status" AS ENUM('pending', 'auto', 'reviewed', 'outdated', 'failed');
  CREATE TYPE "public"."enum_navigation_translation_status_locale" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum_navigation_translation_status_status" AS ENUM('pending', 'auto', 'reviewed', 'outdated', 'failed');
  CREATE TYPE "public"."enum_home_settings_sections_section" AS ENUM('new-release', 'artists', 'business', 'news', 'notice');
  CREATE TYPE "public"."enum_business_settings_translation_status_locale" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum_business_settings_translation_status_status" AS ENUM('pending', 'auto', 'reviewed', 'outdated', 'failed');
  CREATE TYPE "public"."enum_investors_whitepapers_language" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum_investors_roadmap_status" AS ENUM('done', 'in-progress', 'planned');
  CREATE TYPE "public"."enum_investors_translation_status_locale" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum_investors_translation_status_status" AS ENUM('pending', 'auto', 'reviewed', 'outdated', 'failed');
  CREATE TYPE "public"."enum_ui_labels_common_translation_status_locale" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum_ui_labels_common_translation_status_status" AS ENUM('pending', 'auto', 'reviewed', 'outdated', 'failed');
  CREATE TYPE "public"."enum_ui_labels_home_translation_status_locale" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum_ui_labels_home_translation_status_status" AS ENUM('pending', 'auto', 'reviewed', 'outdated', 'failed');
  CREATE TYPE "public"."enum_ui_labels_business_translation_status_locale" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum_ui_labels_business_translation_status_status" AS ENUM('pending', 'auto', 'reviewed', 'outdated', 'failed');
  CREATE TYPE "public"."enum_ui_labels_artist_translation_status_locale" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum_ui_labels_artist_translation_status_status" AS ENUM('pending', 'auto', 'reviewed', 'outdated', 'failed');
  CREATE TYPE "public"."enum_ui_labels_campaign_translation_status_locale" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum_ui_labels_campaign_translation_status_status" AS ENUM('pending', 'auto', 'reviewed', 'outdated', 'failed');
  CREATE TYPE "public"."enum_ui_labels_contact_translation_status_locale" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum_ui_labels_contact_translation_status_status" AS ENUM('pending', 'auto', 'reviewed', 'outdated', 'failed');
  CREATE TYPE "public"."enum_ui_labels_family_translation_status_locale" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum_ui_labels_family_translation_status_status" AS ENUM('pending', 'auto', 'reviewed', 'outdated', 'failed');
  CREATE TYPE "public"."enum_ui_labels_studio_translation_status_locale" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum_ui_labels_studio_translation_status_status" AS ENUM('pending', 'auto', 'reviewed', 'outdated', 'failed');
  CREATE TYPE "public"."enum_ui_labels_investors_translation_status_locale" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum_ui_labels_investors_translation_status_status" AS ENUM('pending', 'auto', 'reviewed', 'outdated', 'failed');
  CREATE TYPE "public"."enum_ui_labels_trust_translation_status_locale" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum_ui_labels_trust_translation_status_status" AS ENUM('pending', 'auto', 'reviewed', 'outdated', 'failed');
  CREATE TYPE "public"."enum_ui_labels_join_translation_status_locale" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum_ui_labels_join_translation_status_status" AS ENUM('pending', 'auto', 'reviewed', 'outdated', 'failed');
  CREATE TYPE "public"."enum_ui_labels_cookie_translation_status_locale" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum_ui_labels_cookie_translation_status_status" AS ENUM('pending', 'auto', 'reviewed', 'outdated', 'failed');
  CREATE TYPE "public"."enum_ui_labels_news_translation_status_locale" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum_ui_labels_news_translation_status_status" AS ENUM('pending', 'auto', 'reviewed', 'outdated', 'failed');
  CREATE TYPE "public"."enum_ui_labels_forms_translation_status_locale" AS ENUM('en', 'ko', 'zh', 'ja', 'es', 'fr', 'pt', 'ru', 'ar', 'hi', 'bn', 'id');
  CREATE TYPE "public"."enum_ui_labels_forms_translation_status_status" AS ENUM('pending', 'auto', 'reviewed', 'outdated', 'failed');
  CREATE TABLE "home_slides_translation_status" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"locale" "enum_home_slides_translation_status_locale" NOT NULL,
  	"status" "enum_home_slides_translation_status_status" DEFAULT 'pending' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"note" varchar
  );
  
  CREATE TABLE "home_slides" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"artist_id" integer,
  	"release_date" timestamp(3) with time zone,
  	"headline" varchar,
  	"video_source" "enum_home_slides_video_source" DEFAULT 'file' NOT NULL,
  	"video_file_id" integer,
  	"youtube_url" varchar,
  	"stream_id" varchar,
  	"poster_id" integer NOT NULL,
  	"mv_url" varchar,
  	"active" boolean DEFAULT true,
  	"start_at" timestamp(3) with time zone,
  	"end_at" timestamp(3) with time zone,
  	"translation_meta" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "home_slides_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "artist_categories_translation_status" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"locale" "enum_artist_categories_translation_status_locale" NOT NULL,
  	"status" "enum_artist_categories_translation_status_status" DEFAULT 'pending' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"note" varchar
  );
  
  CREATE TABLE "artist_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"sort_order" numeric DEFAULT 0,
  	"translation_meta" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "artist_categories_locales" (
  	"name" varchar NOT NULL,
  	"disclaimer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "artists_extra_info" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "artists_extra_info_locales" (
  	"label" varchar,
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "artists_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_artists_socials_platform",
  	"url" varchar
  );
  
  CREATE TABLE "artists_videos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"youtube_url" varchar,
  	"release_date" timestamp(3) with time zone
  );
  
  CREATE TABLE "artists_videos_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "artists_translation_status" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"locale" "enum_artists_translation_status_locale",
  	"status" "enum_artists_translation_status_status" DEFAULT 'pending',
  	"updated_at" timestamp(3) with time zone,
  	"note" varchar
  );
  
  CREATE TABLE "artists" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"birthday" timestamp(3) with time zone,
  	"debut_date" timestamp(3) with time zone,
  	"profile_photo_id" integer,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"featured" boolean DEFAULT false,
  	"sort_order" numeric DEFAULT 0,
  	"translation_meta" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_artists_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "artists_locales" (
  	"nationality" varchar,
  	"intro" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "artists_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"artist_categories_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "_artists_v_version_extra_info" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_artists_v_version_extra_info_locales" (
  	"label" varchar,
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_artists_v_version_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"platform" "enum__artists_v_version_socials_platform",
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_artists_v_version_videos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"youtube_url" varchar,
  	"release_date" timestamp(3) with time zone,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_artists_v_version_videos_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_artists_v_version_translation_status" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"locale" "enum__artists_v_version_translation_status_locale",
  	"status" "enum__artists_v_version_translation_status_status" DEFAULT 'pending',
  	"updated_at" timestamp(3) with time zone,
  	"note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_artists_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_birthday" timestamp(3) with time zone,
  	"version_debut_date" timestamp(3) with time zone,
  	"version_profile_photo_id" integer,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_featured" boolean DEFAULT false,
  	"version_sort_order" numeric DEFAULT 0,
  	"version_translation_meta" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__artists_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__artists_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_artists_v_locales" (
  	"version_nationality" varchar,
  	"version_intro" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_artists_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"artist_categories_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "boards_translation_status" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"locale" "enum_boards_translation_status_locale" NOT NULL,
  	"status" "enum_boards_translation_status_status" DEFAULT 'pending' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"note" varchar
  );
  
  CREATE TABLE "boards" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"sort_order" numeric DEFAULT 0,
  	"translation_meta" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "boards_locales" (
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "post_categories_translation_status" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"locale" "enum_post_categories_translation_status_locale" NOT NULL,
  	"status" "enum_post_categories_translation_status_status" DEFAULT 'pending' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"note" varchar
  );
  
  CREATE TABLE "post_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"board_id" integer NOT NULL,
  	"sort_order" numeric DEFAULT 0,
  	"translation_meta" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "post_categories_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "posts_translation_status" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"locale" "enum_posts_translation_status_locale",
  	"status" "enum_posts_translation_status_status" DEFAULT 'pending',
  	"updated_at" timestamp(3) with time zone,
  	"note" varchar
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"board_id" integer,
  	"category_id" integer,
  	"thumbnail_id" integer,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"published_at" timestamp(3) with time zone,
  	"pinned" boolean DEFAULT false,
  	"translation_meta" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "posts_locales" (
  	"title" varchar,
  	"excerpt" varchar,
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"artists_id" integer
  );
  
  CREATE TABLE "_posts_v_version_translation_status" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"locale" "enum__posts_v_version_translation_status_locale",
  	"status" "enum__posts_v_version_translation_status_status" DEFAULT 'pending',
  	"updated_at" timestamp(3) with time zone,
  	"note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_board_id" integer,
  	"version_category_id" integer,
  	"version_thumbnail_id" integer,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_pinned" boolean DEFAULT false,
  	"version_translation_meta" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__posts_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_posts_v_locales" (
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"artists_id" integer
  );
  
  CREATE TABLE "case_studies_translation_status" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"locale" "enum_case_studies_translation_status_locale",
  	"status" "enum_case_studies_translation_status_status" DEFAULT 'pending',
  	"updated_at" timestamp(3) with time zone,
  	"note" varchar
  );
  
  CREATE TABLE "case_studies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"brand_name" varchar,
  	"date" timestamp(3) with time zone,
  	"brand_logo_id" integer,
  	"thumbnail_id" integer,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"translation_meta" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_case_studies_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "case_studies_locales" (
  	"title" varchar,
  	"summary" varchar,
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "case_studies_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"artists_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "_case_studies_v_version_translation_status" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"locale" "enum__case_studies_v_version_translation_status_locale",
  	"status" "enum__case_studies_v_version_translation_status_status" DEFAULT 'pending',
  	"updated_at" timestamp(3) with time zone,
  	"note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_case_studies_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_brand_name" varchar,
  	"version_date" timestamp(3) with time zone,
  	"version_brand_logo_id" integer,
  	"version_thumbnail_id" integer,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_translation_meta" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__case_studies_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__case_studies_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_case_studies_v_locales" (
  	"version_title" varchar,
  	"version_summary" varchar,
  	"version_content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_case_studies_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"artists_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "pages_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_text_locales" (
  	"heading" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_image_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"youtube_url" varchar,
  	"stream_id" varchar,
  	"file_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_video_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_timeline_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" varchar,
  	"month" varchar
  );
  
  CREATE TABLE "pages_blocks_timeline_items_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_location_offices" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"phone" varchar,
  	"email" varchar,
  	"map_url" varchar
  );
  
  CREATE TABLE "pages_blocks_location_offices_locales" (
  	"name" varchar,
  	"address" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_location" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_locales" (
  	"text" varchar,
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_translation_status" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"locale" "enum_pages_translation_status_locale",
  	"status" "enum_pages_translation_status_status" DEFAULT 'pending',
  	"updated_at" timestamp(3) with time zone,
  	"note" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_image_id" integer,
  	"section" "enum_pages_section",
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"review_required" boolean DEFAULT false,
  	"translation_meta" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_locales" (
  	"title" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_pages_v_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_text_locales" (
  	"heading" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_image_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"youtube_url" varchar,
  	"stream_id" varchar,
  	"file_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_video_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_timeline_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"year" varchar,
  	"month" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_timeline_items_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_location_offices" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"phone" varchar,
  	"email" varchar,
  	"map_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_location_offices_locales" (
  	"name" varchar,
  	"address" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_location" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_locales" (
  	"text" varchar,
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_version_translation_status" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"locale" "enum__pages_v_version_translation_status_locale",
  	"status" "enum__pages_v_version_translation_status_status" DEFAULT 'pending',
  	"updated_at" timestamp(3) with time zone,
  	"note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_hero_image_id" integer,
  	"version_section" "enum__pages_v_version_section",
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_review_required" boolean DEFAULT false,
  	"version_translation_meta" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__pages_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_pages_v_locales" (
  	"version_title" varchar,
  	"version_intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "family_translation_status" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"locale" "enum_family_translation_status_locale" NOT NULL,
  	"status" "enum_family_translation_status_status" DEFAULT 'pending' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"note" varchar
  );
  
  CREATE TABLE "family" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"name" varchar NOT NULL,
  	"kind" "enum_family_kind" DEFAULT 'affiliate' NOT NULL,
  	"logo_id" integer,
  	"film_id" integer,
  	"poster_id" integer,
  	"stream_id" varchar,
  	"youtube_url" varchar,
  	"website" varchar,
  	"hidden" boolean DEFAULT false,
  	"translation_meta" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "family_locales" (
  	"tagline" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "family_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"artists_id" integer
  );
  
  CREATE TABLE "studio_items_translation_status" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"locale" "enum_studio_items_translation_status_locale" NOT NULL,
  	"status" "enum_studio_items_translation_status_status" DEFAULT 'pending' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"note" varchar
  );
  
  CREATE TABLE "studio_items" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"kind" "enum_studio_items_kind" DEFAULT 'process' NOT NULL,
  	"tag" varchar,
  	"image_id" integer,
  	"video_id" integer,
  	"stream_id" varchar,
  	"youtube_url" varchar,
  	"before_id" integer,
  	"after_id" integer,
  	"hidden" boolean DEFAULT false,
  	"translation_meta" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "studio_items_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"before_label" varchar DEFAULT 'Before',
  	"after_label" varchar DEFAULT 'After',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "openings_translation_status" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"locale" "enum_openings_translation_status_locale" NOT NULL,
  	"status" "enum_openings_translation_status_status" DEFAULT 'pending' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"note" varchar
  );
  
  CREATE TABLE "openings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"kind" "enum_openings_kind" DEFAULT 'creator' NOT NULL,
  	"status" "enum_openings_status" DEFAULT 'open' NOT NULL,
  	"deadline" timestamp(3) with time zone,
  	"apply_url" varchar,
  	"translation_meta" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "openings_locales" (
  	"title" varchar NOT NULL,
  	"location" varchar,
  	"employment" varchar,
  	"summary" varchar,
  	"description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "disclosures_translation_status" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"locale" "enum_disclosures_translation_status_locale",
  	"status" "enum_disclosures_translation_status_status" DEFAULT 'pending',
  	"updated_at" timestamp(3) with time zone,
  	"note" varchar
  );
  
  CREATE TABLE "disclosures" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone,
  	"category" "enum_disclosures_category" DEFAULT 'other',
  	"file_id" integer,
  	"translation_meta" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_disclosures_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "disclosures_locales" (
  	"title" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_disclosures_v_version_translation_status" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"locale" "enum__disclosures_v_version_translation_status_locale",
  	"status" "enum__disclosures_v_version_translation_status_status" DEFAULT 'pending',
  	"updated_at" timestamp(3) with time zone,
  	"note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_disclosures_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_date" timestamp(3) with time zone,
  	"version_category" "enum__disclosures_v_version_category" DEFAULT 'other',
  	"version_file_id" integer,
  	"version_translation_meta" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__disclosures_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__disclosures_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_disclosures_v_locales" (
  	"version_title" varchar,
  	"version_body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "quote_requests_usage" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_quote_requests_usage",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "quote_requests_regions" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_quote_requests_regions",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "quote_requests_languages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_quote_requests_languages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "quote_requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"period_start" timestamp(3) with time zone,
  	"period_end" timestamp(3) with time zone,
  	"company_name" varchar NOT NULL,
  	"contact_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"message" varchar,
  	"privacy_consent" boolean DEFAULT false NOT NULL,
  	"submitted_locale" "enum_quote_requests_submitted_locale",
  	"website" varchar,
  	"ip_hash" varchar,
  	"status" "enum_quote_requests_status" DEFAULT 'received',
  	"assignee_id" integer,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "quote_requests_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "quote_requests_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"artists_id" integer
  );
  
  CREATE TABLE "inquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_inquiries_type" NOT NULL,
  	"company_name" varchar,
  	"contact_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"message" varchar,
  	"privacy_consent" boolean DEFAULT false NOT NULL,
  	"position" varchar,
  	"reported_url" varchar,
  	"submitted_locale" "enum_inquiries_submitted_locale",
  	"website" varchar,
  	"ip_hash" varchar,
  	"status" "enum_inquiries_status" DEFAULT 'received',
  	"assignee_id" integer,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "inquiries_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"attachments_id" integer
  );
  
  CREATE TABLE "attachments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"ip_hash" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "media_translation_status" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"locale" "enum_media_translation_status_locale" NOT NULL,
  	"status" "enum_media_translation_status_status" DEFAULT 'pending' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"note" varchar
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"translation_meta" jsonb,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_large_url" varchar,
  	"sizes_large_width" numeric,
  	"sizes_large_height" numeric,
  	"sizes_large_mime_type" varchar,
  	"sizes_large_filesize" numeric,
  	"sizes_large_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "glossary" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"term" varchar NOT NULL,
  	"note" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"concurrency_key" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_folders_folder_type" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_payload_folders_folder_type",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "payload_folders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"home_slides_id" integer,
  	"artist_categories_id" integer,
  	"artists_id" integer,
  	"boards_id" integer,
  	"post_categories_id" integer,
  	"posts_id" integer,
  	"case_studies_id" integer,
  	"pages_id" integer,
  	"family_id" integer,
  	"studio_items_id" integer,
  	"openings_id" integer,
  	"disclosures_id" integer,
  	"quote_requests_id" integer,
  	"inquiries_id" integer,
  	"attachments_id" integer,
  	"media_id" integer,
  	"glossary_id" integer,
  	"users_id" integer,
  	"payload_folders_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_enabled_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_site_settings_enabled_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "site_settings_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_site_settings_socials_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_translation_status" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"locale" "enum_site_settings_translation_status_locale" NOT NULL,
  	"status" "enum_site_settings_translation_status_status" DEFAULT 'pending' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"note" varchar
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'CUBIT ENTERTAINMENT' NOT NULL,
  	"logo_id" integer,
  	"logo_dark_id" integer,
  	"business_number" varchar,
  	"email" varchar,
  	"phone" varchar,
  	"copyright" varchar DEFAULT '© CUBIT ENTERTAINMENT. All rights reserved.',
  	"translation_meta" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_locales" (
  	"company_name" varchar,
  	"ceo" varchar,
  	"address" varchar,
  	"ai_notice" varchar DEFAULT 'Artists and content on this site are created with AI technology.',
  	"cookie_banner_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "site_settings_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "site_settings_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer
  );
  
  CREATE TABLE "navigation_sections_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "navigation_sections_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"hidden" boolean DEFAULT false,
  	"preview_image_id" integer
  );
  
  CREATE TABLE "navigation_sections_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_translation_status" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"locale" "enum_navigation_translation_status_locale" NOT NULL,
  	"status" "enum_navigation_translation_status_status" DEFAULT 'pending' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"note" varchar
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"translation_meta" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "navigation_locales" (
  	"cta_label" varchar DEFAULT 'Get a campaign quote',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "home_settings_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section" "enum_home_settings_sections_section" NOT NULL,
  	"hidden" boolean DEFAULT false
  );
  
  CREATE TABLE "home_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"auto_advance_seconds" numeric DEFAULT 8,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "business_settings_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "business_settings_services_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "business_settings_brands" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"logo_id" integer NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "business_settings_translation_status" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"locale" "enum_business_settings_translation_status_locale" NOT NULL,
  	"status" "enum_business_settings_translation_status_status" DEFAULT 'pending' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"note" varchar
  );
  
  CREATE TABLE "business_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"translation_meta" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "business_settings_locales" (
  	"eyebrow" varchar DEFAULT 'FOR BRANDS',
  	"headline" varchar DEFAULT 'Three ways to work with our talent',
  	"builder_cta_label" varchar DEFAULT 'Start campaign quote',
  	"confirmation_message" varchar DEFAULT 'Your quote request has been received. Our team will review it and contact you by email.',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "business_settings_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "investors_utilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "investors_utilities_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "investors_allocation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"percent" numeric NOT NULL
  );
  
  CREATE TABLE "investors_allocation_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "investors_vesting" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tge_unlock" varchar,
  	"amount" varchar
  );
  
  CREATE TABLE "investors_vesting_locales" (
  	"category" varchar NOT NULL,
  	"cliff" varchar,
  	"vesting_period" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "investors_whitepapers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"language" "enum_investors_whitepapers_language" DEFAULT 'en' NOT NULL,
  	"version" varchar NOT NULL,
  	"date" timestamp(3) with time zone,
  	"file_id" integer NOT NULL
  );
  
  CREATE TABLE "investors_roadmap" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"period" varchar NOT NULL,
  	"status" "enum_investors_roadmap_status" DEFAULT 'planned' NOT NULL
  );
  
  CREATE TABLE "investors_roadmap_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "investors_audits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"auditor" varchar NOT NULL,
  	"date" timestamp(3) with time zone,
  	"report_id" integer
  );
  
  CREATE TABLE "investors_audits_locales" (
  	"scope" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "investors_contracts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"network" varchar,
  	"address" varchar NOT NULL
  );
  
  CREATE TABLE "investors_wallets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"network" varchar,
  	"address" varchar NOT NULL
  );
  
  CREATE TABLE "investors_translation_status" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"locale" "enum_investors_translation_status_locale" NOT NULL,
  	"status" "enum_investors_translation_status_status" DEFAULT 'pending' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"note" varchar
  );
  
  CREATE TABLE "investors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT false,
  	"token_name" varchar,
  	"symbol" varchar,
  	"total_supply" varchar,
  	"network" varchar,
  	"translation_meta" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "investors_locales" (
  	"intro" varchar,
  	"listing_status" varchar DEFAULT 'Listing planned',
  	"security_alert" varchar DEFAULT 'Beware of fake tokens and phishing. Our token is not listed on any exchange yet, so any token offered for sale under our name is fraudulent. We will never contact you directly to ask for funds or to offer a private sale. Always check addresses on this page before any transaction.',
  	"risk_notice" varchar DEFAULT 'The information on these pages is provided for general information only. It is not an offer or solicitation to buy or sell any digital asset, and it is not financial, investment, legal, or tax advice.
  
  Digital assets are highly volatile and may lose all of their value. Nothing on this site is a promise of profit, a price forecast, or a guarantee of future listing.
  
  Rules on digital assets differ by country and may change. Some services may not be available in your country. Please check the laws that apply to you and consult your own professional advisers.',
  	"restricted_regions" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "ui_labels_common_translation_status" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"locale" "enum_ui_labels_common_translation_status_locale" NOT NULL,
  	"status" "enum_ui_labels_common_translation_status_status" DEFAULT 'pending' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"note" varchar
  );
  
  CREATE TABLE "ui_labels_common" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"translation_meta" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "ui_labels_common_locales" (
  	"view_all" varchar DEFAULT 'View all' NOT NULL,
  	"read_more" varchar DEFAULT 'Read more' NOT NULL,
  	"back" varchar DEFAULT 'Back' NOT NULL,
  	"menu" varchar DEFAULT 'Menu' NOT NULL,
  	"close" varchar DEFAULT 'Close' NOT NULL,
  	"language" varchar DEFAULT 'Language' NOT NULL,
  	"prev" varchar DEFAULT 'Prev' NOT NULL,
  	"next" varchar DEFAULT 'Next' NOT NULL,
  	"sound_on" varchar DEFAULT 'Sound on' NOT NULL,
  	"sound_off" varchar DEFAULT 'Sound off' NOT NULL,
  	"watch_mv" varchar DEFAULT 'Watch MV' NOT NULL,
  	"get_quote" varchar DEFAULT 'Get a campaign quote' NOT NULL,
  	"not_found" varchar DEFAULT 'The page you are looking for does not exist.' NOT NULL,
  	"empty" varchar DEFAULT 'Coming soon' NOT NULL,
  	"all" varchar DEFAULT 'All' NOT NULL,
  	"original_notice" varchar DEFAULT 'This document is shown in English until its translation has been reviewed.' NOT NULL,
  	"open_map" varchar DEFAULT 'Open map' NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "ui_labels_home_translation_status" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"locale" "enum_ui_labels_home_translation_status_locale" NOT NULL,
  	"status" "enum_ui_labels_home_translation_status_status" DEFAULT 'pending' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"note" varchar
  );
  
  CREATE TABLE "ui_labels_home" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"translation_meta" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "ui_labels_home_locales" (
  	"new_release" varchar DEFAULT 'New Release' NOT NULL,
  	"artists" varchar DEFAULT 'Artists' NOT NULL,
  	"news" varchar DEFAULT 'News' NOT NULL,
  	"notice" varchar DEFAULT 'Notice' NOT NULL,
  	"scroll_down" varchar DEFAULT 'Scroll down' NOT NULL,
  	"pinned" varchar DEFAULT 'Pinned' NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "ui_labels_business_translation_status" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"locale" "enum_ui_labels_business_translation_status_locale" NOT NULL,
  	"status" "enum_ui_labels_business_translation_status_status" DEFAULT 'pending' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"note" varchar
  );
  
  CREATE TABLE "ui_labels_business" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"translation_meta" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "ui_labels_business_locales" (
  	"step1" varchar DEFAULT 'Choose talent' NOT NULL,
  	"step2" varchar DEFAULT 'Usage: Ads · Video · Social' NOT NULL,
  	"step3" varchar DEFAULT 'Period & Region' NOT NULL,
  	"step4" varchar DEFAULT 'Languages' NOT NULL,
  	"brands_title" varchar DEFAULT 'Brands we''ve worked with' NOT NULL,
  	"view_cases" varchar DEFAULT 'View case studies' NOT NULL,
  	"works" varchar DEFAULT 'Case Studies' NOT NULL,
  	"client" varchar DEFAULT 'Client' NOT NULL,
  	"talent" varchar DEFAULT 'Talent' NOT NULL,
  	"similar" varchar DEFAULT 'Plan a similar campaign' NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "ui_labels_artist_translation_status" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"locale" "enum_ui_labels_artist_translation_status_locale" NOT NULL,
  	"status" "enum_ui_labels_artist_translation_status_status" DEFAULT 'pending' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"note" varchar
  );
  
  CREATE TABLE "ui_labels_artist" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"translation_meta" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "ui_labels_artist_locales" (
  	"profile" varchar DEFAULT 'Profile' NOT NULL,
  	"introduction" varchar DEFAULT 'Introduction' NOT NULL,
  	"gallery" varchar DEFAULT 'Gallery' NOT NULL,
  	"music_videos" varchar DEFAULT 'Music Videos' NOT NULL,
  	"birthday" varchar DEFAULT 'Birthday' NOT NULL,
  	"debut" varchar DEFAULT 'Debut' NOT NULL,
  	"nationality" varchar DEFAULT 'Nationality' NOT NULL,
  	"quote_with_artist" varchar DEFAULT 'Get a campaign quote with this artist' NOT NULL,
  	"related_news" varchar DEFAULT 'Related News' NOT NULL,
  	"entries" varchar DEFAULT 'Entries' NOT NULL,
  	"view_all_photos" varchar DEFAULT 'View all photos' NOT NULL,
  	"notice" varchar DEFAULT 'Notice' NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "ui_labels_campaign_translation_status" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"locale" "enum_ui_labels_campaign_translation_status_locale" NOT NULL,
  	"status" "enum_ui_labels_campaign_translation_status_status" DEFAULT 'pending' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"note" varchar
  );
  
  CREATE TABLE "ui_labels_campaign" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"translation_meta" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "ui_labels_campaign_locales" (
  	"eyebrow" varchar DEFAULT 'Quote builder' NOT NULL,
  	"title" varchar DEFAULT 'Campaign Builder' NOT NULL,
  	"step1" varchar DEFAULT 'Talent' NOT NULL,
  	"step2" varchar DEFAULT 'Usage' NOT NULL,
  	"step3" varchar DEFAULT 'Region' NOT NULL,
  	"step4" varchar DEFAULT 'Languages' NOT NULL,
  	"step5" varchar DEFAULT 'Contact' NOT NULL,
  	"talent_title" varchar DEFAULT 'Select talent' NOT NULL,
  	"talent_hint" varchar DEFAULT 'Multiple selections allowed.' NOT NULL,
  	"usage_title" varchar DEFAULT 'Usage' NOT NULL,
  	"usage_hint" varchar DEFAULT 'Choose how the content will be used.' NOT NULL,
  	"usage_digital" varchar DEFAULT 'Digital Ads' NOT NULL,
  	"usage_digital_desc" varchar DEFAULT 'Global web, apps, and streaming platforms.' NOT NULL,
  	"usage_video" varchar DEFAULT 'TV & Video' NOT NULL,
  	"usage_video_desc" varchar DEFAULT 'Broadcast, cinema, and long-form video productions.' NOT NULL,
  	"usage_social" varchar DEFAULT 'Social Media' NOT NULL,
  	"usage_social_desc" varchar DEFAULT 'Influencer campaigns and branded content.' NOT NULL,
  	"usage_ooh" varchar DEFAULT 'Offline / OOH' NOT NULL,
  	"usage_ooh_desc" varchar DEFAULT 'Billboards, transit ads, and print media.' NOT NULL,
  	"period_title" varchar DEFAULT 'Period & Region' NOT NULL,
  	"duration" varchar DEFAULT 'Campaign period' NOT NULL,
  	"to" varchar DEFAULT 'to' NOT NULL,
  	"scope" varchar DEFAULT 'Region' NOT NULL,
  	"region_worldwide" varchar DEFAULT 'Worldwide' NOT NULL,
  	"region_kr" varchar DEFAULT 'South Korea' NOT NULL,
  	"region_na" varchar DEFAULT 'North America' NOT NULL,
  	"region_eu" varchar DEFAULT 'Europe' NOT NULL,
  	"region_apac" varchar DEFAULT 'Asia-Pacific' NOT NULL,
  	"region_other" varchar DEFAULT 'Other countries (separate with commas)' NOT NULL,
  	"languages_title" varchar DEFAULT 'Languages' NOT NULL,
  	"languages_hint" varchar DEFAULT 'Select every language the campaign will use.' NOT NULL,
  	"contact_title" varchar DEFAULT 'Company info' NOT NULL,
  	"company" varchar DEFAULT 'Company name' NOT NULL,
  	"contact_name" varchar DEFAULT 'Contact person' NOT NULL,
  	"email" varchar DEFAULT 'Work email' NOT NULL,
  	"phone" varchar DEFAULT 'Phone' NOT NULL,
  	"brief" varchar DEFAULT 'Project brief' NOT NULL,
  	"brief_placeholder" varchar DEFAULT 'Tell us about your campaign goals.' NOT NULL,
  	"previous" varchar DEFAULT 'Previous' NOT NULL,
  	"continue" varchar DEFAULT 'Continue' NOT NULL,
  	"submit" varchar DEFAULT 'Request quote' NOT NULL,
  	"summary" varchar DEFAULT 'Summary' NOT NULL,
  	"selected_talent" varchar DEFAULT 'Selected talent' NOT NULL,
  	"pick_talent" varchar DEFAULT 'Select at least one talent.' NOT NULL,
  	"pick_usage" varchar DEFAULT 'Select at least one usage.' NOT NULL,
  	"fill_contact" varchar DEFAULT 'Please fill in the required fields.' NOT NULL,
  	"done_title" varchar DEFAULT 'Request received' NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "ui_labels_contact_translation_status" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"locale" "enum_ui_labels_contact_translation_status_locale" NOT NULL,
  	"status" "enum_ui_labels_contact_translation_status_status" DEFAULT 'pending' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"note" varchar
  );
  
  CREATE TABLE "ui_labels_contact" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"translation_meta" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "ui_labels_contact_locales" (
  	"eyebrow" varchar DEFAULT 'Direct inquiry' NOT NULL,
  	"title" varchar DEFAULT 'Contact' NOT NULL,
  	"fast_title" varchar DEFAULT 'Faster booking' NOT NULL,
  	"fast_text" varchar DEFAULT 'For advertising and talent booking, get a faster quote with the Campaign Builder.' NOT NULL,
  	"fast_button" varchar DEFAULT 'Open Campaign Builder' NOT NULL,
  	"form_title" varchar DEFAULT 'Inquiry form' NOT NULL,
  	"type" varchar DEFAULT 'Inquiry type' NOT NULL,
  	"type_partnership" varchar DEFAULT 'Partnership' NOT NULL,
  	"type_press" varchar DEFAULT 'Press' NOT NULL,
  	"type_investment" varchar DEFAULT 'Investment' NOT NULL,
  	"type_other" varchar DEFAULT 'Other' NOT NULL,
  	"type_report" varchar DEFAULT 'Impersonation report' NOT NULL,
  	"type_application" varchar DEFAULT 'Application' NOT NULL,
  	"name" varchar DEFAULT 'Full name' NOT NULL,
  	"message" varchar DEFAULT 'Message' NOT NULL,
  	"attach" varchar DEFAULT 'Attach files' NOT NULL,
  	"attach_hint" varchar DEFAULT 'PDF, JPG, PNG, MP4, MOV · up to 50MB each · up to 5 files' NOT NULL,
  	"send" varchar DEFAULT 'Send inquiry' NOT NULL,
  	"office" varchar DEFAULT 'Office' NOT NULL,
  	"channels" varchar DEFAULT 'Official channels' NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "ui_labels_family_translation_status" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"locale" "enum_ui_labels_family_translation_status_locale" NOT NULL,
  	"status" "enum_ui_labels_family_translation_status_status" DEFAULT 'pending' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"note" varchar
  );
  
  CREATE TABLE "ui_labels_family" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"translation_meta" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "ui_labels_family_locales" (
  	"title" varchar DEFAULT 'Family' NOT NULL,
  	"labels" varchar DEFAULT 'Labels' NOT NULL,
  	"brands" varchar DEFAULT 'Brands' NOT NULL,
  	"affiliates" varchar DEFAULT 'Affiliates' NOT NULL,
  	"visit" varchar DEFAULT 'Visit site' NOT NULL,
  	"watch_film" varchar DEFAULT 'Watch film' NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "ui_labels_studio_translation_status" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"locale" "enum_ui_labels_studio_translation_status_locale" NOT NULL,
  	"status" "enum_ui_labels_studio_translation_status_status" DEFAULT 'pending' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"note" varchar
  );
  
  CREATE TABLE "ui_labels_studio" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"translation_meta" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "ui_labels_studio_locales" (
  	"title" varchar DEFAULT 'Studio' NOT NULL,
  	"intro" varchar DEFAULT 'How our AI talent is made, and the technology behind it.' NOT NULL,
  	"process" varchar DEFAULT 'Production Process' NOT NULL,
  	"showcase" varchar DEFAULT 'Technology Showcase' NOT NULL,
  	"phase" varchar DEFAULT 'Phase' NOT NULL,
  	"drag_to_compare" varchar DEFAULT 'Drag to compare' NOT NULL,
  	"build_campaign" varchar DEFAULT 'Build a campaign with this technology' NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "ui_labels_investors_translation_status" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"locale" "enum_ui_labels_investors_translation_status_locale" NOT NULL,
  	"status" "enum_ui_labels_investors_translation_status_status" DEFAULT 'pending' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"note" varchar
  );
  
  CREATE TABLE "ui_labels_investors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"translation_meta" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "ui_labels_investors_locales" (
  	"title" varchar DEFAULT 'Investors' NOT NULL,
  	"overview" varchar DEFAULT 'Overview' NOT NULL,
  	"token" varchar DEFAULT 'Token Info' NOT NULL,
  	"whitepaper" varchar DEFAULT 'Whitepaper' NOT NULL,
  	"roadmap" varchar DEFAULT 'Roadmap' NOT NULL,
  	"disclosure" varchar DEFAULT 'Disclosures' NOT NULL,
  	"audit" varchar DEFAULT 'Security Audit' NOT NULL,
  	"official" varchar DEFAULT 'Official Addresses' NOT NULL,
  	"disclaimer" varchar DEFAULT 'Risk Notice' NOT NULL,
  	"utilities" varchar DEFAULT 'Where the token is used' NOT NULL,
  	"token_name" varchar DEFAULT 'Token name' NOT NULL,
  	"symbol" varchar DEFAULT 'Symbol' NOT NULL,
  	"total_supply" varchar DEFAULT 'Total supply' NOT NULL,
  	"network" varchar DEFAULT 'Network' NOT NULL,
  	"listing" varchar DEFAULT 'Listing status' NOT NULL,
  	"allocation" varchar DEFAULT 'Token allocation' NOT NULL,
  	"vesting" varchar DEFAULT 'Lock-up & vesting schedule' NOT NULL,
  	"category" varchar DEFAULT 'Category' NOT NULL,
  	"tge_unlock" varchar DEFAULT 'Initial unlock' NOT NULL,
  	"cliff" varchar DEFAULT 'Lock-up' NOT NULL,
  	"vesting_period" varchar DEFAULT 'Vesting' NOT NULL,
  	"amount" varchar DEFAULT 'Amount' NOT NULL,
  	"contracts" varchar DEFAULT 'Official contract addresses' NOT NULL,
  	"wallets" varchar DEFAULT 'Official wallets' NOT NULL,
  	"copy" varchar DEFAULT 'Copy' NOT NULL,
  	"copied" varchar DEFAULT 'Copied' NOT NULL,
  	"security_alert" varchar DEFAULT 'Security alert' NOT NULL,
  	"verify_hint" varchar DEFAULT 'Always check addresses on this page before any transaction.' NOT NULL,
  	"version" varchar DEFAULT 'Version' NOT NULL,
  	"download" varchar DEFAULT 'Download PDF' NOT NULL,
  	"auditor" varchar DEFAULT 'Auditor' NOT NULL,
  	"scope" varchar DEFAULT 'Scope' NOT NULL,
  	"report" varchar DEFAULT 'Report' NOT NULL,
  	"status_done" varchar DEFAULT 'Done' NOT NULL,
  	"status_in_progress" varchar DEFAULT 'In progress' NOT NULL,
  	"status_planned" varchar DEFAULT 'Planned' NOT NULL,
  	"updated" varchar DEFAULT 'Updated' NOT NULL,
  	"restricted" varchar DEFAULT 'Restricted regions' NOT NULL,
  	"tba" varchar DEFAULT 'To be announced' NOT NULL,
  	"cat_issuance" varchar DEFAULT 'Issuance' NOT NULL,
  	"cat_allocation" varchar DEFAULT 'Allocation' NOT NULL,
  	"cat_unlock" varchar DEFAULT 'Unlock' NOT NULL,
  	"cat_partnership" varchar DEFAULT 'Partnership' NOT NULL,
  	"cat_other" varchar DEFAULT 'Other' NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "ui_labels_trust_translation_status" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"locale" "enum_ui_labels_trust_translation_status_locale" NOT NULL,
  	"status" "enum_ui_labels_trust_translation_status_status" DEFAULT 'pending' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"note" varchar
  );
  
  CREATE TABLE "ui_labels_trust" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"translation_meta" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "ui_labels_trust_locales" (
  	"title" varchar DEFAULT 'Trust' NOT NULL,
  	"intro" varchar DEFAULT 'How we label AI content, handle data, and protect fans from impersonation.' NOT NULL,
  	"report_title" varchar DEFAULT 'Report impersonation' NOT NULL,
  	"report_intro" varchar DEFAULT 'Seen a fake account, a deepfake, or a fake token or investment offer using our name or our artists? Tell us and we will act on it.' NOT NULL,
  	"reported_url" varchar DEFAULT 'Link to the account, post, or token' NOT NULL,
  	"details" varchar DEFAULT 'What happened?' NOT NULL,
  	"send_report" varchar DEFAULT 'Send report' NOT NULL,
  	"official_channels" varchar DEFAULT 'Our official channels' NOT NULL,
  	"official_hint" varchar DEFAULT 'We only communicate through the channels listed here.' NOT NULL,
  	"token_addresses" varchar DEFAULT 'Official token addresses' NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "ui_labels_join_translation_status" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"locale" "enum_ui_labels_join_translation_status_locale" NOT NULL,
  	"status" "enum_ui_labels_join_translation_status_status" DEFAULT 'pending' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"note" varchar
  );
  
  CREATE TABLE "ui_labels_join" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"translation_meta" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "ui_labels_join_locales" (
  	"title" varchar DEFAULT 'Join Us' NOT NULL,
  	"intro" varchar DEFAULT 'Create with us, or join the team.' NOT NULL,
  	"creators" varchar DEFAULT 'Creator Partners' NOT NULL,
  	"creators_intro" varchar DEFAULT 'We work with voice actors, motion performers, composers, and AI artists around the world.' NOT NULL,
  	"careers" varchar DEFAULT 'Careers' NOT NULL,
  	"careers_intro" varchar DEFAULT 'Join the team building the next generation of entertainment.' NOT NULL,
  	"open" varchar DEFAULT 'Open' NOT NULL,
  	"closed" varchar DEFAULT 'Closed' NOT NULL,
  	"deadline" varchar DEFAULT 'Deadline' NOT NULL,
  	"apply" varchar DEFAULT 'Apply' NOT NULL,
  	"apply_title" varchar DEFAULT 'Apply' NOT NULL,
  	"position" varchar DEFAULT 'Field' NOT NULL,
  	"general" varchar DEFAULT 'General application' NOT NULL,
  	"portfolio" varchar DEFAULT 'Portfolio files' NOT NULL,
  	"send_application" varchar DEFAULT 'Send application' NOT NULL,
  	"no_openings" varchar DEFAULT 'There are no open positions right now. You can still send a general application.' NOT NULL,
  	"notice" varchar DEFAULT 'We recruit only through this website and our official channels. Any other recruitment, audition, or fee request using our name is impersonation.' NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "ui_labels_cookie_translation_status" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"locale" "enum_ui_labels_cookie_translation_status_locale" NOT NULL,
  	"status" "enum_ui_labels_cookie_translation_status_status" DEFAULT 'pending' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"note" varchar
  );
  
  CREATE TABLE "ui_labels_cookie" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"translation_meta" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "ui_labels_cookie_locales" (
  	"title" varchar DEFAULT 'Cookies' NOT NULL,
  	"text" varchar DEFAULT 'We use essential cookies to run this site, such as remembering your language. With your consent, we may also use optional cookies to understand how the site is used.' NOT NULL,
  	"accept" varchar DEFAULT 'Accept all' NOT NULL,
  	"essential" varchar DEFAULT 'Essential only' NOT NULL,
  	"policy" varchar DEFAULT 'Cookie Policy' NOT NULL,
  	"settings" varchar DEFAULT 'Cookie settings' NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "ui_labels_news_translation_status" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"locale" "enum_ui_labels_news_translation_status_locale" NOT NULL,
  	"status" "enum_ui_labels_news_translation_status_status" DEFAULT 'pending' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"note" varchar
  );
  
  CREATE TABLE "ui_labels_news" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"translation_meta" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "ui_labels_news_locales" (
  	"eyebrow" varchar DEFAULT 'Global feed' NOT NULL,
  	"priority" varchar DEFAULT 'Priority' NOT NULL,
  	"archive" varchar DEFAULT 'Archive' NOT NULL,
  	"search" varchar DEFAULT 'Search' NOT NULL,
  	"more" varchar DEFAULT 'More news' NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "ui_labels_forms_translation_status" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"locale" "enum_ui_labels_forms_translation_status_locale" NOT NULL,
  	"status" "enum_ui_labels_forms_translation_status_status" DEFAULT 'pending' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"note" varchar
  );
  
  CREATE TABLE "ui_labels_forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"translation_meta" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "ui_labels_forms_locales" (
  	"submit" varchar DEFAULT 'Submit' NOT NULL,
  	"sending" varchar DEFAULT 'Sending…' NOT NULL,
  	"success" varchar DEFAULT 'Thank you. We have received your request.' NOT NULL,
  	"required" varchar DEFAULT 'Required' NOT NULL,
  	"privacy_consent" varchar DEFAULT 'I agree to the collection and use of my personal information.' NOT NULL,
  	"too_many" varchar DEFAULT 'Too many submissions. Please try again later.' NOT NULL,
  	"error" varchar DEFAULT 'Something went wrong. Please try again.' NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "home_slides_translation_status" ADD CONSTRAINT "home_slides_translation_status_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_slides" ADD CONSTRAINT "home_slides_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_slides" ADD CONSTRAINT "home_slides_video_file_id_media_id_fk" FOREIGN KEY ("video_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_slides" ADD CONSTRAINT "home_slides_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_slides_locales" ADD CONSTRAINT "home_slides_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "artist_categories_translation_status" ADD CONSTRAINT "artist_categories_translation_status_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."artist_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "artist_categories_locales" ADD CONSTRAINT "artist_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."artist_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "artists_extra_info" ADD CONSTRAINT "artists_extra_info_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "artists_extra_info_locales" ADD CONSTRAINT "artists_extra_info_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."artists_extra_info"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "artists_socials" ADD CONSTRAINT "artists_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "artists_videos" ADD CONSTRAINT "artists_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "artists_videos_locales" ADD CONSTRAINT "artists_videos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."artists_videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "artists_translation_status" ADD CONSTRAINT "artists_translation_status_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "artists" ADD CONSTRAINT "artists_profile_photo_id_media_id_fk" FOREIGN KEY ("profile_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "artists_locales" ADD CONSTRAINT "artists_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "artists_rels" ADD CONSTRAINT "artists_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "artists_rels" ADD CONSTRAINT "artists_rels_artist_categories_fk" FOREIGN KEY ("artist_categories_id") REFERENCES "public"."artist_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "artists_rels" ADD CONSTRAINT "artists_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_artists_v_version_extra_info" ADD CONSTRAINT "_artists_v_version_extra_info_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_artists_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_artists_v_version_extra_info_locales" ADD CONSTRAINT "_artists_v_version_extra_info_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_artists_v_version_extra_info"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_artists_v_version_socials" ADD CONSTRAINT "_artists_v_version_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_artists_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_artists_v_version_videos" ADD CONSTRAINT "_artists_v_version_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_artists_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_artists_v_version_videos_locales" ADD CONSTRAINT "_artists_v_version_videos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_artists_v_version_videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_artists_v_version_translation_status" ADD CONSTRAINT "_artists_v_version_translation_status_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_artists_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_artists_v" ADD CONSTRAINT "_artists_v_parent_id_artists_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."artists"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_artists_v" ADD CONSTRAINT "_artists_v_version_profile_photo_id_media_id_fk" FOREIGN KEY ("version_profile_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_artists_v_locales" ADD CONSTRAINT "_artists_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_artists_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_artists_v_rels" ADD CONSTRAINT "_artists_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_artists_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_artists_v_rels" ADD CONSTRAINT "_artists_v_rels_artist_categories_fk" FOREIGN KEY ("artist_categories_id") REFERENCES "public"."artist_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_artists_v_rels" ADD CONSTRAINT "_artists_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "boards_translation_status" ADD CONSTRAINT "boards_translation_status_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."boards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "boards_locales" ADD CONSTRAINT "boards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."boards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_translation_status" ADD CONSTRAINT "post_categories_translation_status_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories" ADD CONSTRAINT "post_categories_board_id_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "post_categories_locales" ADD CONSTRAINT "post_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_translation_status" ADD CONSTRAINT "posts_translation_status_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_board_id_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_post_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."post_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_artists_fk" FOREIGN KEY ("artists_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_translation_status" ADD CONSTRAINT "_posts_v_version_translation_status_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_board_id_boards_id_fk" FOREIGN KEY ("version_board_id") REFERENCES "public"."boards"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_category_id_post_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."post_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_thumbnail_id_media_id_fk" FOREIGN KEY ("version_thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_artists_fk" FOREIGN KEY ("artists_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_translation_status" ADD CONSTRAINT "case_studies_translation_status_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_brand_logo_id_media_id_fk" FOREIGN KEY ("brand_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies_locales" ADD CONSTRAINT "case_studies_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_rels" ADD CONSTRAINT "case_studies_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_rels" ADD CONSTRAINT "case_studies_rels_artists_fk" FOREIGN KEY ("artists_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_rels" ADD CONSTRAINT "case_studies_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_version_translation_status" ADD CONSTRAINT "_case_studies_v_version_translation_status_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_parent_id_case_studies_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."case_studies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_version_brand_logo_id_media_id_fk" FOREIGN KEY ("version_brand_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_version_thumbnail_id_media_id_fk" FOREIGN KEY ("version_thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v_locales" ADD CONSTRAINT "_case_studies_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_rels" ADD CONSTRAINT "_case_studies_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_rels" ADD CONSTRAINT "_case_studies_v_rels_artists_fk" FOREIGN KEY ("artists_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_rels" ADD CONSTRAINT "_case_studies_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_text" ADD CONSTRAINT "pages_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_text_locales" ADD CONSTRAINT "pages_blocks_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image" ADD CONSTRAINT "pages_blocks_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_locales" ADD CONSTRAINT "pages_blocks_image_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_image"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_video_locales" ADD CONSTRAINT "pages_blocks_video_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_video"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline_items" ADD CONSTRAINT "pages_blocks_timeline_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline_items_locales" ADD CONSTRAINT "pages_blocks_timeline_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_timeline_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline" ADD CONSTRAINT "pages_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_location_offices" ADD CONSTRAINT "pages_blocks_location_offices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_location"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_location_offices_locales" ADD CONSTRAINT "pages_blocks_location_offices_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_location_offices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_location" ADD CONSTRAINT "pages_blocks_location_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_locales" ADD CONSTRAINT "pages_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_translation_status" ADD CONSTRAINT "pages_translation_status_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_text" ADD CONSTRAINT "_pages_v_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_text_locales" ADD CONSTRAINT "_pages_v_blocks_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image" ADD CONSTRAINT "_pages_v_blocks_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_locales" ADD CONSTRAINT "_pages_v_blocks_image_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_image"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video_locales" ADD CONSTRAINT "_pages_v_blocks_video_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_video"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline_items" ADD CONSTRAINT "_pages_v_blocks_timeline_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline_items_locales" ADD CONSTRAINT "_pages_v_blocks_timeline_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_timeline_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline" ADD CONSTRAINT "_pages_v_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_location_offices" ADD CONSTRAINT "_pages_v_blocks_location_offices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_location"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_location_offices_locales" ADD CONSTRAINT "_pages_v_blocks_location_offices_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_location_offices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_location" ADD CONSTRAINT "_pages_v_blocks_location_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_locales" ADD CONSTRAINT "_pages_v_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_translation_status" ADD CONSTRAINT "_pages_v_version_translation_status_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "family_translation_status" ADD CONSTRAINT "family_translation_status_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."family"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "family" ADD CONSTRAINT "family_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "family" ADD CONSTRAINT "family_film_id_media_id_fk" FOREIGN KEY ("film_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "family" ADD CONSTRAINT "family_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "family_locales" ADD CONSTRAINT "family_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."family"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "family_rels" ADD CONSTRAINT "family_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."family"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "family_rels" ADD CONSTRAINT "family_rels_artists_fk" FOREIGN KEY ("artists_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "studio_items_translation_status" ADD CONSTRAINT "studio_items_translation_status_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."studio_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "studio_items" ADD CONSTRAINT "studio_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "studio_items" ADD CONSTRAINT "studio_items_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "studio_items" ADD CONSTRAINT "studio_items_before_id_media_id_fk" FOREIGN KEY ("before_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "studio_items" ADD CONSTRAINT "studio_items_after_id_media_id_fk" FOREIGN KEY ("after_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "studio_items_locales" ADD CONSTRAINT "studio_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."studio_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "openings_translation_status" ADD CONSTRAINT "openings_translation_status_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."openings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "openings_locales" ADD CONSTRAINT "openings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."openings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "disclosures_translation_status" ADD CONSTRAINT "disclosures_translation_status_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."disclosures"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "disclosures" ADD CONSTRAINT "disclosures_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "disclosures_locales" ADD CONSTRAINT "disclosures_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."disclosures"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_disclosures_v_version_translation_status" ADD CONSTRAINT "_disclosures_v_version_translation_status_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_disclosures_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_disclosures_v" ADD CONSTRAINT "_disclosures_v_parent_id_disclosures_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."disclosures"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_disclosures_v" ADD CONSTRAINT "_disclosures_v_version_file_id_media_id_fk" FOREIGN KEY ("version_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_disclosures_v_locales" ADD CONSTRAINT "_disclosures_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_disclosures_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quote_requests_usage" ADD CONSTRAINT "quote_requests_usage_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."quote_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quote_requests_regions" ADD CONSTRAINT "quote_requests_regions_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."quote_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quote_requests_languages" ADD CONSTRAINT "quote_requests_languages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."quote_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quote_requests" ADD CONSTRAINT "quote_requests_assignee_id_users_id_fk" FOREIGN KEY ("assignee_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "quote_requests_texts" ADD CONSTRAINT "quote_requests_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."quote_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quote_requests_rels" ADD CONSTRAINT "quote_requests_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."quote_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quote_requests_rels" ADD CONSTRAINT "quote_requests_rels_artists_fk" FOREIGN KEY ("artists_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_assignee_id_users_id_fk" FOREIGN KEY ("assignee_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "inquiries_rels" ADD CONSTRAINT "inquiries_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inquiries_rels" ADD CONSTRAINT "inquiries_rels_attachments_fk" FOREIGN KEY ("attachments_id") REFERENCES "public"."attachments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_translation_status" ADD CONSTRAINT "media_translation_status_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders_folder_type" ADD CONSTRAINT "payload_folders_folder_type_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders" ADD CONSTRAINT "payload_folders_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_home_slides_fk" FOREIGN KEY ("home_slides_id") REFERENCES "public"."home_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_artist_categories_fk" FOREIGN KEY ("artist_categories_id") REFERENCES "public"."artist_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_artists_fk" FOREIGN KEY ("artists_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_boards_fk" FOREIGN KEY ("boards_id") REFERENCES "public"."boards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_post_categories_fk" FOREIGN KEY ("post_categories_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_family_fk" FOREIGN KEY ("family_id") REFERENCES "public"."family"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_studio_items_fk" FOREIGN KEY ("studio_items_id") REFERENCES "public"."studio_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_openings_fk" FOREIGN KEY ("openings_id") REFERENCES "public"."openings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_disclosures_fk" FOREIGN KEY ("disclosures_id") REFERENCES "public"."disclosures"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_quote_requests_fk" FOREIGN KEY ("quote_requests_id") REFERENCES "public"."quote_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inquiries_fk" FOREIGN KEY ("inquiries_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_attachments_fk" FOREIGN KEY ("attachments_id") REFERENCES "public"."attachments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_glossary_fk" FOREIGN KEY ("glossary_id") REFERENCES "public"."glossary"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_folders_fk" FOREIGN KEY ("payload_folders_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_enabled_locales" ADD CONSTRAINT "site_settings_enabled_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_socials" ADD CONSTRAINT "site_settings_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_translation_status" ADD CONSTRAINT "site_settings_translation_status_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_dark_id_media_id_fk" FOREIGN KEY ("logo_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_texts" ADD CONSTRAINT "site_settings_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_rels" ADD CONSTRAINT "site_settings_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_rels" ADD CONSTRAINT "site_settings_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_sections_items" ADD CONSTRAINT "navigation_sections_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_sections_items_locales" ADD CONSTRAINT "navigation_sections_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_sections_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_sections" ADD CONSTRAINT "navigation_sections_preview_image_id_media_id_fk" FOREIGN KEY ("preview_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_sections" ADD CONSTRAINT "navigation_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_sections_locales" ADD CONSTRAINT "navigation_sections_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_translation_status" ADD CONSTRAINT "navigation_translation_status_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_locales" ADD CONSTRAINT "navigation_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_settings_sections" ADD CONSTRAINT "home_settings_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "business_settings_services" ADD CONSTRAINT "business_settings_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."business_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "business_settings_services_locales" ADD CONSTRAINT "business_settings_services_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."business_settings_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "business_settings_brands" ADD CONSTRAINT "business_settings_brands_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "business_settings_brands" ADD CONSTRAINT "business_settings_brands_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."business_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "business_settings_translation_status" ADD CONSTRAINT "business_settings_translation_status_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."business_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "business_settings_locales" ADD CONSTRAINT "business_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."business_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "business_settings_texts" ADD CONSTRAINT "business_settings_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."business_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_utilities" ADD CONSTRAINT "investors_utilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_utilities_locales" ADD CONSTRAINT "investors_utilities_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors_utilities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_allocation" ADD CONSTRAINT "investors_allocation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_allocation_locales" ADD CONSTRAINT "investors_allocation_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors_allocation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_vesting" ADD CONSTRAINT "investors_vesting_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_vesting_locales" ADD CONSTRAINT "investors_vesting_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors_vesting"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_whitepapers" ADD CONSTRAINT "investors_whitepapers_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "investors_whitepapers" ADD CONSTRAINT "investors_whitepapers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_roadmap" ADD CONSTRAINT "investors_roadmap_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_roadmap_locales" ADD CONSTRAINT "investors_roadmap_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors_roadmap"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_audits" ADD CONSTRAINT "investors_audits_report_id_media_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "investors_audits" ADD CONSTRAINT "investors_audits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_audits_locales" ADD CONSTRAINT "investors_audits_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors_audits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_contracts" ADD CONSTRAINT "investors_contracts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_wallets" ADD CONSTRAINT "investors_wallets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_translation_status" ADD CONSTRAINT "investors_translation_status_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_locales" ADD CONSTRAINT "investors_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ui_labels_common_translation_status" ADD CONSTRAINT "ui_labels_common_translation_status_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ui_labels_common"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ui_labels_common_locales" ADD CONSTRAINT "ui_labels_common_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ui_labels_common"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ui_labels_home_translation_status" ADD CONSTRAINT "ui_labels_home_translation_status_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ui_labels_home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ui_labels_home_locales" ADD CONSTRAINT "ui_labels_home_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ui_labels_home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ui_labels_business_translation_status" ADD CONSTRAINT "ui_labels_business_translation_status_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ui_labels_business"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ui_labels_business_locales" ADD CONSTRAINT "ui_labels_business_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ui_labels_business"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ui_labels_artist_translation_status" ADD CONSTRAINT "ui_labels_artist_translation_status_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ui_labels_artist"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ui_labels_artist_locales" ADD CONSTRAINT "ui_labels_artist_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ui_labels_artist"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ui_labels_campaign_translation_status" ADD CONSTRAINT "ui_labels_campaign_translation_status_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ui_labels_campaign"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ui_labels_campaign_locales" ADD CONSTRAINT "ui_labels_campaign_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ui_labels_campaign"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ui_labels_contact_translation_status" ADD CONSTRAINT "ui_labels_contact_translation_status_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ui_labels_contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ui_labels_contact_locales" ADD CONSTRAINT "ui_labels_contact_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ui_labels_contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ui_labels_family_translation_status" ADD CONSTRAINT "ui_labels_family_translation_status_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ui_labels_family"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ui_labels_family_locales" ADD CONSTRAINT "ui_labels_family_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ui_labels_family"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ui_labels_studio_translation_status" ADD CONSTRAINT "ui_labels_studio_translation_status_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ui_labels_studio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ui_labels_studio_locales" ADD CONSTRAINT "ui_labels_studio_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ui_labels_studio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ui_labels_investors_translation_status" ADD CONSTRAINT "ui_labels_investors_translation_status_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ui_labels_investors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ui_labels_investors_locales" ADD CONSTRAINT "ui_labels_investors_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ui_labels_investors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ui_labels_trust_translation_status" ADD CONSTRAINT "ui_labels_trust_translation_status_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ui_labels_trust"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ui_labels_trust_locales" ADD CONSTRAINT "ui_labels_trust_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ui_labels_trust"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ui_labels_join_translation_status" ADD CONSTRAINT "ui_labels_join_translation_status_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ui_labels_join"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ui_labels_join_locales" ADD CONSTRAINT "ui_labels_join_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ui_labels_join"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ui_labels_cookie_translation_status" ADD CONSTRAINT "ui_labels_cookie_translation_status_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ui_labels_cookie"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ui_labels_cookie_locales" ADD CONSTRAINT "ui_labels_cookie_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ui_labels_cookie"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ui_labels_news_translation_status" ADD CONSTRAINT "ui_labels_news_translation_status_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ui_labels_news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ui_labels_news_locales" ADD CONSTRAINT "ui_labels_news_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ui_labels_news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ui_labels_forms_translation_status" ADD CONSTRAINT "ui_labels_forms_translation_status_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ui_labels_forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ui_labels_forms_locales" ADD CONSTRAINT "ui_labels_forms_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ui_labels_forms"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_slides_translation_status_order_idx" ON "home_slides_translation_status" USING btree ("_order");
  CREATE INDEX "home_slides_translation_status_parent_id_idx" ON "home_slides_translation_status" USING btree ("_parent_id");
  CREATE INDEX "home_slides__order_idx" ON "home_slides" USING btree ("_order");
  CREATE INDEX "home_slides_artist_idx" ON "home_slides" USING btree ("artist_id");
  CREATE INDEX "home_slides_video_file_idx" ON "home_slides" USING btree ("video_file_id");
  CREATE INDEX "home_slides_poster_idx" ON "home_slides" USING btree ("poster_id");
  CREATE INDEX "home_slides_updated_at_idx" ON "home_slides" USING btree ("updated_at");
  CREATE INDEX "home_slides_created_at_idx" ON "home_slides" USING btree ("created_at");
  CREATE UNIQUE INDEX "home_slides_locales_locale_parent_id_unique" ON "home_slides_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_slides_locales_parent_id_idx" ON "home_slides_locales" USING btree ("_parent_id");
  CREATE INDEX "artist_categories_translation_status_order_idx" ON "artist_categories_translation_status" USING btree ("_order");
  CREATE INDEX "artist_categories_translation_status_parent_id_idx" ON "artist_categories_translation_status" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "artist_categories_slug_idx" ON "artist_categories" USING btree ("slug");
  CREATE INDEX "artist_categories_updated_at_idx" ON "artist_categories" USING btree ("updated_at");
  CREATE INDEX "artist_categories_created_at_idx" ON "artist_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "artist_categories_locales_locale_parent_id_unique" ON "artist_categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "artist_categories_locales_parent_id_idx" ON "artist_categories_locales" USING btree ("_parent_id");
  CREATE INDEX "artists_extra_info_order_idx" ON "artists_extra_info" USING btree ("_order");
  CREATE INDEX "artists_extra_info_parent_id_idx" ON "artists_extra_info" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "artists_extra_info_locales_locale_parent_id_unique" ON "artists_extra_info_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "artists_extra_info_locales_parent_id_idx" ON "artists_extra_info_locales" USING btree ("_parent_id");
  CREATE INDEX "artists_socials_order_idx" ON "artists_socials" USING btree ("_order");
  CREATE INDEX "artists_socials_parent_id_idx" ON "artists_socials" USING btree ("_parent_id");
  CREATE INDEX "artists_videos_order_idx" ON "artists_videos" USING btree ("_order");
  CREATE INDEX "artists_videos_parent_id_idx" ON "artists_videos" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "artists_videos_locales_locale_parent_id_unique" ON "artists_videos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "artists_videos_locales_parent_id_idx" ON "artists_videos_locales" USING btree ("_parent_id");
  CREATE INDEX "artists_translation_status_order_idx" ON "artists_translation_status" USING btree ("_order");
  CREATE INDEX "artists_translation_status_parent_id_idx" ON "artists_translation_status" USING btree ("_parent_id");
  CREATE INDEX "artists_profile_photo_idx" ON "artists" USING btree ("profile_photo_id");
  CREATE UNIQUE INDEX "artists_slug_idx" ON "artists" USING btree ("slug");
  CREATE INDEX "artists_updated_at_idx" ON "artists" USING btree ("updated_at");
  CREATE INDEX "artists_created_at_idx" ON "artists" USING btree ("created_at");
  CREATE INDEX "artists__status_idx" ON "artists" USING btree ("_status");
  CREATE UNIQUE INDEX "artists_locales_locale_parent_id_unique" ON "artists_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "artists_locales_parent_id_idx" ON "artists_locales" USING btree ("_parent_id");
  CREATE INDEX "artists_rels_order_idx" ON "artists_rels" USING btree ("order");
  CREATE INDEX "artists_rels_parent_idx" ON "artists_rels" USING btree ("parent_id");
  CREATE INDEX "artists_rels_path_idx" ON "artists_rels" USING btree ("path");
  CREATE INDEX "artists_rels_artist_categories_id_idx" ON "artists_rels" USING btree ("artist_categories_id");
  CREATE INDEX "artists_rels_media_id_idx" ON "artists_rels" USING btree ("media_id");
  CREATE INDEX "_artists_v_version_extra_info_order_idx" ON "_artists_v_version_extra_info" USING btree ("_order");
  CREATE INDEX "_artists_v_version_extra_info_parent_id_idx" ON "_artists_v_version_extra_info" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_artists_v_version_extra_info_locales_locale_parent_id_uniqu" ON "_artists_v_version_extra_info_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_artists_v_version_extra_info_locales_parent_id_idx" ON "_artists_v_version_extra_info_locales" USING btree ("_parent_id");
  CREATE INDEX "_artists_v_version_socials_order_idx" ON "_artists_v_version_socials" USING btree ("_order");
  CREATE INDEX "_artists_v_version_socials_parent_id_idx" ON "_artists_v_version_socials" USING btree ("_parent_id");
  CREATE INDEX "_artists_v_version_videos_order_idx" ON "_artists_v_version_videos" USING btree ("_order");
  CREATE INDEX "_artists_v_version_videos_parent_id_idx" ON "_artists_v_version_videos" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_artists_v_version_videos_locales_locale_parent_id_unique" ON "_artists_v_version_videos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_artists_v_version_videos_locales_parent_id_idx" ON "_artists_v_version_videos_locales" USING btree ("_parent_id");
  CREATE INDEX "_artists_v_version_translation_status_order_idx" ON "_artists_v_version_translation_status" USING btree ("_order");
  CREATE INDEX "_artists_v_version_translation_status_parent_id_idx" ON "_artists_v_version_translation_status" USING btree ("_parent_id");
  CREATE INDEX "_artists_v_parent_idx" ON "_artists_v" USING btree ("parent_id");
  CREATE INDEX "_artists_v_version_version_profile_photo_idx" ON "_artists_v" USING btree ("version_profile_photo_id");
  CREATE INDEX "_artists_v_version_version_slug_idx" ON "_artists_v" USING btree ("version_slug");
  CREATE INDEX "_artists_v_version_version_updated_at_idx" ON "_artists_v" USING btree ("version_updated_at");
  CREATE INDEX "_artists_v_version_version_created_at_idx" ON "_artists_v" USING btree ("version_created_at");
  CREATE INDEX "_artists_v_version_version__status_idx" ON "_artists_v" USING btree ("version__status");
  CREATE INDEX "_artists_v_created_at_idx" ON "_artists_v" USING btree ("created_at");
  CREATE INDEX "_artists_v_updated_at_idx" ON "_artists_v" USING btree ("updated_at");
  CREATE INDEX "_artists_v_snapshot_idx" ON "_artists_v" USING btree ("snapshot");
  CREATE INDEX "_artists_v_published_locale_idx" ON "_artists_v" USING btree ("published_locale");
  CREATE INDEX "_artists_v_latest_idx" ON "_artists_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_artists_v_locales_locale_parent_id_unique" ON "_artists_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_artists_v_locales_parent_id_idx" ON "_artists_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_artists_v_rels_order_idx" ON "_artists_v_rels" USING btree ("order");
  CREATE INDEX "_artists_v_rels_parent_idx" ON "_artists_v_rels" USING btree ("parent_id");
  CREATE INDEX "_artists_v_rels_path_idx" ON "_artists_v_rels" USING btree ("path");
  CREATE INDEX "_artists_v_rels_artist_categories_id_idx" ON "_artists_v_rels" USING btree ("artist_categories_id");
  CREATE INDEX "_artists_v_rels_media_id_idx" ON "_artists_v_rels" USING btree ("media_id");
  CREATE INDEX "boards_translation_status_order_idx" ON "boards_translation_status" USING btree ("_order");
  CREATE INDEX "boards_translation_status_parent_id_idx" ON "boards_translation_status" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "boards_slug_idx" ON "boards" USING btree ("slug");
  CREATE INDEX "boards_updated_at_idx" ON "boards" USING btree ("updated_at");
  CREATE INDEX "boards_created_at_idx" ON "boards" USING btree ("created_at");
  CREATE UNIQUE INDEX "boards_locales_locale_parent_id_unique" ON "boards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "boards_locales_parent_id_idx" ON "boards_locales" USING btree ("_parent_id");
  CREATE INDEX "post_categories_translation_status_order_idx" ON "post_categories_translation_status" USING btree ("_order");
  CREATE INDEX "post_categories_translation_status_parent_id_idx" ON "post_categories_translation_status" USING btree ("_parent_id");
  CREATE INDEX "post_categories_board_idx" ON "post_categories" USING btree ("board_id");
  CREATE INDEX "post_categories_updated_at_idx" ON "post_categories" USING btree ("updated_at");
  CREATE INDEX "post_categories_created_at_idx" ON "post_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "post_categories_locales_locale_parent_id_unique" ON "post_categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "post_categories_locales_parent_id_idx" ON "post_categories_locales" USING btree ("_parent_id");
  CREATE INDEX "posts_translation_status_order_idx" ON "posts_translation_status" USING btree ("_order");
  CREATE INDEX "posts_translation_status_parent_id_idx" ON "posts_translation_status" USING btree ("_parent_id");
  CREATE INDEX "posts_board_idx" ON "posts" USING btree ("board_id");
  CREATE INDEX "posts_category_idx" ON "posts" USING btree ("category_id");
  CREATE INDEX "posts_thumbnail_idx" ON "posts" USING btree ("thumbnail_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE UNIQUE INDEX "posts_locales_locale_parent_id_unique" ON "posts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "posts_locales_parent_id_idx" ON "posts_locales" USING btree ("_parent_id");
  CREATE INDEX "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_artists_id_idx" ON "posts_rels" USING btree ("artists_id");
  CREATE INDEX "_posts_v_version_translation_status_order_idx" ON "_posts_v_version_translation_status" USING btree ("_order");
  CREATE INDEX "_posts_v_version_translation_status_parent_id_idx" ON "_posts_v_version_translation_status" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_board_idx" ON "_posts_v" USING btree ("version_board_id");
  CREATE INDEX "_posts_v_version_version_category_idx" ON "_posts_v" USING btree ("version_category_id");
  CREATE INDEX "_posts_v_version_version_thumbnail_idx" ON "_posts_v" USING btree ("version_thumbnail_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_snapshot_idx" ON "_posts_v" USING btree ("snapshot");
  CREATE INDEX "_posts_v_published_locale_idx" ON "_posts_v" USING btree ("published_locale");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_posts_v_locales_locale_parent_id_unique" ON "_posts_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_posts_v_locales_parent_id_idx" ON "_posts_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_rels_order_idx" ON "_posts_v_rels" USING btree ("order");
  CREATE INDEX "_posts_v_rels_parent_idx" ON "_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_posts_v_rels_path_idx" ON "_posts_v_rels" USING btree ("path");
  CREATE INDEX "_posts_v_rels_artists_id_idx" ON "_posts_v_rels" USING btree ("artists_id");
  CREATE INDEX "case_studies_translation_status_order_idx" ON "case_studies_translation_status" USING btree ("_order");
  CREATE INDEX "case_studies_translation_status_parent_id_idx" ON "case_studies_translation_status" USING btree ("_parent_id");
  CREATE INDEX "case_studies_brand_logo_idx" ON "case_studies" USING btree ("brand_logo_id");
  CREATE INDEX "case_studies_thumbnail_idx" ON "case_studies" USING btree ("thumbnail_id");
  CREATE UNIQUE INDEX "case_studies_slug_idx" ON "case_studies" USING btree ("slug");
  CREATE INDEX "case_studies_updated_at_idx" ON "case_studies" USING btree ("updated_at");
  CREATE INDEX "case_studies_created_at_idx" ON "case_studies" USING btree ("created_at");
  CREATE INDEX "case_studies__status_idx" ON "case_studies" USING btree ("_status");
  CREATE UNIQUE INDEX "case_studies_locales_locale_parent_id_unique" ON "case_studies_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "case_studies_locales_parent_id_idx" ON "case_studies_locales" USING btree ("_parent_id");
  CREATE INDEX "case_studies_rels_order_idx" ON "case_studies_rels" USING btree ("order");
  CREATE INDEX "case_studies_rels_parent_idx" ON "case_studies_rels" USING btree ("parent_id");
  CREATE INDEX "case_studies_rels_path_idx" ON "case_studies_rels" USING btree ("path");
  CREATE INDEX "case_studies_rels_artists_id_idx" ON "case_studies_rels" USING btree ("artists_id");
  CREATE INDEX "case_studies_rels_media_id_idx" ON "case_studies_rels" USING btree ("media_id");
  CREATE INDEX "_case_studies_v_version_translation_status_order_idx" ON "_case_studies_v_version_translation_status" USING btree ("_order");
  CREATE INDEX "_case_studies_v_version_translation_status_parent_id_idx" ON "_case_studies_v_version_translation_status" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_parent_idx" ON "_case_studies_v" USING btree ("parent_id");
  CREATE INDEX "_case_studies_v_version_version_brand_logo_idx" ON "_case_studies_v" USING btree ("version_brand_logo_id");
  CREATE INDEX "_case_studies_v_version_version_thumbnail_idx" ON "_case_studies_v" USING btree ("version_thumbnail_id");
  CREATE INDEX "_case_studies_v_version_version_slug_idx" ON "_case_studies_v" USING btree ("version_slug");
  CREATE INDEX "_case_studies_v_version_version_updated_at_idx" ON "_case_studies_v" USING btree ("version_updated_at");
  CREATE INDEX "_case_studies_v_version_version_created_at_idx" ON "_case_studies_v" USING btree ("version_created_at");
  CREATE INDEX "_case_studies_v_version_version__status_idx" ON "_case_studies_v" USING btree ("version__status");
  CREATE INDEX "_case_studies_v_created_at_idx" ON "_case_studies_v" USING btree ("created_at");
  CREATE INDEX "_case_studies_v_updated_at_idx" ON "_case_studies_v" USING btree ("updated_at");
  CREATE INDEX "_case_studies_v_snapshot_idx" ON "_case_studies_v" USING btree ("snapshot");
  CREATE INDEX "_case_studies_v_published_locale_idx" ON "_case_studies_v" USING btree ("published_locale");
  CREATE INDEX "_case_studies_v_latest_idx" ON "_case_studies_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_case_studies_v_locales_locale_parent_id_unique" ON "_case_studies_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_case_studies_v_locales_parent_id_idx" ON "_case_studies_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_rels_order_idx" ON "_case_studies_v_rels" USING btree ("order");
  CREATE INDEX "_case_studies_v_rels_parent_idx" ON "_case_studies_v_rels" USING btree ("parent_id");
  CREATE INDEX "_case_studies_v_rels_path_idx" ON "_case_studies_v_rels" USING btree ("path");
  CREATE INDEX "_case_studies_v_rels_artists_id_idx" ON "_case_studies_v_rels" USING btree ("artists_id");
  CREATE INDEX "_case_studies_v_rels_media_id_idx" ON "_case_studies_v_rels" USING btree ("media_id");
  CREATE INDEX "pages_blocks_text_order_idx" ON "pages_blocks_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_text_parent_id_idx" ON "pages_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_text_path_idx" ON "pages_blocks_text" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_text_locales_locale_parent_id_unique" ON "pages_blocks_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_text_locales_parent_id_idx" ON "pages_blocks_text_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_order_idx" ON "pages_blocks_image" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_parent_id_idx" ON "pages_blocks_image" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_path_idx" ON "pages_blocks_image" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_image_locales_locale_parent_id_unique" ON "pages_blocks_image_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_image_locales_parent_id_idx" ON "pages_blocks_image_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_video_order_idx" ON "pages_blocks_video" USING btree ("_order");
  CREATE INDEX "pages_blocks_video_parent_id_idx" ON "pages_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_video_path_idx" ON "pages_blocks_video" USING btree ("_path");
  CREATE INDEX "pages_blocks_video_file_idx" ON "pages_blocks_video" USING btree ("file_id");
  CREATE UNIQUE INDEX "pages_blocks_video_locales_locale_parent_id_unique" ON "pages_blocks_video_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_video_locales_parent_id_idx" ON "pages_blocks_video_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_items_order_idx" ON "pages_blocks_timeline_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_timeline_items_parent_id_idx" ON "pages_blocks_timeline_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_timeline_items_locales_locale_parent_id_unique" ON "pages_blocks_timeline_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_timeline_items_locales_parent_id_idx" ON "pages_blocks_timeline_items_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_order_idx" ON "pages_blocks_timeline" USING btree ("_order");
  CREATE INDEX "pages_blocks_timeline_parent_id_idx" ON "pages_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_path_idx" ON "pages_blocks_timeline" USING btree ("_path");
  CREATE INDEX "pages_blocks_location_offices_order_idx" ON "pages_blocks_location_offices" USING btree ("_order");
  CREATE INDEX "pages_blocks_location_offices_parent_id_idx" ON "pages_blocks_location_offices" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_location_offices_locales_locale_parent_id_uniqu" ON "pages_blocks_location_offices_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_location_offices_locales_parent_id_idx" ON "pages_blocks_location_offices_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_location_order_idx" ON "pages_blocks_location" USING btree ("_order");
  CREATE INDEX "pages_blocks_location_parent_id_idx" ON "pages_blocks_location" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_location_path_idx" ON "pages_blocks_location" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "pages_blocks_cta" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_cta_locales_locale_parent_id_unique" ON "pages_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_cta_locales_parent_id_idx" ON "pages_blocks_cta_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_translation_status_order_idx" ON "pages_translation_status" USING btree ("_order");
  CREATE INDEX "pages_translation_status_parent_id_idx" ON "pages_translation_status" USING btree ("_parent_id");
  CREATE INDEX "pages_hero_image_idx" ON "pages" USING btree ("hero_image_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_locales_parent_id_idx" ON "pages_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_media_id_idx" ON "pages_rels" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_text_order_idx" ON "_pages_v_blocks_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_text_parent_id_idx" ON "_pages_v_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_text_path_idx" ON "_pages_v_blocks_text" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_text_locales_locale_parent_id_unique" ON "_pages_v_blocks_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_text_locales_parent_id_idx" ON "_pages_v_blocks_text_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_order_idx" ON "_pages_v_blocks_image" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_parent_id_idx" ON "_pages_v_blocks_image" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_path_idx" ON "_pages_v_blocks_image" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_image_locales_locale_parent_id_unique" ON "_pages_v_blocks_image_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_image_locales_parent_id_idx" ON "_pages_v_blocks_image_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_video_order_idx" ON "_pages_v_blocks_video" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_video_parent_id_idx" ON "_pages_v_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_video_path_idx" ON "_pages_v_blocks_video" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_video_file_idx" ON "_pages_v_blocks_video" USING btree ("file_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_video_locales_locale_parent_id_unique" ON "_pages_v_blocks_video_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_video_locales_parent_id_idx" ON "_pages_v_blocks_video_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_timeline_items_order_idx" ON "_pages_v_blocks_timeline_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_timeline_items_parent_id_idx" ON "_pages_v_blocks_timeline_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_timeline_items_locales_locale_parent_id_uniq" ON "_pages_v_blocks_timeline_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_timeline_items_locales_parent_id_idx" ON "_pages_v_blocks_timeline_items_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_timeline_order_idx" ON "_pages_v_blocks_timeline" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_timeline_parent_id_idx" ON "_pages_v_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_timeline_path_idx" ON "_pages_v_blocks_timeline" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_location_offices_order_idx" ON "_pages_v_blocks_location_offices" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_location_offices_parent_id_idx" ON "_pages_v_blocks_location_offices" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_location_offices_locales_locale_parent_id_un" ON "_pages_v_blocks_location_offices_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_location_offices_locales_parent_id_idx" ON "_pages_v_blocks_location_offices_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_location_order_idx" ON "_pages_v_blocks_location" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_location_parent_id_idx" ON "_pages_v_blocks_location" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_location_path_idx" ON "_pages_v_blocks_location" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_order_idx" ON "_pages_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_parent_id_idx" ON "_pages_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_path_idx" ON "_pages_v_blocks_cta" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_cta_locales_locale_parent_id_unique" ON "_pages_v_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_locales_parent_id_idx" ON "_pages_v_blocks_cta_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_translation_status_order_idx" ON "_pages_v_version_translation_status" USING btree ("_order");
  CREATE INDEX "_pages_v_version_translation_status_parent_id_idx" ON "_pages_v_version_translation_status" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_hero_image_idx" ON "_pages_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_locales_parent_id_idx" ON "_pages_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_media_id_idx" ON "_pages_v_rels" USING btree ("media_id");
  CREATE INDEX "family_translation_status_order_idx" ON "family_translation_status" USING btree ("_order");
  CREATE INDEX "family_translation_status_parent_id_idx" ON "family_translation_status" USING btree ("_parent_id");
  CREATE INDEX "family__order_idx" ON "family" USING btree ("_order");
  CREATE INDEX "family_logo_idx" ON "family" USING btree ("logo_id");
  CREATE INDEX "family_film_idx" ON "family" USING btree ("film_id");
  CREATE INDEX "family_poster_idx" ON "family" USING btree ("poster_id");
  CREATE INDEX "family_updated_at_idx" ON "family" USING btree ("updated_at");
  CREATE INDEX "family_created_at_idx" ON "family" USING btree ("created_at");
  CREATE UNIQUE INDEX "family_locales_locale_parent_id_unique" ON "family_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "family_locales_parent_id_idx" ON "family_locales" USING btree ("_parent_id");
  CREATE INDEX "family_rels_order_idx" ON "family_rels" USING btree ("order");
  CREATE INDEX "family_rels_parent_idx" ON "family_rels" USING btree ("parent_id");
  CREATE INDEX "family_rels_path_idx" ON "family_rels" USING btree ("path");
  CREATE INDEX "family_rels_artists_id_idx" ON "family_rels" USING btree ("artists_id");
  CREATE INDEX "studio_items_translation_status_order_idx" ON "studio_items_translation_status" USING btree ("_order");
  CREATE INDEX "studio_items_translation_status_parent_id_idx" ON "studio_items_translation_status" USING btree ("_parent_id");
  CREATE INDEX "studio_items__order_idx" ON "studio_items" USING btree ("_order");
  CREATE INDEX "studio_items_image_idx" ON "studio_items" USING btree ("image_id");
  CREATE INDEX "studio_items_video_idx" ON "studio_items" USING btree ("video_id");
  CREATE INDEX "studio_items_before_idx" ON "studio_items" USING btree ("before_id");
  CREATE INDEX "studio_items_after_idx" ON "studio_items" USING btree ("after_id");
  CREATE INDEX "studio_items_updated_at_idx" ON "studio_items" USING btree ("updated_at");
  CREATE INDEX "studio_items_created_at_idx" ON "studio_items" USING btree ("created_at");
  CREATE UNIQUE INDEX "studio_items_locales_locale_parent_id_unique" ON "studio_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "studio_items_locales_parent_id_idx" ON "studio_items_locales" USING btree ("_parent_id");
  CREATE INDEX "openings_translation_status_order_idx" ON "openings_translation_status" USING btree ("_order");
  CREATE INDEX "openings_translation_status_parent_id_idx" ON "openings_translation_status" USING btree ("_parent_id");
  CREATE INDEX "openings__order_idx" ON "openings" USING btree ("_order");
  CREATE INDEX "openings_updated_at_idx" ON "openings" USING btree ("updated_at");
  CREATE INDEX "openings_created_at_idx" ON "openings" USING btree ("created_at");
  CREATE UNIQUE INDEX "openings_locales_locale_parent_id_unique" ON "openings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "openings_locales_parent_id_idx" ON "openings_locales" USING btree ("_parent_id");
  CREATE INDEX "disclosures_translation_status_order_idx" ON "disclosures_translation_status" USING btree ("_order");
  CREATE INDEX "disclosures_translation_status_parent_id_idx" ON "disclosures_translation_status" USING btree ("_parent_id");
  CREATE INDEX "disclosures_file_idx" ON "disclosures" USING btree ("file_id");
  CREATE INDEX "disclosures_updated_at_idx" ON "disclosures" USING btree ("updated_at");
  CREATE INDEX "disclosures_created_at_idx" ON "disclosures" USING btree ("created_at");
  CREATE INDEX "disclosures__status_idx" ON "disclosures" USING btree ("_status");
  CREATE UNIQUE INDEX "disclosures_locales_locale_parent_id_unique" ON "disclosures_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "disclosures_locales_parent_id_idx" ON "disclosures_locales" USING btree ("_parent_id");
  CREATE INDEX "_disclosures_v_version_translation_status_order_idx" ON "_disclosures_v_version_translation_status" USING btree ("_order");
  CREATE INDEX "_disclosures_v_version_translation_status_parent_id_idx" ON "_disclosures_v_version_translation_status" USING btree ("_parent_id");
  CREATE INDEX "_disclosures_v_parent_idx" ON "_disclosures_v" USING btree ("parent_id");
  CREATE INDEX "_disclosures_v_version_version_file_idx" ON "_disclosures_v" USING btree ("version_file_id");
  CREATE INDEX "_disclosures_v_version_version_updated_at_idx" ON "_disclosures_v" USING btree ("version_updated_at");
  CREATE INDEX "_disclosures_v_version_version_created_at_idx" ON "_disclosures_v" USING btree ("version_created_at");
  CREATE INDEX "_disclosures_v_version_version__status_idx" ON "_disclosures_v" USING btree ("version__status");
  CREATE INDEX "_disclosures_v_created_at_idx" ON "_disclosures_v" USING btree ("created_at");
  CREATE INDEX "_disclosures_v_updated_at_idx" ON "_disclosures_v" USING btree ("updated_at");
  CREATE INDEX "_disclosures_v_snapshot_idx" ON "_disclosures_v" USING btree ("snapshot");
  CREATE INDEX "_disclosures_v_published_locale_idx" ON "_disclosures_v" USING btree ("published_locale");
  CREATE INDEX "_disclosures_v_latest_idx" ON "_disclosures_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_disclosures_v_locales_locale_parent_id_unique" ON "_disclosures_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_disclosures_v_locales_parent_id_idx" ON "_disclosures_v_locales" USING btree ("_parent_id");
  CREATE INDEX "quote_requests_usage_order_idx" ON "quote_requests_usage" USING btree ("order");
  CREATE INDEX "quote_requests_usage_parent_idx" ON "quote_requests_usage" USING btree ("parent_id");
  CREATE INDEX "quote_requests_regions_order_idx" ON "quote_requests_regions" USING btree ("order");
  CREATE INDEX "quote_requests_regions_parent_idx" ON "quote_requests_regions" USING btree ("parent_id");
  CREATE INDEX "quote_requests_languages_order_idx" ON "quote_requests_languages" USING btree ("order");
  CREATE INDEX "quote_requests_languages_parent_idx" ON "quote_requests_languages" USING btree ("parent_id");
  CREATE INDEX "quote_requests_ip_hash_idx" ON "quote_requests" USING btree ("ip_hash");
  CREATE INDEX "quote_requests_assignee_idx" ON "quote_requests" USING btree ("assignee_id");
  CREATE INDEX "quote_requests_updated_at_idx" ON "quote_requests" USING btree ("updated_at");
  CREATE INDEX "quote_requests_created_at_idx" ON "quote_requests" USING btree ("created_at");
  CREATE INDEX "quote_requests_texts_order_parent" ON "quote_requests_texts" USING btree ("order","parent_id");
  CREATE INDEX "quote_requests_rels_order_idx" ON "quote_requests_rels" USING btree ("order");
  CREATE INDEX "quote_requests_rels_parent_idx" ON "quote_requests_rels" USING btree ("parent_id");
  CREATE INDEX "quote_requests_rels_path_idx" ON "quote_requests_rels" USING btree ("path");
  CREATE INDEX "quote_requests_rels_artists_id_idx" ON "quote_requests_rels" USING btree ("artists_id");
  CREATE INDEX "inquiries_ip_hash_idx" ON "inquiries" USING btree ("ip_hash");
  CREATE INDEX "inquiries_assignee_idx" ON "inquiries" USING btree ("assignee_id");
  CREATE INDEX "inquiries_updated_at_idx" ON "inquiries" USING btree ("updated_at");
  CREATE INDEX "inquiries_created_at_idx" ON "inquiries" USING btree ("created_at");
  CREATE INDEX "inquiries_rels_order_idx" ON "inquiries_rels" USING btree ("order");
  CREATE INDEX "inquiries_rels_parent_idx" ON "inquiries_rels" USING btree ("parent_id");
  CREATE INDEX "inquiries_rels_path_idx" ON "inquiries_rels" USING btree ("path");
  CREATE INDEX "inquiries_rels_attachments_id_idx" ON "inquiries_rels" USING btree ("attachments_id");
  CREATE INDEX "attachments_ip_hash_idx" ON "attachments" USING btree ("ip_hash");
  CREATE INDEX "attachments_updated_at_idx" ON "attachments" USING btree ("updated_at");
  CREATE INDEX "attachments_created_at_idx" ON "attachments" USING btree ("created_at");
  CREATE UNIQUE INDEX "attachments_filename_idx" ON "attachments" USING btree ("filename");
  CREATE INDEX "media_translation_status_order_idx" ON "media_translation_status" USING btree ("_order");
  CREATE INDEX "media_translation_status_parent_id_idx" ON "media_translation_status" USING btree ("_parent_id");
  CREATE INDEX "media_folder_idx" ON "media" USING btree ("folder_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_large_sizes_large_filename_idx" ON "media" USING btree ("sizes_large_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_locales_parent_id_idx" ON "media_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "glossary_term_idx" ON "glossary" USING btree ("term");
  CREATE INDEX "glossary_updated_at_idx" ON "glossary" USING btree ("updated_at");
  CREATE INDEX "glossary_created_at_idx" ON "glossary" USING btree ("created_at");
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_concurrency_key_idx" ON "payload_jobs" USING btree ("concurrency_key");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_folders_folder_type_order_idx" ON "payload_folders_folder_type" USING btree ("order");
  CREATE INDEX "payload_folders_folder_type_parent_idx" ON "payload_folders_folder_type" USING btree ("parent_id");
  CREATE INDEX "payload_folders_name_idx" ON "payload_folders" USING btree ("name");
  CREATE INDEX "payload_folders_folder_idx" ON "payload_folders" USING btree ("folder_id");
  CREATE INDEX "payload_folders_updated_at_idx" ON "payload_folders" USING btree ("updated_at");
  CREATE INDEX "payload_folders_created_at_idx" ON "payload_folders" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_home_slides_id_idx" ON "payload_locked_documents_rels" USING btree ("home_slides_id");
  CREATE INDEX "payload_locked_documents_rels_artist_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("artist_categories_id");
  CREATE INDEX "payload_locked_documents_rels_artists_id_idx" ON "payload_locked_documents_rels" USING btree ("artists_id");
  CREATE INDEX "payload_locked_documents_rels_boards_id_idx" ON "payload_locked_documents_rels" USING btree ("boards_id");
  CREATE INDEX "payload_locked_documents_rels_post_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("post_categories_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_case_studies_id_idx" ON "payload_locked_documents_rels" USING btree ("case_studies_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_family_id_idx" ON "payload_locked_documents_rels" USING btree ("family_id");
  CREATE INDEX "payload_locked_documents_rels_studio_items_id_idx" ON "payload_locked_documents_rels" USING btree ("studio_items_id");
  CREATE INDEX "payload_locked_documents_rels_openings_id_idx" ON "payload_locked_documents_rels" USING btree ("openings_id");
  CREATE INDEX "payload_locked_documents_rels_disclosures_id_idx" ON "payload_locked_documents_rels" USING btree ("disclosures_id");
  CREATE INDEX "payload_locked_documents_rels_quote_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("quote_requests_id");
  CREATE INDEX "payload_locked_documents_rels_inquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("inquiries_id");
  CREATE INDEX "payload_locked_documents_rels_attachments_id_idx" ON "payload_locked_documents_rels" USING btree ("attachments_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_glossary_id_idx" ON "payload_locked_documents_rels" USING btree ("glossary_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_payload_folders_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_folders_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_enabled_locales_order_idx" ON "site_settings_enabled_locales" USING btree ("order");
  CREATE INDEX "site_settings_enabled_locales_parent_idx" ON "site_settings_enabled_locales" USING btree ("parent_id");
  CREATE INDEX "site_settings_socials_order_idx" ON "site_settings_socials" USING btree ("_order");
  CREATE INDEX "site_settings_socials_parent_id_idx" ON "site_settings_socials" USING btree ("_parent_id");
  CREATE INDEX "site_settings_translation_status_order_idx" ON "site_settings_translation_status" USING btree ("_order");
  CREATE INDEX "site_settings_translation_status_parent_id_idx" ON "site_settings_translation_status" USING btree ("_parent_id");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "site_settings_logo_dark_idx" ON "site_settings" USING btree ("logo_dark_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_locales_parent_id_idx" ON "site_settings_locales" USING btree ("_parent_id");
  CREATE INDEX "site_settings_texts_order_parent" ON "site_settings_texts" USING btree ("order","parent_id");
  CREATE INDEX "site_settings_rels_order_idx" ON "site_settings_rels" USING btree ("order");
  CREATE INDEX "site_settings_rels_parent_idx" ON "site_settings_rels" USING btree ("parent_id");
  CREATE INDEX "site_settings_rels_path_idx" ON "site_settings_rels" USING btree ("path");
  CREATE INDEX "site_settings_rels_pages_id_idx" ON "site_settings_rels" USING btree ("pages_id");
  CREATE INDEX "navigation_sections_items_order_idx" ON "navigation_sections_items" USING btree ("_order");
  CREATE INDEX "navigation_sections_items_parent_id_idx" ON "navigation_sections_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "navigation_sections_items_locales_locale_parent_id_unique" ON "navigation_sections_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_sections_items_locales_parent_id_idx" ON "navigation_sections_items_locales" USING btree ("_parent_id");
  CREATE INDEX "navigation_sections_order_idx" ON "navigation_sections" USING btree ("_order");
  CREATE INDEX "navigation_sections_parent_id_idx" ON "navigation_sections" USING btree ("_parent_id");
  CREATE INDEX "navigation_sections_preview_image_idx" ON "navigation_sections" USING btree ("preview_image_id");
  CREATE UNIQUE INDEX "navigation_sections_locales_locale_parent_id_unique" ON "navigation_sections_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_sections_locales_parent_id_idx" ON "navigation_sections_locales" USING btree ("_parent_id");
  CREATE INDEX "navigation_translation_status_order_idx" ON "navigation_translation_status" USING btree ("_order");
  CREATE INDEX "navigation_translation_status_parent_id_idx" ON "navigation_translation_status" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "navigation_locales_locale_parent_id_unique" ON "navigation_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_locales_parent_id_idx" ON "navigation_locales" USING btree ("_parent_id");
  CREATE INDEX "home_settings_sections_order_idx" ON "home_settings_sections" USING btree ("_order");
  CREATE INDEX "home_settings_sections_parent_id_idx" ON "home_settings_sections" USING btree ("_parent_id");
  CREATE INDEX "business_settings_services_order_idx" ON "business_settings_services" USING btree ("_order");
  CREATE INDEX "business_settings_services_parent_id_idx" ON "business_settings_services" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "business_settings_services_locales_locale_parent_id_unique" ON "business_settings_services_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "business_settings_services_locales_parent_id_idx" ON "business_settings_services_locales" USING btree ("_parent_id");
  CREATE INDEX "business_settings_brands_order_idx" ON "business_settings_brands" USING btree ("_order");
  CREATE INDEX "business_settings_brands_parent_id_idx" ON "business_settings_brands" USING btree ("_parent_id");
  CREATE INDEX "business_settings_brands_logo_idx" ON "business_settings_brands" USING btree ("logo_id");
  CREATE INDEX "business_settings_translation_status_order_idx" ON "business_settings_translation_status" USING btree ("_order");
  CREATE INDEX "business_settings_translation_status_parent_id_idx" ON "business_settings_translation_status" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "business_settings_locales_locale_parent_id_unique" ON "business_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "business_settings_locales_parent_id_idx" ON "business_settings_locales" USING btree ("_parent_id");
  CREATE INDEX "business_settings_texts_order_parent" ON "business_settings_texts" USING btree ("order","parent_id");
  CREATE INDEX "investors_utilities_order_idx" ON "investors_utilities" USING btree ("_order");
  CREATE INDEX "investors_utilities_parent_id_idx" ON "investors_utilities" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "investors_utilities_locales_locale_parent_id_unique" ON "investors_utilities_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "investors_utilities_locales_parent_id_idx" ON "investors_utilities_locales" USING btree ("_parent_id");
  CREATE INDEX "investors_allocation_order_idx" ON "investors_allocation" USING btree ("_order");
  CREATE INDEX "investors_allocation_parent_id_idx" ON "investors_allocation" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "investors_allocation_locales_locale_parent_id_unique" ON "investors_allocation_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "investors_allocation_locales_parent_id_idx" ON "investors_allocation_locales" USING btree ("_parent_id");
  CREATE INDEX "investors_vesting_order_idx" ON "investors_vesting" USING btree ("_order");
  CREATE INDEX "investors_vesting_parent_id_idx" ON "investors_vesting" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "investors_vesting_locales_locale_parent_id_unique" ON "investors_vesting_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "investors_vesting_locales_parent_id_idx" ON "investors_vesting_locales" USING btree ("_parent_id");
  CREATE INDEX "investors_whitepapers_order_idx" ON "investors_whitepapers" USING btree ("_order");
  CREATE INDEX "investors_whitepapers_parent_id_idx" ON "investors_whitepapers" USING btree ("_parent_id");
  CREATE INDEX "investors_whitepapers_file_idx" ON "investors_whitepapers" USING btree ("file_id");
  CREATE INDEX "investors_roadmap_order_idx" ON "investors_roadmap" USING btree ("_order");
  CREATE INDEX "investors_roadmap_parent_id_idx" ON "investors_roadmap" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "investors_roadmap_locales_locale_parent_id_unique" ON "investors_roadmap_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "investors_roadmap_locales_parent_id_idx" ON "investors_roadmap_locales" USING btree ("_parent_id");
  CREATE INDEX "investors_audits_order_idx" ON "investors_audits" USING btree ("_order");
  CREATE INDEX "investors_audits_parent_id_idx" ON "investors_audits" USING btree ("_parent_id");
  CREATE INDEX "investors_audits_report_idx" ON "investors_audits" USING btree ("report_id");
  CREATE UNIQUE INDEX "investors_audits_locales_locale_parent_id_unique" ON "investors_audits_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "investors_audits_locales_parent_id_idx" ON "investors_audits_locales" USING btree ("_parent_id");
  CREATE INDEX "investors_contracts_order_idx" ON "investors_contracts" USING btree ("_order");
  CREATE INDEX "investors_contracts_parent_id_idx" ON "investors_contracts" USING btree ("_parent_id");
  CREATE INDEX "investors_wallets_order_idx" ON "investors_wallets" USING btree ("_order");
  CREATE INDEX "investors_wallets_parent_id_idx" ON "investors_wallets" USING btree ("_parent_id");
  CREATE INDEX "investors_translation_status_order_idx" ON "investors_translation_status" USING btree ("_order");
  CREATE INDEX "investors_translation_status_parent_id_idx" ON "investors_translation_status" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "investors_locales_locale_parent_id_unique" ON "investors_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "investors_locales_parent_id_idx" ON "investors_locales" USING btree ("_parent_id");
  CREATE INDEX "ui_labels_common_translation_status_order_idx" ON "ui_labels_common_translation_status" USING btree ("_order");
  CREATE INDEX "ui_labels_common_translation_status_parent_id_idx" ON "ui_labels_common_translation_status" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "ui_labels_common_locales_locale_parent_id_unique" ON "ui_labels_common_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "ui_labels_common_locales_parent_id_idx" ON "ui_labels_common_locales" USING btree ("_parent_id");
  CREATE INDEX "ui_labels_home_translation_status_order_idx" ON "ui_labels_home_translation_status" USING btree ("_order");
  CREATE INDEX "ui_labels_home_translation_status_parent_id_idx" ON "ui_labels_home_translation_status" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "ui_labels_home_locales_locale_parent_id_unique" ON "ui_labels_home_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "ui_labels_home_locales_parent_id_idx" ON "ui_labels_home_locales" USING btree ("_parent_id");
  CREATE INDEX "ui_labels_business_translation_status_order_idx" ON "ui_labels_business_translation_status" USING btree ("_order");
  CREATE INDEX "ui_labels_business_translation_status_parent_id_idx" ON "ui_labels_business_translation_status" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "ui_labels_business_locales_locale_parent_id_unique" ON "ui_labels_business_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "ui_labels_business_locales_parent_id_idx" ON "ui_labels_business_locales" USING btree ("_parent_id");
  CREATE INDEX "ui_labels_artist_translation_status_order_idx" ON "ui_labels_artist_translation_status" USING btree ("_order");
  CREATE INDEX "ui_labels_artist_translation_status_parent_id_idx" ON "ui_labels_artist_translation_status" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "ui_labels_artist_locales_locale_parent_id_unique" ON "ui_labels_artist_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "ui_labels_artist_locales_parent_id_idx" ON "ui_labels_artist_locales" USING btree ("_parent_id");
  CREATE INDEX "ui_labels_campaign_translation_status_order_idx" ON "ui_labels_campaign_translation_status" USING btree ("_order");
  CREATE INDEX "ui_labels_campaign_translation_status_parent_id_idx" ON "ui_labels_campaign_translation_status" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "ui_labels_campaign_locales_locale_parent_id_unique" ON "ui_labels_campaign_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "ui_labels_campaign_locales_parent_id_idx" ON "ui_labels_campaign_locales" USING btree ("_parent_id");
  CREATE INDEX "ui_labels_contact_translation_status_order_idx" ON "ui_labels_contact_translation_status" USING btree ("_order");
  CREATE INDEX "ui_labels_contact_translation_status_parent_id_idx" ON "ui_labels_contact_translation_status" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "ui_labels_contact_locales_locale_parent_id_unique" ON "ui_labels_contact_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "ui_labels_contact_locales_parent_id_idx" ON "ui_labels_contact_locales" USING btree ("_parent_id");
  CREATE INDEX "ui_labels_family_translation_status_order_idx" ON "ui_labels_family_translation_status" USING btree ("_order");
  CREATE INDEX "ui_labels_family_translation_status_parent_id_idx" ON "ui_labels_family_translation_status" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "ui_labels_family_locales_locale_parent_id_unique" ON "ui_labels_family_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "ui_labels_family_locales_parent_id_idx" ON "ui_labels_family_locales" USING btree ("_parent_id");
  CREATE INDEX "ui_labels_studio_translation_status_order_idx" ON "ui_labels_studio_translation_status" USING btree ("_order");
  CREATE INDEX "ui_labels_studio_translation_status_parent_id_idx" ON "ui_labels_studio_translation_status" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "ui_labels_studio_locales_locale_parent_id_unique" ON "ui_labels_studio_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "ui_labels_studio_locales_parent_id_idx" ON "ui_labels_studio_locales" USING btree ("_parent_id");
  CREATE INDEX "ui_labels_investors_translation_status_order_idx" ON "ui_labels_investors_translation_status" USING btree ("_order");
  CREATE INDEX "ui_labels_investors_translation_status_parent_id_idx" ON "ui_labels_investors_translation_status" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "ui_labels_investors_locales_locale_parent_id_unique" ON "ui_labels_investors_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "ui_labels_investors_locales_parent_id_idx" ON "ui_labels_investors_locales" USING btree ("_parent_id");
  CREATE INDEX "ui_labels_trust_translation_status_order_idx" ON "ui_labels_trust_translation_status" USING btree ("_order");
  CREATE INDEX "ui_labels_trust_translation_status_parent_id_idx" ON "ui_labels_trust_translation_status" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "ui_labels_trust_locales_locale_parent_id_unique" ON "ui_labels_trust_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "ui_labels_trust_locales_parent_id_idx" ON "ui_labels_trust_locales" USING btree ("_parent_id");
  CREATE INDEX "ui_labels_join_translation_status_order_idx" ON "ui_labels_join_translation_status" USING btree ("_order");
  CREATE INDEX "ui_labels_join_translation_status_parent_id_idx" ON "ui_labels_join_translation_status" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "ui_labels_join_locales_locale_parent_id_unique" ON "ui_labels_join_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "ui_labels_join_locales_parent_id_idx" ON "ui_labels_join_locales" USING btree ("_parent_id");
  CREATE INDEX "ui_labels_cookie_translation_status_order_idx" ON "ui_labels_cookie_translation_status" USING btree ("_order");
  CREATE INDEX "ui_labels_cookie_translation_status_parent_id_idx" ON "ui_labels_cookie_translation_status" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "ui_labels_cookie_locales_locale_parent_id_unique" ON "ui_labels_cookie_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "ui_labels_cookie_locales_parent_id_idx" ON "ui_labels_cookie_locales" USING btree ("_parent_id");
  CREATE INDEX "ui_labels_news_translation_status_order_idx" ON "ui_labels_news_translation_status" USING btree ("_order");
  CREATE INDEX "ui_labels_news_translation_status_parent_id_idx" ON "ui_labels_news_translation_status" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "ui_labels_news_locales_locale_parent_id_unique" ON "ui_labels_news_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "ui_labels_news_locales_parent_id_idx" ON "ui_labels_news_locales" USING btree ("_parent_id");
  CREATE INDEX "ui_labels_forms_translation_status_order_idx" ON "ui_labels_forms_translation_status" USING btree ("_order");
  CREATE INDEX "ui_labels_forms_translation_status_parent_id_idx" ON "ui_labels_forms_translation_status" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "ui_labels_forms_locales_locale_parent_id_unique" ON "ui_labels_forms_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "ui_labels_forms_locales_parent_id_idx" ON "ui_labels_forms_locales" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "home_slides_translation_status" CASCADE;
  DROP TABLE "home_slides" CASCADE;
  DROP TABLE "home_slides_locales" CASCADE;
  DROP TABLE "artist_categories_translation_status" CASCADE;
  DROP TABLE "artist_categories" CASCADE;
  DROP TABLE "artist_categories_locales" CASCADE;
  DROP TABLE "artists_extra_info" CASCADE;
  DROP TABLE "artists_extra_info_locales" CASCADE;
  DROP TABLE "artists_socials" CASCADE;
  DROP TABLE "artists_videos" CASCADE;
  DROP TABLE "artists_videos_locales" CASCADE;
  DROP TABLE "artists_translation_status" CASCADE;
  DROP TABLE "artists" CASCADE;
  DROP TABLE "artists_locales" CASCADE;
  DROP TABLE "artists_rels" CASCADE;
  DROP TABLE "_artists_v_version_extra_info" CASCADE;
  DROP TABLE "_artists_v_version_extra_info_locales" CASCADE;
  DROP TABLE "_artists_v_version_socials" CASCADE;
  DROP TABLE "_artists_v_version_videos" CASCADE;
  DROP TABLE "_artists_v_version_videos_locales" CASCADE;
  DROP TABLE "_artists_v_version_translation_status" CASCADE;
  DROP TABLE "_artists_v" CASCADE;
  DROP TABLE "_artists_v_locales" CASCADE;
  DROP TABLE "_artists_v_rels" CASCADE;
  DROP TABLE "boards_translation_status" CASCADE;
  DROP TABLE "boards" CASCADE;
  DROP TABLE "boards_locales" CASCADE;
  DROP TABLE "post_categories_translation_status" CASCADE;
  DROP TABLE "post_categories" CASCADE;
  DROP TABLE "post_categories_locales" CASCADE;
  DROP TABLE "posts_translation_status" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_locales" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "_posts_v_version_translation_status" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_posts_v_locales" CASCADE;
  DROP TABLE "_posts_v_rels" CASCADE;
  DROP TABLE "case_studies_translation_status" CASCADE;
  DROP TABLE "case_studies" CASCADE;
  DROP TABLE "case_studies_locales" CASCADE;
  DROP TABLE "case_studies_rels" CASCADE;
  DROP TABLE "_case_studies_v_version_translation_status" CASCADE;
  DROP TABLE "_case_studies_v" CASCADE;
  DROP TABLE "_case_studies_v_locales" CASCADE;
  DROP TABLE "_case_studies_v_rels" CASCADE;
  DROP TABLE "pages_blocks_text" CASCADE;
  DROP TABLE "pages_blocks_text_locales" CASCADE;
  DROP TABLE "pages_blocks_image" CASCADE;
  DROP TABLE "pages_blocks_image_locales" CASCADE;
  DROP TABLE "pages_blocks_video" CASCADE;
  DROP TABLE "pages_blocks_video_locales" CASCADE;
  DROP TABLE "pages_blocks_timeline_items" CASCADE;
  DROP TABLE "pages_blocks_timeline_items_locales" CASCADE;
  DROP TABLE "pages_blocks_timeline" CASCADE;
  DROP TABLE "pages_blocks_location_offices" CASCADE;
  DROP TABLE "pages_blocks_location_offices_locales" CASCADE;
  DROP TABLE "pages_blocks_location" CASCADE;
  DROP TABLE "pages_blocks_cta" CASCADE;
  DROP TABLE "pages_blocks_cta_locales" CASCADE;
  DROP TABLE "pages_translation_status" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_blocks_text" CASCADE;
  DROP TABLE "_pages_v_blocks_text_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_image" CASCADE;
  DROP TABLE "_pages_v_blocks_image_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_video" CASCADE;
  DROP TABLE "_pages_v_blocks_video_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_timeline_items" CASCADE;
  DROP TABLE "_pages_v_blocks_timeline_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_timeline" CASCADE;
  DROP TABLE "_pages_v_blocks_location_offices" CASCADE;
  DROP TABLE "_pages_v_blocks_location_offices_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_location" CASCADE;
  DROP TABLE "_pages_v_blocks_cta" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_locales" CASCADE;
  DROP TABLE "_pages_v_version_translation_status" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "family_translation_status" CASCADE;
  DROP TABLE "family" CASCADE;
  DROP TABLE "family_locales" CASCADE;
  DROP TABLE "family_rels" CASCADE;
  DROP TABLE "studio_items_translation_status" CASCADE;
  DROP TABLE "studio_items" CASCADE;
  DROP TABLE "studio_items_locales" CASCADE;
  DROP TABLE "openings_translation_status" CASCADE;
  DROP TABLE "openings" CASCADE;
  DROP TABLE "openings_locales" CASCADE;
  DROP TABLE "disclosures_translation_status" CASCADE;
  DROP TABLE "disclosures" CASCADE;
  DROP TABLE "disclosures_locales" CASCADE;
  DROP TABLE "_disclosures_v_version_translation_status" CASCADE;
  DROP TABLE "_disclosures_v" CASCADE;
  DROP TABLE "_disclosures_v_locales" CASCADE;
  DROP TABLE "quote_requests_usage" CASCADE;
  DROP TABLE "quote_requests_regions" CASCADE;
  DROP TABLE "quote_requests_languages" CASCADE;
  DROP TABLE "quote_requests" CASCADE;
  DROP TABLE "quote_requests_texts" CASCADE;
  DROP TABLE "quote_requests_rels" CASCADE;
  DROP TABLE "inquiries" CASCADE;
  DROP TABLE "inquiries_rels" CASCADE;
  DROP TABLE "attachments" CASCADE;
  DROP TABLE "media_translation_status" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "glossary" CASCADE;
  DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_folders_folder_type" CASCADE;
  DROP TABLE "payload_folders" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_enabled_locales" CASCADE;
  DROP TABLE "site_settings_socials" CASCADE;
  DROP TABLE "site_settings_translation_status" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  DROP TABLE "site_settings_texts" CASCADE;
  DROP TABLE "site_settings_rels" CASCADE;
  DROP TABLE "navigation_sections_items" CASCADE;
  DROP TABLE "navigation_sections_items_locales" CASCADE;
  DROP TABLE "navigation_sections" CASCADE;
  DROP TABLE "navigation_sections_locales" CASCADE;
  DROP TABLE "navigation_translation_status" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TABLE "navigation_locales" CASCADE;
  DROP TABLE "home_settings_sections" CASCADE;
  DROP TABLE "home_settings" CASCADE;
  DROP TABLE "business_settings_services" CASCADE;
  DROP TABLE "business_settings_services_locales" CASCADE;
  DROP TABLE "business_settings_brands" CASCADE;
  DROP TABLE "business_settings_translation_status" CASCADE;
  DROP TABLE "business_settings" CASCADE;
  DROP TABLE "business_settings_locales" CASCADE;
  DROP TABLE "business_settings_texts" CASCADE;
  DROP TABLE "investors_utilities" CASCADE;
  DROP TABLE "investors_utilities_locales" CASCADE;
  DROP TABLE "investors_allocation" CASCADE;
  DROP TABLE "investors_allocation_locales" CASCADE;
  DROP TABLE "investors_vesting" CASCADE;
  DROP TABLE "investors_vesting_locales" CASCADE;
  DROP TABLE "investors_whitepapers" CASCADE;
  DROP TABLE "investors_roadmap" CASCADE;
  DROP TABLE "investors_roadmap_locales" CASCADE;
  DROP TABLE "investors_audits" CASCADE;
  DROP TABLE "investors_audits_locales" CASCADE;
  DROP TABLE "investors_contracts" CASCADE;
  DROP TABLE "investors_wallets" CASCADE;
  DROP TABLE "investors_translation_status" CASCADE;
  DROP TABLE "investors" CASCADE;
  DROP TABLE "investors_locales" CASCADE;
  DROP TABLE "ui_labels_common_translation_status" CASCADE;
  DROP TABLE "ui_labels_common" CASCADE;
  DROP TABLE "ui_labels_common_locales" CASCADE;
  DROP TABLE "ui_labels_home_translation_status" CASCADE;
  DROP TABLE "ui_labels_home" CASCADE;
  DROP TABLE "ui_labels_home_locales" CASCADE;
  DROP TABLE "ui_labels_business_translation_status" CASCADE;
  DROP TABLE "ui_labels_business" CASCADE;
  DROP TABLE "ui_labels_business_locales" CASCADE;
  DROP TABLE "ui_labels_artist_translation_status" CASCADE;
  DROP TABLE "ui_labels_artist" CASCADE;
  DROP TABLE "ui_labels_artist_locales" CASCADE;
  DROP TABLE "ui_labels_campaign_translation_status" CASCADE;
  DROP TABLE "ui_labels_campaign" CASCADE;
  DROP TABLE "ui_labels_campaign_locales" CASCADE;
  DROP TABLE "ui_labels_contact_translation_status" CASCADE;
  DROP TABLE "ui_labels_contact" CASCADE;
  DROP TABLE "ui_labels_contact_locales" CASCADE;
  DROP TABLE "ui_labels_family_translation_status" CASCADE;
  DROP TABLE "ui_labels_family" CASCADE;
  DROP TABLE "ui_labels_family_locales" CASCADE;
  DROP TABLE "ui_labels_studio_translation_status" CASCADE;
  DROP TABLE "ui_labels_studio" CASCADE;
  DROP TABLE "ui_labels_studio_locales" CASCADE;
  DROP TABLE "ui_labels_investors_translation_status" CASCADE;
  DROP TABLE "ui_labels_investors" CASCADE;
  DROP TABLE "ui_labels_investors_locales" CASCADE;
  DROP TABLE "ui_labels_trust_translation_status" CASCADE;
  DROP TABLE "ui_labels_trust" CASCADE;
  DROP TABLE "ui_labels_trust_locales" CASCADE;
  DROP TABLE "ui_labels_join_translation_status" CASCADE;
  DROP TABLE "ui_labels_join" CASCADE;
  DROP TABLE "ui_labels_join_locales" CASCADE;
  DROP TABLE "ui_labels_cookie_translation_status" CASCADE;
  DROP TABLE "ui_labels_cookie" CASCADE;
  DROP TABLE "ui_labels_cookie_locales" CASCADE;
  DROP TABLE "ui_labels_news_translation_status" CASCADE;
  DROP TABLE "ui_labels_news" CASCADE;
  DROP TABLE "ui_labels_news_locales" CASCADE;
  DROP TABLE "ui_labels_forms_translation_status" CASCADE;
  DROP TABLE "ui_labels_forms" CASCADE;
  DROP TABLE "ui_labels_forms_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_home_slides_translation_status_locale";
  DROP TYPE "public"."enum_home_slides_translation_status_status";
  DROP TYPE "public"."enum_home_slides_video_source";
  DROP TYPE "public"."enum_artist_categories_translation_status_locale";
  DROP TYPE "public"."enum_artist_categories_translation_status_status";
  DROP TYPE "public"."enum_artists_socials_platform";
  DROP TYPE "public"."enum_artists_translation_status_locale";
  DROP TYPE "public"."enum_artists_translation_status_status";
  DROP TYPE "public"."enum_artists_status";
  DROP TYPE "public"."enum__artists_v_version_socials_platform";
  DROP TYPE "public"."enum__artists_v_version_translation_status_locale";
  DROP TYPE "public"."enum__artists_v_version_translation_status_status";
  DROP TYPE "public"."enum__artists_v_version_status";
  DROP TYPE "public"."enum__artists_v_published_locale";
  DROP TYPE "public"."enum_boards_translation_status_locale";
  DROP TYPE "public"."enum_boards_translation_status_status";
  DROP TYPE "public"."enum_post_categories_translation_status_locale";
  DROP TYPE "public"."enum_post_categories_translation_status_status";
  DROP TYPE "public"."enum_posts_translation_status_locale";
  DROP TYPE "public"."enum_posts_translation_status_status";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_translation_status_locale";
  DROP TYPE "public"."enum__posts_v_version_translation_status_status";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum__posts_v_published_locale";
  DROP TYPE "public"."enum_case_studies_translation_status_locale";
  DROP TYPE "public"."enum_case_studies_translation_status_status";
  DROP TYPE "public"."enum_case_studies_status";
  DROP TYPE "public"."enum__case_studies_v_version_translation_status_locale";
  DROP TYPE "public"."enum__case_studies_v_version_translation_status_status";
  DROP TYPE "public"."enum__case_studies_v_version_status";
  DROP TYPE "public"."enum__case_studies_v_published_locale";
  DROP TYPE "public"."enum_pages_translation_status_locale";
  DROP TYPE "public"."enum_pages_translation_status_status";
  DROP TYPE "public"."enum_pages_section";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_translation_status_locale";
  DROP TYPE "public"."enum__pages_v_version_translation_status_status";
  DROP TYPE "public"."enum__pages_v_version_section";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum_family_translation_status_locale";
  DROP TYPE "public"."enum_family_translation_status_status";
  DROP TYPE "public"."enum_family_kind";
  DROP TYPE "public"."enum_studio_items_translation_status_locale";
  DROP TYPE "public"."enum_studio_items_translation_status_status";
  DROP TYPE "public"."enum_studio_items_kind";
  DROP TYPE "public"."enum_openings_translation_status_locale";
  DROP TYPE "public"."enum_openings_translation_status_status";
  DROP TYPE "public"."enum_openings_kind";
  DROP TYPE "public"."enum_openings_status";
  DROP TYPE "public"."enum_disclosures_translation_status_locale";
  DROP TYPE "public"."enum_disclosures_translation_status_status";
  DROP TYPE "public"."enum_disclosures_category";
  DROP TYPE "public"."enum_disclosures_status";
  DROP TYPE "public"."enum__disclosures_v_version_translation_status_locale";
  DROP TYPE "public"."enum__disclosures_v_version_translation_status_status";
  DROP TYPE "public"."enum__disclosures_v_version_category";
  DROP TYPE "public"."enum__disclosures_v_version_status";
  DROP TYPE "public"."enum__disclosures_v_published_locale";
  DROP TYPE "public"."enum_quote_requests_usage";
  DROP TYPE "public"."enum_quote_requests_regions";
  DROP TYPE "public"."enum_quote_requests_languages";
  DROP TYPE "public"."enum_quote_requests_submitted_locale";
  DROP TYPE "public"."enum_quote_requests_status";
  DROP TYPE "public"."enum_inquiries_type";
  DROP TYPE "public"."enum_inquiries_submitted_locale";
  DROP TYPE "public"."enum_inquiries_status";
  DROP TYPE "public"."enum_media_translation_status_locale";
  DROP TYPE "public"."enum_media_translation_status_status";
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  DROP TYPE "public"."enum_payload_folders_folder_type";
  DROP TYPE "public"."enum_site_settings_enabled_locales";
  DROP TYPE "public"."enum_site_settings_socials_platform";
  DROP TYPE "public"."enum_site_settings_translation_status_locale";
  DROP TYPE "public"."enum_site_settings_translation_status_status";
  DROP TYPE "public"."enum_navigation_translation_status_locale";
  DROP TYPE "public"."enum_navigation_translation_status_status";
  DROP TYPE "public"."enum_home_settings_sections_section";
  DROP TYPE "public"."enum_business_settings_translation_status_locale";
  DROP TYPE "public"."enum_business_settings_translation_status_status";
  DROP TYPE "public"."enum_investors_whitepapers_language";
  DROP TYPE "public"."enum_investors_roadmap_status";
  DROP TYPE "public"."enum_investors_translation_status_locale";
  DROP TYPE "public"."enum_investors_translation_status_status";
  DROP TYPE "public"."enum_ui_labels_common_translation_status_locale";
  DROP TYPE "public"."enum_ui_labels_common_translation_status_status";
  DROP TYPE "public"."enum_ui_labels_home_translation_status_locale";
  DROP TYPE "public"."enum_ui_labels_home_translation_status_status";
  DROP TYPE "public"."enum_ui_labels_business_translation_status_locale";
  DROP TYPE "public"."enum_ui_labels_business_translation_status_status";
  DROP TYPE "public"."enum_ui_labels_artist_translation_status_locale";
  DROP TYPE "public"."enum_ui_labels_artist_translation_status_status";
  DROP TYPE "public"."enum_ui_labels_campaign_translation_status_locale";
  DROP TYPE "public"."enum_ui_labels_campaign_translation_status_status";
  DROP TYPE "public"."enum_ui_labels_contact_translation_status_locale";
  DROP TYPE "public"."enum_ui_labels_contact_translation_status_status";
  DROP TYPE "public"."enum_ui_labels_family_translation_status_locale";
  DROP TYPE "public"."enum_ui_labels_family_translation_status_status";
  DROP TYPE "public"."enum_ui_labels_studio_translation_status_locale";
  DROP TYPE "public"."enum_ui_labels_studio_translation_status_status";
  DROP TYPE "public"."enum_ui_labels_investors_translation_status_locale";
  DROP TYPE "public"."enum_ui_labels_investors_translation_status_status";
  DROP TYPE "public"."enum_ui_labels_trust_translation_status_locale";
  DROP TYPE "public"."enum_ui_labels_trust_translation_status_status";
  DROP TYPE "public"."enum_ui_labels_join_translation_status_locale";
  DROP TYPE "public"."enum_ui_labels_join_translation_status_status";
  DROP TYPE "public"."enum_ui_labels_cookie_translation_status_locale";
  DROP TYPE "public"."enum_ui_labels_cookie_translation_status_status";
  DROP TYPE "public"."enum_ui_labels_news_translation_status_locale";
  DROP TYPE "public"."enum_ui_labels_news_translation_status_status";
  DROP TYPE "public"."enum_ui_labels_forms_translation_status_locale";
  DROP TYPE "public"."enum_ui_labels_forms_translation_status_status";`)
}
