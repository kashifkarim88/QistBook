import {
    CircleDollarSign,
    Percent,
    Receipt,
    Wallet,
} from "lucide-react";

import type { DashboardStats } from "@/app/actions/statistics";

type CollectionOverviewProps = {
    data: DashboardStats;
};

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        maximumFractionDigits: 0,
    }).format(value);

export default function CollectionOverview({
    data,
}: CollectionOverviewProps) {
    const cards = [
        {
            title: "Total Collected",
            value: formatCurrency(data.totalPaid),
            description: `${data.paymentCount} payments`,
            icon: CircleDollarSign,
            className: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-500/10",
        },
        {
            title: "Collection Rate",
            value: `${data.collectionPercentage.toFixed(1)}%`,
            description: "Of total sales",
            icon: Percent,
            className: "text-primary",
            bg: "bg-primary/10",
        },
        {
            title: "Remaining",
            value: formatCurrency(data.totalRemaining),
            description: "Outstanding receivable",
            icon: Wallet,
            className: "text-orange-600 dark:text-orange-400",
            bg: "bg-orange-500/10",
        },
        {
            title: "Collected This Period",
            value: formatCurrency(data.totalCollectedInPeriod),
            description: "Payments in selected period",
            icon: Receipt,
            className: "text-violet-600 dark:text-violet-400",
            bg: "bg-violet-500/10",
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => {
                const Icon = card.icon;

                return (
                    <div
                        key={card.title}
                        className="rounded-2xl border border-border bg-card p-5 shadow-sm"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {card.title}
                                </p>

                                <p className={`mt-2 text-2xl font-bold ${card.className}`}>
                                    {card.value}
                                </p>

                                <p className="mt-2 text-xs text-muted-foreground">
                                    {card.description}
                                </p>
                            </div>

                            <div
                                className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.bg} ${card.className}`}
                            >
                                <Icon className="h-5 w-5" />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}