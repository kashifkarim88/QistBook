import { BarChart3 } from "lucide-react";

type StatisticsHeaderProps = {
    selectedYear: number | null;
    selectedMonth: number | null;
};

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

export default function StatisticsHeader({
    selectedYear,
    selectedMonth,
}: StatisticsHeaderProps) {
    const period =
        selectedYear && selectedMonth
            ? `${months[selectedMonth - 1]} ${selectedYear}`
            : selectedYear
                ? String(selectedYear)
                : "All Time";

    return (
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <BarChart3 className="h-5 w-5" />
                </div>

                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Statistics
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Business performance and financial analytics
                    </p>
                </div>
            </div>

            <div className="w-fit rounded-full border border-border bg-card px-4 py-2 text-sm font-medium shadow-sm">
                {period}
            </div>
        </header>
    );
}