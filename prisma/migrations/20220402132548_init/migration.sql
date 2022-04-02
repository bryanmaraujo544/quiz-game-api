-- AlterTable
ALTER TABLE `participants` ADD COLUMN `correct_answers` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `incorrect_answers` INTEGER NOT NULL DEFAULT 0;
