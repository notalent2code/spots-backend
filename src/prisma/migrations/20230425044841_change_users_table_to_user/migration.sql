/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `owner` DROP FOREIGN KEY `owner_ibfk_1`;

-- DropForeignKey
ALTER TABLE `tenant` DROP FOREIGN KEY `tenant_ibfk_1`;

-- DropTable
DROP TABLE `users`;

-- CreateTable
CREATE TABLE `user` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password_hash` VARCHAR(256) NOT NULL,
    `first_name` VARCHAR(64) NOT NULL,
    `last_name` VARCHAR(64) NOT NULL,
    `phone_number` VARCHAR(20) NOT NULL,
    `refresh_token` TEXT NULL,
    `user_type` ENUM('TENANT', 'OWNER', 'ADMIN') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    UNIQUE INDEX `user_phone_number_key`(`phone_number`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tenant` ADD CONSTRAINT `tenant_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `owner` ADD CONSTRAINT `owner_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
