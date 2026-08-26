"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
    Phone,
    Banknote,
    CalendarDays,
    User,
    ArrowRight,
    Search,
    X,
} from "lucide-react";

type Props = {
    callsDueToday: any[];
};

export default function InstallmentDueTable({
    callsDueToday,
}: Props) {
    const [search, setSearch] = useState("");

    /* =====================================================
       FILTER CUSTOMERS
    ===================================================== */

    const filteredCustomers = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return callsDueToday;
        }

        return callsDueToday.filter((agreement) => {
            const customerName =
                agreement.customer?.fullName?.toLowerCase() ?? "";

            const customerPhone =
                agreement.customer?.phone?.toLowerCase() ?? "";

            return (
                customerName.includes(query) ||
                customerPhone.includes(query)
            );
        });
    }, [callsDueToday, search]);

    /* =====================================================
       FORMAT DATE
    ===================================================== */

    const formatDate = (date: Date | null) => {
        if (!date) return "N/A";

        return date.toLocaleDateString("en-PK", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="w-full min-w-0">

            {/* =====================================================
                SEARCH BAR
            ===================================================== */}

            <div className="mb-4 w-full">
                <div className="relative w-full">

                    {/* Search Icon */}

                    <Search
                        className="
                            pointer-events-none
                            absolute
                            left-3
                            top-1/2
                            h-4
                            w-4
                            -translate-y-1/2
                            text-slate-400
                        "
                    />

                    {/* Input */}

                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder="Search customer name or phone number..."
                        className="
                            h-11
                            w-full
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            pl-10
                            pr-10
                            text-sm
                            text-slate-700
                            outline-none
                            transition
                            placeholder:text-slate-400
                            focus:border-emerald-500
                            focus:ring-2
                            focus:ring-emerald-100
                        "
                    />

                    {/* Clear Button */}

                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch("")}
                            aria-label="Clear search"
                            className="
                                absolute
                                right-3
                                top-1/2
                                flex
                                h-6
                                w-6
                                -translate-y-1/2
                                items-center
                                justify-center
                                rounded-full
                                text-slate-400
                                transition
                                hover:bg-slate-100
                                hover:text-slate-600
                            "
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Search Result Count */}

                <div className="mt-2 flex items-center justify-between gap-3 px-1">

                    <p className="text-xs text-slate-400">
                        {search ? (
                            <>
                                Showing{" "}
                                <span className="font-semibold text-slate-600">
                                    {filteredCustomers.length}
                                </span>{" "}
                                of{" "}
                                <span className="font-semibold text-slate-600">
                                    {callsDueToday.length}
                                </span>{" "}
                                customers
                            </>
                        ) : (
                            <>
                                <span className="font-semibold text-slate-600">
                                    {callsDueToday.length}
                                </span>{" "}
                                customers due today
                            </>
                        )}
                    </p>

                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch("")}
                            className="
                                shrink-0
                                text-xs
                                font-medium
                                text-emerald-600
                                hover:text-emerald-700
                            "
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* =====================================================
                NO SEARCH RESULTS
            ===================================================== */}

            {search && filteredCustomers.length === 0 ? (
                <div
                    className="
                        rounded-xl
                        border
                        border-dashed
                        border-slate-300
                        bg-white
                        px-4
                        py-10
                        text-center
                    "
                >
                    <div
                        className="
                            mx-auto
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-full
                            bg-slate-100
                        "
                    >
                        <Search className="h-5 w-5 text-slate-400" />
                    </div>

                    <p className="mt-3 text-sm font-semibold text-slate-700">
                        No customer found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                        Try searching with a different name or phone
                        number.
                    </p>

                    <button
                        type="button"
                        onClick={() => setSearch("")}
                        className="
                            mt-4
                            rounded-lg
                            bg-emerald-600
                            px-4
                            py-2
                            text-xs
                            font-semibold
                            text-white
                            transition
                            hover:bg-emerald-700
                        "
                    >
                        Clear Search
                    </button>
                </div>
            ) : (
                <>
                    {/* =================================================
                        MOBILE VIEW
                    ================================================= */}

                    <div className="space-y-3 sm:hidden">

                        {filteredCustomers.map((agreement) => {
                            const latestPayment =
                                agreement.payments?.[0];

                            const customerName =
                                agreement.customer?.fullName ??
                                "Unknown Customer";

                            const customerPhone =
                                agreement.customer?.phone ??
                                "N/A";

                            const remainingBalance = Number(
                                latestPayment?.remainingBalance ?? 0
                            );

                            const nextDueDate =
                                latestPayment?.nextDueDate
                                    ? new Date(
                                        latestPayment.nextDueDate
                                    )
                                    : null;

                            return (
                                <div
                                    key={agreement.id}
                                    className="
                                        w-full
                                        overflow-hidden
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-white
                                        p-4
                                        shadow-sm
                                        transition
                                        hover:shadow-md
                                    "
                                >
                                    {/* CUSTOMER HEADER */}

                                    <div className="flex min-w-0 items-center justify-between gap-3">

                                        <div className="flex min-w-0 items-center gap-3">

                                            <div
                                                className="
                                                    flex
                                                    h-10
                                                    w-10
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-full
                                                    bg-slate-100
                                                    text-slate-500
                                                "
                                            >
                                                <User className="h-5 w-5" />
                                            </div>

                                            <div className="min-w-0">

                                                <p className="truncate text-sm font-semibold text-slate-800">
                                                    {customerName}
                                                </p>

                                                <div className="mt-0.5 flex min-w-0 items-center gap-1.5 text-xs text-slate-500">

                                                    <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />

                                                    <span className="truncate">
                                                        {customerPhone}
                                                    </span>

                                                </div>
                                            </div>
                                        </div>

                                        <ArrowRight
                                            className="
                                                h-4
                                                w-4
                                                shrink-0
                                                text-slate-300
                                            "
                                        />
                                    </div>

                                    {/* DETAILS */}

                                    <div
                                        className="
                                            mt-4
                                            grid
                                            grid-cols-2
                                            gap-3
                                            border-t
                                            border-slate-100
                                            pt-4
                                        "
                                    >

                                        {/* Due Date */}

                                        <div className="min-w-0">

                                            <div className="flex items-center gap-1.5">

                                                <CalendarDays
                                                    className="
                                                        h-3.5
                                                        w-3.5
                                                        shrink-0
                                                        text-slate-400
                                                    "
                                                />

                                                <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                                                    Due Date
                                                </span>
                                            </div>

                                            <p className="mt-1 truncate text-xs font-semibold text-slate-700">
                                                {formatDate(
                                                    nextDueDate
                                                )}
                                            </p>
                                        </div>

                                        {/* Remaining */}

                                        <div className="min-w-0">

                                            <div className="flex items-center gap-1.5">

                                                <Banknote
                                                    className="
                                                        h-3.5
                                                        w-3.5
                                                        shrink-0
                                                        text-emerald-500
                                                    "
                                                />

                                                <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                                                    Remaining
                                                </span>
                                            </div>

                                            <p className="mt-1 truncate text-sm font-bold text-emerald-600">
                                                PKR{" "}
                                                {remainingBalance.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    {/* ACTION */}

                                    <Link
                                        href={`/collect-payment/${agreement.id}`}
                                        className="
                                            mt-4
                                            flex
                                            w-full
                                            items-center
                                            justify-center
                                            gap-2
                                            rounded-lg
                                            bg-emerald-600
                                            px-4
                                            py-2.5
                                            text-xs
                                            font-semibold
                                            text-white
                                            transition-colors
                                            hover:bg-emerald-700
                                            active:bg-emerald-800
                                        "
                                    >
                                        <Banknote className="h-4 w-4" />

                                        Collect Payment
                                    </Link>
                                </div>
                            );
                        })}
                    </div>

                    {/* =================================================
                        TABLET / DESKTOP VIEW
                    ================================================= */}

                    <div className="hidden overflow-hidden rounded-xl border border-slate-200 sm:block">

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[700px] text-sm">

                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50 text-left">

                                        <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase text-slate-500 lg:px-5">
                                            Customer
                                        </th>

                                        <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase text-slate-500 lg:px-5">
                                            Phone
                                        </th>

                                        <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase text-slate-500 lg:px-5">
                                            Due Date
                                        </th>

                                        <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase text-slate-500 lg:px-5">
                                            Remaining
                                        </th>

                                        <th className="whitespace-nowrap px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500 lg:px-5">
                                            Action
                                        </th>

                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100 bg-white">

                                    {filteredCustomers.map(
                                        (agreement) => {

                                            const latestPayment =
                                                agreement.payments?.[0];

                                            const customerName =
                                                agreement.customer
                                                    ?.fullName ??
                                                "Unknown Customer";

                                            const customerPhone =
                                                agreement.customer
                                                    ?.phone ??
                                                "N/A";

                                            const remainingBalance =
                                                Number(
                                                    latestPayment
                                                        ?.remainingBalance ??
                                                    0
                                                );

                                            const nextDueDate =
                                                latestPayment
                                                    ?.nextDueDate
                                                    ? new Date(
                                                        latestPayment.nextDueDate
                                                    )
                                                    : null;

                                            return (
                                                <tr
                                                    key={agreement.id}
                                                    className="
                                                        transition-colors
                                                        hover:bg-slate-50
                                                    "
                                                >

                                                    {/* CUSTOMER */}

                                                    <td className="max-w-[220px] px-4 py-4 lg:px-5">

                                                        <div className="flex min-w-0 items-center gap-3">

                                                            <div
                                                                className="
                                                                    flex
                                                                    h-9
                                                                    w-9
                                                                    shrink-0
                                                                    items-center
                                                                    justify-center
                                                                    rounded-full
                                                                    bg-slate-100
                                                                "
                                                            >
                                                                <User
                                                                    className="
                                                                        h-4
                                                                        w-4
                                                                        text-slate-500
                                                                    "
                                                                />
                                                            </div>

                                                            <div className="min-w-0">

                                                                <p className="truncate font-semibold text-slate-800">
                                                                    {customerName}
                                                                </p>

                                                            </div>

                                                        </div>

                                                    </td>

                                                    {/* PHONE */}

                                                    <td className="max-w-[180px] px-4 py-4 lg:px-5">

                                                        <div className="flex min-w-0 items-center gap-2 text-slate-600">

                                                            <Phone className="h-4 w-4 shrink-0 text-slate-400" />

                                                            <span className="truncate">
                                                                {customerPhone}
                                                            </span>

                                                        </div>

                                                    </td>

                                                    {/* DUE DATE */}

                                                    <td className="whitespace-nowrap px-4 py-4 lg:px-5">

                                                        <div className="flex items-center gap-2 text-slate-600">

                                                            <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />

                                                            <span>
                                                                {formatDate(
                                                                    nextDueDate
                                                                )}
                                                            </span>

                                                        </div>

                                                    </td>

                                                    {/* REMAINING */}

                                                    <td className="whitespace-nowrap px-4 py-4 lg:px-5">

                                                        <div className="flex items-center gap-2 font-semibold text-emerald-600">

                                                            <Banknote className="h-4 w-4 shrink-0" />

                                                            <span>
                                                                PKR{" "}
                                                                {remainingBalance.toLocaleString()}
                                                            </span>

                                                        </div>

                                                    </td>

                                                    {/* ACTION */}

                                                    <td className="px-4 py-4 text-right lg:px-5">

                                                        <Link
                                                            href={`/collect-payment/${agreement.id}`}
                                                            className="
                                                                inline-flex
                                                                items-center
                                                                justify-center
                                                                gap-2
                                                                whitespace-nowrap
                                                                rounded-lg
                                                                bg-emerald-600
                                                                px-4
                                                                py-2
                                                                text-xs
                                                                font-semibold
                                                                text-white
                                                                transition-colors
                                                                hover:bg-emerald-700
                                                            "
                                                        >

                                                            <Banknote className="h-4 w-4" />

                                                            <span>
                                                                Collect Payment
                                                            </span>

                                                        </Link>

                                                    </td>

                                                </tr>
                                            );
                                        }
                                    )}

                                </tbody>
                            </table>

                        </div>
                    </div>
                </>
            )}

            {/* =====================================================
                NO DATA AT ALL
            ===================================================== */}

            {!search && callsDueToday.length === 0 && (
                <div
                    className="
                        mt-3
                        rounded-xl
                        border
                        border-dashed
                        border-slate-300
                        bg-white
                        px-4
                        py-8
                        text-center
                    "
                >

                    <div
                        className="
                            mx-auto
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-full
                            bg-slate-100
                        "
                    >
                        <CalendarDays className="h-5 w-5 text-slate-400" />
                    </div>

                    <p className="mt-3 text-sm font-semibold text-slate-700">
                        No payments due today
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                        Customers with installments due today will
                        appear here.
                    </p>

                </div>
            )}
        </div>
    );
}