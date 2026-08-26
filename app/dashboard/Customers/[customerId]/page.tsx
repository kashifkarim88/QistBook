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
        <main className="min-h-screen overflow-x-hidden bg-gray-50 px-3 py-4 sm:px-5 sm:py-6 lg:px-6">
            <div className="mx-auto w-full max-w-7xl">

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
                        rounded-lg
                        py-1
                        text-sm
                        font-medium
                        text-gray-500
                        transition
                        hover:text-blue-600
                    "
                >
                    <ArrowLeft size={17} />
                    <span>Customers</span>
                </Link>

                {/* =====================================================
                    CUSTOMER PROFILE
                ===================================================== */}

                <section
                    className="
                        w-full
                        overflow-hidden
                        rounded-2xl
                        border
                        border-gray-200
                        bg-white
                        shadow-sm
                    "
                >
                    <div className="p-4 sm:p-5 lg:p-6">

                        {/* Identity + Quick Stats */}

                        <div
                            className="
                                flex
                                flex-col
                                gap-5
                                lg:flex-row
                                lg:items-center
                                lg:justify-between
                            "
                        >

                            {/* Identity */}

                            <div className="flex min-w-0 items-center gap-3 sm:gap-4">

                                <div
                                    className="
                                        flex
                                        h-12
                                        w-12
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-blue-50
                                        text-blue-600
                                        sm:h-14
                                        sm:w-14
                                    "
                                >
                                    <User
                                        size={24}
                                        className="sm:hidden"
                                    />

                                    <User
                                        size={26}
                                        className="hidden sm:block"
                                    />
                                </div>

                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">

                                        <h1
                                            className="
                                                max-w-full
                                                truncate
                                                text-lg
                                                font-bold
                                                text-gray-900
                                                sm:text-xl
                                            "
                                        >
                                            {customer.fullName}
                                        </h1>

                                        {activeAgreements > 0 && (
                                            <span
                                                className="
                                                    shrink-0
                                                    rounded-full
                                                    bg-green-50
                                                    px-2
                                                    py-1
                                                    text-[10px]
                                                    font-medium
                                                    text-green-700
                                                    sm:px-2.5
                                                    sm:text-[11px]
                                                "
                                            >
                                                Active Customer
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-0.5 truncate text-xs text-gray-500 sm:text-sm">
                                        S/O {customer.fatherName}
                                    </p>
                                </div>
                            </div>

                            {/* Quick Stats */}

                            <div
                                className="
                                    grid
                                    w-full
                                    grid-cols-3
                                    gap-2
                                    sm:flex
                                    sm:w-auto
                                    sm:flex-wrap
                                "
                            >
                                <div className="min-w-0 rounded-lg bg-gray-50 px-2.5 py-2 sm:px-3">
                                    <p className="text-[10px] text-gray-400">
                                        Items
                                    </p>

                                    <p className="text-sm font-semibold text-gray-800">
                                        {totalAgreements}
                                    </p>
                                </div>

                                <div className="min-w-0 rounded-lg bg-green-50 px-2.5 py-2 sm:px-3">
                                    <p className="text-[10px] text-green-500">
                                        Active
                                    </p>

                                    <p className="text-sm font-semibold text-green-700">
                                        {activeAgreements}
                                    </p>
                                </div>

                                <div className="min-w-0 rounded-lg bg-blue-50 px-2.5 py-2 sm:px-3">
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
                                grid-cols-1
                                gap-3
                                border-t
                                border-gray-100
                                pt-4
                                sm:grid-cols-2
                                lg:grid-cols-4
                            "
                        >

                            {/* Phone */}

                            <div className="flex min-w-0 items-center gap-3">
                                <div className="shrink-0 rounded-lg bg-gray-50 p-2">
                                    <Phone
                                        size={15}
                                        className="text-gray-500"
                                    />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[10px] uppercase text-gray-400">
                                        Phone
                                    </p>

                                    <p className="truncate text-sm font-medium text-gray-700">
                                        {customer.phone}
                                    </p>
                                </div>
                            </div>

                            {/* CNIC */}

                            <div className="flex min-w-0 items-center gap-3">
                                <div className="shrink-0 rounded-lg bg-gray-50 p-2">
                                    <CreditCard
                                        size={15}
                                        className="text-gray-500"
                                    />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[10px] uppercase text-gray-400">
                                        CNIC
                                    </p>

                                    <p className="truncate text-sm font-medium text-gray-700">
                                        {customer.cnic}
                                    </p>
                                </div>
                            </div>

                            {/* Address */}

                            <div className="flex min-w-0 items-center gap-3">
                                <div className="shrink-0 rounded-lg bg-gray-50 p-2">
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

                            {/* Guarantors */}

                            <div className="flex min-w-0 items-center gap-3">
                                <div className="shrink-0 rounded-lg bg-gray-50 p-2">
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

                    <div className="mb-3 flex items-end justify-between gap-3">
                        <div className="min-w-0">
                            <h2 className="text-base font-semibold text-gray-900">
                                Financial Overview
                            </h2>

                            <p className="text-xs text-gray-500">
                                Overall installment status
                            </p>
                        </div>

                        <span className="shrink-0 text-xs font-medium text-gray-500">
                            {paymentPercentage}% Paid
                        </span>
                    </div>

                    <div
                        className="
                            grid
                            w-full
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

                        <div
                            className="
                                min-w-0
                                border-b
                                border-gray-100
                                p-4
                                sm:border-r
                                xl:border-b-0
                            "
                        >
                            <div className="flex items-center gap-2">
                                <div className="shrink-0 rounded-lg bg-gray-100 p-2">
                                    <CircleDollarSign
                                        size={16}
                                        className="text-gray-600"
                                    />
                                </div>

                                <p className="text-xs text-gray-500">
                                    Total Value
                                </p>
                            </div>

                            <p className="mt-3 truncate text-base font-bold text-gray-900 sm:text-lg">
                                {formatAmount(totalAmount)}
                            </p>
                        </div>

                        {/* Paid */}

                        <div
                            className="
                                min-w-0
                                border-b
                                border-gray-100
                                p-4
                                xl:border-b-0
                                xl:border-r
                            "
                        >
                            <div className="flex items-center gap-2">
                                <div className="shrink-0 rounded-lg bg-green-50 p-2">
                                    <CircleDollarSign
                                        size={16}
                                        className="text-green-600"
                                    />
                                </div>

                                <p className="text-xs text-gray-500">
                                    Total Paid
                                </p>
                            </div>

                            <p className="mt-3 truncate text-base font-bold text-green-600 sm:text-lg">
                                {formatAmount(totalPaid)}
                            </p>
                        </div>

                        {/* Remaining */}

                        <div
                            className="
                                min-w-0
                                border-b
                                border-gray-100
                                p-4
                                sm:border-r
                                xl:border-b-0
                            "
                        >
                            <div className="flex items-center gap-2">
                                <div className="shrink-0 rounded-lg bg-blue-50 p-2">
                                    <CircleDollarSign
                                        size={16}
                                        className="text-blue-600"
                                    />
                                </div>

                                <p className="text-xs text-gray-500">
                                    Remaining
                                </p>
                            </div>

                            <p className="mt-3 truncate text-base font-bold text-blue-600 sm:text-lg">
                                {formatAmount(totalRemaining)}
                            </p>
                        </div>

                        {/* Progress */}

                        <div className="min-w-0 p-4">
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-xs text-gray-500">
                                    Payment Progress
                                </p>

                                <span className="shrink-0 text-xs font-semibold text-gray-700">
                                    {paymentPercentage}%
                                </span>
                            </div>

                            <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
                                <div
                                    className="h-full rounded-full bg-blue-600 transition-all duration-500"
                                    style={{
                                        width: `${paymentPercentage}%`,
                                    }}
                                />
                            </div>

                            <p className="mt-2 truncate text-[11px] text-gray-400">
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
                                        min-w-0
                                        flex-col
                                        gap-3
                                        rounded-xl
                                        border
                                        border-gray-200
                                        bg-white
                                        px-4
                                        py-3
                                        shadow-sm
                                        sm:flex-row
                                        sm:items-center
                                        sm:justify-between
                                    "
                                >

                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="shrink-0 rounded-full bg-gray-100 p-2.5">
                                            <Users
                                                size={17}
                                                className="text-gray-600"
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-gray-900">
                                                {guarantor.fullName}
                                            </p>

                                            <p className="truncate text-xs text-gray-500">
                                                {guarantor.phone}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-100 pt-2 text-left sm:border-0 sm:pt-0 sm:text-right">
                                        <p className="text-[10px] uppercase text-gray-400">
                                            CNIC
                                        </p>

                                        <p className="truncate text-xs text-gray-600">
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

                    <div className="mb-3 flex items-end justify-between gap-3">
                        <div className="min-w-0">
                            <h2 className="text-base font-semibold text-gray-900">
                                Purchased Items
                            </h2>

                            <p className="text-xs text-gray-500">
                                Installment agreements and payment status
                            </p>
                        </div>

                        <span className="shrink-0 text-xs text-gray-400">
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
                                p-8
                                text-center
                                sm:p-10
                            "
                        >
                            <p className="text-sm font-medium text-gray-700">
                                No installment purchases found.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">

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
                                            w-full
                                            overflow-hidden
                                            rounded-xl
                                            border
                                            border-gray-200
                                            bg-white
                                            p-3
                                            shadow-sm
                                            transition-all
                                            hover:border-blue-200
                                            hover:shadow-md
                                            sm:p-4
                                        "
                                    >

                                        {/* =================================================
                                            MOBILE LAYOUT
                                        ================================================= */}

                                        <div className="sm:hidden">

                                            {/* Header */}

                                            <div className="flex min-w-0 items-center gap-3">

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

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex min-w-0 items-center gap-2">

                                                        <h3 className="min-w-0 flex-1 truncate text-sm font-semibold text-gray-900">
                                                            {productName.trim() ||
                                                                "Unnamed Item"}
                                                        </h3>

                                                        <ArrowRight
                                                            size={16}
                                                            className="
                                                                shrink-0
                                                                text-gray-400
                                                                transition
                                                                group-hover:translate-x-0.5
                                                                group-hover:text-blue-600
                                                            "
                                                        />
                                                    </div>

                                                    <p className="mt-0.5 text-[11px] text-gray-400">
                                                        {agreement.category}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Status */}

                                            <div className="mt-3 flex items-center justify-between gap-2">
                                                <span
                                                    className={`
                                                        rounded-full
                                                        px-2
                                                        py-1
                                                        text-[10px]
                                                        font-medium
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

                                                <span className="text-[10px] font-medium text-gray-500">
                                                    {percentage}% paid
                                                </span>
                                            </div>

                                            {/* Financial Information */}

                                            <div
                                                className="
                                                    mt-3
                                                    grid
                                                    grid-cols-1
                                                    gap-2
                                                    border-t
                                                    border-gray-100
                                                    pt-3
                                                    xs:grid-cols-3
                                                "
                                            >

                                                <div className="min-w-0">
                                                    <p className="text-[10px] text-gray-400">
                                                        Agreement
                                                    </p>

                                                    <p className="mt-0.5 truncate text-xs font-semibold text-gray-800">
                                                        {formatAmount(
                                                            agreement.totalAmount
                                                        )}
                                                    </p>
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="text-[10px] text-gray-400">
                                                        Paid
                                                    </p>

                                                    <p className="mt-0.5 truncate text-xs font-semibold text-green-600">
                                                        {formatAmount(paid)}
                                                    </p>
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="text-[10px] text-gray-400">
                                                        Remaining
                                                    </p>

                                                    <p className="mt-0.5 truncate text-xs font-semibold text-blue-600">
                                                        {formatAmount(
                                                            remaining
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Progress */}

                                            <div className="mt-3">
                                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                                                    <div
                                                        className="h-full rounded-full bg-blue-600 transition-all duration-500"
                                                        style={{
                                                            width: `${percentage}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Date */}

                                            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                                                <div className="flex items-center gap-1">
                                                    <CalendarDays
                                                        size={12}
                                                        className="text-gray-400"
                                                    />

                                                    <span className="text-[10px] text-gray-400">
                                                        Started
                                                    </span>
                                                </div>

                                                <span className="text-xs font-medium text-gray-700">
                                                    {formatDate(
                                                        agreement.startDate
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        {/* =================================================
                                            TABLET / DESKTOP LAYOUT
                                        ================================================= */}

                                        <div className="hidden min-w-0 items-center gap-3 sm:flex lg:gap-4">

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

                                            {/* Product */}

                                            <div className="min-w-0 flex-1">
                                                <div className="flex min-w-0 items-center gap-2">

                                                    <h3 className="min-w-0 truncate text-sm font-semibold text-gray-900">
                                                        {productName.trim() ||
                                                            "Unnamed Item"}
                                                    </h3>

                                                    <span
                                                        className={`
                                                            hidden
                                                            shrink-0
                                                            rounded-full
                                                            px-2
                                                            py-0.5
                                                            text-[10px]
                                                            font-medium
                                                            md:inline-flex
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

                                            {/* Agreement */}

                                            <div className="hidden w-28 shrink-0 md:block lg:w-32">
                                                <p className="text-[10px] text-gray-400">
                                                    Agreement
                                                </p>

                                                <p className="mt-1 truncate text-sm font-semibold text-gray-800">
                                                    {formatAmount(
                                                        agreement.totalAmount
                                                    )}
                                                </p>
                                            </div>

                                            {/* Paid */}

                                            <div className="hidden w-24 shrink-0 lg:block">
                                                <p className="text-[10px] text-gray-400">
                                                    Paid
                                                </p>

                                                <p className="mt-1 truncate text-sm font-semibold text-green-600">
                                                    {formatAmount(paid)}
                                                </p>
                                            </div>

                                            {/* Remaining */}

                                            <div className="w-24 shrink-0 sm:w-28">
                                                <p className="text-[10px] text-gray-400">
                                                    Remaining
                                                </p>

                                                <p className="mt-1 truncate text-sm font-semibold text-blue-600">
                                                    {formatAmount(remaining)}
                                                </p>
                                            </div>

                                            {/* Progress */}

                                            <div className="hidden w-24 shrink-0 xl:block">
                                                <div className="flex justify-between gap-2">
                                                    <span className="text-[10px] text-gray-400">
                                                        Progress
                                                    </span>

                                                    <span className="text-[10px] font-medium text-gray-600">
                                                        {percentage}%
                                                    </span>
                                                </div>

                                                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-gray-100">
                                                    <div
                                                        className="h-full rounded-full bg-blue-600 transition-all duration-500"
                                                        style={{
                                                            width: `${percentage}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Date */}

                                            <div className="hidden w-24 shrink-0 2xl:block">
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