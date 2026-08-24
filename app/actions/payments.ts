"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function recordInstallmentPayment(
    formData: FormData
) {
    const agreementId = String(
        formData.get("agreementId") || ""
    ).trim();

    const amount = Number(
        formData.get("amount") || 0
    );

    if (!agreementId) {
        throw new Error("Agreement ID is required.");
    }

    if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error(
            "Please enter a valid payment amount."
        );
    }

    // --------------------------------------------------
    // Get agreement + latest payment + customer
    // --------------------------------------------------

    const agreement =
        await prisma.installmentAgreement.findUnique({
            where: {
                id: agreementId,
            },

            include: {
                customer: true,

                payments: {
                    orderBy: [
                        {
                            paymentDate: "desc",
                        },
                        {
                            createdAt: "desc",
                        },
                    ],
                    take: 1,
                },
            },
        });

    if (!agreement) {
        throw new Error(
            "Installment agreement not found."
        );
    }

    // --------------------------------------------------
    // Agreement must still be active
    // --------------------------------------------------

    if (agreement.status !== "ACTIVE") {
        throw new Error(
            "This agreement is no longer active."
        );
    }

    // --------------------------------------------------
    // Get latest payment
    // --------------------------------------------------

    const latestPayment =
        agreement.payments[0];

    // --------------------------------------------------
    // Current balance
    //
    // If there is a previous payment, use its
    // remainingBalance.
    //
    // Otherwise, use the agreement total.
    // --------------------------------------------------

    const currentRemainingBalance =
        Number(
            latestPayment?.remainingBalance ??
            agreement.totalAmount
        );

    if (currentRemainingBalance <= 0) {
        throw new Error(
            "This agreement has no remaining balance."
        );
    }

    // --------------------------------------------------
    // Prevent overpayment
    // --------------------------------------------------

    if (amount > currentRemainingBalance) {
        throw new Error(
            `Payment cannot be greater than the remaining balance of PKR ${currentRemainingBalance.toLocaleString()}.`
        );
    }

    // --------------------------------------------------
    // Payment date = today
    // --------------------------------------------------

    const paymentDate = new Date();

    // --------------------------------------------------
    // Calculate remaining balance
    // --------------------------------------------------

    const newRemainingBalance = Math.max(
        0,
        currentRemainingBalance - amount
    );

    // --------------------------------------------------
    // Check whether agreement is completed
    // --------------------------------------------------

    const isCompleted =
        newRemainingBalance <= 0;

    // --------------------------------------------------
    // Next due date
    //
    // No next date if agreement is completed.
    // Otherwise 30 days after current payment.
    // --------------------------------------------------

    const nextDueDate = isCompleted
        ? null
        : new Date(
            paymentDate.getTime() +
            30 *
            24 *
            60 *
            60 *
            1000
        );

    // --------------------------------------------------
    // Monthly installment
    //
    // Keep the original installment amount if it
    // already exists.
    //
    // If this is somehow the first installment,
    // use the current payment amount.
    // --------------------------------------------------

    const monthlyInstallment =
        Number(
            latestPayment?.monthlyInstallment ?? 0
        ) > 0
            ? Number(
                latestPayment?.monthlyInstallment
            )
            : amount;

    // --------------------------------------------------
    // DATABASE TRANSACTION
    // --------------------------------------------------

    const result = await prisma.$transaction(
        async (tx) => {
            // ------------------------------------------
            // Create payment
            // ------------------------------------------

            const payment =
                await tx.installmentPayment.create({
                    data: {
                        agreementId,

                        paymentType:
                            "INSTALLMENT",

                        amountPaid:
                            amount,

                        remainingBalance:
                            newRemainingBalance,

                        monthlyInstallment,

                        paymentDate,

                        nextDueDate,
                    },
                });

            // ------------------------------------------
            // Update agreement status
            // ------------------------------------------

            if (isCompleted) {
                await tx.installmentAgreement.update({
                    where: {
                        id: agreementId,
                    },

                    data: {
                        status: "COMPLETED",
                    },
                });
            }

            return payment;
        }
    );

    // --------------------------------------------------
    // Revalidate pages
    // --------------------------------------------------

    revalidatePath("/dashboard");

    revalidatePath(
        `/collect-payment/${agreementId}`
    );

    revalidatePath(
        `/dashboard/sales/${agreementId}`
    );

    // --------------------------------------------------
    // REDIRECT TO PAYMENT RECEIPT
    // --------------------------------------------------

    redirect(
        `/dashboard/sales/${agreementId}/payment-receipt?customerId=${agreement.customerId}&paymentId=${result.id}`
    );
}