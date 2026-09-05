"use client";

import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import type { DashboardStats } from "@/app/actions/statistics";

type SalesTrendChartProps = {
    data: DashboardStats;
};

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PK", {
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(value);

export default function SalesTrendChart({
    data,
}: SalesTrendChartProps) {
    return (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div>
                <h3 className="font-semibold">Sales Trend</h3>

                <p className="mt-1 text-xs text-muted-foreground">
                    {data.trendTitle}
                </p>
            </div>

            <div className="mt-6 h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
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

                        <Line
                            type="monotone"
                            dataKey="sales"
                            name="Sales"
                            stroke="currentColor"
                            className="text-primary"
                            strokeWidth={2.5}
                            dot={false}
                            activeDot={{ r: 5 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}