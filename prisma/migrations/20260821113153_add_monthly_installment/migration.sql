/*
  Warnings:

  - Added the required column `monthlyInstallment` to the `InstallmentPayment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Customer_cnic_key";

-- DropIndex
DROP INDEX "Customer_phone_key";

-- AlterTable
ALTER TABLE "InstallmentAgreement" ALTER COLUMN "startDate" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "InstallmentPayment" ADD COLUMN     "monthlyInstallment" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "paymentDate" SET DATA TYPE DATE,
ALTER COLUMN "nextDueDate" SET DATA TYPE DATE;

-- CreateIndex
CREATE INDEX "Customer_phone_idx" ON "Customer"("phone");

-- CreateIndex
CREATE INDEX "Guarantor_customerId_idx" ON "Guarantor"("customerId");

-- CreateIndex
CREATE INDEX "Guarantor_cnic_idx" ON "Guarantor"("cnic");

-- CreateIndex
CREATE INDEX "InstallmentAgreement_customerId_idx" ON "InstallmentAgreement"("customerId");

-- CreateIndex
CREATE INDEX "InstallmentAgreement_status_idx" ON "InstallmentAgreement"("status");
