// app/actions/dashboard.ts
"use server";

import { prisma } from "@/lib/prisma";

export async function getClientsDueToday() {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const activeAgreements = await prisma.installmentAgreement.findMany({
        where: { status: "ACTIVE" },
        include: {
            customer: {
                include: { guarantors: true },
            },
            bike: true,
            mobile: true,
            payments: {
                orderBy: { createdAt: "desc" },
                take: 1,
            },
        },
    });

    return activeAgreements.filter((agr) => {
        const latestPayment = agr.payments[0];
        if (!latestPayment || latestPayment.remainingBalance <= 0) return false;
        return (
            latestPayment.nextDueDate !== null &&
            new Date(latestPayment.nextDueDate) <= today
        );
    });
}