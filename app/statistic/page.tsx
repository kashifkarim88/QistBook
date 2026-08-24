import {
    BarChart3,
    CalendarDays,
} from "lucide-react";

import { getDashboardStats } from "@/app/actions/dashboard";

import DashboardStats from "./DashboardStats";
import AgreementStats from "./AgreementStats";
import FinancialOverview from "./FinancialOverview";

export const dynamic = "force-dynamic";

function formatToday() {
    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Karachi",
    }).format(new Date());
}

export default async function StatisticsDashboardPage() {

    const stats = await getDashboardStats();

    return (
        <main className="min-h-screen bg-gray-50 p-6">

            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                            <BarChart3 size={22} />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Business Dashboard
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Overview of your installment business
                            </p>
                        </div>

                    </div>

                    <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-600 shadow-sm">

                        <CalendarDays size={17} />

                        <span>
                            {formatToday()}
                        </span>

                    </div>

                </div>

                {/* Main statistics */}
                <DashboardStats
                    totalCustomers={stats.totalCustomers}
                    totalAgreements={stats.totalAgreements}
                    activeAgreements={stats.activeAgreements}
                    completedAgreements={stats.completedAgreements}
                    defaultedAgreements={stats.defaultedAgreements}
                />

                {/* Financial + Agreement */}
                <div className="mt-6 grid gap-6 lg:grid-cols-2">

                    <FinancialOverview
                        totalAgreementValue={
                            stats.totalAgreementValue
                        }
                        totalPaid={stats.totalPaid}
                        totalRemaining={
                            stats.totalRemaining
                        }
                        collectionPercentage={
                            stats.collectionPercentage
                        }
                    />

                    <AgreementStats
                        totalAgreements={
                            stats.totalAgreements
                        }
                        mobileAgreements={
                            stats.mobileAgreements
                        }
                        bikeAgreements={
                            stats.bikeAgreements
                        }
                    />

                </div>

            </div>

        </main>
    );
}