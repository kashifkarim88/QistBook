"use client";

import { useEffect, useState } from "react";
import {
    CalendarDays,
    CheckCircle2,
    Clock3,
    AlertTriangle,
    ShoppingCart,
    Wallet,
    TrendingUp,
    Banknote,
} from "lucide-react";

import {
    getDashboardStats,
    type DashboardStats,
} from "@/app/actions/statistics";

// ============================================================
// HELPERS
// ============================================================

const MONTHS = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
];

function money(value: number) {
    return new Intl.NumberFormat("en-PK", {
        maximumFractionDigits: 0,
    }).format(value);
}

// ============================================================
// SMALL COMPONENTS
// ============================================================

function ReportRow({
    label,
    value,
    description,
}: {
    label: string;
    value: string;
    description?: string;
}) {
    return (
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-4 last:border-0">
            <div>
                <p className="text-sm font-medium text-slate-700">
                    {label}
                </p>

                {description && (
                    <p className="mt-0.5 text-xs text-slate-400">
                        {description}
                    </p>
                )}
            </div>

            <p className="text-right text-base font-semibold text-slate-900">
                {value}
            </p>
        </div>
    );
}

function StatusBox({
    icon,
    title,
    value,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    value: number;
    description: string;
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-start gap-3">
                <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                    {icon}
                </div>

                <div>
                    <p className="text-sm font-medium text-slate-600">
                        {title}
                    </p>

                    <p className="mt-1 text-2xl font-bold text-slate-900">
                        {value}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// PAGE
// ============================================================

export default function StatisticsPage() {
    const [stats, setStats] =
        useState<DashboardStats | null>(null);

    const [year, setYear] =
        useState<number | "">("");

    const [month, setMonth] =
        useState<number | "">("");

    const [loading, setLoading] =
        useState(true);

    // --------------------------------------------------------
    // LOAD REPORT
    // --------------------------------------------------------

    async function loadReport() {
        setLoading(true);

        try {
            const data =
                await getDashboardStats({
                    year:
                        year === ""
                            ? undefined
                            : year,

                    month:
                        year !== "" &&
                            month !== ""
                            ? month
                            : undefined,
                });

            setStats(data);
        } catch (error) {
            console.error(
                "Failed to load statistics:",
                error
            );
        } finally {
            setLoading(false);
        }
    }

    // Load initially
    useEffect(() => {
        loadReport();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // --------------------------------------------------------
    // FILTER HANDLERS
    // --------------------------------------------------------

    function handleYearChange(
        value: string
    ) {
        if (value === "") {
            setYear("");
            setMonth("");
            return;
        }

        setYear(Number(value));
        setMonth("");
    }

    function handleMonthChange(
        value: string
    ) {
        if (value === "") {
            setMonth("");
            return;
        }

        setMonth(Number(value));
    }

    function applyFilter() {
        loadReport();
    }

    function clearFilter() {
        setYear("");
        setMonth("");

        setTimeout(() => {
            getDashboardStats({}).then(
                setStats
            );
        }, 0);
    }

    // --------------------------------------------------------
    // LOADING
    // --------------------------------------------------------

    if (loading && !stats) {
        return (
            <div className="flex min-h-[500px] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-800" />

                    <p className="mt-3 text-sm text-slate-500">
                        Preparing report...
                    </p>
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="p-6 text-center text-slate-500">
                Unable to load report.
            </div>
        );
    }

    // --------------------------------------------------------
    // REPORT TITLE
    // --------------------------------------------------------

    let reportPeriod =
        "All Time";

    if (
        stats.selectedYear &&
        stats.selectedMonth
    ) {
        const monthName =
            MONTHS.find(
                (m) =>
                    m.value ===
                    stats.selectedMonth
            )?.label;

        reportPeriod =
            `${monthName} ${stats.selectedYear}`;
    } else if (
        stats.selectedYear
    ) {
        reportPeriod =
            `Year ${stats.selectedYear}`;
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-6">
            <div className="mx-auto max-w-7xl">

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900">
                        Business Report
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Simple summary of your sales, payments and profit.
                    </p>
                </div>

                {/* ==================================================
                    FILTER
                ================================================== */}

                <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

                        <div>
                            <div className="flex items-center gap-2">
                                <CalendarDays
                                    size={18}
                                    className="text-slate-500"
                                />

                                <p className="font-semibold text-slate-800">
                                    Select Report Period
                                </p>
                            </div>

                            <p className="mt-1 text-xs text-slate-400">
                                Choose a year or a specific month.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">

                            {/* YEAR */}

                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-500">
                                    Year
                                </label>

                                <select
                                    value={year}
                                    onChange={(e) =>
                                        handleYearChange(
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 sm:w-40"
                                >
                                    <option value="">
                                        All Years
                                    </option>

                                    {stats.availableYears.map(
                                        (item) => (
                                            <option
                                                key={item}
                                                value={item}
                                            >
                                                {item}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            {/* MONTH */}

                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-500">
                                    Month
                                </label>

                                <select
                                    value={month}
                                    onChange={(e) =>
                                        handleMonthChange(
                                            e.target.value
                                        )
                                    }
                                    disabled={
                                        year === ""
                                    }
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none disabled:cursor-not-allowed disabled:bg-slate-100 sm:w-40"
                                >
                                    <option value="">
                                        Whole Year
                                    </option>

                                    {MONTHS.map(
                                        (item) => (
                                            <option
                                                key={
                                                    item.value
                                                }
                                                value={
                                                    item.value
                                                }
                                            >
                                                {
                                                    item.label
                                                }
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            {/* BUTTONS */}

                            <div className="flex items-end gap-2">
                                <button
                                    onClick={
                                        applyFilter
                                    }
                                    className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800"
                                >
                                    Show Report
                                </button>

                                <button
                                    onClick={
                                        clearFilter
                                    }
                                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ==================================================
                    REPORT PERIOD
                ================================================== */}

                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Report Period
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-slate-900">
                            {reportPeriod}
                        </h2>
                    </div>

                    {loading && (
                        <div className="text-sm text-slate-400">
                            Updating...
                        </div>
                    )}
                </div>

                {/* ==================================================
                    MAIN FINANCIAL SUMMARY
                ================================================== */}

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

                    {/* SALES */}

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-slate-100 p-2">
                                <ShoppingCart
                                    size={20}
                                    className="text-slate-700"
                                />
                            </div>

                            <p className="text-sm font-medium text-slate-500">
                                Total Sales
                            </p>
                        </div>

                        <p className="mt-4 text-2xl font-bold text-slate-900">
                            Rs. {money(stats.totalSales)}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                            Total amount customers agreed to pay
                        </p>
                    </div>

                    {/* INVESTMENT */}

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-slate-100 p-2">
                                <Wallet
                                    size={20}
                                    className="text-slate-700"
                                />
                            </div>

                            <p className="text-sm font-medium text-slate-500">
                                Your Investment
                            </p>
                        </div>

                        <p className="mt-4 text-2xl font-bold text-slate-900">
                            Rs.{" "}
                            {money(
                                stats.totalInvestment
                            )}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                            Money you paid for the products
                        </p>
                    </div>

                    {/* PROFIT */}

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-slate-100 p-2">
                                <TrendingUp
                                    size={20}
                                    className="text-slate-700"
                                />
                            </div>

                            <p className="text-sm font-medium text-slate-500">
                                Total Profit
                            </p>
                        </div>

                        <p className="mt-4 text-2xl font-bold text-slate-900">
                            Rs.{" "}
                            {money(
                                stats.grossProfit
                            )}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                            Sales minus product cost
                        </p>
                    </div>

                    {/* COLLECTED */}

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-slate-100 p-2">
                                <Banknote
                                    size={20}
                                    className="text-slate-700"
                                />
                            </div>

                            <p className="text-sm font-medium text-slate-500">
                                Money Collected
                            </p>
                        </div>

                        <p className="mt-4 text-2xl font-bold text-slate-900">
                            Rs.{" "}
                            {money(
                                stats.totalPaid
                            )}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                            Money received from customers
                        </p>
                    </div>
                </div>

                {/* ==================================================
                    MONEY POSITION
                ================================================== */}

                <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-3">
                        <h2 className="text-lg font-bold text-slate-900">
                            Money Position
                        </h2>

                        <p className="text-xs text-slate-400">
                            How much money has come in and how much is still expected.
                        </p>
                    </div>

                    <ReportRow
                        label="Total amount to collect"
                        description="Total customer payment agreed"
                        value={`Rs. ${money(
                            stats.totalSales
                        )}`}
                    />

                    <ReportRow
                        label="Money already collected"
                        description="Payments received so far"
                        value={`Rs. ${money(
                            stats.totalPaid
                        )}`}
                    />

                    <ReportRow
                        label="Money still remaining"
                        description="Amount customers still have to pay"
                        value={`Rs. ${money(
                            stats.totalRemaining
                        )}`}
                    />

                    <ReportRow
                        label="Collection"
                        description="Percentage of total sales already received"
                        value={`${stats.collectionPercentage}%`}
                    />
                </div>

                {/* ==================================================
                    BUSINESS STATUS
                ================================================== */}

                <div className="mt-6">
                    <div className="mb-3">
                        <h2 className="text-lg font-bold text-slate-900">
                            Customer Contracts
                        </h2>

                        <p className="text-xs text-slate-400">
                            Current condition of your installment contracts.
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">

                        <StatusBox
                            icon={
                                <Clock3 size={20} />
                            }
                            title="Active"
                            value={
                                stats.activeAgreements
                            }
                            description="Customers are still paying"
                        />

                        <StatusBox
                            icon={
                                <CheckCircle2
                                    size={20}
                                />
                            }
                            title="Completed"
                            value={
                                stats.completedAgreements
                            }
                            description="Customers have finished paying"
                        />

                        <StatusBox
                            icon={
                                <AlertTriangle
                                    size={20}
                                />
                            }
                            title="Defaulted"
                            value={
                                stats.defaultedAgreements
                            }
                            description="Payments are not being completed"
                        />
                    </div>
                </div>

                {/* ==================================================
                    PRODUCT SUMMARY
                ================================================== */}

                <div className="mt-6">
                    <div className="mb-3">
                        <h2 className="text-lg font-bold text-slate-900">
                            Products Sold
                        </h2>

                        <p className="text-xs text-slate-400">
                            Simple breakdown of the products sold on installment.
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">

                        {/* MOBILE */}

                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-slate-900">
                                        Mobile
                                    </h3>

                                    <p className="text-xs text-slate-400">
                                        Mobile installment sales
                                    </p>
                                </div>

                                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                                    {
                                        stats.mobile
                                            .agreements
                                    }{" "}
                                    sales
                                </span>
                            </div>

                            <ReportRow
                                label="Sales"
                                value={`Rs. ${money(
                                    stats.mobile
                                        .sales
                                )}`}
                            />

                            <ReportRow
                                label="Your investment"
                                value={`Rs. ${money(
                                    stats.mobile
                                        .investment
                                )}`}
                            />

                            <ReportRow
                                label="Profit"
                                value={`Rs. ${money(
                                    stats.mobile
                                        .profit
                                )}`}
                            />

                            <ReportRow
                                label="Collected"
                                value={`Rs. ${money(
                                    stats.mobile
                                        .paid
                                )}`}
                            />

                            <ReportRow
                                label="Remaining"
                                value={`Rs. ${money(
                                    stats.mobile
                                        .remaining
                                )}`}
                            />
                        </div>

                        {/* BIKE */}

                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-slate-900">
                                        Bike
                                    </h3>

                                    <p className="text-xs text-slate-400">
                                        Bike installment sales
                                    </p>
                                </div>

                                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                                    {
                                        stats.bike
                                            .agreements
                                    }{" "}
                                    sales
                                </span>
                            </div>

                            <ReportRow
                                label="Sales"
                                value={`Rs. ${money(
                                    stats.bike
                                        .sales
                                )}`}
                            />

                            <ReportRow
                                label="Your investment"
                                value={`Rs. ${money(
                                    stats.bike
                                        .investment
                                )}`}
                            />

                            <ReportRow
                                label="Profit"
                                value={`Rs. ${money(
                                    stats.bike
                                        .profit
                                )}`}
                            />

                            <ReportRow
                                label="Collected"
                                value={`Rs. ${money(
                                    stats.bike
                                        .paid
                                )}`}
                            />

                            <ReportRow
                                label="Remaining"
                                value={`Rs. ${money(
                                    stats.bike
                                        .remaining
                                )}`}
                            />
                        </div>
                    </div>
                </div>

                {/* ==================================================
                    PROFIT REPORT
                ================================================== */}

                <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-3">
                        <h2 className="text-lg font-bold text-slate-900">
                            Profit Report
                        </h2>

                        <p className="text-xs text-slate-400">
                            Simple view of earned and expected profit.
                        </p>
                    </div>

                    <ReportRow
                        label="Total profit"
                        description="Profit on all sales"
                        value={`Rs. ${money(
                            stats.grossProfit
                        )}`}
                    />

                    <ReportRow
                        label="Profit already received"
                        description="Profit included in money already collected"
                        value={`Rs. ${money(
                            stats.realizedProfit
                        )}`}
                    />

                    <ReportRow
                        label="Profit still expected"
                        description="Profit included in remaining payments"
                        value={`Rs. ${money(
                            stats.potentialProfit
                        )}`}
                    />

                    <ReportRow
                        label="Defaulted outstanding"
                        description="Money still unpaid from defaulted contracts"
                        value={`Rs. ${money(
                            stats.defaultedOutstanding
                        )}`}
                    />
                </div>

                {/* ==================================================
                    SMALL SUMMARY
                ================================================== */}

                <div className="mt-6 grid gap-4 md:grid-cols-3">

                    <div className="rounded-xl border border-slate-200 bg-white p-5">
                        <p className="text-xs text-slate-400">
                            Customers
                        </p>

                        <p className="mt-1 text-2xl font-bold text-slate-900">
                            {stats.totalCustomers}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                            Customers with installment sales
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-5">
                        <p className="text-xs text-slate-400">
                            Total Sales
                        </p>

                        <p className="mt-1 text-2xl font-bold text-slate-900">
                            {stats.totalAgreements}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                            Total installment contracts
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-5">
                        <p className="text-xs text-slate-400">
                            Payments Received
                        </p>

                        <p className="mt-1 text-2xl font-bold text-slate-900">
                            {stats.paymentCount}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                            Payments received in selected period
                        </p>
                    </div>
                </div>

                {/* ==================================================
                    FOOTER
                ================================================== */}

                <div className="py-8 text-center">
                    <p className="text-xs text-slate-400">
                        This report is based on your installment records.
                    </p>
                </div>
            </div>
        </div>
    );
}