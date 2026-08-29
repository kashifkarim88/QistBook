"use client";

import { Calendar, RotateCcw } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

type DashboardFiltersProps = {
    availableYears: number[];
    selectedYear: number | null;
    selectedMonth: number | null;
};

const MONTHS = [
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

export default function DashboardFilters({
    availableYears,
    selectedYear,
    selectedMonth,
}: DashboardFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [isPending, startTransition] =
        useTransition();

    function updateFilters(
        year: string,
        month: string
    ) {
        const params = new URLSearchParams(
            searchParams.toString()
        );

        params.delete("year");
        params.delete("month");

        if (year) {
            params.set("year", year);
        }

        if (year && month) {
            params.set("month", month);
        }

        startTransition(() => {
            router.push(
                `${pathname}?${params.toString()}`
            );
        });
    }

    function resetFilters() {
        startTransition(() => {
            router.push(pathname);
        });
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

                {/* Heading */}
                <div>
                    <div className="flex items-center gap-2">
                        <Calendar
                            size={18}
                            className="text-blue-600"
                        />

                        <h2 className="font-semibold text-gray-900">
                            Dashboard Filters
                        </h2>
                    </div>

                    <p className="mt-1 text-sm text-gray-500">
                        Drill down from overall statistics
                        to a specific year or month.
                    </p>
                </div>

                {/* Controls */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:min-w-[500px]">

                    {/* Year */}
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-600">
                            Year
                        </label>

                        <select
                            value={
                                selectedYear
                                    ? String(selectedYear)
                                    : ""
                            }
                            onChange={(event) => {
                                updateFilters(
                                    event.target.value,
                                    selectedMonth
                                        ? String(
                                            selectedMonth
                                        )
                                        : ""
                                );
                            }}
                            disabled={isPending}
                            className="
                                w-full
                                rounded-xl
                                border
                                border-gray-200
                                bg-white
                                px-3
                                py-2.5
                                text-sm
                                text-gray-800
                                outline-none
                                transition
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-100
                                disabled:opacity-60
                            "
                        >
                            <option value="">
                                All Time
                            </option>

                            {availableYears.map(
                                (year) => (
                                    <option
                                        key={year}
                                        value={year}
                                    >
                                        {year}
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    {/* Month */}
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-600">
                            Month
                        </label>

                        <select
                            value={
                                selectedMonth
                                    ? String(
                                        selectedMonth
                                    )
                                    : ""
                            }
                            onChange={(event) => {
                                if (!selectedYear) {
                                    return;
                                }

                                updateFilters(
                                    String(
                                        selectedYear
                                    ),
                                    event.target.value
                                );
                            }}
                            disabled={
                                !selectedYear ||
                                isPending
                            }
                            className="
                                w-full
                                rounded-xl
                                border
                                border-gray-200
                                bg-white
                                px-3
                                py-2.5
                                text-sm
                                text-gray-800
                                outline-none
                                transition
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-100
                                disabled:bg-gray-50
                                disabled:text-gray-400
                            "
                        >
                            <option value="">
                                Entire Year
                            </option>

                            {MONTHS.map((month) => (
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
                    {(selectedYear ||
                        selectedMonth) && (
                            <button
                                type="button"
                                onClick={resetFilters}
                                disabled={isPending}
                                className="
                                col-span-full
                                flex
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                border
                                border-gray-200
                                px-3
                                py-2.5
                                text-sm
                                font-medium
                                text-gray-600
                                transition
                                hover:bg-gray-50
                                disabled:opacity-60
                                sm:col-span-2
                            "
                            >
                                <RotateCcw size={15} />

                                {isPending
                                    ? "Updating..."
                                    : "Reset to All Time"}
                            </button>
                        )}
                </div>
            </div>
        </div>
    );
}