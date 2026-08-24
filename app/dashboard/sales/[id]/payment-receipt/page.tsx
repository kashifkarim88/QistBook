import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PrintButton from "./PrintButton";

function formatDate(date: Date | null | undefined) {
    if (!date) return "—";

    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Karachi",
    }).format(date);
}

function formatAmount(amount: number) {
    return amount.toLocaleString("en-PK", {
        maximumFractionDigits: 0,
    });
}

export default async function PaymentReceiptPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams?: Promise<{
        customerId?: string;
        paymentId?: string;
    }>;
}) {
    const { id } = await params;

    const resolvedSearchParams = searchParams
        ? await searchParams
        : {};

    const customerId =
        resolvedSearchParams.customerId;

    const paymentId =
        resolvedSearchParams.paymentId;

    if (!customerId || !paymentId) {
        notFound();
    }

    // =========================================================
    // GET AGREEMENT
    // =========================================================

    const agreement =
        await prisma.installmentAgreement.findUnique({
            where: {
                id,
            },

            include: {
                customer: {
                    include: {
                        guarantors: true,
                    },
                },

                bike: true,

                mobile: true,

                payments: {
                    orderBy: [
                        {
                            paymentDate: "asc",
                        },
                        {
                            createdAt: "asc",
                        },
                    ],
                },
            },
        });

    if (!agreement) {
        notFound();
    }

    // =========================================================
    // VERIFY CUSTOMER
    // =========================================================

    if (agreement.customerId !== customerId) {
        notFound();
    }

    // =========================================================
    // GET CURRENT PAYMENT
    // =========================================================

    const payment =
        agreement.payments.find(
            (p) => p.id === paymentId
        );

    if (!payment) {
        notFound();
    }

    // =========================================================
    // FIND PREVIOUS PAYMENT
    // =========================================================

    const paymentIndex =
        agreement.payments.findIndex(
            (p) => p.id === paymentId
        );

    const previousPayment =
        paymentIndex > 0
            ? agreement.payments[paymentIndex - 1]
            : null;

    // =========================================================
    // PREVIOUS BALANCE
    // =========================================================

    const previousBalance =
        previousPayment?.remainingBalance ??
        agreement.totalAmount;

    // =========================================================
    // TOTAL PAID
    // =========================================================

    const totalPaid =
        agreement.payments.reduce(
            (sum, p) =>
                sum + Number(p.amountPaid),
            0
        );

    // =========================================================
    // ADVANCE PAYMENT
    // =========================================================

    const advancePayment =
        agreement.payments.find(
            (p) => p.paymentType === "ADVANCE"
        );

    // =========================================================
    // CURRENT REMAINING BALANCE
    // =========================================================

    const remainingBalance =
        Number(payment.remainingBalance);

    // =========================================================
    // NEXT DUE DATE
    // =========================================================

    const nextDueDate =
        payment.nextDueDate;

    const isCompleted =
        remainingBalance <= 0 ||
        agreement.status === "COMPLETED";

    return (
        <>
            {/* =====================================================
                PRINT SETTINGS
            ===================================================== */}

            <style>
                {`
                    @page {
                        size: A4;
                        margin: 0;
                    }

                    @media print {
                        html,
                        body {
                            width: 210mm;
                            height: 297mm;
                            margin: 0;
                            padding: 0;
                            background: white !important;
                        }

                        body {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }

                        .receipt-page {
                            width: 210mm !important;
                            height: 297mm !important;
                            min-height: 297mm !important;
                            max-height: 297mm !important;
                            margin: 0 !important;
                            padding: 8mm !important;
                            box-sizing: border-box !important;
                            overflow: hidden !important;
                            border: none !important;
                            border-radius: 0 !important;
                            box-shadow: none !important;
                        }

                        .print-hide {
                            display: none !important;
                        }

                        .avoid-break {
                            break-inside: avoid !important;
                            page-break-inside: avoid !important;
                        }

                        table {
                            page-break-inside: avoid !important;
                        }

                        tr {
                            page-break-inside: avoid !important;
                        }
                    }
                `}
            </style>

            {/* =====================================================
                OUTER SCREEN BACKGROUND
            ===================================================== */}

            <div className="min-h-screen bg-slate-100 py-8 print:bg-white print:p-0">

                {/* =================================================
                    A4 RECEIPT
                ================================================= */}

                <div
                    className="
                        receipt-page
                        w-[210mm]
                        min-h-[297mm]
                        mx-auto
                        bg-white
                        text-slate-900
                        shadow-lg
                        border
                        border-slate-200
                        rounded-lg
                        overflow-hidden
                        print:shadow-none
                        print:border-none
                        print:rounded-none
                    "
                >

                    {/* =================================================
                        SCREEN ONLY ACTION BAR
                    ================================================= */}

                    <div
                        className="
                            print-hide
                            flex
                            items-center
                            justify-between
                            px-7
                            py-4
                            border-b
                            border-slate-200
                        "
                    >

                        <div>
                            <h1 className="text-lg font-bold text-slate-900">
                                Payment Receipt
                            </h1>

                            <p className="text-xs text-slate-500 mt-0.5">
                                Installment payment confirmation
                            </p>
                        </div>

                        <PrintButton />

                    </div>


                    {/* =================================================
                        RECEIPT CONTENT
                    ================================================= */}

                    <div className="px-[10mm] py-[7mm] print:px-0 print:py-0">

                        {/* =================================================
                            BUSINESS HEADER
                        ================================================= */}

                        <div className="text-center border-b-2 border-slate-900 pb-3 mb-3">

                            <h2
                                className="
                                    text-[25px]
                                    font-extrabold
                                    uppercase
                                    tracking-[0.12em]
                                    text-slate-950
                                "
                            >
                                Rahim Dad Autos
                            </h2>

                            <p className="text-[11px] text-slate-600 mt-0.5">
                                Main Market Road, City
                                <span className="mx-1">•</span>
                                Contact: +92 300 0000000
                            </p>

                            <p className="text-[12px] font-bold uppercase mt-1">
                                Installment Payment Receipt
                            </p>

                        </div>


                        {/* =================================================
                            PAYMENT META
                        ================================================= */}

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                text-[11px]
                                mb-3
                                pb-2
                                border-b
                                border-slate-300
                            "
                        >

                            <div>
                                <span className="font-bold uppercase text-slate-500">
                                    Payment Date:
                                </span>{" "}
                                <span className="font-bold text-slate-900">
                                    {formatDate(payment.paymentDate)}
                                </span>
                            </div>

                            <div>
                                <span className="font-bold uppercase text-slate-500">
                                    Payment Type:
                                </span>{" "}
                                <span className="font-bold text-slate-900">
                                    {payment.paymentType ===
                                        "INSTALLMENT"
                                        ? "Installment"
                                        : "Advance"}
                                </span>
                            </div>

                        </div>


                        {/* =================================================
                            IDENTIFICATION
                        ================================================= */}

                        <div
                            className="
                                grid
                                grid-cols-3
                                gap-4
                                mb-3
                                text-[9px]
                                text-slate-600
                            "
                        >

                            <div>
                                <span className="font-bold text-slate-700">
                                    Payment ID:
                                </span>

                                <p className="font-mono text-[8px] break-all text-slate-500 mt-0.5">
                                    {payment.id}
                                </p>
                            </div>

                            <div>
                                <span className="font-bold text-slate-700">
                                    Agreement ID:
                                </span>

                                <p className="font-mono text-[8px] break-all text-slate-500 mt-0.5">
                                    {agreement.id}
                                </p>
                            </div>

                            <div>
                                <span className="font-bold text-slate-700">
                                    Customer ID:
                                </span>

                                <p className="font-mono text-[8px] break-all text-slate-500 mt-0.5">
                                    {agreement.customer.id}
                                </p>
                            </div>

                        </div>


                        {/* =================================================
                            CUSTOMER + GUARANTOR
                        ================================================= */}

                        <div
                            className="
                                grid
                                grid-cols-2
                                gap-4
                                mb-3
                                avoid-break
                            "
                        >

                            {/* CUSTOMER */}

                            <div className="border border-slate-300 rounded-md px-3 py-2.5">

                                <h3
                                    className="
                                        text-[10px]
                                        uppercase
                                        tracking-wide
                                        font-bold
                                        border-b
                                        border-slate-200
                                        pb-1.5
                                        mb-2
                                    "
                                >
                                    Customer Details
                                </h3>

                                <div className="space-y-1 text-[11px] leading-[1.35]">

                                    <p>
                                        <span className="font-bold">
                                            Name:
                                        </span>{" "}
                                        {agreement.customer.fullName}
                                    </p>

                                    <p>
                                        <span className="font-bold">
                                            Father Name:
                                        </span>{" "}
                                        {agreement.customer.fatherName}
                                    </p>

                                    <p>
                                        <span className="font-bold">
                                            CNIC:
                                        </span>{" "}
                                        {agreement.customer.cnic}
                                    </p>

                                    <p>
                                        <span className="font-bold">
                                            Phone:
                                        </span>{" "}
                                        {agreement.customer.phone}
                                    </p>

                                    <p>
                                        <span className="font-bold">
                                            Address:
                                        </span>{" "}
                                        {agreement.customer.address}
                                    </p>

                                </div>

                            </div>


                            {/* GUARANTOR */}

                            <div className="border border-slate-300 rounded-md px-3 py-2.5">

                                <h3
                                    className="
                                        text-[10px]
                                        uppercase
                                        tracking-wide
                                        font-bold
                                        border-b
                                        border-slate-200
                                        pb-1.5
                                        mb-2
                                    "
                                >
                                    Guarantor Details
                                </h3>

                                {agreement.customer.guarantors.length >
                                    0 ? (
                                    <div className="space-y-1 text-[11px] leading-[1.35]">

                                        <p>
                                            <span className="font-bold">
                                                Name:
                                            </span>{" "}
                                            {
                                                agreement
                                                    .customer
                                                    .guarantors[0]
                                                    .fullName
                                            }
                                        </p>

                                        <p>
                                            <span className="font-bold">
                                                CNIC:
                                            </span>{" "}
                                            {
                                                agreement
                                                    .customer
                                                    .guarantors[0]
                                                    .cnic
                                            }
                                        </p>

                                        <p>
                                            <span className="font-bold">
                                                Phone:
                                            </span>{" "}
                                            {
                                                agreement
                                                    .customer
                                                    .guarantors[0]
                                                    .phone
                                            }
                                        </p>

                                    </div>
                                ) : (
                                    <p className="text-[10px] text-slate-500">
                                        No guarantor details found.
                                    </p>
                                )}

                            </div>

                        </div>


                        {/* =================================================
                            ITEM DETAILS
                        ================================================= */}

                        <div
                            className="
                                border
                                border-slate-300
                                rounded-md
                                px-3
                                py-2.5
                                mb-3
                                avoid-break
                            "
                        >

                            <h3
                                className="
                                    text-[10px]
                                    uppercase
                                    tracking-wide
                                    font-bold
                                    border-b
                                    border-slate-200
                                    pb-1.5
                                    mb-2
                                "
                            >
                                Item Details
                            </h3>

                            {agreement.category === "BIKE" &&
                                agreement.bike && (
                                    <div
                                        className="
                                            grid
                                            grid-cols-2
                                            gap-x-6
                                            gap-y-1
                                            text-[11px]
                                        "
                                    >

                                        <p>
                                            <span className="font-bold">
                                                Category:
                                            </span>{" "}
                                            Bike
                                        </p>

                                        <p>
                                            <span className="font-bold">
                                                Brand / Model:
                                            </span>{" "}
                                            {
                                                agreement.bike
                                                    .brand
                                            }{" "}
                                            {
                                                agreement.bike
                                                    .model
                                            }
                                        </p>

                                        <p>
                                            <span className="font-bold">
                                                Color:
                                            </span>{" "}
                                            {
                                                agreement.bike
                                                    .color
                                            }
                                        </p>

                                        <p>
                                            <span className="font-bold">
                                                Engine No:
                                            </span>{" "}
                                            {
                                                agreement.bike
                                                    .engineNumber
                                            }
                                        </p>

                                        <p>
                                            <span className="font-bold">
                                                Chassis No:
                                            </span>{" "}
                                            {
                                                agreement.bike
                                                    .chassisNumber
                                            }
                                        </p>

                                    </div>
                                )}

                            {agreement.category === "MOBILE" &&
                                agreement.mobile && (
                                    <div
                                        className="
                                            grid
                                            grid-cols-2
                                            gap-x-6
                                            gap-y-1
                                            text-[11px]
                                        "
                                    >

                                        <p>
                                            <span className="font-bold">
                                                Category:
                                            </span>{" "}
                                            Mobile
                                        </p>

                                        <p>
                                            <span className="font-bold">
                                                Brand / Model:
                                            </span>{" "}
                                            {
                                                agreement.mobile
                                                    .brand
                                            }{" "}
                                            {
                                                agreement.mobile
                                                    .model
                                            }
                                        </p>

                                        <p>
                                            <span className="font-bold">
                                                IMEI 1:
                                            </span>{" "}
                                            {
                                                agreement.mobile
                                                    .imei1
                                            }
                                        </p>

                                        {agreement.mobile
                                            .imei2 && (
                                                <p>
                                                    <span className="font-bold">
                                                        IMEI 2:
                                                    </span>{" "}
                                                    {
                                                        agreement
                                                            .mobile
                                                            .imei2
                                                    }
                                                </p>
                                            )}

                                    </div>
                                )}

                        </div>


                        {/* =================================================
                            PAYMENT SUMMARY
                        ================================================= */}

                        <div
                            className="
                                border
                                border-slate-300
                                rounded-md
                                overflow-hidden
                                mb-3
                                avoid-break
                            "
                        >

                            <div className="bg-slate-900 text-white px-3 py-2">

                                <h3 className="text-[11px] font-bold uppercase tracking-wide">
                                    Payment Summary
                                </h3>

                            </div>

                            <table className="w-full text-[10.5px]">

                                <tbody>

                                    <tr className="border-b border-slate-200">

                                        <td className="px-3 py-1.5">
                                            Total Agreement Amount
                                        </td>

                                        <td className="px-3 py-1.5 text-right font-semibold">
                                            Rs.{" "}
                                            {formatAmount(
                                                agreement.totalAmount
                                            )}
                                        </td>

                                    </tr>

                                    <tr className="border-b border-slate-200">

                                        <td className="px-3 py-1.5">
                                            Advance Paid
                                        </td>

                                        <td className="px-3 py-1.5 text-right font-semibold">
                                            Rs.{" "}
                                            {formatAmount(
                                                Number(
                                                    advancePayment?.amountPaid ??
                                                    0
                                                )
                                            )}
                                        </td>

                                    </tr>

                                    <tr className="border-b border-slate-200">

                                        <td className="px-3 py-1.5">
                                            Total Paid So Far
                                        </td>

                                        <td className="px-3 py-1.5 text-right font-semibold">
                                            Rs.{" "}
                                            {formatAmount(
                                                totalPaid
                                            )}
                                        </td>

                                    </tr>

                                    <tr className="border-b border-slate-200">

                                        <td className="px-3 py-1.5">
                                            Previous Balance
                                        </td>

                                        <td className="px-3 py-1.5 text-right font-semibold">
                                            Rs.{" "}
                                            {formatAmount(
                                                previousBalance
                                            )}
                                        </td>

                                    </tr>

                                    <tr className="bg-emerald-50 border-b border-emerald-200">

                                        <td className="px-3 py-2 font-bold text-emerald-900">
                                            Current Payment
                                        </td>

                                        <td className="px-3 py-2 text-right font-extrabold text-emerald-700">
                                            Rs.{" "}
                                            {formatAmount(
                                                Number(
                                                    payment.amountPaid
                                                )
                                            )}
                                        </td>

                                    </tr>

                                    <tr className="bg-slate-50">

                                        <td className="px-3 py-2 font-bold">
                                            Remaining Balance
                                        </td>

                                        <td className="px-3 py-2 text-right font-extrabold">
                                            Rs.{" "}
                                            {formatAmount(
                                                remainingBalance
                                            )}
                                        </td>

                                    </tr>

                                </tbody>

                            </table>

                        </div>


                        {/* =================================================
                            INSTALLMENT + NEXT DATE
                        ================================================= */}

                        <div
                            className="
                                grid
                                grid-cols-2
                                gap-4
                                mb-3
                                avoid-break
                            "
                        >

                            <div className="border border-slate-300 rounded-md px-3 py-2.5">

                                <p className="text-[9px] uppercase tracking-wide text-slate-500 font-bold">
                                    Monthly Installment
                                </p>

                                <p className="text-[16px] font-extrabold mt-0.5">
                                    Rs.{" "}
                                    {formatAmount(
                                        Number(
                                            payment.monthlyInstallment
                                        )
                                    )}
                                </p>

                            </div>

                            <div
                                className={`
                                    rounded-md
                                    px-3
                                    py-2.5
                                    border
                                    ${isCompleted
                                        ? "border-emerald-200 bg-emerald-50"
                                        : "border-blue-200 bg-blue-50"
                                    }
                                `}
                            >

                                <p
                                    className={`
                                        text-[9px]
                                        uppercase
                                        tracking-wide
                                        font-bold
                                        ${isCompleted
                                            ? "text-emerald-700"
                                            : "text-blue-700"
                                        }
                                    `}
                                >
                                    {isCompleted
                                        ? "Agreement Status"
                                        : "Next Due Date"}
                                </p>

                                <p
                                    className={`
                                        text-[16px]
                                        font-extrabold
                                        mt-0.5
                                        ${isCompleted
                                            ? "text-emerald-700"
                                            : "text-blue-700"
                                        }
                                    `}
                                >
                                    {isCompleted
                                        ? "FULLY PAID"
                                        : formatDate(
                                            nextDueDate
                                        )}
                                </p>

                            </div>

                        </div>


                        {/* =================================================
                            PAYMENT CONFIRMATION
                        ================================================= */}

                        <div
                            className="
                                border-t
                                border-b
                                border-slate-300
                                py-2.5
                                mb-8
                                avoid-break
                            "
                        >

                            <p className="text-[10px] text-slate-700 leading-5">

                                Received payment of{" "}

                                <span className="font-bold">
                                    Rs.{" "}
                                    {formatAmount(
                                        Number(
                                            payment.amountPaid
                                        )
                                    )}
                                </span>{" "}

                                from{" "}

                                <span className="font-bold">
                                    {agreement.customer.fullName}
                                </span>{" "}

                                against installment agreement{" "}

                                <span className="font-mono font-semibold">
                                    {agreement.id}
                                </span>
                                .

                                {isCompleted ? (
                                    <>
                                        {" "}
                                        This payment has fully
                                        settled the agreement and
                                        no further balance remains.
                                    </>
                                ) : (
                                    <>
                                        {" "}
                                        The remaining balance after
                                        this payment is{" "}

                                        <span className="font-bold">
                                            Rs.{" "}
                                            {formatAmount(
                                                remainingBalance
                                            )}
                                        </span>
                                        .
                                    </>
                                )}

                            </p>

                        </div>


                        {/* =================================================
                            SIGNATURES
                        ================================================= */}

                        <div
                            className="
                                grid
                                grid-cols-3
                                gap-8
                                text-center
                                text-[10px]
                                avoid-break
                            "
                        >

                            <div>

                                <div className="h-7 border-b border-black mb-1 w-4/5 mx-auto" />

                                <p className="font-semibold">
                                    Customer Signature
                                </p>

                            </div>

                            <div>

                                <div className="h-7 border-b border-black mb-1 w-4/5 mx-auto" />

                                <p className="font-semibold">
                                    Guarantor Signature
                                </p>

                            </div>

                            <div>

                                <div className="h-7 border-b border-black mb-1 w-4/5 mx-auto" />

                                <p className="font-semibold">
                                    Authorized Representative
                                </p>

                            </div>

                        </div>


                        {/* =================================================
                            FOOTER
                        ================================================= */}

                        <div
                            className="
                                text-center
                                mt-5
                                pt-2
                                border-t
                                border-slate-200
                            "
                        >

                            <p className="text-[8px] text-slate-400">
                                This is a computer-generated payment receipt.
                            </p>

                            <p className="text-[8px] text-slate-400 mt-0.5">
                                Thank you for your payment.
                            </p>

                        </div>

                    </div>

                </div>

            </div>
        </>
    );
}