"use server";

import { prisma } from "@/lib/prisma";

export async function getCustomers(
    page: number = 1,
    limit: number = 5,
    search: string = ""
) {
    const currentPage = Math.max(1, page);
    const pageSize = Math.max(1, Math.min(limit, 100));
    const skip = (currentPage - 1) * pageSize;

    const query = search.trim();

    const where = query
        ? {
            OR: [
                {
                    fullName: {
                        contains: query,
                    },
                },
                {
                    phone: {
                        contains: query,
                    },
                },
                {
                    cnic: {
                        contains: query,
                    },
                },
            ],
        }
        : undefined;

    // Get total number of matching customers
    const total = await prisma.customer.count({
        where,
    });

    const totalPages = Math.ceil(total / pageSize);

    // If requested page doesn't exist
    if (total === 0 || skip >= total) {
        return {
            data: [],
            total,
            page: currentPage,
            limit: pageSize,
            totalPages,
        };
    }

    // Get only the requested page
    const customers = await prisma.customer.findMany({
        where,

        include: {
            guarantors: true,

            agreements: {
                select: {
                    id: true,
                    totalAmount: true,
                    status: true,
                    category: true,
                    startDate: true,

                    payments: {
                        select: {
                            amountPaid: true,
                            remainingBalance: true,
                            paymentDate: true,
                        },

                        orderBy: {
                            paymentDate: "desc",
                        },

                        take: 1,
                    },
                },
            },
        },

        orderBy: {
            createdAt: "desc",
        },

        skip,
        take: pageSize,
    });

    return {
        data: customers,
        total,
        page: currentPage,
        limit: pageSize,
        totalPages,
    };
}