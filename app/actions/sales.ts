"use server";

import { prisma } from "@/lib/prisma";
import { ItemCategory, Prisma } from "@prisma/client";
import { redirect } from "next/navigation";

export type ActionState = {
    success?: boolean;
    error?: string;
} | null;

export async function createSaleAction(
    prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    let createdAgreementId: string | null = null;
    let monthlyInstallmentVal = 0;

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

        const engineNumber =
            (formData.get("engineNumber") as string) || undefined;
        const chassisNumber =
            (formData.get("chassisNumber") as string) || undefined;

        const imei1 =
            (formData.get("imei1") as string) || undefined;
        const imei2 =
            (formData.get("imei2") as string) || undefined;

        // 4. Financial Calculations
        const actualPrice = parseFloat(
            formData.get("actualPrice") as string
        );

        const totalAmount = parseFloat(
            formData.get("totalAmount") as string
        );

        const advancePaid = parseFloat(
            formData.get("advancePaid") as string
        );

        const monthlyInstallment =
            parseFloat(formData.get("monthlyInstallment") as string) || 0;

        monthlyInstallmentVal = monthlyInstallment;

        // Validate numeric values
        if (
            isNaN(actualPrice) ||
            isNaN(totalAmount) ||
            isNaN(advancePaid)
        ) {
            return {
                error:
                    "Please enter valid numeric amounts for actual price, total price and advance payment.",
            };
        }

        if (actualPrice <= 0) {
            return {
                error: "Actual price must be greater than zero.",
            };
        }

        if (totalAmount <= 0) {
            return {
                error: "Agreement price must be greater than zero.",
            };
        }

        if (advancePaid < 0) {
            return {
                error: "Advance payment cannot be negative.",
            };
        }

        if (advancePaid > totalAmount) {
            return {
                error:
                    "Advance paid cannot exceed the total agreement price.",
            };
        }

        const remainingBalance = totalAmount - advancePaid;

        // 5. Dates
        const createdAtInput = formData.get("createdAt") as string;
        const nextDueDateInput = formData.get("nextDueDate") as string;

        const startDate = createdAtInput
            ? new Date(createdAtInput)
            : new Date();

        const nextDueDate = nextDueDateInput
            ? new Date(nextDueDateInput)
            : new Date(
                startDate.getTime() +
                30 * 24 * 60 * 60 * 1000
            );

        // 6. Execute Atomic Transaction
        await prisma.$transaction(
            async (tx) => {
                // Upsert customer
                const customer = await tx.customer.upsert({
                    where: { cnic },
                    update: {
                        fullName,
                        fatherName,
                        phone,
                        address,
                    },
                    create: {
                        fullName,
                        fatherName,
                        phone,
                        address,
                        cnic,
                    },
                });

                // Create guarantor
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

                // 7. Create Product
                if (category === "BIKE") {
                    if (!engineNumber || !chassisNumber) {
                        throw new Error(
                            "Engine and Chassis numbers are required for bikes."
                        );
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
                        throw new Error(
                            "IMEI-1 is required for mobile phones."
                        );
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

                // 8. Create Installment Agreement
                const agreement =
                    await tx.installmentAgreement.create({
                        data: {
                            customerId: customer.id,
                            category,
                            bikeId,
                            mobileId,

                            // NEW
                            actualPrice,

                            // Final installment/agreement price
                            totalAmount,

                            startDate,
                        },
                    });

                createdAgreementId = agreement.id;

                // 9. Create Advance Payment
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

        if (
            err instanceof Prisma.PrismaClientKnownRequestError &&
            err.code === "P2002"
        ) {
            const target = (err.meta?.target as string[]) || [];

            if (
                target.includes("engineNumber") ||
                target.includes("chassisNumber")
            ) {
                return {
                    error:
                        "A bike with this Engine or Chassis number has already been registered.",
                };
            }

            if (
                target.includes("imei1") ||
                target.includes("imei2")
            ) {
                return {
                    error:
                        "A mobile phone with this IMEI number already exists in the system.",
                };
            }

            return {
                error:
                    "A record with these unique identification details already exists in the database.",
            };
        }

        return {
            error:
                err.message ||
                "Failed to save sale transaction.",
        };
    }

    // 10. Redirect to receipt
    if (createdAgreementId) {
        redirect(
            `/dashboard/sales/${createdAgreementId}/receipt?monthlyInstallment=${monthlyInstallmentVal}`
        );
    }

    return { success: true };
}

// ### The important changes

// You now have:

// ```typescript
// const actualPrice = parseFloat(
//     formData.get("actualPrice") as string
// );
// ```

// Then validation:

// ```typescript
// if (isNaN(actualPrice)) {
//     return {
//         error: "Please enter a valid actual price.",
//     };
// }
// ```

// And most importantly, when creating the agreement:

// ```typescript
// const agreement = await tx.installmentAgreement.create({
//     data: {
//         customerId: customer.id,
//         category,
//         bikeId,
//         mobileId,

//         actualPrice,
//         totalAmount,

//         startDate,
//     },
// });
// ```

// So your database will now store, for example:

// ```text
// actualPrice = 100,000
// totalAmount = 125,000
// advancePaid = 25,000
// remaining = 100,000
//     ```

// Meaning:

// **Actual price:** Rs. 100,000
// **Agreement price:** Rs. 125,000
// **Markup/profit:** Rs. 25,000

// ### One thing you must also change

// Your **sale form** must have an input whose name is exactly:

// ```tsx
// name = "actualPrice"
//     ```

// For example:

// ```tsx
//     < input
// type = "number"
// name = "actualPrice"
// placeholder = "Enter actual price"
// required
//     />
//     ```

// Otherwise:

// ```typescript
// formData.get("actualPrice")
//     ```

// will return `null`, and your validation will fail.

// Also, after modifying your Prisma schema, make sure you have run:

// ```bash
// npx prisma migrate dev--name add_actual_price
//     ```

// and, if Prisma Client isn't updated automatically:

// ```bash
// npx prisma generate
//     ```

// If you show me your **sale form/page where `totalAmount`, `advancePaid`, and `monthlyInstallment` are entered**, I can modify that too so **Actual Price → Agreement Price → Advance → Remaining Balance** work together correctly.
