-- AlterTable
ALTER TABLE "PlayerRegistration" ADD COLUMN "hasPaid" BOOLEAN;
UPDATE "PlayerRegistration" SET hasPaid = 0;
ALTER TABLE "PlayerRegistration" ADD COLUMN "paymentDate" DATETIME;
