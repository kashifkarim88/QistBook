"use server";

import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
    // --------------------------------------------------
    // BASIC COUNTS
    // --------------------------------------------------

    const [
        totalCustomers,
        totalAgreements,
        activeAgreements,
        completedAgreements,
        defaultedAgreements,
        mobileAgreements,
        bikeAgreements,
    ] = await Promise.all([
        prisma.customer.count(),

        prisma.installmentAgreement.count(),

        prisma.installmentAgreement.count({
            where: {
                status: "ACTIVE",
            },
        }),

        prisma.installmentAgreement.count({
            where: {
                status: "COMPLETED",
            },
        }),

        prisma.installmentAgreement.count({
            where: {
                status: "DEFAULTED",
            },
        }),

        prisma.installmentAgreement.count({
            where: {
                category: "MOBILE",
            },
        }),

        prisma.installmentAgreement.count({
            where: {
                category: "BIKE",
            },
        }),
    ]);

    // --------------------------------------------------
    // TOTAL AGREEMENT VALUE
    // --------------------------------------------------

    const agreementTotal = await prisma.installmentAgreement.aggregate({
        _sum: {
            totalAmount: true,
        },
    });

    const totalAgreementValue = Number(
        agreementTotal._sum.totalAmount ?? 0
    );

    // --------------------------------------------------
    // TOTAL PAYMENTS
    // --------------------------------------------------

    const paymentTotal = await prisma.installmentPayment.aggregate({
        _sum: {
            amountPaid: true,
        },
    });

    const totalPaid = Number(
        paymentTotal._sum.amountPaid ?? 0
    );

    // --------------------------------------------------
    // REMAINING BALANCE
    // --------------------------------------------------

    const totalRemaining = Math.max(
        0,
        totalAgreementValue - totalPaid
    );

    // --------------------------------------------------
    // COLLECTION PERCENTAGE
    // --------------------------------------------------

    const collectionPercentage =
        totalAgreementValue > 0
            ? (totalPaid / totalAgreementValue) * 100
            : 0;

    return {
        totalCustomers,
        totalAgreements,
        activeAgreements,
        completedAgreements,
        defaultedAgreements,
        mobileAgreements,
        bikeAgreements,

        totalAgreementValue,
        totalPaid,
        totalRemaining,
        collectionPercentage,
    };
}