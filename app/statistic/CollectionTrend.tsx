import { BarChart3 } from "lucide-react";

type TrendItem = {
    label: string;
    value: number;
};

type CollectionTrendProps = {
    title: string;
    data: TrendItem[];
};

function formatAmount(amount: number) {
    return `Rs. ${amount.toLocaleString("en-PK")}`;
}

export default function CollectionTrend({
    title,
    data,
}: CollectionTrendProps) {
    const maxValue = Math.max(
        ...data.map((item) => item.value),
        1
    );

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

            {/* Header */}
            <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <BarChart3 size={19} />
                </div>

                <div>
                    <h2 className="font-semibold text-gray-900">
                        Collection Trend
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        {title}
                    </p>
                </div>
            </div>

            {/* Chart */}
            <div className="mt-6 overflow-x-auto">
                <div
                    className="
                        flex
                        min-w-full
                        items-end
                        gap-2
                        sm:gap-3
                    "
                    style={{
                        height: "250px",
                    }}
                >
                    {data.map((item) => {
                        const percentage =
                            item.value > 0
                                ? (item.value /
                                    maxValue) *
                                100
                                : 0;

                        return (
                            <div
                                key={item.label}
                                className="
                                    flex
                                    h-full
                                    min-w-[30px]
                                    flex-1
                                    flex-col
                                    items-center
                                    justify-end
                                    gap-2
                                "
                                title={`${item.label}: ${formatAmount(item.value)}`}
                            >
                                {/* Value */}
                                <span className="text-[10px] font-medium text-gray-400 sm:text-xs">
                                    {item.value > 0
                                        ? item.value >=
                                            1000000
                                            ? `${(
                                                item.value /
                                                1000000
                                            ).toFixed(1)}M`
                                            : item.value >=
                                                1000
                                                ? `${(
                                                    item.value /
                                                    1000
                                                ).toFixed(0)}K`
                                                : item.value.toFixed(
                                                    0
                                                )
                                        : ""}
                                </span>

                                {/* Bar Area */}
                                <div className="flex h-full w-full max-w-[42px] items-end">
                                    <div
                                        className="
                                            w-full
                                            rounded-t-lg
                                            bg-blue-500
                                            transition-all
                                            duration-300
                                            hover:bg-blue-600
                                        "
                                        style={{
                                            height:
                                                percentage >
                                                    0
                                                    ? `${Math.max(
                                                        6,
                                                        percentage
                                                    )}%`
                                                    : "3px",
                                        }}
                                    />
                                </div>

                                {/* Label */}
                                <span className="text-[10px] font-medium text-gray-500 sm:text-xs">
                                    {item.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Highest collection */}
            {data.length > 0 && (
                <div className="mt-5 border-t border-gray-100 pt-4">
                    {(() => {
                        const highest =
                            data.reduce(
                                (previous, current) =>
                                    current.value >
                                        previous.value
                                        ? current
                                        : previous,
                                data[0]
                            );

                        return (
                            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-xs text-gray-500">
                                    Highest collection
                                </p>

                                <p className="text-sm font-semibold text-gray-900">
                                    {highest.label}{" "}
                                    ·{" "}
                                    {formatAmount(
                                        highest.value
                                    )}
                                </p>
                            </div>
                        );
                    })()}
                </div>
            )}
        </div>
    );
}