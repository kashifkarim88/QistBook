import { prisma } from "@/lib/prisma";
import { getClientsDueToday } from "@/app/actions/duesToday";
import InstallmentDueTable from "./InstallmentDueTable";
import {
    PhoneCall,
    UserCheck,
    CheckCircle2,
    Banknote,
} from "lucide-react";

export const revalidate = 0;

export default async function DashboardPage() {
    // 1. Fetch active agreements count
    const activeAgreementsCount = await prisma.installmentAgreement.count({
        where: {
            status: "ACTIVE",
        },
    });

    // 2. Fetch installments that are due today / overdue
    const callsDueToday = await getClientsDueToday();

    // 3. Fetch active agreements with their latest payment
    const activeAgreements = await prisma.installmentAgreement.findMany({
        where: {
            status: "ACTIVE",
        },
        include: {
            payments: {
                orderBy: {
                    createdAt: "desc",
                },
                take: 1,
            },
        },
    });

    // 4. Calculate total outstanding balance
    const totalOutstanding = activeAgreements.reduce((acc, agr) => {
        const latestPayment = agr.payments[0];

        return acc + Number(latestPayment?.remainingBalance || 0);
    }, 0);

    return (
        <div className="space-y-8 max-w-7xl mx-auto">

            {/* =====================================================
                HEADER
            ====================================================== */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                    Dashboard Overview
                </h1>

                <p className="text-sm text-slate-500 mt-1">
                    Monitor active installment agreements, collections due today,
                    and phone call lists.
                </p>
            </div>


            {/* =====================================================
                SUMMARY STATS
            ====================================================== */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

                {/* Active Contracts */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Active Contracts
                        </p>

                        <p className="text-2xl font-bold text-slate-900 mt-1">
                            {activeAgreementsCount}
                        </p>
                    </div>

                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                        <UserCheck className="w-6 h-6" />
                    </div>
                </div>


                {/* Calls Due Today */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Calls Due Today
                        </p>

                        <p className="text-2xl font-bold text-amber-600 mt-1">
                            {callsDueToday.length}
                        </p>
                    </div>

                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
                        <PhoneCall className="w-6 h-6" />
                    </div>
                </div>


                {/* Total Outstanding */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Total Outstanding
                        </p>

                        <p className="text-2xl font-bold text-emerald-600 mt-1">
                            PKR {totalOutstanding.toLocaleString()}
                        </p>
                    </div>

                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                        <Banknote className="w-6 h-6" />
                    </div>
                </div>

            </div>


            {/* =====================================================
                INSTALLMENT CALLING QUEUE
            ====================================================== */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

                {/* Queue Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                            <PhoneCall className="w-4 h-4 text-amber-500" />

                            Installment Calling Queue (
                            {callsDueToday.length}
                            )
                        </h2>

                        <p className="text-xs text-slate-500 mt-0.5">
                            Clients whose monthly installments are due today or overdue.
                        </p>
                    </div>
                </div>


                {/* =================================================
                    NO PAYMENTS DUE
                ================================================== */}
                {callsDueToday.length === 0 ? (

                    <div className="p-12 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">

                        <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />

                        <h3 className="text-base font-semibold text-slate-800">
                            All Caught Up!
                        </h3>

                        <p className="text-xs text-slate-500 mt-1">
                            No installment payments are due for calls today.
                        </p>

                    </div>

                ) : (

                    /* =================================================
                       INSTALLMENT TABLE
                    ================================================== */
                    <InstallmentDueTable
                        callsDueToday={callsDueToday}
                    />

                )}

            </div>
        </div>
    );
}