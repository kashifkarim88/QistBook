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

    return (
        <Link
            href={`/dashboard/Customers/${customer.id}`}
            className="
                group
                block
                rounded-xl
                border
                border-gray-200
                bg-white
                px-4
                py-3
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:border-blue-200
                hover:shadow-md
            "
        >
            <div className="flex items-center gap-4">

                {/* ================= CUSTOMER ================= */}
                <div className="flex min-w-[220px] items-center gap-3">

                    <div
                        className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-blue-50
                            text-blue-600
                        "
                    >
                        <User size={19} />
                    </div>

                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <h2 className="truncate text-sm font-semibold text-gray-900">
                                {customer.fullName}
                            </h2>

                            {activeAgreements > 0 && (
                                <span
                                    className="
                                        rounded-full
                                        bg-green-50
                                        px-2
                                        py-0.5
                                        text-[10px]
                                        font-medium
                                        text-green-700
                                    "
                                >
                                    Active
                                </span>
                            )}
                        </div>

                        <p className="mt-0.5 truncate text-xs text-gray-500">
                            S/O {customer.fatherName}
                        </p>
                    </div>
                </div>

                {/* ================= CONTACT ================= */}
                <div className="hidden min-w-[190px] flex-1 items-center gap-4 lg:flex">

                    <div className="flex items-center gap-2">
                        <Phone
                            size={15}
                            className="shrink-0 text-gray-400"
                        />

                        <span className="text-xs text-gray-600">
                            {customer.phone}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <CreditCard
                            size={15}
                            className="shrink-0 text-gray-400"
                        />

                        <span className="text-xs text-gray-600">
                            {customer.cnic}
                        </span>
                    </div>

                </div>

                {/* ================= AGREEMENTS ================= */}
                <div className="hidden items-center gap-2 md:flex">

                    <div className="rounded-lg bg-gray-50 px-3 py-2">
                        <p className="text-[10px] text-gray-400">
                            Agreements
                        </p>

                        <p className="text-sm font-semibold text-gray-800">
                            {totalAgreements}
                        </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 px-3 py-2">
                        <p className="text-[10px] text-gray-400">
                            Total
                        </p>

                        <p className="text-sm font-semibold text-gray-800">
                            Rs. {totalAmount.toLocaleString()}
                        </p>
                    </div>

                    <div className="rounded-lg bg-blue-50 px-3 py-2">
                        <p className="text-[10px] text-blue-500">
                            Remaining
                        </p>

                        <p className="text-sm font-semibold text-blue-700">
                            Rs. {remainingBalance.toLocaleString()}
                        </p>
                    </div>

                </div>

                {/* ================= PRODUCTS ================= */}
                <div className="hidden items-center gap-1.5 xl:flex">

                    {customer.agreements.slice(0, 3).map((agreement) => (
                        <span
                            key={agreement.id}
                            className="
                                inline-flex
                                items-center
                                gap-1
                                rounded-md
                                border
                                border-gray-200
                                bg-gray-50
                                px-2
                                py-1
                                text-[10px]
                                font-medium
                                text-gray-600
                            "
                        >
                            {agreement.category === "BIKE" ? (
                                <Bike size={12} />
                            ) : (
                                <Smartphone size={12} />
                            )}

                            {agreement.category}
                        </span>
                    ))}

                </div>

                {/* ================= GUARANTOR ================= */}
                <div
                    className="
                        hidden
                        items-center
                        gap-1.5
                        rounded-lg
                        bg-gray-50
                        px-2.5
                        py-2
                        text-xs
                        text-gray-500
                        xl:flex
                    "
                >
                    <Users size={14} />

                    <span>
                        {customer.guarantors.length}
                    </span>
                </div>

                {/* ================= ARROW ================= */}
                <div
                    className="
                        ml-auto
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-gray-50
                        text-gray-400
                        transition
                        group-hover:bg-blue-50
                        group-hover:text-blue-600
                    "
                >
                    <ArrowRight
                        size={16}
                        className="
                            transition-transform
                            group-hover:translate-x-0.5
                        "
                    />
                </div>

            </div>

            {/* ================= MOBILE EXTRA INFO ================= */}
            <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3 md:hidden">

                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Phone size={13} />
                    {customer.phone}
                </div>

                <span className="text-gray-300">•</span>

                <span className="text-xs text-gray-500">
                    {totalAgreements} Agreement
                    {totalAgreements !== 1 ? "s" : ""}
                </span>

                <span className="text-gray-300">•</span>

                <span className="text-xs font-medium text-blue-600">
                    Rs. {remainingBalance.toLocaleString()} left
                </span>

            </div>

            {/* ================= ADDRESS ================= */}
            <div className="mt-2 hidden items-center gap-1.5 text-[11px] text-gray-400 2xl:flex">
                <MapPin size={12} />
                <span className="truncate">
                    {customer.address}
                </span>
            </div>
        </Link>
    );
}