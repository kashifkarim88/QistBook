import {
    Bike,
    Smartphone,
    TrendingUp,
} from "lucide-react";

import type { DashboardStats } from "@/app/actions/statistics";

type CategoryComparisonProps = {
    data: DashboardStats;
};

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        maximumFractionDigits: 0,
    }).format(value);

export default function CategoryComparison({
    data,
}: CategoryComparisonProps) {
    const categories = [
        {
            name: "Mobile",
            icon: Smartphone,
            stats: data.mobile,
        },
        {
            name: "Bike",
            icon: Bike,
            stats: data.bike,
        },
    ];

    return (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <TrendingUp className="h-5 w-5" />
                </div>

                <div>
                    <h3 className="font-semibold">
                        Category Comparison
                    </h3>

                    <p className="text-xs text-muted-foreground">
                        Overall financial performance by category.
                    </p>
                </div>
            </div>

            <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[650px] text-sm">
                    <thead>
                        <tr className="border-b border-border text-left text-xs text-muted-foreground">
                            <th className="pb-3 font-medium">
                                Category
                            </th>
                            <th className="pb-3 font-medium">
                                Agreements
                            </th>
                            <th className="pb-3 font-medium">
                                Sales
                            </th>
                            <th className="pb-3 font-medium">
                                Investment
                            </th>
                            <th className="pb-3 font-medium">
                                Profit
                            </th>
                            <th className="pb-3 font-medium">
                                Margin
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {categories.map((category) => {
                            const Icon = category.icon;

                            return (
                                <tr
                                    key={category.name}
                                    className="border-b border-border last:border-0"
                                >
                                    <td className="py-4">
                                        <div className="flex items-center gap-2">
                                            <Icon className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">
                                                {category.name}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="py-4">
                                        {category.stats.agreements}
                                    </td>

                                    <td className="py-4 font-medium">
                                        {formatCurrency(
                                            category.stats.sales
                                        )}
                                    </td>

                                    <td className="py-4">
                                        {formatCurrency(
                                            category.stats.investment
                                        )}
                                    </td>

                                    <td className="py-4 font-medium text-emerald-600 dark:text-emerald-400">
                                        {formatCurrency(
                                            category.stats.profit
                                        )}
                                    </td>

                                    <td className="py-4">
                                        {category.stats.marginPercentage.toFixed(
                                            1
                                        )}
                                        %
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}