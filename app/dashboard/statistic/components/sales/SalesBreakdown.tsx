import {
    Bike,
    Smartphone,
    TrendingUp,
} from "lucide-react";

import type { DashboardStats } from "@/app/actions/statistics";

type SalesBreakdownProps = {
    data: DashboardStats;
};

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        maximumFractionDigits: 0,
    }).format(value);

function CategoryCard({
    title,
    icon: Icon,
    sales,
    investment,
    profit,
    agreements,
}: {
    title: string;
    icon: React.ElementType;
    sales: number;
    investment: number;
    profit: number;
    agreements: number;
}) {
    return (
        <div className="rounded-xl border border-border bg-muted/20 p-4">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background text-muted-foreground">
                    <Icon className="h-5 w-5" />
                </div>

                <div>
                    <h4 className="text-sm font-semibold">{title}</h4>
                    <p className="text-xs text-muted-foreground">
                        {agreements} agreements
                    </p>
                </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
                <div>
                    <p className="text-xs text-muted-foreground">Sales</p>
                    <p className="mt-1 text-sm font-semibold">
                        {formatCurrency(sales)}
                    </p>
                </div>

                <div>
                    <p className="text-xs text-muted-foreground">
                        Investment
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                        {formatCurrency(investment)}
                    </p>
                </div>

                <div>
                    <p className="text-xs text-muted-foreground">Profit</p>
                    <p className="mt-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(profit)}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function SalesBreakdown({
    data,
}: SalesBreakdownProps) {
    return (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <TrendingUp className="h-5 w-5" />
                </div>

                <div>
                    <h3 className="font-semibold">Sales Breakdown</h3>
                    <p className="text-xs text-muted-foreground">
                        Compare mobile and bike performance.
                    </p>
                </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <CategoryCard
                    title="Mobile"
                    icon={Smartphone}
                    sales={data.mobile.sales}
                    investment={data.mobile.investment}
                    profit={data.mobile.profit}
                    agreements={data.mobile.agreements}
                />

                <CategoryCard
                    title="Bike"
                    icon={Bike}
                    sales={data.bike.sales}
                    investment={data.bike.investment}
                    profit={data.bike.profit}
                    agreements={data.bike.agreements}
                />
            </div>
        </div>
    );
}