import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Bike,
    Smartphone,
    User,
    Phone,
    CreditCard,
    CalendarDays,
    CircleDollarSign,
    CheckCircle2,
    Clock,
    AlertCircle,
    Wallet,
} from "lucide-react";

type PageProps = {
    params: Promise<{
        customerId: string;
        agreementId: string;
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

export default async function AgreementDetailsPage({
    params,
}: PageProps) {
    const { customerId, agreementId } = await params;

    const agreement =
        await prisma.installmentAgreement.findFirst({
            where: {
                id: agreementId,
                customerId,
            },

            include: {
                customer: true,
                bike: true,
                mobile: true,

                payments: {
                    orderBy: {
                        paymentDate: "desc",
                    },
                },
            },
        });

    if (!agreement) {
        notFound();
    }

    const payments = agreement.payments;

    /* =====================================================
       FINANCIAL CALCULATIONS
    ===================================================== */

    const totalPaid = payments.reduce(
        (sum, payment) => sum + payment.amountPaid,
        0
    );

    const latestPayment = payments[0];

    const remainingBalance =
        latestPayment?.remainingBalance ??
        agreement.totalAmount;

    const progress =
        agreement.totalAmount > 0
            ? Math.min(
                100,
                (totalPaid / agreement.totalAmount) * 100
            )
            : 0;

    const progressRounded = Math.round(progress);

    const product =
        agreement.category === "BIKE"
            ? agreement.bike
            : agreement.mobile;

    const productName =
        product && "brand" in product
            ? `${product.brand} ${product.model}`
            : agreement.category;

    /* =====================================================
       PAYMENT INFORMATION
    ===================================================== */

    const monthlyInstallment =
        latestPayment?.monthlyInstallment ?? null;

    const nextDueDate =
        latestPayment?.nextDueDate ?? null;

    const lastPaymentDate =
        latestPayment?.paymentDate ?? null;

    return (
        <main className="min-h-screen w-full overflow-x-hidden bg-gray-50 px-3 py-4 sm:px-5 sm:py-6 lg:px-6">
            <div className="mx-auto w-full max-w-7xl">

                {/* =====================================================
                    BACK
                ===================================================== */}

                <Link
                    href={`/dashboard/Customers/${customerId}`}
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
                    <span>Customer</span>
                </Link>

                {/* =====================================================
                    AGREEMENT HEADER
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

                        {/* Product + Customer */}

                        <div
                            className="
                                flex
                                flex-col
                                gap-4
                                lg:flex-row
                                lg:items-center
                                lg:justify-between
                            "
                        >

                            {/* Product */}

                            <div className="flex min-w-0 items-center gap-3 sm:gap-4">

                                <div
                                    className="
                                        flex
                                        h-12
                                        w-12
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-blue-50
                                        text-blue-600
                                        sm:h-14
                                        sm:w-14
                                    "
                                >
                                    {agreement.category === "BIKE" ? (
                                        <Bike
                                            size={24}
                                            className="sm:hidden"
                                        />
                                    ) : (
                                        <Smartphone
                                            size={24}
                                            className="sm:hidden"
                                        />
                                    )}

                                    {agreement.category === "BIKE" ? (
                                        <Bike
                                            size={27}
                                            className="hidden sm:block"
                                        />
                                    ) : (
                                        <Smartphone
                                            size={27}
                                            className="hidden sm:block"
                                        />
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">

                                    <div className="flex min-w-0 flex-wrap items-center gap-2">

                                        <h1 className="min-w-0 max-w-full truncate text-lg font-bold text-gray-900 sm:text-xl">
                                            {productName}
                                        </h1>

                                        <span
                                            className={`
                                                shrink-0
                                                rounded-full
                                                px-2.5
                                                py-1
                                                text-[10px]
                                                font-semibold
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

                                    <p className="mt-1 truncate text-xs text-gray-500">
                                        {agreement.category} installment agreement
                                    </p>
                                </div>
                            </div>

                            {/* Customer */}

                            <Link
                                href={`/dashboard/Customers/${customerId}`}
                                className="
                                    flex
                                    min-w-0
                                    w-full
                                    items-center
                                    gap-3
                                    rounded-xl
                                    bg-gray-50
                                    px-3
                                    py-2.5
                                    transition
                                    hover:bg-blue-50
                                    sm:w-auto
                                    sm:max-w-full
                                    lg:min-w-[220px]
                                "
                            >
                                <div className="shrink-0 rounded-full bg-white p-2">
                                    <User
                                        size={16}
                                        className="text-gray-500"
                                    />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[10px] uppercase text-gray-400">
                                        Customer
                                    </p>

                                    <p className="truncate text-sm font-semibold text-gray-800">
                                        {agreement.customer.fullName}
                                    </p>
                                </div>
                            </Link>
                        </div>

                        {/* Quick Agreement Details */}

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

                            {/* Start Date */}

                            <div className="flex min-w-0 items-center gap-3">
                                <div className="shrink-0 rounded-lg bg-gray-50 p-2">
                                    <CalendarDays
                                        size={15}
                                        className="text-gray-500"
                                    />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[10px] uppercase text-gray-400">
                                        Start Date
                                    </p>

                                    <p className="truncate text-sm font-medium text-gray-700">
                                        {formatDate(
                                            agreement.startDate
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Monthly Installment */}

                            <div className="flex min-w-0 items-center gap-3">
                                <div className="shrink-0 rounded-lg bg-gray-50 p-2">
                                    <Wallet
                                        size={15}
                                        className="text-gray-500"
                                    />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[10px] uppercase text-gray-400">
                                        Monthly Installment
                                    </p>

                                    <p className="truncate text-sm font-medium text-gray-700">
                                        {monthlyInstallment
                                            ? formatAmount(
                                                monthlyInstallment
                                            )
                                            : "—"}
                                    </p>
                                </div>
                            </div>

                            {/* Last Payment */}

                            <div className="flex min-w-0 items-center gap-3">
                                <div className="shrink-0 rounded-lg bg-gray-50 p-2">
                                    <Clock
                                        size={15}
                                        className="text-gray-500"
                                    />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[10px] uppercase text-gray-400">
                                        Last Payment
                                    </p>

                                    <p className="truncate text-sm font-medium text-gray-700">
                                        {formatDate(
                                            lastPaymentDate
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Next Due */}

                            <div className="flex min-w-0 items-center gap-3">
                                <div className="shrink-0 rounded-lg bg-blue-50 p-2">
                                    <CalendarDays
                                        size={15}
                                        className="text-blue-600"
                                    />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[10px] uppercase text-gray-400">
                                        Next Due
                                    </p>

                                    <p className="truncate text-sm font-semibold text-blue-600">
                                        {formatDate(nextDueDate)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* =====================================================
                    FINANCIAL SUMMARY
                ===================================================== */}

                <section className="mt-5">

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

                                <span className="text-xs text-gray-500">
                                    Agreement Value
                                </span>
                            </div>

                            <p className="mt-3 truncate text-lg font-bold text-gray-900 sm:text-xl">
                                {formatAmount(
                                    agreement.totalAmount
                                )}
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
                                    <CheckCircle2
                                        size={16}
                                        className="text-green-600"
                                    />
                                </div>

                                <span className="text-xs text-gray-500">
                                    Total Paid
                                </span>
                            </div>

                            <p className="mt-3 truncate text-lg font-bold text-green-600 sm:text-xl">
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
                                    <AlertCircle
                                        size={16}
                                        className="text-blue-600"
                                    />
                                </div>

                                <span className="text-xs text-gray-500">
                                    Remaining
                                </span>
                            </div>

                            <p className="mt-3 truncate text-lg font-bold text-blue-600 sm:text-xl">
                                {formatAmount(
                                    remainingBalance
                                )}
                            </p>
                        </div>

                        {/* Payments */}

                        <div className="min-w-0 p-4">
                            <div className="flex items-center gap-2">
                                <div className="shrink-0 rounded-lg bg-gray-100 p-2">
                                    <Clock
                                        size={16}
                                        className="text-gray-600"
                                    />
                                </div>

                                <span className="text-xs text-gray-500">
                                    Payments Made
                                </span>
                            </div>

                            <p className="mt-3 text-lg font-bold text-gray-900 sm:text-xl">
                                {payments.length}
                            </p>
                        </div>
                    </div>
                </section>

                {/* =====================================================
                    PAYMENT PROGRESS
                ===================================================== */}

                <section
                    className="
                        mt-5
                        rounded-2xl
                        border
                        border-gray-200
                        bg-white
                        p-4
                        shadow-sm
                        sm:p-5
                    "
                >

                    <div className="flex items-center justify-between gap-3">

                        <div className="min-w-0">
                            <h2 className="text-sm font-semibold text-gray-900">
                                Payment Progress
                            </h2>

                            <p className="mt-1 truncate text-xs text-gray-500">
                                {formatAmount(totalPaid)} paid of{" "}
                                {formatAmount(
                                    agreement.totalAmount
                                )}
                            </p>
                        </div>

                        <div className="shrink-0 text-right">
                            <p className="text-lg font-bold text-blue-600">
                                {progressRounded}%
                            </p>

                            <p className="text-[10px] text-gray-400">
                                completed
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                            className="h-full rounded-full bg-blue-600 transition-all duration-500"
                            style={{
                                width: `${progress}%`,
                            }}
                        />
                    </div>

                    <div className="mt-2 flex justify-between gap-3 text-[10px] text-gray-400">
                        <span>Rs. 0</span>

                        <span className="truncate">
                            {formatAmount(
                                agreement.totalAmount
                            )}
                        </span>
                    </div>
                </section>

                {/* =====================================================
                    PRODUCT DETAILS
                ===================================================== */}

                <section className="mt-6">

                    <div className="mb-3">
                        <h2 className="text-base font-semibold text-gray-900">
                            Product Details
                        </h2>

                        <p className="text-xs text-gray-500">
                            Information about the financed item
                        </p>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                        {/* BIKE */}

                        {agreement.category === "BIKE" &&
                            agreement.bike && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

                                    <div className="min-w-0 border-b border-gray-100 p-4 sm:border-r">
                                        <p className="text-[10px] uppercase text-gray-400">
                                            Brand
                                        </p>

                                        <p className="mt-1 truncate text-sm font-semibold text-gray-800">
                                            {agreement.bike.brand}
                                        </p>
                                    </div>

                                    <div className="min-w-0 border-b border-gray-100 p-4 lg:border-r">
                                        <p className="text-[10px] uppercase text-gray-400">
                                            Model
                                        </p>

                                        <p className="mt-1 truncate text-sm font-semibold text-gray-800">
                                            {agreement.bike.model}
                                        </p>
                                    </div>

                                    <div className="min-w-0 border-b border-gray-100 p-4 sm:border-r lg:border-r-0">
                                        <p className="text-[10px] uppercase text-gray-400">
                                            Color
                                        </p>

                                        <p className="mt-1 truncate text-sm font-semibold text-gray-800">
                                            {agreement.bike.color}
                                        </p>
                                    </div>

                                    <div className="min-w-0 border-b border-gray-100 p-4 sm:border-r lg:border-b-0">
                                        <p className="text-[10px] uppercase text-gray-400">
                                            Engine Number
                                        </p>

                                        <p className="mt-1 break-all text-sm font-semibold text-gray-800">
                                            {agreement.bike.engineNumber}
                                        </p>
                                    </div>

                                    <div className="min-w-0 border-b border-gray-100 p-4 lg:border-b-0 lg:border-r">
                                        <p className="text-[10px] uppercase text-gray-400">
                                            Chassis Number
                                        </p>

                                        <p className="mt-1 break-all text-sm font-semibold text-gray-800">
                                            {agreement.bike.chassisNumber}
                                        </p>
                                    </div>

                                    <div className="min-w-0 p-4">
                                        <p className="text-[10px] uppercase text-gray-400">
                                            Start Date
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-gray-800">
                                            {formatDate(
                                                agreement.startDate
                                            )}
                                        </p>
                                    </div>
                                </div>
                            )}

                        {/* MOBILE */}

                        {agreement.category === "MOBILE" &&
                            agreement.mobile && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

                                    <div className="min-w-0 border-b border-gray-100 p-4 sm:border-r">
                                        <p className="text-[10px] uppercase text-gray-400">
                                            Brand
                                        </p>

                                        <p className="mt-1 truncate text-sm font-semibold text-gray-800">
                                            {agreement.mobile.brand}
                                        </p>
                                    </div>

                                    <div className="min-w-0 border-b border-gray-100 p-4 lg:border-r">
                                        <p className="text-[10px] uppercase text-gray-400">
                                            Model
                                        </p>

                                        <p className="mt-1 truncate text-sm font-semibold text-gray-800">
                                            {agreement.mobile.model}
                                        </p>
                                    </div>

                                    <div className="min-w-0 border-b border-gray-100 p-4 sm:border-r lg:border-r-0">
                                        <p className="text-[10px] uppercase text-gray-400">
                                            IMEI 1
                                        </p>

                                        <p className="mt-1 break-all text-sm font-semibold text-gray-800">
                                            {agreement.mobile.imei1}
                                        </p>
                                    </div>

                                    <div className="min-w-0 border-b border-gray-100 p-4 sm:border-r lg:border-b-0">
                                        <p className="text-[10px] uppercase text-gray-400">
                                            IMEI 2
                                        </p>

                                        <p className="mt-1 break-all text-sm font-semibold text-gray-800">
                                            {agreement.mobile.imei2 ??
                                                "—"}
                                        </p>
                                    </div>

                                    <div className="min-w-0 p-4">
                                        <p className="text-[10px] uppercase text-gray-400">
                                            Start Date
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-gray-800">
                                            {formatDate(
                                                agreement.startDate
                                            )}
                                        </p>
                                    </div>
                                </div>
                            )}
                    </div>
                </section>

                {/* =====================================================
                    CUSTOMER INFORMATION
                ===================================================== */}

                <section className="mt-6">

                    <div className="mb-3">
                        <h2 className="text-base font-semibold text-gray-900">
                            Customer Information
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

                        {/* Customer */}

                        <div className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

                            <div className="flex items-center gap-2">
                                <User
                                    size={16}
                                    className="shrink-0 text-gray-400"
                                />

                                <span className="text-[10px] uppercase text-gray-400">
                                    Customer
                                </span>
                            </div>

                            <p className="mt-2 truncate text-sm font-semibold text-gray-900">
                                {agreement.customer.fullName}
                            </p>

                            <p className="truncate text-xs text-gray-500">
                                S/O {agreement.customer.fatherName}
                            </p>
                        </div>

                        {/* Phone */}

                        <div className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

                            <div className="flex items-center gap-2">
                                <Phone
                                    size={16}
                                    className="shrink-0 text-gray-400"
                                />

                                <span className="text-[10px] uppercase text-gray-400">
                                    Phone
                                </span>
                            </div>

                            <p className="mt-2 truncate text-sm font-semibold text-gray-900">
                                {agreement.customer.phone}
                            </p>
                        </div>

                        {/* CNIC */}

                        <div className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

                            <div className="flex items-center gap-2">
                                <CreditCard
                                    size={16}
                                    className="shrink-0 text-gray-400"
                                />

                                <span className="text-[10px] uppercase text-gray-400">
                                    CNIC
                                </span>
                            </div>

                            <p className="mt-2 break-all text-sm font-semibold text-gray-900">
                                {agreement.customer.cnic}
                            </p>
                        </div>
                    </div>
                </section>

                {/* =====================================================
                    PAYMENT HISTORY
                ===================================================== */}

                <section className="mt-6 pb-8">

                    <div className="mb-3 flex items-end justify-between gap-3">

                        <div className="min-w-0">
                            <h2 className="text-base font-semibold text-gray-900">
                                Payment History
                            </h2>

                            <p className="text-xs text-gray-500">
                                Complete transaction history
                            </p>
                        </div>

                        <span className="shrink-0 text-xs text-gray-400">
                            {payments.length} payment
                            {payments.length !== 1 ? "s" : ""}
                        </span>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                        {/* =================================================
                            NO PAYMENTS
                        ================================================= */}

                        {payments.length === 0 ? (
                            <div className="p-8 text-center sm:p-10">

                                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                                    <Wallet
                                        size={18}
                                        className="text-gray-400"
                                    />
                                </div>

                                <p className="mt-3 text-sm font-medium text-gray-700">
                                    No payments recorded
                                </p>

                                <p className="mt-1 text-xs text-gray-400">
                                    Payment transactions will appear here.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* =================================================
                                    MOBILE PAYMENT CARDS
                                ================================================= */}

                                <div className="divide-y divide-gray-100 sm:hidden">

                                    {payments.map(
                                        (payment, index) => (
                                            <div
                                                key={payment.id}
                                                className="p-4"
                                            >

                                                {/* Payment Header */}

                                                <div className="flex items-start justify-between gap-3">

                                                    <div className="flex min-w-0 items-center gap-2">

                                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-50">
                                                            <CalendarDays
                                                                size={14}
                                                                className="text-gray-400"
                                                            />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="truncate text-xs font-semibold text-gray-700">
                                                                {formatDate(
                                                                    payment.paymentDate
                                                                )}
                                                            </p>

                                                            <p className="text-[10px] text-gray-400">
                                                                Payment #
                                                                {payments.length -
                                                                    index}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <span className="shrink-0 rounded-md bg-gray-100 px-2 py-1 text-[10px] font-medium text-gray-600">
                                                        {
                                                            payment.paymentType
                                                        }
                                                    </span>
                                                </div>

                                                {/* Amount */}

                                                <div className="mt-4 rounded-xl bg-green-50 p-3">

                                                    <p className="text-[10px] uppercase text-green-600">
                                                        Amount Paid
                                                    </p>

                                                    <p className="mt-1 text-lg font-bold text-green-600">
                                                        {formatAmount(
                                                            payment.amountPaid
                                                        )}
                                                    </p>
                                                </div>

                                                {/* Payment Details */}

                                                <div className="mt-3 grid grid-cols-2 gap-3">

                                                    <div className="min-w-0">
                                                        <p className="text-[10px] text-gray-400">
                                                            Monthly Installment
                                                        </p>

                                                        <p className="mt-1 truncate text-xs font-medium text-gray-700">
                                                            {formatAmount(
                                                                payment.monthlyInstallment
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="text-[10px] text-gray-400">
                                                            Remaining
                                                        </p>

                                                        <p className="mt-1 truncate text-xs font-semibold text-blue-600">
                                                            {formatAmount(
                                                                payment.remainingBalance
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="text-[10px] text-gray-400">
                                                            Next Due
                                                        </p>

                                                        <p className="mt-1 truncate text-xs font-medium text-gray-700">
                                                            {formatDate(
                                                                payment.nextDueDate
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="text-[10px] text-gray-400">
                                                            Status
                                                        </p>

                                                        <p className="mt-1 text-xs font-medium text-green-600">
                                                            Recorded
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>

                                {/* =================================================
                                    TABLET / DESKTOP PAYMENT TABLE
                                ================================================= */}

                                <div className="hidden overflow-x-auto sm:block">

                                    <table className="w-full min-w-[760px] text-left">

                                        <thead className="border-b border-gray-100 bg-gray-50">
                                            <tr>

                                                <th className="whitespace-nowrap px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400 lg:px-5">
                                                    #
                                                </th>

                                                <th className="whitespace-nowrap px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400 lg:px-5">
                                                    Date
                                                </th>

                                                <th className="whitespace-nowrap px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400 lg:px-5">
                                                    Type
                                                </th>

                                                <th className="whitespace-nowrap px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400 lg:px-5">
                                                    Amount
                                                </th>

                                                <th className="whitespace-nowrap px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400 lg:px-5">
                                                    Installment
                                                </th>

                                                <th className="whitespace-nowrap px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400 lg:px-5">
                                                    Remaining
                                                </th>

                                                <th className="whitespace-nowrap px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400 lg:px-5">
                                                    Next Due
                                                </th>

                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-gray-100">

                                            {payments.map(
                                                (payment, index) => (
                                                    <tr
                                                        key={payment.id}
                                                        className="transition hover:bg-gray-50"
                                                    >

                                                        <td className="whitespace-nowrap px-4 py-3 text-xs font-medium text-gray-500 lg:px-5">
                                                            {payments.length -
                                                                index}
                                                        </td>

                                                        <td className="whitespace-nowrap px-4 py-3 lg:px-5">
                                                            <div className="flex items-center gap-2">

                                                                <CalendarDays
                                                                    size={14}
                                                                    className="shrink-0 text-gray-400"
                                                                />

                                                                <span className="text-xs font-medium text-gray-700">
                                                                    {formatDate(
                                                                        payment.paymentDate
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </td>

                                                        <td className="whitespace-nowrap px-4 py-3 lg:px-5">
                                                            <span className="inline-flex rounded-md bg-gray-100 px-2 py-1 text-[10px] font-medium text-gray-600">
                                                                {
                                                                    payment.paymentType
                                                                }
                                                            </span>
                                                        </td>

                                                        <td className="whitespace-nowrap px-4 py-3 lg:px-5">
                                                            <span className="text-sm font-semibold text-green-600">
                                                                {formatAmount(
                                                                    payment.amountPaid
                                                                )}
                                                            </span>
                                                        </td>

                                                        <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-600 lg:px-5">
                                                            {formatAmount(
                                                                payment.monthlyInstallment
                                                            )}
                                                        </td>

                                                        <td className="whitespace-nowrap px-4 py-3 lg:px-5">
                                                            <span className="text-sm font-semibold text-blue-600">
                                                                {formatAmount(
                                                                    payment.remainingBalance
                                                                )}
                                                            </span>
                                                        </td>

                                                        <td className="whitespace-nowrap px-4 py-3 lg:px-5">
                                                            <span className="text-xs text-gray-600">
                                                                {formatDate(
                                                                    payment.nextDueDate
                                                                )}
                                                            </span>
                                                        </td>

                                                    </tr>
                                                )
                                            )}

                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}