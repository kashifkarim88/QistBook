import {
    ArrowDownToLine,
    Wallet,
} from "lucide-react";

import type { DashboardStats } from "@/app/actions/statistics";

type ReceivablesCardProps = {
    data: DashboardStats;
};

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        maximumFractionDigits: 0,
    }).format(value);

export default function ReceivablesCard({
    data,
}: ReceivablesCardProps) {
    return (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
                    <Wallet className="h-5 w-5" />
                </div>

                <div>
                    <h3 className="font-semibold">
                        Outstanding Receivables
                    </h3>

                    <p className="text-xs text-muted-foreground">
                        Money still expected from customers.
                    </p>
                </div>
            </div>

            <div className="mt-6">
                <p className="text-3xl font-bold">
                    {formatCurrency(data.totalRemaining)}
                </p>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{
                            width: `${Math.min(
                                Math.max(data.collectionPercentage, 0),
                                100
                            )}%`,
                        }}
                    />
                </div>

                <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                        Collection progress
                    </span>

                    <span className="font-semibold">
                        {data.collectionPercentage.toFixed(1)}%
                    </span>
                </div>
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-xl bg-muted/40 p-3">
                <ArrowDownToLine className="h-4 w-4 text-muted-foreground" />

                <p className="text-xs text-muted-foreground">
                    {formatCurrency(data.totalPaid)} has already been collected.
                </p>
            </div>
        </div>
    );
}