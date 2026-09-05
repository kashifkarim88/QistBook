"use client";

import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import type { DashboardStats } from "@/app/actions/statistics";

type CollectionTrendChartProps = {
    data: DashboardStats;
};

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PK", {
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(value);

export default function CollectionTrendChart({
    data,
}: CollectionTrendChartProps) {
    return (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div>
                <h3 className="font-semibold">Collection Trend</h3>

                <p className="mt-1 text-xs text-muted-foreground">
                    Payments collected over time.
                </p>
            </div>

            <div className="mt-6 h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data.trendData}
                        margin={{
                            top: 10,
                            right: 10,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            className="stroke-border"
                        />

                        <XAxis
                            dataKey="label"
                            tickLine={false}
                            axisLine={false}
                            fontSize={12}
                        />

                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            fontSize={12}
                            tickFormatter={formatCurrency}
                        />

                        <Tooltip
                            formatter={(value) =>
                                typeof value === "number"
                                    ? value.toLocaleString("en-PK")
                                    : value
                            }
                        />

                        <Area
                            type="monotone"
                            dataKey="collected"
                            name="Collected"
                            stroke="currentColor"
                            className="text-primary"
                            fill="currentColor"
                            fillOpacity={0.12}
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}