"use client";

import { useState } from "react";
import {
    Banknote,
    CalendarDays,
    CheckCircle2,
    ArrowRight,
} from "lucide-react";
import { recordInstallmentPayment } from "@/app/actions/payments";

type Props = {
    agreementId: string;
    remainingBalance: number;
    monthlyInstallment: number;
    paymentDate: string;
    nextDueDate: string;
};

export default function PaymentForm({
    agreementId,
    remainingBalance,
    monthlyInstallment,
    paymentDate,
    nextDueDate,
}: Props) {
    const [amount, setAmount] = useState(
        monthlyInstallment > 0
            ? String(monthlyInstallment)
            : ""
    );

    const paymentAmount = Number(amount) || 0;

    const newBalance = Math.max(
        0,
        remainingBalance - paymentAmount
    );

    const isFullPayment =
        paymentAmount > 0 &&
        paymentAmount >= remainingBalance;

    const isInvalid =
        paymentAmount > remainingBalance;

    return (
        <form
            action={recordInstallmentPayment}
            className="space-y-6"
        >
            <input
                type="hidden"
                name="agreementId"
                value={agreementId}
            />

            {/* =====================================================
                PAYMENT DATE
            ====================================================== */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <CalendarDays className="w-4 h-4 text-slate-500" />

                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Payment Date
                        </span>
                    </div>

                    <p className="text-lg font-bold text-slate-900">
                        {paymentDate}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                        Today
                    </p>
                </div>


                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <CalendarDays className="w-4 h-4 text-emerald-600" />

                        <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                            Next Due Date
                        </span>
                    </div>

                    <p className="text-lg font-bold text-emerald-700">
                        {nextDueDate}
                    </p>

                    <p className="text-xs text-emerald-600 mt-1">
                        30 days after payment
                    </p>
                </div>

            </div>


            {/* =====================================================
                PAYMENT INPUT
            ====================================================== */}

            <div>

                <label
                    htmlFor="amount"
                    className="block text-sm font-semibold text-slate-800 mb-2"
                >
                    Payment Amount
                </label>

                <div className="relative">

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
                        PKR
                    </span>

                    <input
                        id="amount"
                        name="amount"
                        type="number"
                        min="1"
                        max={remainingBalance}
                        step="1"
                        value={amount}
                        onChange={(e) =>
                            setAmount(e.target.value)
                        }
                        placeholder="Enter amount"
                        className="w-full rounded-xl border border-slate-300 bg-white py-4 pl-14 pr-4 text-xl font-bold text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        required
                    />

                </div>

                {isInvalid && (
                    <p className="text-sm text-red-600 mt-2">
                        Payment cannot be greater than the remaining balance.
                    </p>
                )}

            </div>


            {/* =====================================================
                LIVE BALANCE CALCULATION
            ====================================================== */}

            <div className="rounded-2xl border border-slate-200 overflow-hidden">

                <div className="px-5 py-4 bg-slate-50 border-b border-slate-200">
                    <p className="text-sm font-semibold text-slate-700">
                        Payment Summary
                    </p>
                </div>


                <div className="p-5 space-y-4">

                    {/* Current Balance */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">
                            Current Balance
                        </span>

                        <span className="font-semibold text-slate-900">
                            PKR {remainingBalance.toLocaleString()}
                        </span>
                    </div>


                    {/* Payment */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">
                            Payment
                        </span>

                        <span className="font-semibold text-emerald-600">
                            - PKR {paymentAmount.toLocaleString()}
                        </span>
                    </div>


                    <div className="border-t border-slate-200" />


                    {/* New Balance */}
                    <div className="flex items-center justify-between">

                        <span className="text-sm font-bold text-slate-800">
                            Remaining After Payment
                        </span>

                        <span
                            className={`text-xl font-bold ${newBalance === 0
                                ? "text-emerald-600"
                                : "text-slate-900"
                                }`}
                        >
                            PKR {newBalance.toLocaleString()}
                        </span>

                    </div>

                </div>

            </div>


            {/* =====================================================
                COMPLETION MESSAGE
            ====================================================== */}

            {isFullPayment && !isInvalid && (
                <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">

                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />

                    <div>
                        <p className="text-sm font-semibold text-emerald-800">
                            Agreement will be fully paid
                        </p>

                        <p className="text-xs text-emerald-700 mt-1">
                            This payment will clear the remaining balance
                            and complete the agreement.
                        </p>
                    </div>

                </div>
            )}


            {/* =====================================================
                RECORD PAYMENT BUTTON
            ====================================================== */}

            <button
                type="submit"
                disabled={
                    paymentAmount <= 0 ||
                    isInvalid
                }
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
                <Banknote className="w-5 h-5" />

                {isFullPayment
                    ? "Complete Payment"
                    : "Record Payment"}

                <ArrowRight className="w-4 h-4" />
            </button>

        </form>
    );
}