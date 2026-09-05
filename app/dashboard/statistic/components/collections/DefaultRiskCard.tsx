import {
    AlertTriangle,
    ShieldAlert,
} from "lucide-react";

import type { DashboardStats } from "@/app/actions/statistics";

type DefaultRiskCardProps = {
    data: DashboardStats;
};

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        maximumFractionDigits: 0,
    }).format(value);

export default function DefaultRiskCard({
    data,
}: DefaultRiskCardProps) {
    return (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-600 dark:text-red-400">
                        <ShieldAlert className="h-5 w-5" />
                    </div>

                    <div>
                        <h3 className="font-semibold">
                            Default Risk
                        </h3>

                        <p className="text-xs text-muted-foreground">
                            Outstanding exposure from defaulted agreements.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />

                    <span className="text-sm font-medium">
                        {data.defaultedAgreements} defaulted agreements
                    </span>
                </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-red-500/5 p-4">
                    <p className="text-xs text-muted-foreground">
                        Defaulted Agreements
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                        {data.defaultedAgreements}
                    </p>
                </div>

                <div className="rounded-xl bg-red-500/5 p-4">
                    <p className="text-xs text-muted-foreground">
                        Outstanding Exposure
                    </p>

                    <p className="mt-2 text-2xl font-bold text-red-600 dark:text-red-400">
                        {formatCurrency(data.defaultedOutstanding)}
                    </p>
                </div>

                <div className="rounded-xl bg-muted/40 p-4">
                    <p className="text-xs text-muted-foreground">
                        Total Receivables
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                        {formatCurrency(data.totalRemaining)}
                    </p>
                </div>
            </div>
        </div>
    );
}