import Link from "next/link";
import {
    User,
    Phone,
    Users,
    Bike,
    Smartphone,
    ArrowRight,
    Wallet,
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
        (sum, agreement) =>
            sum + agreement.totalAmount,
        0
    );

    const remainingBalance = customer.agreements.reduce(
        (sum, agreement) =>
            sum +
            (agreement.payments[0]?.remainingBalance ??
                agreement.totalAmount),
        0
    );

    const activeAgreements =
        customer.agreements.filter(
            (agreement) =>
                agreement.status === "ACTIVE"
        ).length;

    return (
        <Link
            href={`/dashboard/Customers/${customer.id}`}
            className="
                group
                block
                w-full
                overflow-hidden
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-3
                shadow-sm
                transition-all
                duration-150
                hover:border-blue-200
                hover:shadow-md
            "
        >
            {/* =====================================================
                MAIN ROW
            ===================================================== */}

            <div className="flex min-w-0 items-center gap-3">

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

                <div className="min-w-0 w-[180px] shrink-0">

                    <div className="flex min-w-0 items-center gap-1.5">

                        <p className="truncate text-sm font-semibold text-slate-900">
                            {customer.fullName}
                        </p>

                        {activeAgreements > 0 && (
                            <span
                                className="
                                    shrink-0
                                    rounded-full
                                    bg-emerald-50
                                    px-1.5
                                    py-0.5
                                    text-[9px]
                                    font-semibold
                                    text-emerald-600
                                "
                            >
                                Active
                            </span>
                        )}

                    </div>

                    <p className="truncate text-[10px] text-slate-400">
                        S/O {customer.fatherName}
                    </p>

                </div>

                {/* Phone */}

                <div
                    className="
                        hidden
                        min-w-0
                        items-center
                        gap-1.5
                        text-xs
                        text-slate-500
                        lg:flex
                        lg:w-[125px]
                    "
                >
                    <Phone
                        size={12}
                        className="shrink-0 text-blue-400"
                    />

                    <span className="truncate">
                        {customer.phone}
                    </span>
                </div>

                {/* Agreements */}

                <div
                    className="
                        hidden
                        shrink-0
                        items-center
                        gap-1.5
                        rounded-md
                        bg-slate-50
                        px-2
                        py-1
                        sm:flex
                    "
                >
                    <span className="text-[9px] text-slate-400">
                        Agreements
                    </span>

                    <span className="text-xs font-semibold text-slate-700">
                        {totalAgreements}
                    </span>
                </div>

                {/* Total */}

                <div
                    className="
                        hidden
                        min-w-0
                        items-center
                        gap-1
                        md:flex
                    "
                >
                    <span className="text-[10px] text-slate-400">
                        Total
                    </span>

                    <span className="truncate text-xs font-semibold text-blue-600">
                        Rs. {totalAmount.toLocaleString()}
                    </span>
                </div>

                {/* Remaining */}

                <div
                    className="
                        flex
                        min-w-0
                        items-center
                        gap-1
                    "
                >
                    <Wallet
                        size={12}
                        className="shrink-0 text-amber-500"
                    />

                    <span className="truncate text-xs font-bold text-amber-600">
                        Rs. {remainingBalance.toLocaleString()}
                    </span>
                </div>

                {/* Products */}

                <div
                    className="
                        hidden
                        min-w-0
                        flex-1
                        items-center
                        gap-1
                        lg:flex
                    "
                >
                    {customer.agreements
                        .slice(0, 2)
                        .map((agreement) => (
                            <span
                                key={agreement.id}
                                className="
                                    inline-flex
                                    shrink-0
                                    items-center
                                    gap-1
                                    rounded-md
                                    bg-slate-50
                                    px-1.5
                                    py-1
                                    text-[9px]
                                    font-medium
                                    text-slate-500
                                "
                            >
                                {agreement.category ===
                                    "BIKE" ? (
                                    <Bike size={10} />
                                ) : (
                                    <Smartphone size={10} />
                                )}

                                {agreement.category}
                            </span>
                        ))}

                    {customer.agreements.length > 2 && (
                        <span
                            className="
                                shrink-0
                                rounded-md
                                bg-slate-100
                                px-1.5
                                py-1
                                text-[9px]
                                font-medium
                                text-slate-500
                            "
                        >
                            +{customer.agreements.length - 2}
                        </span>
                    )}
                </div>

                {/* Guarantors */}

                <div
                    className="
                        hidden
                        shrink-0
                        items-center
                        gap-1
                        xl:flex
                    "
                >
                    <Users
                        size={12}
                        className="text-purple-400"
                    />

                    <span className="text-[10px] text-purple-600">
                        {customer.guarantors.length}
                    </span>
                </div>

                {/* Arrow */}

                <ArrowRight
                    size={16}
                    className="
                        ml-auto
                        shrink-0
                        text-slate-300
                        transition
                        group-hover:translate-x-0.5
                        group-hover:text-blue-500
                    "
                />

            </div>

            {/* =====================================================
                MOBILE SECOND LINE
            ===================================================== */}

            <div
                className="
                    mt-2
                    flex
                    min-w-0
                    items-center
                    gap-2
                    border-t
                    border-slate-100
                    pt-2
                    sm:hidden
                "
            >

                <Phone
                    size={11}
                    className="shrink-0 text-blue-400"
                />

                <span className="truncate text-[10px] text-slate-500">
                    {customer.phone}
                </span>

                <span className="text-slate-200">
                    •
                </span>

                <span className="shrink-0 text-[10px] text-slate-400">
                    {totalAgreements} agreements
                </span>

                <span className="text-slate-200">
                    •
                </span>

                <span className="truncate text-[10px] font-medium text-blue-600">
                    {customer.cnic}
                </span>

            </div>

        </Link>
    );
}