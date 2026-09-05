/*
  Warnings:

  - A unique constraint covering the columns `[cnic]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "InstallmentAgreement" ADD COLUMN     "actualPrice" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "InstallmentPayment" ALTER COLUMN "monthlyInstallment" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Customer_cnic_key" ON "Customer"("cnic");
