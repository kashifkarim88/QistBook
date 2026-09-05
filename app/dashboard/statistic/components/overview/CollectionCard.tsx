import { CreditCard, WalletCards } from "lucide-react";

import type { DashboardStats } from "@/app/actions/statistics";

type CollectionCardProps = {
    data: DashboardStats;
};

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        maximumFractionDigits: 0,
    }).format(value);

export default function CollectionCard({ data }: CollectionCardProps) {
    return (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">
                        Receivables
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                        {formatCurrency(data.totalRemaining)}
                    </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
                    <WalletCards className="h-5 w-5" />
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />

                    <span className="text-xs text-muted-foreground">
                        Collection rate
                    </span>
                </div>

                <span className="text-sm font-semibold">
                    {data.collectionPercentage.toFixed(1)}%
                </span>
            </div>
        </div>
    );
}