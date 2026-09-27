"use server";

import { prisma } from "@/lib/prisma";

export async function getClientsDueToday(
    page: number = 1,
    limit: number = 5,
    search: string = ""
) {
    const currentPage = Math.max(1, page);
    const pageSize = Math.max(1, Math.min(limit, 100));
    const skip = (currentPage - 1) * pageSize;

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const searchQuery = search.trim();

    // ---------------------------------------------------------
    // STEP 1:
    // Get active agreements and their latest payment.
    // ---------------------------------------------------------

    const activeAgreements =
        await prisma.installmentAgreement.findMany({
            where: {
                status: "ACTIVE",

                ...(searchQuery
                    ? {
                        customer: {
                            OR: [
                                {
                                    fullName: {
                                        contains: searchQuery,
                                    },
                                },
                                {
                                    phone: {
                                        contains: searchQuery,
                                    },
                                },
                            ],
                        },
                    }
                    : {}),
            },

            select: {
                id: true,

                payments: {
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: 1,
                    select: {
                        id: true,
                        remainingBalance: true,
                        nextDueDate: true,
                    },
                },
            },
        });

    // ---------------------------------------------------------
    // STEP 2:
    // Keep only agreements whose LATEST payment is overdue.
    // ---------------------------------------------------------

    const dueAgreementIds = activeAgreements
        .filter((agreement) => {
            const latestPayment = agreement.payments[0];

            if (!latestPayment) {
                return false;
            }

            if (Number(latestPayment.remainingBalance) <= 0) {
                return false;
            }

            if (!latestPayment.nextDueDate) {
                return false;
            }

            return new Date(latestPayment.nextDueDate) <= today;
        })
        .map((agreement) => agreement.id);

    // ---------------------------------------------------------
    // STEP 3:
    // Total matching customers.
    // ---------------------------------------------------------

    const total = dueAgreementIds.length;

    const totalPages = Math.ceil(total / pageSize);

    // If requested page is beyond available pages
    if (total === 0 || skip >= total) {
        return {
            data: [],
            total,
            page: currentPage,
            limit: pageSize,
            totalPages,
        };
    }

    // ---------------------------------------------------------
    // STEP 4:
    // Paginate IDs.
    // ---------------------------------------------------------

    const paginatedIds = dueAgreementIds.slice(
        skip,
        skip + pageSize
    );

    // ---------------------------------------------------------
    // STEP 5:
    // Fetch only the current page's full records.
    // ---------------------------------------------------------

    const agreements =
        await prisma.installmentAgreement.findMany({
            where: {
                id: {
                    in: paginatedIds,
                },
            },

            include: {
                customer: {
                    include: {
                        guarantors: true,
                    },
                },

                bike: true,

                mobile: true,

                payments: {
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: 1,
                },
            },
        });

    // ---------------------------------------------------------
    // Keep same order as paginatedIds
    // ---------------------------------------------------------

    const orderedAgreements = paginatedIds
        .map((id) =>
            agreements.find(
                (agreement) => agreement.id === id
            )
        )
        .filter(
            (
                agreement
            ): agreement is NonNullable<typeof agreement> =>
                agreement !== undefined
        );

    return {
        data: orderedAgreements,
        total,
        page: currentPage,
        limit: pageSize,
        totalPages,
    };
}