import Link from "next/link";
import {
    User,
    Phone,
    CreditCard,
    MapPin,
    Users,
    Bike,
    Smartphone,
    ArrowRight,
} from "lucide-react";

type CustomerCardProps = {
    customer: {
        id: string;
        fullName: string;
        fatherName: string;
        phone: string;
        address: string;
        cnic: string;

        guarantors: {
            id: string;
        }[];

        agreements: {
            id: string;
            totalAmount: number;
            status: "ACTIVE" | "COMPLETED" | "DEFAULTED";
            category: "MOBILE" | "BIKE";

            payments: {
                amountPaid: number;
                remainingBalance: number;
            }[];
        }[];
    };
};

export default function CustomerCard({
    customer,
}: CustomerCardProps) {
    const totalAgreements = customer.agreements.length;

    const totalAmount = customer.agreements.reduce(
        (sum, agreement) => sum + agreement.totalAmount,
        0
    );

    const remainingBalance = customer.agreements.reduce(
        (sum, agreement) =>
            sum +
            (agreement.payments[0]?.remainingBalance ??
                agreement.totalAmount),
        0
    );

    const activeAgreements = customer.agreements.filter(
        (agreement) => agreement.status === "ACTIVE"
    ).length;

    const visibleProducts = customer.agreements.slice(0, 2);

    const extraProducts =
        customer.agreements.length > 2
            ? customer.agreements.length - 2
            : 0;

    return (
        <Link
            href={`/dashboard/Customers/${customer.id}`}
            className="
                group
                block
                w-full
                min-w-0
                overflow-hidden
                rounded-lg
                border
                border-gray-200
                bg-white
                px-3
                py-2.5
                shadow-sm
                transition
                hover:border-blue-200
                hover:shadow-md
                sm:px-3.5
                sm:py-3
            "
        >
            {/* =====================================================
                TOP ROW
            ===================================================== */}

            <div className="flex min-w-0 items-center gap-2.5">

                {/* Avatar */}

                <div
                    className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-blue-50
                        text-blue-600
                    "
                >
                    <User size={16} />
                </div>

                {/* Customer */}

                <div className="min-w-0 flex-1">

                    <div className="flex min-w-0 items-center gap-1.5">

                        <h2
                            className="
                                min-w-0
                                truncate
                                text-sm
                                font-semibold
                                text-gray-900
                            "
                        >
                            {customer.fullName}
                        </h2>

                        {activeAgreements > 0 && (
                            <span
                                className="
                                    hidden
                                    shrink-0
                                    rounded-full
                                    bg-green-50
                                    px-1.5
                                    py-0.5
                                    text-[9px]
                                    font-medium
                                    text-green-700
                                    sm:inline-flex
                                "
                            >
                                Active
                            </span>
                        )}
                    </div>

                    <p className="truncate text-[10px] text-gray-400">
                        S/O {customer.fatherName}
                    </p>
                </div>

                {/* Arrow */}

                <ArrowRight
                    size={16}
                    className="
                        shrink-0
                        text-gray-300
                        transition
                        group-hover:translate-x-0.5
                        group-hover:text-blue-500
                    "
                />
            </div>

            {/* =====================================================
                DETAILS
            ===================================================== */}

            <div
                className="
                    mt-2.5
                    grid
                    grid-cols-2
                    gap-1.5
                    sm:grid-cols-4
                "
            >
                {/* Phone */}

                <div
                    className="
                        flex
                        min-w-0
                        items-center
                        gap-1.5
                        rounded-md
                        bg-gray-50
                        px-2
                        py-1.5
                    "
                >
                    <Phone
                        size={12}
                        className="shrink-0 text-gray-400"
                    />

                    <span
                        className="
                            min-w-0
                            truncate
                            text-[10px]
                            text-gray-600
                        "
                    >
                        {customer.phone}
                    </span>
                </div>

                {/* Agreements */}

                <div
                    className="
                        min-w-0
                        rounded-md
                        bg-gray-50
                        px-2
                        py-1.5
                    "
                >
                    <span className="text-[9px] text-gray-400">
                        Agreements
                    </span>

                    <span className="ml-1 text-[11px] font-semibold text-gray-700">
                        {totalAgreements}
                    </span>
                </div>

                {/* Total */}

                <div
                    className="
                        min-w-0
                        rounded-md
                        bg-gray-50
                        px-2
                        py-1.5
                    "
                >
                    <span className="text-[9px] text-gray-400">
                        Total
                    </span>

                    <span className="ml-1 truncate text-[11px] font-semibold text-gray-700">
                        Rs. {totalAmount.toLocaleString()}
                    </span>
                </div>

                {/* Remaining */}

                <div
                    className="
                        min-w-0
                        rounded-md
                        bg-blue-50
                        px-2
                        py-1.5
                    "
                >
                    <span className="text-[9px] text-blue-400">
                        Remaining
                    </span>

                    <span className="ml-1 truncate text-[11px] font-semibold text-blue-700">
                        Rs. {remainingBalance.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* =====================================================
                BOTTOM ROW
            ===================================================== */}

            <div
                className="
                    mt-2
                    flex
                    min-w-0
                    items-center
                    justify-between
                    gap-2
                    border-t
                    border-gray-100
                    pt-2
                "
            >
                {/* Products */}

                <div className="flex min-w-0 flex-1 items-center gap-1">

                    {visibleProducts.map((agreement) => (
                        <span
                            key={agreement.id}
                            className="
                                inline-flex
                                max-w-[110px]
                                items-center
                                gap-1
                                rounded
                                bg-gray-50
                                px-1.5
                                py-1
                                text-[9px]
                                font-medium
                                text-gray-500
                            "
                        >
                            {agreement.category === "BIKE" ? (
                                <Bike
                                    size={10}
                                    className="shrink-0"
                                />
                            ) : (
                                <Smartphone
                                    size={10}
                                    className="shrink-0"
                                />
                            )}

                            <span className="truncate">
                                {agreement.category}
                            </span>
                        </span>
                    ))}

                    {extraProducts > 0 && (
                        <span
                            className="
                                shrink-0
                                rounded
                                bg-gray-100
                                px-1.5
                                py-1
                                text-[9px]
                                text-gray-500
                            "
                        >
                            +{extraProducts}
                        </span>
                    )}
                </div>

                {/* Extra information */}

                <div className="hidden items-center gap-2 text-[9px] text-gray-400 sm:flex">

                    <span>
                        {customer.guarantors.length} guarantor
                        {customer.guarantors.length !== 1
                            ? "s"
                            : ""}
                    </span>

                    <span className="text-gray-200">•</span>

                    <span>
                        {customer.cnic}
                    </span>

                </div>
            </div>

            {/* =====================================================
                DESKTOP EXTRA INFORMATION
            ===================================================== */}

            <div
                className="
                    mt-2
                    hidden
                    items-center
                    gap-1.5
                    border-t
                    border-gray-100
                    pt-2
                    lg:flex
                "
            >
                <MapPin
                    size={11}
                    className="shrink-0 text-gray-400"
                />

                <span
                    className="
                        min-w-0
                        truncate
                        text-[9px]
                        text-gray-400
                    "
                >
                    {customer.address}
                </span>
            </div>
        </Link>
    );
}