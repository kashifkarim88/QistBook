import {
    ArrowDownToLine,
    ArrowUpRight,
    CircleDollarSign,
    CreditCard,
    Percent,
    ShoppingCart,
    Wallet,
} from "lucide-react";

import type { DashboardStats } from "@/app/actions/statistics";

type OverviewCardsProps = {
    data: DashboardStats;
};

type StatCardProps = {
    title: string;
    value: string;
    description: string;
    icon: React.ElementType;
    iconClassName: string;
    valueClassName?: string;
};

function StatCard({
    title,
    value,
    description,
    icon: Icon,
    iconClassName,
    valueClassName = "text-foreground",
}: StatCardProps) {
    return (
        <div className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-muted-foreground">
                        {title}
                    </p>

                    <p
                        className={`mt-2 truncate text-2xl font-bold tracking-tight sm:text-3xl ${valueClassName}`}
                    >
                        {value}
                    </p>

                    <p className="mt-2 text-xs text-muted-foreground">
                        {description}
                    </p>
                </div>

                <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
                >
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </div>
    );
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        maximumFractionDigits: 0,
    }).format(value);
};

const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
};

export default function OverviewCards({ data }: OverviewCardsProps) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {/* Sales */}
            <StatCard
                title="Total Sales"
                value={formatCurrency(data.totalSales)}
                description={`${data.totalAgreements} total agreements`}
                icon={ShoppingCart}
                iconClassName="bg-primary/10 text-primary"
            />

            {/* Investment */}
            <StatCard
                title="Total Investment"
                value={formatCurrency(data.totalInvestment)}
                description={`${data.totalAgreements} products financed`}
                icon={Wallet}
                iconClassName="bg-blue-500/10 text-blue-600 dark:text-blue-400"
            />

            {/* Gross Profit */}
            <StatCard
                title="Gross Profit"
                value={formatCurrency(data.grossProfit)}
                description={`${formatPercentage(data.grossMarginPercentage)} profit margin`}
                icon={ArrowUpRight}
                iconClassName="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                valueClassName="text-emerald-600 dark:text-emerald-400"
            />

            {/* Collected */}
            <StatCard
                title="Collected"
                value={formatCurrency(data.totalPaid)}
                description={`${formatPercentage(data.collectionPercentage)} of total sales collected`}
                icon={CreditCard}
                iconClassName="bg-violet-500/10 text-violet-600 dark:text-violet-400"
            />
        </div>
    );
}