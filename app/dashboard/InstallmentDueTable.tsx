import Link from "next/link";
import { Phone, Banknote, CalendarDays } from "lucide-react";

type Props = {
    callsDueToday: any[];
};

export default function InstallmentDueTable({
    callsDueToday,
}: Props) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-slate-200 text-left">
                        <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                            Customer
                        </th>

                        <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                            Phone
                        </th>

                        <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                            Due Date
                        </th>

                        <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                            Remaining
                        </th>

                        <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-right">
                            Action
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {callsDueToday.map((agreement) => {
                        const latestPayment = agreement.payments?.[0];

                        const customerName =
                            agreement.customer?.fullName ?? "Unknown Customer";

                        const customerPhone =
                            agreement.customer?.phone ?? "N/A";

                        const remainingBalance = Number(
                            latestPayment?.remainingBalance ?? 0
                        );

                        const nextDueDate = latestPayment?.nextDueDate
                            ? new Date(latestPayment.nextDueDate)
                            : null;

                        return (
                            <tr
                                key={agreement.id}
                                className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                            >
                                {/* Customer */}
                                <td className="px-4 py-4">
                                    <div className="font-semibold text-slate-800">
                                        {customerName}
                                    </div>
                                </td>

                                {/* Phone */}
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Phone className="w-4 h-4 text-slate-400" />
                                        {customerPhone}
                                    </div>
                                </td>

                                {/* Due Date */}
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <CalendarDays className="w-4 h-4 text-slate-400" />

                                        {nextDueDate
                                            ? nextDueDate.toLocaleDateString(
                                                "en-PK",
                                                {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                }
                                            )
                                            : "N/A"}
                                    </div>
                                </td>

                                {/* Remaining Balance */}
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-2 font-semibold text-emerald-600">
                                        <Banknote className="w-4 h-4" />

                                        PKR{" "}
                                        {remainingBalance.toLocaleString()}
                                    </div>
                                </td>

                                {/* Action */}
                                <td className="px-4 py-4 text-right">
                                    <Link
                                        href={`/collect-payment/${agreement.id}`}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors"
                                    >
                                        <Banknote className="w-4 h-4" />

                                        Collect Payment
                                    </Link>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}