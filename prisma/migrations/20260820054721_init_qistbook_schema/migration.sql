-- CreateEnum
CREATE TYPE "ItemCategory" AS ENUM ('MOBILE', 'BIKE');

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'DEFAULTED');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('ADVANCE', 'INSTALLMENT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "recoveryKeyHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "fatherName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "cnic" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guarantor" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "cnic" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Guarantor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bike" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "engineNumber" TEXT NOT NULL,
    "chassisNumber" TEXT NOT NULL,
    "isSold" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mobile" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "imei1" TEXT NOT NULL,
    "imei2" TEXT,
    "isSold" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mobile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstallmentAgreement" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "category" "ItemCategory" NOT NULL,
    "bikeId" TEXT,
    "mobileId" TEXT,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "status" "ContractStatus" NOT NULL DEFAULT 'ACTIVE',
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InstallmentAgreement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstallmentPayment" (
    "id" TEXT NOT NULL,
    "agreementId" TEXT NOT NULL,
    "paymentType" "PaymentType" NOT NULL,
    "amountPaid" DOUBLE PRECISION NOT NULL,
    "remainingBalance" DOUBLE PRECISION NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nextDueDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InstallmentPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_phone_key" ON "Customer"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_cnic_key" ON "Customer"("cnic");

-- CreateIndex
CREATE UNIQUE INDEX "Bike_engineNumber_key" ON "Bike"("engineNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Bike_chassisNumber_key" ON "Bike"("chassisNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Mobile_imei1_key" ON "Mobile"("imei1");

-- CreateIndex
CREATE UNIQUE INDEX "Mobile_imei2_key" ON "Mobile"("imei2");

-- CreateIndex
CREATE UNIQUE INDEX "InstallmentAgreement_bikeId_key" ON "InstallmentAgreement"("bikeId");

-- CreateIndex
CREATE UNIQUE INDEX "InstallmentAgreement_mobileId_key" ON "InstallmentAgreement"("mobileId");

-- CreateIndex
CREATE INDEX "InstallmentPayment_nextDueDate_idx" ON "InstallmentPayment"("nextDueDate");

-- CreateIndex
CREATE INDEX "InstallmentPayment_agreementId_paymentDate_idx" ON "InstallmentPayment"("agreementId", "paymentDate" DESC);

-- AddForeignKey
ALTER TABLE "Guarantor" ADD CONSTRAINT "Guarantor_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallmentAgreement" ADD CONSTRAINT "InstallmentAgreement_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallmentAgreement" ADD CONSTRAINT "InstallmentAgreement_bikeId_fkey" FOREIGN KEY ("bikeId") REFERENCES "Bike"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallmentAgreement" ADD CONSTRAINT "InstallmentAgreement_mobileId_fkey" FOREIGN KEY ("mobileId") REFERENCES "Mobile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallmentPayment" ADD CONSTRAINT "InstallmentPayment_agreementId_fkey" FOREIGN KEY ("agreementId") REFERENCES "InstallmentAgreement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
