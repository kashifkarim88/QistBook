import { prisma } from "@/lib/prisma";
import {
    PhoneCall,
    UserCheck,
    CheckCircle2,
    Bike,
    Smartphone,
    Banknote
} from "lucide-react";

export const revalidate = 0;

export default async function DashboardPage() {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    // 1. Fetch Active Agreements Count
    const activeAgreementsCount = await prisma.installmentAgreement.count({
        where: { status: "ACTIVE" },
    });

    // 2. Fetch Active Agreements with Latest Payment Status
    const activeAgreements = await prisma.installmentAgreement.findMany({
        where: { status: "ACTIVE" },
        include: {
            customer: {
                include: { guarantors: true },
            },
            bike: true,
            mobile: true,
            payments: {
                orderBy: { createdAt: "desc" },
                take: 1,
            },
        },
    });

    const activeWithDues = activeAgreements.filter(
        (agr) => agr.payments[0] && agr.payments[0].remainingBalance > 0
    );

    const totalOutstanding = activeWithDues.reduce(
        (acc, agr) => acc + agr.payments[0].remainingBalance,
        0
    );

    const callsDueToday = activeWithDues.filter(
        (agr) => new Date(agr.payments[0].nextDueDate) <= today
    );

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* HEADER */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                    Dashboard Overview
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Monitor active installment agreements, collections due today, and phone call lists.
                </p>
            </div>

            {/* SUMMARY STATS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Active Contracts
                        </p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{activeAgreementsCount}</p>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                        <UserCheck className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Calls Due Today
                        </p>
                        <p className="text-2xl font-bold text-amber-600 mt-1">{callsDueToday.length}</p>
                    </div>
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
                        <PhoneCall className="w-6 h-6" />
                    </div>
                </div>

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

            {/* CALLS DUE TODAY QUEUE */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                            <PhoneCall className="w-4 h-4 text-amber-500" />
                            Installment Calling Queue ({callsDueToday.length})
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Clients whose monthly installments are due today or overdue.
                        </p>
                    </div>
                </div>

                {callsDueToday.length === 0 ? (
                    <div className="p-12 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                        <h3 className="text-base font-semibold text-slate-800">All Caught Up!</h3>
                        <p className="text-xs text-slate-500 mt-1">
                            No installment payments are due for calls today.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-700">
                            <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold border-y border-slate-200">
                                <tr>
                                    <th className="py-3 px-4">Customer</th>
                                    <th className="py-3 px-4">Guarantor</th>
                                    <th className="py-3 px-4">Item</th>
                                    <th className="py-3 px-4">Remaining Balance</th>
                                    <th className="py-3 px-4">Due Date</th>
                                    <th className="py-3 px-4 text-right">Call Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {callsDueToday.map((item) => {
                                    const latestPayment = item.payments[0];
                                    const primaryGuarantor = item.customer.guarantors[0];

                                    return (
                                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="py-3.5 px-4 font-semibold text-slate-900">
                                                <div>{item.customer.fullName}</div>
                                                <div className="text-xs font-normal text-slate-500">{item.customer.phone}</div>
                                            </td>

                                            <td className="py-3.5 px-4">
                                                {primaryGuarantor ? (
                                                    <div>
                                                        <div className="text-slate-800 font-medium">{primaryGuarantor.fullName}</div>
                                                        <div className="text-xs text-slate-500">{primaryGuarantor.phone}</div>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-400">N/A</span>
                                                )}
                                            </td>

                                            <td className="py-3.5 px-4 font-medium text-slate-800">
                                                {item.category === "BIKE" && item.bike ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="p-1 bg-blue-50 rounded text-blue-600 border border-blue-100">
                                                            <Bike className="w-3.5 h-3.5" />
                                                        </span>
                                                        <span>{item.bike.brand} {item.bike.model}</span>
                                                    </div>
                                                ) : item.mobile ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="p-1 bg-indigo-50 rounded text-indigo-600 border border-indigo-100">
                                                            <Smartphone className="w-3.5 h-3.5" />
                                                        </span>
                                                        <span>{item.mobile.brand} {item.mobile.model}</span>
                                                    </div>
                                                ) : null}
                                            </td>

                                            <td className="py-3.5 px-4 font-semibold text-emerald-600">
                                                PKR {latestPayment.remainingBalance.toLocaleString()}
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                                    {new Date(latestPayment.nextDueDate).toLocaleDateString()}
                                                </span>
                                            </td>

                                            <td className="py-3.5 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <a
                                                        href={`tel:${item.customer.phone}`}
                                                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                                                    >
                                                        <PhoneCall className="w-3 h-3" />
                                                        Client
                                                    </a>

                                                    {primaryGuarantor && (
                                                        <a
                                                            href={`tel:${primaryGuarantor.phone}`}
                                                            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-200 shadow-sm"
                                                        >
                                                            <PhoneCall className="w-3 h-3 text-slate-500" />
                                                            Guarantor
                                                        </a>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}