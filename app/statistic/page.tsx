import {
    BarChart3,
    CalendarDays,
    Users,
    FileText,
    Activity,
    CheckCircle2,
    AlertTriangle,
    Smartphone,
    Bike,
    CircleDollarSign,
    Wallet,
    TrendingUp,
    Receipt,
    Home,
} from "lucide-react";
import Link from "next/link";

import { getDashboardStats } from "@/app/actions/dashboard";

import DashboardFilters from "./DashboardFilters";
import CollectionTrend from "./CollectionTrend";

export const dynamic = "force-dynamic";

type PageProps = {
    searchParams: Promise<{
        year?: string;
        month?: string;
    }>;
};

function formatToday() {
    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Karachi",
    }).format(new Date());
}

function formatAmount(amount: number) {
    return `Rs. ${amount.toLocaleString("en-PK")}`;
}

function getMonthName(month: number) {
    return new Intl.DateTimeFormat("en-US", {
        month: "long",
        timeZone: "UTC",
    }).format(
        new Date(Date.UTC(2024, month - 1, 1))
    );
}

function StatCard({
    title,
    value,
    icon,
    iconBg,
    iconColor,
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
    iconBg: string;
    iconColor: string;
}) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
            <div className="flex items-center justify-between gap-3">

                <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-gray-500 sm:text-sm">
                        {title}
                    </p>

                    <p className="mt-1 text-xl font-bold text-gray-900 sm:mt-2 sm:text-2xl">
                        {value.toLocaleString()}
                    </p>
                </div>

                <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor} sm:h-10 sm:w-10`}
                >
                    {icon}
                </div>
            </div>
        </div>
    );
}

type CategoryProps = {
    title: string;
    count: number;
    total: number;
    icon: React.ReactNode;
    containerClass: string;
    iconClass: string;
};

function CategoryCard({
    title,
    count,
    total,
    icon,
    containerClass,
    iconClass,
}: CategoryProps) {
    const percentage =
        total > 0
            ? (count / total) * 100
            : 0;

    return (
        <div
            className={`rounded-xl border p-4 ${containerClass}`}
        >
            <div className="flex items-center justify-between gap-3">

                <div className="flex items-center gap-2">

                    <div
                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconClass}`}
                    >
                        {icon}
                    </div>

                    <p className="text-sm font-medium text-gray-700">
                        {title}
                    </p>
                </div>

                <span className="text-xs font-semibold text-gray-500">
                    {percentage.toFixed(0)}%
                </span>
            </div>

            <p className="mt-3 text-2xl font-bold text-gray-900">
                {count.toLocaleString()}
            </p>

            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/70">
                <div
                    className="h-full rounded-full bg-current"
                    style={{
                        width: `${percentage}%`,
                    }}
                />
            </div>
        </div>
    );
}

export default async function StatisticsDashboardPage({
    searchParams,
}: PageProps) {
    const params = await searchParams;

    const yearValue = Number(params.year);
    const monthValue = Number(params.month);

    const year =
        Number.isInteger(yearValue) &&
            yearValue >= 2000
            ? yearValue
            : undefined;

    const month =
        Number.isInteger(monthValue) &&
            monthValue >= 1 &&
            monthValue <= 12
            ? monthValue
            : undefined;

    const stats = await getDashboardStats({
        year,
        month,
    });

    let filterLabel = "All Time";

    if (stats.selectedYear && stats.selectedMonth) {
        filterLabel = `${getMonthName(
            stats.selectedMonth
        )} ${stats.selectedYear}`;
    } else if (stats.selectedYear) {
        filterLabel = String(
            stats.selectedYear
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-5 sm:p-6">

            <div className="mx-auto max-w-7xl">

                {/* -------------------------------- */}
                {/* HEADER */}
                {/* -------------------------------- */}

                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    {/* Dashboard title */}
                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                            <BarChart3 size={22} />
                        </div>

                        <div>
                            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                                Business Dashboard
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Overall and period-based installment statistics
                            </p>
                        </div>

                    </div>

                    {/* Right side actions */}
                    <div className="flex flex-wrap items-center gap-2">

                        {/* Today */}
                        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-600 shadow-sm">
                            <CalendarDays size={17} />

                            <span>
                                {formatToday()}
                            </span>
                        </div>

                        {/* Home */}
                        <Link
                            href="/dashboard"
                            className="
                                group
                                inline-flex
                                items-center
                                gap-2
                                rounded-xl
                                border
                                border-gray-200
                                bg-white
                                px-3
                                py-2
                                text-sm
                                font-medium
                                text-gray-700
                                shadow-sm
                                transition-all
                                duration-200
                                hover:border-blue-200
                                hover:bg-blue-50
                                hover:text-blue-700
                                hover:shadow-md
                                active:scale-95
                                focus:outline-none
                                focus:ring-2
                                focus:ring-blue-200
                                focus:ring-offset-2
                            "
                        >
                            <span
                                className="
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-blue-50
                                    text-blue-600
                                    transition-colors
                                    group-hover:bg-blue-100
                                "
                            >
                                <Home size={17} />
                            </span>

                            <span>Home</span>
                        </Link>

                    </div>
                </div>

                {/* -------------------------------- */}
                {/* FILTERS */}
                {/* -------------------------------- */}

                <DashboardFilters
                    availableYears={
                        stats.availableYears
                    }
                    selectedYear={
                        stats.selectedYear
                    }
                    selectedMonth={
                        stats.selectedMonth
                    }
                />

                {/* -------------------------------- */}
                {/* ACTIVE FILTER */}
                {/* -------------------------------- */}

                <div className="mt-5 flex flex-col gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
                            Showing statistics for
                        </p>

                        <p className="mt-0.5 text-sm font-semibold text-blue-900">
                            {filterLabel}
                        </p>
                    </div>

                    <p className="text-xs text-blue-700">
                        {stats.totalAgreements.toLocaleString()} agreements in this view
                    </p>
                </div>

                {/* -------------------------------- */}
                {/* MAIN STATISTICS */}
                {/* -------------------------------- */}

                <section className="mt-6">

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">

                        <StatCard
                            title="Customers"
                            value={
                                stats.totalCustomers
                            }
                            icon={
                                <Users size={18} />
                            }
                            iconBg="bg-blue-50"
                            iconColor="text-blue-600"
                        />

                        <StatCard
                            title="Agreements"
                            value={
                                stats.totalAgreements
                            }
                            icon={
                                <FileText size={18} />
                            }
                            iconBg="bg-purple-50"
                            iconColor="text-purple-600"
                        />

                        <StatCard
                            title="Active"
                            value={
                                stats.activeAgreements
                            }
                            icon={
                                <Activity size={18} />
                            }
                            iconBg="bg-green-50"
                            iconColor="text-green-600"
                        />

                        <StatCard
                            title="Completed"
                            value={
                                stats.completedAgreements
                            }
                            icon={
                                <CheckCircle2
                                    size={18}
                                />
                            }
                            iconBg="bg-emerald-50"
                            iconColor="text-emerald-600"
                        />

                        <StatCard
                            title="Defaulted"
                            value={
                                stats.defaultedAgreements
                            }
                            icon={
                                <AlertTriangle
                                    size={18}
                                />
                            }
                            iconBg="bg-red-50"
                            iconColor="text-red-600"
                        />
                    </div>
                </section>

                {/* -------------------------------- */}
                {/* FINANCIAL OVERVIEW */}
                {/* -------------------------------- */}

                <section className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

                        <div className="flex items-start justify-between gap-4">

                            <div>
                                <h2 className="font-semibold text-gray-900">
                                    Financial Overview
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Financial performance of the selected agreement period
                                </p>
                            </div>

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
                                <TrendingUp size={19} />
                            </div>
                        </div>

                        <div className="mt-7 grid gap-5 sm:grid-cols-2">

                            {/* Agreement Value */}
                            <div>
                                <div className="flex items-center gap-2 text-gray-500">

                                    <CircleDollarSign
                                        size={17}
                                    />

                                    <p className="text-sm">
                                        Agreement Value
                                    </p>
                                </div>

                                <p className="mt-2 text-xl font-bold text-gray-900">
                                    {formatAmount(
                                        stats.totalAgreementValue
                                    )}
                                </p>

                                <p className="mt-1 text-xs text-gray-400">
                                    Agreements started in selected period
                                </p>
                            </div>

                            {/* Selected Agreement Collection */}
                            <div>
                                <div className="flex items-center gap-2 text-gray-500">

                                    <Wallet size={17} />

                                    <p className="text-sm">
                                        Collected
                                    </p>
                                </div>

                                <p className="mt-2 text-xl font-bold text-green-600">
                                    {formatAmount(
                                        stats.totalPaid
                                    )}
                                </p>

                                <p className="mt-1 text-xs text-gray-400">
                                    Total payments against these agreements
                                </p>
                            </div>

                            {/* Period Collection */}
                            <div>
                                <div className="flex items-center gap-2 text-gray-500">

                                    <Receipt size={17} />

                                    <p className="text-sm">
                                        Collected in Period
                                    </p>
                                </div>

                                <p className="mt-2 text-xl font-bold text-purple-600">
                                    {formatAmount(
                                        stats.totalCollectedInPeriod
                                    )}
                                </p>

                                <p className="mt-1 text-xs text-gray-400">
                                    {stats.paymentCount.toLocaleString()} payments
                                </p>
                            </div>

                            {/* Outstanding */}
                            <div>
                                <div className="flex items-center gap-2 text-gray-500">

                                    <Wallet size={17} />

                                    <p className="text-sm">
                                        Outstanding
                                    </p>
                                </div>

                                <p className="mt-2 text-xl font-bold text-blue-600">
                                    {formatAmount(
                                        stats.totalRemaining
                                    )}
                                </p>

                                <p className="mt-1 text-xs text-gray-400">
                                    Remaining balance
                                </p>
                            </div>
                        </div>

                        {/* Progress */}
                        <div className="mt-8">

                            <div className="flex items-center justify-between gap-3">

                                <div>
                                    <p className="text-sm font-medium text-gray-700">
                                        Collection Progress
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500">
                                        Collected against selected agreements
                                    </p>
                                </div>

                                <p className="text-lg font-bold text-blue-600">
                                    {stats.collectionPercentage.toFixed(
                                        1
                                    )}
                                    %
                                </p>
                            </div>

                            <div className="mt-3 h-3 overflow-hidden rounded-full bg-gray-100">
                                <div
                                    className="h-full rounded-full bg-blue-600 transition-all"
                                    style={{
                                        width: `${stats.collectionPercentage}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* -------------------------------- */}
                    {/* ITEM BREAKDOWN */}
                    {/* -------------------------------- */}

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                                <FileText size={19} />
                            </div>

                            <div>
                                <h2 className="font-semibold text-gray-900">
                                    Installment Items
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Mobile and bike distribution
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">

                            <CategoryCard
                                title="Mobile"
                                count={
                                    stats.mobileAgreements
                                }
                                total={
                                    stats.totalAgreements
                                }
                                icon={
                                    <Smartphone
                                        size={18}
                                    />
                                }
                                containerClass="border-blue-100 bg-blue-50/60 text-blue-600"
                                iconClass="bg-blue-100 text-blue-600"
                            />

                            <CategoryCard
                                title="Bike"
                                count={
                                    stats.bikeAgreements
                                }
                                total={
                                    stats.totalAgreements
                                }
                                icon={
                                    <Bike size={18} />
                                }
                                containerClass="border-orange-100 bg-orange-50/60 text-orange-600"
                                iconClass="bg-orange-100 text-orange-600"
                            />
                        </div>
                    </div>
                </section>

                {/* -------------------------------- */}
                {/* TREND */}
                {/* -------------------------------- */}

                <section className="mt-6">
                    <CollectionTrend
                        title={stats.trendTitle}
                        data={stats.trendData}
                    />
                </section>

            </div>
        </main>
    );
}