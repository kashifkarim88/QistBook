import type { DashboardStats } from "@/app/actions/statistics";

import CategoryComparison from "./CategoryComparison";
import MobileStats from "./MobileStats";
import BikeStats from "./BikeStats";
import CategoryProfitChart from "./CategoryProfitChart";

type CategorySectionProps = {
    data: DashboardStats;
};

export default function CategorySection({
    data,
}: CategorySectionProps) {
    return (
        <section className="space-y-4">
            <div>
                <h2 className="text-lg font-semibold tracking-tight">
                    Mobile vs Bike
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                    Compare sales, investment, profit, and collection
                    performance by product category.
                </p>
            </div>

            <CategoryComparison data={data} />

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <MobileStats data={data.mobile} />
                <BikeStats data={data.bike} />
            </div>

            <CategoryProfitChart data={data} />
        </section>
    );
}