function Skeleton({
    className = "",
}: {
    className?: string;
}) {
    return (
        <div
            className={`animate-pulse rounded-xl bg-muted ${className}`}
        />
    );
}

export default function StatisticsLoading() {
    return (
        <main className="w-full space-y-6 p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-11 w-11" />

                    <div className="space-y-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-64 max-w-full" />
                    </div>
                </div>

                <Skeleton className="h-9 w-28" />
            </div>

            {/* Filters */}
            <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-36" />
                        <Skeleton className="h-4 w-72 max-w-full" />
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Skeleton className="h-10 w-full sm:w-40" />
                        <Skeleton className="h-10 w-full sm:w-40" />
                    </div>
                </div>
            </div>

            {/* Overview */}
            <section className="space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-80 max-w-full" />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <Skeleton
                            key={index}
                            className="h-32 rounded-2xl"
                        />
                    ))}
                </div>
            </section>

            {/* Sales & Profit */}
            <section className="space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-96 max-w-full" />
                </div>

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                    <Skeleton className="h-80 rounded-2xl" />
                    <Skeleton className="h-80 rounded-2xl" />
                </div>

                <Skeleton className="h-56 rounded-2xl" />
            </section>

            {/* Collections */}
            <section className="space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-5 w-52" />
                    <Skeleton className="h-4 w-96 max-w-full" />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <Skeleton
                            key={index}
                            className="h-32 rounded-2xl"
                        />
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                    <Skeleton className="h-80 rounded-2xl" />
                    <Skeleton className="h-80 rounded-2xl" />
                </div>

                <Skeleton className="h-48 rounded-2xl" />
            </section>

            {/* Categories */}
            <section className="space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-96 max-w-full" />
                </div>

                <Skeleton className="h-64 rounded-2xl" />

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                    <Skeleton className="h-80 rounded-2xl" />
                    <Skeleton className="h-80 rounded-2xl" />
                </div>

                <Skeleton className="h-80 rounded-2xl" />
            </section>
        </main>
    );
}