import { TrendingUp } from "lucide-react";

import type { DashboardStats } from "@/app/actions/statistics";

type ProfitCardProps = {
    data: DashboardStats;
};

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        maximumFractionDigits: 0,
    }).format(value);

export default function ProfitCard({ data }: ProfitCardProps) {
    return (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">
                        Gross Profit
                    </p>

                    <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(data.grossProfit)}
                    </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <TrendingUp className="h-5 w-5" />
                </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                    Profit margin
                </span>

                <span className="font-semibold">
                    {data.grossMarginPercentage.toFixed(1)}%
                </span>
            </div>
        </div>
    );
}