/*
  Warnings:

  - You are about to drop the column `installmentAmount` on the `InstallmentAgreement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "InstallmentAgreement" DROP COLUMN "installmentAmount";

-- CreateTable
CREATE TABLE "InstallmentAmounts" (
    "id" TEXT NOT NULL,
    "agreementId" TEXT NOT NULL,
    "installmentAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "InstallmentAmounts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InstallmentAmounts" ADD CONSTRAINT "InstallmentAmounts_agreementId_fkey" FOREIGN KEY ("agreementId") REFERENCES "InstallmentAgreement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
