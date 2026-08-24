import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    User,
    Phone,
    CreditCard,
    MapPin,
    Users,
    Bike,
    Smartphone,
    CalendarDays,
    CircleDollarSign,
    ArrowRight,
} from "lucide-react";

type PageProps = {
    params: Promise<{
        customerId: string;
    }>;
};

function formatAmount(amount: number) {
    return `Rs. ${amount.toLocaleString("en-PK")}`;
}

function formatDate(date: Date | null | undefined) {
    if (!date) return "—";

    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Karachi",
    }).format(date);
}

export default async function CustomerDetailsPage({
    params,
}: PageProps) {
    const { customerId } = await params;

    const customer = await prisma.customer.findUnique({
        where: {
            id: customerId,
        },

        include: {
            guarantors: true,

            agreements: {
                include: {
                    bike: true,
                    mobile: true,

                    payments: {
                        orderBy: {
                            paymentDate: "desc",
                        },
                    },
                },

                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    });

    if (!customer) {
        notFound();
    }

    /* =====================================================
       CUSTOMER TOTALS
    ===================================================== */

    const totalAgreements = customer.agreements.length;

    const totalAmount = customer.agreements.reduce(
        (sum, agreement) => sum + agreement.totalAmount,
        0
    );

    const totalPaid = customer.agreements.reduce(
        (sum, agreement) =>
            sum +
            agreement.payments.reduce(
                (paymentSum, payment) =>
                    paymentSum + payment.amountPaid,
                0
            ),
        0
    );

    const totalRemaining = customer.agreements.reduce(
        (sum, agreement) => {
            const latestPayment = agreement.payments[0];

            return (
                sum +
                (latestPayment?.remainingBalance ??
                    agreement.totalAmount)
            );
        },
        0
    );

    const activeAgreements = customer.agreements.filter(
        (agreement) => agreement.status === "ACTIVE"
    ).length;

    const completedAgreements = customer.agreements.filter(
        (agreement) => agreement.status === "COMPLETED"
    ).length;

    const paymentPercentage =
        totalAmount > 0
            ? Math.min(
                100,
                Math.round((totalPaid / totalAmount) * 100)
            )
            : 0;

    return (
        <main className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="mx-auto max-w-7xl">

                {/* =====================================================
                    BACK BUTTON
                ===================================================== */}

                <Link
                    href="/dashboard/Customers"
                    className="
                        mb-4
                        inline-flex
                        items-center
                        gap-2
                        text-sm
                        font-medium
                        text-gray-500
                        transition
                        hover:text-blue-600
                    "
                >
                    <ArrowLeft size={17} />
                    Customers
                </Link>

                {/* =====================================================
                    CUSTOMER PROFILE
                ===================================================== */}

                <section
                    className="
                        overflow-hidden
                        rounded-2xl
                        border
                        border-gray-200
                        bg-white
                        shadow-sm
                    "
                >
                    <div className="p-5">

                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                            {/* Identity */}

                            <div className="flex items-center gap-4">

                                <div
                                    className="
                                        flex
                                        h-14
                                        w-14
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-blue-50
                                        text-blue-600
                                    "
                                >
                                    <User size={26} />
                                </div>

                                <div>
                                    <div className="flex flex-wrap items-center gap-2">

                                        <h1 className="text-xl font-bold text-gray-900">
                                            {customer.fullName}
                                        </h1>

                                        {activeAgreements > 0 && (
                                            <span
                                                className="
                                                    rounded-full
                                                    bg-green-50
                                                    px-2.5
                                                    py-1
                                                    text-[11px]
                                                    font-medium
                                                    text-green-700
                                                "
                                            >
                                                Active Customer
                                            </span>
                                        )}

                                    </div>

                                    <p className="mt-0.5 text-sm text-gray-500">
                                        S/O {customer.fatherName}
                                    </p>
                                </div>
                            </div>

                            {/* Quick Stats */}

                            <div className="flex flex-wrap items-center gap-2">

                                <div className="rounded-lg bg-gray-50 px-3 py-2">
                                    <p className="text-[10px] text-gray-400">
                                        Items
                                    </p>

                                    <p className="text-sm font-semibold text-gray-800">
                                        {totalAgreements}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-green-50 px-3 py-2">
                                    <p className="text-[10px] text-green-500">
                                        Active
                                    </p>

                                    <p className="text-sm font-semibold text-green-700">
                                        {activeAgreements}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-blue-50 px-3 py-2">
                                    <p className="text-[10px] text-blue-500">
                                        Completed
                                    </p>

                                    <p className="text-sm font-semibold text-blue-700">
                                        {completedAgreements}
                                    </p>
                                </div>

                            </div>
                        </div>

                        {/* Customer Details */}

                        <div
                            className="
                                mt-5
                                grid
                                gap-3
                                border-t
                                border-gray-100
                                pt-4
                                sm:grid-cols-2
                                lg:grid-cols-4
                            "
                        >

                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-gray-50 p-2">
                                    <Phone
                                        size={15}
                                        className="text-gray-500"
                                    />
                                </div>

                                <div>
                                    <p className="text-[10px] uppercase text-gray-400">
                                        Phone
                                    </p>

                                    <p className="text-sm font-medium text-gray-700">
                                        {customer.phone}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-gray-50 p-2">
                                    <CreditCard
                                        size={15}
                                        className="text-gray-500"
                                    />
                                </div>

                                <div>
                                    <p className="text-[10px] uppercase text-gray-400">
                                        CNIC
                                    </p>

                                    <p className="text-sm font-medium text-gray-700">
                                        {customer.cnic}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-gray-50 p-2">
                                    <MapPin
                                        size={15}
                                        className="text-gray-500"
                                    />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[10px] uppercase text-gray-400">
                                        Address
                                    </p>

                                    <p className="truncate text-sm font-medium text-gray-700">
                                        {customer.address}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-gray-50 p-2">
                                    <Users
                                        size={15}
                                        className="text-gray-500"
                                    />
                                </div>

                                <div>
                                    <p className="text-[10px] uppercase text-gray-400">
                                        Guarantors
                                    </p>

                                    <p className="text-sm font-medium text-gray-700">
                                        {customer.guarantors.length}
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* =====================================================
                    FINANCIAL OVERVIEW
                ===================================================== */}

                <section className="mt-5">

                    <div className="mb-3 flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-gray-900">
                                Financial Overview
                            </h2>

                            <p className="text-xs text-gray-500">
                                Overall installment status
                            </p>
                        </div>

                        <span className="text-xs font-medium text-gray-500">
                            {paymentPercentage}% Paid
                        </span>
                    </div>

                    <div
                        className="
                            grid
                            overflow-hidden
                            rounded-2xl
                            border
                            border-gray-200
                            bg-white
                            shadow-sm
                            sm:grid-cols-2
                            xl:grid-cols-4
                        "
                    >

                        {/* Total */}

                        <div className="border-b border-gray-100 p-4 sm:border-r xl:border-b-0">
                            <div className="flex items-center gap-2">
                                <div className="rounded-lg bg-gray-100 p-2">
                                    <CircleDollarSign
                                        size={16}
                                        className="text-gray-600"
                                    />
                                </div>

                                <p className="text-xs text-gray-500">
                                    Total Value
                                </p>
                            </div>

                            <p className="mt-3 text-lg font-bold text-gray-900">
                                {formatAmount(totalAmount)}
                            </p>
                        </div>

                        {/* Paid */}

                        <div className="border-b border-gray-100 p-4 xl:border-b-0 xl:border-r">
                            <div className="flex items-center gap-2">
                                <div className="rounded-lg bg-green-50 p-2">
                                    <CircleDollarSign
                                        size={16}
                                        className="text-green-600"
                                    />
                                </div>

                                <p className="text-xs text-gray-500">
                                    Total Paid
                                </p>
                            </div>

                            <p className="mt-3 text-lg font-bold text-green-600">
                                {formatAmount(totalPaid)}
                            </p>
                        </div>

                        {/* Remaining */}

                        <div className="border-b border-gray-100 p-4 sm:border-r xl:border-b-0">
                            <div className="flex items-center gap-2">
                                <div className="rounded-lg bg-blue-50 p-2">
                                    <CircleDollarSign
                                        size={16}
                                        className="text-blue-600"
                                    />
                                </div>

                                <p className="text-xs text-gray-500">
                                    Remaining
                                </p>
                            </div>

                            <p className="mt-3 text-lg font-bold text-blue-600">
                                {formatAmount(totalRemaining)}
                            </p>
                        </div>

                        {/* Progress */}

                        <div className="p-4">

                            <div className="flex items-center justify-between">
                                <p className="text-xs text-gray-500">
                                    Payment Progress
                                </p>

                                <span className="text-xs font-semibold text-gray-700">
                                    {paymentPercentage}%
                                </span>
                            </div>

                            <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
                                <div
                                    className="h-full rounded-full bg-blue-600 transition-all"
                                    style={{
                                        width: `${paymentPercentage}%`,
                                    }}
                                />
                            </div>

                            <p className="mt-2 text-[11px] text-gray-400">
                                {formatAmount(totalPaid)} of{" "}
                                {formatAmount(totalAmount)}
                            </p>

                        </div>

                    </div>
                </section>

                {/* =====================================================
                    GUARANTORS
                ===================================================== */}

                {customer.guarantors.length > 0 && (
                    <section className="mt-6">

                        <div className="mb-3">
                            <h2 className="text-base font-semibold text-gray-900">
                                Guarantors
                            </h2>

                            <p className="text-xs text-gray-500">
                                People providing guarantee for this customer
                            </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">

                            {customer.guarantors.map((guarantor) => (
                                <div
                                    key={guarantor.id}
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        rounded-xl
                                        border
                                        border-gray-200
                                        bg-white
                                        px-4
                                        py-3
                                        shadow-sm
                                    "
                                >

                                    <div className="flex items-center gap-3">

                                        <div className="rounded-full bg-gray-100 p-2.5">
                                            <Users
                                                size={17}
                                                className="text-gray-600"
                                            />
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {guarantor.fullName}
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                {guarantor.phone}
                                            </p>
                                        </div>

                                    </div>

                                    <div className="hidden text-right sm:block">
                                        <p className="text-[10px] uppercase text-gray-400">
                                            CNIC
                                        </p>

                                        <p className="text-xs text-gray-600">
                                            {guarantor.cnic}
                                        </p>
                                    </div>

                                </div>
                            ))}

                        </div>
                    </section>
                )}

                {/* =====================================================
                    PURCHASED ITEMS
                ===================================================== */}

                <section className="mt-6">

                    <div className="mb-3 flex items-end justify-between">

                        <div>
                            <h2 className="text-base font-semibold text-gray-900">
                                Purchased Items
                            </h2>

                            <p className="text-xs text-gray-500">
                                Installment agreements and payment status
                            </p>
                        </div>

                        <span className="text-xs text-gray-400">
                            {totalAgreements} item
                            {totalAgreements !== 1 ? "s" : ""}
                        </span>

                    </div>

                    {customer.agreements.length === 0 ? (
                        <div
                            className="
                                rounded-xl
                                border
                                border-dashed
                                border-gray-300
                                bg-white
                                p-10
                                text-center
                            "
                        >
                            <p className="text-sm font-medium text-gray-700">
                                No installment purchases found.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">

                            {customer.agreements.map((agreement) => {

                                const latestPayment =
                                    agreement.payments[0];

                                const paid =
                                    agreement.payments.reduce(
                                        (sum, payment) =>
                                            sum + payment.amountPaid,
                                        0
                                    );

                                const remaining =
                                    latestPayment?.remainingBalance ??
                                    agreement.totalAmount;

                                const percentage =
                                    agreement.totalAmount > 0
                                        ? Math.min(
                                            100,
                                            Math.round(
                                                (paid /
                                                    agreement.totalAmount) *
                                                100
                                            )
                                        )
                                        : 0;

                                const productName =
                                    agreement.category === "BIKE"
                                        ? `${agreement.bike?.brand ?? ""} ${agreement.bike?.model ?? ""
                                        }`
                                        : `${agreement.mobile?.brand ?? ""} ${agreement.mobile?.model ?? ""
                                        }`;

                                return (
                                    <Link
                                        key={agreement.id}
                                        href={`/dashboard/Customers/${customer.id}/${agreement.id}`}
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
                                            hover:border-blue-200
                                            hover:shadow-md
                                        "
                                    >
                                        <div className="flex items-center gap-4">

                                            {/* Product Icon */}

                                            <div
                                                className="
                                                    flex
                                                    h-11
                                                    w-11
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-xl
                                                    bg-blue-50
                                                    text-blue-600
                                                "
                                            >
                                                {agreement.category ===
                                                    "BIKE" ? (
                                                    <Bike size={21} />
                                                ) : (
                                                    <Smartphone size={21} />
                                                )}
                                            </div>

                                            {/* Product Name */}

                                            <div className="min-w-[180px] flex-1">

                                                <div className="flex items-center gap-2">

                                                    <h3 className="truncate text-sm font-semibold text-gray-900">
                                                        {productName.trim() ||
                                                            "Unnamed Item"}
                                                    </h3>

                                                    <span
                                                        className={`
                                                            hidden
                                                            rounded-full
                                                            px-2
                                                            py-0.5
                                                            text-[10px]
                                                            font-medium
                                                            sm:inline-flex
                                                            ${agreement.status ===
                                                                "ACTIVE"
                                                                ? "bg-green-50 text-green-700"
                                                                : agreement.status ===
                                                                    "COMPLETED"
                                                                    ? "bg-blue-50 text-blue-700"
                                                                    : "bg-red-50 text-red-700"
                                                            }
                                                        `}
                                                    >
                                                        {agreement.status}
                                                    </span>

                                                </div>

                                                <p className="mt-0.5 text-[11px] text-gray-400">
                                                    {agreement.category}
                                                </p>

                                            </div>

                                            {/* Amount */}

                                            <div className="hidden min-w-[130px] md:block">

                                                <p className="text-[10px] text-gray-400">
                                                    Agreement
                                                </p>

                                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                                    {formatAmount(
                                                        agreement.totalAmount
                                                    )}
                                                </p>

                                            </div>

                                            {/* Paid */}

                                            <div className="hidden min-w-[120px] lg:block">

                                                <p className="text-[10px] text-gray-400">
                                                    Paid
                                                </p>

                                                <p className="mt-1 text-sm font-semibold text-green-600">
                                                    {formatAmount(paid)}
                                                </p>

                                            </div>

                                            {/* Remaining */}

                                            <div className="min-w-[115px]">

                                                <p className="text-[10px] text-gray-400">
                                                    Remaining
                                                </p>

                                                <p className="mt-1 text-sm font-semibold text-blue-600">
                                                    {formatAmount(remaining)}
                                                </p>

                                            </div>

                                            {/* Progress */}

                                            <div className="hidden w-28 xl:block">

                                                <div className="flex justify-between">
                                                    <span className="text-[10px] text-gray-400">
                                                        Progress
                                                    </span>

                                                    <span className="text-[10px] font-medium text-gray-600">
                                                        {percentage}%
                                                    </span>
                                                </div>

                                                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-gray-100">
                                                    <div
                                                        className="h-full rounded-full bg-blue-600"
                                                        style={{
                                                            width: `${percentage}%`,
                                                        }}
                                                    />
                                                </div>

                                            </div>

                                            {/* Start Date */}

                                            <div className="hidden min-w-[95px] 2xl:block">

                                                <div className="flex items-center gap-1">
                                                    <CalendarDays
                                                        size={12}
                                                        className="text-gray-400"
                                                    />

                                                    <span className="text-[10px] text-gray-400">
                                                        Started
                                                    </span>
                                                </div>

                                                <p className="mt-1 text-xs font-medium text-gray-700">
                                                    {formatDate(
                                                        agreement.startDate
                                                    )}
                                                </p>

                                            </div>

                                            {/* Arrow */}

                                            <div
                                                className="
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

                                        {/* Mobile Progress */}

                                        <div className="mt-3 border-t border-gray-100 pt-3 sm:hidden">

                                            <div className="flex items-center justify-between">

                                                <span className="text-[10px] text-gray-400">
                                                    {agreement.status}
                                                </span>

                                                <span className="text-[10px] font-medium text-gray-600">
                                                    {percentage}% paid
                                                </span>

                                            </div>

                                            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-gray-100">
                                                <div
                                                    className="h-full rounded-full bg-blue-600"
                                                    style={{
                                                        width: `${percentage}%`,
                                                    }}
                                                />
                                            </div>

                                        </div>

                                    </Link>
                                );
                            })}

                        </div>
                    )}

                </section>

            </div>
        </main>
    );
}