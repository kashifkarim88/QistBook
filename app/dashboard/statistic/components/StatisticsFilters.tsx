"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { Filter, RotateCcw } from "lucide-react";

type StatisticsFiltersProps = {
    availableYears: number[];
    selectedYear: number | null;
    selectedMonth: number | null;
};

const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
];

export default function StatisticsFilters({
    availableYears,
    selectedYear,
    selectedMonth,
}: StatisticsFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const updateFilters = (year?: number, month?: number) => {
        const params = new URLSearchParams();

        if (year) {
            params.set("year", String(year));
        }

        if (month && year) {
            params.set("month", String(month));
        }

        const queryString = params.toString();

        startTransition(() => {
            router.replace(
                queryString ? `${pathname}?${queryString}` : pathname
            );
        });
    };

    const handleYearChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const value = event.target.value;

        if (!value) {
            // "All Years" selected
            updateFilters();
            return;
        }

        // Changing year resets month
        updateFilters(Number(value));
    };

    const handleMonthChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const value = event.target.value;

        if (!selectedYear) {
            return;
        }

        if (!value) {
            // "All Months" selected
            updateFilters(selectedYear);
            return;
        }

        updateFilters(selectedYear, Number(value));
    };

    const handleReset = () => {
        updateFilters();
    };

    const hasFilters = selectedYear !== null || selectedMonth !== null;

    return (
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Left Side */}
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Filter className="h-5 w-5" />
                    </div>

                    <div>
                        <h2 className="text-sm font-semibold text-foreground">
                            Statistics Filters
                        </h2>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                            Choose a year and month to analyze your business
                            performance.
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                    {/* Year */}
                    <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:min-w-40">
                        <label
                            htmlFor="statistics-year"
                            className="text-xs font-medium text-muted-foreground"
                        >
                            Year
                        </label>

                        <select
                            id="statistics-year"
                            value={selectedYear ?? ""}
                            onChange={handleYearChange}
                            disabled={isPending}
                            className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <option value="">All Years</option>

                            {availableYears.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Month */}
                    <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:min-w-40">
                        <label
                            htmlFor="statistics-month"
                            className="text-xs font-medium text-muted-foreground"
                        >
                            Month
                        </label>

                        <select
                            id="statistics-month"
                            value={selectedMonth ?? ""}
                            onChange={handleMonthChange}
                            disabled={!selectedYear || isPending}
                            className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="">All Months</option>

                            {months.map((month) => (
                                <option
                                    key={month.value}
                                    value={month.value}
                                >
                                    {month.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Reset */}
                    {hasFilters && (
                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={isPending}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <RotateCcw className="h-4 w-4" />
                            Reset
                        </button>
                    )}
                </div>
            </div>

            {/* Active Filter Summary */}
            <div className="mt-4 border-t border-border pt-4">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-muted-foreground">
                        Showing:
                    </span>

                    <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                        {selectedYear
                            ? selectedMonth
                                ? `${months[selectedMonth - 1].label} ${selectedYear}`
                                : `${selectedYear}`
                            : "All Time"}
                    </span>

                    {isPending && (
                        <span className="text-muted-foreground">
                            Updating...
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}