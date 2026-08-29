"use server";

import { prisma } from "@/lib/prisma";

export type DashboardFilter = {
    year?: number;
    month?: number;
};

export type DashboardTrendItem = {
    label: string;
    value: number;
};

export type DashboardStats = {
    // Counts
    totalCustomers: number;
    totalAgreements: number;
    activeAgreements: number;
    completedAgreements: number;
    defaultedAgreements: number;
    mobileAgreements: number;
    bikeAgreements: number;

    // Financial
    totalAgreementValue: number;
    totalPaid: number;
    totalCollectedInPeriod: number;
    totalRemaining: number;
    collectionPercentage: number;

    // Payments
    paymentCount: number;

    // Filter
    selectedYear: number | null;
    selectedMonth: number | null;

    // Trend
    trendTitle: string;
    trendData: DashboardTrendItem[];

    // Available years
    availableYears: number[];
};

const MONTH_NAMES = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

function getDateRange(
    year?: number,
    month?: number
): { start: Date; end: Date } | null {
    if (!year) {
        return null;
    }

    if (month && month >= 1 && month <= 12) {
        const start = new Date(
            Date.UTC(year, month - 1, 1)
        );

        const end = new Date(
            Date.UTC(year, month, 0)
        );

        return { start, end };
    }

    const start = new Date(
        Date.UTC(year, 0, 1)
    );

    const end = new Date(
        Date.UTC(year, 11, 31)
    );

    return { start, end };
}

function getAgreementWhere(
    year?: number,
    month?: number
) {
    const range = getDateRange(year, month);

    if (!range) {
        return {};
    }

    return {
        startDate: {
            gte: range.start,
            lte: range.end,
        },
    };
}

function getPaymentWhere(
    year?: number,
    month?: number
) {
    const range = getDateRange(year, month);

    if (!range) {
        return {};
    }

    return {
        paymentDate: {
            gte: range.start,
            lte: range.end,
        },
    };
}

function getYear(date: Date) {
    return date.getUTCFullYear();
}

function getMonth(date: Date) {
    return date.getUTCMonth() + 1;
}

function getDay(date: Date) {
    return date.getUTCDate();
}

export async function getDashboardStats(
    filters: DashboardFilter = {}
): Promise<DashboardStats> {
    const currentYear = new Date().getUTCFullYear();

    let selectedYear =
        Number.isInteger(filters.year) && filters.year! >= 2000
            ? filters.year!
            : null;

    let selectedMonth =
        Number.isInteger(filters.month) &&
            filters.month! >= 1 &&
            filters.month! <= 12
            ? filters.month!
            : null;

    // Month only makes sense when a year is selected.
    if (!selectedYear) {
        selectedMonth = null;
    }

    // --------------------------------------------------
    // AVAILABLE YEARS
    // --------------------------------------------------

    const oldestAgreement = await prisma.installmentAgreement.aggregate({
        _min: {
            startDate: true,
        },
    });

    const oldestYear = oldestAgreement._min.startDate
        ? getYear(oldestAgreement._min.startDate)
        : currentYear;

    const availableYears: number[] = [];

    for (
        let year = currentYear;
        year >= oldestYear;
        year--
    ) {
        availableYears.push(year);
    }

    // --------------------------------------------------
    // AGREEMENT FILTER
    // --------------------------------------------------

    const agreementWhere = getAgreementWhere(
        selectedYear ?? undefined,
        selectedMonth ?? undefined
    );

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
        prisma.customer.count({
            where:
                selectedYear || selectedMonth
                    ? {
                        agreements: {
                            some: agreementWhere,
                        },
                    }
                    : undefined,
        }),

        prisma.installmentAgreement.count({
            where: agreementWhere,
        }),

        prisma.installmentAgreement.count({
            where: {
                ...agreementWhere,
                status: "ACTIVE",
            },
        }),

        prisma.installmentAgreement.count({
            where: {
                ...agreementWhere,
                status: "COMPLETED",
            },
        }),

        prisma.installmentAgreement.count({
            where: {
                ...agreementWhere,
                status: "DEFAULTED",
            },
        }),

        prisma.installmentAgreement.count({
            where: {
                ...agreementWhere,
                category: "MOBILE",
            },
        }),

        prisma.installmentAgreement.count({
            where: {
                ...agreementWhere,
                category: "BIKE",
            },
        }),
    ]);

    // --------------------------------------------------
    // SELECTED AGREEMENTS
    // --------------------------------------------------

    const selectedAgreements =
        await prisma.installmentAgreement.findMany({
            where: agreementWhere,
            select: {
                id: true,
                totalAmount: true,
            },
        });

    const selectedAgreementIds =
        selectedAgreements.map(
            (agreement) => agreement.id
        );

    // --------------------------------------------------
    // TOTAL AGREEMENT VALUE
    // --------------------------------------------------

    const totalAgreementValue =
        selectedAgreements.reduce(
            (sum, agreement) =>
                sum + Number(agreement.totalAmount),
            0
        );

    // --------------------------------------------------
    // ALL PAYMENTS MADE FOR SELECTED AGREEMENTS
    //
    // This gives the lifetime collection against the
    // agreements shown in the selected dashboard scope.
    // --------------------------------------------------

    let totalPaid = 0;

    if (selectedAgreementIds.length > 0) {
        const selectedAgreementPayments =
            await prisma.installmentPayment.aggregate({
                where: {
                    agreementId: {
                        in: selectedAgreementIds,
                    },
                },
                _sum: {
                    amountPaid: true,
                },
            });

        totalPaid = Number(
            selectedAgreementPayments._sum.amountPaid ?? 0
        );
    }

    // --------------------------------------------------
    // CURRENT PERIOD COLLECTION
    //
    // This is money actually collected during the
    // selected year/month.
    //
    // --------------------------------------------------

    const periodPaymentWhere = getPaymentWhere(
        selectedYear ?? undefined,
        selectedMonth ?? undefined
    );

    const periodPaymentTotal =
        await prisma.installmentPayment.aggregate({
            where: periodPaymentWhere,
            _sum: {
                amountPaid: true,
            },
        });

    const totalCollectedInPeriod = Number(
        periodPaymentTotal._sum.amountPaid ?? 0
    );

    // --------------------------------------------------
    // PAYMENT COUNT
    // --------------------------------------------------

    const paymentCount =
        await prisma.installmentPayment.count({
            where: periodPaymentWhere,
        });

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
            ? Math.min(
                100,
                (totalPaid / totalAgreementValue) * 100
            )
            : 0;

    // --------------------------------------------------
    // TREND
    //
    // All Time  -> yearly
    // Year      -> monthly
    // Month     -> daily
    // --------------------------------------------------

    let trendTitle = "Collection by Year";
    let trendData: DashboardTrendItem[] = [];

    // --------------------------------------------------
    // ALL TIME
    // --------------------------------------------------

    if (!selectedYear) {
        const payments =
            await prisma.installmentPayment.groupBy({
                by: ["paymentDate"],
                _sum: {
                    amountPaid: true,
                },
                orderBy: {
                    paymentDate: "asc",
                },
            });

        const yearlyMap = new Map<
            number,
            number
        >();

        for (const payment of payments) {
            const year = getYear(
                payment.paymentDate
            );

            yearlyMap.set(
                year,
                (yearlyMap.get(year) ?? 0) +
                Number(payment._sum.amountPaid ?? 0)
            );
        }

        trendData = availableYears
            .slice()
            .reverse()
            .map((year) => ({
                label: String(year),
                value: yearlyMap.get(year) ?? 0,
            }));

        trendTitle = "Collection by Year";
    }

    // --------------------------------------------------
    // YEAR
    // --------------------------------------------------

    else if (!selectedMonth) {
        const payments =
            await prisma.installmentPayment.groupBy({
                by: ["paymentDate"],
                where: {
                    paymentDate: {
                        gte: new Date(
                            Date.UTC(
                                selectedYear,
                                0,
                                1
                            )
                        ),
                        lte: new Date(
                            Date.UTC(
                                selectedYear,
                                11,
                                31
                            )
                        ),
                    },
                },
                _sum: {
                    amountPaid: true,
                },
                orderBy: {
                    paymentDate: "asc",
                },
            });

        const monthlyMap = new Map<
            number,
            number
        >();

        for (const payment of payments) {
            const month = getMonth(
                payment.paymentDate
            );

            monthlyMap.set(
                month,
                (monthlyMap.get(month) ?? 0) +
                Number(payment._sum.amountPaid ?? 0)
            );
        }

        trendData = MONTH_NAMES.map(
            (label, index) => ({
                label,
                value:
                    monthlyMap.get(index + 1) ??
                    0,
            })
        );

        trendTitle = `Collection in ${selectedYear}`;
    }

    // --------------------------------------------------
    // MONTH
    // --------------------------------------------------

    else {
        const range = getDateRange(
            selectedYear,
            selectedMonth
        );

        const payments =
            await prisma.installmentPayment.groupBy({
                by: ["paymentDate"],
                where: {
                    paymentDate: {
                        gte: range!.start,
                        lte: range!.end,
                    },
                },
                _sum: {
                    amountPaid: true,
                },
                orderBy: {
                    paymentDate: "asc",
                },
            });

        const daysInMonth =
            new Date(
                Date.UTC(
                    selectedYear,
                    selectedMonth,
                    0
                )
            ).getUTCDate();

        const dailyMap = new Map<
            number,
            number
        >();

        for (const payment of payments) {
            const day = getDay(
                payment.paymentDate
            );

            dailyMap.set(
                day,
                (dailyMap.get(day) ?? 0) +
                Number(payment._sum.amountPaid ?? 0)
            );
        }

        trendData = Array.from(
            { length: daysInMonth },
            (_, index) => ({
                label: String(index + 1),
                value:
                    dailyMap.get(index + 1) ??
                    0,
            })
        );

        trendTitle = `Daily Collection - ${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}`;
    }

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
        totalCollectedInPeriod,
        totalRemaining,
        collectionPercentage,

        paymentCount,

        selectedYear,
        selectedMonth,

        trendTitle,
        trendData,

        availableYears,
    };
}