-- CreateTable
CREATE TABLE `all_auth_recipe_users` (
    `user_id` CHAR(36) NOT NULL,
    `recipe_id` VARCHAR(128) NOT NULL,
    `time_joined` BIGINT UNSIGNED NOT NULL,

    INDEX `all_auth_recipe_users_pagination_index`(`time_joined`, `user_id`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dashboard_user_sessions` (
    `session_id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `time_created` BIGINT UNSIGNED NOT NULL,
    `expiry` BIGINT UNSIGNED NOT NULL,

    INDEX `dashboard_user_sessions_expiry_index`(`expiry`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`session_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dashboard_users` (
    `user_id` CHAR(36) NOT NULL,
    `email` VARCHAR(256) NOT NULL,
    `password_hash` VARCHAR(256) NOT NULL,
    `time_joined` BIGINT UNSIGNED NOT NULL,

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `emailverification_tokens` (
    `user_id` VARCHAR(128) NOT NULL,
    `email` VARCHAR(256) NOT NULL,
    `token` VARCHAR(128) NOT NULL,
    `token_expiry` BIGINT UNSIGNED NOT NULL,

    UNIQUE INDEX `token`(`token`),
    INDEX `emailverification_tokens_index`(`token_expiry`),
    PRIMARY KEY (`user_id`, `email`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `emailverification_verified_emails` (
    `user_id` VARCHAR(128) NOT NULL,
    `email` VARCHAR(256) NOT NULL,

    PRIMARY KEY (`user_id`, `email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jwt_signing_keys` (
    `key_id` VARCHAR(255) NOT NULL,
    `key_string` TEXT NOT NULL,
    `algorithm` VARCHAR(10) NOT NULL,
    `created_at` BIGINT UNSIGNED NULL,

    PRIMARY KEY (`key_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `key_value` (
    `name` VARCHAR(128) NOT NULL,
    `value` TEXT NULL,
    `created_at_time` BIGINT UNSIGNED NULL,

    PRIMARY KEY (`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `password_resets` (
    `user_id` CHAR(36) NOT NULL,
    `token` VARCHAR(128) NOT NULL,
    `token_expiry` BIGINT UNSIGNED NOT NULL,

    UNIQUE INDEX `token`(`token`),
    INDEX `emailpassword_password_reset_token_expiry_index`(`token_expiry`),
    PRIMARY KEY (`user_id`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `passwordless_codes` (
    `code_id` CHAR(36) NOT NULL,
    `device_id_hash` CHAR(44) NOT NULL,
    `link_code_hash` CHAR(44) NOT NULL,
    `created_at` BIGINT UNSIGNED NOT NULL,

    UNIQUE INDEX `link_code_hash`(`link_code_hash`),
    INDEX `device_id_hash`(`device_id_hash`),
    INDEX `passwordless_codes_created_at_index`(`created_at`),
    PRIMARY KEY (`code_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `passwordless_devices` (
    `device_id_hash` CHAR(44) NOT NULL,
    `email` VARCHAR(256) NULL,
    `phone_number` VARCHAR(256) NULL,
    `link_code_salt` CHAR(44) NOT NULL,
    `failed_attempts` INTEGER UNSIGNED NOT NULL,

    INDEX `passwordless_devices_email_index`(`email`),
    INDEX `passwordless_devices_phone_number_index`(`phone_number`),
    PRIMARY KEY (`device_id_hash`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `passwordless_users` (
    `user_id` CHAR(36) NOT NULL,
    `email` VARCHAR(256) NULL,
    `phone_number` VARCHAR(256) NULL,
    `time_joined` BIGINT UNSIGNED NOT NULL,

    UNIQUE INDEX `email`(`email`),
    UNIQUE INDEX `phone_number`(`phone_number`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role_permissions` (
    `role` VARCHAR(255) NOT NULL,
    `permission` VARCHAR(255) NOT NULL,

    INDEX `role_permissions_permission_index`(`permission`),
    PRIMARY KEY (`role`, `permission`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `role` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`role`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `session_access_token_signing_keys` (
    `created_at_time` BIGINT UNSIGNED NOT NULL,
    `value` TEXT NULL,

    PRIMARY KEY (`created_at_time`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `session_info` (
    `session_handle` VARCHAR(255) NOT NULL,
    `user_id` VARCHAR(128) NOT NULL,
    `refresh_token_hash_2` VARCHAR(128) NOT NULL,
    `session_data` TEXT NULL,
    `expires_at` BIGINT UNSIGNED NOT NULL,
    `created_at_time` BIGINT UNSIGNED NOT NULL,
    `jwt_user_payload` TEXT NULL,

    PRIMARY KEY (`session_handle`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `thirdparty_users` (
    `third_party_id` VARCHAR(28) NOT NULL,
    `third_party_user_id` VARCHAR(256) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `email` VARCHAR(256) NOT NULL,
    `time_joined` BIGINT UNSIGNED NOT NULL,

    UNIQUE INDEX `user_id`(`user_id`),
    PRIMARY KEY (`third_party_id`, `third_party_user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `totp_used_codes` (
    `user_id` VARCHAR(128) NOT NULL,
    `code` VARCHAR(8) NOT NULL,
    `is_valid` BOOLEAN NOT NULL,
    `expiry_time_ms` BIGINT UNSIGNED NOT NULL,
    `created_time_ms` BIGINT UNSIGNED NOT NULL,

    INDEX `totp_used_codes_expiry_time_ms_index`(`expiry_time_ms`),
    PRIMARY KEY (`user_id`, `created_time_ms`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `totp_user_devices` (
    `user_id` VARCHAR(128) NOT NULL,
    `device_name` VARCHAR(256) NOT NULL,
    `secret_key` VARCHAR(256) NOT NULL,
    `period` INTEGER NOT NULL,
    `skew` INTEGER NOT NULL,
    `verified` BOOLEAN NOT NULL,

    PRIMARY KEY (`user_id`, `device_name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `totp_users` (
    `user_id` VARCHAR(128) NOT NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_last_active` (
    `user_id` VARCHAR(128) NOT NULL,
    `last_active_time` BIGINT UNSIGNED NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_metadata` (
    `user_id` VARCHAR(128) NOT NULL,
    `user_metadata` TEXT NOT NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_roles` (
    `user_id` VARCHAR(128) NOT NULL,
    `role` VARCHAR(255) NOT NULL,

    INDEX `user_roles_role_index`(`role`),
    PRIMARY KEY (`user_id`, `role`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `userid_mapping` (
    `supertokens_user_id` CHAR(36) NOT NULL,
    `external_user_id` VARCHAR(128) NOT NULL,
    `external_user_id_info` TEXT NULL,

    UNIQUE INDEX `supertokens_user_id`(`supertokens_user_id`),
    UNIQUE INDEX `external_user_id`(`external_user_id`),
    PRIMARY KEY (`supertokens_user_id`, `external_user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `user_id` CHAR(36) NOT NULL,
    `email` VARCHAR(256) NOT NULL,
    `password_hash` VARCHAR(256) NOT NULL,
    `first_name` VARCHAR(64) NULL,
    `last_name` VARCHAR(64) NULL,
    `phone_number` VARCHAR(20) NULL,
    `user_type` ENUM('TENANT', 'OWNER', 'ADMIN') NOT NULL,
    `time_joined` BIGINT UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tenant` (
    `tenant_id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `profile_picture` VARCHAR(256) NULL,

    UNIQUE INDEX `tenant_user_id_key`(`user_id`),
    PRIMARY KEY (`tenant_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `owner` (
    `owner_id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `nik` VARCHAR(16) NULL,
    `ktp_picture` VARCHAR(256) NULL,
    `balance` DECIMAL(10, 2) NOT NULL,
    `bank_name` VARCHAR(36) NULL,
    `card_number` VARCHAR(20) NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',

    UNIQUE INDEX `owner_user_id_key`(`user_id`),
    PRIMARY KEY (`owner_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `coworking_space` (
    `space_id` CHAR(36) NOT NULL,
    `name` VARCHAR(64) NOT NULL,
    `description` TEXT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `capacity` INTEGER NOT NULL,
    `owner_id` CHAR(36) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`space_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `coworking_space_image` (
    `image_id` CHAR(36) NOT NULL,
    `space_id` CHAR(36) NOT NULL,
    `image_url` VARCHAR(256) NOT NULL,

    PRIMARY KEY (`image_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `location` (
    `location_id` CHAR(36) NOT NULL,
    `address` VARCHAR(256) NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `space_id` CHAR(36) NOT NULL,

    UNIQUE INDEX `location_space_id_key`(`space_id`),
    PRIMARY KEY (`location_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `availability` (
    `availability_id` CHAR(36) NOT NULL,
    `space_id` CHAR(36) NOT NULL,
    `date` DATE NOT NULL,
    `start_hour` INTEGER NOT NULL,
    `end_hour` INTEGER NOT NULL,
    `is_booked` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`availability_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `facility` (
    `facility_id` CHAR(36) NOT NULL,
    `name` VARCHAR(64) NOT NULL,
    `description` TEXT NOT NULL,

    PRIMARY KEY (`facility_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `coworking_space_facility` (
    `space_id` CHAR(36) NOT NULL,
    `facility_id` CHAR(36) NOT NULL,

    PRIMARY KEY (`space_id`, `facility_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `booking` (
    `booking_id` CHAR(36) NOT NULL,
    `space_id` CHAR(36) NOT NULL,
    `tenant_id` CHAR(36) NOT NULL,
    `date` DATE NOT NULL,
    `start_hour` INTEGER NOT NULL,
    `end_hour` INTEGER NOT NULL,
    `total_price` DECIMAL(10, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `booking_space_id_index`(`space_id`),
    INDEX `booking_tenant_id_index`(`tenant_id`),
    PRIMARY KEY (`booking_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment` (
    `payment_id` CHAR(36) NOT NULL,
    `booking_id` CHAR(36) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('PENDING', 'SUCCESS', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `payment_booking_id_key`(`booking_id`),
    PRIMARY KEY (`payment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `dashboard_user_sessions` ADD CONSTRAINT `dashboard_user_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `dashboard_users`(`user_id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `password_resets` ADD CONSTRAINT `password_resets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `passwordless_codes` ADD CONSTRAINT `passwordless_codes_ibfk_1` FOREIGN KEY (`device_id_hash`) REFERENCES `passwordless_devices`(`device_id_hash`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role`) REFERENCES `roles`(`role`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `totp_used_codes` ADD CONSTRAINT `totp_used_codes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `totp_users`(`user_id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `totp_user_devices` ADD CONSTRAINT `totp_user_devices_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `totp_users`(`user_id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`role`) REFERENCES `roles`(`role`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `userid_mapping` ADD CONSTRAINT `userid_mapping_ibfk_1` FOREIGN KEY (`supertokens_user_id`) REFERENCES `all_auth_recipe_users`(`user_id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tenant` ADD CONSTRAINT `tenant_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `owner` ADD CONSTRAINT `owner_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `coworking_space` ADD CONSTRAINT `coworking_space_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `owner`(`owner_id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `coworking_space_image` ADD CONSTRAINT `coworking_space_image_ibfk_1` FOREIGN KEY (`space_id`) REFERENCES `coworking_space`(`space_id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `location` ADD CONSTRAINT `location_ibfk_1` FOREIGN KEY (`space_id`) REFERENCES `coworking_space`(`space_id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `availability` ADD CONSTRAINT `availability_ibfk_1` FOREIGN KEY (`space_id`) REFERENCES `coworking_space`(`space_id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `coworking_space_facility` ADD CONSTRAINT `coworking_space_facility_ibfk_2` FOREIGN KEY (`facility_id`) REFERENCES `facility`(`facility_id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `coworking_space_facility` ADD CONSTRAINT `coworking_space_facility_ibfk_1` FOREIGN KEY (`space_id`) REFERENCES `coworking_space`(`space_id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_ibfk_1` FOREIGN KEY (`space_id`) REFERENCES `coworking_space`(`space_id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_ibfk_2` FOREIGN KEY (`tenant_id`) REFERENCES `tenant`(`tenant_id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `payment` ADD CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `booking`(`booking_id`) ON DELETE CASCADE ON UPDATE RESTRICT;
