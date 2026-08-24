// app/actions/sales.ts
"use server";

import { prisma } from "@/lib/prisma";
import { ItemCategory, Prisma } from "@prisma/client";
import { redirect } from "next/navigation";

export type ActionState = {
    success?: boolean;
    error?: string;
} | null;

export async function createSaleAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
    let createdAgreementId: string | null = null;
    let monthlyInstallmentVal = 0; // 1. Variable scoped outside the try block

    try {
        // 1. Parse Customer Details
        const fullName = formData.get("fullName") as string;
        const fatherName = formData.get("fatherName") as string;
        const phone = formData.get("phone") as string;
        const address = formData.get("address") as string;
        const cnic = formData.get("cnic") as string;

        // 2. Parse Guarantor Details
        const guarantorName = formData.get("guarantorName") as string;
        const guarantorCnic = formData.get("guarantorCnic") as string;
        const guarantorPhone = formData.get("guarantorPhone") as string;

        // 3. Parse Category & Item Details
        const category = formData.get("category") as ItemCategory;
        const brand = formData.get("brand") as string;
        const model = formData.get("model") as string;
        const color = (formData.get("color") as string) || undefined;

        const engineNumber = (formData.get("engineNumber") as string) || undefined;
        const chassisNumber = (formData.get("chassisNumber") as string) || undefined;

        const imei1 = (formData.get("imei1") as string) || undefined;
        const imei2 = (formData.get("imei2") as string) || undefined;

        // 4. Financial Calculations & Selected Dates
        const totalAmount = parseFloat(formData.get("totalAmount") as string);
        const advancePaid = parseFloat(formData.get("advancePaid") as string);
        const monthlyInstallment = parseFloat(formData.get("monthlyInstallment") as string) || 0;
        monthlyInstallmentVal = monthlyInstallment; // Capture value for redirect URL

        if (isNaN(totalAmount) || isNaN(advancePaid)) {
            return { error: "Please enter valid numeric amounts for total price and advance payment." };
        }

        if (advancePaid > totalAmount) {
            return { error: "Advance paid cannot exceed the total agreement price." };
        }

        const remainingBalance = totalAmount - advancePaid;

        const createdAtInput = formData.get("createdAt") as string;
        const nextDueDateInput = formData.get("nextDueDate") as string;

        const startDate = createdAtInput ? new Date(createdAtInput) : new Date();
        const nextDueDate = nextDueDateInput ? new Date(nextDueDateInput) : new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);

        // 5. Execute Atomic Transaction
        await prisma.$transaction(
            async (tx) => {
                // Upsert customer
                const customer = await tx.customer.upsert({
                    where: { cnic },
                    update: { fullName, fatherName, phone, address },
                    create: { fullName, fatherName, phone, address, cnic },
                });

                // Attach guarantor record
                await tx.guarantor.create({
                    data: {
                        customerId: customer.id,
                        fullName: guarantorName,
                        cnic: guarantorCnic,
                        phone: guarantorPhone,
                    },
                });

                let bikeId: string | undefined = undefined;
                let mobileId: string | undefined = undefined;

                if (category === "BIKE") {
                    if (!engineNumber || !chassisNumber) {
                        throw new Error("Engine and Chassis numbers are required for bikes.");
                    }
                    const bike = await tx.bike.create({
                        data: {
                            brand,
                            model,
                            color: color || "Standard",
                            engineNumber,
                            chassisNumber,
                            isSold: true,
                        },
                    });
                    bikeId = bike.id;
                } else {
                    if (!imei1) {
                        throw new Error("IMEI-1 is required for mobile phones.");
                    }
                    const mobile = await tx.mobile.create({
                        data: {
                            brand,
                            model,
                            imei1,
                            imei2,
                            isSold: true,
                        },
                    });
                    mobileId = mobile.id;
                }

                const agreement = await tx.installmentAgreement.create({
                    data: {
                        customerId: customer.id,
                        category,
                        bikeId,
                        mobileId,
                        totalAmount,
                        startDate,
                    },
                });

                createdAgreementId = agreement.id;

                await tx.installmentPayment.create({
                    data: {
                        agreementId: agreement.id,
                        paymentType: "ADVANCE",
                        amountPaid: advancePaid,
                        remainingBalance,
                        monthlyInstallment,
                        paymentDate: startDate,
                        nextDueDate,
                    },
                });
            },
            {
                maxWait: 5000,
                timeout: 10000,
            }
        );
    } catch (err: any) {
        console.error("Database Submission Error:", err);

        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
            const target = (err.meta?.target as string[]) || [];

            if (target.includes("engineNumber") || target.includes("chassisNumber")) {
                return { error: "A bike with this Engine or Chassis number has already been registered." };
            }
            if (target.includes("imei1") || target.includes("imei2")) {
                return { error: "A mobile phone with this IMEI number already exists in the system." };
            }
            return { error: "A record with these unique identification details already exists in the database." };
        }

        return { error: err.message || "Failed to save sale transaction." };
    }

    // 2. Pass monthlyInstallment in searchParams
    if (createdAgreementId) {
        redirect(`/dashboard/sales/${createdAgreementId}/receipt?monthlyInstallment=${monthlyInstallmentVal}`);
    }

    return { success: true };
}