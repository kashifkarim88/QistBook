import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    User,
    Phone,
    CreditCard,
    Package,
    ShieldCheck,
    Receipt,
    Wallet,
} from "lucide-react";
import PaymentForm from "./PaymentForm";

type PageProps = {
    params: Promise<{
        agreementId: string;
    }>;
};

export default async function CollectPaymentPage({ params }: PageProps) {
    const { agreementId } = await params;

    const agreement = await prisma.installmentAgreement.findUnique({
        where: {
            id: agreementId,
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
                orderBy: {
                    createdAt: "desc",
                },
                take: 1,
            },
        },
    });

    if (!agreement) {
        notFound();
    }

    const latestPayment = agreement.payments[0];

    /*
     * Current remaining balance
     */
    const remainingBalance = Number(
        latestPayment?.remainingBalance ?? agreement.totalAmount
    );

    /*
     * Today's payment date
     */
    const paymentDate = new Date();

    /*
     * Next installment = 30 days from today
     */
    const nextDueDate = new Date(paymentDate);
    nextDueDate.setDate(nextDueDate.getDate() + 30);

    const formattedPaymentDate = paymentDate.toLocaleDateString("en-PK", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    const formattedNextDueDate = nextDueDate.toLocaleDateString("en-PK", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    const monthlyInstallment = Number(
        latestPayment?.monthlyInstallment ?? 0
    );

    const primaryGuarantor = agreement.customer.guarantors[0];

    return (
        <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto space-y-6">

                {/* =================================================
            HEADER
        ================================================== */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-sm transition"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900">
                            Collect Payment
                        </h1>
                        <p className="text-xs text-slate-500 font-medium">
                            Record a new installment payment
                        </p>
                    </div>
                </div>

                {/* =================================================
            BALANCE STATS GRID
        ================================================== */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                Total Contract
                            </p>
                            <p className="text-xl font-extrabold text-slate-900 mt-1">
                                PKR {Number(agreement.totalAmount).toLocaleString()}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                            <Receipt className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-2xl p-5 shadow-sm text-white flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                                Remaining Balance
                            </p>
                            <p className="text-xl font-extrabold mt-1 text-emerald-400">
                                PKR {remainingBalance.toLocaleString()}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400">
                            <Wallet className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* =================================================
            CUSTOMER & GUARANTOR INFO (COMBINED)
        ================================================== */}
                <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-100">

                    {/* Main Customer Details */}
                    <div className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <User className="w-4 h-4 text-blue-600" />
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Customer Details
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <p className="text-xs text-slate-400 font-medium">Full Name</p>
                                <p className="text-sm font-semibold text-slate-900 mt-0.5">
                                    {agreement.customer.fullName}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400 font-medium">Phone Number</p>
                                <p className="text-sm font-semibold text-slate-800 mt-0.5 flex items-center gap-1.5">
                                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                                    {agreement.customer.phone}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400 font-medium">CNIC</p>
                                <p className="text-sm font-semibold text-slate-800 mt-0.5 flex items-center gap-1.5">
                                    <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                                    {agreement.customer.cnic}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
                            <Package className="w-4 h-4 text-slate-400" />
                            <span className="text-xs text-slate-500 font-medium">Category:</span>
                            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                                {agreement.category}
                            </span>
                        </div>
                    </div>

                    {/* Guarantor Details */}
                    {primaryGuarantor && (
                        <div className="p-6 bg-slate-50/50">
                            <div className="flex items-center gap-2 mb-4">
                                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    Guarantor Details
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-xs text-slate-400 font-medium">Name</p>
                                    <p className="text-sm font-semibold text-slate-900 mt-0.5">
                                        {primaryGuarantor.fullName}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-400 font-medium">Phone Number</p>
                                    <p className="text-sm font-semibold text-slate-800 mt-0.5 flex items-center gap-1.5">
                                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                                        {primaryGuarantor.phone}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-400 font-medium">CNIC</p>
                                    <p className="text-sm font-semibold text-slate-800 mt-0.5 flex items-center gap-1.5">
                                        <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                                        {primaryGuarantor.cnic}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* =================================================
            PAYMENT FORM CONTAINER
        ================================================== */}
                <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6">
                    <div className="mb-6">
                        <h2 className="text-base font-bold text-slate-900">
                            Payment Entry
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Enter the amount received from the customer to update their balance.
                        </p>
                    </div>

                    <PaymentForm
                        agreementId={agreement.id}
                        remainingBalance={remainingBalance}
                        monthlyInstallment={monthlyInstallment}
                        paymentDate={formattedPaymentDate}
                        nextDueDate={formattedNextDueDate}
                    />
                </div>

            </div>
        </div>
    );
}