import type { DashboardStats } from "@/app/actions/statistics";

import CollectionOverview from "./CollectionOverview";
import CollectionTrendChart from "./CollectionTrendChart";
import ReceivablesCard from "./ReceivablesCard";
import DefaultRiskCard from "./DefaultRiskCard";

type CollectionsSectionProps = {
    data: DashboardStats;
};

export default function CollectionsSection({
    data,
}: CollectionsSectionProps) {
    return (
        <section className="space-y-4">
            <div>
                <h2 className="text-lg font-semibold tracking-tight">
                    Collections & Receivables
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                    Monitor collected payments, outstanding balances, and
                    default risk.
                </p>
            </div>

            <CollectionOverview data={data} />

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <CollectionTrendChart data={data} />
                <ReceivablesCard data={data} />
            </div>

            <DefaultRiskCard data={data} />
        </section>
    );
}