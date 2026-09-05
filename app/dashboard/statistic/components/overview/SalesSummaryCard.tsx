import {
    ShoppingBag,
    Users,
    FileText,
    CheckCircle2,
    Clock3,
    AlertTriangle,
} from "lucide-react";

import type { DashboardStats } from "@/app/actions/statistics";

type SalesSummaryCardProps = {
    data: DashboardStats;
};

const items = [
    {
        key: "totalCustomers",
        label: "Customers",
        icon: Users,
    },
    {
        key: "totalAgreements",
        label: "Agreements",
        icon: FileText,
    },
    {
        key: "activeAgreements",
        label: "Active",
        icon: Clock3,
    },
    {
        key: "completedAgreements",
        label: "Completed",
        icon: CheckCircle2,
    },
    {
        key: "defaultedAgreements",
        label: "Defaulted",
        icon: AlertTriangle,
    },
] as const;

export default function SalesSummaryCard({
    data,
}: SalesSummaryCardProps) {
    return (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ShoppingBag className="h-5 w-5" />
                </div>

                <div>
                    <h3 className="font-semibold">Business Activity</h3>
                    <p className="text-xs text-muted-foreground">
                        Customer and agreement status
                    </p>
                </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
                {items.map(({ key, label, icon: Icon }) => (
                    <div
                        key={key}
                        className="rounded-xl border border-border bg-muted/30 p-4"
                    >
                        <Icon className="h-4 w-4 text-muted-foreground" />

                        <p className="mt-3 text-xl font-bold">
                            {data[key]}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                            {label}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}