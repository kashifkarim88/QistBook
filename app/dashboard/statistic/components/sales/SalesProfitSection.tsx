import type { DashboardStats } from "@/app/actions/statistics";

import SalesTrendChart from "./SalesTrendChart";
import ProfitTrendChart from "./ProfitTrendChart";
import SalesBreakdown from "./SalesBreakdown";

type SalesProfitSectionProps = {
    data: DashboardStats;
};

export default function SalesProfitSection({
    data,
}: SalesProfitSectionProps) {
    return (
        <section className="space-y-4">
            <div>
                <h2 className="text-lg font-semibold tracking-tight">
                    Sales & Profit
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                    Track sales, investment, and profit performance over time.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <SalesTrendChart data={data} />
                <ProfitTrendChart data={data} />
            </div>

            <SalesBreakdown data={data} />
        </section>
    );
}