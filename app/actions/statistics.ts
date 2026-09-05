"use server";

import { prisma } from "@/lib/prisma";

// ============================================================
// TYPES
// ============================================================

export type DashboardFilter = {
    year?: number;
    month?: number;
};

export type DashboardTrendItem = {
    label: string;

    // Sales
    sales: number;

    // Actual money invested in products
    investment: number;

    // Contractual gross profit
    profit: number;

    // Actual money collected
    collected: number;

    // Profit recognized from collected payments
    realizedProfit: number;
};

export type CategoryStats = {
    agreements: number;

    active: number;
    completed: number;
    defaulted: number;

    sales: number;
    investment: number;
    profit: number;
    marginPercentage: number;

    paid: number;
    remaining: number;
    collectionPercentage: number;

    realizedProfit: number;
    potentialProfit: number;

    defaultedOutstanding: number;

    averageSale: number;
    averageInvestment: number;
    averageProfit: number;
};

export type DashboardStats = {
    // ========================================================
    // BASIC COUNTS
    // ========================================================

    totalCustomers: number;
    totalAgreements: number;

    activeAgreements: number;
    completedAgreements: number;
    defaultedAgreements: number;

    mobileAgreements: number;
    bikeAgreements: number;

    // ========================================================
    // SALES & INVESTMENT
    // ========================================================

    totalSales: number;
    totalInvestment: number;
    grossProfit: number;
    grossMarginPercentage: number;

    averageSaleValue: number;
    averageInvestment: number;
    averageProfit: number;

    // ========================================================
    // COLLECTIONS
    // ========================================================

    totalPaid: number;
    totalRemaining: number;

    collectionPercentage: number;

    paymentCount: number;
    totalCollectedInPeriod: number;

    // ========================================================
    // PROFIT
    // ========================================================

    realizedProfit: number;
    potentialProfit: number;

    // ========================================================
    // DEFAULT / RISK
    // ========================================================

    defaultedOutstanding: number;

    // ========================================================
    // CATEGORY
    // ========================================================

    mobile: CategoryStats;
    bike: CategoryStats;

    // ========================================================
    // FILTER
    // ========================================================

    selectedYear: number | null;
    selectedMonth: number | null;

    // ========================================================
    // TREND
    // ========================================================

    trendTitle: string;
    trendData: DashboardTrendItem[];

    // ========================================================
    // AVAILABLE YEARS
    // ========================================================

    availableYears: number[];
};

// ============================================================
// CONSTANTS
// ============================================================

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

// ============================================================
// DATE HELPERS
// ============================================================

function getDateRange(
    year?: number,
    month?: number
): { start: Date; end: Date } | null {
    if (!year) {
        return null;
    }

    // Specific month
    if (
        month &&
        month >= 1 &&
        month <= 12
    ) {
        const start = new Date(
            Date.UTC(year, month - 1, 1)
        );

        const end = new Date(
            Date.UTC(year, month, 0)
        );

        return {
            start,
            end,
        };
    }

    // Entire year
    const start = new Date(
        Date.UTC(year, 0, 1)
    );

    const end = new Date(
        Date.UTC(year, 11, 31)
    );

    return {
        start,
        end,
    };
}

function getAgreementWhere(
    year?: number,
    month?: number
) {
    const range = getDateRange(
        year,
        month
    );

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
    const range = getDateRange(
        year,
        month
    );

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

function round(value: number) {
    return Number(value.toFixed(2));
}

// ============================================================
// EMPTY CATEGORY
// ============================================================

function emptyCategoryStats(): CategoryStats {
    return {
        agreements: 0,

        active: 0,
        completed: 0,
        defaulted: 0,

        sales: 0,
        investment: 0,
        profit: 0,
        marginPercentage: 0,

        paid: 0,
        remaining: 0,
        collectionPercentage: 0,

        realizedProfit: 0,
        potentialProfit: 0,

        defaultedOutstanding: 0,

        averageSale: 0,
        averageInvestment: 0,
        averageProfit: 0,
    };
}

// ============================================================
// CATEGORY CALCULATION
// ============================================================

function calculateCategoryStats(
    agreements: Array<{
        id: string;
        category: "MOBILE" | "BIKE";
        totalAmount: number;
        actualPrice: number;
        status: "ACTIVE" | "COMPLETED" | "DEFAULTED";
    }>,
    payments: Array<{
        agreementId: string;
        amountPaid: number;
    }>
): CategoryStats {
    const stats = emptyCategoryStats();

    if (agreements.length === 0) {
        return stats;
    }

    const agreementMap = new Map(
        agreements.map((agreement) => [
            agreement.id,
            agreement,
        ])
    );

    // --------------------------------------------------------
    // SALES / INVESTMENT
    // --------------------------------------------------------

    for (const agreement of agreements) {
        const sales = Number(
            agreement.totalAmount
        );

        const investment = Number(
            agreement.actualPrice
        );

        stats.agreements++;

        if (agreement.status === "ACTIVE") {
            stats.active++;
        }

        if (
            agreement.status === "COMPLETED"
        ) {
            stats.completed++;
        }

        if (
            agreement.status === "DEFAULTED"
        ) {
            stats.defaulted++;
        }

        stats.sales += sales;
        stats.investment += investment;
    }

    stats.profit =
        stats.sales -
        stats.investment;

    // --------------------------------------------------------
    // PAYMENTS
    // --------------------------------------------------------

    const paidMap = new Map<
        string,
        number
    >();

    for (const payment of payments) {
        if (
            !agreementMap.has(
                payment.agreementId
            )
        ) {
            continue;
        }

        const amount = Number(
            payment.amountPaid
        );

        paidMap.set(
            payment.agreementId,
            (paidMap.get(
                payment.agreementId
            ) ?? 0) + amount
        );
    }

    // --------------------------------------------------------
    // PROFIT / BALANCE
    // --------------------------------------------------------

    for (const agreement of agreements) {
        const sales = Number(
            agreement.totalAmount
        );

        const investment = Number(
            agreement.actualPrice
        );

        const paid =
            paidMap.get(
                agreement.id
            ) ?? 0;

        const remaining = Math.max(
            0,
            sales - paid
        );

        const agreementProfit =
            sales - investment;

        /*
         * Profit margin of this agreement.
         *
         * Example:
         *
         * Actual price = 80,000
         * Sale price   = 100,000
         *
         * Profit       = 20,000
         * Margin       = 20%
         *
         * If customer has paid 50,000,
         * recognized profit = 10,000.
         */

        const profitRatio =
            sales > 0
                ? agreementProfit / sales
                : 0;

        const realizedProfit =
            paid * profitRatio;

        const potentialProfit =
            remaining * profitRatio;

        stats.paid += paid;
        stats.remaining += remaining;

        stats.realizedProfit +=
            realizedProfit;

        stats.potentialProfit +=
            Math.max(
                0,
                potentialProfit
            );

        if (
            agreement.status ===
            "DEFAULTED"
        ) {
            stats.defaultedOutstanding +=
                remaining;
        }
    }

    // --------------------------------------------------------
    // PERCENTAGES
    // --------------------------------------------------------

    stats.marginPercentage =
        stats.sales > 0
            ? (stats.profit /
                stats.sales) *
            100
            : 0;

    stats.collectionPercentage =
        stats.sales > 0
            ? Math.min(
                100,
                (stats.paid /
                    stats.sales) *
                100
            )
            : 0;

    // --------------------------------------------------------
    // AVERAGES
    // --------------------------------------------------------

    stats.averageSale =
        stats.agreements > 0
            ? stats.sales /
            stats.agreements
            : 0;

    stats.averageInvestment =
        stats.agreements > 0
            ? stats.investment /
            stats.agreements
            : 0;

    stats.averageProfit =
        stats.agreements > 0
            ? stats.profit /
            stats.agreements
            : 0;

    // --------------------------------------------------------
    // ROUNDING
    // --------------------------------------------------------

    stats.sales = round(stats.sales);
    stats.investment =
        round(stats.investment);
    stats.profit =
        round(stats.profit);

    stats.marginPercentage =
        round(
            stats.marginPercentage
        );

    stats.paid =
        round(stats.paid);

    stats.remaining =
        round(stats.remaining);

    stats.collectionPercentage =
        round(
            stats.collectionPercentage
        );

    stats.realizedProfit =
        round(
            stats.realizedProfit
        );

    stats.potentialProfit =
        round(
            stats.potentialProfit
        );

    stats.defaultedOutstanding =
        round(
            stats.defaultedOutstanding
        );

    stats.averageSale =
        round(stats.averageSale);

    stats.averageInvestment =
        round(
            stats.averageInvestment
        );

    stats.averageProfit =
        round(stats.averageProfit);

    return stats;
}

// ============================================================
// MAIN DASHBOARD API
// ============================================================

export async function getDashboardStats(
    filters: DashboardFilter = {}
): Promise<DashboardStats> {

    const currentYear =
        new Date().getUTCFullYear();

    // ========================================================
    // FILTER VALIDATION
    // ========================================================

    let selectedYear =
        Number.isInteger(filters.year) &&
            filters.year! >= 2000
            ? filters.year!
            : null;

    let selectedMonth =
        Number.isInteger(filters.month) &&
            filters.month! >= 1 &&
            filters.month! <= 12
            ? filters.month!
            : null;

    // Month requires year
    if (!selectedYear) {
        selectedMonth = null;
    }

    // ========================================================
    // AVAILABLE YEARS
    // ========================================================

    const oldestAgreement =
        await prisma.installmentAgreement.aggregate({
            _min: {
                startDate: true,
            },
        });

    const oldestYear =
        oldestAgreement._min.startDate
            ? getYear(
                oldestAgreement._min.startDate
            )
            : currentYear;

    const availableYears: number[] = [];

    for (
        let year = currentYear;
        year >= oldestYear;
        year--
    ) {
        availableYears.push(
            year
        );
    }

    // ========================================================
    // WHERE CLAUSES
    // ========================================================

    const agreementWhere =
        getAgreementWhere(
            selectedYear ??
            undefined,
            selectedMonth ??
            undefined
        );

    const paymentWhere =
        getPaymentWhere(
            selectedYear ??
            undefined,
            selectedMonth ??
            undefined
        );

    // ========================================================
    // LOAD AGREEMENTS
    //
    // Agreements are filtered by SALE DATE.
    // ========================================================

    const selectedAgreements =
        await prisma.installmentAgreement.findMany(
            {
                where:
                    agreementWhere,

                select: {
                    id: true,
                    category: true,
                    totalAmount: true,
                    actualPrice: true,
                    status: true,
                    startDate: true,
                },
            }
        );

    const agreementIds =
        selectedAgreements.map(
            (agreement) =>
                agreement.id
        );

    // ========================================================
    // LOAD PAYMENTS FOR SELECTED AGREEMENTS
    //
    // These are lifetime payments against the selected
    // agreements. This allows us to calculate:
    //
    // totalPaid
    // remaining
    // realized profit
    // potential profit
    //
    // ========================================================

    const selectedAgreementPayments =
        agreementIds.length > 0
            ? await prisma.installmentPayment.findMany(
                {
                    where: {
                        agreementId: {
                            in: agreementIds,
                        },
                    },

                    select: {
                        agreementId: true,
                        amountPaid: true,
                    },
                }
            )
            : [];

    // ========================================================
    // PERIOD PAYMENTS
    //
    // These are payments actually received during the
    // selected month/year.
    //
    // ========================================================

    const periodPayments =
        await prisma.installmentPayment.findMany(
            {
                where:
                    paymentWhere,

                select: {
                    agreementId: true,
                    amountPaid: true,
                    paymentDate: true,
                },
            }
        );

    // ========================================================
    // BASIC COUNTS
    // ========================================================

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
                selectedYear ||
                    selectedMonth
                    ? {
                        agreements: {
                            some:
                                agreementWhere,
                        },
                    }
                    : undefined,
        }),

        prisma.installmentAgreement.count(
            {
                where:
                    agreementWhere,
            }
        ),

        prisma.installmentAgreement.count(
            {
                where: {
                    ...agreementWhere,
                    status:
                        "ACTIVE",
                },
            }
        ),

        prisma.installmentAgreement.count(
            {
                where: {
                    ...agreementWhere,
                    status:
                        "COMPLETED",
                },
            }
        ),

        prisma.installmentAgreement.count(
            {
                where: {
                    ...agreementWhere,
                    status:
                        "DEFAULTED",
                },
            }
        ),

        prisma.installmentAgreement.count(
            {
                where: {
                    ...agreementWhere,
                    category:
                        "MOBILE",
                },
            }
        ),

        prisma.installmentAgreement.count(
            {
                where: {
                    ...agreementWhere,
                    category:
                        "BIKE",
                },
            }
        ),
    ]);

    // ========================================================
    // TOTAL SALES
    //
    // totalAmount = price customer agreed to pay
    // ========================================================

    const totalSales =
        selectedAgreements.reduce(
            (sum, agreement) =>
                sum +
                Number(
                    agreement.totalAmount
                ),
            0
        );

    // ========================================================
    // TOTAL INVESTMENT
    //
    // actualPrice = what YOU paid for the product
    // ========================================================

    const totalInvestment =
        selectedAgreements.reduce(
            (sum, agreement) =>
                sum +
                Number(
                    agreement.actualPrice
                ),
            0
        );

    // ========================================================
    // GROSS PROFIT
    //
    // Sale Price - Actual Product Cost
    // ========================================================

    const grossProfit =
        totalSales -
        totalInvestment;

    // ========================================================
    // LIFETIME PAYMENTS
    // ========================================================

    const totalPaid =
        selectedAgreementPayments.reduce(
            (sum, payment) =>
                sum +
                Number(
                    payment.amountPaid
                ),
            0
        );

    // ========================================================
    // REMAINING
    // ========================================================

    const totalRemaining =
        Math.max(
            0,
            totalSales -
            totalPaid
        );

    // ========================================================
    // COLLECTION %
    // ========================================================

    const collectionPercentage =
        totalSales > 0
            ? Math.min(
                100,
                (totalPaid /
                    totalSales) *
                100
            )
            : 0;

    // ========================================================
    // GROSS MARGIN
    // ========================================================

    const grossMarginPercentage =
        totalSales > 0
            ? (grossProfit /
                totalSales) *
            100
            : 0;

    // ========================================================
    // PERIOD COLLECTION
    // ========================================================

    const totalCollectedInPeriod =
        periodPayments.reduce(
            (sum, payment) =>
                sum +
                Number(
                    payment.amountPaid
                ),
            0
        );

    const paymentCount =
        periodPayments.length;

    // ========================================================
    // REALIZED / POTENTIAL PROFIT
    //
    // Profit is recognized proportionally as payments
    // are collected.
    // ========================================================

    const agreementMap =
        new Map(
            selectedAgreements.map(
                (agreement) => [
                    agreement.id,
                    agreement,
                ]
            )
        );

    let realizedProfit = 0;
    let potentialProfit = 0;
    let defaultedOutstanding = 0;

    const paidByAgreement =
        new Map<
            string,
            number
        >();

    for (const payment of
        selectedAgreementPayments) {

        paidByAgreement.set(
            payment.agreementId,
            (paidByAgreement.get(
                payment.agreementId
            ) ?? 0) +
            Number(
                payment.amountPaid
            )
        );
    }

    for (const agreement of
        selectedAgreements) {

        const sale =
            Number(
                agreement.totalAmount
            );

        const investment =
            Number(
                agreement.actualPrice
            );

        const paid =
            paidByAgreement.get(
                agreement.id
            ) ?? 0;

        const remaining =
            Math.max(
                0,
                sale - paid
            );

        const profit =
            sale - investment;

        const profitRatio =
            sale > 0
                ? profit / sale
                : 0;

        realizedProfit +=
            paid * profitRatio;

        potentialProfit +=
            Math.max(
                0,
                remaining *
                profitRatio
            );

        if (
            agreement.status ===
            "DEFAULTED"
        ) {
            defaultedOutstanding +=
                remaining;
        }
    }

    // ========================================================
    // CATEGORY STATISTICS
    // ========================================================

    const mobileAgreementsData =
        selectedAgreements.filter(
            (agreement) =>
                agreement.category ===
                "MOBILE"
        );

    const bikeAgreementsData =
        selectedAgreements.filter(
            (agreement) =>
                agreement.category ===
                "BIKE"
        );

    const mobileIds =
        new Set(
            mobileAgreementsData.map(
                (agreement) =>
                    agreement.id
            )
        );

    const bikeIds =
        new Set(
            bikeAgreementsData.map(
                (agreement) =>
                    agreement.id
            )
        );

    const mobilePayments =
        selectedAgreementPayments.filter(
            (payment) =>
                mobileIds.has(
                    payment.agreementId
                )
        );

    const bikePayments =
        selectedAgreementPayments.filter(
            (payment) =>
                bikeIds.has(
                    payment.agreementId
                )
        );

    const mobile =
        calculateCategoryStats(
            mobileAgreementsData,
            mobilePayments
        );

    const bike =
        calculateCategoryStats(
            bikeAgreementsData,
            bikePayments
        );

    // ========================================================
    // AVERAGES
    // ========================================================

    const averageSale =
        totalAgreements > 0
            ? totalSales /
            totalAgreements
            : 0;

    const averageInvestment =
        totalAgreements > 0
            ? totalInvestment /
            totalAgreements
            : 0;

    const averageProfit =
        totalAgreements > 0
            ? grossProfit /
            totalAgreements
            : 0;

    // ========================================================
    // TREND
    //
    // ALL TIME  -> Yearly
    // YEAR      -> Monthly
    // MONTH     -> Daily
    //
    // Sales + Investment + Profit + Collection +
    // Realized Profit
    // ========================================================

    let trendTitle =
        "Financial Performance by Year";

    let trendData:
        DashboardTrendItem[] = [];

    // ========================================================
    // ALL TIME
    // ========================================================

    if (!selectedYear) {

        const allAgreements =
            await prisma.installmentAgreement.findMany(
                {
                    select: {
                        id: true,
                        totalAmount: true,
                        actualPrice: true,
                        startDate: true,
                    },
                }
            );

        const allPayments =
            await prisma.installmentPayment.findMany(
                {
                    select: {
                        agreementId: true,
                        amountPaid: true,
                        paymentDate: true,
                    },
                }
            );

        const agreementLookup =
            new Map(
                allAgreements.map(
                    (agreement) => [
                        agreement.id,
                        agreement,
                    ]
                )
            );

        const yearlyMap =
            new Map<
                number,
                DashboardTrendItem
            >();

        for (const agreement of
            allAgreements) {

            const year =
                getYear(
                    agreement.startDate
                );

            if (
                !yearlyMap.has(year)
            ) {
                yearlyMap.set(
                    year,
                    {
                        label:
                            String(
                                year
                            ),
                        sales: 0,
                        investment: 0,
                        profit: 0,
                        collected: 0,
                        realizedProfit: 0,
                    }
                );
            }

            const item =
                yearlyMap.get(
                    year
                )!;

            const sales =
                Number(
                    agreement.totalAmount
                );

            const investment =
                Number(
                    agreement.actualPrice
                );

            item.sales += sales;
            item.investment +=
                investment;

            item.profit +=
                sales -
                investment;
        }

        for (const payment of
            allPayments) {

            const agreement =
                agreementLookup.get(
                    payment.agreementId
                );

            if (!agreement) {
                continue;
            }

            const year =
                getYear(
                    agreement.startDate
                );

            const item =
                yearlyMap.get(
                    year
                );

            if (!item) {
                continue;
            }

            const amount =
                Number(
                    payment.amountPaid
                );

            const sale =
                Number(
                    agreement.totalAmount
                );

            const investment =
                Number(
                    agreement.actualPrice
                );

            const profit =
                sale -
                investment;

            const ratio =
                sale > 0
                    ? profit / sale
                    : 0;

            item.collected +=
                amount;

            item.realizedProfit +=
                amount * ratio;
        }

        trendData =
            Array.from(
                yearlyMap.values()
            )
                .sort(
                    (a, b) =>
                        Number(a.label) -
                        Number(b.label)
                )
                .map(
                    (item) => ({
                        label:
                            item.label,
                        sales:
                            round(
                                item.sales
                            ),
                        investment:
                            round(
                                item.investment
                            ),
                        profit:
                            round(
                                item.profit
                            ),
                        collected:
                            round(
                                item.collected
                            ),
                        realizedProfit:
                            round(
                                item.realizedProfit
                            ),
                    })
                );

        trendTitle =
            "Financial Performance by Year";
    }

    // ========================================================
    // YEAR
    // ========================================================

    else if (!selectedMonth) {

        const yearAgreements =
            selectedAgreements;

        const monthlyMap =
            new Map<
                number,
                DashboardTrendItem
            >();

        // Initialize all months
        for (
            let month = 1;
            month <= 12;
            month++
        ) {
            monthlyMap.set(
                month,
                {
                    label:
                        MONTH_NAMES[
                        month - 1
                        ],
                    sales: 0,
                    investment: 0,
                    profit: 0,
                    collected: 0,
                    realizedProfit: 0,
                }
            );
        }

        // ----------------------------------------------------
        // MONTHLY SALES
        // ----------------------------------------------------

        for (const agreement of
            yearAgreements) {

            const month =
                getMonth(
                    agreement.startDate
                );

            const item =
                monthlyMap.get(
                    month
                )!;

            const sales =
                Number(
                    agreement.totalAmount
                );

            const investment =
                Number(
                    agreement.actualPrice
                );

            item.sales += sales;

            item.investment +=
                investment;

            item.profit +=
                sales -
                investment;
        }

        // ----------------------------------------------------
        // MONTHLY COLLECTIONS
        // ----------------------------------------------------

        const yearPayments =
            await prisma.installmentPayment.findMany(
                {
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

                    select: {
                        agreementId: true,
                        amountPaid: true,
                        paymentDate: true,
                    },
                }
            );

        const allYearAgreements =
            await prisma.installmentAgreement.findMany(
                {
                    select: {
                        id: true,
                        totalAmount: true,
                        actualPrice: true,
                    },
                }
            );

        const lookup =
            new Map(
                allYearAgreements.map(
                    (agreement) => [
                        agreement.id,
                        agreement,
                    ]
                )
            );

        for (const payment of
            yearPayments) {

            const month =
                getMonth(
                    payment.paymentDate
                );

            const item =
                monthlyMap.get(
                    month
                )!;

            const agreement =
                lookup.get(
                    payment.agreementId
                );

            if (!agreement) {
                continue;
            }

            const amount =
                Number(
                    payment.amountPaid
                );

            const sale =
                Number(
                    agreement.totalAmount
                );

            const investment =
                Number(
                    agreement.actualPrice
                );

            const profit =
                sale -
                investment;

            const ratio =
                sale > 0
                    ? profit / sale
                    : 0;

            item.collected +=
                amount;

            item.realizedProfit +=
                amount * ratio;
        }

        trendData =
            Array.from(
                monthlyMap.values()
            ).map(
                (item) => ({
                    label:
                        item.label,
                    sales:
                        round(
                            item.sales
                        ),
                    investment:
                        round(
                            item.investment
                        ),
                    profit:
                        round(
                            item.profit
                        ),
                    collected:
                        round(
                            item.collected
                        ),
                    realizedProfit:
                        round(
                            item.realizedProfit
                        ),
                })
            );

        trendTitle =
            `Financial Performance in ${selectedYear}`;
    }

    // ========================================================
    // MONTH
    // ========================================================

    else {

        const range =
            getDateRange(
                selectedYear,
                selectedMonth
            );

        const daysInMonth =
            new Date(
                Date.UTC(
                    selectedYear,
                    selectedMonth,
                    0
                )
            ).getUTCDate();

        const dailyMap =
            new Map<
                number,
                DashboardTrendItem
            >();

        // Initialize days
        for (
            let day = 1;
            day <= daysInMonth;
            day++
        ) {
            dailyMap.set(
                day,
                {
                    label:
                        String(day),
                    sales: 0,
                    investment: 0,
                    profit: 0,
                    collected: 0,
                    realizedProfit: 0,
                }
            );
        }

        // ----------------------------------------------------
        // DAILY SALES
        // ----------------------------------------------------

        for (const agreement of
            selectedAgreements) {

            const day =
                getDay(
                    agreement.startDate
                );

            const item =
                dailyMap.get(
                    day
                )!;

            const sales =
                Number(
                    agreement.totalAmount
                );

            const investment =
                Number(
                    agreement.actualPrice
                );

            item.sales += sales;

            item.investment +=
                investment;

            item.profit +=
                sales -
                investment;
        }

        // ----------------------------------------------------
        // DAILY COLLECTION
        // ----------------------------------------------------

        for (const payment of
            periodPayments) {

            const day =
                getDay(
                    payment.paymentDate
                );

            const item =
                dailyMap.get(
                    day
                )!;

            const agreement =
                await prisma.installmentAgreement.findUnique(
                    {
                        where: {
                            id:
                                payment.agreementId,
                        },

                        select: {
                            totalAmount: true,
                            actualPrice: true,
                        },
                    }
                );

            if (!agreement) {
                continue;
            }

            const amount =
                Number(
                    payment.amountPaid
                );

            const sale =
                Number(
                    agreement.totalAmount
                );

            const investment =
                Number(
                    agreement.actualPrice
                );

            const profit =
                sale -
                investment;

            const ratio =
                sale > 0
                    ? profit / sale
                    : 0;

            item.collected +=
                amount;

            item.realizedProfit +=
                amount * ratio;
        }

        trendData =
            Array.from(
                dailyMap.values()
            ).map(
                (item) => ({
                    label:
                        item.label,
                    sales:
                        round(
                            item.sales
                        ),
                    investment:
                        round(
                            item.investment
                        ),
                    profit:
                        round(
                            item.profit
                        ),
                    collected:
                        round(
                            item.collected
                        ),
                    realizedProfit:
                        round(
                            item.realizedProfit
                        ),
                })
            );

        trendTitle =
            `Daily Financial Performance - ${MONTH_NAMES[
            selectedMonth - 1
            ]} ${selectedYear}`;
    }

    // ========================================================
    // FINAL RESULT
    // ========================================================

    return {
        // Counts
        totalCustomers,

        totalAgreements,

        activeAgreements,
        completedAgreements,
        defaultedAgreements,

        mobileAgreements,
        bikeAgreements,

        // Sales
        totalSales:
            round(totalSales),

        totalInvestment:
            round(totalInvestment),

        grossProfit:
            round(grossProfit),

        grossMarginPercentage:
            round(
                grossMarginPercentage
            ),

        averageSaleValue:
            round(averageSale),

        averageInvestment:
            round(
                averageInvestment
            ),

        averageProfit:
            round(averageProfit),

        // Collections
        totalPaid:
            round(totalPaid),

        totalRemaining:
            round(totalRemaining),

        collectionPercentage:
            round(
                collectionPercentage
            ),

        paymentCount,

        totalCollectedInPeriod:
            round(
                totalCollectedInPeriod
            ),

        // Profit
        realizedProfit:
            round(
                realizedProfit
            ),

        potentialProfit:
            round(
                potentialProfit
            ),

        // Risk
        defaultedOutstanding:
            round(
                defaultedOutstanding
            ),

        // Categories
        mobile,
        bike,

        // Filters
        selectedYear,
        selectedMonth,

        // Trend
        trendTitle,
        trendData,

        // Years
        availableYears,
    };
}