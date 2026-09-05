import { getDashboardStats } from "@/app/actions/statistics";

import StatisticsHeader from "./components/StatisticsHeader";
import StatisticsFilters from "./components/StatisticsFilters";

import OverviewSection from "./components/overview/OverviewSection";
import SalesProfitSection from "./components/sales/SalesProfitSection";
import CollectionsSection from "./components/collections/CollectionsSection";
import CategorySection from "./components/categories/CategorySection";

type StatisticsPageProps = {
    searchParams: Promise<{
        year?: string;
        month?: string;
    }>;
};

export default async function StatisticsPage({
    searchParams,
}: StatisticsPageProps) {
    const params = await searchParams;

    // --------------------------------------------------
    // Parse filters from URL
    // --------------------------------------------------

    const year = params.year
        ? Number(params.year)
        : undefined;

    const month = params.month
        ? Number(params.month)
        : undefined;

    // --------------------------------------------------
    // Get all dashboard statistics
    //
    // Server action handles:
    // - Sales
    // - Investment
    // - Profit
    // - Collections
    // - Receivables
    // - Defaults
    // - Mobile statistics
    // - Bike statistics
    // - Trends
    // --------------------------------------------------

    const statistics = await getDashboardStats({
        year,
        month,
    });

    return (
        <main className="w-full space-y-6 p-4 sm:p-6 lg:p-8">
            {/* ==========================================
                HEADER
            ========================================== */}

            <StatisticsHeader
                selectedYear={statistics.selectedYear}
                selectedMonth={statistics.selectedMonth}
            />

            {/* ==========================================
                FILTERS
            ========================================== */}

            <StatisticsFilters
                availableYears={
                    statistics.availableYears
                }
                selectedYear={
                    statistics.selectedYear
                }
                selectedMonth={
                    statistics.selectedMonth
                }
            />

            {/* ==========================================
                1. OVERVIEW
            ========================================== */}

            <section>
                <OverviewSection
                    data={statistics}
                />
            </section>

            {/* ==========================================
                2. SALES & PROFIT
            ========================================== */}

            <section>
                <SalesProfitSection
                    data={statistics}
                />
            </section>

            {/* ==========================================
                3. COLLECTIONS & RECEIVABLES
            ========================================== */}

            <section>
                <CollectionsSection
                    data={statistics}
                />
            </section>

            {/* ==========================================
                4. MOBILE VS BIKE
            ========================================== */}

            <section>
                <CategorySection
                    data={statistics}
                />
            </section>
        </main>
    );
}