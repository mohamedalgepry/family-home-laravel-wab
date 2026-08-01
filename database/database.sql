-- ============================================================
-- Family Home Platform — Full Database Schema (MySQL 8+)
-- Generated from 41 migrations (26 July 2026)
-- ============================================================

-- -----------------------------------------------------------
-- 1. users + password_reset_tokens + sessions
-- -----------------------------------------------------------
CREATE TABLE `users` (
    `id`                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name`                  VARCHAR(255) NOT NULL,
    `email`                 VARCHAR(255) NOT NULL UNIQUE,
    `email_verified_at`     TIMESTAMP NULL,
    `password`              VARCHAR(255) NOT NULL,
    `remember_token`        VARCHAR(100) NULL,
    `role`                  VARCHAR(15) NOT NULL DEFAULT 'agent',
    `manager_id`            BIGINT UNSIGNED NULL,
    `points_balance`        INT NULL,
    `initial_monthly_balance` INT NULL,
    `is_active`             TINYINT(1) NOT NULL DEFAULT 1,
    `created_at`            TIMESTAMP NULL,
    `updated_at`            TIMESTAMP NULL,
    INDEX `users_role_index` (`role`),
    INDEX `users_manager_id_index` (`manager_id`),
    INDEX `users_is_active_index` (`is_active`),
    CONSTRAINT `users_manager_id_foreign` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `password_reset_tokens` (
    `email`      VARCHAR(255) PRIMARY KEY,
    `token`      VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `sessions` (
    `id`            VARCHAR(255) PRIMARY KEY,
    `user_id`       BIGINT UNSIGNED NULL,
    `ip_address`    VARCHAR(45) NULL,
    `user_agent`    TEXT NULL,
    `payload`       LONGTEXT NOT NULL,
    `last_activity` INT NOT NULL,
    INDEX `sessions_user_id_index` (`user_id`),
    INDEX `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- 2. cache + cache_locks
-- -----------------------------------------------------------
CREATE TABLE `cache` (
    `key`        VARCHAR(255) PRIMARY KEY,
    `value`      MEDIUMTEXT NOT NULL,
    `expiration` BIGINT NOT NULL,
    INDEX `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cache_locks` (
    `key`        VARCHAR(255) PRIMARY KEY,
    `owner`      VARCHAR(255) NOT NULL,
    `expiration` BIGINT NOT NULL,
    INDEX `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- 3. jobs + job_batches + failed_jobs
-- -----------------------------------------------------------
CREATE TABLE `jobs` (
    `id`           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `queue`        VARCHAR(255) NOT NULL,
    `payload`      LONGTEXT NOT NULL,
    `attempts`     SMALLINT UNSIGNED NOT NULL,
    `reserved_at`  INT UNSIGNED NULL,
    `available_at` INT UNSIGNED NOT NULL,
    `created_at`   INT UNSIGNED NOT NULL,
    INDEX `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `job_batches` (
    `id`             VARCHAR(255) PRIMARY KEY,
    `name`           VARCHAR(255) NOT NULL,
    `total_jobs`     INT NOT NULL,
    `pending_jobs`   INT NOT NULL,
    `failed_jobs`    INT NOT NULL,
    `failed_job_ids` LONGTEXT NOT NULL,
    `options`        MEDIUMTEXT NULL,
    `cancelled_at`   INT NULL,
    `created_at`     INT NOT NULL,
    `finished_at`    INT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `failed_jobs` (
    `id`         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `uuid`       VARCHAR(255) NOT NULL UNIQUE,
    `connection` VARCHAR(255) NOT NULL,
    `queue`      VARCHAR(255) NOT NULL,
    `payload`    LONGTEXT NOT NULL,
    `exception`  LONGTEXT NOT NULL,
    `failed_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX `failed_jobs_connection_queue_failed_at_index` (`connection`, `queue`, `failed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- 4. areas
-- -----------------------------------------------------------
CREATE TABLE `areas` (
    `id`         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name_ar`    VARCHAR(100) NOT NULL,
    `name_en`    VARCHAR(100) NOT NULL,
    `slug`       VARCHAR(100) NOT NULL UNIQUE,
    `is_active`  TINYINT(1) NOT NULL DEFAULT 1,
    `sort_order` INT NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- 5. unit_types
-- -----------------------------------------------------------
CREATE TABLE `unit_types` (
    `id`         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name_ar`    VARCHAR(100) NOT NULL,
    `name_en`    VARCHAR(100) NOT NULL,
    `slug`       VARCHAR(100) NOT NULL UNIQUE,
    `is_active`  TINYINT(1) NOT NULL DEFAULT 1,
    `sort_order` INT NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- 6. categories
-- -----------------------------------------------------------
CREATE TABLE `categories` (
    `id`         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name_ar`    VARCHAR(100) NOT NULL,
    `name_en`    VARCHAR(100) NOT NULL,
    `slug`       VARCHAR(100) NOT NULL UNIQUE,
    `slug_ar`    VARCHAR(255) NULL UNIQUE,
    `slug_en`    VARCHAR(255) NULL UNIQUE,
    `created_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- 7. finishing_types
-- -----------------------------------------------------------
CREATE TABLE `finishing_types` (
    `id`         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name_ar`    VARCHAR(255) NOT NULL,
    `name_en`    VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- 8. features
-- -----------------------------------------------------------
CREATE TABLE `features` (
    `id`         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name_ar`    VARCHAR(255) NOT NULL,
    `name_en`    VARCHAR(255) NOT NULL,
    `icon`       VARCHAR(255) NULL,
    `created_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- 9. projects
-- -----------------------------------------------------------
CREATE TABLE `projects` (
    `id`                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id`             BIGINT UNSIGNED NOT NULL,
    `area_id`             BIGINT UNSIGNED NULL,
    `name`                VARCHAR(255) NOT NULL,
    `name_ar`             VARCHAR(255) NULL,
    `name_en`             VARCHAR(255) NULL,
    `slug`                VARCHAR(190) NOT NULL UNIQUE,
    `slug_ar`             VARCHAR(255) NULL UNIQUE,
    `slug_en`             VARCHAR(255) NULL UNIQUE,
    `description`         TEXT NULL,
    `description_ar`      TEXT NULL,
    `description_en`      TEXT NULL,
    `payment_method`      ENUM('cash', 'installment', 'both') NULL,
    `down_payment`        VARCHAR(255) NULL,
    `installment_years`   INT NULL,
    `finishing_type_id`   BIGINT UNSIGNED NULL,
    `alt_text`            VARCHAR(255) NULL,
    `video_url`           VARCHAR(500) NULL,
    `map_embed_url`       TEXT NULL,
    `location_address_ar` VARCHAR(500) NULL,
    `location_address_en` VARCHAR(500) NULL,
    `meta_description_ar` VARCHAR(500) NULL,
    `meta_description_en` VARCHAR(500) NULL,
    `keywords_ar`         JSON NULL,
    `keywords_en`         JSON NULL,
    `is_active`           TINYINT(1) NOT NULL DEFAULT 1,
    `views_count`         INT NOT NULL DEFAULT 0,
    `created_at`          TIMESTAMP NULL,
    `updated_at`          TIMESTAMP NULL,
    INDEX `projects_user_id_index` (`user_id`),
    INDEX `projects_area_id_index` (`area_id`),
    INDEX `projects_is_active_index` (`is_active`),
    INDEX `projects_views_count_index` (`views_count`),
    INDEX `projects_payment_method_index` (`payment_method`),
    INDEX `projects_finishing_type_id_index` (`finishing_type_id`),
    CONSTRAINT `projects_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `projects_area_id_foreign` FOREIGN KEY (`area_id`) REFERENCES `areas` (`id`) ON DELETE SET NULL,
    CONSTRAINT `projects_finishing_type_id_foreign` FOREIGN KEY (`finishing_type_id`) REFERENCES `finishing_types` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- 10. feature_project (pivot)
-- -----------------------------------------------------------
CREATE TABLE `feature_project` (
    `project_id` BIGINT UNSIGNED NOT NULL,
    `feature_id` BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (`project_id`, `feature_id`),
    CONSTRAINT `feature_project_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
    CONSTRAINT `feature_project_feature_id_foreign` FOREIGN KEY (`feature_id`) REFERENCES `features` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- 11. project_images
-- -----------------------------------------------------------
CREATE TABLE `project_images` (
    `id`         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `project_id` BIGINT UNSIGNED NOT NULL,
    `path`       VARCHAR(500) NOT NULL,
    `alt_text`   VARCHAR(255) NULL,
    `sort_order` INT NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP NULL,
    INDEX `project_images_project_id_index` (`project_id`),
    INDEX `project_images_sort_order_index` (`sort_order`),
    CONSTRAINT `project_images_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- 12. units
-- -----------------------------------------------------------
CREATE TABLE `units` (
    `id`                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `project_id`          BIGINT UNSIGNED NULL,
    `user_id`             BIGINT UNSIGNED NOT NULL,
    `name`                VARCHAR(255) NOT NULL,
    `name_ar`             VARCHAR(255) NULL,
    `name_en`             VARCHAR(255) NULL,
    `slug`                VARCHAR(190) NOT NULL UNIQUE,
    `slug_ar`             VARCHAR(255) NULL UNIQUE,
    `slug_en`             VARCHAR(255) NULL UNIQUE,
    `description`         TEXT NULL,
    `description_ar`      TEXT NULL,
    `description_en`      TEXT NULL,
    `type_id`             BIGINT UNSIGNED NOT NULL,
    `area_id`             BIGINT UNSIGNED NOT NULL,
    `transaction`         VARCHAR(10) NOT NULL,
    `price`               DECIMAL(15,2) NOT NULL,
    `area_sqm`            DECIMAL(10,2) NULL,
    `rooms`               INT NULL,
    `bathrooms`           INT NULL,
    `floor`               INT NULL,
    `payment_method`      ENUM('cash', 'installment', 'both') NULL,
    `down_payment`        VARCHAR(255) NULL,
    `installment_years`   INT NULL,
    `finishing_type_id`   BIGINT UNSIGNED NULL,
    `alt_text`            VARCHAR(255) NULL,
    `video_url`           VARCHAR(500) NULL,
    `video_path`          VARCHAR(500) NULL,
    `map_embed_url`       TEXT NULL,
    `location_address_ar` VARCHAR(500) NULL,
    `location_address_en` VARCHAR(500) NULL,
    `meta_description_ar` VARCHAR(500) NULL,
    `meta_description_en` VARCHAR(500) NULL,
    `keywords_ar`         JSON NULL,
    `keywords_en`         JSON NULL,
    `priority_points`     INT NOT NULL DEFAULT 0,
    `is_pinned`           TINYINT(1) NOT NULL DEFAULT 0,
    `is_deal`             TINYINT(1) NOT NULL DEFAULT 0,
    `is_active`           TINYINT(1) NOT NULL DEFAULT 1,
    `views_count`         INT NOT NULL DEFAULT 0,
    `auto_delete_at`      TIMESTAMP NULL,
    `created_at`          TIMESTAMP NULL,
    `updated_at`          TIMESTAMP NULL,
    INDEX `units_project_id_index` (`project_id`),
    INDEX `units_user_id_index` (`user_id`),
    INDEX `units_type_id_index` (`type_id`),
    INDEX `units_area_id_index` (`area_id`),
    INDEX `units_transaction_index` (`transaction`),
    INDEX `units_price_index` (`price`),
    INDEX `units_priority_points_is_pinned_index` (`priority_points`, `is_pinned`),
    INDEX `units_is_deal_index` (`is_deal`),
    INDEX `units_is_active_index` (`is_active`),
    INDEX `units_is_pinned_index` (`is_pinned`),
    INDEX `units_created_at_id_index` (`created_at`, `id`),
    INDEX `units_payment_method_index` (`payment_method`),
    INDEX `units_finishing_type_id_index` (`finishing_type_id`),
    CONSTRAINT `units_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE SET NULL,
    CONSTRAINT `units_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `units_type_id_foreign` FOREIGN KEY (`type_id`) REFERENCES `unit_types` (`id`) ON DELETE CASCADE,
    CONSTRAINT `units_area_id_foreign` FOREIGN KEY (`area_id`) REFERENCES `areas` (`id`) ON DELETE CASCADE,
    CONSTRAINT `units_finishing_type_id_foreign` FOREIGN KEY (`finishing_type_id`) REFERENCES `finishing_types` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- 13. feature_unit (pivot)
-- -----------------------------------------------------------
CREATE TABLE `feature_unit` (
    `unit_id`    BIGINT UNSIGNED NOT NULL,
    `feature_id` BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (`unit_id`, `feature_id`),
    CONSTRAINT `feature_unit_unit_id_foreign` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE CASCADE,
    CONSTRAINT `feature_unit_feature_id_foreign` FOREIGN KEY (`feature_id`) REFERENCES `features` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- 14. unit_images
-- -----------------------------------------------------------
CREATE TABLE `unit_images` (
    `id`         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `unit_id`    BIGINT UNSIGNED NOT NULL,
    `path`       VARCHAR(500) NOT NULL,
    `alt_text`   VARCHAR(255) NULL,
    `sort_order` INT NOT NULL DEFAULT 0,
    `is_primary` TINYINT(1) NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP NULL,
    INDEX `unit_images_unit_id_index` (`unit_id`),
    INDEX `unit_images_sort_order_index` (`sort_order`),
    INDEX `unit_images_is_primary_index` (`is_primary`),
    CONSTRAINT `unit_images_unit_id_foreign` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- 15. articles
-- -----------------------------------------------------------
CREATE TABLE `articles` (
    `id`              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `category_id`     BIGINT UNSIGNED NOT NULL,
    `title`           VARCHAR(500) NOT NULL,
    `title_ar`        VARCHAR(500) NULL,
    `title_en`        VARCHAR(500) NULL,
    `slug`            VARCHAR(190) NOT NULL UNIQUE,
    `slug_ar`         VARCHAR(255) NULL UNIQUE,
    `slug_en`         VARCHAR(255) NULL UNIQUE,
    `content`         LONGTEXT NOT NULL,
    `content_ar`      LONGTEXT NULL,
    `content_en`      LONGTEXT NULL,
    `excerpt`         TEXT NULL,
    `excerpt_ar`      TEXT NULL,
    `excerpt_en`      TEXT NULL,
    `alt_text`        VARCHAR(255) NULL,
    `keywords`        TEXT NULL,
    `meta_description` VARCHAR(500) NULL,
    `is_published`    TINYINT(1) NOT NULL DEFAULT 0,
    `published_at`    TIMESTAMP NULL,
    `views_count`     INT NOT NULL DEFAULT 0,
    `created_at`      TIMESTAMP NULL,
    `updated_at`      TIMESTAMP NULL,
    INDEX `articles_category_id_index` (`category_id`),
    INDEX `articles_is_published_index` (`is_published`),
    INDEX `articles_published_at_id_index` (`published_at`, `id`),
    CONSTRAINT `articles_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- 16. article_images
-- -----------------------------------------------------------
CREATE TABLE `article_images` (
    `id`         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `article_id` BIGINT UNSIGNED NOT NULL,
    `path`       VARCHAR(500) NOT NULL,
    `alt_text`   VARCHAR(255) NULL,
    `position`   VARCHAR(10) NOT NULL DEFAULT 'inside',
    `size`       VARCHAR(10) NOT NULL DEFAULT 'medium',
    `sort_order` INT NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP NULL,
    INDEX `article_images_article_id_index` (`article_id`),
    INDEX `article_images_sort_order_index` (`sort_order`),
    CONSTRAINT `article_images_article_id_foreign` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- 17. messages
-- -----------------------------------------------------------
CREATE TABLE `messages` (
    `id`           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `unit_id`      BIGINT UNSIGNED NULL,
    `agent_id`     BIGINT UNSIGNED NULL,
    `client_name`  VARCHAR(255) NOT NULL,
    `client_phone` VARCHAR(20) NULL,
    `client_email` VARCHAR(255) NULL,
    `content`      TEXT NOT NULL,
    `status`       VARCHAR(10) NOT NULL DEFAULT 'pending',
    `replied_at`   TIMESTAMP NULL,
    `created_at`   TIMESTAMP NULL,
    `updated_at`   TIMESTAMP NULL,
    INDEX `messages_unit_id_index` (`unit_id`),
    INDEX `messages_agent_id_index` (`agent_id`),
    INDEX `messages_status_index` (`status`),
    INDEX `messages_created_at_id_index` (`created_at`, `id`),
    CONSTRAINT `messages_unit_id_foreign` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE CASCADE,
    CONSTRAINT `messages_agent_id_foreign` FOREIGN KEY (`agent_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- 18. points_transactions
-- -----------------------------------------------------------
CREATE TABLE `points_transactions` (
    `id`            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `manager_id`    BIGINT UNSIGNED NOT NULL,
    `unit_id`       BIGINT UNSIGNED NULL,
    `points`        INT NOT NULL,
    `type`          VARCHAR(20) NOT NULL,
    `balance_after` INT NOT NULL,
    `notes`         TEXT NULL,
    `performed_by`  BIGINT UNSIGNED NOT NULL,
    `created_at`    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX `points_transactions_manager_id_index` (`manager_id`),
    INDEX `points_transactions_unit_id_index` (`unit_id`),
    INDEX `points_transactions_type_index` (`type`),
    INDEX `points_transactions_created_at_index` (`created_at`),
    CONSTRAINT `points_transactions_manager_id_foreign` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `points_transactions_unit_id_foreign` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE SET NULL,
    CONSTRAINT `points_transactions_performed_by_foreign` FOREIGN KEY (`performed_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- 19. settings
-- -----------------------------------------------------------
CREATE TABLE `settings` (
    `id`         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `key`        VARCHAR(100) NOT NULL UNIQUE,
    `value`      TEXT NULL,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- 20. about_page
-- -----------------------------------------------------------
CREATE TABLE `about_page` (
    `id`         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `content_ar` LONGTEXT NULL,
    `content_en` LONGTEXT NULL,
    `images`     JSON NULL,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- 21. page_views
-- -----------------------------------------------------------
CREATE TABLE `page_views` (
    `id`            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `viewable_type` VARCHAR(80) NOT NULL,
    `viewable_id`   BIGINT UNSIGNED NOT NULL,
    `ip_address`    VARCHAR(45) NULL,
    `user_agent`    VARCHAR(500) NULL,
    `visited_at`    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX `page_views_viewable_type_viewable_id_index` (`viewable_type`, `viewable_id`),
    INDEX `page_views_visited_at_index` (`visited_at`),
    INDEX `page_views_dedup_idx` (`viewable_type`, `viewable_id`, `ip_address`, `visited_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- 22. popular_searches
-- -----------------------------------------------------------
CREATE TABLE `popular_searches` (
    `id`              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `keyword`         VARCHAR(190) NOT NULL UNIQUE,
    `search_count`    INT NOT NULL DEFAULT 1,
    `last_searched_at` TIMESTAMP NULL,
    `created_at`      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX `popular_searches_search_count_last_searched_at_index` (`search_count`, `last_searched_at`),
    INDEX `popular_searches_last_searched_at_index` (`last_searched_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- 23. agent_profiles
-- -----------------------------------------------------------
CREATE TABLE `agent_profiles` (
    `id`         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id`    BIGINT UNSIGNED NOT NULL,
    `avatar`     VARCHAR(255) NULL,
    `phone`      VARCHAR(255) NULL,
    `whatsapp`   VARCHAR(255) NULL,
    `facebook`   VARCHAR(255) NULL,
    `linkedin`   VARCHAR(255) NULL,
    `created_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP NULL,
    CONSTRAINT `agent_profiles_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- 24. activity_log
-- -----------------------------------------------------------
CREATE TABLE `activity_log` (
    `id`                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `log_name`          VARCHAR(255) NULL,
    `description`       TEXT NOT NULL,
    `subject_type`      VARCHAR(255) NULL,
    `subject_id`        BIGINT UNSIGNED NULL,
    `event`             VARCHAR(255) NULL,
    `causer_type`       VARCHAR(255) NULL,
    `causer_id`         BIGINT UNSIGNED NULL,
    `batch_uuid`        CHAR(36) NULL,
    `attribute_changes` JSON NULL,
    `properties`        JSON NULL,
    `created_at`        TIMESTAMP NULL,
    `updated_at`        TIMESTAMP NULL,
    INDEX `activity_log_log_name_index` (`log_name`),
    INDEX `activity_log_subject_type_subject_id_index` (`subject_type`, `subject_id`),
    INDEX `activity_log_causer_type_causer_id_index` (`causer_type`, `causer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- 25. notifications
-- -----------------------------------------------------------
CREATE TABLE `notifications` (
    `id`               CHAR(36) PRIMARY KEY,
    `type`             VARCHAR(255) NOT NULL,
    `notifiable_type`  VARCHAR(255) NOT NULL,
    `notifiable_id`    BIGINT UNSIGNED NOT NULL,
    `data`             TEXT NOT NULL,
    `read_at`          TIMESTAMP NULL,
    `created_at`       TIMESTAMP NULL,
    `updated_at`       TIMESTAMP NULL,
    INDEX `notifications_notifiable_type_notifiable_id_index` (`notifiable_type`, `notifiable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- 26. permissions (Spatie)
-- -----------------------------------------------------------
CREATE TABLE `permissions` (
    `id`         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name`       VARCHAR(255) NOT NULL,
    `guard_name` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP NULL,
    UNIQUE `permissions_name_guard_name_unique` (`name`, `guard_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- 27. roles (Spatie)
-- -----------------------------------------------------------
CREATE TABLE `roles` (
    `id`         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name`       VARCHAR(255) NOT NULL,
    `guard_name` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP NULL,
    UNIQUE `roles_name_guard_name_unique` (`name`, `guard_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- 28. model_has_permissions (Spatie)
-- -----------------------------------------------------------
CREATE TABLE `model_has_permissions` (
    `permission_id` BIGINT UNSIGNED NOT NULL,
    `model_type`    VARCHAR(255) NOT NULL,
    `model_id`      BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (`permission_id`, `model_id`, `model_type`),
    INDEX `model_has_permissions_model_id_model_type_index` (`model_id`, `model_type`),
    CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- 29. model_has_roles (Spatie)
-- -----------------------------------------------------------
CREATE TABLE `model_has_roles` (
    `role_id`    BIGINT UNSIGNED NOT NULL,
    `model_type` VARCHAR(255) NOT NULL,
    `model_id`   BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (`role_id`, `model_id`, `model_type`),
    INDEX `model_has_roles_model_id_model_type_index` (`model_id`, `model_type`),
    CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- 30. role_has_permissions (Spatie)
-- -----------------------------------------------------------
CREATE TABLE `role_has_permissions` (
    `permission_id` BIGINT UNSIGNED NOT NULL,
    `role_id`       BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (`permission_id`, `role_id`),
    CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
    CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- 31. Default Data (Roles & System Users)
-- -----------------------------------------------------------
INSERT INTO `roles` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'web', NOW(), NOW()),
(2, 'manager', 'web', NOW(), NOW()),
(3, 'agent', 'web', NOW(), NOW())
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `manager_id`, `points_balance`, `initial_monthly_balance`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'مدير النظام (Admin)', 'admin@admin.com', '$2y$12$z9Wq7vrF1sEJ7HJ3mzj2B.Y973JWw0tahpOr.U29sw.l6fTJAC3oO', 'admin', NULL, 0, 0, 1, NOW(), NOW()),
(2, 'أحمد المدير (Manager)', 'manager@manager.com', '$2y$12$z9Wq7vrF1sEJ7HJ3mzj2B.Y973JWw0tahpOr.U29sw.l6fTJAC3oO', 'manager', NULL, 5000, 5000, 1, NOW(), NOW()),
(3, 'علي الوكيل (Agent)', 'agent@agent.com', '$2y$12$z9Wq7vrF1sEJ7HJ3mzj2B.Y973JWw0tahpOr.U29sw.l6fTJAC3oO', 'agent', 2, 300, 0, 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES
(1, 'App\\Domain\\Users\\Models\\User', 1),
(2, 'App\\Domain\\Users\\Models\\User', 2),
(3, 'App\\Domain\\Users\\Models\\User', 3)
ON DUPLICATE KEY UPDATE `role_id` = VALUES(`role_id`);
