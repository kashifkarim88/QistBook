import {
    Smartphone,
    Bike,
    FileCheck,
} from "lucide-react";

type AgreementStatsProps = {
    totalAgreements: number;
    mobileAgreements: number;
    bikeAgreements: number;
};

export default function AgreementStats({
    totalAgreements,
    mobileAgreements,
    bikeAgreements,
}: AgreementStatsProps) {
    const mobilePercentage =
        totalAgreements > 0
            ? (mobileAgreements / totalAgreements) * 100
            : 0;

    const bikePercentage =
        totalAgreements > 0
            ? (bikeAgreements / totalAgreements) * 100
            : 0;

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                    <FileCheck size={20} />
                </div>

                <div>
                    <h2 className="font-semibold text-gray-900">
                        Installment Items
                    </h2>

                    <p className="text-sm text-gray-500">
                        Breakdown of all purchased items
                    </p>
                </div>
            </div>

            {/* Total */}
            <div className="mt-5 rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Total Agreements
                </p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                    {totalAgreements}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                    All installment purchases
                </p>
            </div>

            {/* Breakdown */}
            <div className="mt-4 grid grid-cols-2 gap-3">

                {/* Mobile */}
                <div className="rounded-xl border border-gray-100 p-4">

                    <div className="flex items-center justify-between">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <Smartphone size={18} />
                        </div>

                        <span className="text-xs font-semibold text-gray-500">
                            {mobilePercentage.toFixed(0)}%
                        </span>
                    </div>

                    <p className="mt-3 text-sm font-medium text-gray-600">
                        Mobile
                    </p>

                    <p className="mt-1 text-xl font-bold text-gray-900">
                        {mobileAgreements}
                    </p>

                    <p className="text-xs text-gray-400">
                        agreements
                    </p>

                    {/* Small visual indicator */}
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100">
                        <div
                            className="h-full rounded-full bg-blue-500"
                            style={{
                                width: `${mobilePercentage}%`,
                            }}
                        />
                    </div>
                </div>

                {/* Bike */}
                <div className="rounded-xl border border-gray-100 p-4">

                    <div className="flex items-center justify-between">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                            <Bike size={18} />
                        </div>

                        <span className="text-xs font-semibold text-gray-500">
                            {bikePercentage.toFixed(0)}%
                        </span>
                    </div>

                    <p className="mt-3 text-sm font-medium text-gray-600">
                        Bike
                    </p>

                    <p className="mt-1 text-xl font-bold text-gray-900">
                        {bikeAgreements}
                    </p>

                    <p className="text-xs text-gray-400">
                        agreements
                    </p>

                    {/* Small visual indicator */}
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100">
                        <div
                            className="h-full rounded-full bg-orange-500"
                            style={{
                                width: `${bikePercentage}%`,
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Explanation */}
            <div className="mt-4 border-t border-gray-100 pt-3">
                <p className="text-xs text-gray-500">
                    <span className="font-medium text-gray-700">
                        What this means:
                    </span>{" "}
                    {mobileAgreements} mobile and {bikeAgreements} bike
                    {totalAgreements === 1 ? " item" : " items"} are currently
                    recorded across all installment agreements.
                </p>
            </div>
        </div>
    );
}