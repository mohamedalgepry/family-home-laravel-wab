-- ============================================================================
-- Family Home Platform – Full Database Schema
-- Generated from Laravel migrations on 2026-07-21
-- Engine: MySQL 8+  |  Charset: utf8mb4  |  Collation: utf8mb4_unicode_ci
-- ============================================================================

-- --------------------------------------------------------------------------
-- 1. users, password_reset_tokens, sessions
-- --------------------------------------------------------------------------
DROP TABLE IF EXISTS `sessions`;
DROP TABLE IF EXISTS `password_reset_tokens`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
    `id`                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name`              VARCHAR(255)    NOT NULL,
    `email`             VARCHAR(255)    NOT NULL,
    `email_verified_at` TIMESTAMP       NULL DEFAULT NULL,
    `password`          VARCHAR(255)    NOT NULL,
    `remember_token`    VARCHAR(100)    NULL DEFAULT NULL,
    `role`              VARCHAR(15)     NOT NULL DEFAULT 'agent',
    `manager_id`        BIGINT UNSIGNED NULL DEFAULT NULL,
    `points_balance`    INT             NULL DEFAULT NULL,
    `initial_monthly_balance` INT       NULL DEFAULT NULL,
    `is_active`         TINYINT(1)      NOT NULL DEFAULT 1,
    `created_at`        TIMESTAMP       NULL DEFAULT NULL,
    `updated_at`        TIMESTAMP       NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `users_email_unique` (`email`),
    KEY `users_role_index` (`role`),
    KEY `users_manager_id_index` (`manager_id`),
    KEY `users_is_active_index` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `users`
    ADD CONSTRAINT `users_manager_id_foreign`
    FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`)
    ON DELETE SET NULL;

CREATE TABLE `agent_profiles` (
    `id`                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id`           BIGINT UNSIGNED NOT NULL,
    `avatar`            VARCHAR(255)    NULL DEFAULT NULL,
    `phone`             VARCHAR(20)     NULL DEFAULT NULL,
    `whatsapp`          VARCHAR(20)     NULL DEFAULT NULL,
    `facebook`          VARCHAR(255)    NULL DEFAULT NULL,
    `created_at`        TIMESTAMP       NULL DEFAULT NULL,
    `updated_at`        TIMESTAMP       NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `agent_profiles_user_id_index` (`user_id`),
    CONSTRAINT `agent_profiles_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `password_reset_tokens` (
    `email`      VARCHAR(255) NOT NULL,
    `token`      VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP    NULL DEFAULT NULL,
    PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `sessions` (
    `id`            VARCHAR(255)    NOT NULL,
    `user_id`       BIGINT UNSIGNED NULL DEFAULT NULL,
    `ip_address`    VARCHAR(45)     NULL DEFAULT NULL,
    `user_agent`    TEXT            NULL DEFAULT NULL,
    `payload`       LONGTEXT        NOT NULL,
    `last_activity` INT             NOT NULL,
    PRIMARY KEY (`id`),
    KEY `sessions_user_id_index` (`user_id`),
    KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
-- 2. cache, cache_locks
-- --------------------------------------------------------------------------
DROP TABLE IF EXISTS `cache_locks`;
DROP TABLE IF EXISTS `cache`;

CREATE TABLE `cache` (
    `key`        VARCHAR(255) NOT NULL,
    `value`      MEDIUMTEXT   NOT NULL,
    `expiration` BIGINT       NOT NULL,
    PRIMARY KEY (`key`),
    KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cache_locks` (
    `key`        VARCHAR(255) NOT NULL,
    `owner`      VARCHAR(255) NOT NULL,
    `expiration` BIGINT       NOT NULL,
    PRIMARY KEY (`key`),
    KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
-- 3. jobs, job_batches, failed_jobs
-- --------------------------------------------------------------------------
DROP TABLE IF EXISTS `failed_jobs`;
DROP TABLE IF EXISTS `job_batches`;
DROP TABLE IF EXISTS `jobs`;

CREATE TABLE `jobs` (
    `id`           BIGINT UNSIGNED    NOT NULL AUTO_INCREMENT,
    `queue`        VARCHAR(255)       NOT NULL,
    `payload`      LONGTEXT           NOT NULL,
    `attempts`     TINYINT UNSIGNED   NOT NULL,
    `reserved_at`  INT UNSIGNED       NULL DEFAULT NULL,
    `available_at` INT UNSIGNED       NOT NULL,
    `created_at`   INT UNSIGNED       NOT NULL,
    PRIMARY KEY (`id`),
    KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `job_batches` (
    `id`              VARCHAR(255) NOT NULL,
    `name`            VARCHAR(255) NOT NULL,
    `total_jobs`      INT          NOT NULL,
    `pending_jobs`    INT          NOT NULL,
    `failed_jobs`     INT          NOT NULL,
    `failed_job_ids`  LONGTEXT     NOT NULL,
    `options`         MEDIUMTEXT   NULL DEFAULT NULL,
    `cancelled_at`    INT          NULL DEFAULT NULL,
    `created_at`      INT          NOT NULL,
    `finished_at`     INT          NULL DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `failed_jobs` (
    `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `uuid`       VARCHAR(255)    NOT NULL,
    `connection` TEXT            NOT NULL,
    `queue`      VARCHAR(255)    NOT NULL,
    `payload`    LONGTEXT        NOT NULL,
    `exception`  LONGTEXT        NOT NULL,
    `failed_at`  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
    KEY `failed_jobs_connection_queue_failed_at_index` (`connection`(100), `queue`(100), `failed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
-- 4. notifications
-- --------------------------------------------------------------------------
DROP TABLE IF EXISTS `notifications`;

CREATE TABLE `notifications` (
    `id`              CHAR(36)     NOT NULL,
    `type`            VARCHAR(255) NOT NULL,
    `notifiable_type` VARCHAR(255) NOT NULL,
    `notifiable_id`   BIGINT UNSIGNED NOT NULL,
    `data`            TEXT         NOT NULL,
    `read_at`         TIMESTAMP    NULL DEFAULT NULL,
    `created_at`      TIMESTAMP    NULL DEFAULT NULL,
    `updated_at`      TIMESTAMP    NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `notifications_notifiable_type_notifiable_id_index` (`notifiable_type`, `notifiable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
-- 5. permissions (Spatie)
-- --------------------------------------------------------------------------
DROP TABLE IF EXISTS `role_has_permissions`;
DROP TABLE IF EXISTS `model_has_roles`;
DROP TABLE IF EXISTS `model_has_permissions`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `permissions`;

CREATE TABLE `permissions` (
    `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name`       VARCHAR(255)    NOT NULL,
    `guard_name` VARCHAR(255)    NOT NULL,
    `created_at` TIMESTAMP       NULL DEFAULT NULL,
    `updated_at` TIMESTAMP       NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `permissions_name_guard_name_unique` (`name`, `guard_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `roles` (
    `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name`       VARCHAR(255)    NOT NULL,
    `guard_name` VARCHAR(255)    NOT NULL,
    `created_at` TIMESTAMP       NULL DEFAULT NULL,
    `updated_at` TIMESTAMP       NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `roles_name_guard_name_unique` (`name`, `guard_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `model_has_permissions` (
    `permission_id` BIGINT UNSIGNED NOT NULL,
    `model_type`    VARCHAR(255)    NOT NULL,
    `model_id`      BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (`permission_id`, `model_id`, `model_type`),
    KEY `model_has_permissions_model_id_model_type_index` (`model_id`, `model_type`),
    CONSTRAINT `model_has_permissions_permission_id_foreign`
        FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `model_has_roles` (
    `role_id`    BIGINT UNSIGNED NOT NULL,
    `model_type` VARCHAR(255)    NOT NULL,
    `model_id`   BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (`role_id`, `model_id`, `model_type`),
    KEY `model_has_roles_model_id_model_type_index` (`model_id`, `model_type`),
    CONSTRAINT `model_has_roles_role_id_foreign`
        FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `role_has_permissions` (
    `permission_id` BIGINT UNSIGNED NOT NULL,
    `role_id`       BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (`permission_id`, `role_id`),
    CONSTRAINT `role_has_permissions_permission_id_foreign`
        FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`)
        ON DELETE CASCADE,
    CONSTRAINT `role_has_permissions_role_id_foreign`
        FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
-- 6. areas
-- --------------------------------------------------------------------------
DROP TABLE IF EXISTS `areas`;

CREATE TABLE `areas` (
    `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name_ar`    VARCHAR(100)    NOT NULL,
    `name_en`    VARCHAR(100)    NOT NULL,
    `slug`       VARCHAR(100)    NOT NULL,
    `created_at` TIMESTAMP       NULL DEFAULT NULL,
    `updated_at` TIMESTAMP       NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `areas_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `areas` (`name_ar`, `name_en`, `slug`) VALUES
    ('مدينة نصر',           'Nasr City',                  'nasr-city'),
    ('الشيخ زايد',          'Sheikh Zayed',               'sheikh-zayed'),
    ('التجمع الخامس',       'New Cairo',                  'new-cairo'),
    ('المهندسين',           'Mohandessin',                'mohandessin'),
    ('الاسكندرية',          'Alexandria',                 'alexandria'),
    ('العاصمة الإدارية',    'New Administrative Capital', 'new-administrative-capital'),
    ('المعادي',             'Maadi',                      'maadi'),
    ('6 أكتوبر',            '6th October',                '6th-october'),
    ('الرحاب',              'Rehab',                      'rehab'),
    ('العين السخنة',        'Ain Sokhna',                 'ain-sokhna');

-- --------------------------------------------------------------------------
-- 7. unit_types
-- --------------------------------------------------------------------------
DROP TABLE IF EXISTS `unit_types`;

CREATE TABLE `unit_types` (
    `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name_ar`    VARCHAR(100)    NOT NULL,
    `name_en`    VARCHAR(100)    NOT NULL,
    `slug`       VARCHAR(100)    NOT NULL,
    `created_at` TIMESTAMP       NULL DEFAULT NULL,
    `updated_at` TIMESTAMP       NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unit_types_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `unit_types` (`name_ar`, `name_en`, `slug`) VALUES
    ('سكني',       'Residential',      'residential'),
    ('إداري',      'Administrative',   'administrative'),
    ('طبي',        'Medical',          'medical'),
    ('أرض خالية',  'Vacant Land',      'vacant-land'),
    ('مبنى كامل',  'Full Building',    'full-building');

-- --------------------------------------------------------------------------
-- 8. categories
-- --------------------------------------------------------------------------
DROP TABLE IF EXISTS `categories`;

CREATE TABLE `categories` (
    `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name_ar`    VARCHAR(100)    NOT NULL,
    `name_en`    VARCHAR(100)    NOT NULL,
    `slug`       VARCHAR(100)    NOT NULL,
    `created_at` TIMESTAMP       NULL DEFAULT NULL,
    `updated_at` TIMESTAMP       NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `categories_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
-- 9. projects
-- --------------------------------------------------------------------------
DROP TABLE IF EXISTS `projects`;

CREATE TABLE `projects` (
    `id`                BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
    `user_id`           BIGINT UNSIGNED  NOT NULL,
    `area_id`           BIGINT UNSIGNED  NULL DEFAULT NULL,
    `name`              VARCHAR(255)     NOT NULL,
    `slug`              VARCHAR(190)     NOT NULL,
    `description`       TEXT             NULL DEFAULT NULL,
    `alt_text`          VARCHAR(255)     NULL DEFAULT NULL,
    `video_url`         VARCHAR(500)     NULL DEFAULT NULL,
    `location_lat`      DECIMAL(10, 7)   NULL DEFAULT NULL,
    `location_lng`      DECIMAL(10, 7)   NULL DEFAULT NULL,
    `location_address`  VARCHAR(500)     NULL DEFAULT NULL,
    `keywords`          JSON             NULL DEFAULT NULL,
    `meta_description`  VARCHAR(500)     NULL DEFAULT NULL,
    `is_active`         TINYINT(1)       NOT NULL DEFAULT 1,
    `views_count`       INT              NOT NULL DEFAULT 0,
    `created_at`        TIMESTAMP        NULL DEFAULT NULL,
    `updated_at`        TIMESTAMP        NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `projects_slug_unique` (`slug`),
    KEY `projects_user_id_index` (`user_id`),
    KEY `projects_area_id_index` (`area_id`),
    KEY `projects_is_active_index` (`is_active`),
    KEY `projects_views_count_index` (`views_count`),
    CONSTRAINT `projects_user_id_foreign`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
        ON DELETE CASCADE,
    CONSTRAINT `projects_area_id_foreign`
        FOREIGN KEY (`area_id`) REFERENCES `areas` (`id`)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
-- 10. project_images
-- --------------------------------------------------------------------------
DROP TABLE IF EXISTS `project_images`;

CREATE TABLE `project_images` (
    `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `project_id` BIGINT UNSIGNED NOT NULL,
    `path`       VARCHAR(500)    NOT NULL,
    `alt_text`   VARCHAR(255)    NULL DEFAULT NULL,
    `sort_order` INT             NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP       NULL DEFAULT NULL,
    `updated_at` TIMESTAMP       NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `project_images_project_id_index` (`project_id`),
    KEY `project_images_sort_order_index` (`sort_order`),
    CONSTRAINT `project_images_project_id_foreign`
        FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
-- 11. units
-- --------------------------------------------------------------------------
DROP TABLE IF EXISTS `units`;

CREATE TABLE `units` (
    `id`                  BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
    `project_id`          BIGINT UNSIGNED  NULL DEFAULT NULL,
    `user_id`             BIGINT UNSIGNED  NOT NULL,
    `name`                VARCHAR(255)     NOT NULL,
    `slug`                VARCHAR(190)     NOT NULL,
    `description`         TEXT             NULL DEFAULT NULL,
    `type_id`             BIGINT UNSIGNED  NOT NULL,
    `area_id`             BIGINT UNSIGNED  NOT NULL,
    `transaction`         VARCHAR(10)      NOT NULL,
    `price`               DECIMAL(15, 2)   NOT NULL,
    `area_sqm`            DECIMAL(10, 2)   NULL DEFAULT NULL,
    `rooms`               INT              NULL DEFAULT NULL,
    `bathrooms`           INT              NULL DEFAULT NULL,
    `floor`               INT              NULL DEFAULT NULL,
    `alt_text`            VARCHAR(255)     NULL DEFAULT NULL,
    `video_url`           VARCHAR(500)     NULL DEFAULT NULL,
    `video_path`          VARCHAR(500)     NULL DEFAULT NULL,
    `location_lat`        DECIMAL(10, 7)   NULL DEFAULT NULL,
    `location_lng`        DECIMAL(10, 7)   NULL DEFAULT NULL,
    `location_address`    VARCHAR(500)     NULL DEFAULT NULL,
    `keywords`            JSON             NULL DEFAULT NULL,
    `meta_description`    VARCHAR(500)     NULL DEFAULT NULL,
    `priority_points`     INT              NOT NULL DEFAULT 0,
    `is_pinned`           TINYINT(1)       NOT NULL DEFAULT 0,
    `is_deal`             TINYINT(1)       NOT NULL DEFAULT 0,
    `is_active`           TINYINT(1)       NOT NULL DEFAULT 1,
    `views_count`         INT              NOT NULL DEFAULT 0,
    `auto_delete_at`      TIMESTAMP        NULL DEFAULT NULL,
    `created_at`          TIMESTAMP        NULL DEFAULT NULL,
    `updated_at`          TIMESTAMP        NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `units_slug_unique` (`slug`),
    KEY `units_project_id_index` (`project_id`),
    KEY `units_user_id_index` (`user_id`),
    KEY `units_type_id_index` (`type_id`),
    KEY `units_area_id_index` (`area_id`),
    KEY `units_transaction_index` (`transaction`),
    KEY `units_price_index` (`price`),
    KEY `units_priority_points_is_pinned_index` (`priority_points`, `is_pinned`),
    KEY `units_is_pinned_index` (`is_pinned`),
    KEY `units_is_deal_index` (`is_deal`),
    KEY `units_is_active_index` (`is_active`),
    KEY `units_created_at_id_index` (`created_at`, `id`),
    CONSTRAINT `units_project_id_foreign`
        FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
        ON DELETE SET NULL,
    CONSTRAINT `units_user_id_foreign`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
        ON DELETE CASCADE,
    CONSTRAINT `units_type_id_foreign`
        FOREIGN KEY (`type_id`) REFERENCES `unit_types` (`id`)
        ON DELETE CASCADE,
    CONSTRAINT `units_area_id_foreign`
        FOREIGN KEY (`area_id`) REFERENCES `areas` (`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
-- 12. unit_images
-- --------------------------------------------------------------------------
DROP TABLE IF EXISTS `unit_images`;

CREATE TABLE `unit_images` (
    `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `unit_id`    BIGINT UNSIGNED NOT NULL,
    `path`       VARCHAR(500)    NOT NULL,
    `alt_text`   VARCHAR(255)    NULL DEFAULT NULL,
    `sort_order` INT             NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP       NULL DEFAULT NULL,
    `updated_at` TIMESTAMP       NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `unit_images_unit_id_index` (`unit_id`),
    KEY `unit_images_sort_order_index` (`sort_order`),
    CONSTRAINT `unit_images_unit_id_foreign`
        FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
-- 13. articles
-- --------------------------------------------------------------------------
DROP TABLE IF EXISTS `articles`;

CREATE TABLE `articles` (
    `id`               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `category_id`      BIGINT UNSIGNED NOT NULL,
    `title`            VARCHAR(500)    NOT NULL,
    `slug`             VARCHAR(190)    NOT NULL,
    `content`          LONGTEXT        NOT NULL,
    `excerpt`          TEXT            NULL DEFAULT NULL,
    `alt_text`         VARCHAR(255)    NULL DEFAULT NULL,
    `keywords`         JSON            NULL DEFAULT NULL,
    `meta_description` VARCHAR(500)    NULL DEFAULT NULL,
    `is_published`     TINYINT(1)      NOT NULL DEFAULT 0,
    `published_at`     TIMESTAMP       NULL DEFAULT NULL,
    `views_count`      INT             NOT NULL DEFAULT 0,
    `created_at`       TIMESTAMP       NULL DEFAULT NULL,
    `updated_at`       TIMESTAMP       NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `articles_slug_unique` (`slug`),
    KEY `articles_category_id_index` (`category_id`),
    KEY `articles_is_published_index` (`is_published`),
    KEY `articles_published_at_id_index` (`published_at`, `id`),
    CONSTRAINT `articles_category_id_foreign`
        FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
-- 14. article_images
-- --------------------------------------------------------------------------
DROP TABLE IF EXISTS `article_images`;

CREATE TABLE `article_images` (
    `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `article_id` BIGINT UNSIGNED NOT NULL,
    `path`       VARCHAR(500)    NOT NULL,
    `alt_text`   VARCHAR(255)    NULL DEFAULT NULL,
    `position`   VARCHAR(10)     NOT NULL DEFAULT 'inside',
    `size`       VARCHAR(10)     NOT NULL DEFAULT 'medium',
    `sort_order` INT             NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP       NULL DEFAULT NULL,
    `updated_at` TIMESTAMP       NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `article_images_article_id_index` (`article_id`),
    KEY `article_images_sort_order_index` (`sort_order`),
    CONSTRAINT `article_images_article_id_foreign`
        FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
-- 15. messages
-- --------------------------------------------------------------------------
DROP TABLE IF EXISTS `messages`;

CREATE TABLE `messages` (
    `id`           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `unit_id`      BIGINT UNSIGNED NOT NULL,
    `agent_id`     BIGINT UNSIGNED NOT NULL,
    `client_name`  VARCHAR(255)    NOT NULL,
    `client_phone` VARCHAR(20)     NULL DEFAULT NULL,
    `client_email` VARCHAR(255)    NULL DEFAULT NULL,
    `content`      TEXT            NOT NULL,
    `status`       VARCHAR(10)     NOT NULL DEFAULT 'pending',
    `replied_at`   TIMESTAMP       NULL DEFAULT NULL,
    `created_at`   TIMESTAMP       NULL DEFAULT NULL,
    `updated_at`   TIMESTAMP       NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `messages_unit_id_index` (`unit_id`),
    KEY `messages_agent_id_index` (`agent_id`),
    KEY `messages_status_index` (`status`),
    KEY `messages_created_at_id_index` (`created_at`, `id`),
    CONSTRAINT `messages_unit_id_foreign`
        FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`)
        ON DELETE CASCADE,
    CONSTRAINT `messages_agent_id_foreign`
        FOREIGN KEY (`agent_id`) REFERENCES `users` (`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
-- 16. points_transactions
-- --------------------------------------------------------------------------
DROP TABLE IF EXISTS `points_transactions`;

CREATE TABLE `points_transactions` (
    `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `manager_id`    BIGINT UNSIGNED NOT NULL,
    `unit_id`       BIGINT UNSIGNED NULL DEFAULT NULL,
    `points`        INT             NOT NULL,
    `type`          VARCHAR(20)     NOT NULL,
    `balance_after` INT             NOT NULL,
    `notes`         TEXT            NULL DEFAULT NULL,
    `performed_by`  BIGINT UNSIGNED NOT NULL,
    `created_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `points_transactions_manager_id_index` (`manager_id`),
    KEY `points_transactions_unit_id_index` (`unit_id`),
    KEY `points_transactions_type_index` (`type`),
    KEY `points_transactions_created_at_index` (`created_at`),
    CONSTRAINT `points_transactions_manager_id_foreign`
        FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`)
        ON DELETE CASCADE,
    CONSTRAINT `points_transactions_unit_id_foreign`
        FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`)
        ON DELETE SET NULL,
    CONSTRAINT `points_transactions_performed_by_foreign`
        FOREIGN KEY (`performed_by`) REFERENCES `users` (`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
-- 17. settings
-- --------------------------------------------------------------------------
DROP TABLE IF EXISTS `settings`;

CREATE TABLE `settings` (
    `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `key`        VARCHAR(100)    NOT NULL,
    `value`      TEXT            NULL DEFAULT NULL,
    `updated_at` TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `settings_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `settings` (`key`, `value`) VALUES
    ('daily_deduction_enabled', 'true'),
    ('daily_deduction_value',   '10'),
    ('monthly_reset_day',       '1'),
    ('monthly_reset_auto',      'false'),
    ('auto_delete_days',        '30'),
    ('max_video_size_mb',       '100'),
    ('site_logo',               NULL),
    ('company_phone',           NULL),
    ('company_email',           NULL),
    ('company_address',         NULL),
    ('social_facebook',         NULL),
    ('social_instagram',        NULL),
    ('social_twitter',          NULL);

-- --------------------------------------------------------------------------
-- 18. about_page
-- --------------------------------------------------------------------------
DROP TABLE IF EXISTS `about_page`;

CREATE TABLE `about_page` (
    `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `content_ar` LONGTEXT        NULL DEFAULT NULL,
    `content_en` LONGTEXT        NULL DEFAULT NULL,
    `images`     JSON            NULL DEFAULT NULL,
    `updated_at` TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `about_page` (`content_ar`, `content_en`, `images`) VALUES
    (NULL, NULL, NULL);

-- --------------------------------------------------------------------------
-- 19. page_views
-- --------------------------------------------------------------------------
DROP TABLE IF EXISTS `page_views`;

CREATE TABLE `page_views` (
    `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `viewable_type` VARCHAR(80)     NOT NULL,
    `viewable_id`   BIGINT UNSIGNED NOT NULL,
    `ip_address`    VARCHAR(45)     NULL DEFAULT NULL,
    `user_agent`    VARCHAR(500)    NULL DEFAULT NULL,
    `visited_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `page_views_viewable_type_viewable_id_index` (`viewable_type`, `viewable_id`),
    KEY `page_views_visited_at_index` (`visited_at`),
    KEY `page_views_dedup_idx` (`viewable_type`, `viewable_id`, `ip_address`, `visited_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
-- 20. popular_searches
-- --------------------------------------------------------------------------
DROP TABLE IF EXISTS `popular_searches`;

CREATE TABLE `popular_searches` (
    `id`               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `keyword`          VARCHAR(190)    NOT NULL,
    `search_count`     INT             NOT NULL DEFAULT 1,
    `last_searched_at` TIMESTAMP       NULL DEFAULT NULL,
    `created_at`       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `popular_searches_keyword_unique` (`keyword`),
    KEY `popular_searches_search_count_last_searched_at_index` (`search_count`, `last_searched_at`),
    KEY `popular_searches_last_searched_at_index` (`last_searched_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
-- 21. activity_log
-- --------------------------------------------------------------------------
DROP TABLE IF EXISTS `activity_log`;

CREATE TABLE `activity_log` (
    `id`                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `log_name`           VARCHAR(255)    NULL DEFAULT NULL,
    `description`        TEXT            NOT NULL,
    `subject_type`       VARCHAR(255)    NULL DEFAULT NULL,
    `subject_id`         BIGINT UNSIGNED NULL DEFAULT NULL,
    `event`              VARCHAR(255)    NULL DEFAULT NULL,
    `causer_type`        VARCHAR(255)    NULL DEFAULT NULL,
    `causer_id`          BIGINT UNSIGNED NULL DEFAULT NULL,
    `attribute_changes`  JSON            NULL DEFAULT NULL,
    `properties`         JSON            NULL DEFAULT NULL,
    `created_at`         TIMESTAMP       NULL DEFAULT NULL,
    `updated_at`         TIMESTAMP       NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `activity_log_log_name_index` (`log_name`),
    KEY `subject` (`subject_type`, `subject_id`),
    KEY `causer` (`causer_type`, `causer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
