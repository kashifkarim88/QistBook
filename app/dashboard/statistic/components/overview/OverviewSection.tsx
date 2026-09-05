import type { DashboardStats } from "@/app/actions/statistics";

import OverviewCards from "./OverviewCards";

type OverviewSectionProps = {
    data: DashboardStats;
};

export default function OverviewSection({
    data,
}: OverviewSectionProps) {
    return (
        <section className="space-y-4">
            <div>
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                    Business Overview
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                    A quick summary of your sales, investment, profit, and
                    collection performance.
                </p>
            </div>

            <OverviewCards data={data} />
        </section>
    );
}