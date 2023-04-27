/*
  Warnings:

  - You are about to drop the column `profile_picture` on the `tenant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `tenant` DROP COLUMN `profile_picture`,
    ADD COLUMN `avatar_url` VARCHAR(256) NULL;
