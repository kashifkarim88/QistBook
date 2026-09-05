import { Wallet } from "lucide-react";

import type { DashboardStats } from "@/app/actions/statistics";

type InvestmentCardProps = {
    data: DashboardStats;
};

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        maximumFractionDigits: 0,
    }).format(value);

export default function InvestmentCard({ data }: InvestmentCardProps) {
    return (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">
                        Investment
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                        {formatCurrency(data.totalInvestment)}
                    </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Wallet className="h-5 w-5" />
                </div>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
                Actual cost of products sold through agreements.
            </p>
        </div>
    );
}