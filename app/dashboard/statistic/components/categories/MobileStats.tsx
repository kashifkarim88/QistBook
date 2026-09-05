import {
    CheckCircle2,
    CreditCard,
    Smartphone,
    TrendingUp,
    Users,
    Wallet,
} from "lucide-react";

import type { CategoryStats } from "@/app/actions/statistics";

type MobileStatsProps = {
    data: CategoryStats;
};

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        maximumFractionDigits: 0,
    }).format(value);

export default function MobileStats({ data }: MobileStatsProps) {
    return (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Smartphone className="h-5 w-5" />
                </div>

                <div>
                    <h3 className="font-semibold">Mobile</h3>
                    <p className="text-xs text-muted-foreground">
                        Mobile installment performance
                    </p>
                </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
                <Stat
                    icon={TrendingUp}
                    label="Sales"
                    value={formatCurrency(data.sales)}
                />

                <Stat
                    icon={Wallet}
                    label="Investment"
                    value={formatCurrency(data.investment)}
                />

                <Stat
                    icon={CreditCard}
                    label="Collected"
                    value={formatCurrency(data.paid)}
                />

                <Stat
                    icon={Users}
                    label="Remaining"
                    value={formatCurrency(data.remaining)}
                />

                <Stat
                    icon={CheckCircle2}
                    label="Completed"
                    value={String(data.completed)}
                />

                <Stat
                    icon={TrendingUp}
                    label="Profit"
                    value={formatCurrency(data.profit)}
                    valueClassName="text-emerald-600 dark:text-emerald-400"
                />
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl bg-muted/40 p-3">
                <span className="text-xs text-muted-foreground">
                    Collection Rate
                </span>

                <span className="text-sm font-semibold">
                    {data.collectionPercentage.toFixed(1)}%
                </span>
            </div>
        </div>
    );
}

function Stat({
    icon: Icon,
    label,
    value,
    valueClassName = "",
}: {
    icon: React.ElementType;
    label: string;
    value: string;
    valueClassName?: string;
}) {
    return (
        <div className="rounded-xl border border-border bg-muted/20 p-3">
            <Icon className="h-4 w-4 text-muted-foreground" />

            <p className="mt-2 text-xs text-muted-foreground">
                {label}
            </p>

            <p className={`mt-1 text-sm font-semibold ${valueClassName}`}>
                {value}
            </p>
        </div>
    );
}