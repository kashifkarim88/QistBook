"use server";

import { prisma } from "@/lib/prisma";
import { ItemCategory } from "@prisma/client";
import { redirect } from "next/navigation";

export async function createSaleAction(prevState: any, formData: FormData) {
    let isSuccess = false;

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

        // 4. Financial Calculations
        const totalAmount = parseFloat(formData.get("totalAmount") as string);
        const advancePaid = parseFloat(formData.get("advancePaid") as string);

        if (isNaN(totalAmount) || isNaN(advancePaid)) {
            return { error: "Please enter valid numeric amounts for total price and advance payment." };
        }

        if (advancePaid > totalAmount) {
            return { error: "Advance paid cannot exceed the total agreement price." };
        }

        const remainingBalance = totalAmount - advancePaid;

        // Dates from form or defaults
        const startDateStr = formData.get("createdAt") as string;
        const nextDueDateStr = formData.get("nextDueDate") as string;

        const currentDate = startDateStr ? new Date(startDateStr) : new Date();
        const nextDueDate = nextDueDateStr ? new Date(nextDueDateStr) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        // 5. Execute Atomic Transaction with timeout options
        await prisma.$transaction(
            async (tx) => {
                let customer = await tx.customer.findUnique({ where: { cnic } });
                if (!customer) {
                    customer = await tx.customer.create({
                        data: { fullName, fatherName, phone, address, cnic },
                    });
                }

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
                        data: { brand, model, color: color || "Standard", engineNumber, chassisNumber, isSold: true },
                    });
                    bikeId = bike.id;
                } else {
                    if (!imei1) {
                        throw new Error("IMEI-1 is required for mobile phones.");
                    }
                    const mobile = await tx.mobile.create({
                        data: { brand, model, imei1, imei2, isSold: true },
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
                        startDate: currentDate,
                    },
                });

                await tx.installmentPayment.create({
                    data: {
                        agreementId: agreement.id,
                        paymentType: "ADVANCE",
                        amountPaid: advancePaid,
                        remainingBalance,
                        paymentDate: currentDate,
                        nextDueDate,
                    },
                });
            },
            {
                maxWait: 5000,  // Max time (5s) to acquire connection pool slot
                timeout: 10000, // Max transaction duration (10s)
            }
        );

        isSuccess = true;
    } catch (err: any) {
        console.error("Database Submission Error:", err);
        if (err.code === "P2002") {
            return { error: "A record with this CNIC, Phone, IMEI, or Engine/Chassis number already exists in database." };
        }
        return { error: err.message || "Failed to save sale transaction." };
    }

    if (isSuccess) {
        redirect("/dashboard");
    }
}