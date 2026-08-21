"use client";

import { useState, useActionState } from "react";
import { createSaleAction } from "@/app/actions/sales";
import {
    User,
    ShieldCheck,
    Bike,
    Smartphone,
    Calculator,
    AlertCircle,
    ArrowLeft,
    Calendar
} from "lucide-react";
import Link from "next/link";

export default function NewSalePage() {
    const [state, formAction, isPending] = useActionState(createSaleAction, null);
    const [category, setCategory] = useState<"BIKE" | "MOBILE">("BIKE");

    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [advancePaid, setAdvancePaid] = useState<number>(0);
    const remainingDues = Math.max(0, totalAmount - advancePaid);

    // Default to today's date (YYYY-MM-DD format for HTML date inputs)
    const todayStr = new Date().toISOString().split("T")[0];
    const [saleDate, setSaleDate] = useState<string>(todayStr);

    // Default next installment to 1 month from selected sale date
    const getDefaultNextDueDate = (baseDateStr: string) => {
        if (!baseDateStr) return "";
        const date = new Date(baseDateStr);
        date.setMonth(date.getMonth() + 1);
        return date.toISOString().split("T")[0];
    };

    const [nextDueDate, setNextDueDate] = useState<string>(getDefaultNextDueDate(todayStr));

    // Automatically update Next Due Date when Sale Date changes
    const handleSaleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        setSaleDate(newDate);
        setNextDueDate(getDefaultNextDueDate(newDate));
    };

    return (
        // SINGLE FORM WRAPPER (NO OTHER <form> TAGS INSIDE)
        <form action={formAction} className="max-w-5xl mx-auto space-y-6 pb-12">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <Link
                        href="/dashboard"
                        className="text-xs font-semibold text-slate-500 hover:text-slate-800 inline-flex items-center gap-1 mb-2 transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">New Installment Sale</h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Register a new client, guarantor, and generate the installment contract.
                    </p>
                </div>
            </div>

            {state?.error && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
                    <span>{state.error}</span>
                </div>
            )}

            {/* SECTION 1: CUSTOMER DETAILS */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-5 border-b border-slate-100 pb-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <User className="w-5 h-5" />
                    </div>
                    <h2 className="text-base font-bold text-slate-800">Customer Personal Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Name *</label>
                        <input
                            type="text"
                            name="fullName"
                            required
                            placeholder="e.g. Muhammad Ali"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Father Name *</label>
                        <input
                            type="text"
                            name="fatherName"
                            required
                            placeholder="e.g. Tariq Khan"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Phone Number *</label>
                        <input
                            type="text"
                            name="phone"
                            required
                            placeholder="0300-1234567"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">CNIC Number *</label>
                        <input
                            type="text"
                            name="cnic"
                            required
                            placeholder="17301-1234567-1"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Residential Address *</label>
                        <input
                            type="text"
                            name="address"
                            required
                            placeholder="House #, Street, City"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* SECTION 2: GUARANTOR DETAILS */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-5 border-b border-slate-100 pb-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h2 className="text-base font-bold text-slate-800">Guarantor Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Guarantor Name *</label>
                        <input
                            type="text"
                            name="guarantorName"
                            required
                            placeholder="e.g. Asad Umar"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Guarantor CNIC *</label>
                        <input
                            type="text"
                            name="guarantorCnic"
                            required
                            placeholder="17301-9876543-2"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Guarantor Phone *</label>
                        <input
                            type="text"
                            name="guarantorPhone"
                            required
                            placeholder="0333-7654321"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* SECTION 3: PRODUCT DETAILS */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                            {category === "BIKE" ? <Bike className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
                        </div>
                        <h2 className="text-base font-bold text-slate-800">Item Details</h2>
                    </div>

                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button
                            type="button"
                            onClick={() => setCategory("BIKE")}
                            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${category === "BIKE"
                                ? "bg-white text-emerald-600 shadow-sm"
                                : "text-slate-500 hover:text-slate-800"
                                }`}
                        >
                            <Bike className="w-3.5 h-3.5" /> Motor Bike
                        </button>

                        <button
                            type="button"
                            onClick={() => setCategory("MOBILE")}
                            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${category === "MOBILE"
                                ? "bg-white text-emerald-600 shadow-sm"
                                : "text-slate-500 hover:text-slate-800"
                                }`}
                        >
                            <Smartphone className="w-3.5 h-3.5" /> Mobile Phone
                        </button>
                    </div>
                </div>

                <input type="hidden" name="category" value={category} />

                {category === "BIKE" ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Bike Brand *</label>
                            <input
                                type="text"
                                name="brand"
                                required
                                placeholder="Honda, Zimco, Yamaha"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Model *</label>
                            <input
                                type="text"
                                name="model"
                                required
                                placeholder="CG 125, CD 70"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Color</label>
                            <input
                                type="text"
                                name="color"
                                placeholder="Red, Black"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Engine Number *</label>
                            <input
                                type="text"
                                name="engineNumber"
                                required
                                placeholder="ENG-99887766"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Chassis Number *</label>
                            <input
                                type="text"
                                name="chassisNumber"
                                required
                                placeholder="CHS-11223344"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Company / Brand *</label>
                            <input
                                type="text"
                                name="brand"
                                required
                                placeholder="Samsung, Oppo, Vivo, Apple"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Mobile Model *</label>
                            <input
                                type="text"
                                name="model"
                                required
                                placeholder="Galaxy S24, Reno 10"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1.5">IMEI 1 *</label>
                            <input
                                type="text"
                                name="imei1"
                                required
                                placeholder="864201041234567"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1.5">IMEI 2 (Optional)</label>
                            <input
                                type="text"
                                name="imei2"
                                placeholder="864201047654321"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* SECTION 4: FINANCIAL BREAKDOWN & SCHEDULE (LIGHT THEME) */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                        <Calculator className="w-5 h-5" />
                    </div>
                    <h2 className="text-base font-bold text-slate-800">Agreement & Financial Schedule</h2>
                </div>

                {/* DATES ROW */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Sale / Agreement Date *
                        </label>
                        <input
                            type="date"
                            name="createdAt"
                            required
                            value={saleDate}
                            onChange={handleSaleDateChange}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all [color-scheme:light]"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-emerald-600" /> First Installment Due Date *
                        </label>
                        <input
                            type="date"
                            name="nextDueDate"
                            required
                            value={nextDueDate}
                            onChange={(e) => setNextDueDate(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all [color-scheme:light]"
                        />
                    </div>
                </div>

                {/* AMOUNTS ROW */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Total Agreed Price (PKR) *</label>
                        <input
                            type="number"
                            name="totalAmount"
                            required
                            min="0"
                            placeholder="e.g. 130000"
                            value={totalAmount || ""}
                            onChange={(e) => setTotalAmount(parseFloat(e.target.value) || 0)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 text-lg font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Advance Received (PKR) *</label>
                        <input
                            type="number"
                            name="advancePaid"
                            required
                            min="0"
                            placeholder="e.g. 30000"
                            value={advancePaid || ""}
                            onChange={(e) => setAdvancePaid(parseFloat(e.target.value) || 0)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-emerald-600 text-lg font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Calculated Remaining Balance</label>
                        <div className="w-full bg-amber-50/60 border border-amber-200/80 rounded-lg p-2.5 text-amber-700 text-lg font-bold">
                            PKR {remainingDues.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="flex justify-end pt-2">
                <button
                    type="submit"
                    disabled={isPending}
                    className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                    {isPending ? "Generating Contract..." : "Complete & Save Agreement"}
                </button>
            </div>
        </form>
    );
}