"use server";

import { prisma } from "@/lib/prisma";

export async function getCustomers(search?: string) {
    const query = search?.trim();

    const customers = await prisma.customer.findMany({
        where: query
            ? {
                OR: [
                    {
                        fullName: {
                            contains: query,
                            mode: "insensitive",
                        },
                    },
                    {
                        phone: {
                            contains: query,
                            mode: "insensitive",
                        },
                    },
                    {
                        cnic: {
                            contains: query,
                            mode: "insensitive",
                        },
                    },
                ],
            }
            : undefined,

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
    });

    return customers;
}