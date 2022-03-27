/*
  Warnings:

  - Added the required column `is_open` to the `gamerooms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `gamerooms` ADD COLUMN `is_open` BOOLEAN NOT NULL;
