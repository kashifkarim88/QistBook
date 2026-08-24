import {
    CircleDollarSign,
    TrendingUp,
    Wallet,
} from "lucide-react";

type FinancialOverviewProps = {
    totalAgreementValue: number;
    totalPaid: number;
    totalRemaining: number;
    collectionPercentage: number;
};

function formatAmount(amount: number) {
    return `Rs. ${amount.toLocaleString("en-PK")}`;
}

export default function FinancialOverview({
    totalAgreementValue,
    totalPaid,
    totalRemaining,
    collectionPercentage,
}: FinancialOverviewProps) {

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            {/* Header */}
            <div className="flex items-start justify-between">

                <div>
                    <h2 className="font-semibold text-gray-900">
                        Financial Overview
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Overall installment collection performance
                    </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                    <TrendingUp size={20} />
                </div>

            </div>

            {/* Financial values */}
            <div className="mt-7 grid gap-6 sm:grid-cols-3">

                <div>
                    <div className="flex items-center gap-2 text-gray-500">
                        <CircleDollarSign size={17} />

                        <p className="text-sm">
                            Total Agreement Value
                        </p>
                    </div>

                    <p className="mt-2 text-xl font-bold text-gray-900">
                        {formatAmount(totalAgreementValue)}
                    </p>
                </div>

                <div>
                    <div className="flex items-center gap-2 text-gray-500">
                        <Wallet size={17} />

                        <p className="text-sm">
                            Total Collected
                        </p>
                    </div>

                    <p className="mt-2 text-xl font-bold text-green-600">
                        {formatAmount(totalPaid)}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">
                        Outstanding Balance
                    </p>

                    <p className="mt-2 text-xl font-bold text-blue-600">
                        {formatAmount(totalRemaining)}
                    </p>
                </div>

            </div>

            {/* Progress */}
            <div className="mt-8">

                <div className="flex items-center justify-between">

                    <div>
                        <p className="text-sm font-medium text-gray-700">
                            Collection Progress
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                            Percentage of agreement value collected
                        </p>
                    </div>

                    <p className="text-lg font-bold text-blue-600">
                        {collectionPercentage.toFixed(1)}%
                    </p>

                </div>

                <div className="mt-3 h-3 overflow-hidden rounded-full bg-gray-100">

                    <div
                        className="h-full rounded-full bg-blue-600 transition-all"
                        style={{
                            width: `${Math.min(
                                100,
                                collectionPercentage
                            )}%`,
                        }}
                    />

                </div>

            </div>

        </div>
    );
}